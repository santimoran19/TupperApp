// Plan semanal: se arma con lo que hay en la despensa y marca lo que falta.
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Marco from '../components/Marco'
import { Hoja, Icono } from '../components/ui'
import { useDatos } from '../store/Datos'
import { diaSemana, fechaCorta, hoy, lunesDe, nombreDia, semanaDe, sumarDias } from '../lib/fechas'
import { COMIDAS, NOMBRE_COMIDA, redondear, sumar } from '../lib/nutricion'
import { armarPlan, disponibilidad } from '../lib/planificador'

const ESTADOS = {
  preparado: { texto: 'Ya cocinado', clase: 'bg-teal-suave text-teal-oscuro', icono: 'takeout_dining' },
  listo: { texto: 'Tenés todo', clase: 'bg-verde-suave text-verde-texto', icono: 'check' },
  falta: { texto: 'Falta comprar', clase: 'bg-naranja-suave text-naranja-oscuro', icono: 'shopping_basket' },
}

export default function Plan() {
  const d = useDatos()
  const [lunes, setLunes] = useState(lunesDe(hoy()))
  const [eligiendo, setEligiendo] = useState(null) // { date, meal }
  const [trabajando, setTrabajando] = useState(false)
  const dias = semanaDe(lunes)
  const h = hoy()
  // Se puede mirar hasta 12 semanas atrás y planificar hasta 8 adelante
  const primerLunes = sumarDias(lunesDe(h), -84)
  const ultimoLunes = sumarDias(lunesDe(h), 56)

  const filas = useMemo(() => new Map(d.plan.filter((p) => p.date >= dias[0] && p.date <= dias[6]).map((p) => [`${p.date}|${p.meal}`, p])), [d.plan, lunes])
  const reglas = useMemo(() => new Set(d.reglas.map((r) => `${r.weekday}|${r.meal}`)), [d.reglas])
  const huecos = dias.filter((f) => f >= h).some((f) => COMIDAS.some((c) => !filas.get(`${f}|${c}`)?.recipe_id))
  const faltan = d.planFuturo.faltantes.size

  async function armar() {
    setTrabajando(true)
    const fechas = dias.filter((f) => f >= h)
    // Lo planificado antes de esta semana (de hoy en adelante) ya tiene reservado su stock
    const existentes = new Map(d.plan.filter((p) => p.date >= h).map((p) => [`${p.date}|${p.meal}`, p]))
    const nuevas = armarPlan({ fechas, recetas: d.recetasPorId, itemsDe: d.itemsPlan, stock: d.stockRecetas, preparado: d.preparadoMap, reglas, existentes, ocultas: d.ocultas, favoritas: d.favoritas })
    const listo = await d.guardarPlan(nuevas)
    setTrabajando(false)
    if (listo) d.avisar(nuevas.length ? 'Plan armado con lo que tenés' : 'La semana ya estaba completa')
  }
  async function rehacer() {
    if (!(await d.confirmar({ titulo: '¿Rehacer la semana?', texto: 'Se borra lo planificado de hoy en adelante en esta semana y se arma de nuevo con lo que tenés.', boton: 'Rehacer' }))) return
    setTrabajando(true)
    const desde = dias[0] < h ? h : dias[0]
    await d.vaciarPlan(desde, dias[6])
    const fechas = dias.filter((f) => f >= h)
    const existentes = new Map(d.plan.filter((p) => p.date >= h && (p.date < desde || p.date > dias[6])).map((p) => [`${p.date}|${p.meal}`, p]))
    const nuevas = armarPlan({ fechas, recetas: d.recetasPorId, itemsDe: d.itemsPlan, stock: d.stockRecetas, preparado: d.preparadoMap, reglas, existentes, ocultas: d.ocultas, favoritas: d.favoritas })
    await d.guardarPlan(nuevas)
    setTrabajando(false)
  }

  // Afuera: lo que diga la fila del plan y, si todavía no hay fila, la regla semanal del perfil
  const esAfuera = (date, meal) => {
    const fila = filas.get(`${date}|${meal}`)
    return fila ? fila.away : reglas.has(`${diaSemana(date)}|${meal}`)
  }
  const elegir = async (recipe_id) => {
    await d.guardarPlan([{ date: eligiendo.date, meal: eligiendo.meal, recipe_id, away: esAfuera(eligiendo.date, eligiendo.meal) }])
    setEligiendo(null)
  }
  // Al marcar una comida como afuera, si la receta no se puede llevar se cambia por una que sí
  const alternarAfuera = async (date, meal) => {
    const afuera = !esAfuera(date, meal)
    const r = await d.marcarAfuera(date, meal, afuera)
    if (!r) return
    if (r.cambiadas.length) d.avisar(`Cambié ${r.cambiadas[0].de} por ${r.cambiadas[0].a}, que se puede llevar`)
    else d.avisar(afuera ? `${NOMBRE_COMIDA[meal]} marcada para comer afuera` : `${NOMBRE_COMIDA[meal]} marcada en casa`)
  }
  const eligiendoAfuera = eligiendo ? esAfuera(eligiendo.date, eligiendo.meal) : false

  const opciones = eligiendo
    ? d.recetas
        .filter((r) => r.meal_types.includes(eligiendo.meal))
        .map((r) => ({ r, cocinadas: d.preparadoMap.get(r.id) || 0, ok: disponibilidad(r, d.itemsPlan(r.id), d.stockRecetas).ok }))
        .sort((a, b) => (eligiendoAfuera ? Number(b.r.portable) - Number(a.r.portable) : 0) || Number(d.favoritas.has(b.r.id)) - Number(d.favoritas.has(a.r.id)) || Number(b.cocinadas > 0) - Number(a.cocinadas > 0) || Number(b.ok) - Number(a.ok) || a.r.name.localeCompare(b.r.name, 'es'))
    : []

  return (
    <Marco titulo="Plan semanal">
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setLunes(sumarDias(lunes, -7))} disabled={lunes <= primerLunes} className="w-10 h-10 rounded-full bg-superficie shadow-tarjeta flex items-center justify-center disabled:opacity-30" aria-label="Semana anterior"><Icono n="chevron_left" /></button>
        <div className="text-center">
          <p className="font-semibold">{lunes === lunesDe(h) ? 'Esta semana' : lunes === sumarDias(lunesDe(h), 7) ? 'Semana que viene' : 'Semana'}</p>
          <p className="text-xs text-gris">{fechaCorta(dias[0])} al {fechaCorta(dias[6])}</p>
        </div>
        <button onClick={() => setLunes(sumarDias(lunes, 7))} disabled={lunes >= ultimoLunes} className="w-10 h-10 rounded-full bg-superficie shadow-tarjeta flex items-center justify-center disabled:opacity-30" aria-label="Semana siguiente"><Icono n="chevron_right" /></button>
      </div>

      {dias[6] >= h && (
        <div className="flex gap-2 mb-4">
          <button onClick={armar} disabled={trabajando || !huecos} className="btn-primario flex-1"><Icono n="wand_stars" size={20} /> {huecos ? 'Armar con lo que tengo' : 'Semana completa'}</button>
          <button onClick={rehacer} disabled={trabajando} className="btn-suave" aria-label="Rehacer la semana"><Icono n="refresh" size={20} /></button>
        </div>
      )}

      {faltan > 0 && (
        <Link to="/compras" className="rounded-2xl bg-naranja-suave p-4 mb-4 flex items-center gap-3">
          <Icono n="shopping_basket" className="text-naranja-oscuro" />
          <p className="flex-1 text-sm"><b>Te {faltan === 1 ? 'falta 1 ingrediente' : `faltan ${faltan} ingredientes`}</b> para cumplir el plan.</p>
          <span className="text-sm font-semibold text-naranja-oscuro">Ver lista</span>
        </Link>
      )}

      <div className="space-y-3">
        {dias.map((f) => {
          const pasado = f < h
          // De los días que ya pasaron solo se muestra lo que estaba planificado
          const comidas = pasado ? COMIDAS.filter((c) => filas.get(`${f}|${c}`)?.recipe_id) : COMIDAS
          if (comidas.length === 0) return null
          const kcal = sumar(COMIDAS.map((c) => { const p = filas.get(`${f}|${c}`); return (p?.recipe_id && d.macrosPorReceta.get(p.recipe_id)) || { kcal: 0 } })).kcal
          return (
            <section key={f} className={`tarjeta p-4 ${pasado ? 'opacity-60' : ''} ${f === h ? 'ring-2 ring-verde-medio' : ''}`}>
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold">{nombreDia(f)} <span className="text-gris font-normal text-sm">{fechaCorta(f)}</span>{f === h && <span className="pill bg-verde text-white ml-2">Hoy</span>}</p>
                {kcal > 0 && <span className="text-xs text-gris">{redondear(kcal)} kcal</span>}
              </div>
              <div className="divide-y divide-linea">
                {comidas.map((c) => {
                  const fila = filas.get(`${f}|${c}`)
                  const receta = fila?.recipe_id && d.recetasPorId.get(fila.recipe_id)
                  const est = fila && d.planFuturo.estados.get(fila.id)
                  const afuera = esAfuera(f, c)
                  return (
                    <div key={c} className="flex items-center gap-2 py-2.5">
                      <button onClick={() => !pasado && setEligiendo({ date: f, meal: c })} className="flex-1 min-w-0 text-left" disabled={pasado}>
                        <p className="text-[11px] font-bold tracking-wider text-verde-texto">{NOMBRE_COMIDA[c].toUpperCase()}</p>
                        <p className={`text-sm truncate ${receta ? 'font-medium' : 'text-gris'}`}>{receta ? receta.name : 'Elegir'}</p>
                        {afuera && receta && !receta.portable && <span className="pill mt-1 mr-1 bg-rojo-suave text-rojo-texto">No es para llevar</span>}
                        {est && (
                          <span className={`pill mt-1 ${ESTADOS[est.estado].clase}`}>
                            <Icono n={ESTADOS[est.estado].icono} size={13} />
                            {est.estado === 'falta' && est.faltan.length === 1 ? `Falta: ${d.alimentosPorId.get(est.faltan[0].food_id)?.name.split(' (')[0]}` : ESTADOS[est.estado].texto}
                          </span>
                        )}
                      </button>
                      {!pasado && (
                        <button onClick={() => alternarAfuera(f, c)} aria-label={afuera ? 'Marcar en casa' : 'Marcar fuera de casa'}
                          className={`w-9 h-9 rounded-full flex items-center justify-center ${afuera ? 'bg-naranja-fuerte text-white' : 'bg-campo text-gris/80'}`}>
                          <Icono n="takeout_dining" size={18} lleno={afuera} />
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
      <p className="text-xs text-gris text-center mt-4">El ícono del tupper marca las comidas que hacés fuera de casa. Las que se repiten todas las semanas se cargan una sola vez en tu <Link to="/perfil" className="underline font-semibold">perfil</Link>.</p>

      {eligiendo && (
        <Hoja titulo={`${NOMBRE_COMIDA[eligiendo.meal]} del ${nombreDia(eligiendo.date).toLowerCase()}`} onCerrar={() => setEligiendo(null)}>
          {eligiendoAfuera && <p className="text-sm text-gris mb-1">Esta comida la hacés afuera: primero van las recetas que se pueden llevar.</p>}
          <div className="divide-y divide-linea">
            {opciones.map(({ r, cocinadas, ok }) => {
              const m = d.macrosPorReceta.get(r.id)
              return (
                <button key={r.id} onClick={() => elegir(r.id)} className="w-full flex items-center gap-3 py-3 text-left">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{d.favoritas.has(r.id) && <Icono n="favorite" lleno size={14} className="text-coral-oscuro mr-1 align-[-2px]" />}{r.name}</p>
                    <p className="text-xs text-gris">
                      {redondear(m.kcal)} kcal · {redondear(m.protein)} g prot.
                      {cocinadas > 0 ? <span className="text-teal-oscuro font-semibold"> · ya cocinado</span> : ok ? <span className="text-verde-texto font-semibold"> · tenés todo</span> : <span className="text-naranja-oscuro font-semibold"> · falta comprar</span>}
                      {eligiendoAfuera && !r.portable && <span className="text-rojo-texto font-semibold"> · no es para llevar</span>}
                    </p>
                  </div>
                  <Icono n="chevron_right" className="text-gris" />
                </button>
              )
            })}
          </div>
          {filas.get(`${eligiendo.date}|${eligiendo.meal}`)?.recipe_id && (
            <button onClick={() => elegir(null)} className="btn bg-rojo-suave text-rojo-texto w-full mt-3">Dejar vacío</button>
          )}
        </Hoja>
      )}
    </Marco>
  )
}
