// 1.30: consejos de la despensa (carrusel), sacar de la lista de compras lo que falta para el plan y categorías propias
// (F-13, también en un Postgres de verdad con la actualización 23).
import { beforeAll, describe, expect, it } from 'vitest'
import { foodsTodos } from '../../scripts/seed-sexta.mjs'
import { consejosDe, consejosPara, CONSEJOS_POR_CATEGORIA } from '../../src/lib/consejos.js'
import { consejoDe } from '../../src/lib/despensa.js'
import { aplicarQuitadas } from '../../src/lib/comprasQuitadas.js'
import { conCategorias, cuantosPorCategoria, errorNombre, listaCategorias, ordenDe } from '../../src/lib/categorias.js'
import { CATEGORIAS } from '../../src/lib/nutricion.js'
import { abrirBase, ANA, BETO, fallo } from './postgres.js'

const alimentos = foodsTodos.map((f, i) => ({ id: `f${i}`, slug: f[0], name: f[1], unit: f[2], category: f[9] }))
const fila = (a, extra = {}) => ({ a, qty: 1, ...extra })

describe('consejos de la despensa', () => {
  it('casi todo lo de la base tiene algún consejo', () => {
    const sin = alimentos.filter((a) => consejosDe(a).guardar.length + consejosDe(a).aprovechar.length === 0)
    expect(sin.length / alimentos.length).toBeLessThan(0.05)
  })
  it('todas las categorías de siempre tienen un consejo (salvo "Otros")', () => {
    for (const c of CATEGORIAS.filter((x) => x !== 'Otros')) expect(CONSEJOS_POR_CATEGORIA[c]?.guardar?.length, c).toBeGreaterThan(0)
  })
  it('reconoce por el nombre, sin tildes ni mayúsculas', () => {
    expect(consejosDe({ name: 'Espinacas baby', category: 'Verduras' }).guardar[0]).toMatch(/papel absorbente/)
    expect(consejosDe({ name: 'BRÓCOLI', category: 'Verduras' }).aprovechar[0]).toMatch(/[Bb]lanqueado/)
    expect(consejosDe({ name: 'Arroz largo fino Aliada', category: 'Pastas y arroz' }).guardar[0]).toMatch(/frasco/)
    // el de siempre sigue andando
    expect(consejoDe({ name: 'Espinacas baby', category: 'Verduras' })).toMatch(/papel absorbente/)
  })
  it('el carrusel pone primero lo que vence, sin repetir, uno por alimento y con tope', () => {
    const banana = { id: 'b', name: 'Banana', category: 'Frutas' }
    const leche = { id: 'l', name: 'Leche entera', category: 'Lácteos' }
    const arroz = { id: 'a', name: 'Arroz', category: 'Pastas y arroz' }
    const fideos = { id: 'f', name: 'Fideos', category: 'Pastas y arroz' }
    const filas = [
      fila(arroz),
      fila(leche, { estado: { nivel: 'urgente', dias: 1, texto: 'Vence mañana' } }),
      fila(banana, { estado: { nivel: 'pronto', dias: 5 } }),
      fila(fideos),
      fila({ id: 'v', name: 'Vencido', category: 'Lácteos' }, { qty: 0 }),
    ]
    const c = consejosPara(filas, { hoy: '2026-10-24' })
    expect(c[0]).toMatchObject({ tipo: 'vence', alimento: leche })
    expect(c[1]).toMatchObject({ tipo: 'vence', alimento: banana })
    expect(new Set(c.map((x) => x.texto)).size).toBe(c.length)
    expect(c.some((x) => x.alimento?.id === 'v')).toBe(false)
    expect(consejosPara(filas, { hoy: '2026-10-24', maximo: 2 })).toHaveLength(2)
    // Arroz y fideos comparten consejos: no se repite el texto
    const deArroz = c.filter((x) => x.alimento && ['a', 'f'].includes(x.alimento.id))
    expect(new Set(deArroz.map((x) => x.texto)).size).toBe(deArroz.length)
  })
  it('rota cada día y, con la despensa vacía, da consejos generales', () => {
    const filas = alimentos.slice(0, 40).map((a) => fila(a))
    const a = consejosPara(filas, { hoy: '2026-10-24' }).map((x) => x.id)
    const b = consejosPara(filas, { hoy: '2026-10-25' }).map((x) => x.id)
    expect(a).not.toEqual(b)
    const vacia = consejosPara([], { hoy: '2026-10-24' })
    expect(vacia.length).toBeGreaterThan(0)
    expect(vacia.every((x) => x.tipo === 'general')).toBe(true)
  })
})

