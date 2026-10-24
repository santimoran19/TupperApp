// Despensa: el stock de cada alimento, cuándo vence, cuánto queda y la comida que ya está cocinada.
// Rediseño de la 1.24 (F-04 vencimientos): cada alimento con su foto, el estado de su fecha y una barra de cuánto queda
// respecto de lo que se suele comprar; arriba, lo que hay que usar primero; al costado (abajo en el teléfono), lo que se
// está acabando para anotarlo en la lista, un consejo para que dure más y de qué está hecha la despensa.
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Marco from '../components/Marco'
import Foto from '../components/Foto'
import ElegirFoto from '../components/ElegirFoto'
import SelectorAlimento, { ValePor } from '../components/SelectorAlimento'
import { Chip, Err, Hoja, Icono, Numero, Vacio } from '../components/ui'
import { useDatos } from '../store/Datos'
import { cantidadTexto, pasoDe, redondear, unidadDe } from '../lib/nutricion'
import { errCantidad, maxEnStock } from '../lib/validar'
import { nombreCorto, sugerirBase } from '../lib/equivalencias'
import { hoy, sumarDias } from '../lib/fechas'
import { DIAS_URGENTE, compararVencimiento, distribucion, estadoVencimiento, nivelDeStock } from '../lib/despensa'
import { consejosPara } from '../lib/consejos'
import { consejoDeTemporada, recetaParaLoQueVence } from '../lib/temporada'
import CarruselConsejos from '../components/CarruselConsejos'

const ORDENES = [
  ['vence', 'Vence primero'],
  ['nombre', 'A–Z'],
  ['poco', 'Se acaba'],
]

// Colores de cada estado de la fecha (clases enteras para Tailwind)
const COLOR_VENCE = {
  vencido: 'bg-rojo-suave text-rojo-texto',
  urgente: 'bg-rojo-suave text-rojo-texto',
  pronto: 'bg-naranja-suave text-naranja-oscuro',
  bien: 'bg-verde-suave text-verde-texto',
}
export function EtiquetaVence({ estado, className = '' }) {
  if (!estado) return null
  return (
    <span className={`pill whitespace-nowrap ${COLOR_VENCE[estado.nivel]} ${className}`}>
      {estado.nivel !== 'bien' && <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />}
      {estado.texto}
    </span>
  )
}

// Rosca de la distribución por categoría. Los colores son los de la marca, en orden.
const TONOS = ['--c-verde', '--c-teal', '--c-naranja', '--c-coral', '--c-verde-tenue', '--c-gris']
function Rosca({ partes, total }) {
  const r = 42
  const largo = 2 * Math.PI * r
  let hecho = 0
  return (
    <svg viewBox="0 0 100 100" className="w-28 h-28 shrink-0 -rotate-90" role="img" aria-label="Distribución de la despensa por categoría">
      <circle cx="50" cy="50" r={r} fill="none" stroke="rgb(var(--c-pista))" strokeWidth="13" />
      {partes.map((p, i) => {
        const tramo = total ? (p.cantidad / total) * largo : 0
        const el = (
          <circle
            key={p.categoria}
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke={`rgb(var(${TONOS[i % TONOS.length]}))`}
            strokeWidth="13"
            strokeDasharray={`${Math.max(0, tramo - 1.2)} ${largo}`}
            strokeDashoffset={-hecho}
          />
        )
        hecho += tramo
        return el
      })}
    </svg>
  )
}

