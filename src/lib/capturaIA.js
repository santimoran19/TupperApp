// Captura para la carga con IA (1.27): achica la foto y graba la voz en el teléfono. Nada se guarda: va directo a la función.

export const LADO_IA = 1024
export const MAX_SEGUNDOS_VOZ = 30

// Foto -> { base64, mime }: se achica a 1024 px de lado mayor en JPEG (unos 150 KB). No se recorta: tiene que verse todo el plato.
export async function achicarParaIA(archivo) {
  if (!archivo || (archivo.type && !archivo.type.startsWith('image/'))) throw new Error('Eso no es una foto. Elegí una imagen.')
  if (archivo.size > 25 * 1024 * 1024) throw new Error('La foto es demasiado grande (más de 25 MB).')
  let imagen
  try {
    imagen = await createImageBitmap(archivo)
  } catch {
    throw new Error('No pude abrir esa foto. Probá con otra (JPG o PNG).')
  }
  const { ancho, alto } = ladoReducido(imagen.width, imagen.height, LADO_IA)
  const lienzo = document.createElement('canvas')
  lienzo.width = ancho
  lienzo.height = alto
  lienzo.getContext('2d').drawImage(imagen, 0, 0, ancho, alto)
  imagen.close?.()
  const blob = await new Promise((ok) => lienzo.toBlob(ok, 'image/jpeg', 0.82))
  if (!blob) throw new Error('No se pudo preparar la foto. Probá con otra.')
  return { base64: await aBase64(blob), mime: 'image/jpeg' }
}

// Las medidas al achicar para que el lado mayor no pase de `max` (sin agrandar)
export function ladoReducido(ancho, alto, max) {
  const k = Math.min(1, max / Math.max(ancho, alto))
  return { ancho: Math.max(1, Math.round(ancho * k)), alto: Math.max(1, Math.round(alto * k)) }
}

export function aBase64(blob) {
  return new Promise((ok, mal) => {
    const lector = new FileReader()
    lector.onload = () => ok(String(lector.result).split(',')[1] || '')
    lector.onerror = () => mal(new Error('No se pudo leer el archivo. Probá con otro.'))
    lector.readAsDataURL(blob)
  })
}

// ¿Se puede grabar voz en este navegador?
export const puedeGrabar = () =>
  typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== 'undefined'

// El formato de audio que acepta este navegador (Chrome: webm; Safari/iPhone: mp4)
export function formatoDeAudio() {
  for (const t of ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'])
    if (MediaRecorder.isTypeSupported?.(t)) return t
  return ''
}

// Empieza a grabar. Devuelve { parar(): Promise<{ base64, mime }>, cancelar() }. Corta sola a los 30 segundos (`alCortar` avisa).
export async function grabarVoz({ alCortar } = {}) {
  let flujo
  try {
    flujo = await navigator.mediaDevices.getUserMedia({ audio: true })
  } catch {
    throw new Error('No pude usar el micrófono. Revisá que el navegador tenga permiso.')
  }
  const formato = formatoDeAudio()
  const grabador = new MediaRecorder(flujo, formato ? { mimeType: formato } : undefined)
  const trozos = []
  grabador.ondataavailable = (e) => e.data.size && trozos.push(e.data)
  const soltar = () => flujo.getTracks().forEach((t) => t.stop())
  const terminado = new Promise((ok) => {
    grabador.onstop = () => {
      soltar()
      ok(new Blob(trozos, { type: grabador.mimeType || formato || 'audio/webm' }))
    }
  })
  grabador.start()
  const corte = setTimeout(() => {
    if (grabador.state === 'recording') {
      grabador.stop()
      alCortar?.()
    }
  }, MAX_SEGUNDOS_VOZ * 1000)
  return {
    async parar() {
      clearTimeout(corte)
      if (grabador.state === 'recording') grabador.stop()
      const blob = await terminado
      if (blob.size < 800) throw new Error('No se escuchó nada. Probá de nuevo.')
      return { base64: await aBase64(blob), mime: blob.type || 'audio/webm' }
    },
    cancelar() {
      clearTimeout(corte)
      if (grabador.state === 'recording') grabador.stop()
      soltar()
    },
  }
}