describe('lista de compras: sacar lo que falta para el plan', () => {
  const a = (id) => ({ id, name: id })
  it('lo sacado no se ve, salvo que el plan pida más', () => {
    const delPlan = [
      { a: a('x'), qty: 200 },
      { a: a('y'), qty: 3 },
    ]
    const r = aplicarQuitadas(delPlan, { x: 200, y: 2 })
    expect(r.visibles.map((v) => v.a.id)).toEqual(['y'])
    expect(r.quitados.map((v) => v.a.id)).toEqual(['x'])
    expect(r.vigentes).toEqual({ x: 200 })
  })
  it('lo que ya no falta se olvida', () => {
    expect(aplicarQuitadas([{ a: a('x'), qty: 100 }], { z: 50 }).vigentes).toEqual({})
    expect(aplicarQuitadas([], {}).visibles).toEqual([])
  })
})

describe('categorías propias', () => {
  const propias = [
    { nombre: 'Para el mate', created_at: '2026-10-02' },
    { nombre: 'Bebé', created_at: '2026-10-01' },
  ]
  it('van entre las de siempre y "Otros", en el orden en que se crearon', () => {
    const l = listaCategorias(propias)
    expect(l.slice(-3)).toEqual(['Bebé', 'Para el mate', 'Otros'])
    const orden = ordenDe(l)
    expect(orden('Carnes y huevos')).toBe(0)
    expect(orden('Bebé')).toBeLessThan(orden('Otros'))
    expect(orden('Desconocida')).toBe(l.length)
  })
  it('valida el nombre', () => {
    expect(errorNombre('', propias)).toMatch(/nombre/)
    expect(errorNombre('lácteos', propias)).toMatch(/Ya existe/)
    expect(errorNombre('para el MATE', propias)).toMatch(/Ya tenés/)
    expect(errorNombre('Para el mate ', propias, 'Para el mate')).toBeNull()
    expect(errorNombre('x'.repeat(31), propias)).toMatch(/30/)
    expect(
      errorNombre(
        'Nueva',
        Array.from({ length: 30 }, (_, i) => ({ nombre: `c${i}` })),
      ),
    ).toMatch(/hasta 30/)
  })
  it('la categoría elegida cambia solo lo de esa persona y guarda la de siempre', () => {
    const lista = [
      { id: '1', name: 'Yerba', category: 'Despensa' },
      { id: '2', name: 'Pan', category: 'Panadería' },
    ]
    const r = conCategorias(lista, new Map([['1', 'Para el mate']]))
    expect(r[0]).toMatchObject({ category: 'Para el mate', categoria_base: 'Despensa' })
    expect(r[1]).toBe(lista[1])
    expect(conCategorias(lista, new Map())).toBe(lista)
    expect(cuantosPorCategoria(r).get('Para el mate')).toBe(1)
  })

  describe('en la base (actualizacion-23.sql)', () => {
    let b
    beforeAll(async () => {
      b = await abrirBase()
    }, 60000)
    it('crear, mover, renombrar y borrar', async () => {
      const yerba = (await b.una("select id from public.foods where owner is null and slug like 'yerba%' limit 1")).id
      const propio = await b.como(ANA, async () => {
        await b.db.query("insert into public.categorias (nombre) values ('Para el mate')")
        await b.db.query("insert into public.categoria_alimento (food_id, categoria) values ($1, 'Para el mate')", [yerba])
        return (
          await b.una(
            "insert into public.foods (owner, name, unit, kcal, category) values (auth.uid(), 'Bizcochitos de grasa', 'g', 450, 'Para el mate') returning id",
          )
        ).id
      })
      // Otra persona no ve nada de esto
      expect(await b.como(BETO, () => b.filas('select * from public.categorias'))).toEqual([])
      expect(await b.como(BETO, () => b.filas('select * from public.categoria_alimento'))).toEqual([])
      // Nombre repetido (sin importar mayúsculas)
      expect(await b.como(ANA, () => fallo(b.db.query("insert into public.categorias (nombre) values ('para el MATE')")))).toMatch(
        /duplicate|unique/,
      )
      // Renombrar se lleva todo
      await b.como(ANA, () => b.rpc('renombrar_categoria', ['Para el mate', 'Matecito']))
      expect((await b.una('select category from public.foods where id = $1', [propio])).category).toBe('Matecito')
      expect((await b.una('select categoria from public.categoria_alimento where food_id = $1', [yerba])).categoria).toBe('Matecito')
      expect(await b.como(ANA, () => fallo(b.rpc('renombrar_categoria', ['No existe', 'X'])))).toMatch(/no existe/)
      // Borrar: lo propio pasa a Otros, lo de la base vuelve a su categoría
      await b.como(ANA, () => b.rpc('borrar_categoria', ['Matecito', 'Otros']))
      expect((await b.una('select category from public.foods where id = $1', [propio])).category).toBe('Otros')
      expect(await b.filas('select * from public.categoria_alimento where food_id = $1', [yerba])).toEqual([])
      expect(await b.filas("select * from public.categorias where nombre = 'Matecito'")).toEqual([])
    })
  })
})

