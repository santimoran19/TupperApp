// Buscador de alimentos (base + propios) con opción de crear uno nuevo o traerlo de Open Food Facts.
import { useMemo, useRef, useState } from 'react'
import { Chip, Err, Icono, Numero } from './ui'
import { useDatos } from '../store/Datos'
import { CATEGORIAS, cantidadTexto, redondear, tieneAlcohol } from '../lib/nutricion'
import { buscarProductos } from '../lib/openfoodfacts'
import { anotarEvento } from '../lib/eventos'
import { LIM, errNumero, errTexto, hayErrores } from '../lib/validar'
import { nombreCorto, parecidoEnBase, sonCompatibles, sugerirBase } from '../lib/equivalencias'
import { ALIAS } from '../lib/alias'

const normal = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

// Busca por nombre y también por los otros nombres de cada alimento (marcas, sinónimos): "spaghetti" encuentra "Fideos secos".
// Primero van los que coinciden por nombre.
export function buscarAlimentos(alimentos, texto) {
  const q = normal(texto.trim())
  const alfabetico = (a, b) => a.name.localeCompare(b.name, 'es')
  if (!q) return [...alimentos].sort(alfabetico)
  const porNombre = alimentos.filter((a) => normal(a.name).includes(q))
  const vistos = new Set(porNombre.map((a) => a.id))
  const porAlias = q.length < 3 ? [] : alimentos.filter((a) => !vistos.has(a.id) && (ALIAS[a.slug] || []).some((s) => s.includes(q) || q.includes(s)))
  return [...porNombre.sort(alfabetico), ...porAlias.sort(alfabetico)]
}

const cada100 = (a) => `${redondear(a.kcal)} kcal y ${redondear(a.protein, 1)} g prot. cada 100 ${a.unit === 'ml' ? 'ml' : 'g'}`

