// Lectura de códigos de barras en una imagen (un cuadro de la cámara o una foto).
// Un código chico, de colores o de barras claras sobre fondo oscuro es difícil de leer con un solo intento, así que cada
// imagen se prueba de varias maneras: entera, y con el centro recortado y agrandado (un código chico gana barras más
// anchas); y cada una normal e invertida (blanco sobre oscuro). En Android se usa además el lector del propio navegador.
// El lector de la librería se baja recién cuando se abre el escáner, para que no pese en el resto de la app.
import { codigoValido, limpiarCodigo } from './codigo'

const FORMATOS = ['ean_13', 'ean_8', 'upc_a']

// Cómo se mira cada imagen. `recorte` es la parte central que se toma (ancho y alto, de 0 a 1) y `ancho` los píxeles
// a los que se lleva esa parte (null: se deja como está). Se agranda solo cuando hace falta: nunca se achica de más.
export const PARA_VIDEO = [
  { recorte: [1, 1], ancho: null },
  { recorte: [0.6, 0.5], ancho: 1500 },
  { recorte: [0.6, 0.5], ancho: 2300 },
]
// Una foto del teléfono es muy grande (12 megapíxeles): se achica para que el lector no se ahogue
export const PARA_FOTO = [
  { recorte: [1, 1], ancho: 2000 },
  { recorte: [1, 1], ancho: 1200 },
  { recorte: [0.7, 0.45], ancho: 2300 },
  { recorte: [1, 0.5], ancho: 1600 },
  { recorte: [1, 1], ancho: 3000 },
]

const medidas = (f) => ({ w: f.videoWidth || f.naturalWidth || f.width || 0, h: f.videoHeight || f.naturalHeight || f.height || 0 })

// Dibuja en `lienzo` la parte de `fuente` que pide la estrategia
function dibujar(fuente, lienzo, { recorte, ancho }) {
  const { w, h } = medidas(fuente)
  if (!w || !h) return false
  const sw = Math.round(w * recorte[0])
  const sh = Math.round(h * recorte[1])
  const sx = Math.round((w - sw) / 2)
  const sy = Math.round((h - sh) / 2)
  // Al agrandar se llega al ancho pedido; al achicar también, pero un cuadro de video chico no se agranda de más
  const k = ancho ? ancho / sw : 1
  lienzo.width = Math.max(1, Math.round(sw * k))
  lienzo.height = Math.max(1, Math.round(sh * k))
  const g = lienzo.getContext('2d', { willReadFrequently: true })
  g.imageSmoothingEnabled = true
  g.imageSmoothingQuality = 'high'
  g.drawImage(fuente, sx, sy, sw, sh, 0, 0, lienzo.width, lienzo.height)
  return true
}

// Devuelve { leer(fuente, estrategia) }: da el código que encuentra (texto) o null
export async function crearLector() {
  let nativo = null
  if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
    try {
      const soportados = (await window.BarcodeDetector.getSupportedFormats?.()) || FORMATOS
      const formats = FORMATOS.filter((f) => soportados.includes(f))
      if (formats.length > 0) nativo = new window.BarcodeDetector({ formats })
    } catch {
      /* se usa solo la librería */
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

  const conLibreria = (invertido) => {
    try {
      let fuente = new z.HTMLCanvasElementLuminanceSource(lienzo)
      if (invertido) fuente = new z.InvertedLuminanceSource(fuente)
      return lector.decodeWithState(new z.BinaryBitmap(new z.HybridBinarizer(fuente))).getText()
    } catch {
      return null // casi todos los cuadros no tienen un código
    }
  }

  return {
    async leer(fuente, estrategia = PARA_VIDEO[0]) {
      if (!dibujar(fuente, lienzo, estrategia)) return null
      if (nativo) {
        try {
          const c = (await nativo.detect(lienzo))[0]?.rawValue
          if (c && codigoValido(c)) return limpiarCodigo(c)
        } catch {
          /* sigue con la librería */
        }
      }
      for (const invertido of [false, true]) {
        const c = conLibreria(invertido)
        if (c && codigoValido(c)) return limpiarCodigo(c)
      }
      return null
    },
  }
}

// Abre una foto (archivo) como imagen, respetando hacia dónde estaba girado el teléfono
async function abrirImagen(archivo) {
  try {
    return await createImageBitmap(archivo, { imageOrientation: 'from-image' })
  } catch {
    return await createImageBitmap(archivo) // navegadores que no aceptan la opción
  }
}

// Busca un código de barras en la foto. Devuelve el código o null si no encontró ninguno que sea válido.
export async function leerFoto(archivo, lector = null) {
  const imagen = await abrirImagen(archivo)
  try {
    const l = lector || (await crearLector())
    for (const estrategia of PARA_FOTO) {
      const c = await l.leer(imagen, estrategia)
      if (c) return c
      await new Promise((r) => setTimeout(r, 0)) // deja respirar a la pantalla entre intento e intento
    }
    return null
  } finally {
    imagen.close?.()
  }
}