// ---------- F-22: traer entrenamientos ----------
const { leerGpx, leerTcx, leerArchivo, slugDeDeporte, desnivelPositivo, prepararImportacion, datosDeEntreno, fechaLocal } =
  await import('../../src/lib/importarEntrenos.js')

// Una vuelta de ~1 km hacia el norte en 6 minutos, subiendo 20 m, con pulso
const GPX = `<?xml version="1.0"?>
<gpx version="1.1" creator="Garmin Connect" xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1">
  <trk><name><![CDATA[Fondo del domingo]]></name><type>running</type><trkseg>
${Array.from({ length: 7 }, (_, i) => `    <trkpt lat="${(-31.4 + i * 0.0015).toFixed(5)}" lon="-64.18"><ele>${400 + i * 4 - (i === 3 ? 6 : 0)}</ele><time>2026-10-18T12:${String(i).padStart(2, '0')}:00Z</time><extensions><gpxtpx:TrackPointExtension><gpxtpx:hr>${140 + i}</gpxtpx:hr></gpxtpx:TrackPointExtension></extensions></trkpt>`).join('\n')}
  </trkseg></trk>
</gpx>`

const TCX = `<?xml version="1.0" encoding="UTF-8"?>
<TrainingCenterDatabase xmlns="http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2">
  <Activities>
    <Activity Sport="Biking">
      <Id>2026-10-19T10:00:00.000Z</Id>
      <Lap StartTime="2026-10-19T10:00:00.000Z">
        <TotalTimeSeconds>1800</TotalTimeSeconds><DistanceMeters>12000</DistanceMeters><Calories>320</Calories>
        <AverageHeartRateBpm><Value>130</Value></AverageHeartRateBpm>
        <Track><Trackpoint><Time>2026-10-19T10:00:00.000Z</Time><AltitudeMeters>500</AltitudeMeters></Trackpoint></Track>
      </Lap>
      <Lap StartTime="2026-10-19T10:30:00.000Z">
        <TotalTimeSeconds>1200</TotalTimeSeconds><DistanceMeters>8000</DistanceMeters><Calories>200</Calories>
        <AverageHeartRateBpm><Value>150</Value></AverageHeartRateBpm>
      </Lap>
    </Activity>
  </Activities>
</TrainingCenterDatabase>`

