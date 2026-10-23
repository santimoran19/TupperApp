// Buscador de alimentos (base + propios) con opción de crear uno nuevo o traerlo de Open Food Facts.
import { useEffect, useMemo, useRef, useState } from 'react'
import { Chip, Err, Icono, Numero } from './ui'
import { useDatos } from '../store/Datos'
import { CATEGORIAS, cantidadTexto, redondear, tieneAlcohol } from '../lib/nutricion'
import { buscarPorCodigo, buscarProductos } from '../lib/openfoodfacts'
import { buscarCodigoEnCatalogo, buscarEnCatalogo } from '../lib/catalogo'
import { nombrePorCodigo } from '../lib/preciosclaros'
import { esCodigoDeBarras } from '../lib/codigo'
import Escaner from './Escaner'
import { anotarEvento } from '../lib/eventos'
import { LIM, errNumero, errTexto, hayErrores } from '../lib/validar'
import { nombreCorto, parecidoEnBase, sonCompatibles, sugerirBase } from '../lib/equivalencias'
import { buscarAlimentos, normal } from '../lib/buscar'
import Foto from './Foto'

const cada100 = (a) => `${redondear(a.kcal)} kcal y ${redondear(a.protein, 1)} g prot. cada 100 ${a.unit === 'ml' ? 'ml' : 'g'}`

