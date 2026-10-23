// La silueta del cuerpo (1.24): se dibuja con el % de grasa y cambia con una animación suave cuando ese % cambia.
// Opcionalmente muestra otra silueta de fondo, más clara, para comparar: lo que sobresale es la diferencia.
import { useEffect, useId, useRef, useState } from 'react'
import { medidas, partes } from '../lib/silueta'

// Acompaña un valor con una animación corta (sin animación si la persona pidió reducir el movimiento)
export function useSuave(valor, ms = 380) {
  const [v, setV] = useState(valor)
  const desde = useRef(valor)
  const actual = useRef(valor)
  useEffect(() => {
    const quieto = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (quieto || !Number.isFinite(valor)) {
      actual.current = valor
      setV(valor)
      return
    }
    desde.current = actual.current
    const inicio = performance.now()
    let id
    const paso = (t) => {
      const k = Math.min(1, (t - inicio) / ms)
      const e = 1 - Math.pow(1 - k, 3)
      actual.current = desde.current + (valor - desde.current) * e
      setV(actual.current)
      if (k < 1) id = requestAnimationFrame(paso)
    }
    id = requestAnimationFrame(paso)
    return () => cancelAnimationFrame(id)
  }, [valor, ms])
  return v
}

// Las partes sueltas (sin grupo): así sirven también adentro de un clipPath
const formas = (p) => [
  <path key="b0" d={p.brazos[0]} />,
  <path key="b1" d={p.brazos[1]} />,
  <path key="p0" d={p.piernas[0]} />,
  <path key="p1" d={p.piernas[1]} />,
  <path key="c" d={p.cuello} />,
  <path key="t" d={p.torso} />,
  <ellipse key="h" cx={p.cabeza.cx} cy={p.cabeza.cy} rx={p.cabeza.rx} ry={p.cabeza.ry} />,
]

// `grasa`: % de grasa de la silueta principal. `comparar`: % de la de fondo (o null). `escala`: ancho según la masa magra.
export default function Silueta({ grasa, sexo = 'm', escala = 1, comparar = null, escalaComparar = escala, className = 'w-40', titulo }) {
  const id = useId().replace(/:/g, '')
  const g = useSuave(grasa)
  const e = useSuave(escala)
  const p = partes(medidas(g, sexo, e))
  const fondo = comparar != null ? partes(medidas(comparar, sexo, escalaComparar)) : null
  return (
    <svg viewBox="0 0 200 440" className={className} role="img" aria-label={titulo || `Silueta con ${Math.round(grasa)} % de grasa`}>
      <defs>
        <linearGradient id={`sil-${id}`} gradientUnits="userSpaceOnUse" x1="40" y1="20" x2="170" y2="430">
          <stop offset="0" stopColor="rgb(var(--c-verde-medio))" />
          <stop offset="1" stopColor="rgb(var(--c-verde))" />
        </linearGradient>
        <radialGradient id={`luz-${id}`} gradientUnits="userSpaceOnUse" cx="78" cy="120" r="210">
          <stop offset="0" stopColor="white" stopOpacity="0.28" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="432" rx="52" ry="6" fill="rgb(var(--c-tinta))" opacity="0.08" />
      {fondo && (
        <g fill="rgb(var(--c-naranja))" opacity="0.32">
          {formas(fondo)}
        </g>
      )}
      <g fill={`url(#sil-${id})`}>{formas(p)}</g>
      {/* El brillo va en un solo rectángulo recortado con la forma, para que no se note dónde se tocan las partes */}
      <clipPath id={`cuerpo-${id}`}>{formas(p)}</clipPath>
      <rect x="0" y="0" width="200" height="440" fill={`url(#luz-${id})`} clipPath={`url(#cuerpo-${id})`} />
    </svg>
  )
}
