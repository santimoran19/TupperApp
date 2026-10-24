// El temporizador de ayuno del Diario (1.27): se elige el protocolo, se empieza, se ve cuánto pasó y se termina. Se guarda en
// el teléfono. No da consejos médicos: avisa para quién no es.
import { useEffect, useMemo, useState } from 'react'
import { Icono } from './ui'
import { useDatos } from '../store/Datos'
import { PROTOCOLOS, ayunoOlvidado, claveAyuno, duracionTexto, estadoAyuno, guardar, leer, protocoloDe, resumenAyunos } from '../lib/ayuno'
import { avisarCambioRecordatorios } from '../lib/useRecordatorios'

const INICIAL = { protocolo: '16', actual: null, historial: [] }

// Anillo de avance
function Anillo({ pct, hecho }) {
  const r = 34
  const c = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 80 80" className="w-20 h-20 shrink-0 -rotate-90" aria-hidden="true">
      <circle cx="40" cy="40" r={r} fill="none" strokeWidth="8" className="stroke-pista" />
      <circle
        cx="40"
        cy="40"
        r={r}
        fill="none"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct)}
        className={hecho ? 'stroke-verde' : 'stroke-teal'}
        style={{ transition: 'stroke-dashoffset .6s' }}
      />
    </svg>
  )
}

