// Recetas: cuáles se pueden cocinar con lo que hay en la despensa.
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Marco from '../components/Marco'
import Foto from '../components/Foto'
import { Chip, Icono } from '../components/ui'
import { DIAS_URGENTE, estadoVencimiento, vencimientoDeReceta } from '../lib/despensa'
import { hoy } from '../lib/fechas'
import { useDatos } from '../store/Datos'
import { listaComidas, redondear } from '../lib/nutricion'
import { disponibilidad, porcionesPosibles } from '../lib/planificador'

// Con más de mil recetas en la base no se dibujan todas juntas: se muestran de a tandas
const PAGINA = 60

const FILTROS = [
  ['todas', 'Todas'],
  ['vence', 'Salvá lo que vence'],
  ['listas', 'Puedo hacerlas'],
  ['favoritas', 'Favoritas'],
  ['llevar', 'Para llevar'],
  ['principal', 'Almuerzo y cena'],
  ['desayuno', 'Desayuno'],
  ['merienda', 'Merienda'],
  ['mias', 'Mías'],
  ['ocultas', 'Ocultas'],
]
const normal = (t) =>
  t
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

export default function Recetas() {
  const d = useDatos()
  // `?con=<id>` llega desde la despensa ("Cocinar"): solo las recetas que usan ese alimento
  const [params, setParams] = useSearchParams()
  const con = params.get('con')
  const conAlimento = con ? d.alimentosPorId.get(con) : null
  const [filtro, setFiltro] = useState('todas')
  const [texto, setTexto] = useState('')
  const hoyTexto = hoy()

  const lista = useMemo(
    () =>
      d.recetas
        .map((r) => {
          const items = d.itemsPlan(r.id)
          const cocinadas = d.preparadoMap.get(r.id) || 0
          const disp = disponibilidad(r, items, d.stockRecetas)
          // Si usa algo que vence pronto, se puede cocinar y así no se tira (F-04)
          const vence = estadoVencimiento(vencimientoDeReceta(items, d.vencePorBase), hoyTexto)
          return {
            vence: vence && vence.dias <= DIAS_URGENTE ? vence : null,
            usa: new Set(items.map((it) => it.food_id)),
            r,
            m: d.macrosPorReceta.get(r.id),
            cocinadas,
            disp,
            posibles: porcionesPosibles(r, items, d.stockRecetas),
            total: items.length,
          }
        })
        .sort(
          (a, b) =>
            Number(b.cocinadas > 0) - Number(a.cocinadas > 0) ||
            Number(b.disp.ok) - Number(a.disp.ok) ||
            Number(!!b.vence) - Number(!!a.vence) ||
            a.disp.faltan.length - b.disp.faltan.length ||
            Number(d.favoritas.has(b.r.id)) - Number(d.favoritas.has(a.r.id)) ||
            a.r.name.localeCompare(b.r.name, 'es'),
        ),
    [d, hoyTexto],
  )
  const ocultas = [...d.recetasOcultas].sort((a, b) => a.name.localeCompare(b.name, 'es'))
  // El filtro "Ocultas" solo aparece si hay alguna
  const conVence = lista.filter((x) => x.vence).length
  const filtros = FILTROS.filter(
    ([k]) => (k !== 'ocultas' || ocultas.length > 0 || filtro === 'ocultas') && (k !== 'vence' || conVence > 0 || filtro === 'vence'),
  )
  const favorita = async (ev, r) => {
    ev.preventDefault()
    ev.stopPropagation()
    await d.alternarFavorita(r.id)
  }
  const listas = lista.filter((x) => x.disp.ok || x.cocinadas > 0).length
  // Se busca por nombre de la receta o de alguno de sus ingredientes
  const q = normal(texto.trim())
  const coincide = (r) =>
    !q || normal(r.name).includes(q) || d.itemsDe(r.id).some((it) => normal(d.alimentosPorId.get(it.food_id)?.name || '').includes(q))
  const visibles = lista.filter(({ r, disp, cocinadas, vence, usa }) => {
    if (!coincide(r)) return false
    if (con && !usa.has(con)) return false
    if (filtro === 'vence') return !!vence
    if (filtro === 'ocultas') return false
    if (filtro === 'listas') return disp.ok || cocinadas > 0
    if (filtro === 'favoritas') return d.favoritas.has(r.id)
    if (filtro === 'llevar') return r.portable
    if (filtro === 'principal') return r.meal_types.includes('almuerzo') || r.meal_types.includes('cena')
    if (filtro === 'desayuno' || filtro === 'merienda') return r.meal_types.includes(filtro)
    if (filtro === 'mias') return r.owner === d.usuario.id
    return true
  })

  // Cuántas se muestran: arranca en una página y vuelve a empezar cuando cambia el filtro, la búsqueda o el alimento
  const clave = `${filtro}|${texto}|${con || ''}`
  const [mas, setMas] = useState({ clave, n: PAGINA })
  const tope = mas.clave === clave ? mas.n : PAGINA
  const mostradas = visibles.slice(0, tope)

  return (
    <Marco titulo="Recetas">
      <div className="lg:flex lg:gap-6 lg:items-start lg:mb-2">
        <section className="rounded-3xl bg-verde text-white p-5 mb-4 lg:w-[22rem] lg:shrink-0" data-tour="rec-resumen">
          <p className="text-[11px] font-bold tracking-wider opacity-80 flex items-center gap-1.5">
            <Icono n="kitchen" size={16} /> CON TU DESPENSA
          </p>
          <p className="text-2xl font-bold mt-1">
            {listas} {listas === 1 ? 'receta lista' : 'recetas listas'} para cocinar
          </p>
          <p className="text-sm opacity-85 mt-1">Se actualiza sola cada vez que cambia tu stock.</p>
        </section>

        <div className="lg:flex-1 lg:min-w-0" data-tour="rec-buscar">
          <div className="flex gap-2 mb-3">
            <div className="relative flex-1 min-w-0">
              <Icono n="search" className="absolute left-3.5 top-3.5 text-gris" size={20} />
              <input
                className="campo pl-11 bg-superficie shadow-tarjeta"
                maxLength={60}
                placeholder="Buscar receta..."
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
              />
            </div>
            <Link to="/recetas/nueva" className="btn-primario px-4 shrink-0" data-tour="rec-nueva">
              <Icono n="add" size={20} /> Nueva
            </Link>
          </div>
          <div className="chips-hilera sin-scroll mb-4">
            {filtros.map(([k, t]) => (
              <Chip key={k} activo={filtro === k} onClick={() => setFiltro(k)}>
                {t}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      {con && (
        <div className="flex items-center gap-3 rounded-2xl bg-verde-suave px-4 py-3 mb-4">
          <Foto
            ruta={conAlimento?.image_path}
            categoria={conAlimento?.category}
            para={conAlimento?.name}
            className="w-10 h-10 rounded-xl"
            icono={20}
          />
          <p className="flex-1 text-sm">
            Recetas con <b>{conAlimento ? conAlimento.name.split(' (')[0] : 'ese alimento'}</b>
          </p>
          <button
            onClick={() => setParams({}, { replace: true })}
            className="toque w-9 h-9 rounded-full bg-superficie flex items-center justify-center"
            aria-label="Ver todas las recetas"
          >
            <Icono n="close" size={18} />
          </button>
        </div>
      )}

      <div className="grilla-tarjetas">
        {mostradas.map(({ r, m, cocinadas, disp, posibles, total, vence }) => (
          <Link key={r.id} to={`/recetas/${r.id}`} className="tarjeta p-4 flex gap-3.5">
            <Foto ruta={r.image_path} categoria="receta" para={r.name} className="w-[84px] h-[84px] rounded-2xl" icono={34} />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-1.5 mb-2">
                {vence && (
                  <span className="pill bg-rojo-suave text-rojo-texto">
                    <Icono n="event_busy" size={14} /> Usa algo que {vence.texto.toLowerCase()}
                  </span>
                )}
                {cocinadas > 0 && (
                  <span className="pill bg-teal-suave text-teal-oscuro">
                    <Icono n="takeout_dining" size={14} lleno /> {redondear(cocinadas, 1)} ya cocinadas
                  </span>
                )}
                {disp.ok ? (
                  <span className="pill bg-verde-suave text-verde-texto">
                    <Icono n="check" size={14} /> Tenés todo{posibles > 1 ? ` · alcanza para ${posibles}` : ''}
                  </span>
                ) : (
                  <span className="pill bg-naranja-suave text-naranja-oscuro">
                    <Icono n="shopping_basket" size={14} />{' '}
                    {disp.faltan.length === 1
                      ? `Falta: ${d.alimentosPorId.get(disp.faltan[0].food_id)?.name.split(' (')[0]}`
                      : `Faltan ${disp.faltan.length} de ${total} ingredientes`}
                  </span>
                )}
              </div>
              <div className="flex items-start gap-2">
                <p className="flex-1 font-semibold text-[17px] leading-snug">{r.name}</p>
                <button
                  onClick={(ev) => favorita(ev, r)}
                  aria-label={d.favoritas.has(r.id) ? `Quitar ${r.name} de favoritas` : `Marcar ${r.name} como favorita`}
                  className={`toque w-9 h-9 -mt-1.5 -mr-1.5 rounded-full flex items-center justify-center ${d.favoritas.has(r.id) ? 'text-coral-oscuro' : 'text-gris/80'}`}
                >
                  <Icono n="favorite" lleno={d.favoritas.has(r.id)} />
                </button>
              </div>
              <p className="text-xs text-gris mt-0.5">
                {r.minutes} min · {listaComidas(r.meal_types)}
                {r.servings > 1 ? ` · rinde ${r.servings}` : ''}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                <span className="pill bg-verde-suave text-verde-texto">{redondear(m.kcal)} kcal</span>
                <span className="pill bg-coral-suave text-coral-oscuro">{redondear(m.protein)} g prot.</span>
                {r.portable && <span className="pill bg-campo text-gris">Se puede llevar</span>}
              </div>
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
                <button onClick={() => d.mostrarReceta(r.id)} className="btn-chico bg-verde-suave text-verde-texto whitespace-nowrap">
                  <Icono n="visibility" size={16} /> Mostrar
                </button>
              </div>
            ))}
            {ocultas.length === 0 && <p className="text-sm text-gris text-center py-6">No tenés recetas ocultas.</p>}
          </>
        )}
        {filtro === 'favoritas' && visibles.length === 0 && (
          <p className="text-sm text-gris text-center py-6">
            Tocá el corazón de una receta para marcarla como favorita: el plan las elige primero.
          </p>
        )}
        {!['ocultas', 'favoritas'].includes(filtro) && visibles.length === 0 && (
          <p className="text-sm text-gris text-center py-6">No hay recetas con ese filtro.</p>
        )}
        {visibles.length > mostradas.length && (
          <button onClick={() => setMas({ clave, n: tope + PAGINA })} className="btn-suave w-full">
            Ver más recetas ({visibles.length - mostradas.length} más)
          </button>
        )}
        {visibles.length > 0 && (
          <p className="text-xs text-gris text-center pt-1">
            {mostradas.length < visibles.length
              ? `${mostradas.length} de ${visibles.length} recetas`
              : `${visibles.length} ${visibles.length === 1 ? 'receta' : 'recetas'}`}
          </p>
        )}
      </div>
    </Marco>
  )
}