// `categoria`: si viene, solo se muestran alimentos de esa categoría (se usa para "Bebidas").
export default function SelectorAlimento({ onElegir, soloConStock = false, categoria = null }) {
  const { alimentos, stockMap, crearAlimento, ingredientes, deLaBase, confirmar, noPreguntar } = useDatos()
  const [texto, setTexto] = useState('')
  const [creando, setCreando] = useState(false)
  const [alcohol, setAlcohol] = useState('todas') // filtro dentro de bebidas: todas | sin | con
  const [off, setOff] = useState(null) // búsqueda en Open Food Facts: { estado, productos }
  const [agregando, setAgregando] = useState(false)
  const bebidas = categoria === 'Bebidas'

  const resultados = useMemo(() => {
    let l = buscarAlimentos(alimentos, texto)
    if (categoria) l = l.filter((a) => a.category === categoria)
    if (bebidas && alcohol !== 'todas') l = l.filter((a) => tieneAlcohol(a) === (alcohol === 'con'))
    if (soloConStock) l = l.filter((a) => (stockMap.get(a.id) || 0) > 0)
    return l.slice(0, 60)
  }, [alimentos, texto, soloConStock, stockMap, categoria, bebidas, alcohol])

  const pedido = useRef(0) // para descartar la respuesta de una búsqueda que ya no es la que se está mirando
  const cambiarTexto = (v) => { setTexto(v.slice(0, LIM.nombre)); pedido.current++; setOff(null) }

  // La búsqueda reintenta sola un rato (ver lib/openfoodfacts): mientras tanto se muestra que sigue buscando
  async function buscarAfuera() {
    const n = ++pedido.current
    setOff({ estado: 'cargando', productos: [], lento: false })
    try {
      const productos = await buscarProductos(texto.trim(), {
        alReintentar: () => { if (pedido.current === n) setOff((s) => s && { ...s, lento: true }) },
        // Se anota cómo salió (sin lo que se buscó) para saber si Open Food Facts está respondiendo
        alTerminar: (como) => anotarEvento('off_busqueda', como),
      })
      if (pedido.current === n) setOff({ estado: 'listo', productos })
    } catch {
      if (pedido.current === n) setOff({ estado: 'error', productos: [] })
    }
  }

  // Un producto de Open Food Facts se guarda como alimento propio y queda elegido
  async function elegirProducto(p) {
    const ya = alimentos.find((a) => normal(a.name) === normal(p.name))
    if (ya) return onElegir(ya)
    // Si se parece a un ingrediente de las recetas, se pregunta si vale por ese
    const unit = bebidas ? 'ml' : p.unit
    const parecido = sugerirBase({ name: p.name, unit, unit_grams: null }, ingredientes, deLaBase)
    const vale = parecido && await confirmar({
      titulo: `¿Cuenta como ${nombreCorto(parecido)} en las recetas?`,
      texto: `Si decís que sí, las recetas que piden ${nombreCorto(parecido).toLowerCase()} van a usar ${p.name}. Lo podés cambiar después en Mis alimentos.`,
      boton: 'Sí', cancelar: 'No', peligro: false,
    })
    setAgregando(true)
    const a = await crearAlimento({
      // La categoría sale del alimento por el que vale o del que más se le parece en la base; si no, de lo que diga Open Food Facts
      name: p.name, unit, category: bebidas ? 'Bebidas' : vale ? parecido.category : parecidoEnBase(p, deLaBase)?.category || p.category,
      unit_grams: null, unit_label: null, kcal: p.kcal, protein: p.protein, carbs: p.carbs, fat: p.fat, alcohol: !!p.alcohol && (bebidas || p.unit === 'ml'),
      same_as: vale ? parecido.id : null,
    })
    setAgregando(false)
    // Si dijo que no, no se vuelve a preguntar desde la despensa
    if (a && parecido && !vale) noPreguntar(a.id)
    if (a) onElegir(a)
  }

  if (creando) {
    return <NuevoAlimento nombreInicial={texto} categoriaInicial={categoria} onListo={(a) => onElegir(a)} onCancelar={() => setCreando(false)} />
  }

  return (
    <div>
      <div className="relative mb-3">
        <Icono n="search" className="absolute left-3.5 top-3.5 text-gris" size={20} />
        <input className="campo pl-11" placeholder={bebidas ? 'Buscar bebida...' : 'Buscar alimento...'} value={texto} onChange={(e) => cambiarTexto(e.target.value)} autoFocus />
      </div>
      {bebidas && (
        <div className="flex gap-2 mb-2">
          {[['todas', 'Todas'], ['sin', 'Sin alcohol'], ['con', 'Con alcohol']].map(([k, t]) => <Chip key={k} activo={alcohol === k} onClick={() => setAlcohol(k)}>{t}</Chip>)}
        </div>
      )}
      <div className="divide-y divide-linea">
        {resultados.map((a) => {
          const hay = stockMap.get(a.id) || 0
          return (
            <button key={a.id} onClick={() => onElegir(a)} className="w-full flex items-center gap-3 py-3 text-left">
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">{a.name}</p>
                <p className="text-xs text-gris">
                  {cada100(a)}
                  {hay > 0 && <span className="text-verde-texto font-semibold"> · tenés {cantidadTexto(a, hay)}</span>}
                </p>
              </div>
              <Icono n="add_circle" className="text-verde-texto" />
            </button>
          )
        })}
      </div>
      {resultados.length === 0 && <p className="text-sm text-gris py-4 text-center">No hay {bebidas ? 'bebidas' : 'alimentos'} con ese nombre.</p>}

      {!soloConStock && texto.trim().length >= 3 && !off && (
        <button onClick={buscarAfuera} className="w-full mt-3 rounded-2xl border border-linea p-3 flex items-center gap-3 text-left">
          <span className="w-10 h-10 rounded-full bg-teal-suave text-teal-oscuro flex items-center justify-center"><Icono n="travel_explore" /></span>
          <span className="flex-1 min-w-0">
            <span className="block text-sm font-semibold truncate">Buscar “{texto.trim()}” en Open Food Facts</span>
            <span className="block text-xs text-gris">Productos de marca con los valores de su etiqueta</span>
          </span>
        </button>
      )}
      {off && (
        <div className="mt-3 rounded-2xl bg-teal-suave p-3">
          <p className="text-[11px] font-bold tracking-wider text-teal-oscuro flex items-center gap-1.5"><Icono n="travel_explore" size={16} /> OPEN FOOD FACTS</p>
          {off.estado === 'cargando' && <p className="text-sm text-gris py-2" role="status">{off.lento ? 'Sigue buscando: Open Food Facts a veces tarda un poco...' : 'Buscando...'}</p>}
          {off.estado === 'error' && (
            <p className="text-sm py-2">Open Food Facts no está respondiendo ahora. Probá de nuevo en un rato o cargalo a mano. <button onClick={buscarAfuera} className="font-semibold text-teal-oscuro underline">Reintentar</button></p>
          )}
          {off.estado === 'listo' && off.productos.length === 0 && <p className="text-sm py-2">No apareció nada con ese nombre. Podés crearlo a mano con los datos de la etiqueta.</p>}
          {off.estado === 'listo' && off.productos.length > 0 && (
            <>
              <div className="divide-y divide-superficie">
                {off.productos.map((p) => (
                  <button key={p.codigo} onClick={() => elegirProducto(p)} disabled={agregando} className="w-full flex items-center gap-3 py-2.5 text-left">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{p.name}</p>
                      <p className="text-xs text-gris">{cada100(p)}{p.detalle ? ` · ${p.detalle}` : ''}</p>
                    </div>
                    <Icono n="add_circle" className="text-teal-oscuro" />
                  </button>
                ))}
              </div>
              <p className="text-xs text-gris mt-1">Datos cargados por la comunidad: si algo no coincide con la etiqueta, crealo a mano.</p>
            </>
          )}
        </div>
      )}

      <button onClick={() => setCreando(true)} className="btn-suave w-full mt-4">
        <Icono n="add" size={20} /> Crear {bebidas ? 'bebida nueva' : 'alimento nuevo'}
      </button>
    </div>
  )
}

