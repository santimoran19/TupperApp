// Lector de códigos de barras con la cámara. Se muestra adentro de la hoja de "Agregar" (reemplaza la lista mientras se escanea).
// La lectura en sí (varios intentos por imagen: entera, ampliada, invertida) está en lib/lectura. Si la cámara no alcanza para un
// código chico, se puede acercar con el zoom (donde el teléfono lo permite), prender la linterna o sacarle una foto con la cámara
// del teléfono, que tiene mucha más definición. Si no hay cámara o no se le da permiso, se puede escribir el código a mano.
import { useEffect, useRef, useState } from 'react'
import { Err, Icono } from './ui'
import { codigoValido, errCodigo, limpiarCodigo } from '../lib/codigo'
import { PARA_VIDEO, crearLector, leerFoto } from '../lib/lectura'
import { anotarEvento } from '../lib/eventos'

// Una lectura suelta mal hecha no alcanza: el mismo código tiene que salir dos veces en este tiempo
const VENTANA = 3000
const PAUSA = 80

const TEXTOS = {
  iniciando: 'Iniciando la cámara...',
  leyendo: 'Apuntá la cámara al código de barras, con buena luz.',
  negada: 'No pudimos usar la cámara. Revisá el permiso del navegador para este sitio o escribí el código.',
  sinCamara: 'No encontramos una cámara que se pueda usar. Escribí el código.',
}

