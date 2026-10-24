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

// La regla de la altura (1.28): de la coronilla a los pies del dibujo, con una marca cada 10 cm
const REGLA = { x: 218, arriba: 10, abajo: 426 }
const metros = (cm) => (cm / 100).toFixed(2).replace('.', ',')

// `grasa`: % de grasa de la silueta principal. `comparar`: % de la de fondo (o null). `escala`: ancho según la masa magra.
// `altura` (cm): si está, se dibuja al lado una regla con la altura.
export default function Silueta({
  grasa,
  sexo = 'm',
  escala = 1,
  comparar = null,
  escalaComparar = escala,
  className = 'w-40',
  titulo,
  altura = null,
}) {
  const id = useId().replace(/:/g, '')
  const g = useSuave(grasa)
  const e = useSuave(escala)
  const p = partes(medidas(g, sexo, e))
  const fondo = comparar != null ? partes(medidas(comparar, sexo, escalaComparar)) : null
  const conRegla = altura > 0
  const marcas = conRegla
    ? Array.from({ length: Math.floor(altura / 10) + 1 }, (_, i) => REGLA.abajo - ((REGLA.abajo - REGLA.arriba) * i * 10) / altura)
    : []
  const nombre = titulo || `Silueta con ${Math.round(grasa)} % de grasa`
  return (
    <svg
      viewBox={conRegla ? '0 -18 240 458' : '0 0 200 440'}
      className={className}
      role="img"
      aria-label={conRegla ? `${nombre}, ${metros(altura)} metros de altura` : nombre}
    >
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
      {conRegla && (
        <g stroke="rgb(var(--c-gris))" strokeWidth="1.5" data-testid="regla-altura" aria-hidden="true">
          <line x1={REGLA.x} y1={REGLA.arriba} x2={REGLA.x} y2={REGLA.abajo} />
          {marcas.map((y, i) => (
            <line key={i} x1={REGLA.x - (i % 5 === 0 ? 7 : 4)} y1={y} x2={REGLA.x} y2={y} />
          ))}
          <line x1={REGLA.x - 10} y1={REGLA.arriba} x2={REGLA.x + 6} y2={REGLA.arriba} strokeWidth="2" />
          <line x1={REGLA.x - 10} y1={REGLA.abajo} x2={REGLA.x + 6} y2={REGLA.abajo} strokeWidth="2" />
          <text x={REGLA.x - 2} y="-4" textAnchor="middle" fontSize="15" fontWeight="700" fill="rgb(var(--c-tinta))" stroke="none">
            {metros(altura)} m
          </text>
        </g>
      )}
    </svg>
  )
}
