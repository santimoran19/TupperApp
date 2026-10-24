// El peso en el tiempo (1.29, F-10): las medidas en una línea con el eje de fechas de verdad (no una al lado de la otra), la
// meta y la tendencia de las últimas 8 semanas. Abajo, si va hacia la meta, cuándo se llegaría a ese ritmo.
import { useState } from 'react'
import { fechaCorta, fechaLarga, hoy as hoyDe, sumarDias } from '../lib/fechas'
import { estimarMeta, tendencia } from '../lib/peso'
import { redondear } from '../lib/nutricion'

const PERIODOS = [
  [30, '1 mes'],
  [90, '3 meses'],
  [180, '6 meses'],
  [null, 'Todo'],
]
const kg = (n) => redondear(n, 1).toLocaleString('es-AR')
const DIA = 86400000
const t = (f) => Date.parse(f + 'T12:00:00')

export default function GraficoPeso({ puntos, meta, inicio }) {
  const [periodo, setPeriodo] = useState(90)
  const h = hoyDe()
  const desde = periodo ? sumarDias(h, -periodo) : puntos[0]?.f
  const vistos = puntos.filter((p) => !desde || p.f >= desde)
  const tend = tendencia(puntos, h)
  const actual = puntos.length ? puntos[puntos.length - 1].v : null
  const est = estimarMeta({ actual, meta, inicio, tend, hoy: h })

  const W = 380
  const H = 160
  const m = { i: 36, d: 12, a: 14, b: 24 }
  let grafico = null
  if (vistos.length >= 2) {
    const x0 = t(vistos[0].f)
    const x1 = Math.max(t(vistos[vistos.length - 1].f), x0 + DIA)
    const tendVisible = tend && tend.desde >= vistos[0].f ? tend : tend && { ...tend, desde: vistos[0].f }
    const valores = vistos.map((p) => p.v).concat(meta ? [meta] : [])
    const min = Math.floor(Math.min(...valores) - 1)
    const max = Math.ceil(Math.max(...valores) + 1)
    const x = (f) => m.i + ((t(f) - x0) * (W - m.i - m.d)) / (x1 - x0)
    const y = (v) => m.a + ((max - v) * (H - m.a - m.b)) / (max - min)
    const linea = vistos.map((p, i) => `${i ? 'L' : 'M'}${x(p.f).toFixed(1)},${y(p.v).toFixed(1)}`).join(' ')
    const resumen = `Peso de ${kg(vistos[0].v)} a ${kg(vistos[vistos.length - 1].v)} kilos entre el ${fechaCorta(vistos[0].f)} y el ${fechaCorta(vistos[vistos.length - 1].f)}`
    grafico = (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={resumen} data-testid="grafico-peso">
        {[min + 1, (min + max) / 2, max - 1].map((v) => (
          <g key={v}>
            <line x1={m.i} x2={W - m.d} y1={y(v)} y2={y(v)} className="stroke-linea" />
            <text x={m.i - 6} y={y(v) + 4} textAnchor="end" fontSize="10" className="fill-gris">
              {redondear(v, 0)}
            </text>
          </g>
        ))}
        {meta && meta >= min && meta <= max && (
          <g>
            <line x1={m.i} x2={W - m.d} y1={y(meta)} y2={y(meta)} className="stroke-naranja" strokeDasharray="5 4" />
            <text x={W - m.d} y={y(meta) - 4} textAnchor="end" fontSize="10" className="fill-naranja-oscuro">
              meta {kg(meta)} kg
            </text>
          </g>
        )}
        {tendVisible && tendVisible.hasta > tendVisible.desde && (
          <line
            x1={x(tendVisible.desde)}
            y1={y(tend.recta(tendVisible.desde))}
            x2={x(tend.hasta)}
            y2={y(tend.recta(tend.hasta))}
            className="stroke-teal"
            strokeWidth="2"
            strokeDasharray="2 4"
            strokeLinecap="round"
          />
        )}
        <path d={linea} fill="none" className="stroke-verde-texto" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {vistos.map((p) => (
          <circle key={p.f} cx={x(p.f)} cy={y(p.v)} r="3.5" className="fill-verde-texto" />
        ))}
        <text x={m.i} y={H - 6} fontSize="10" className="fill-gris">
          {fechaCorta(vistos[0].f)}
        </text>
        <text x={W - m.d} y={H - 6} textAnchor="end" fontSize="10" className="fill-gris">
          {fechaCorta(vistos[vistos.length - 1].f)}
        </text>
      </svg>
    )
  }

  return (
    <div>
      {puntos.length >= 2 && (
        <div className="flex gap-1 mb-2" role="radiogroup" aria-label="Período del gráfico">
          {PERIODOS.map(([valor, nombre]) => (
            <button
              key={nombre}
              role="radio"
              aria-checked={periodo === valor}
              onClick={() => setPeriodo(valor)}
              className={`rounded-full px-3 h-8 text-xs font-semibold ${periodo === valor ? 'bg-verde text-white' : 'bg-campo text-tinta'}`}
            >
              {nombre}
            </button>
          ))}
        </div>
      )}
      {grafico || (
        <p className="text-sm text-gris">
          {puntos.length < 2 ? 'Cuando tengas dos registros aparece la curva.' : 'En este período hay menos de dos registros.'}
        </p>
      )}
      <Estimacion est={est} tend={tend} />
    </div>
  )
}

// La frase de abajo del gráfico: el ritmo y, si corresponde, cuándo se llegaría. Sin prometer nada.
function Estimacion({ est, tend }) {
  const ritmo = tend ? `${tend.kgPorSemana < 0 ? 'bajando' : 'subiendo'} unos ${kg(Math.abs(tend.kgPorSemana))} kg por semana` : null
  let texto = null
  if (est.estado === 'sin_datos') texto = 'Anotá tu peso una vez por semana durante unas semanas y te mostramos hacia dónde vas.'
  else if (est.estado === 'quieto') texto = 'En las últimas semanas tu peso está estable.'
  else if (est.estado === 'alejandose') texto = `En las últimas semanas venís ${ritmo}: por ahora no te acerca a tu meta.`
  else if (est.estado === 'en_camino')
    texto = `Venís ${ritmo}. A este ritmo llegarías a tu meta alrededor del ${fechaLarga(est.fecha).toLowerCase()}${
      est.fecha.slice(0, 4) !== hoyDe().slice(0, 4) ? ` de ${est.fecha.slice(0, 4)}` : ''
    }.`
  if (!texto) return null
  return (
    <div className="mt-3 rounded-2xl bg-campo p-3 text-sm" data-testid="estimacion-peso">
      <p>{texto}</p>
      {est.estado === 'en_camino' && est.rapido && (
        <p className="text-naranja-oscuro mt-1">
          Es un ritmo rápido (más del 1 % de tu peso por semana). Ir más despacio es más fácil de sostener; si podés, consultalo con un
          profesional.
        </p>
      )}
      {(est.estado === 'en_camino' || est.estado === 'alejandose') && (
        <p className="text-xs text-gris mt-1">Es una estimación con tus medidas de las últimas 8 semanas: el peso varía día a día.</p>
      )}
    </div>
  )
}