// `categoria`: si viene, solo se muestran alimentos de esa categoría (se usa para "Bebidas").
export default function SelectorAlimento({ onElegir, soloConStock = false, categoria = null }) {
  const { alimentos, stockMap, crearAlimento, ingredientes, deLaBase, confirmar, noPreguntar } = useDatos()
  const [texto, setTexto] = useState('')
  const [creando, setCreando] = useState(null) // null | { nombre?, codigo?, plantilla? }: el formulario de alimento nuevo
  const [escaneando, setEscaneando] = useState(false)
  const [porCodigo, setPorCodigo] = useState(null) // lo que salió de un código de barras: { estado, codigo, producto?, origen?, nombre? }
  const [delCatalogo, setDelCatalogo] = useState([]) // productos que ya cargaron y confirmaron otras personas
  const [alcohol, setAlcohol] = useState('todas') // filtro dentro de bebidas: todas | sin | con
  const [off, setOff] = useState(null) // búsqueda en Open Food Facts: { estado, productos }
  const [agregando, setAgregando] = useState(false)
  const bebidas = categoria === 'Bebidas'

  const resultados = useMemo(() => {
    let l = buscarAlimentos(alimentos, texto)
    if (categoria) l = l.filter((a) => a.category === categoria)
    if (bebidas && alcohol !== 'todas') l = l.filter((a) => tieneAlcohol(a) === (alcohol === 'con'))
    if (soloConStock) l = l.filter((a) => (stockMap.get(a.id) || 0) > 0)
    return l.slice(0, categoria ? 120 : 60) // dentro de una categoría (bebidas) entran todas
  }, [alimentos, texto, soloConStock, stockMap, categoria, bebidas, alcohol])

  const pedido = useRef(0) // para descartar la respuesta de una búsqueda que ya no es la que se está mirando
  const cambiarTexto = (v) => {
    setTexto(v.slice(0, LIM.nombre))
    pedido.current++
    setOff(null)
    setPorCodigo(null)
  }

  // Mientras se escribe, también se mira el catálogo compartido (productos que cargaron otras personas)
  useEffect(() => {
    const q = texto.trim()
    if (soloConStock || q.length < 3) {
      setDelCatalogo([])
      return
    }
    let vigente = true
    const espera = setTimeout(async () => {
      const r = await buscarEnCatalogo(q)
      if (vigente) setDelCatalogo(r)
    }, 350)
    return () => {
      vigente = false
      clearTimeout(espera)
    }
  }, [texto, soloConStock])
  const productosDelCatalogo = useMemo(() => {
    const propios = new Set(alimentos.map((a) => normal(a.name)))
    return delCatalogo.filter((p) => !propios.has(normal(p.name)) && (!categoria || p.category === categoria))
  }, [delCatalogo, alimentos, categoria])

  // Un código de barras (escaneado o escrito): primero lo que ya cargaste, después el catálogo compartido y por último
  // Open Food Facts. Si no está en ningún lado, se ofrece cargarlo a mano con el código ya puesto.
  async function buscarCodigo(codigo) {
    setEscaneando(false)
    setOff(null)
    const propio = alimentos.find((a) => a.owner && a.codigo === codigo)
    if (propio) {
      anotarEvento('codigo_busqueda', { resultado: 'propio' })
      return onElegir(propio)
    }
    const n = ++pedido.current
    const inicio = Date.now()
    setPorCodigo({ estado: 'buscando', codigo })
    const hallado = await buscarCodigoEnCatalogo(codigo)
    if (pedido.current !== n) return
    if (hallado) {
      anotarEvento('codigo_busqueda', { resultado: 'catalogo', ms: Date.now() - inicio })
      return setPorCodigo({ estado: 'ok', codigo, producto: hallado, origen: 'Catálogo de Tupper' })
    }
    try {
      const r = await buscarPorCodigo(codigo)
      if (pedido.current !== n) return
      // Si Open Food Facts no lo tiene, Precios Claros (datos del Estado) puede saber al menos cómo se llama
      let conocido = null
      if (r.estado === 'no') {
        conocido = await nombrePorCodigo(codigo)
        if (pedido.current !== n) return
      }
      anotarEvento('codigo_busqueda', {
        resultado: r.estado === 'ok' ? 'off' : conocido ? 'nombre' : r.estado,
        ms: Date.now() - inicio,
      })
      setPorCodigo(
        conocido
          ? { estado: 'no', codigo, nombre: conocido.nombre, nombreDe: 'Precios Claros' }
          : { ...r, codigo, origen: 'Open Food Facts' },
      )
    } catch {
      if (pedido.current !== n) return
      anotarEvento('codigo_busqueda', { resultado: 'error', ms: Date.now() - inicio })
      setPorCodigo({ estado: 'error', codigo })
    }
  }

  // La búsqueda reintenta sola un rato (ver lib/openfoodfacts): mientras tanto se muestra que sigue buscando
  async function buscarAfuera() {
    const n = ++pedido.current
    setOff({ estado: 'cargando', productos: [], lento: false })
    try {
      const productos = await buscarProductos(texto.trim(), {
        alReintentar: () => {
          if (pedido.current === n) setOff((s) => s && { ...s, lento: true })
        },
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
    const vale =
      parecido &&
      (await confirmar({
        titulo: `¿Cuenta como ${nombreCorto(parecido)} en las recetas?`,
        texto: `Si decís que sí, las recetas que piden ${nombreCorto(parecido).toLowerCase()} van a usar ${p.name}. Lo podés cambiar después en Mis alimentos.`,
        boton: 'Sí',
        cancelar: 'No',
        peligro: false,
      }))
    setAgregando(true)
    const a = await crearAlimento(
      {
        // La categoría sale del alimento por el que vale o del que más se le parece en la base; si no, de lo que diga Open Food Facts
        name: p.name,
        unit,
        category: bebidas ? 'Bebidas' : vale ? parecido.category : parecidoEnBase(p, deLaBase)?.category || p.category,
        unit_grams: null,
        unit_label: null,
        kcal: p.kcal,
        protein: p.protein,
        carbs: p.carbs,
        fat: p.fat,
        alcohol: !!p.alcohol && (bebidas || p.unit === 'ml'),
        same_as: vale ? parecido.id : null,
        // El código de barras queda en el alimento para encontrarlo la próxima vez que se escanee
        ...(esCodigoDeBarras(p.codigo) ? { codigo: p.codigo } : {}),
      },
      // Si las calorías no venían y se calcularon, no se comparten: el catálogo es de valores que la gente confirmó
      { compartir: !p.calculado, detalle: p.detalle },
    )
    setAgregando(false)
    // Si dijo que no, no se vuelve a preguntar desde la despensa
    if (a && parecido && !vale) noPreguntar(a.id)
    if (a) onElegir(a)
  }

  if (creando) {
    return (
      <NuevoAlimento
        nombreInicial={creando.nombre ?? texto}
        categoriaInicial={categoria}
        codigoInicial={creando.codigo || null}
        plantilla={creando.plantilla || null}
        onListo={(a) => onElegir(a)}
        onCancelar={() => setCreando(null)}
      />
    )
  }

  if (escaneando) return <Escaner onCodigo={buscarCodigo} onVolver={() => setEscaneando(false)} />

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <div className="relative flex-1" data-tour="selector-buscar">
          <Icono n="search" className="absolute left-3.5 top-3.5 text-gris" size={20} />
          <input
            className="campo pl-11"
            placeholder={bebidas ? 'Buscar bebida...' : 'Buscar alimento...'}
            value={texto}
            onChange={(e) => cambiarTexto(e.target.value)}
            autoFocus
          />
        </div>
        {!soloConStock && (
          <button
            onClick={() => {
              setOff(null)
              setPorCodigo(null)
              setEscaneando(true)
            }}
            className="btn-suave shrink-0 px-3.5"
            aria-label="Escanear código de barras"
            title="Escanear código de barras"
          >
            <Icono n="barcode_scanner" size={22} />
          </button>
        )}
      </div>
      {porCodigo && (
        <PorCodigo
          estado={porCodigo}
          ocupado={agregando}
          onElegir={elegirProducto}
          onManual={() => setCreando({ nombre: porCodigo.nombre || '', codigo: porCodigo.codigo })}
          alimentos={alimentos}
          onParecido={(plantilla) => {
            anotarEvento('codigo_aproximado', { resultado: porCodigo.estado })
            setCreando({ nombre: porCodigo.nombre || '', codigo: porCodigo.codigo, plantilla })
          }}
          onOtro={() => setEscaneando(true)}
          onReintentar={() => buscarCodigo(porCodigo.codigo)}
        />
      )}
      {bebidas && (
        <div className="flex gap-2 mb-2">
          {[
            ['todas', 'Todas'],
            ['sin', 'Sin alcohol'],
            ['con', 'Con alcohol'],
          ].map(([k, t]) => (
            <Chip key={k} activo={alcohol === k} onClick={() => setAlcohol(k)}>
              {t}
            </Chip>
          ))}
        </div>
      )}
      <div className="divide-y divide-linea">
        {resultados.map((a) => {
          const hay = stockMap.get(a.id) || 0
          return (
            <button key={a.id} onClick={() => onElegir(a)} className="w-full flex items-center gap-3 py-3 text-left">
              <Foto ruta={a.image_path} categoria={a.category} className="w-10 h-10 rounded-xl" icono={20} />
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
      {resultados.length === 0 && (
        <p className="text-sm text-gris py-4 text-center">No hay {bebidas ? 'bebidas' : 'alimentos'} con ese nombre.</p>
      )}

      {productosDelCatalogo.length > 0 && (
        <div className="mt-3 rounded-2xl bg-teal-suave p-3">
          <p className="text-[11px] font-bold tracking-wider text-teal-oscuro flex items-center gap-1.5">
            <Icono n="group" size={16} /> CARGADOS POR OTRAS PERSONAS
          </p>
          <div className="divide-y divide-superficie">
            {productosDelCatalogo.map((p) => (
              <button
                key={p.codigo}
                onClick={() => elegirProducto(p)}
                disabled={agregando}
                className="w-full flex items-center gap-3 py-2.5 text-left"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-xs text-gris">
                    {cada100(p)}
                    {p.detalle ? ` · ${p.detalle}` : ''}
                  </p>
                </div>
                <Icono n="add_circle" className="text-teal-oscuro" />
              </button>
            ))}
          </div>
          <p className="text-xs text-gris mt-1">
            Los confirmaron al menos dos personas. Si algo no coincide con la etiqueta, crealo a mano.
          </p>
        </div>
      )}

      {!soloConStock && texto.trim().length >= 3 && !off && (
        <button onClick={buscarAfuera} className="w-full mt-3 rounded-2xl border border-linea p-3 flex items-center gap-3 text-left">
          <span className="w-10 h-10 rounded-full bg-teal-suave text-teal-oscuro flex items-center justify-center">
            <Icono n="travel_explore" />
          </span>
          <span className="flex-1 min-w-0">
            <span className="block text-sm font-semibold truncate">Buscar “{texto.trim()}” en Open Food Facts</span>
            <span className="block text-xs text-gris">Productos de marca con los valores de su etiqueta</span>
          </span>
        </button>
      )}
      {off && (
        <div className="mt-3 rounded-2xl bg-teal-suave p-3">
          <p className="text-[11px] font-bold tracking-wider text-teal-oscuro flex items-center gap-1.5">
            <Icono n="travel_explore" size={16} /> OPEN FOOD FACTS
          </p>
          {off.estado === 'cargando' && (
            <p className="text-sm text-gris py-2" role="status">
              {off.lento ? 'Sigue buscando: Open Food Facts a veces tarda un poco...' : 'Buscando...'}
            </p>
          )}
          {off.estado === 'error' && (
            <p className="text-sm py-2">
              Open Food Facts no está respondiendo ahora. Probá de nuevo en un rato o cargalo a mano.{' '}
              <button onClick={buscarAfuera} className="font-semibold text-teal-oscuro underline">
                Reintentar
              </button>
            </p>
          )}
          {off.estado === 'listo' && off.productos.length === 0 && (
            <p className="text-sm py-2">No apareció nada con ese nombre. Podés crearlo a mano con los datos de la etiqueta.</p>
          )}
          {off.estado === 'listo' && off.productos.length > 0 && (
            <>
              <div className="divide-y divide-superficie">
                {off.productos.map((p) => (
                  <button
                    key={p.codigo}
                    onClick={() => elegirProducto(p)}
                    disabled={agregando}
                    className="w-full flex items-center gap-3 py-2.5 text-left"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{p.name}</p>
                      <p className="text-xs text-gris">
                        {cada100(p)}
                        {p.detalle ? ` · ${p.detalle}` : ''}
                      </p>
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

      <button onClick={() => setCreando({})} className="btn-suave w-full mt-4" data-tour="selector-crear">
        <Icono n="add" size={20} /> Crear {bebidas ? 'bebida nueva' : 'alimento nuevo'}
      </button>
    </div>
  )
}

// Lo que salió de buscar un código de barras
function PorCodigo({ estado: e, ocupado, alimentos, onElegir, onManual, onParecido, onOtro, onReintentar }) {
  const p = e.producto
  return (
    <div className="mb-3 rounded-2xl bg-teal-suave p-3" role="status">
      <p className="text-[11px] font-bold tracking-wider text-teal-oscuro flex items-center gap-1.5">
        <Icono n="barcode_scanner" size={16} /> CÓDIGO {e.codigo}
      </p>
      {e.estado === 'buscando' && <p className="text-sm text-gris py-2">Buscando el producto...</p>}
      {e.estado === 'ok' && p && (
        <>
          <button onClick={() => onElegir(p)} disabled={ocupado} className="w-full flex items-center gap-3 py-2.5 text-left">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{p.name}</p>
              <p className="text-xs text-gris">
                {cada100(p)}
                {p.detalle ? ` · ${p.detalle}` : ''}
              </p>
            </div>
            <Icono n="add_circle" className="text-teal-oscuro" />
          </button>
          {p.calculado && (
            <p className="text-xs text-gris mb-1">
              {e.origen} no tenía las calorías de este producto: las calculamos con sus proteínas, carbohidratos y grasas.
            </p>
          )}
          <p className="text-xs text-gris">
            Viene de {e.origen}: datos cargados por la comunidad. Si algo no coincide con la etiqueta,{' '}
            <button onClick={onManual} className="font-semibold text-teal-oscuro underline">
              cargalo a mano
            </button>
            .
          </p>
        </>
      )}
      {e.estado === 'incompleto' && (
        <p className="text-sm py-2">
          Open Food Facts conoce este producto{e.nombre ? ` (${e.nombre})` : ''}, pero no tiene sus calorías. Cargalo con los datos de la
          etiqueta o partí de un alimento parecido.
        </p>
      )}
      {e.estado === 'no' && !e.nombreDe && (
        <p className="text-sm py-2">
          No encontramos este código en Open Food Facts. Podés cargarlo con los datos de la etiqueta o partir de un alimento parecido.
        </p>
      )}
      {e.estado === 'no' && e.nombreDe && (
        <p className="text-sm py-2">
          Open Food Facts no tiene este producto, pero {e.nombreDe} lo conoce como «{e.nombre}». No hay sus calorías cargadas: partí de un
          alimento parecido o cargalo con los datos de la etiqueta.
        </p>
      )}
      {(e.estado === 'incompleto' || e.estado === 'no') && (
        <Parecidos nombre={e.nombre || ''} alimentos={alimentos} onElegir={onParecido} />
      )}
      {e.estado === 'error' && (
        <p className="text-sm py-2">
          No pudimos consultar Open Food Facts ahora.{' '}
          <button onClick={onReintentar} className="font-semibold text-teal-oscuro underline">
            Reintentar
          </button>
        </p>
      )}
      {e.estado !== 'buscando' && e.estado !== 'ok' && (
        <div className="flex gap-2 mt-1">
          <button onClick={onManual} className="btn-primario flex-1">
            Cargarlo a mano
          </button>
          <button onClick={onOtro} className="btn-suave flex-1">
            Escanear otro
          </button>
        </div>
      )}
    </div>
  )
}

// Cuando el producto no tiene datos en ningún lado: buscar un alimento parecido de la base (atún, miel, puré de tomate...)
// para partir de sus valores. Después se corrigen con la etiqueta.
function Parecidos({ nombre, alimentos, onElegir }) {
  const mejor = useMemo(() => (nombre ? parecidoEnBase({ name: nombre }, alimentos) : null), [nombre, alimentos])
  // Si no hay un parecido claro, se arranca buscando por la primera palabra del nombre ("Atún La Campagnola" -> atún)
  const [q, setQ] = useState(() =>
    mejor || !nombre
      ? ''
      : normal(nombre)
          .replace(/\(.*?\)/g, ' ')
          .split(/\s+/)
          .find((w) => w.length >= 3) || '',
  )
  const lista = useMemo(() => {
    const t = q.trim()
    // El que más se parece al nombre del producto va primero (mientras no se escriba otra cosa que lo deje afuera)
    const primero = mejor && (!t || normal(mejor.name).includes(normal(t))) ? [mejor] : []
    const resto = t ? buscarAlimentos(alimentos, t) : []
    return [...new Map([...primero, ...resto].map((a) => [a.id, a])).values()].slice(0, 5)
  }, [q, mejor, alimentos])
  return (
    <div className="mt-1 mb-2 rounded-xl bg-superficie p-3" data-tour="parecidos">
      <label className="etiqueta" htmlFor="par-buscar">
        Partir de un alimento parecido
      </label>
      <input
        id="par-buscar"
        className="campo"
        placeholder="Ej.: atún, miel, puré de tomate"
        value={q}
        onChange={(e) => setQ(e.target.value.slice(0, LIM.nombre))}
      />
      {lista.length > 0 && (
        <div className="divide-y divide-linea">
          {lista.map((a) => (
            <button key={a.id} onClick={() => onElegir(a)} className="w-full flex items-center gap-3 py-2.5 text-left">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{a.name}</p>
                <p className="text-xs text-gris">{cada100(a)}</p>
              </div>
              <Icono n="add_circle" className="text-teal-oscuro" />
            </button>
          ))}
        </div>
      )}
      {q.trim() && lista.length === 0 && <p className="text-xs text-gris mt-1">No hay nada parecido con ese nombre.</p>}
      <p className="text-xs text-gris mt-1">Usamos sus valores de partida y vos los corregís con la etiqueta.</p>
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
      <label className="etiqueta" htmlFor={id}>
        En las recetas cuenta como
      </label>
      <select
        id={id}
        className="campo"
        value={opciones.some((c) => c.id === valor) ? valor : ''}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Nada: es un alimento aparte</option>
        {opciones.map((c) => (
          <option key={c.id} value={c.id}>
            {nombreCorto(c)}
          </option>
        ))}
      </select>
      <p className="text-xs text-gris mt-1.5">Si elegís uno, las recetas que lo piden usan este producto cuando lo tenés.</p>
    </div>
  )
}

// Crear un alimento propio o, si viene `inicial`, editarlo.
export function NuevoAlimento({
  nombreInicial = '',
  categoriaInicial = null,
  codigoInicial = null,
  plantilla = null,
  inicial = null,
  onListo,
  onCancelar,
}) {
  const { crearAlimento, actualizarAlimento, ingredientes, equivalentes } = useDatos()
  const [f, setF] = useState(
    inicial
      ? {
          name: inicial.name,
          unit: inicial.unit,
          unit_grams: inicial.unit_grams ?? '',
          unit_label: inicial.unit_label || 'unidad',
          kcal: String(Number(inicial.kcal)),
          protein: String(Number(inicial.protein)),
          carbs: String(Number(inicial.carbs)),
          fat: String(Number(inicial.fat)),
          category: inicial.category,
          alcohol: !!inicial.alcohol,
          same_as: inicial.same_as || '',
        }
      : plantilla
        ? {
            // Valores de partida de un alimento parecido; el nombre es el del producto (que a veces no se conoce)
            name: nombreInicial,
            // Un producto envasado se carga cada 100 g (los valores de la base son siempre cada 100), aunque la base lo cuente en unidades
            unit: plantilla.unit === 'u' ? 'g' : plantilla.unit,
            unit_grams: '',
            unit_label: 'unidad',
            kcal: String(Number(plantilla.kcal)),
            protein: String(Number(plantilla.protein)),
            carbs: String(Number(plantilla.carbs)),
            fat: String(Number(plantilla.fat)),
            category: plantilla.category,
            alcohol: !!plantilla.alcohol,
            same_as: ingredientes.some((c) => c.id === plantilla.id) ? plantilla.id : '',
          }
        : {
            name: nombreInicial,
            unit: categoriaInicial === 'Bebidas' ? 'ml' : 'g',
            unit_grams: '',
            unit_label: 'unidad',
            kcal: '',
            protein: '',
            carbs: '',
            fat: '',
            category: categoriaInicial || 'Otros',
            alcohol: false,
            same_as: '',
          },
  )
  const [guardando, setGuardando] = useState(false)
  const [intento, setIntento] = useState(false)
  const [compartir, setCompartir] = useState(true) // aportar el producto al catálogo compartido (solo en gramos o mililitros)
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }))
  // Mientras los valores sean los del alimento parecido son aproximados: no se comparten con el catálogo
  const aproximado = !!plantilla && ['kcal', 'protein', 'carbs', 'fat'].every((k) => Number(f[k]) === Number(plantilla[k]))

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
  if (!errores.kcal && !errores.protein && Number(f.protein) * 4 > Number(f.kcal) + 10)
    errores.protein = 'Es mucha proteína para esas calorías: revisá la etiqueta.'
  // 100 g de algo no pueden tener más de 100 g entre proteína, carbohidratos y grasa
  const suma = (Number(f.protein) || 0) + (Number(f.carbs) || 0) + (Number(f.fat) || 0)
  if (!errores.protein && !errores.carbs && !errores.fat && suma > 100.5)
    errores.fat = 'Proteína, carbohidratos y grasas no pueden sumar más de 100.'
  const ver = (k) => (errores[k] && (intento || f[k] !== '') ? errores[k] : null)

  // El vínculo solo vale si las medidas se pueden pasar de una a otra (y si no hay otros que ya valgan por este)
  const medida = { unit: f.unit, unit_grams: f.unit === 'u' ? Number(f.unit_grams) || 0 : null }
  const destino =
    f.same_as && !(inicial && equivalentes.has(inicial.id)) ? ingredientes.find((c) => c.id === f.same_as && c.id !== inicial?.id) : null
  const valePor = destino && sonCompatibles(medida, destino) ? destino.id : ''

  async function guardar() {
    setIntento(true)
    if (hayErrores(errores)) return
    setGuardando(true)
    const datos = {
      name: f.name.trim(),
      unit: f.unit,
      category: f.category,
      unit_grams: f.unit === 'u' ? Number(f.unit_grams) : null,
      unit_label: f.unit === 'u' ? f.unit_label.trim() : null,
      kcal: Number(f.kcal),
      protein: Number(f.protein) || 0,
      carbs: Number(f.carbs) || 0,
      fat: Number(f.fat) || 0,
      alcohol: f.category === 'Bebidas' && f.alcohol,
      same_as: valePor || null,
      ...(!inicial && codigoInicial ? { codigo: codigoInicial } : {}),
    }
    const a = inicial
      ? await actualizarAlimento(inicial.id, datos)
      : await crearAlimento(datos, { compartir: compartir && f.unit !== 'u' && !aproximado })
    setGuardando(false)
    if (a) onListo(a)
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gris">
        {inicial
          ? 'Los cambios valen de acá en adelante: lo que ya registraste queda como estaba.'
          : 'Copiá los valores de la etiqueta del producto, cada 100 g o 100 ml. Queda guardado para siempre.'}
      </p>
      {!inicial && codigoInicial && <p className="text-xs text-gris">Código de barras: {codigoInicial}</p>}
      {!inicial && plantilla && (
        <p className="text-sm rounded-xl bg-teal-suave p-3" role="note">
          Estos valores son aproximados, de «{nombreCorto(plantilla)}». Corregilos con la etiqueta del producto.
        </p>
      )}
      <div data-tour="na-datos" className="space-y-3">
        <div>
          <label className="etiqueta" htmlFor="na-nombre">
            Nombre
          </label>
          <input
            id="na-nombre"
            className="campo"
            maxLength={LIM.nombre}
            value={f.name}
            onChange={(e) => set('name')(e.target.value)}
            placeholder="Ej.: Galletitas de avena"
          />
          <Err>{ver('name')}</Err>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="etiqueta" htmlFor="na-unidad">
              Se mide en
            </label>
            <select id="na-unidad" className="campo" value={f.unit} onChange={(e) => set('unit')(e.target.value)}>
              <option value="g">Gramos</option>
              <option value="ml">Mililitros</option>
              <option value="u">Unidades</option>
            </select>
          </div>
          <div>
            <label className="etiqueta" htmlFor="na-cat">
              Categoría
            </label>
            <select id="na-cat" className="campo" value={f.category} onChange={(e) => set('category')(e.target.value)}>
              {[...new Set([...CATEGORIAS, f.category])].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {f.unit === 'u' && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="etiqueta" htmlFor="na-etq">
              Cómo se llama la unidad
            </label>
            <input
              id="na-etq"
              className="campo"
              maxLength={20}
              value={f.unit_label}
              onChange={(e) => set('unit_label')(e.target.value)}
              placeholder="unidad, lata, rodaja"
            />
            <Err>{ver('unit_label')}</Err>
          </div>
          <div>
            <label className="etiqueta" htmlFor="na-gr">
              Gramos por unidad
            </label>
            <Numero
              id="na-gr"
              valor={f.unit_grams}
              onChange={set('unit_grams')}
              decimales={1}
              largo={6}
              placeholder="Ej.: 30"
              error={!!ver('unit_grams')}
            />
            <Err>{ver('unit_grams')}</Err>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3" data-tour="na-macros">
        <div>
          <label className="etiqueta" htmlFor="na-kcal">
            Calorías cada 100
          </label>
          <Numero id="na-kcal" valor={f.kcal} onChange={set('kcal')} decimales={1} largo={5} placeholder="kcal" error={!!ver('kcal')} />
          <Err>{ver('kcal')}</Err>
        </div>
        <div>
          <label className="etiqueta" htmlFor="na-prot">
            Proteína cada 100
          </label>
          <Numero
            id="na-prot"
            valor={f.protein}
            onChange={set('protein')}
            decimales={1}
            largo={5}
            placeholder="g"
            error={!!ver('protein')}
          />
          <Err>{ver('protein')}</Err>
        </div>
        <div>
          <label className="etiqueta" htmlFor="na-carb">
            Carbohidratos (opcional)
          </label>
          <Numero id="na-carb" valor={f.carbs} onChange={set('carbs')} decimales={1} largo={5} placeholder="g" error={!!ver('carbs')} />
          <Err>{ver('carbs')}</Err>
        </div>
        <div>
          <label className="etiqueta" htmlFor="na-grasa">
            Grasas (opcional)
          </label>
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
      {!inicial && f.unit !== 'u' && !aproximado && (
        <div>
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" checked={compartir} onChange={(e) => setCompartir(e.target.checked)} className="w-5 h-5 accent-verde" />
            Compartirlo con otras personas de Tupper
          </label>
          <p className="text-xs text-gris mt-1.5">
            Se comparten solo el nombre y los valores del producto, nunca nada tuyo. Les aparece recién cuando otra persona carga el mismo
            producto con valores parecidos.
          </p>
        </div>
      )}
      <div className="flex gap-2 pt-2" data-tour="na-botones">
        <button onClick={onCancelar} className="btn-suave flex-1">
          Volver
        </button>
        <button onClick={guardar} disabled={guardando} className="btn-primario flex-1">
          Guardar
        </button>
      </div>
    </div>
  )
}
