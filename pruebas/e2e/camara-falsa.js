// Cámara de mentira para probar el escáner: un lienzo que dibuja un código de barras EAN-13 de verdad, así el lector se
// prueba con imagen. Se instala antes de que cargue la app (ctx.addInitScript) y no puede usar nada de afuera de la función.
//
// `modo`: 'libreria' (sin BarcodeDetector, como en un iPhone) | 'nativo' (BarcodeDetector del teléfono, como en Android) | 'negada' (sin permiso)
// `controles`: la cámara dice que tiene zoom, linterna y foco continuo (lo que aplica la app queda en window.__camara.aplicadas)
// `ancho`/`alto`: tamaño del cuadro de video
//
// Desde la prueba:  window.__camara.codigo = '...'      el código que "ve" la cámara (null: nada)
//                   window.__camara.estilo = { barras, fondo, modulo, alto, desenfoque }   cómo se dibuja (colores, tamaño de cada barra fina y borroneo, en píxeles)
//                   window.__camara.subirFoto(codigo, estilo, ancho, alto)    elige una foto con ese código como si viniera de la cámara del teléfono
export function instalarCamara({ modo, controles = false, ancho = 640, alto = 480 }) {
  window.__camara = { codigo: null, aplicadas: [], estilo: { barras: '#000', fondo: '#fff', modulo: 4, alto: 220 } }
  if (modo === 'libreria') delete window.BarcodeDetector
  if (modo === 'nativo')
    window.BarcodeDetector = class {
      static async getSupportedFormats() {
        return ['ean_13', 'ean_8', 'upc_a']
      }
      async detect() {
        return window.__camara.codigo ? [{ rawValue: window.__camara.codigo, format: 'ean_13' }] : []
      }
    }
  const L = ['0001101', '0011001', '0010011', '0111101', '0100011', '0110001', '0101111', '0111011', '0110111', '0001011']
  const G = ['0100111', '0110011', '0011011', '0100001', '0011101', '0111001', '0000101', '0010001', '0001001', '0010111']
  const R = ['1110010', '1100110', '1101100', '1000010', '1011100', '1001110', '1010000', '1000100', '1001000', '1110100']
  const PARIDAD = ['LLLLLL', 'LLGLGG', 'LLGGLG', 'LLGGGL', 'LGLLGG', 'LGGLLG', 'LGGGLL', 'LGLGLG', 'LGLGGL', 'LGGLGL']
  const barras = (c) => {
    const p = PARIDAD[Number(c[0])]
    let b = '101'
    for (let i = 0; i < 6; i++) b += (p[i] === 'L' ? L : G)[Number(c[i + 1])]
    b += '01010'
    for (let i = 7; i < 13; i++) b += R[Number(c[i])]
    return b + '101'
  }
  // Dibuja el fondo y, si hay código, las barras centradas
  const pintar = (g, w, h, c, { barras: color, fondo, modulo, alto: altura, desenfoque = 0 }) => {
    g.filter = desenfoque ? `blur(${desenfoque}px)` : 'none' // una cámara de verdad nunca enfoca perfecto
    g.fillStyle = fondo
    g.fillRect(0, 0, w, h)
    if (!c) return
    g.fillStyle = color
    const bits = barras(c)
    const x0 = (w - bits.length * modulo) / 2
    for (let i = 0; i < bits.length; i++) if (bits[i] === '1') g.fillRect(x0 + i * modulo, (h - altura) / 2, modulo, altura)
  }
  const pedir = async () => {
    if (modo === 'negada') throw new DOMException('Permission denied', 'NotAllowedError')
    const lienzo = document.createElement('canvas')
    lienzo.width = ancho
    lienzo.height = alto
    const g = lienzo.getContext('2d')
    let tic = 0
    const dibujar = () => {
      pintar(g, ancho, alto, window.__camara.codigo, window.__camara.estilo)
      g.fillStyle = tic++ % 2 ? '#808080' : '#7f7f7f' // para que el video siga mandando cuadros
      g.fillRect(0, 0, 2, 2)
    }
    dibujar()
    setInterval(dibujar, 100)
    const flujo = lienzo.captureStream(10)
    if (controles) {
      const pista = flujo.getVideoTracks()[0]
      pista.getCapabilities = () => ({ zoom: { min: 1, max: 4, step: 0.5 }, torch: true, focusMode: ['manual', 'continuous'] })
      pista.getSettings = () => ({ zoom: 1 })
      pista.applyConstraints = async (c) => {
        window.__camara.aplicadas.push(c)
      }
    }
    return flujo
  }
  if (!navigator.mediaDevices) Object.defineProperty(navigator, 'mediaDevices', { value: {}, configurable: true })
  navigator.mediaDevices.getUserMedia = pedir

  // Una foto del código "sacada" con la cámara del teléfono: se la pone en el selector de archivos del escáner
  window.__camara.subirFoto = async (codigo, estilo, w = 3000, h = 2000) => {
    const lienzo = document.createElement('canvas')
    lienzo.width = w
    lienzo.height = h
    pintar(lienzo.getContext('2d'), w, h, codigo, { ...window.__camara.estilo, ...estilo })
    const blob = await new Promise((ok) => lienzo.toBlob(ok, 'image/png'))
    const entrada = new DataTransfer()
    entrada.items.add(new File([blob], 'foto.png', { type: 'image/png' }))
    const campo = document.querySelector('input[type=file]')
    campo.files = entrada.files
    campo.dispatchEvent(new Event('change', { bubbles: true }))
  }
}