describe('F-22: archivos de relojes y apps', () => {
  it('lee un GPX: duración, distancia, desnivel y pulso', () => {
    const [a] = leerGpx(GPX, 'fondo.gpx')
    expect(a).toMatchObject({ origen: 'archivo', nombre: 'Fondo del domingo', deporte: 'running', minutos: 6, pulso: 143 })
    expect(a.distanciaKm).toBeGreaterThan(0.95)
    expect(a.distanciaKm).toBeLessThan(1.05)
    expect(a.desnivelM).toBeGreaterThan(10)
    expect(a.inicio).toBe('2026-10-18T12:00:00.000Z')
  })
  it('lee un TCX con varias vueltas (suma tiempo, distancia y calorías; pulso ponderado)', () => {
    const [a] = leerTcx(TCX)
    expect(a).toMatchObject({ deporte: 'Biking', minutos: 50, distanciaKm: 20, kcal: 520, pulso: 138 })
  })
  it('reconoce el tipo de archivo por el contenido y no se rompe con cualquier cosa', () => {
    expect(leerArchivo(TCX, 'x.xml')).toHaveLength(1)
    expect(leerArchivo(GPX, 'sin-extension')).toHaveLength(1)
    expect(leerArchivo('hola', 'nada.txt')).toEqual([])
    expect(leerArchivo('<gpx></gpx>', 'vacio.gpx')).toEqual([])
  })
  it('el desnivel ignora el ruido del GPS', () => {
    expect(desnivelPositivo([100, 101, 100, 101, 100, 101, 100])).toBeLessThan(2)
    expect(desnivelPositivo([100, 110, 120, 130, 140])).toBe(40)
  })
  it('cruza el deporte con las actividades', () => {
    expect(slugDeDeporte('Running')).toBe('correr')
    expect(slugDeDeporte('TrailRun')).toBe('trail')
    expect(slugDeDeporte('VirtualRide')).toBe('bici-fija')
    expect(slugDeDeporte('Biking')).toBe('bici-ruta')
    expect(slugDeDeporte('MountainBikeRide')).toBe('bici-montana')
    expect(slugDeDeporte('Swim')).toBe('natacion')
    expect(slugDeDeporte('WeightTraining')).toBe('pesas')
    expect(slugDeDeporte('', 'Caminata por el parque')).toBe('caminar')
    expect(slugDeDeporte('Other', 'xyz')).toBeNull()
  })
  it('marca lo que ya estaba y arma los datos del entrenamiento', () => {
    const catalogo = [
      { id: 't-correr', slug: 'correr', name: 'Correr' },
      { id: 't-otra', slug: 'otra', name: 'Otra actividad' },
    ]
    const [a] = leerGpx(GPX)
    const ya = [{ fecha: fechaLocal(a.inicio), type_id: 't-correr', duration_min: 7, notes: '' }]
    const [x] = prepararImportacion([a], { catalogo, entrenamientos: ya })
    expect(x.tipo.id).toBe('t-correr')
    expect(x.repetida).toBe(true)
    expect(prepararImportacion([a], { catalogo, entrenamientos: [] })[0].repetida).toBe(false)
    const datos = datosDeEntreno(a, x.tipo)
    expect(datos).toMatchObject({ tipo: x.tipo, minutos: 6, pulso: 143, reloj: '', relojActivas: true })
    expect(datos.nombre).toBeUndefined()
    expect(datos.notas).toContain(a.ref)
    // Con la referencia en las notas, se reconoce aunque cambie la duración
    expect(prepararImportacion([a], { catalogo, entrenamientos: [{ fecha: '2020-01-01', notes: datos.notas }] })[0].repetida).toBe(true)
    // Sin actividad conocida: "Otra", con el nombre del archivo
    const otra = datosDeEntreno({ ...a, nombre: 'Algo raro' }, catalogo[1])
    expect(otra.nombre).toBe('Algo raro')
  })
})

describe('F-23: recordatorio de pesarse', async () => {
  const { recordatoriosAhora, RECORDATORIOS_INICIAL } = await import('../../src/lib/ayuno.js')
  const { avisosPara, limpiarConfig } = await import('../../supabase/functions/recordatorios-push/logica.ts')
  const config = { ...RECORDATORIOS_INICIAL, activo: true, comidasOn: {}, ayuno: false, peso: true, pesoDia: 1, pesoHora: '08:00' }
  const lunes = '2026-10-26'
  const enLaApp = (min, extra = {}) =>
    recordatoriosAhora({ config, ahora: new Date(2026, 9, 26, Math.floor(min / 60), min % 60), fecha: lunes, ...extra })
  it('avisa el día y la hora elegidos, hasta 2 horas después', () => {
    expect(enLaApp(7 * 60 + 59)).toEqual([])
    expect(enLaApp(8 * 60 + 30)).toMatchObject([{ id: 'peso', ruta: '/perfil' }])
    expect(enLaApp(10 * 60 + 1)).toEqual([])
  })
  it('no avisa si ya se pesó, si ya avisó, ni otro día', () => {
    expect(enLaApp(8 * 60 + 30, { pesadoHoy: true })).toEqual([])
    expect(enLaApp(8 * 60 + 30, { yaAvisados: new Set([`${lunes}|peso`]) })).toEqual([])
    expect(recordatoriosAhora({ config, ahora: new Date(2026, 9, 27, 8, 30), fecha: '2026-10-27' })).toEqual([])
  })
  it('el servidor da lo mismo', () => {
    for (const min of [400, 480, 510, 600, 700])
      for (const pesadoHoy of [false, true])
        expect(avisosPara({ config: limpiarConfig(config), min, fecha: lunes, pesadoHoy })).toEqual(enLaApp(min, { pesadoHoy }))
    expect(limpiarConfig({ peso: 1, pesoDia: 9, pesoHora: 'x' })).toMatchObject({ peso: true, pesoDia: 1, pesoHora: '08:00' })
  })
})

// ---------- F-22b: archivos FIT ----------
const { leerFit } = await import('../../src/lib/fit.js')
const { default: FitParser } = await import('fit-file-parser')

