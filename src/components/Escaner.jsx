// Lector de códigos de barras con la cámara. Se muestra adentro de la hoja de "Agregar" (reemplaza la lista mientras se escanea).
// En Android, Chrome trae su propio lector (BarcodeDetector). Donde no existe (iPhone, Firefox) se baja una librería
// recién cuando se abre el escáner, para que no pese en el resto de la app. Si no hay cámara o no se le da permiso,
// se puede escribir el código a mano.
import { useEffect, useRef, useState } from 'react'
import { Err, Icono } from './ui'
import { codigoValido, errCodigo, limpiarCodigo } from '../lib/codigo'

const FORMATOS = ['ean_13', 'ean_8', 'upc_a']

// Devuelve una función que mira un cuadro del video y da el código que encuentra (o null)
async function crearLector() {
  if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
    try {
      const soportados = (await window.BarcodeDetector.getSupportedFormats?.()) || FORMATOS
      const formats = FORMATOS.filter((f) => soportados.includes(f))
      if (formats.length > 0) {
        const detector = new window.BarcodeDetector({ formats })
        return async (video) => (await detector.detect(video))[0]?.rawValue ?? null
      }
    } catch {
      /* se usa la librería */
    }
  }
  const z = await import('@zxing/library')
  const lector = new z.MultiFormatReader()
  lector.setHints(
    new Map([
      [z.DecodeHintType.POSSIBLE_FORMATS, [z.BarcodeFormat.EAN_13, z.BarcodeFormat.EAN_8, z.BarcodeFormat.UPC_A]],
      [z.DecodeHintType.TRY_HARDER, true],
    ]),
  )
  const lienzo = document.createElement('canvas')
  return (video) => {
    const w = video.videoWidth
    const h = video.videoHeight
    if (!w || !h) return null
    lienzo.width = w
    lienzo.height = h
    lienzo.getContext('2d', { willReadFrequently: true }).drawImage(video, 0, 0, w, h)
    try {
      return lector.decodeWithState(new z.BinaryBitmap(new z.HybridBinarizer(new z.HTMLCanvasElementLuminanceSource(lienzo)))).getText()
    } catch {
      return null // casi todos los cuadros no tienen un código
    }
  }
}

const TEXTOS = {
  iniciando: 'Iniciando la cámara...',
  leyendo: 'Apuntá la cámara al código de barras, con buena luz.',
  negada: 'No pudimos usar la cámara. Revisá el permiso del navegador para este sitio o escribí el código.',
  sinCamara: 'No encontramos una cámara que se pueda usar. Escribí el código.',
}

export default function Escaner({ onCodigo, onVolver }) {
  const video = useRef(null)
  const alCodigo = useRef(onCodigo)
  alCodigo.current = onCodigo
  const [estado, setEstado] = useState('iniciando')
  const [escrito, setEscrito] = useState('')
  const [intento, setIntento] = useState(false)

  useEffect(() => {
    let vivo = true
    let flujo = null
    let timer = null
    async function arrancar() {
      if (!navigator.mediaDevices?.getUserMedia) return setEstado('sinCamara')
      try {
        flujo = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
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
      const leer = await crearLector()
      if (!vivo) return
      setEstado('leyendo')
      // Se pide que dos lecturas seguidas den el mismo código: una lectura suelta mal hecha no alcanza
      let ultimo = ''
      let veces = 0
      const vuelta = async () => {
        if (!vivo) return
        try {
          const c = limpiarCodigo((await leer(v)) || '')
          if (c && codigoValido(c)) {
            veces = c === ultimo ? veces + 1 : 1
            ultimo = c
            if (veces >= 2) {
              vivo = false
              navigator.vibrate?.(60)
              alCodigo.current(c)
              return
            }
          } else {
            veces = 0
          }
        } catch {
          /* un cuadro que falla no frena el escaneo */
        }
        timer = setTimeout(vuelta, 150)
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

  const error = intento ? errCodigo(escrito) : null
  function buscarEscrito(e) {
    e.preventDefault()
    setIntento(true)
    if (!errCodigo(escrito)) alCodigo.current(limpiarCodigo(escrito))
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