export default function Escaner({ onCodigo, onVolver }) {
  const video = useRef(null)
  const archivo = useRef(null)
  const pista = useRef(null) // la cámara en uso: de ahí salen el zoom y la linterna
  const alCodigo = useRef(onCodigo)
  alCodigo.current = onCodigo
  const [estado, setEstado] = useState('iniciando')
  const [escrito, setEscrito] = useState('')
  const [intento, setIntento] = useState(false)
  const [zoom, setZoom] = useState(null) // null | { min, max, step, valor }: solo en los teléfonos que dejan acercar
  const [linterna, setLinterna] = useState(null) // null (no tiene) | false (apagada) | true (prendida)
  const [foto, setFoto] = useState(null) // null | 'leyendo' | 'mal'

  useEffect(() => {
    let vivo = true
    let flujo = null
    let timer = null
    async function arrancar() {
      if (!navigator.mediaDevices?.getUserMedia) return setEstado('sinCamara')
      try {
        flujo = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false,
        })
      } catch (e) {
        if (vivo) setEstado(e?.name === 'NotAllowedError' || e?.name === 'SecurityError' ? 'negada' : 'sinCamara')
        return
      }
      if (!vivo) return flujo.getTracks().forEach((t) => t.stop())
      const v = video.current
      v.srcObject = flujo
      try {
        await v.play()
      } catch {
        /* algunos navegadores arrancan solos */
      }
      // Lo que la cámara permita: foco continuo, zoom y linterna (iPhone casi nada; muchos Android todo)
      try {
        const p = flujo.getVideoTracks()[0]
        pista.current = p
        const cap = p.getCapabilities?.() || {}
        if (cap.focusMode?.includes('continuous')) p.applyConstraints({ advanced: [{ focusMode: 'continuous' }] }).catch(() => {})
        if (cap.zoom && cap.zoom.max > cap.zoom.min)
          setZoom({ min: cap.zoom.min, max: cap.zoom.max, step: cap.zoom.step || 0.1, valor: p.getSettings?.().zoom ?? cap.zoom.min })
        if (cap.torch) setLinterna(false)
      } catch {
        /* sin controles: se lee igual */
      }
      const lector = await crearLector()
      if (!vivo) return
      setEstado('leyendo')
      // Se pide que el mismo código salga dos veces en pocos segundos: una lectura suelta mal hecha no alcanza.
      // Cada vuelta mira el cuadro de una manera distinta (ver lib/lectura); la que logra leer se repite.
      const vistos = []
      const inicio = Date.now()
      let manera = 0
      const vuelta = async () => {
        if (!vivo) return
        let leyo = false
        try {
          const c = await lector.leer(v, PARA_VIDEO[manera])
          if (c && codigoValido(c)) {
            leyo = true
            const ahora = Date.now()
            vistos.push({ c, t: ahora })
            while (vistos.length > 0 && ahora - vistos[0].t > VENTANA) vistos.shift()
            if (vistos.filter((x) => x.c === c).length >= 2) {
              vivo = false
              navigator.vibrate?.(60)
              anotarEvento('escaner_lectura', { via: 'camara', manera, ms: Date.now() - inicio })
              alCodigo.current(c)
              return
            }
          }
        } catch {
          /* un cuadro que falla no frena el escaneo */
        }
        if (!leyo) manera = (manera + 1) % PARA_VIDEO.length
        timer = setTimeout(vuelta, PAUSA)
      }
      vuelta()
    }
    arrancar().catch(() => vivo && setEstado('sinCamara'))
    return () => {
      vivo = false
      clearTimeout(timer)
      flujo?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  function acercar(valor) {
    setZoom((z) => z && { ...z, valor })
    pista.current?.applyConstraints({ advanced: [{ zoom: valor }] }).catch(() => {})
  }
  function alternarLinterna() {
    const prender = !linterna
    pista.current
      ?.applyConstraints({ advanced: [{ torch: prender }] })
      .then(() => setLinterna(prender))
      .catch(() => setLinterna(null)) // no la deja usar: se saca el botón
  }
  // La foto la saca la cámara del teléfono (enfoca de cerca y tiene mucha más definición que el video)
  async function leerLaFoto(e) {
    const f = e.target.files?.[0]
    e.target.value = ''
    if (!f) return
    setFoto('leyendo')
    try {
      const c = await leerFoto(f)
      if (c) {
        anotarEvento('escaner_lectura', { via: 'foto' })
        return alCodigo.current(c)
      }
    } catch {
      /* se avisa abajo */
    }
    anotarEvento('escaner_lectura', { via: 'foto_fallida' })
    setFoto('mal')
  }

  const error = intento ? errCodigo(escrito) : null
  function buscarEscrito(e) {
    e.preventDefault()
    setIntento(true)
    if (!errCodigo(escrito)) {
      anotarEvento('escaner_lectura', { via: 'escrito' })
      alCodigo.current(limpiarCodigo(escrito))
    }
  }

  return (
    <div className="space-y-3" data-tour="escaner">
      {(estado === 'iniciando' || estado === 'leyendo') && (
        <div className="relative rounded-2xl overflow-hidden bg-black aspect-[4/3]">
          <video ref={video} className="w-full h-full object-cover" playsInline muted aria-label="Vista de la cámara" />
          <div className="absolute inset-x-[10%] top-1/2 h-0.5 bg-red-500/80 pointer-events-none" aria-hidden="true" />
          <div className="absolute inset-[12%] rounded-xl border-2 border-white/70 pointer-events-none" aria-hidden="true" />
        </div>
      )}
      <p className="text-sm text-gris flex items-center gap-2" role="status">
        <Icono n="barcode_scanner" size={20} /> {TEXTOS[estado]}
      </p>
      {zoom && (
        <div className="flex items-center gap-3">
          <label htmlFor="esc-zoom" className="text-sm text-gris shrink-0">
            Zoom
          </label>
          <input
            id="esc-zoom"
            type="range"
            className="flex-1 accent-verde"
            min={zoom.min}
            max={zoom.max}
            step={zoom.step}
            value={zoom.valor}
            onChange={(e) => acercar(Number(e.target.value))}
          />
        </div>
      )}
      <div className="flex gap-2">
        <button type="button" onClick={() => archivo.current?.click()} disabled={foto === 'leyendo'} className="btn-suave flex-1">
          <Icono n="photo_camera" size={20} /> Sacarle una foto
        </button>
        {linterna !== null && (
          <button type="button" onClick={alternarLinterna} aria-pressed={linterna} className="btn-suave flex-1">
            <Icono n="flashlight_on" size={20} lleno={linterna} /> Linterna
          </button>
        )}
      </div>
      <input
        ref={archivo}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={leerLaFoto}
        aria-label="Foto del código"
      />
      {foto && (
        <p className="text-sm" role="status">
          {foto === 'leyendo'
            ? 'Leyendo la foto...'
            : 'No pudimos leer el código en esa foto. Probá de nuevo con el código bien enfocado y con buena luz, o escribí los números.'}
        </p>
      )}
      <p className="text-xs text-gris">¿Es un código chico o de colores? Acercalo despacio hasta que enfoque, o sacale una foto.</p>
      <form onSubmit={buscarEscrito} className="space-y-2" noValidate>
        <label className="etiqueta" htmlFor="esc-codigo">
          O escribí los números del código
        </label>
        <div className="flex gap-2">
          <input
            id="esc-codigo"
            className="campo flex-1"
            inputMode="numeric"
            autoComplete="off"
            maxLength={20}
            placeholder="Ej.: 7790070411570"
            value={escrito}
            onChange={(e) => setEscrito(e.target.value.replace(/[^\d\s-]/g, ''))}
          />
          <button type="submit" className="btn-primario">
            Buscar
          </button>
        </div>
        <Err>{error}</Err>
      </form>
      <button onClick={onVolver} className="btn-suave w-full">
        Volver
      </button>
    </div>
  )
}