export default function Ayuno() {
  const d = useDatos()
  const clave = claveAyuno(d.usuario.id)
  const [est, setEst] = useState(() => leer(clave, INICIAL))
  const [ahora, setAhora] = useState(() => Date.now())
  const [aviso, setAviso] = useState(false)
  const [horaInicio, setHoraInicio] = useState('')

  useEffect(() => {
    if (!est.actual) return undefined
    const t = setInterval(() => setAhora(Date.now()), 30000)
    const alVolver = () => document.visibilityState === 'visible' && setAhora(Date.now())
    document.addEventListener('visibilitychange', alVolver)
    return () => {
      clearInterval(t)
      document.removeEventListener('visibilitychange', alVolver)
    }
  }, [est.actual])

  const cambiar = (nuevo) => {
    setEst(nuevo)
    guardar(clave, nuevo)
    // Para que el aviso de "cumpliste tu ayuno" (también el que llega con la app cerrada) se entere enseguida
    avisarCambioRecordatorios()
  }
  const proto = protocoloDe(est.protocolo)
  const e = est.actual ? estadoAyuno({ inicio: est.actual.inicio, horas: est.actual.horas, ahora }) : null
  const resumen = useMemo(() => resumenAyunos(est.historial, ahora), [est.historial, ahora])

  const empezar = () => {
    let inicio = Date.now()
    if (horaInicio) {
      // "Empecé a tal hora": si esa hora todavía no llegó hoy, fue ayer
      const [h, m] = horaInicio.split(':').map(Number)
      const t = new Date()
      t.setHours(h, m, 0, 0)
      inicio = t.getTime() > Date.now() ? t.getTime() - 86400000 : t.getTime()
    }
    setAhora(Date.now())
    cambiar({ ...est, actual: { inicio, horas: proto.ayuno } })
    setHoraInicio('')
  }
  const terminar = () => {
    const fin = Date.now()
    const hecho = { inicio: est.actual.inicio, fin, horas: est.actual.horas }
    cambiar({ ...est, actual: null, historial: [hecho, ...est.historial].slice(0, 30) })
    d.avisar(
      fin - hecho.inicio >= hecho.horas * 3600000 - 60000 ? '¡Ayuno cumplido!' : `Ayuno terminado: ${duracionTexto(fin - hecho.inicio)}`,
    )
  }
  const descartar = () => cambiar({ ...est, actual: null })

  return (
    <section className="tarjeta p-5 mb-4" aria-labelledby="ay-titulo" data-testid="ayuno">
      <div className="flex items-center justify-between gap-2">
        <h2 id="ay-titulo" className="font-semibold flex items-center gap-2">
          <Icono n="timer" size={20} className="text-teal" /> Ayuno
        </h2>
        {resumen.total > 0 && (
          <span className="text-xs text-gris">
            Esta semana: {resumen.cumplidos} de {resumen.total} cumplidos
          </span>
        )}
      </div>

      {!e ? (
        <>
          <div className="grid grid-cols-5 gap-1 bg-campo rounded-full p-1 mt-3" role="radiogroup" aria-label="Protocolo de ayuno">
            {PROTOCOLOS.map((p) => (
              <button
                key={p.id}
                role="radio"
                aria-checked={est.protocolo === p.id}
                onClick={() => cambiar({ ...est, protocolo: p.id })}
                className={`h-9 rounded-full text-[12.5px] font-semibold transition ${est.protocolo === p.id ? 'bg-superficie text-verde-texto shadow-tarjeta' : 'text-gris'}`}
              >
                {p.nombre}
              </button>
            ))}
          </div>
          <p className="text-xs text-gris mt-2">
            {proto.ayuno} horas sin comer y {24 - proto.ayuno} para comer · {proto.texto}
          </p>
          <div className="flex items-center gap-2 mt-3">
            <button onClick={empezar} className="btn-primario flex-1">
              <Icono n="play_arrow" size={20} /> Empezar ayuno
            </button>
            <label className="text-xs text-gris flex items-center gap-1">
              <span className="sr-only">Hora en que empezó</span>
              <input
                type="time"
                value={horaInicio}
                onChange={(ev) => setHoraInicio(ev.target.value)}
                aria-label="Empecé a las"
                className="h-12 rounded-xl bg-campo px-2 text-sm text-tinta"
              />
            </label>
          </div>
          <p className="text-[11px] text-gris mt-1">¿Ya empezaste? Poné la hora a la que dejaste de comer.</p>
        </>
      ) : (
        <div className="mt-3">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Anillo pct={e.pct} hecho={e.cumplido} />
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold tabular-nums">
                {Math.round(e.pct * 100)}%
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-2xl font-bold tabular-nums leading-tight" aria-live="off">
                {duracionTexto(e.pasado)}
              </p>
              <p className="text-sm text-gris">
                {e.cumplido
                  ? `¡Cumpliste las ${est.actual.horas} horas! +${duracionTexto(e.extra)}`
                  : `Faltan ${duracionTexto(e.restante)} para las ${est.actual.horas} h`}
              </p>
              <p className="text-xs text-gris">
                Empezó a las {new Date(est.actual.inicio).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                {!e.cumplido && ` · termina a las ${new Date(e.fin).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}`}
              </p>
            </div>
          </div>
          {ayunoOlvidado(est.actual.inicio, ahora) && (
            <p className="rounded-xl bg-naranja-suave text-naranja-oscuro text-sm p-3 mt-3">
              Pasaron más de 30 horas. ¿Te olvidaste de terminarlo? Si querés, descartalo.
            </p>
          )}
          <div className="flex gap-2 mt-3">
            <button onClick={terminar} className="btn-primario flex-1">
              <Icono n="stop" size={20} /> Terminé el ayuno
            </button>
            <button onClick={descartar} className="btn-suave" aria-label="Descartar este ayuno">
              <Icono n="close" size={20} />
            </button>
          </div>
        </div>
      )}

      <button onClick={() => setAviso(!aviso)} aria-expanded={aviso} className="text-xs text-gris mt-3 underline">
        ¿Es para mí?
      </button>
      {aviso && (
        <p className="text-xs text-gris mt-1 leading-snug">
          El ayuno no es para todas las personas: no lo hagas si estás embarazada o amamantando, si tomás medicación (sobre todo para la
          diabetes o la presión), si tuviste problemas con la comida o si te sentís mal. Consultalo con tu médico o nutricionista. Si te
          mareás o te sentís mal, cortalo y comé algo.
        </p>
      )}
    </section>
  )
}
