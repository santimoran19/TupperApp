// El mapa de músculos (1.24): el cuerpo de frente y de espalda con cada grupo muscular pintado según cuánto se entrenó
// (modo "ver") o para tocar y marcar qué se trabajó (modo "elegir"). Debajo van los mismos grupos como botones, para
// quien no puede tocar el dibujo (lector de pantalla, teclado).
import { useMemo } from 'react'
import { medidas, partes } from '../lib/silueta'
import { GRUPOS_MUSCULARES, intensidad, textoDeTrabajo, zonas } from '../lib/musculos'
import { Icono } from './ui'

function Base({ p }) {
  return (
    <g fill="rgb(var(--c-pista))">
      <path d={p.brazos[0]} />
      <path d={p.brazos[1]} />
      <path d={p.piernas[0]} />
      <path d={p.piernas[1]} />
      <path d={p.cuello} />
      <path d={p.torso} />
      <ellipse cx={p.cabeza.cx} cy={p.cabeza.cy} rx={p.cabeza.rx} ry={p.cabeza.ry} />
    </g>
  )
}

// `valores`: Map grupo -> { series, sesiones } (modo ver). `seleccion`: Set de grupos marcados. `onTocar(grupo)`.
export default function MapaMuscular({ sexo = 'm', modo = 'ver', valores = new Map(), seleccion = new Set(), onTocar, activo = null }) {
  const s = sexo === 'f' ? 'f' : 'm'
  const base = useMemo(() => partes(medidas(s === 'f' ? 22 : 14, s)), [s])
  const vistas = useMemo(
    () => [
      ['frente', 'De frente', zonas('frente', s)],
      ['espalda', 'De espalda', zonas('espalda', s)],
    ],
    [s],
  )
  const nombre = (g) => GRUPOS_MUSCULARES.find(([k]) => k === g)?.[1] || g

  const color = (g) => {
    if (modo === 'elegir') return seleccion.has(g) ? 'rgb(var(--c-coral))' : 'rgb(var(--c-gris) / 0.16)'
    const i = intensidad(valores.get(g))
    return i === 0 ? 'rgb(var(--c-gris) / 0.16)' : `rgb(var(--c-verde) / ${0.25 + i * 0.75})`
  }
  const etiqueta = (g) =>
    modo === 'elegir' ? `${nombre(g)}${seleccion.has(g) ? ', marcado' : ''}` : `${nombre(g)}: ${textoDeTrabajo(valores.get(g))}`
  const tecla = (g) => (ev) => {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault()
      onTocar?.(g)
    }
  }

  return (
    <div>
      <div className="flex justify-center gap-3">
        {vistas.map(([clave, titulo, z]) => (
          <figure key={clave} className="flex flex-col items-center">
            <svg viewBox="20 0 160 440" className="w-32 sm:w-36" aria-label={`Músculos ${titulo.toLowerCase()}`} role="group">
              <Base p={base} />
              {Object.entries(z).map(([g, trazos]) => (
                <g
                  key={g}
                  role={onTocar ? 'button' : 'img'}
                  tabIndex={onTocar ? 0 : undefined}
                  aria-label={etiqueta(g)}
                  aria-pressed={modo === 'elegir' ? seleccion.has(g) : undefined}
                  onClick={onTocar ? () => onTocar(g) : undefined}
                  onKeyDown={onTocar ? tecla(g) : undefined}
                  className={`${onTocar ? 'cursor-pointer outline-hidden focus-visible:opacity-70' : ''} transition-[fill] duration-300`}
                  fill={color(g)}
                  stroke={activo === g ? 'rgb(var(--c-tinta))' : 'rgb(var(--c-superficie))'}
                  strokeWidth={activo === g ? 2 : 1.2}
                >
                  {trazos.map((d, i) => (
                    <path key={i} d={d} />
                  ))}
                </g>
              ))}
            </svg>
            <figcaption className="text-[11px] text-gris -mt-1">{titulo}</figcaption>
          </figure>
        ))}
      </div>
      {modo === 'elegir' && (
        <div className="flex flex-wrap gap-1.5 mt-3" role="group" aria-label="Músculos que trabajaste">
          {GRUPOS_MUSCULARES.map(([g, t]) => (
            <button
              key={g}
              type="button"
              aria-pressed={seleccion.has(g)}
              onClick={() => onTocar?.(g)}
              className={`btn-chico h-8 ${seleccion.has(g) ? 'bg-coral text-white' : 'bg-campo text-tinta'}`}
            >
              {seleccion.has(g) && <Icono n="check" size={14} />} {t}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
