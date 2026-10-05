// Diario: lo comido en el día contra el objetivo, con el consejo para cerrar el día.
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Marco from '../components/Marco'
import { Anillo, Barra, Icono } from '../components/ui'
import { useDatos } from '../store/Datos'
import { diaCorto, diaSemana, fechaLarga, hoy, numeroDia, semanaDe, sumarDias } from '../lib/fechas'
import { COMIDAS, EXTRA, ICONO_COMIDA, NOMBRE_COMIDA, consejoDelDia, cuentaComoLiquido, litros, objetivoLiquido, redondear, sumar } from '../lib/nutricion'
import { disponibilidad } from '../lib/planificador'
import { rangoDiario } from '../lib/validar'

const TONOS = {
  info: { caja: 'bg-verde-claro', titulo: 'text-verde-texto', icono: 'eco', rotulo: 'TU DÍA' },
  bien: { caja: 'bg-verde-claro', titulo: 'text-verde-texto', icono: 'check_circle', rotulo: 'EN OBJETIVO' },
  arriba: { caja: 'bg-naranja-suave', titulo: 'text-naranja-oscuro', icono: 'trending_up', rotulo: 'VENÍS ARRIBA' },
  abajo: { caja: 'bg-teal-suave', titulo: 'text-teal-oscuro', icono: 'trending_down', rotulo: 'VENÍS ABAJO' },
}