// Desplegable para elegir por qué alimento de las recetas vale un producto propio.
// `medida` es { unit, unit_grams } del producto; `propio` es su id cuando ya existe.
// Si otros alimentos ya valen por él no se ofrece nada: las equivalencias no se encadenan.
export function ValePor({ id, medida, propio = null, valor, onChange }) {
  const { ingredientes, equivalentes } = useDatos()
  const opciones = propio && equivalentes.has(propio) ? [] : ingredientes.filter((c) => c.id !== propio && sonCompatibles(medida, c))
  if (opciones.length === 0) return null
  return (
    <div>
      <label className="etiqueta" htmlFor={id}>En las recetas cuenta como</label>
      <select id={id} className="campo" value={opciones.some((c) => c.id === valor) ? valor : ''} onChange={(e) => onChange(e.target.value)}>
        <option value="">Nada: es un alimento aparte</option>
        {opciones.map((c) => <option key={c.id} value={c.id}>{nombreCorto(c)}</option>)}
      </select>
      <p className="text-xs text-gris mt-1.5">Si elegís uno, las recetas que lo piden usan este producto cuando lo tenés.</p>
    </div>
  )
}

// Crear un alimento propio o, si viene `inicial`, editarlo.
export function NuevoAlimento({ nombreInicial = '', categoriaInicial = null, inicial = null, onListo, onCancelar }) {
  const { crearAlimento, actualizarAlimento, ingredientes, equivalentes } = useDatos()
  const [f, setF] = useState(inicial
    ? {
        name: inicial.name, unit: inicial.unit, unit_grams: inicial.unit_grams ?? '', unit_label: inicial.unit_label || 'unidad',
        kcal: String(Number(inicial.kcal)), protein: String(Number(inicial.protein)), carbs: String(Number(inicial.carbs)), fat: String(Number(inicial.fat)),
        category: inicial.category, alcohol: !!inicial.alcohol, same_as: inicial.same_as || '',
      }
    : {
        name: nombreInicial, unit: categoriaInicial === 'Bebidas' ? 'ml' : 'g', unit_grams: '', unit_label: 'unidad',
        kcal: '', protein: '', carbs: '', fat: '', category: categoriaInicial || 'Otros', alcohol: false, same_as: '',
      })
  const [guardando, setGuardando] = useState(false)
  const [intento, setIntento] = useState(false)
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }))

  const errores = {
    name: errTexto(f.name, { max: LIM.nombre }),
    kcal: errNumero(f.kcal, LIM.kcal100),
    protein: errNumero(f.protein, LIM.macro100, { opcional: true }),
    carbs: errNumero(f.carbs, LIM.macro100, { opcional: true }),
    fat: errNumero(f.fat, LIM.macro100, { opcional: true }),
    unit_grams: f.unit === 'u' ? errNumero(f.unit_grams, LIM.gramosUnidad) : null,
    unit_label: f.unit === 'u' ? errTexto(f.unit_label, { max: 20 }) : null,
  }
  // Cada gramo de proteína aporta 4 kcal: no puede haber más proteína que la que entra en esas calorías
  if (!errores.kcal && !errores.protein && Number(f.protein) * 4 > Number(f.kcal) + 10) errores.protein = 'Es mucha proteína para esas calorías: revisá la etiqueta.'
  // 100 g de algo no pueden tener más de 100 g entre proteína, carbohidratos y grasa
  const suma = (Number(f.protein) || 0) + (Number(f.carbs) || 0) + (Number(f.fat) || 0)
  if (!errores.protein && !errores.carbs && !errores.fat && suma > 100.5) errores.fat = 'Proteína, carbohidratos y grasas no pueden sumar más de 100.'
  const ver = (k) => (errores[k] && (intento || f[k] !== '') ? errores[k] : null)

  // El vínculo solo vale si las medidas se pueden pasar de una a otra (y si no hay otros que ya valgan por este)
  const medida = { unit: f.unit, unit_grams: f.unit === 'u' ? Number(f.unit_grams) || 0 : null }
  const destino = f.same_as && !(inicial && equivalentes.has(inicial.id)) ? ingredientes.find((c) => c.id === f.same_as && c.id !== inicial?.id) : null
  const valePor = destino && sonCompatibles(medida, destino) ? destino.id : ''

  async function guardar() {
    setIntento(true)
    if (hayErrores(errores)) return
    setGuardando(true)
    const datos = {
      name: f.name.trim(), unit: f.unit, category: f.category,
      unit_grams: f.unit === 'u' ? Number(f.unit_grams) : null,
      unit_label: f.unit === 'u' ? f.unit_label.trim() : null,
      kcal: Number(f.kcal), protein: Number(f.protein) || 0, carbs: Number(f.carbs) || 0, fat: Number(f.fat) || 0,
      alcohol: f.category === 'Bebidas' && f.alcohol,
      same_as: valePor || null,
    }
    const a = inicial ? await actualizarAlimento(inicial.id, datos) : await crearAlimento(datos)
    setGuardando(false)
    if (a) onListo(a)
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gris">
        {inicial ? 'Los cambios valen de acá en adelante: lo que ya registraste queda como estaba.' : 'Copiá los valores de la etiqueta del producto, cada 100 g o 100 ml. Queda guardado para siempre.'}
      </p>
      <div>
        <label className="etiqueta" htmlFor="na-nombre">Nombre</label>
        <input id="na-nombre" className="campo" maxLength={LIM.nombre} value={f.name} onChange={(e) => set('name')(e.target.value)} placeholder="Ej.: Galletitas de avena" />
        <Err>{ver('name')}</Err>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="etiqueta" htmlFor="na-unidad">Se mide en</label>
          <select id="na-unidad" className="campo" value={f.unit} onChange={(e) => set('unit')(e.target.value)}>
            <option value="g">Gramos</option>
            <option value="ml">Mililitros</option>
            <option value="u">Unidades</option>
          </select>
        </div>
        <div>
          <label className="etiqueta" htmlFor="na-cat">Categoría</label>
          <select id="na-cat" className="campo" value={f.category} onChange={(e) => set('category')(e.target.value)}>
            {[...new Set([...CATEGORIAS, f.category])].map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      {f.unit === 'u' && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="etiqueta" htmlFor="na-etq">Cómo se llama la unidad</label>
            <input id="na-etq" className="campo" maxLength={20} value={f.unit_label} onChange={(e) => set('unit_label')(e.target.value)} placeholder="unidad, lata, rodaja" />
            <Err>{ver('unit_label')}</Err>
          </div>
          <div>
            <label className="etiqueta" htmlFor="na-gr">Gramos por unidad</label>
            <Numero id="na-gr" valor={f.unit_grams} onChange={set('unit_grams')} decimales={1} largo={6} placeholder="Ej.: 30" error={!!ver('unit_grams')} />
            <Err>{ver('unit_grams')}</Err>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="etiqueta" htmlFor="na-kcal">Calorías cada 100</label>
          <Numero id="na-kcal" valor={f.kcal} onChange={set('kcal')} decimales={1} largo={5} placeholder="kcal" error={!!ver('kcal')} />
          <Err>{ver('kcal')}</Err>
        </div>
        <div>
          <label className="etiqueta" htmlFor="na-prot">Proteína cada 100</label>
          <Numero id="na-prot" valor={f.protein} onChange={set('protein')} decimales={1} largo={5} placeholder="g" error={!!ver('protein')} />
          <Err>{ver('protein')}</Err>
        </div>
        <div>
          <label className="etiqueta" htmlFor="na-carb">Carbohidratos (opcional)</label>
          <Numero id="na-carb" valor={f.carbs} onChange={set('carbs')} decimales={1} largo={5} placeholder="g" error={!!ver('carbs')} />
          <Err>{ver('carbs')}</Err>
        </div>
        <div>
          <label className="etiqueta" htmlFor="na-grasa">Grasas (opcional)</label>
          <Numero id="na-grasa" valor={f.fat} onChange={set('fat')} decimales={1} largo={5} placeholder="g" error={!!ver('fat')} />
          <Err>{ver('fat')}</Err>
        </div>
      </div>
      <ValePor id="na-vale" medida={medida} propio={inicial?.id} valor={f.same_as} onChange={set('same_as')} />
      {f.category === 'Bebidas' && (
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" checked={f.alcohol} onChange={(e) => set('alcohol')(e.target.checked)} className="w-5 h-5 accent-verde" />
          Tiene alcohol (no cuenta para el líquido del día)
        </label>
      )}
      <div className="flex gap-2 pt-2">
        <button onClick={onCancelar} className="btn-suave flex-1">Volver</button>
        <button onClick={guardar} disabled={guardando} className="btn-primario flex-1">Guardar</button>
      </div>
    </div>
  )
}
