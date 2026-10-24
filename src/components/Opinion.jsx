// "Contanos qué te falta" (1.28, C-05): una idea, algo que anda mal u otra cosa. Llega a la tabla `opiniones` de Supabase.
import { useId, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Icono } from './ui'
import { useDatos } from '../store/Datos'

const TIPOS = [
  ['idea', 'Una idea'],
  ['problema', 'Algo anda mal'],
  ['otra', 'Otra cosa'],
]

export default function Opinion() {
  const d = useDatos()
  const ubicacion = useLocation()
  const id = useId()
  const [tipo, setTipo] = useState('idea')
  const [texto, setTexto] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [enviada, setEnviada] = useState(false)

  async function enviar(ev) {
    ev.preventDefault()
    if (texto.trim().length < 3) return
    setEnviando(true)
    const listo = await d.enviarOpinion({ tipo, texto, pantalla: ubicacion.pathname })
    setEnviando(false)
    if (listo) {
      setTexto('')
      setEnviada(true)
    }
  }

  return (
    <section className="tarjeta p-5 mb-4" aria-labelledby={`${id}-titulo`} data-testid="opinion">
      <h2 id={`${id}-titulo`} className="font-semibold flex items-center gap-2">
        <Icono n="rate_review" className="text-verde-texto" /> Contanos qué te falta
      </h2>
      {enviada ? (
        <div className="mt-2" role="status">
          <p className="text-sm">¡Gracias! Lo leemos todo y nos ayuda a decidir qué hacer primero.</p>
          <button onClick={() => setEnviada(false)} className="text-sm font-semibold text-verde-texto mt-2">
            Mandar otra
          </button>
        </div>
      ) : (
        <form onSubmit={enviar} className="mt-2">
          <p className="text-sm text-gris mb-3">Una idea, algo que no funciona o lo que quieras decirnos.</p>
          <div className="flex flex-wrap gap-2 mb-3" role="radiogroup" aria-label="Qué es">
            {TIPOS.map(([valor, nombre]) => (
              <button
                key={valor}
                type="button"
                role="radio"
                aria-checked={tipo === valor}
                onClick={() => setTipo(valor)}
                className={`rounded-full px-3 h-9 text-sm font-semibold ${tipo === valor ? 'bg-verde text-white' : 'bg-campo text-tinta'}`}
              >
                {nombre}
              </button>
            ))}
          </div>
          <label htmlFor={`${id}-texto`} className="sr-only">
            Tu mensaje
          </label>
          <textarea
            id={`${id}-texto`}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            maxLength={2000}
            rows={4}
            placeholder={tipo === 'problema' ? 'Qué pasó y en qué pantalla' : 'Contanos'}
            className="campo w-full h-auto! py-3 resize-y"
          />
          <p className="text-xs text-gris mt-1">No pongas datos personales que no hagan falta. Se guarda con tu cuenta.</p>
          <button type="submit" disabled={enviando || texto.trim().length < 3} className="btn-primario w-full mt-3">
            <Icono n="send" size={20} /> {enviando ? 'Mandando…' : 'Mandar'}
          </button>
        </form>
      )}
    </section>
  )
}
