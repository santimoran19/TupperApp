// Despensa: el stock de cada alimento y la comida que ya está cocinada.
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Marco from '../components/Marco'
import SelectorAlimento, { ValePor } from '../components/SelectorAlimento'
import { Chip, Err, Hoja, Icono, Numero, Vacio } from '../components/ui'
import { useDatos } from '../store/Datos'
import { CATEGORIAS, cantidadTexto, pasoDe, redondear, unidadDe } from '../lib/nutricion'
import { errCantidad, maxEnStock } from '../lib/validar'
import { nombreCorto, sugerirBase } from '../lib/equivalencias'

export default function Despensa() {
  const d = useDatos()
  const [texto, setTexto] = useState('')
  const [categoria, setCategoria] = useState('Todos')
  const [agregando, setAgregando] = useState(false)
  const [editar, setEditar] = useState(null) // { alimento, qty }

  const filas = useMemo(
    () => d.stock
      .filter((s) => d.alimentosPorId.has(s.food_id))
      .map((s) => ({ a: d.alimentosPorId.get(s.food_id), qty: Number(s.qty) }))
      .sort((x, y) => x.a.name.localeCompare(y.a.name, 'es')),
    [d.stock, d.alimentosPorId],
  )
  // Los filtros van en el orden de la lista de categorías; las que no estén en la lista, al final
  const orden = (c) => (CATEGORIAS.indexOf(c) === -1 ? 99 : CATEGORIAS.indexOf(c))
  const categorias = ['Todos', ...[...new Set(filas.map((f) => f.a.category))].sort((x, y) => orden(x) - orden(y))]
  const q = texto.trim().toLowerCase()
  const visibles = filas.filter((f) => (categoria === 'Todos' || f.a.category === categoria) && (!q || f.a.name.toLowerCase().includes(q)))
  const activos = filas.filter((f) => f.qty > 0).length
  const agotados = filas.filter((f) => f.qty <= 0).length
  const faltanPlan = d.planFuturo.faltantes.size
  // Productos propios que se parecen a un ingrediente de las recetas y todavía no se dijo si valen por él
  const parecidos = useMemo(() => {
    const m = new Map()
    for (const { a } of filas) {
      if (!a.owner || a.same_as || d.sinEquivalencia.has(a.id) || d.equivalentes.has(a.id)) continue
      const b = sugerirBase(a, d.ingredientes, d.deLaBase)
      if (b) m.set(a.id, b)
    }
    return m
  }, [filas, d.sinEquivalencia, d.ingredientes, d.deLaBase, d.equivalentes])
  const cocinado = d.preparado.filter((p) => Number(p.portions) > 0 && d.recetasPorId.has(p.recipe_id))

  // El alimento de la hoja, al día (la hoja guarda una copia de cuando se abrió)
  const actual = editar ? d.alimentosPorId.get(editar.alimento.id) || editar.alimento : null
  const errorEditar = editar ? errCantidad(editar.alimento, editar.qty, maxEnStock(editar.alimento), { permitirCero: true }) : null
  async function quitar(a) {
    if (!(await d.confirmar({ titulo: `¿Quitar ${a.name} de tu despensa?`, texto: 'Si lo tenías en el plan, va a aparecer como faltante en la lista de compras.', boton: 'Quitar' }))) return false
    const listo = await d.quitarDeDespensa(a.id)
    if (listo) d.avisar('Quitado de la despensa')
    return listo
  }
  async function guardarCantidad() {
    if (errorEditar) return
    const listo = await d.fijarStock(editar.alimento.id, Number(editar.qty) || 0)
    if (listo) setEditar(null)
  }

  return (
    <Marco titulo="Despensa">
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="tarjeta p-3"><Icono n="inventory_2" className="text-verde-texto" size={20} /><p className="text-2xl font-bold leading-tight">{activos}</p><p className="text-xs text-gris">En stock</p></div>
        <div className="tarjeta p-3"><Icono n="hourglass_empty" className="text-naranja-oscuro" size={20} /><p className="text-2xl font-bold leading-tight text-naranja-oscuro">{agotados}</p><p className="text-xs text-gris">Agotados</p></div>
        <div className="tarjeta p-3"><Icono n="takeout_dining" className="text-teal-oscuro" size={20} /><p className="text-2xl font-bold leading-tight text-teal-oscuro">{redondear(cocinado.reduce((s, p) => s + Number(p.portions), 0), 1)}</p><p className="text-xs text-gris">Porciones listas</p></div>
      </div>

      <Link to="/compras" className="tarjeta p-4 mb-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-verde-suave text-verde-texto flex items-center justify-center"><Icono n="shopping_cart" /></div>
        <div className="flex-1">
          <p className="font-semibold">Lista de compras</p>
          <p className="text-xs text-gris">
            {faltanPlan + d.lista.length === 0 ? 'No falta nada para tu plan' : `${faltanPlan} para el plan · ${d.lista.length} anotados por vos`}
          </p>
        </div>
        <Icono n="chevron_right" className="text-gris" />
      </Link>

      {cocinado.length > 0 && (
        <section className="rounded-2xl bg-teal-suave p-4 mb-4">
          <p className="text-[11px] font-bold tracking-wider text-teal-oscuro flex items-center gap-1.5"><Icono n="takeout_dining" size={16} lleno /> COMIDA LISTA</p>
          <div className="mt-2 space-y-2">
            {cocinado.map((p) => (
              <div key={p.recipe_id} className="flex items-center gap-2 text-sm">
                <Link to={`/recetas/${p.recipe_id}`} className="flex-1 font-medium">{d.recetasPorId.get(p.recipe_id).name}</Link>
                <button onClick={() => d.fijarPreparado(p.recipe_id, Number(p.portions) - 1)} className="w-8 h-8 rounded-full bg-superficie flex items-center justify-center" aria-label="Restar porción"><Icono n="remove" size={18} /></button>
                <span className="w-20 text-center font-semibold">{redondear(p.portions, 1)} {Number(p.portions) === 1 ? 'porción' : 'porciones'}</span>
                <button onClick={() => d.fijarPreparado(p.recipe_id, Number(p.portions) + 1)} disabled={Number(p.portions) >= 50} className="w-8 h-8 rounded-full bg-superficie flex items-center justify-center disabled:opacity-30" aria-label="Sumar porción"><Icono n="add" size={18} /></button>
              </div>
            ))}
          </div>
        </section>
      )}

      {filas.length === 0 ? (
        <Vacio icono="kitchen" titulo="Tu despensa está vacía" texto="Cargá lo que tenés en casa y la app te dice qué podés cocinar.">
          <button onClick={() => setAgregando(true)} className="btn-primario"><Icono n="add" /> Agregar alimento</button>
        </Vacio>
      ) : (
        <>
          <div className="flex gap-2 mb-3">
            <div className="relative flex-1 min-w-0">
              <Icono n="search" className="absolute left-3.5 top-3.5 text-gris" size={20} />
              <input className="campo pl-11 bg-superficie shadow-tarjeta" maxLength={60} placeholder="Buscar..." value={texto} onChange={(e) => setTexto(e.target.value)} />
            </div>
            <button onClick={() => setAgregando(true)} className="btn-primario px-4 shrink-0"><Icono n="add" size={20} /> Agregar</button>
          </div>
          <div className="flex gap-2 overflow-x-auto sin-scroll -mx-4 px-4 mb-4">
            {categorias.map((c) => <Chip key={c} activo={c === categoria} onClick={() => setCategoria(c)}>{c}</Chip>)}
          </div>
          <div className="space-y-3">
            {visibles.map(({ a, qty }) => (
              <div key={a.id} className="tarjeta p-4">
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{a.name}</p>
                    <p className="text-xs text-gris">{a.category}{d.base(a).id !== a.id && <span className="text-teal-oscuro"> · cuenta como {nombreCorto(d.base(a))}</span>}</p>
                  </div>
                  {qty <= 0 && <span className="pill bg-naranja-suave text-naranja-oscuro">Agotado</span>}
                  <button onClick={() => quitar(a)} className="w-8 h-8 -mt-1 -mr-1.5 flex items-center justify-center text-gris" aria-label={`Quitar ${a.name} de la despensa`}><Icono n="delete" size={19} /></button>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex items-center rounded-full bg-campo">
                    <button onClick={() => d.ajustarStock(a.id, -pasoDe(a))} disabled={qty <= 0} className="w-10 h-10 flex items-center justify-center disabled:opacity-30" aria-label={`Restar ${a.name}`}><Icono n="remove" size={20} /></button>
                    <button onClick={() => setEditar({ alimento: a, qty: String(qty) })} className="min-w-[92px] px-1 text-sm font-semibold">{cantidadTexto(a, qty)}</button>
                    <button onClick={() => d.ajustarStock(a.id, pasoDe(a))} disabled={qty + pasoDe(a) > maxEnStock(a)} className="w-10 h-10 flex items-center justify-center disabled:opacity-30" aria-label={`Sumar ${a.name}`}><Icono n="add" size={20} /></button>
                  </div>
                  <button onClick={() => d.agregarALista(a.id, pasoDe(a)).then((ok) => ok && d.avisar('Anotado en la lista de compras'))} className="ml-auto btn-chico bg-verde-suave text-verde-texto"><Icono n="add_shopping_cart" size={16} /> Comprar</button>
                </div>
                {parecidos.has(a.id) && (
                  <div className="mt-3 rounded-xl bg-teal-suave px-3 py-2 flex items-center gap-2">
                    <p className="flex-1 text-sm">¿Cuenta como <b>{nombreCorto(parecidos.get(a.id))}</b> en las recetas?</p>
                    <button onClick={() => d.actualizarAlimento(a.id, { same_as: parecidos.get(a.id).id, category: ['Otros', 'Bebidas'].includes(a.category) ? parecidos.get(a.id).category : a.category }).then((ok) => ok && d.avisar(`Las recetas ya lo usan como ${nombreCorto(parecidos.get(a.id)).toLowerCase()}`))} className="btn-chico bg-teal-fuerte text-white">Sí</button>
                    <button onClick={() => d.noPreguntar(a.id)} className="btn-chico bg-superficie text-tinta">No</button>
                  </div>
                )}
              </div>
            ))}
            {visibles.length === 0 && <p className="text-sm text-gris text-center py-6">Nada con ese filtro.</p>}
          </div>
        </>
      )}

      {agregando && (
        <Hoja titulo="Agregar a la despensa" onCerrar={() => setAgregando(false)}>
          <SelectorAlimento onElegir={(a) => { setAgregando(false); setEditar({ alimento: a, qty: String(d.stockMap.get(a.id) || ''), nuevo: true }) }} />
        </Hoja>
      )}
      {editar && (
        <Hoja titulo={editar.alimento.name} onCerrar={() => setEditar(null)}>
          <label className="etiqueta">¿Cuánto tenés? ({editar.alimento.unit === 'u' ? unidadDe(editar.alimento) : editar.alimento.unit === 'g' ? 'gramos' : 'mililitros'})</label>
          <Numero valor={editar.qty} onChange={(v) => setEditar({ ...editar, qty: v })} autoFocus decimales={editar.alimento.unit === 'u' ? 1 : 0} largo={6}
            error={editar.qty !== '' && !!errorEditar} placeholder={editar.alimento.unit === 'u' ? 'Ej.: 6' : 'Ej.: 1000'} />
          <Err>{editar.qty !== '' && errorEditar}</Err>
          {editar.alimento.unit !== 'u' && <p className="text-xs text-gris mt-1.5">1 kg son 1000 g y 1 litro son 1000 ml.</p>}
          {editar.alimento.owner && (
            <div className="mt-4 space-y-3">
              <div>
                <label className="etiqueta" htmlFor="dp-categoria">Categoría</label>
                <select id="dp-categoria" className="campo" value={actual.category} onChange={(e) => d.actualizarAlimento(actual.id, { category: e.target.value })}>
                  {[...new Set([...CATEGORIAS, actual.category])].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <ValePor id="dp-vale" medida={actual} propio={actual.id} valor={actual.same_as || ''}
                onChange={(v) => d.actualizarAlimento(actual.id, { same_as: v || null })} />
            </div>
          )}
          <div className="flex gap-2 mt-4">
            {!editar.nuevo && (
              <button onClick={async () => { if (await quitar(editar.alimento)) setEditar(null) }} className="btn bg-rojo-suave text-rojo-texto"><Icono n="delete" size={20} /> Quitar</button>
            )}
            <button onClick={guardarCantidad} disabled={!!errorEditar} className="btn-primario flex-1">Guardar</button>
          </div>
        </Hoja>
      )}
    </Marco>
  )
}
