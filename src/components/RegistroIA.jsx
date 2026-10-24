// "Cargar con IA" en Registrar (1.27): sacás una foto del plato, decís lo que comiste o lo escribís, y la app arma el plato con los
// alimentos y recetas que ya tiene. Siempre se revisa y se corrige antes de anotar: la IA se puede equivocar, sobre todo con las cantidades.
import { useRef, useState } from 'react'
import { Icono } from './ui'
import { useDatos } from '../store/Datos'
import { achicarParaIA, grabarVoz, puedeGrabar } from '../lib/capturaIA'
import { platosDe } from '../lib/registroIA'

const CLAVE_AVISO = 'tupper:ia-registro-aviso'
const leerAviso = () => {
  try {
    return localStorage.getItem(CLAVE_AVISO) === '1'
  } catch {
    return false
  }
}
const guardarAviso = () => {
  try {
    localStorage.setItem(CLAVE_AVISO, '1')
  } catch {
    /* sin almacenamiento: se vuelve a preguntar la próxima vez */
  }
}

// `onPlatos(platos, mensaje)`: recibe lo que se armó y el texto que lo explica. `sinTarjeta`: para meterlo adentro de otra
// tarjeta (la carga rápida del Diario, 1.28), sin su propio recuadro ni título.
export default function RegistroIA({ onPlatos, sinTarjeta = false }) {
  const d = useDatos()
  const [estado, setEstado] = useState('libre') // libre | grabando | trabajando
  const [escribiendo, setEscribiendo] = useState(false)
  const [texto, setTexto] = useState('')
  const [mensaje, setMensaje] = useState(null) // { tipo: 'ok' | 'error', texto }
  const [aceptado, setAceptado] = useState(leerAviso)
  const archivo = useRef(null)
  const grabacion = useRef(null)

  const resolver = async (cuerpo) => {
    setEstado('trabajando')
    setMensaje(null)
    const r = await d.leerComidaIA({ ...cuerpo })
    setEstado('libre')
    if (r.error) return setMensaje({ tipo: 'error', texto: r.error })
    const { platos, sinCruzar } = platosDe(r.items, { alimentos: d.alimentos, recetas: d.recetas })
    if (platos.length === 0 && sinCruzar.length === 0)
      return setMensaje({ tipo: 'error', texto: 'No encontré comida ahí. Probá de nuevo o cargala a mano.' })
    setEscribiendo(false)
    setTexto('')
    const partes = []
    if (r.texto) partes.push(`Escuché: “${r.texto}”.`)
    if (platos.length) partes.push(`Armé ${platos.length === 1 ? '1 ítem' : `${platos.length} ítems`}: revisá las cantidades.`)
    if (sinCruzar.length) partes.push(`No encontré en tus alimentos: ${sinCruzar.map((i) => i.nombre).join(', ')}. Buscalos a mano.`)
    const nuevo = { tipo: platos.length ? 'ok' : 'error', texto: partes.join(' ') }
    setMensaje(nuevo)
    if (platos.length) onPlatos(platos, nuevo)
  }

  const alElegirFoto = async (e) => {
    const f = e.target.files?.[0]
    e.target.value = ''
    if (!f) return
    try {
      setEstado('trabajando')
      const { base64, mime } = await achicarParaIA(f)
      await resolver({ tipo: 'foto', imagen: base64, mime })
    } catch (err) {
      setEstado('libre')
      setMensaje({ tipo: 'error', texto: err.message })
    }
  }
  const empezarVoz = async () => {
    setMensaje(null)
    try {
      grabacion.current = await grabarVoz({ alCortar: () => terminarVoz() })
      setEstado('grabando')
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.message })
    }
  }
  const terminarVoz = async () => {
    const g = grabacion.current
    grabacion.current = null
    if (!g) return
    try {
      setEstado('trabajando')
      const { base64, mime } = await g.parar()
      await resolver({ tipo: 'voz', audio: base64, mime })
    } catch (err) {
      setEstado('libre')
      setMensaje({ tipo: 'error', texto: err.message })
    }
  }
  const cancelarVoz = () => {
    grabacion.current?.cancelar()
    grabacion.current = null
    setEstado('libre')
  }
  const enviarTexto = (e) => {
    e.preventDefault()
    if (texto.trim().length >= 2) resolver({ tipo: 'texto', texto: texto.trim() })
  }

  if (!aceptado) {
    return (
      <section className={sinTarjeta ? '' : 'tarjeta p-4 mb-4'} data-testid="ia-aviso">
        {!sinTarjeta && (
          <p className="font-semibold flex items-center gap-2">
            <Icono n="wand_stars" size={20} className="text-teal" /> Cargar con IA
          </p>
        )}
        <p className="text-sm text-gris mt-1 leading-snug">
          Sacale una foto a tu plato, decí lo que comiste o escribilo, y la app arma el plato. La foto, el audio o el texto se mandan a un
          servicio de IA solo para reconocer la comida; <b>no se guardan</b>. La IA se puede equivocar, sobre todo con las cantidades:
          siempre revisá antes de anotar.
        </p>
        <button
          onClick={() => {
            guardarAviso()
            setAceptado(true)
          }}
          className="btn-primario w-full mt-3"
        >
          Entendido
        </button>
      </section>
    )
  }

  const ocupado = estado !== 'libre'
  return (
    <section
      className={sinTarjeta ? '' : 'tarjeta p-4 mb-4'}
      aria-labelledby={sinTarjeta ? undefined : 'ia-titulo'}
      aria-label={sinTarjeta ? 'Cargar con IA' : undefined}
      data-testid="registro-ia"
    >
      {!sinTarjeta && (
        <p id="ia-titulo" className="font-semibold flex items-center gap-2 mb-3">
          <Icono n="wand_stars" size={20} className="text-teal" /> Cargar con IA
        </p>
      )}

      {estado === 'grabando' ? (
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-coral animate-pulse" aria-hidden="true" />
          <p className="flex-1 text-sm">Escuchando… contá qué comiste y cuánto.</p>
          <button onClick={cancelarVoz} className="btn-suave h-10! px-4!" aria-label="Cancelar la grabación">
            <Icono n="close" size={18} />
          </button>
          <button onClick={terminarVoz} className="btn-primario h-10! px-4!">
            <Icono n="stop" size={18} /> Listo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          <button onClick={() => archivo.current?.click()} disabled={ocupado} className="btn-suave flex-col h-auto! py-3 gap-1!">
            <Icono n="photo_camera" size={22} />
            <span className="text-xs">Foto</span>
          </button>
          <button onClick={empezarVoz} disabled={ocupado || !puedeGrabar()} className="btn-suave flex-col h-auto! py-3 gap-1!">
            <Icono n="mic" size={22} />
            <span className="text-xs">Voz</span>
          </button>
          <button
            onClick={() => setEscribiendo(!escribiendo)}
            disabled={ocupado}
            aria-pressed={escribiendo}
            className="btn-suave flex-col h-auto! py-3 gap-1!"
          >
            <Icono n="edit" size={22} />
            <span className="text-xs">Escribir</span>
          </button>
        </div>
      )}
      <input
        ref={archivo}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={alElegirFoto}
        className="sr-only"
        aria-label="Foto del plato"
        tabIndex={-1}
      />

      {escribiendo && estado === 'libre' && (
        <form onSubmit={enviarTexto} className="flex gap-2 mt-3">
          <input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            maxLength={600}
            placeholder="Ej: dos milanesas con ensalada y un vaso de agua"
            aria-label="Qué comiste"
            className="flex-1 min-w-0 h-11 rounded-xl bg-campo px-3 text-sm"
          />
          <button type="submit" disabled={texto.trim().length < 2} className="btn-primario h-11! px-4!">
            Armar
          </button>
        </form>
      )}

      {estado === 'trabajando' && (
        <p className="text-sm text-gris mt-3 flex items-center gap-2" role="status">
          <Icono n="hourglass_empty" size={18} /> Leyendo tu comida…
        </p>
      )}
      {mensaje && (
        <p
          className={`text-sm mt-3 rounded-xl p-3 ${mensaje.tipo === 'ok' ? 'bg-verde-suave text-verde-texto' : 'bg-naranja-suave text-naranja-oscuro'}`}
          role="status"
        >
          {mensaje.texto}
        </p>
      )}
    </section>
  )
}
