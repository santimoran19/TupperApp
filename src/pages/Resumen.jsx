// Resumen de la semana: promedios contra el objetivo, días cumplidos y cómo viene el peso.
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Marco from '../components/Marco'
import { Icono } from '../components/ui'
import { useDatos } from '../store/Datos'
import { diaCorto, fechaCorta, hoy, lunesDe, nombreDia, semanaDe, sumarDias } from '../lib/fechas'
import { EXTRA, cuentaComoLiquido, litros, miles, objetivoLiquido, redondear, sumar } from '../lib/nutricion'
import { errFecha, rangoDiario } from '../lib/validar'

// Un día cuenta como "en objetivo" si las calorías quedan a menos de 10 % del objetivo
const TOLERANCIA = 0.1

// Barras de calorías por día con la línea del objetivo. Una sola serie: no hace falta leyenda.
function Barras({ dias, objetivo, elegido, onElegir }) {
  const W = 340, H = 170, izq = 6, der = 6, arriba = 22, abajo = 24
  const tope = Math.max(objetivo * 1.2, ...dias.map((x) => x.kcal)) || 1
  const paso = (W - izq - der) / dias.length
  const ancho = Math.min(26, paso - 10)
  const y = (v) => arriba + (1 - v / tope) * (H - arriba - abajo)
  const base = H - abajo
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Calorías por día de la semana contra el objetivo">
      <line x1={izq} x2={W - der} y1={base} y2={base} className="stroke-linea" />
      {dias.map((x, i) => {
        const cx = izq + paso * i + paso / 2
        const alto = Math.max(base - y(x.kcal), 0)
        const activo = x.f === elegido
        const r = Math.min(4, alto)
        return (
          <g key={x.f} onClick={() => onElegir(x.f)} className="cursor-pointer">
            {/* zona de toque más grande que la barra */}
            <rect x={cx - paso / 2} y={0} width={paso} height={H} fill="transparent" />
            {x.kcal > 0
              ? <path d={`M${cx - ancho / 2},${base} v${-(alto - r)} q0,${-r} ${r},${-r} h${ancho - 2 * r} q${r},0 ${r},${r} v${alto - r} z`} className={activo ? 'fill-verde-texto' : 'fill-verde-tenue'} />
              : <rect x={cx - ancho / 2} y={base - 2} width={ancho} height={2} className="fill-linea" />}
            <text x={cx} y={H - 7} textAnchor="middle" fontSize="11" fontWeight={activo ? 700 : 500} className={activo ? 'fill-tinta' : 'fill-gris'}>{diaCorto(x.f)}</text>
          </g>
        )
      })}
      <line x1={izq} x2={W - der} y1={y(objetivo)} y2={y(objetivo)} className="stroke-naranja-oscuro" strokeWidth="1.5" strokeDasharray="5 4" />
      <text x={izq} y={y(objetivo) - 5} fontSize="10" fontWeight="600" className="fill-naranja-oscuro">objetivo {miles(objetivo)}</text>
    </svg>
  )
}

function Dato({ titulo, valor, detalle }) {
  return (
    <div className="tarjeta p-3.5">
      <p className="text-xs font-semibold text-gris">{titulo}</p>
      <p className="text-xl font-bold leading-tight mt-0.5">{valor}</p>
      {detalle && <p className="text-xs text-gris mt-0.5">{detalle}</p>}
    </div>
  )
}

