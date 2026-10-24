// Carrusel de consejos de la despensa (1.30): cómo guardar lo que tenés para que dure más y cómo aprovechar lo que está
// por vencer. Se desliza con el dedo (o con las flechas en la compu); no pasa solo, así da tiempo a leer.
import { useEffect, useRef, useState } from 'react'
import { Icono } from './ui'
import Foto from './Foto'

const TIPOS = {
  vence: { titulo: 'ANTES DE QUE VENZA', icono: 'schedule', clase: 'text-naranja-oscuro' },
  guardar: { titulo: 'PARA QUE DURE MÁS', icono: 'lightbulb', clase: 'text-verde-texto' },
  aprovechar: { titulo: 'PARA APROVECHARLO', icono: 'restaurant', clase: 'text-teal-oscuro' },
  general: { titulo: 'UN TIP', icono: 'lightbulb', clase: 'text-verde-texto' },
}

export default function CarruselConsejos({ consejos }) {
  const pista = useRef(null)
  const [actual, setActual] = useState(0)
  const total = consejos.length

  // Cuál se está viendo: el que está más cerca del borde izquierdo de la pista
  useEffect(() => {
    const el = pista.current
    if (!el) return undefined
    let cuadro = 0
    const medir = () => {
      cancelAnimationFrame(cuadro)
      cuadro = requestAnimationFrame(() => {
        const ancho = el.firstElementChild?.getBoundingClientRect().width || el.clientWidth
        setActual(Math.max(0, Math.min(total - 1, Math.round(el.scrollLeft / (ancho + 12)))))
      })
    }
    el.addEventListener('scroll', medir, { passive: true })
    return () => {
      el.removeEventListener('scroll', medir)
      cancelAnimationFrame(cuadro)
    }
  }, [total])

  const ir = (i) => {
    const el = pista.current
    const destino = el?.children[Math.max(0, Math.min(total - 1, i))]
    if (!el || !destino) return
    const quieto = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    el.scrollTo({ left: destino.offsetLeft - el.offsetLeft, behavior: quieto ? 'auto' : 'smooth' })
    setActual(Math.max(0, Math.min(total - 1, i)))
  }

  if (total === 0) return null
  return (
    <section className="tarjeta p-4 mb-4" aria-roledescription="carrusel" aria-label="Consejos para tu despensa" data-testid="consejos">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-bold flex items-center gap-2">
          <Icono n="lightbulb" className="text-verde-texto" /> Consejos para tu despensa
        </h2>
        {total > 1 && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => ir(actual - 1)}
              disabled={actual === 0}
              className="toque w-8 h-8 rounded-full bg-campo text-tinta flex items-center justify-center disabled:opacity-40"
              aria-label="Consejo anterior"
            >
              <Icono n="chevron_left" size={20} />
            </button>
            <button
              type="button"
              onClick={() => ir(actual + 1)}
              disabled={actual === total - 1}
              className="toque w-8 h-8 rounded-full bg-campo text-tinta flex items-center justify-center disabled:opacity-40"
              aria-label="Consejo siguiente"
            >
              <Icono n="chevron_right" size={20} />
            </button>
          </div>
        )}
      </div>
      <div
        ref={pista}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory sin-scroll mt-3 -mx-1 px-1 pb-1"
        tabIndex={0}
        aria-label="Deslizá para ver más consejos"
      >
        {consejos.map((c, i) => {
          const tipo = TIPOS[c.tipo] || TIPOS.general
          return (
            <article
              key={c.id}
              role="group"
              aria-roledescription="consejo"
              aria-label={`${i + 1} de ${total}`}
              className="snap-start shrink-0 w-full rounded-2xl bg-campo p-3.5"
              data-testid="consejo"
            >
              <p className={`text-[11px] font-bold tracking-wider flex items-center gap-1.5 ${tipo.clase}`}>
                <Icono n={tipo.icono} size={16} /> {tipo.titulo}
                {c.estado?.texto && c.tipo === 'vence' && (
                  <span className="font-semibold normal-case tracking-normal">· {c.estado.texto}</span>
                )}
              </p>
              <div className="flex items-start gap-3 mt-2">
                {c.alimento ? (
                  <Foto
                    ruta={c.alimento.image_path}
                    categoria={c.alimento.category}
                    para={c.alimento.name}
                    className="w-12 h-12 rounded-xl shrink-0"
                    icono={22}
                  />
                ) : (
                  <span className="w-12 h-12 rounded-xl bg-superficie text-verde-texto flex items-center justify-center shrink-0">
                    <Icono n="kitchen" size={24} />
                  </span>
                )}
                <div className="min-w-0">
                  {c.alimento && <h3 className="font-semibold leading-snug">{c.alimento.name}</h3>}
                  <p className="text-sm text-gris mt-0.5 leading-snug">{c.texto}</p>
                </div>
              </div>
            </article>
          )
        })}
      </div>
      {total > 1 && (
        <div className="flex justify-center gap-1.5 mt-3" aria-hidden="true">
          {consejos.map((c, i) => (
            <span key={c.id} className={`h-1.5 rounded-full transition-all ${i === actual ? 'w-5 bg-verde' : 'w-1.5 bg-pista'}`} />
          ))}
        </div>
      )}
      <p className="sr-only" aria-live="polite">
        Consejo {actual + 1} de {total}
      </p>
    </section>
  )
}