export default function Despensa() {
  const d = useDatos()
  const hoyTexto = hoy()
  const [texto, setTexto] = useState('')
  const [categoria, setCategoria] = useState('Todos')
  const [orden, setOrden] = useState('vence')
  const [agregando, setAgregando] = useState(false)
  const [editar, setEditar] = useState(null) // { alimento, qty, vence, nuevo }
  const [marcados, setMarcados] = useState(() => new Set())

  // Cada alimento con su fecha, su estado y cuánto queda
  const filas = useMemo(
    () =>
      d.stock
        .filter((s) => d.alimentosPorId.has(s.food_id))
        .map((s) => {
          const a = d.alimentosPorId.get(s.food_id)
          const qty = Number(s.qty)
          const vence = d.vencimientos.get(s.food_id) || null
          return {
            a,
            qty,
            vence,
            estado: estadoVencimiento(vence, hoyTexto),
            nivel: nivelDeStock(qty, d.referencias.get(s.food_id)),
          }
        }),
    [d.stock, d.alimentosPorId, d.vencimientos, d.referencias, hoyTexto],
  )
  const porNombre = (x, y) => x.a.name.localeCompare(y.a.name, 'es')
  const ordenadas = useMemo(() => {
    const lista = [...filas]
    if (orden === 'nombre') return lista.sort(porNombre)
    if (orden === 'poco')
      return lista.sort(
        (x, y) => Number(x.qty > 0) - Number(y.qty > 0) || (x.nivel ? x.nivel.pct : 101) - (y.nivel ? y.nivel.pct : 101) || porNombre(x, y),
      )
    // Vence primero: lo agotado al final, lo que no tiene fecha después de lo que sí
    return lista.sort((x, y) => Number(x.qty <= 0) - Number(y.qty <= 0) || compararVencimiento(x.vence, y.vence) || porNombre(x, y))
  }, [filas, orden])

  // Los filtros van en el orden de la lista de categorías (con las propias, F-13); las que no estén en la lista, al final
  const ordenCat = d.ordenCategoria
  const cuentaCat = new Map()
  for (const f of filas) cuentaCat.set(f.a.category, (cuentaCat.get(f.a.category) || 0) + 1)
  const categorias = ['Todos', ...[...cuentaCat.keys()].sort((x, y) => ordenCat(x) - ordenCat(y))]
  const q = texto.trim().toLowerCase()
  const visibles = ordenadas.filter(
    (f) => (categoria === 'Todos' || f.a.category === categoria) && (!q || f.a.name.toLowerCase().includes(q)),
  )

  const activos = filas.filter((f) => f.qty > 0).length
  const agotados = filas.filter((f) => f.qty <= 0).length
  const urgentes = ordenadas.filter((f) => f.qty > 0 && f.estado && f.estado.dias <= DIAS_URGENTE)
  const porVencer = filas.filter((f) => f.qty > 0 && f.estado && f.estado.nivel !== 'bien').length
  const faltanPlan = d.planFuturo.faltantes.size
  const ingredientes = useMemo(() => new Set(d.ingredientes.map((a) => a.id)), [d.ingredientes])
  const seCocina = (a) => ingredientes.has(d.base(a).id)

  // Productos propios que se parecen a un ingrediente de las recetas y todavía no se dijo si valen por él
  const parecidos = useMemo(() => {
    const m = new Map()
    for (const { a } of filas) {
      if (a.owner !== d.usuario.id || a.same_as || d.sinEquivalencia.has(a.id) || d.equivalentes.has(a.id)) continue
      const b = sugerirBase(a, d.ingredientes, d.deLaBase)
      if (b) m.set(a.id, b)
    }
    return m
  }, [filas, d.usuario.id, d.sinEquivalencia, d.ingredientes, d.deLaBase, d.equivalentes])
  const cocinado = d.preparado.filter((p) => Number(p.portions) > 0 && d.recetasPorId.has(p.recipe_id))

  // Lo que se está acabando y no está anotado en la lista: agotado o con poco respecto de lo que se suele comprar
  const anotados = useMemo(() => new Set(d.lista.map((x) => x.food_id)), [d.lista])
  const seAcaban = useMemo(
    () =>
      filas
        .filter((f) => !anotados.has(f.a.id) && (f.qty <= 0 || f.nivel?.bajo))
        .sort((x, y) => Number(x.qty > 0) - Number(y.qty > 0) || porNombre(x, y))
        .slice(0, 6)
        .map((f) => {
          const ref = d.referencias.get(f.a.id)
          // Lo que falta para llegar a lo que se suele comprar (redondeado hacia arriba al paso de ese alimento)
          const paso = pasoDe(f.a)
          const sugerido = ref ? Math.max(paso, Math.ceil((ref - f.qty) / paso) * paso) : paso
          return { ...f, sugerido }
        }),
    [filas, anotados, d.referencias],
  )
  const anotarMarcados = async () => {
    const elegidos = seAcaban.filter((f) => marcados.has(f.a.id))
    let bien = 0
    for (const f of elegidos) if (await d.agregarALista(f.a.id, f.sugerido)) bien++
    setMarcados(new Set())
    if (bien > 0) d.avisar(bien === 1 ? 'Anotado en la lista de compras' : `${bien} anotados en la lista de compras`)
  }

  // Consejos para la despensa (1.30): primero lo que vence antes, después uno por alimento, rotando cada día. Desde la 1.31
  // (F-24), si hay dos o más cosas por vencer que entran en una misma receta, esa receta va primero; y uno de estación.
  const { recetas: recetasVisibles, itemsPlan, base: baseDe } = d
  const consejos = useMemo(() => {
    const lista = consejosPara(ordenadas, { hoy: hoyTexto, maximo: 9 })
    const urgentes = ordenadas.filter((f) => f.qty > 0 && f.estado && f.estado.nivel !== 'bien' && f.estado.nivel !== 'vencido')
    const idea = recetaParaLoQueVence(
      recetasVisibles,
      itemsPlan,
      urgentes.map((f) => baseDe(f.a).id),
    )
    const extras = []
    if (idea) {
      const nombres = urgentes.filter((f) => idea.usa.has(baseDe(f.a).id)).map((f) => f.a.name.toLowerCase())
      extras.push({
        id: `receta-${idea.receta.id}`,
        alimento: null,
        tipo: 'receta',
        texto: `Tenés ${nombres.slice(0, -1).join(', ')} y ${nombres.at(-1)} por vencer: usalos juntos en "${idea.receta.name}".`,
        enlace: `/recetas/${idea.receta.id}`,
        enlaceTexto: 'Ver la receta',
      })
    }
    const temporada = consejoDeTemporada(hoyTexto, ordenadas)
    const conTemporada = temporada ? [...lista.slice(0, 2), temporada, ...lista.slice(2)] : lista
    return [...extras, ...conTemporada].slice(0, 10)
  }, [ordenadas, hoyTexto, recetasVisibles, itemsPlan, baseDe])
  const dist = useMemo(() => distribucion(filas), [filas])

  // El alimento de la hoja, al día (la hoja guarda una copia de cuando se abrió)
  const actual = editar ? d.alimentosPorId.get(editar.alimento.id) || editar.alimento : null
  const errorEditar = editar ? errCantidad(editar.alimento, editar.qty, maxEnStock(editar.alimento), { permitirCero: true }) : null
  const errorVence = editar?.vence && !(editar.vence >= '2000-01-01' && editar.vence <= '2100-12-31') ? 'Esa fecha no es válida.' : null
  const abrir = (a, qty, nuevo = false) => setEditar({ alimento: a, qty: String(qty ?? ''), vence: d.vencimientos.get(a.id) || '', nuevo })
  async function quitar(a) {
    if (
      !(await d.confirmar({
        titulo: `¿Quitar ${a.name} de tu despensa?`,
        texto: 'Si lo tenías en el plan, va a aparecer como faltante en la lista de compras.',
        boton: 'Quitar',
      }))
    )
      return false
    // Lo que había, para poder volver atrás (D-06)
    const fila = d.stock.find((s) => s.food_id === a.id)
    const qty = Number(fila?.qty) || 0
    const vence = d.vencimientos.get(a.id) || null
    const listo = await d.quitarDeDespensa(a.id)
    if (listo)
      d.avisar(
        'Quitado de la despensa',
        'ok',
        qty > 0
          ? {
              texto: 'Deshacer',
              hacer: async () => {
                if (!(await d.fijarStock(a.id, qty))) return
                if (vence) await d.fijarVencimiento(a.id, vence)
                d.avisar(`${a.name} volvió a la despensa`)
              },
            }
          : null,
      )
    return listo
  }
  async function guardarCantidad() {
    if (errorEditar || errorVence) return
    const id = editar.alimento.id
    const qty = Number(editar.qty) || 0
    if (!(await d.fijarStock(id, qty))) return
    const antes = d.vencimientos.get(id) || ''
    if (qty > 0 && (editar.vence || '') !== antes && !(await d.fijarVencimiento(id, editar.vence || null))) return
    setEditar(null)
  }

  const resumen = [
    ['inventory_2', activos, 'En stock', 'text-verde-texto'],
    ['event_busy', porVencer, 'Por vencer', porVencer > 0 ? 'text-rojo-texto' : 'text-gris'],
    ['hourglass_empty', agotados, 'Agotados', 'text-naranja-oscuro'],
    [
      'takeout_dining',
      redondear(
        cocinado.reduce((s, p) => s + Number(p.portions), 0),
        1,
      ),
      'Porciones listas',
      'text-teal-oscuro',
    ],
  ]

  const lateral = (lugar) => (
    <>
      {seAcaban.length > 0 && (
        <section className="tarjeta p-4 mb-4" aria-labelledby={`des-acaban-${lugar}`}>
          <div className="flex items-center gap-2">
            <Icono n="checklist" className="text-verde-texto" />
            <h2 id={`des-acaban-${lugar}`} className="font-bold flex-1">
              Se está acabando
            </h2>
            <span className="pill bg-naranja-suave text-naranja-oscuro">{seAcaban.length}</span>
          </div>
          <p className="text-xs text-gris mt-1">Agotado o con poco respecto de lo que solés comprar. Marcá lo que quieras anotar.</p>
          <ul className="mt-3 space-y-2">
            {seAcaban.map((f) => (
              <li key={f.a.id}>
                <label className="flex items-center gap-3 rounded-xl bg-campo px-3 py-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-[rgb(var(--c-verde))]"
                    checked={marcados.has(f.a.id)}
                    onChange={(e) => {
                      const m = new Set(marcados)
                      if (e.target.checked) m.add(f.a.id)
                      else m.delete(f.a.id)
                      setMarcados(m)
                    }}
                  />
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-semibold truncate">{f.a.name}</span>
                    <span className="block text-xs text-gris">
                      {f.qty <= 0 ? 'Agotado' : `Queda ${f.nivel.pct} %`} · sugerido {cantidadTexto(f.a, f.sugerido)}
                    </span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
          <button onClick={anotarMarcados} disabled={marcados.size === 0} className="btn-primario w-full mt-3">
            <Icono n="add_shopping_cart" size={20} /> Anotar {marcados.size > 0 ? marcados.size : ''} en la lista
          </button>
        </section>
      )}

      <CarruselConsejos consejos={consejos} />

      {dist.total > 0 && (
        <section className="tarjeta p-4 mb-4">
          <h2 className="font-bold flex items-center gap-2">
            <Icono n="donut_large" className="text-verde-texto" /> De qué está hecha tu despensa
          </h2>
          <div className="flex items-center gap-4 mt-3">
            <Rosca partes={dist.partes} total={dist.total} />
            <ul className="flex-1 min-w-0 space-y-1.5">
              {dist.partes.map((p, i) => (
                <li key={p.categoria} className="flex items-center gap-2 text-sm">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: `rgb(var(${TONOS[i % TONOS.length]}))` }} />
                  <span className="flex-1 truncate">{p.categoria}</span>
                  <span className="font-semibold tabular-nums">{p.pct} %</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  )

  return (
    <Marco titulo="Despensa">
      <div className="con-lateral">
        <div>
          {d.hogar && (
            <Link to="/perfil" className="pill bg-verde-claro text-verde-texto mb-3">
              <Icono n="home" size={14} /> Despensa compartida · {d.hogar.nombre}
            </Link>
          )}
          <div className="grid grid-cols-4 gap-2 mb-4" data-tour="des-resumen">
            {resumen.map(([ic, n, t, color]) => (
              <div key={t} className="tarjeta px-2 py-3 text-center">
                <Icono n={ic} className={`mx-auto ${color}`} size={20} />
                <p className={`text-xl font-bold leading-tight mt-0.5 ${color === 'text-gris' ? '' : color}`}>{n}</p>
                <p className="text-[11px] leading-tight text-gris">{t}</p>
              </div>
            ))}
          </div>

          <Link to="/compras" className="tarjeta p-4 mb-4 flex items-center gap-3" data-tour="des-compras">
            <div className="w-10 h-10 rounded-full bg-verde-suave text-verde-texto flex items-center justify-center">
              <Icono n="shopping_cart" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">Lista de compras</p>
              <p className="text-xs text-gris">
                {faltanPlan + d.lista.length === 0
                  ? 'No falta nada para tu plan'
                  : `${faltanPlan} para el plan · ${d.lista.length} anotados${d.hogar ? '' : ' por vos'}`}
              </p>
            </div>
            <Icono n="chevron_right" className="text-gris" />
          </Link>

          {cocinado.length > 0 && (
            <section className="rounded-2xl bg-teal-suave p-4 mb-4">
              <p className="text-[11px] font-bold tracking-wider text-teal-oscuro flex items-center gap-1.5">
                <Icono n="takeout_dining" size={16} lleno /> COMIDA LISTA
              </p>
              <div className="mt-2 space-y-2">
                {cocinado.map((p) => (
                  <div key={p.recipe_id} className="flex items-center gap-2 text-sm">
                    <Foto
                      ruta={d.recetasPorId.get(p.recipe_id).image_path}
                      categoria="receta"
                      para={d.recetasPorId.get(p.recipe_id).name}
                      className="w-9 h-9 rounded-xl"
                      icono={18}
                    />
                    <Link to={`/recetas/${p.recipe_id}`} className="flex-1 min-w-0 font-medium">
                      {d.recetasPorId.get(p.recipe_id).name}
                    </Link>
                    <button
                      onClick={() => d.fijarPreparado(p.recipe_id, Number(p.portions) - 1)}
                      className="toque w-8 h-8 rounded-full bg-superficie flex items-center justify-center"
                      aria-label="Restar porción"
                    >
                      <Icono n="remove" size={18} />
                    </button>
                    <span className="w-20 text-center font-semibold">
                      {redondear(p.portions, 1)} {Number(p.portions) === 1 ? 'porción' : 'porciones'}
                    </span>
                    <button
                      onClick={() => d.fijarPreparado(p.recipe_id, Number(p.portions) + 1)}
                      disabled={Number(p.portions) >= 50}
                      className="toque w-8 h-8 rounded-full bg-superficie flex items-center justify-center disabled:opacity-30"
                      aria-label="Sumar porción"
                    >
                      <Icono n="add" size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="hidden xl:block">{lateral('costado')}</div>
        </div>

        <div className="min-w-0">
          {urgentes.length > 0 && (
            <section className="rounded-3xl bg-rojo-suave/70 p-4 mb-4" aria-labelledby="des-primero">
              <h2 id="des-primero" className="text-[11px] font-bold tracking-wider text-rojo-texto flex items-center gap-1.5">
                <Icono n="warning" size={16} /> USÁ ESTO PRIMERO
              </h2>
              <div className="flex gap-3 overflow-x-auto sin-scroll -mx-4 px-4 mt-3 pb-1">
                {urgentes.map((f) => (
                  <div key={f.a.id} className="w-40 shrink-0 rounded-2xl bg-superficie p-3 shadow-tarjeta">
                    <Foto
                      ruta={f.a.image_path}
                      categoria={f.a.category}
                      nombre={f.a.name}
                      className="w-full aspect-4/3 rounded-xl"
                      icono={36}
                    />
                    <p className="font-semibold text-sm mt-2 leading-tight line-clamp-2">{f.a.name}</p>
                    <EtiquetaVence estado={f.estado} className="mt-1.5" />
                    {seCocina(f.a) && (
                      <Link to={`/recetas?con=${d.base(f.a).id}`} className="btn-chico bg-verde text-white w-full mt-2">
                        <Icono n="skillet" size={16} /> Ver recetas
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {filas.length === 0 ? (
            <Vacio icono="kitchen" titulo="Tu despensa está vacía" texto="Cargá lo que tenés en casa y la app te dice qué podés cocinar.">
              <button onClick={() => setAgregando(true)} className="btn-primario" data-tour="des-agregar">
                <Icono n="add" /> Agregar alimento
              </button>
            </Vacio>
          ) : (
            <>
              <div className="flex gap-2 mb-3">
                <div className="relative flex-1 min-w-0">
                  <Icono n="search" className="absolute left-3.5 top-3.5 text-gris" size={20} />
                  <input
                    className="campo pl-11 bg-superficie shadow-tarjeta"
                    maxLength={60}
                    placeholder="Buscar..."
                    aria-label="Buscar en la despensa"
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                  />
                </div>
                <button onClick={() => setAgregando(true)} className="btn-primario px-4 shrink-0" data-tour="des-agregar">
                  <Icono n="add" size={20} /> Agregar
                </button>
              </div>
              <div className="mb-3 flex items-center gap-2.5">
                <span id="des-orden-t" className="text-xs font-semibold text-gris shrink-0">
                  Ordenar
                </span>
                <div
                  role="radiogroup"
                  aria-labelledby="des-orden-t"
                  className="flex flex-1 min-w-0 gap-0.5 rounded-full bg-campo p-0.5"
                  onKeyDown={(e) => {
                    const i = ORDENES.findIndex(([k]) => k === orden)
                    const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
                    if (!d) return
                    e.preventDefault()
                    setOrden(ORDENES[(i + d + ORDENES.length) % ORDENES.length][0])
                  }}
                >
                  {ORDENES.map(([k, t]) => (
                    <button
                      key={k}
                      type="button"
                      role="radio"
                      aria-checked={orden === k}
                      tabIndex={orden === k ? 0 : -1}
                      onClick={() => setOrden(k)}
                      className={`h-8 flex-1 min-w-0 whitespace-nowrap rounded-full px-1.5 text-[12.5px] font-semibold transition ${orden === k ? 'bg-superficie text-verde-texto shadow-tarjeta' : 'text-gris'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="chips-hilera sin-scroll mb-4">
                {categorias.map((c) => (
                  <Chip key={c} activo={c === categoria} onClick={() => setCategoria(c)}>
                    {c} <span className="font-normal">({c === 'Todos' ? filas.length : cuentaCat.get(c)})</span>
                  </Chip>
                ))}
              </div>
              <div className="grilla-tarjetas [--min:19rem]">
                {visibles.map(({ a, qty, estado, nivel }) => (
                  <div key={a.id} className={`tarjeta p-3.5 ${qty <= 0 ? 'bg-campo! shadow-none!' : ''}`}>
                    <div className="flex items-start gap-3">
                      <Foto ruta={a.image_path} categoria={a.category} nombre={a.name} className="w-16 h-16 rounded-2xl" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-1">
                          <p className="font-semibold leading-snug flex-1 min-w-0 line-clamp-2">{a.name}</p>
                          <button
                            onClick={() => quitar(a)}
                            className="toque w-8 h-8 -mt-1.5 -mr-1.5 flex items-center justify-center text-gris"
                            aria-label={`Quitar ${a.name} de la despensa`}
                          >
                            <Icono n="delete" size={19} />
                          </button>
                        </div>
                        <p className="text-xs text-gris">
                          {a.category}
                          {d.base(a).id !== a.id && <span className="text-teal-oscuro"> · cuenta como {nombreCorto(d.base(a))}</span>}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {qty <= 0 && <span className="pill bg-naranja-suave text-naranja-oscuro">Agotado</span>}
                          <EtiquetaVence estado={qty > 0 ? estado : null} />
                        </div>
                      </div>
                    </div>
                    {qty > 0 && nivel && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold">Queda {nivel.pct} %</span>
                          <span className={nivel.bajo ? 'text-naranja-oscuro font-semibold' : 'text-gris'}>
                            {nivel.bajo ? 'Nivel bajo' : 'de lo que solés comprar'}
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-pista mt-1 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-[width] duration-500 ${nivel.bajo ? 'bg-naranja' : estado?.nivel === 'urgente' || estado?.nivel === 'vencido' ? 'bg-rojo' : 'bg-verde'}`}
                            style={{ width: `${Math.max(4, nivel.pct)}%` }}
                          />
                        </div>
                      </div>
                    )}
                    {/* Con la letra grande del teléfono, los botones bajan a otra fila en vez de salirse (1.28, D-07) */}
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <div className="flex items-center rounded-full bg-campo">
                        <button
                          onClick={() => d.ajustarStock(a.id, -pasoDe(a))}
                          disabled={qty <= 0}
                          className="toque w-10 h-10 flex items-center justify-center disabled:opacity-30"
                          aria-label={`Restar ${a.name}`}
                        >
                          <Icono n="remove" size={20} />
                        </button>
                        <button onClick={() => abrir(a, qty)} className="min-w-[84px] px-1 text-sm font-semibold">
                          {cantidadTexto(a, qty)}
                        </button>
                        <button
                          onClick={() => d.ajustarStock(a.id, pasoDe(a))}
                          disabled={qty + pasoDe(a) > maxEnStock(a)}
                          className="toque w-10 h-10 flex items-center justify-center disabled:opacity-30"
                          aria-label={`Sumar ${a.name}`}
                        >
                          <Icono n="add" size={20} />
                        </button>
                      </div>
                      <div className="ml-auto flex items-center gap-1.5">
                        {qty > 0 && seCocina(a) && (
                          <Link
                            to={`/recetas?con=${d.base(a).id}`}
                            className="btn-chico bg-verde-suave text-verde-texto px-3"
                            aria-label={`Cocinar: recetas con ${a.name}`}
                          >
                            <Icono n="skillet" size={16} /> Cocinar
                          </Link>
                        )}
                        <button
                          onClick={() => d.agregarALista(a.id, pasoDe(a)).then((ok) => ok && d.avisar('Anotado en la lista de compras'))}
                          className="toque w-9 h-9 rounded-full bg-campo text-verde-texto flex items-center justify-center"
                          aria-label={`Comprar ${a.name}`}
                          title="Anotar en la lista de compras"
                        >
                          <Icono n="add_shopping_cart" size={18} />
                        </button>
                      </div>
                    </div>
                    {parecidos.has(a.id) && (
                      <div className="mt-3 rounded-xl bg-teal-suave px-3 py-2 flex items-center gap-2">
                        <p className="flex-1 text-sm">
                          ¿Cuenta como <b>{nombreCorto(parecidos.get(a.id))}</b> en las recetas?
                        </p>
                        <button
                          onClick={() =>
                            d
                              .actualizarAlimento(a.id, {
                                same_as: parecidos.get(a.id).id,
                                category: ['Otros', 'Bebidas'].includes(a.category) ? parecidos.get(a.id).category : a.category,
                              })
                              .then((ok) => ok && d.avisar(`Las recetas ya lo usan como ${nombreCorto(parecidos.get(a.id)).toLowerCase()}`))
                          }
                          className="btn-chico bg-teal-fuerte text-white"
                        >
                          Sí
                        </button>
                        <button onClick={() => d.noPreguntar(a.id)} className="btn-chico bg-superficie text-tinta">
                          No
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {visibles.length === 0 && <p className="text-sm text-gris text-center py-6">Nada con ese filtro.</p>}
              </div>
            </>
          )}
          <div className="xl:hidden mt-4">{lateral('abajo')}</div>
        </div>
      </div>

      {agregando && (
        <Hoja titulo="Agregar a la despensa" onCerrar={() => setAgregando(false)}>
          <SelectorAlimento
            onElegir={(a) => {
              setAgregando(false)
              abrir(a, d.stockMap.get(a.id) || '', true)
            }}
          />
        </Hoja>
      )}
      {editar && (
        <Hoja titulo={editar.alimento.name} onCerrar={() => setEditar(null)}>
          <label className="etiqueta">
            ¿Cuánto tenés? (
            {editar.alimento.unit === 'u' ? unidadDe(editar.alimento) : editar.alimento.unit === 'g' ? 'gramos' : 'mililitros'})
          </label>
          <Numero
            valor={editar.qty}
            onChange={(v) => setEditar({ ...editar, qty: v })}
            autoFocus
            decimales={editar.alimento.unit === 'u' ? 1 : 0}
            largo={6}
            error={editar.qty !== '' && !!errorEditar}
            placeholder={editar.alimento.unit === 'u' ? 'Ej.: 6' : 'Ej.: 1000'}
          />
          <Err>{editar.qty !== '' && errorEditar}</Err>
          {editar.alimento.unit !== 'u' && <p className="text-xs text-gris mt-1.5">1 kg son 1000 g y 1 litro son 1000 ml.</p>}

          <div className="mt-4">
            <label className="etiqueta" htmlFor="dp-vence">
              ¿Cuándo vence? (opcional)
            </label>
            <input
              id="dp-vence"
              type="date"
              className="campo"
              min="2000-01-01"
              max="2100-12-31"
              value={editar.vence}
              onChange={(e) => setEditar({ ...editar, vence: e.target.value })}
            />
            <Err>{errorVence}</Err>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[
                [3, '3 días'],
                [7, '1 semana'],
                [30, '1 mes'],
                [180, '6 meses'],
              ].map(([n, t]) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setEditar({ ...editar, vence: sumarDias(hoyTexto, n) })}
                  className="btn-chico bg-campo text-tinta h-8"
                >
                  +{t}
                </button>
              ))}
              {editar.vence && (
                <button type="button" onClick={() => setEditar({ ...editar, vence: '' })} className="btn-chico bg-campo text-gris h-8">
                  Sin fecha
                </button>
              )}
            </div>
            <p className="text-xs text-gris mt-1.5">
              Si tenés varios, poné la fecha del que vence primero. Al agotarse, la fecha se borra sola.
            </p>
          </div>

          {/* La categoría: los propios cambian de verdad; los de la base, solo para vos (F-13) */}
          <div className="mt-4">
            <label className="etiqueta" htmlFor="dp-categoria">
              Categoría
            </label>
            <select id="dp-categoria" className="campo" value={actual.category} onChange={(e) => d.elegirCategoria(actual, e.target.value)}>
              {[...new Set([...d.categorias, actual.category])].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            {actual.categoria_base && (
              <p className="text-xs text-gris mt-1.5">
                Para todos está en {actual.categoria_base}; lo moviste solo para vos.{' '}
                <button
                  type="button"
                  className="underline font-semibold text-verde-texto"
                  onClick={() => d.elegirCategoria(actual, actual.categoria_base)}
                >
                  Volver a {actual.categoria_base}
                </button>
              </p>
            )}
          </div>

          {editar.alimento.owner === d.usuario.id && (
            <div className="mt-4 space-y-3">
              <div>
                <p className="etiqueta">Foto</p>
                <ElegirFoto tipo="alimento" fila={actual} categoria={actual.category} className="w-20 h-20 rounded-2xl" />
              </div>
              <ValePor
                id="dp-vale"
                medida={actual}
                propio={actual.id}
                valor={actual.same_as || ''}
                onChange={(v) => d.actualizarAlimento(actual.id, { same_as: v || null })}
              />
            </div>
          )}
          <div className="flex gap-2 mt-4">
            {!editar.nuevo && (
              <button
                onClick={async () => {
                  if (await quitar(editar.alimento)) setEditar(null)
                }}
                className="btn bg-rojo-suave text-rojo-texto"
              >
                <Icono n="delete" size={20} /> Quitar
              </button>
            )}
            <button onClick={guardarCantidad} disabled={!!errorEditar || !!errorVence} className="btn-primario flex-1">
              Guardar
            </button>
          </div>
        </Hoja>
      )}
    </Marco>
  )
}