export default function Diario() {
  const d = useDatos()
  const nav = useNavigate()
  const [fecha, setFecha] = useState(hoy())
  const esHoy = fecha === hoy()
  const rango = rangoDiario()
  // Mueve una semana sin salirse del rango que la app maneja
  const mover = (dias) => setFecha((f) => { const n = sumarDias(f, dias); return n < rango.min ? rango.min : n > rango.max ? rango.max : n })

  const delDia = d.registros.filter((r) => r.date === fecha)
  const total = sumar(delDia)
  // Comidas resueltas: las que tienen algo cargado y las marcadas como "no comí". Lo de entre comidas no cuenta.
  const registradas = new Set(delDia.filter((r) => r.meal !== EXTRA).map((r) => r.meal))
  const salteadas = new Set(delDia.filter((r) => r.skipped).map((r) => r.meal))
  const extras = delDia.filter((r) => r.meal === EXTRA)
  // Líquido del día contra el objetivo: lo registrado en ml que no tiene alcohol
  const liquido = delDia.reduce((t, r) => t + (cuentaComoLiquido(d.alimentosPorId.get(r.food_id)) ? Number(r.qty) : 0), 0)
  const metaLiquido = objetivoLiquido(d.perfil)
  const agua = d.alimentos.find((a) => a.slug === 'agua')
  const reglas = useMemo(() => new Set(d.reglas.map((r) => `${r.weekday}|${r.meal}`)), [d.reglas])
  // Una comida es "afuera" si así está en el plan o, cuando no hay nada planificado, si lo dice la regla semanal
  const esAfuera = (f, comida, fila) => (fila ? fila.away : reglas.has(`${diaSemana(f)}|${comida}`))
  const planDia = new Map(d.plan.filter((p) => p.date === fecha).map((p) => [p.meal, p]))
  const planHoy = new Map()
  for (const [comida, fila] of planDia) {
    const m = fila.recipe_id && d.macrosPorReceta.get(fila.recipe_id)
    if (m) planHoy.set(comida, m)
  }
  const consejo = consejoDelDia({ objetivoKcal: d.perfil.kcal_target, objetivoProt: d.perfil.protein_target, total, registradas, planHoy })
  const tono = TONOS[consejo.tono]
  const restante = d.perfil.kcal_target - redondear(total.kcal)

  // Recetas que entran en lo que queda para la próxima comida
  const ideas = useMemo(() => {
    if (!esHoy || !consejo.siguiente || planDia.get(consejo.siguiente)?.recipe_id) return []
    return d.recetas
      .filter((r) => r.meal_types.includes(consejo.siguiente) && d.macrosPorReceta.get(r.id).kcal <= consejo.presupuesto + 60)
      .filter((r) => r.portable || !esAfuera(fecha, consejo.siguiente, planDia.get(consejo.siguiente)))
      .map((r) => ({
        r,
        puntos: ((d.preparadoMap.get(r.id) || 0) >= 1 ? 2000 : disponibilidad(r, d.itemsPlan(r.id), d.stockRecetas).ok ? 1000 : 0) + d.macrosPorReceta.get(r.id).protein,
      }))
      .filter((x) => x.puntos >= 1000)
      .sort((a, b) => b.puntos - a.puntos)
      .slice(0, 2)
      .map((x) => x.r)
  }, [esHoy, consejo.siguiente, consejo.presupuesto, d.recetas, d.stockRecetas, d.preparadoMap, d.plan, reglas])

  // Comidas de hoy y mañana que se hacen fuera de casa, salgan del plan o de las reglas semanales
  const paraLlevar = useMemo(() => {
    if (!esHoy) return []
    const lista = []
    for (const f of [fecha, sumarDias(fecha, 1)]) {
      for (const comida of COMIDAS) {
        if (f === fecha && registradas.has(comida)) continue
        const fila = d.plan.find((p) => p.date === f && p.meal === comida)
        if (!esAfuera(f, comida, fila)) continue
        const receta = fila?.recipe_id && d.recetasPorId.get(fila.recipe_id)
        if (receta) {
          lista.push({ f, comida, receta, estado: d.planFuturo.estados.get(fila.id)?.estado })
          continue
        }
        // Sin nada planificado: se propone algo que se pueda llevar y que ya esté cocinado o tenga todo en stock
        const idea = d.recetas
          .filter((r) => r.portable && r.meal_types.includes(comida) && d.itemsDe(r.id).length > 0)
          .map((r) => ({ r, cocinada: (d.preparadoMap.get(r.id) || 0) >= 1, ok: disponibilidad(r, d.itemsPlan(r.id), d.stockRecetas).ok }))
          .filter((x) => x.cocinada || x.ok)
          .sort((a, b) => Number(b.cocinada) - Number(a.cocinada) || d.macrosPorReceta.get(b.r.id).protein - d.macrosPorReceta.get(a.r.id).protein)[0]
        lista.push({ f, comida, idea })
      }
    }
    return lista
  }, [esHoy, fecha, d.plan, d.planFuturo, d.registros, d.recetas, d.stockRecetas, d.preparadoMap, reglas])

  const comiPlan = async (comida, fila) => {
    const listo = await d.registrar({ date: fecha, meal: comida, platos: [{ recipe_id: fila.recipe_id, porciones: 1 }] })
    if (listo) d.avisar('Registrado')
  }
  const quitarRegistro = async (r) => {
    if (await d.confirmar({ titulo: `¿Borrar ${r.name}?`, texto: 'Se saca de lo registrado ese día. Lo que se descontó de la despensa no vuelve solo.' })) d.borrarRegistro(r.id)
  }
  const tomeAgua = async () => {
    const listo = await d.registrar({ date: fecha, meal: EXTRA, platos: [{ food_id: agua.id, qty: 250 }], descontar: false })
    if (listo) d.avisar('Un vaso de agua anotado')
  }

  return (
    <Marco titulo="Diario">
      <p className="text-sm text-gris">{fechaLarga(fecha)}</p>
      <h2 className="text-2xl font-bold tracking-tight mb-3">{esHoy ? `¡Hola, ${d.perfil.name.split(' ')[0]}!` : fechaLarga(fecha).split(' ')[0]}</h2>

      <div className="flex items-center gap-1 mb-4">
        <button onClick={() => mover(-7)} disabled={fecha <= rango.min} className="w-7 h-12 text-gris disabled:opacity-30" aria-label="Semana anterior"><Icono n="chevron_left" /></button>
        <div className="flex-1 grid grid-cols-7 gap-1">
          {semanaDe(fecha).map((f) => {
            const activo = f === fecha
            const tiene = d.registros.some((r) => r.date === f)
            return (
              <button key={f} onClick={() => setFecha(f)} disabled={f < rango.min || f > rango.max}
                className={`flex flex-col items-center py-2 rounded-2xl disabled:opacity-40 ${activo ? 'bg-verde text-white shadow-tarjeta' : 'bg-superficie shadow-tarjeta'}`}>
                <span className={`text-[11px] font-medium ${activo ? 'opacity-90' : 'text-gris'}`}>{diaCorto(f)}</span>
                <span className="text-sm font-bold">{numeroDia(f)}</span>
                <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${tiene ? (activo ? 'bg-superficie' : 'bg-verde-medio') : 'bg-transparent'}`} />
              </button>
            )
          })}
        </div>
        <button onClick={() => mover(7)} disabled={fecha >= rango.max} className="w-7 h-12 text-gris disabled:opacity-30" aria-label="Semana siguiente"><Icono n="chevron_right" /></button>
      </div>

      <section className="tarjeta rounded-3xl p-5 mb-4">
        <div className="flex items-center gap-5">
          <Anillo valor={total.kcal} total={d.perfil.kcal_target}>
            <span className="text-2xl font-bold leading-none">{redondear(total.kcal).toLocaleString('es-AR')}</span>
            <span className="text-[11px] text-gris mt-1">kcal de {d.perfil.kcal_target.toLocaleString('es-AR')}</span>
          </Anillo>
          <div className="flex-1 space-y-2">
            <div className={`rounded-2xl p-3 ${restante < 0 ? 'bg-naranja-suave' : 'bg-verde-claro'}`}>
              <p className="text-xs font-semibold text-gris">{restante < 0 ? 'Te pasaste' : 'Restante'}</p>
              <p className={`text-lg font-bold ${restante < 0 ? 'text-naranja-oscuro' : 'text-verde-texto'}`}>{Math.abs(restante).toLocaleString('es-AR')} kcal</p>
            </div>
            <div className="rounded-2xl p-3 bg-campo">
              <p className="text-xs font-semibold text-gris">Comidas</p>
              <p className="text-lg font-bold">
                {registradas.size - salteadas.size} de 4
                {salteadas.size > 0 && <span className="text-xs font-medium text-gris"> · {salteadas.size} sin comer</span>}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-5 space-y-3">
          <Barra nombre="Proteína" valor={total.protein} total={d.perfil.protein_target} color="bg-coral" />
          <div className="flex gap-2">
            <span className="pill bg-naranja-suave text-naranja-oscuro">{redondear(total.carbs)} g carbohidratos</span>
            <span className="pill bg-teal-suave text-teal-oscuro">{redondear(total.fat)} g grasas</span>
          </div>
          <div>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="font-medium">Líquido</span>
              <span className="text-gris"><b className="text-tinta">{litros(liquido)} L</b> / {litros(metaLiquido)} L</span>
            </div>
            <div className="h-2 rounded-full bg-pista overflow-hidden">
              <div className="h-full rounded-full bg-teal" style={{ width: `${Math.min((liquido / metaLiquido) * 100, 100)}%`, transition: 'width .4s' }} />
            </div>
            <div className="flex items-center justify-between gap-2 mt-2">
              <p className="text-xs text-gris">{liquido >= metaLiquido ? 'Llegaste al objetivo de líquido.' : `Te ${metaLiquido - liquido === 1000 ? 'falta' : 'faltan'} ${litros(metaLiquido - liquido)} L para llegar.`}</p>
              {agua && fecha <= hoy() && (
                <button onClick={tomeAgua} className="btn-chico h-8 bg-teal-suave text-teal-oscuro whitespace-nowrap"><Icono n="water_drop" size={15} /> Vaso de agua</button>
              )}
            </div>
          </div>
        </div>
      </section>

      <Link to={`/resumen?fecha=${fecha}`} className="flex items-center gap-2 text-sm font-semibold text-verde-texto mb-4 px-1">
        <Icono n="bar_chart" size={18} /> Ver el resumen de la semana <Icono n="chevron_right" size={18} className="ml-auto text-gris" />
      </Link>

      {esHoy && (
        <section className={`rounded-2xl p-4 mb-4 ${tono.caja}`}>
          <p className={`text-[11px] font-bold tracking-wider flex items-center gap-1.5 ${tono.titulo}`}>
            <Icono n={tono.icono} size={16} lleno /> {tono.rotulo}
          </p>
          <p className="text-sm mt-1.5">{consejo.texto}</p>
          {ideas.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {ideas.map((r) => (
                <Link key={r.id} to={`/recetas/${r.id}`} className="pill bg-superficie text-tinta shadow-tarjeta py-1.5">
                  {r.name} · {redondear(d.macrosPorReceta.get(r.id).kcal)} kcal
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {paraLlevar.length > 0 && (
        <section className="rounded-2xl p-4 mb-4 bg-naranja-suave">
          <p className="text-[11px] font-bold tracking-wider flex items-center gap-1.5 text-naranja-oscuro">
            <Icono n="takeout_dining" size={16} lleno /> PARA LLEVAR
          </p>
          <ul className="mt-2 space-y-1.5 text-sm">
            {paraLlevar.map((p) => (
              <li key={p.f + p.comida}>
                <b>{p.f === fecha ? 'Hoy' : 'Mañana'}, {NOMBRE_COMIDA[p.comida].toLowerCase()}:</b>{' '}
                {p.receta ? (
                  <>
                    {p.receta.name}.{' '}
                    {!p.receta.portable ? 'Ojo: esta receta no es para llevar, cambiala en el plan.'
                      : p.estado === 'preparado' ? 'Ya está cocinado: pasalo a un tupper.'
                      : p.estado === 'falta' ? 'Te faltan ingredientes, mirá la lista de compras.'
                      : 'Tenés todo: dejalo cocinado y en un tupper.'}
                  </>
                ) : p.idea ? (
                  <>no hay nada planificado. Podés llevar <Link to={`/recetas/${p.idea.r.id}`} className="font-semibold underline">{p.idea.r.name}</Link>{p.idea.cocinada ? ', que ya está cocinado.' : ', tenés todo para hacerlo.'}</>
                ) : (
                  <>no hay nada planificado. <Link to="/plan" className="font-semibold underline">Armá el plan</Link> para ver qué llevar.</>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">Comidas</h3>
        <span className="text-sm text-gris">Total: {redondear(total.kcal).toLocaleString('es-AR')} kcal</span>
      </div>

      <div className="space-y-3">
        {COMIDAS.map((comida) => {
          const entradas = delDia.filter((r) => r.meal === comida && !r.skipped)
          const salteada = delDia.find((r) => r.meal === comida && r.skipped)
          const fila = planDia.get(comida)
          const receta = fila?.recipe_id && d.recetasPorId.get(fila.recipe_id)
          const m = receta && d.macrosPorReceta.get(receta.id)
          const subtotal = sumar(entradas)
          const irARegistrar = () => nav(`/registrar?fecha=${fecha}&comida=${comida}`)
          return (
            <section key={comida} className={`tarjeta p-4 ${entradas.length === 0 ? 'border-dashed border-linea shadow-none bg-superficie/60' : ''}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-verde-claro text-verde-texto flex items-center justify-center"><Icono n={ICONO_COMIDA[comida]} /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold tracking-wider text-verde-texto">{NOMBRE_COMIDA[comida].toUpperCase()}</p>
                  {entradas.length > 0
                    ? <p className="text-sm text-gris">{redondear(subtotal.protein)} g de proteína</p>
                    : salteada
                      ? <p className="text-sm text-gris">No comiste</p>
                      : <p className="text-sm text-gris truncate">{receta ? `Plan: ${receta.name}` : 'Sin registrar'}</p>}
                </div>
                {esAfuera(fecha, comida, fila) && <span className="pill bg-naranja-suave text-naranja-oscuro"><Icono n="takeout_dining" size={14} /> Afuera</span>}
                {entradas.length > 0 && <p className="font-bold">{redondear(subtotal.kcal)} <span className="text-xs font-medium text-gris">kcal</span></p>}
              </div>

              {entradas.length > 0 && (
                <div className="mt-3 pt-1 border-t border-linea divide-y divide-linea">
                  {entradas.map((r) => (
                    <div key={r.id} className="flex items-center gap-2 py-2 text-sm">
                      <span className="flex-1 min-w-0 truncate">{r.name}</span>
                      <span className="text-gris">{redondear(r.kcal)} kcal</span>
                      <button onClick={() => quitarRegistro(r)} className="w-7 h-7 text-gris" aria-label={`Borrar ${r.name}`}><Icono n="close" size={18} /></button>
                    </div>
                  ))}
                  <button onClick={irARegistrar} className="pt-2.5 text-sm font-semibold text-verde-texto flex items-center gap-1"><Icono n="add" size={18} /> Agregar algo más</button>
                </div>
              )}

              {entradas.length === 0 && salteada && (
                <div className="mt-3 flex items-center gap-2">
                  <button onClick={() => d.borrarRegistro(salteada.id)} className="btn-chico bg-campo text-tinta flex-1"><Icono n="undo" size={16} /> Deshacer</button>
                  <button onClick={irARegistrar} className="btn-chico bg-verde-suave text-verde-texto flex-1"><Icono n="add" size={16} /> Al final comí</button>
                </div>
              )}

              {entradas.length === 0 && !salteada && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {receta && (
                    <button onClick={() => comiPlan(comida, fila)} className="btn-chico bg-verde text-white flex-1 whitespace-nowrap">
                      <Icono n="check" size={16} /> Comí esto · {redondear(m.kcal)} kcal
                    </button>
                  )}
                  <button onClick={irARegistrar} className={`btn-chico bg-verde-suave text-verde-texto whitespace-nowrap ${receta ? '' : 'flex-1'}`}>
                    <Icono n={receta ? 'swap_horiz' : 'add'} size={16} /> {receta ? 'Otra cosa' : 'Registrar'}
                  </button>
                  {fecha <= hoy() && (
                    <button onClick={() => d.saltear(fecha, comida)} className="btn-chico bg-campo text-gris whitespace-nowrap" aria-label={`No comí ${NOMBRE_COMIDA[comida].toLowerCase()}`}>
                      <Icono n="no_meals" size={16} /> No comí
                    </button>
                  )}
                </div>
              )}
            </section>
          )
        })}

        <section className={`tarjeta p-4 ${extras.length === 0 ? 'border-dashed border-linea shadow-none bg-superficie/60' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-suave text-teal-oscuro flex items-center justify-center"><Icono n={ICONO_COMIDA[EXTRA]} /></div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold tracking-wider text-teal-oscuro">BEBIDAS Y ENTRE COMIDAS</p>
              <p className="text-sm text-gris">{extras.length > 0 ? `${redondear(sumar(extras).protein)} g de proteína` : 'Agua, mate, café, alcohol, algo que picaste'}</p>
            </div>
            {extras.length > 0 && <p className="font-bold">{redondear(sumar(extras).kcal)} <span className="text-xs font-medium text-gris">kcal</span></p>}
          </div>
          {extras.length > 0 && (
            <div className="mt-3 pt-1 border-t border-linea divide-y divide-linea">
              {extras.map((r) => {
                const a = d.alimentosPorId.get(r.food_id)
                return (
                  <div key={r.id} className="flex items-center gap-2 py-2 text-sm">
                    <span className="flex-1 min-w-0 truncate">{r.name}{a?.unit === 'ml' ? ` · ${redondear(r.qty)} ml` : ''}</span>
                    <span className="text-gris">{redondear(r.kcal)} kcal</span>
                    <button onClick={() => quitarRegistro(r)} className="w-7 h-7 text-gris" aria-label={`Borrar ${r.name}`}><Icono n="close" size={18} /></button>
                  </div>
                )
              })}
            </div>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button onClick={() => nav(`/registrar?fecha=${fecha}&comida=${EXTRA}&abrir=bebida`)} className="btn-chico bg-teal-suave text-teal-oscuro flex-1 whitespace-nowrap"><Icono n="local_bar" size={16} /> Bebida</button>
            <button onClick={() => nav(`/registrar?fecha=${fecha}&comida=${EXTRA}`)} className="btn-chico bg-verde-suave text-verde-texto flex-1 whitespace-nowrap"><Icono n="add" size={16} /> Otra cosa</button>
          </div>
        </section>
      </div>
    </Marco>
  )
}
