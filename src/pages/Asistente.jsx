// Asistente con IA (1.28, IA-01): preguntas como "¿qué ceno con lo que me queda?" o "¿puedo comer un alfajor?", con los
// datos del día. La conversación queda solo en este teléfono mientras la pestaña está abierta; no se guarda en la base.
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Marco from '../components/Marco'
import { Icono } from '../components/ui'
import { useDatos } from '../store/Datos'
import { armarContexto } from '../lib/contextoIA'

const CLAVE_AVISO = 'tupper:asistente-aviso'
const SUGERENCIAS = [
  '¿Qué ceno con lo que me queda en la despensa?',
  '¿Puedo comer un alfajor ahora?',
  '¿Cómo llego a la proteína de hoy?',
  'Armame una merienda con lo que tengo',
]
const MAX_LARGO = 1000

const leer = (clave, porDefecto) => {
  try {
    const v = sessionStorage.getItem(clave)
    return v ? JSON.parse(v) : porDefecto
  } catch {
    return porDefecto
  }
}
const guardar = (clave, valor) => {
  try {
    sessionStorage.setItem(clave, JSON.stringify(valor))
  } catch {
    /* sin almacenamiento: la conversación vive solo mientras esté la pantalla */
  }
}
const avisoVisto = () => {
  try {
    return localStorage.getItem(CLAVE_AVISO) === '1'
  } catch {
    return false
  }
}

// Una respuesta en texto plano: párrafos y listas con guiones
function Texto({ children }) {
  const bloques = String(children).split(/\n{2,}/)
  return bloques.map((b, i) => {
    const lineas = b.split('\n')
    if (lineas.every((l) => /^\s*[-•*]\s+/.test(l)))
      return (
        <ul key={i} className="list-disc pl-5 space-y-0.5 my-1">
          {lineas.map((l, j) => (
            <li key={j}>{l.replace(/^\s*[-•*]\s+/, '')}</li>
          ))}
        </ul>
      )
    return (
      <p key={i} className="my-1 whitespace-pre-line">
        {b}
      </p>
    )
  })
}

