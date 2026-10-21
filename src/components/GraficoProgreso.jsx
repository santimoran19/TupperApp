// Progreso de un ejercicio: la fuerza máxima estimada (1RM) de cada sesión, en una línea.
import { fechaCorta } from '../lib/fechas'
import { aMedioKilo } from '../lib/gimnasio'

// `puntos`: [{ fecha, unRm, peso }] (de progresoDeEjercicio). Se muestran los últimos `max`.
export default function GraficoProgreso({ puntos, max = 12 }) {
  const datos = puntos.filter((p) => p.unRm > 0 || p.peso > 0).slice(-max)
  if (datos.length < 2) return <p className="text-sm text-gris">Cuando lo hagas en dos días distintos aparece la curva.</p>
  const valor = (p) => (p.unRm > 0 ? p.unRm : p.peso)
  const W = 340
  const H = 140
  const m = { i: 38, d: 10, a: 12, b: 22 }
  const vs = datos.map(valor)
  const min = Math.min(...vs)
  const maxV = Math.max(...vs)
  const margen = Math.max((maxV - min) * 0.15, 1)
  const lo = Math.max(0, min - margen)
  const hi = maxV + margen
  const x = (i) => m.i + (i * (W - m.i - m.d)) / (datos.length - 1)
  const y = (v) => m.a + ((hi - v) * (H - m.a - m.b)) / (hi - lo)
  const linea = datos.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(valor(p)).toFixed(1)}`).join(' ')
  const ticks = [lo + margen, (lo + hi) / 2, hi - margen]
  const resumen = `Fuerza estimada de ${aMedioKilo(vs[0])} a ${aMedioKilo(vs[vs.length - 1])} kg entre el ${fechaCorta(datos[0].fecha)} y el ${fechaCorta(datos[datos.length - 1].fecha)}`
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={resumen}>
      {ticks.map((v) => (
        <g key={v}>
          <line x1={m.i} x2={W - m.d} y1={y(v)} y2={y(v)} className="stroke-linea" />
          <text x={m.i - 6} y={y(v) + 4} textAnchor="end" fontSize="10" className="fill-gris">
            {Math.round(v)}
          </text>
        </g>
      ))}
      <path d={linea} fill="none" className="stroke-verde-texto" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {datos.map((p, i) => (
        <circle key={p.fecha} cx={x(i)} cy={y(valor(p))} r="3.5" className="fill-verde-texto" />
      ))}
      <text x={x(0)} y={H - 6} fontSize="10" className="fill-gris">
        {fechaCorta(datos[0].fecha)}
      </text>
      <text x={x(datos.length - 1)} y={H - 6} textAnchor="end" fontSize="10" className="fill-gris">
        {fechaCorta(datos[datos.length - 1].fecha)}
      </text>
    </svg>
  )
}
