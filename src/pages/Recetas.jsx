// Recetas: cuáles se pueden cocinar con lo que hay en la despensa.
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Marco from '../components/Marco'
import { Chip, Icono } from '../components/ui'
import { useDatos } from '../store/Datos'
import { listaComidas, redondear } from '../lib/nutricion'
import { disponibilidad, porcionesPosibles } from '../lib/planificador'

const FILTROS = [['todas', 'Todas'], ['listas', 'Puedo hacerlas'], ['favoritas', 'Favoritas'], ['llevar', 'Para llevar'], ['principal', 'Almuerzo y cena'], ['desayuno', 'Desayuno'], ['merienda', 'Merienda'], ['mias', 'Mías'], ['ocultas', 'Ocultas']]
const normal = (t) => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

export default function Recetas() {
  const d = useDatos()
  const [filtro, setFiltro] = useState('todas')
  const [texto, setTexto] = useState('')

  const lista = useMemo(
    () => d.recetas.map((r) => {
      const items = d.itemsDe(r.id)
      const cocinadas = d.preparadoMap.get(r.id) || 0
      const disp = disponibilidad(r, items, d.stockMap)
      return { r, m: d.macrosPorReceta.get(r.id), cocinadas, disp, posibles: porcionesPosibles(r, items, d.stockMap), total: items.length }
    }).sort((a, b) => (Number(b.cocinadas > 0) - Number(a.cocinadas > 0)) || (Number(b.disp.ok) - Number(a.disp.ok)) || a.disp.faltan.length - b.disp.faltan.length
      || Number(d.favoritas.has(b.r.id)) - Number(d.favoritas.has(a.r.id)) || a.r.name.localeCompare(b.r.name, 'es')),
    [d.recetas, d.itemsDe, d.stockMap, d.preparadoMap, d.macrosPorReceta, d.favoritas],
  )
  const ocultas = [...d.recetasOcultas].sort((a, b) => a.name.localeCompare(b.name, 'es'))
  // El filtro "Ocultas" solo aparece si hay alguna
  const filtros = FILTROS.filter(([k]) => k !== 'ocultas' || ocultas.length > 0 || filtro === 'ocultas')
  const favorita = async (ev, r) => {
    ev.preventDefault()
    ev.stopPropagation()
    await d.alternarFavorita(r.id)
  }
  const listas = lista.filter((x) => x.disp.ok || x.cocinadas > 0).length
  // Se busca por nombre de la receta o de alguno de sus ingredientes
  const q = normal(texto.trim())
  const coincide = (r) => !q || normal(r.name).includes(q) || d.itemsDe(r.id).some((it) => normal(d.alimentosPorId.get(it.food_id)?.name || '').includes(q))
  const visibles = lista.filter(({ r, disp, cocinadas }) => {
    if (!coincide(r)) return false
    if (filtro === 'ocultas') return false
    if (filtro === 'listas') return disp.ok || cocinadas > 0
    if (filtro === 'favoritas') return d.favoritas.has(r.id)
    if (filtro === 'llevar') return r.portable
    if (filtro === 'principal') return r.meal_types.includes('almuerzo') || r.meal_types.includes('cena')
    if (filtro === 'desayuno' || filtro === 'merienda') return r.meal_types.includes(filtro)
    if (filtro === 'mias') return r.owner !== null
    return true
  })

  return (
    <Marco titulo="Recetas">
      <section className="rounded-3xl bg-verde text-white p-5 mb-4">
        <p className="text-[11px] font-bold tracking-wider opacity-80 flex items-center gap-1.5"><Icono n="kitchen" size={16} /> CON TU DESPENSA</p>
        <p className="text-2xl font-bold mt-1">{listas} {listas === 1 ? 'receta lista' : 'recetas listas'} para cocinar</p>
        <p className="text-sm opacity-85 mt-1">Se actualiza sola cada vez que cambia tu stock.</p>
      </section>

      <div className="relative mb-3">
        <Icono n="search" className="absolute left-3.5 top-3.5 text-gris" size={20} />
        <input className="campo pl-11 bg-white shadow-tarjeta" maxLength={60} placeholder="Buscar receta o ingrediente..." value={texto} onChange={(e) => setTexto(e.target.value)} />
      </div>
      <div className="flex gap-2 overflow-x-auto sin-scroll -mx-4 px-4 mb-4">
        {filtros.map(([k, t]) => <Chip key={k} activo={filtro === k} onClick={() => setFiltro(k)}>{t}</Chip>)}
      </div>

      <div className="space-y-3">
        {visibles.map(({ r, m, cocinadas, disp, posibles, total }) => (
          <Link key={r.id} to={`/recetas/${r.id}`} className="tarjeta p-4 block">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {cocinadas > 0 && <span className="pill bg-teal-suave text-teal-oscuro"><Icono n="takeout_dining" size={14} lleno /> {redondear(cocinadas, 1)} ya cocinadas</span>}
              {disp.ok
                ? <span className="pill bg-verde-suave text-verde"><Icono n="check" size={14} /> Tenés todo{posibles > 1 ? ` · alcanza para ${posibles}` : ''}</span>
                : <span className="pill bg-naranja-suave text-naranja-oscuro"><Icono n="shopping_basket" size={14} /> {disp.faltan.length === 1 ? `Falta: ${d.alimentosPorId.get(disp.faltan[0].food_id)?.name.split(' (')[0]}` : `Faltan ${disp.faltan.length} de ${total} ingredientes`}</span>}
            </div>
            <div className="flex items-start gap-2">
              <p className="flex-1 font-semibold text-[17px] leading-snug">{r.name}</p>
              <button onClick={(ev) => favorita(ev, r)} aria-label={d.favoritas.has(r.id) ? `Quitar ${r.name} de favoritas` : `Marcar ${r.name} como favorita`}
                className={`w-9 h-9 -mt-1.5 -mr-1.5 rounded-full flex items-center justify-center ${d.favoritas.has(r.id) ? 'text-coral-oscuro' : 'text-gris/80'}`}>
                <Icono n="favorite" lleno={d.favoritas.has(r.id)} />
              </button>
            </div>
            <p className="text-xs text-gris mt-0.5">
              {r.minutes} min · {listaComidas(r.meal_types)}{r.servings > 1 ? ` · rinde ${r.servings}` : ''}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              <span className="pill bg-verde-suave text-verde">{redondear(m.kcal)} kcal</span>
              <span className="pill bg-coral-suave text-coral-oscuro">{redondear(m.protein)} g prot.</span>
              {r.portable && <span className="pill bg-campo text-gris">Se puede llevar</span>}
            </div>
          </Link>
        ))}
        {filtro === 'ocultas' && (
          <>
            <p className="text-sm text-gris">Las recetas que ocultaste no aparecen en la lista, en el plan ni en las sugerencias.</p>
            {ocultas.filter(coincide).map((r) => (
              <div key={r.id} className="tarjeta p-4 flex items-center gap-3">
                <Link to={`/recetas/${r.id}`} className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{r.name}</p>
                  <p className="text-xs text-gris">{listaComidas(r.meal_types)}</p>
                </Link>
                <button onClick={() => d.mostrarReceta(r.id)} className="btn-chico bg-verde-suave text-verde whitespace-nowrap"><Icono n="visibility" size={16} /> Mostrar</button>
              </div>
            ))}
            {ocultas.length === 0 && <p className="text-sm text-gris text-center py-6">No tenés recetas ocultas.</p>}
          </>
        )}
        {filtro === 'favoritas' && visibles.length === 0 && <p className="text-sm text-gris text-center py-6">Tocá el corazón de una receta para marcarla como favorita: el plan las elige primero.</p>}
        {!['ocultas', 'favoritas'].includes(filtro) && visibles.length === 0 && <p className="text-sm text-gris text-center py-6">No hay recetas con ese filtro.</p>}
        {visibles.length > 0 && <p className="text-xs text-gris text-center pt-1 pb-10">{visibles.length} {visibles.length === 1 ? 'receta' : 'recetas'}</p>}
      </div>

      <Link to="/recetas/nueva" className="fixed bottom-24 right-4 z-30 btn-primario shadow-flotante"><Icono n="add" /> Nueva receta</Link>
    </Marco>
  )
}