// Arma un .fit mínimo, como los que graban los relojes: encabezado, definición y datos de "session", y el CRC
const TABLA_CRC = [
  0x0000, 0xcc01, 0xd801, 0x1400, 0xf001, 0x3c00, 0x2800, 0xe401, 0xa001, 0x6c00, 0x7800, 0xb401, 0x5000, 0x9c01, 0x8801, 0x4400,
]
function crcFit(bytes) {
  let crc = 0
  for (const b of bytes) {
    let t = TABLA_CRC[crc & 0xf]
    crc = ((crc >> 4) & 0x0fff) ^ t ^ TABLA_CRC[b & 0xf]
    t = TABLA_CRC[crc & 0xf]
    crc = ((crc >> 4) & 0x0fff) ^ t ^ TABLA_CRC[(b >> 4) & 0xf]
  }
  return crc
}
function armarFit(sesiones) {
  const campos = [
    [2, 4, 0x86],
    [5, 1, 0x00],
    [6, 1, 0x00],
    [7, 4, 0x86],
    [8, 4, 0x86],
    [9, 4, 0x86],
    [11, 2, 0x84],
    [16, 1, 0x02],
    [22, 2, 0x84],
  ]
  const datos = []
  // Definición (local 0, mensaje global 18 = session), little endian
  datos.push(0x40, 0, 0, 18, 0, campos.length)
  for (const c of campos) datos.push(...c)
  for (const s of sesiones) {
    datos.push(0x00)
    const valores = [s.inicio, s.deporte, s.sub ?? 0, s.seg * 1000, s.seg * 1000, s.metros * 100, s.kcal, s.pulso, s.subida]
    campos.forEach(([, tam], i) => {
      for (let k = 0; k < tam; k++) datos.push((valores[i] >>> (8 * k)) & 0xff)
    })
  }
  const enc = [14, 0x20, 0x08, 0x08, ...[0, 1, 2, 3].map((k) => (datos.length >>> (8 * k)) & 0xff), 0x2e, 0x46, 0x49, 0x54, 0, 0]
  const todo = [...enc, ...datos]
  const crc = crcFit(todo)
  return new Uint8Array([...todo, crc & 0xff, crc >> 8])
}
const desdeEpocaFit = (iso) => Date.parse(iso) / 1000 - 631065600

describe('F-22b: archivos FIT', () => {
  const carrera = { inicio: desdeEpocaFit('2026-10-21T10:00:00Z'), deporte: 1, seg: 2700, metros: 7450, kcal: 512, pulso: 154, subida: 85 }
  const bici = {
    inicio: desdeEpocaFit('2026-10-21T11:00:00Z'),
    deporte: 2,
    sub: 6,
    seg: 1800,
    metros: 15000,
    kcal: 300,
    pulso: 128,
    subida: 0,
  }
  it('lee las sesiones: inicio, deporte, duración, distancia, calorías, pulso y desnivel', () => {
    const [a, b] = leerFit(armarFit([carrera, bici]), 'Garmin_123.fit')
    expect(a).toEqual({
      origen: 'archivo',
      ref: `fit-${Date.parse('2026-10-21T10:00:00Z')}`,
      nombre: 'Garmin_123',
      deporte: 'running',
      inicio: '2026-10-21T10:00:00.000Z',
      minutos: 45,
      distanciaKm: 7.45,
      desnivelM: 85,
      pulso: 154,
      kcal: 512,
    })
    expect(b).toMatchObject({ deporte: 'indoor cycling', minutos: 30, distanciaKm: 15, desnivelM: null })
    expect(slugDeDeporte(a.deporte)).toBe('correr')
    expect(slugDeDeporte(b.deporte)).toBe('bici-fija')
  })
  it('da lo mismo que una librería de FIT conocida (fit-file-parser)', async () => {
    const archivo = armarFit([carrera])
    const otra = await new FitParser({ force: true, mode: 'list', lengthUnit: 'm' }).parseAsync(Buffer.from(archivo))
    const s = otra.sessions[0]
    const [mia] = leerFit(archivo)
    expect(new Date(s.start_time).toISOString()).toBe(mia.inicio)
    expect(s.sport).toBe('running')
    expect(Math.round(s.total_timer_time / 60)).toBe(mia.minutos)
    expect(Math.round(s.total_distance) / 1000).toBeCloseTo(mia.distanciaKm, 2)
    expect(s.total_calories).toBe(mia.kcal)
    expect(s.avg_heart_rate).toBe(mia.pulso)
  })
  it('no se rompe con archivos que no son FIT o están cortados', () => {
    expect(leerFit(new Uint8Array([1, 2, 3]))).toEqual([])
    expect(leerFit(new TextEncoder().encode('<gpx></gpx> ...........'))).toEqual([])
    const cortado = armarFit([carrera]).slice(0, 40)
    expect(leerFit(cortado)).toEqual([])
  })
})