export default function Asistente() {
  const d = useDatos()
  const claveChat = `tupper:asistente:${d.usuario?.id || ''}`
  const [mensajes, setMensajes] = useState(() => leer(claveChat, []))
  const [texto, setTexto] = useState('')
  const [trabajando, setTrabajando] = useState(false)
  const [error, setError] = useState(null)
  const [restantes, setRestantes] = useState(null)
  const [aceptado, setAceptado] = useState(avisoVisto)
  const final = useRef(null)
  const campo = useRef(null)

  useEffect(() => {
    guardar(claveChat, mensajes)
    final.current?.scrollIntoView?.({ block: 'end', behavior: 'smooth' })
  }, [mensajes, claveChat])

  // El contexto se arma al mandar (con los datos de ese momento); acá solo para saber si hay algo en la despensa
  const hayDespensa = useMemo(() => d.stock.some((s) => Number(s.qty) > 0), [d.stock])

  async function preguntar(pregunta) {
    const q = String(pregunta || '')
      .trim()
      .slice(0, MAX_LARGO)
    if (q.length < 2 || trabajando) return
    const nuevos = [...mensajes, { role: 'user', content: q }]
    setMensajes(nuevos)
    setTexto('')
    setError(null)
    setTrabajando(true)
    const r = await d.preguntarIA({ mensajes: nuevos.slice(-12), contexto: armarContexto(d) })
    setTrabajando(false)
    if (r.error) {
      setError(r.error)
      // La pregunta queda en el campo para volver a mandarla
      setMensajes(mensajes)
      setTexto(q)
      return
    }
    setMensajes([...nuevos, { role: 'assistant', content: r.respuesta }])
    if (r.restantes != null) setRestantes(r.restantes)
  }

  if (!aceptado) {
    return (
      <Marco titulo="Asistente" atras sinNav>
        <section className="tarjeta p-5 max-w-[560px] mx-auto" data-testid="asistente-aviso">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Icono n="forum" className="text-teal" /> Preguntale a la IA
          </h2>
          <p className="text-sm text-gris mt-2 leading-relaxed">
            Te responde con tus datos de hoy: tu objetivo, lo que comiste, tu despensa y tu plan. Para eso, tus preguntas y ese resumen (sin
            tu nombre ni tu email) se mandan a un servicio de inteligencia artificial (Google Gemini o Groq). La conversación no se guarda
            en la app. La IA puede equivocarse y no reemplaza a un médico ni a un nutricionista.
          </p>
          <button
            onClick={() => {
              try {
                localStorage.setItem(CLAVE_AVISO, '1')
              } catch {
                /* se vuelve a mostrar la próxima vez */
              }
              setAceptado(true)
            }}
            className="btn-primario w-full mt-4"
          >
            Entendido
          </button>
        </section>
      </Marco>
    )
  }

  return (
    <Marco titulo="Asistente" atras sinNav>
      <div className="max-w-[640px] mx-auto pb-28" data-testid="asistente">
        {mensajes.length === 0 && (
          <section className="tarjeta p-5 mb-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Icono n="forum" className="text-teal" /> ¿En qué te ayudo?
            </h2>
            <p className="text-sm text-gris mt-1">
              Sé lo que comiste hoy, lo que te falta{hayDespensa ? ' y lo que tenés en la despensa' : ''}. Probá con una de estas:
            </p>
            <div className="flex flex-col gap-2 mt-3">
              {SUGERENCIAS.map((s) => (
                <button key={s} onClick={() => preguntar(s)} className="text-left rounded-2xl bg-campo px-4 py-3 text-sm font-medium">
                  {s}
                </button>
              ))}
            </div>
          </section>
        )}

        <ol className="space-y-3" aria-live="polite" aria-label="Conversación">
          {mensajes.map((m, i) => (
            <li key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-3xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === 'user' ? 'bg-verde text-white rounded-br-lg' : 'bg-superficie shadow-tarjeta rounded-bl-lg'
                }`}
              >
                <span className="sr-only">{m.role === 'user' ? 'Vos: ' : 'Asistente: '}</span>
                {m.role === 'user' ? m.content : <Texto>{m.content}</Texto>}
              </div>
            </li>
          ))}
          {trabajando && (
            <li className="flex justify-start" role="status">
              <div className="rounded-3xl rounded-bl-lg bg-superficie shadow-tarjeta px-4 py-3 text-sm text-gris flex items-center gap-2">
                <Icono n="hourglass_empty" size={18} /> Pensando…
              </div>
            </li>
          )}
        </ol>
        <div ref={final} />

        {error && (
          <p className="text-sm mt-3 rounded-xl p-3 bg-naranja-suave text-naranja-oscuro" role="alert">
            {error}
          </p>
        )}
        {mensajes.length > 0 && (
          <div className="flex items-center justify-between mt-4 text-xs text-gris">
            <span>{restantes != null ? `Te quedan ${restantes} preguntas hoy.` : 'Las respuestas son orientativas.'}</span>
            <button
              onClick={() => {
                setMensajes([])
                setError(null)
              }}
              className="font-semibold text-verde-texto px-2 h-8"
            >
              Empezar de nuevo
            </button>
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          preguntar(texto)
        }}
        className="fixed left-0 right-0 lg:left-64 bottom-0 z-40 bg-superficie border-t border-linea px-4 pt-3 pb-seguro"
      >
        <div className="max-w-[640px] mx-auto flex gap-2 pb-3">
          <label htmlFor="asistente-campo" className="sr-only">
            Tu pregunta
          </label>
          <input
            id="asistente-campo"
            ref={campo}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            maxLength={MAX_LARGO}
            placeholder="Escribí tu pregunta"
            autoComplete="off"
            className="flex-1 min-w-0 h-12 rounded-2xl bg-campo px-4 text-sm"
          />
          <button
            type="submit"
            disabled={trabajando || texto.trim().length < 2}
            className="btn-primario !h-12 !w-12 !px-0 shrink-0"
            aria-label="Mandar"
          >
            <Icono n="send" size={22} />
          </button>
        </div>
        <p className="max-w-[640px] mx-auto text-[11px] text-gris pb-2 -mt-1">
          No reemplaza a un profesional de la salud.{' '}
          <Link to="/privacidad" className="underline">
            Qué se manda
          </Link>
        </p>
      </form>
    </Marco>
  )
}