// Devolución de la semana hecha con IA: se pide con un botón y queda guardada.
function AnalisisIA({ lunes, diasRegistrados }) {
  const d = useDatos()
  const [pidiendo, setPidiendo] = useState(false)
  const [error, setError] = useState('')
  const ultimo = useMemo(
    () => d.analisis.filter((a) => a.week_start === lunes).sort((a, b) => b.created_at.localeCompare(a.created_at))[0],
    [d.analisis, lunes],
  )
  const pocos = diasRegistrados < 2

  async function pedir() {
    setError('')
    setPidiendo(true)
    const r = await d.analizarSemana(lunes)
    setPidiendo(false)
    if (r.error) setError(r.error)
  }
  const c = ultimo?.content
  const generado = ultimo ? new Date(ultimo.created_at) : null

  return (
    <section className="tarjeta p-4 mb-4">
      <p className="text-[11px] font-bold tracking-wider text-teal-oscuro flex items-center gap-1.5"><Icono n="wand_stars" size={16} /> ANÁLISIS CON IA</p>
      {c ? (
        <div className="mt-2 space-y-3 text-sm">
          {c.resumen && <p>{c.resumen}</p>}
          {c.bien?.length > 0 && (
            <div>
              <p className="font-semibold mb-1">Lo que viene bien</p>
              <ul className="space-y-1">
                {c.bien.map((t) => <li key={t} className="flex gap-2"><Icono n="check_circle" lleno size={17} className="text-verde-medio mt-0.5" /> <span>{t}</span></li>)}
              </ul>
            </div>
          )}
          {c.ajustar?.length > 0 && (
            <div>
              <p className="font-semibold mb-1">Para ajustar</p>
              <ul className="space-y-1">
                {c.ajustar.map((t) => <li key={t} className="flex gap-2"><span className="w-1.5 h-1.5 rounded-full bg-naranja mt-[7px] mx-[5px] shrink-0" /> <span>{t}</span></li>)}
              </ul>
            </div>
          )}
          {c.acciones?.length > 0 && (
            <div className="rounded-xl bg-verde-claro p-3">
              <p className="font-semibold mb-1.5">Para la semana que viene</p>
              <ol className="space-y-1.5">
                {c.acciones.map((t, i) => (
                  <li key={t} className="flex gap-2">
                    <span className="w-5 h-5 shrink-0 rounded-full bg-verde text-white text-[11px] font-bold flex items-center justify-center mt-px">{i + 1}</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
          <p className="text-xs text-gris">
            Generado el {generado.getDate()}/{generado.getMonth() + 1}. Es una orientación hecha con IA a partir de lo que registraste: no reemplaza a un médico ni a un nutricionista.
          </p>
        </div>
      ) : (
        <p className="text-sm text-gris mt-1.5">
          Una devolución de tu semana, como la haría un nutricionista: qué viene bien, qué ajustar y tres cosas concretas para la semana que viene.
        </p>
      )}

      {error && <p className="text-sm text-rojo-texto mt-3" role="alert">{error}</p>}
      <button onClick={pedir} disabled={pidiendo || pocos} className={`${c ? 'btn-suave' : 'btn-primario'} w-full mt-3`}>
        <Icono n="wand_stars" size={20} /> {pidiendo ? 'Analizando tu semana...' : c ? 'Actualizar el análisis' : 'Analizar mi semana'}
      </button>
      {pocos
        ? <p className="text-xs text-gris mt-2">Registrá al menos 2 días de esta semana para poder pedirlo.</p>
        : !c && <p className="text-xs text-gris mt-2">Se le pasa a la IA el resumen de tu semana (objetivos, totales por día, lo que comiste y tu peso), sin tu nombre ni tu email.</p>}
    </section>
  )
}

export default function Resumen() {
  const d = useDatos()
  const [params] = useSearchParams()
  const rango = rangoDiario()
  const inicial = params.get('fecha') && !errFecha(params.get('fecha'), rango) ? params.get('fecha') : hoy()
  const [lunes, setLunes] = useState(lunesDe(inicial))
  const [elegido, setElegido] = useState(inicial)
  const h = hoy()
  const kcalObj = d.perfil.kcal_target
  const protObj = d.perfil.protein_target
  const liqObj = objetivoLiquido(d.perfil)

  const dias = useMemo(() => semanaDe(lunes).map((f) => {
    const filas = d.registros.filter((r) => r.date === f)
    const t = sumar(filas)
    return {
      f, kcal: t.kcal, protein: t.protein,
      liquido: filas.reduce((s, r) => s + (cuentaComoLiquido(d.alimentosPorId.get(r.food_id)) ? Number(r.qty) : 0), 0),
      // Día con registro: tiene al menos una comida cargada (lo de entre comidas solo no alcanza)
      conRegistro: filas.some((r) => r.meal !== EXTRA && !r.skipped),
    }
  }), [lunes, d.registros, d.alimentosPorId])

  const registrados = dias.filter((x) => x.conRegistro)
  const n = registrados.length
  const prom = (campo) => (n ? registrados.reduce((s, x) => s + x[campo], 0) / n : 0)
  const kcalProm = prom('kcal')
  const protProm = prom('protein')
  const enObjetivo = registrados.filter((x) => Math.abs(x.kcal - kcalObj) <= kcalObj * TOLERANCIA).length
  const conLiquido = dias.filter((x) => x.liquido > 0)
  const liqProm = conLiquido.length ? conLiquido.reduce((s, x) => s + x.liquido, 0) / conLiquido.length : 0

  // Peso: primera y última medida de la semana; si hay una sola, se compara con la anterior a la semana
  const pesos = useMemo(() => d.medidas.filter((m) => m.weight_kg).sort((a, b) => a.date.localeCompare(b.date)), [d.medidas])
  const deLaSemana = pesos.filter((m) => m.date >= dias[0].f && m.date <= dias[6].f)
  const anterior = [...pesos].reverse().find((m) => m.date < dias[0].f)
  const pesoFin = deLaSemana.length ? Number(deLaSemana[deLaSemana.length - 1].weight_kg) : null
  const pesoIni = deLaSemana.length > 1 ? Number(deLaSemana[0].weight_kg) : anterior ? Number(anterior.weight_kg) : null
  const cambio = pesoFin !== null && pesoIni !== null ? redondear(pesoFin - pesoIni, 1) : null

  const desvio = Math.round(kcalProm - kcalObj)
  let lectura = 'Todavía no hay comidas registradas en esta semana.'
  if (n > 0) {
    lectura = Math.abs(desvio) <= kcalObj * TOLERANCIA
      ? `Venís en objetivo: promediás ${miles(kcalProm)} kcal por día.`
      : desvio > 0
        ? `Promediás ${miles(desvio)} kcal por arriba del objetivo.`
        : `Promediás ${miles(-desvio)} kcal por debajo del objetivo.`
    if (protProm < protObj * 0.85) lectura += ` De proteína te faltan unos ${redondear(protObj - protProm)} g por día.`
    if (n < 4 && dias[6].f < h) lectura += ' Con pocos días cargados el promedio dice poco.'
  }
  const sel = dias.find((x) => x.f === elegido) || dias[0]
  const lunesActual = lunesDe(h)

  return (
    <Marco titulo="Resumen semanal" atras>
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => { setLunes(sumarDias(lunes, -7)); setElegido(sumarDias(lunes, -1)) }} disabled={sumarDias(lunes, -1) < rango.min}
          className="w-10 h-10 rounded-full bg-superficie shadow-tarjeta flex items-center justify-center disabled:opacity-30" aria-label="Semana anterior"><Icono n="chevron_left" /></button>
        <div className="text-center">
          <p className="font-semibold">{lunes === lunesActual ? 'Esta semana' : lunes === sumarDias(lunesActual, -7) ? 'Semana pasada' : 'Semana'}</p>
          <p className="text-xs text-gris">{fechaCorta(dias[0].f)} al {fechaCorta(dias[6].f)}</p>
        </div>
        <button onClick={() => { setLunes(sumarDias(lunes, 7)); setElegido(sumarDias(lunes, 7)) }} disabled={lunes >= lunesActual}
          className="w-10 h-10 rounded-full bg-superficie shadow-tarjeta flex items-center justify-center disabled:opacity-30" aria-label="Semana siguiente"><Icono n="chevron_right" /></button>
      </div>

      <section className="rounded-2xl bg-verde-claro p-4 mb-4">
        <p className="text-[11px] font-bold tracking-wider text-verde-texto flex items-center gap-1.5"><Icono n="bar_chart" size={16} /> CÓMO VENÍS</p>
        <p className="text-sm mt-1.5">{lectura}</p>
      </section>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <Dato titulo="Calorías por día" valor={n ? miles(kcalProm) : '—'} detalle={`objetivo ${miles(kcalObj)}`} />
        <Dato titulo="Proteína por día" valor={n ? `${redondear(protProm)} g` : '—'} detalle={`objetivo ${protObj} g`} />
        <Dato titulo="Días en objetivo" valor={n ? `${enObjetivo} de ${n}` : '—'} detalle={n ? `${n} ${n === 1 ? 'día registrado' : 'días registrados'}` : 'sin registros'} />
        <Dato titulo="Líquido por día" valor={conLiquido.length ? `${litros(liqProm)} L` : '—'} detalle={`objetivo ${litros(liqObj)} L`} />
      </div>

      <AnalisisIA key={lunes} lunes={lunes} diasRegistrados={n} />

      <section className="tarjeta p-4 mb-4">
        <h2 className="font-semibold mb-1">Calorías por día</h2>
        <Barras dias={dias} objetivo={kcalObj} elegido={sel.f} onElegir={setElegido} />
        <div className="mt-2 rounded-xl bg-campo px-3 py-2.5 text-sm">
          <b>{nombreDia(sel.f)} {fechaCorta(sel.f)}:</b>{' '}
          {sel.kcal > 0 || sel.liquido > 0
            ? `${miles(sel.kcal)} kcal · ${redondear(sel.protein)} g de proteína · ${litros(sel.liquido)} L de líquido`
            : 'sin registros'}
        </div>
      </section>

      <section className="tarjeta p-4 mb-4">
        <h2 className="font-semibold mb-2">Día por día</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gris text-right">
              <th className="text-left font-semibold pb-1.5">Día</th>
              <th className="font-semibold pb-1.5">kcal</th>
              <th className="font-semibold pb-1.5">Proteína</th>
              <th className="font-semibold pb-1.5">Líquido</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-linea">
            {dias.map((x) => (
              <tr key={x.f} className="text-right">
                <td className="text-left py-2">{nombreDia(x.f)}</td>
                <td className="py-2 font-semibold">{x.kcal > 0 ? miles(x.kcal) : '—'}</td>
                <td className="py-2">{x.kcal > 0 ? `${redondear(x.protein)} g` : '—'}</td>
                <td className="py-2">{x.liquido > 0 ? `${litros(x.liquido)} L` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="tarjeta p-4">
        <h2 className="font-semibold">Peso</h2>
        {pesoFin === null ? (
          <p className="text-sm text-gris mt-1">No anotaste tu peso esta semana. Con una medida por semana alcanza para ver la tendencia.</p>
        ) : (
          <p className="text-sm mt-1">
            Última medida: <b>{pesoFin} kg</b>.{' '}
            {cambio === null ? 'Todavía no hay otra para comparar.'
              : cambio === 0 ? 'Igual que la medida anterior.'
                : `${cambio < 0 ? 'Bajaste' : 'Subiste'} ${String(Math.abs(cambio)).replace('.', ',')} kg ${deLaSemana.length > 1 ? 'en la semana' : 'desde la medida anterior'}.`}
          </p>
        )}
      </section>
    </Marco>
  )
}
