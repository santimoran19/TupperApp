// Texturas de comida dibujadas en un canvas (1.26): migas de empanado, granos de arroz, marcas de parrilla, hojas con nervaduras...
// Nada se descarga: se dibujan al armar el plato (512 px alcanzan) y se liberan con él. Cada una da { map, bump }.
import { azar } from '../comida.js'

const TAM = 512

// Dibuja `f(g, azar)` en dos lienzos (color y relieve en grises) y los vuelve texturas
function par(THREE, D, semilla, f, { repetir = 1, tam = TAM } = {}) {
  const az = azar(semilla)
  const hacer = () => {
    const c = document.createElement('canvas')
    c.width = c.height = tam
    return [c, c.getContext('2d')]
  }
  const [cc, gc] = hacer()
  const [cb, gb] = hacer()
  gb.fillStyle = '#000'
  gb.fillRect(0, 0, tam, tam)
  f(gc, gb, az, tam)
  const tex = (c, color) => {
    const t = new THREE.CanvasTexture(c)
    if (color) t.colorSpace = THREE.SRGBColorSpace
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.anisotropy = 4
    t.repeat.set(repetir, repetir)
    D(t)
    return t
  }
  return { map: tex(cc, true), bump: tex(cb, false) }
}

const pick = (az, lista) => lista[Math.floor(az() * lista.length)]

// Un poco más claro u oscuro un color '#rrggbb' (k de -1 a 1)
export function tono(hex, k) {
  const n = parseInt(hex.slice(1), 16)
  const c = (v) => Math.max(0, Math.min(255, Math.round(k >= 0 ? v + (255 - v) * k : v * (1 + k))))
  return '#' + [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => c(v).toString(16).padStart(2, '0')).join('')
}

// Todas las cosas que se dibujan "dos veces" (el color y el relieve) pasan por acá
function mancha(g, x, y, r, color, alfa = 1) {
  g.globalAlpha = alfa
  const gr = g.createRadialGradient(x, y, 0, x, y, r)
  gr.addColorStop(0, color)
  gr.addColorStop(1, color + '00')
  g.fillStyle = gr
  g.beginPath()
  g.arc(x, y, r, 0, 6.2832)
  g.fill()
  g.globalAlpha = 1
}
const hex8 = (c) => (c.length === 7 ? c : '#888888')

// Empanado: migas doradas de varios tonos, con zonas más tostadas y un borde más oscuro
export function empanado(THREE, D, semilla, base = '#d19a47') {
  return par(THREE, D, semilla, (g, b, az, T) => {
    g.fillStyle = base
    g.fillRect(0, 0, T, T)
    for (let i = 0; i < 14; i++) mancha(g, az() * T, az() * T, 50 + az() * 90, pick(az, ['#a8631c', '#e6b865', '#b97a2a']), 0.35)
    for (let i = 0; i < 5200; i++) {
      const x = az() * T
      const y = az() * T
      const r = 1 + az() * 3.6
      g.fillStyle = pick(az, ['#e7b765', '#c5832f', '#f2cc82', '#b8741f', '#dba857', '#efc06f'])
      g.beginPath()
      g.ellipse(x, y, r, r * (0.6 + az() * 0.5), az() * 3, 0, 6.2832)
      g.fill()
      b.fillStyle = `rgba(255,255,255,${0.35 + az() * 0.6})`
      b.beginPath()
      b.ellipse(x, y, r, r * 0.8, az() * 3, 0, 6.2832)
      b.fill()
    }
  })
}

// Granos: de arroz (alargados) o redondos (lentejas, quinoa, arvejas...). `color` es el de la comida.
export function granos(THREE, D, semilla, { color = '#efe7d0', largo = true, tamano = 1, repetir = 2.6 } = {}) {
  return par(
    THREE,
    D,
    semilla,
    (g, b, az, T) => {
      g.fillStyle = tono(color, -0.45)
      g.fillRect(0, 0, T, T)
      const n = Math.round((largo ? 1500 : 1700) / (tamano * tamano))
      for (let i = 0; i < n; i++) {
        const x = az() * T
        const y = az() * T
        const a = az() * 3.1416
        const w = (largo ? 20 : 15) * tamano * (0.8 + az() * 0.4)
        const h = (largo ? 7.5 : 15) * tamano * (0.85 + az() * 0.3)
        for (const dx of x < w ? [0, T] : x > T - w ? [-T, 0] : [0]) {
          for (const dy of y < w ? [0, T] : y > T - w ? [-T, 0] : [0]) {
            g.save()
            g.translate(x + dx, y + dy)
            g.rotate(a)
            const gr = g.createLinearGradient(0, -h, 0, h)
            gr.addColorStop(0, tono(color, 0.35 + az() * 0.2))
            gr.addColorStop(1, tono(color, -0.1 - az() * 0.15))
            g.fillStyle = gr
            g.strokeStyle = tono(color, -0.5)
            g.lineWidth = 1.2
            g.beginPath()
            g.ellipse(0, 0, w, h, 0, 0, 6.2832)
            g.fill()
            g.stroke()
            g.restore()
            b.save()
            b.translate(x + dx, y + dy)
            b.rotate(a)
            b.fillStyle = `rgba(255,255,255,${0.7 + az() * 0.3})`
            b.beginPath()
            b.ellipse(0, 0, w * 0.9, h * 0.9, 0, 0, 6.2832)
            b.fill()
            b.restore()
          }
        }
      }
    },
    { repetir },
  )
}

// Carne molida: migas irregulares oscuras y claras
export function molido(THREE, D, semilla, color = '#7a4a2b') {
  return par(
    THREE,
    D,
    semilla,
    (g, b, az, T) => {
      g.fillStyle = tono(color, -0.5)
      g.fillRect(0, 0, T, T)
      for (let i = 0; i < 1500; i++) {
        const x = az() * T
        const y = az() * T
        const r = 4 + az() * 8
        g.fillStyle = tono(color, -0.2 + az() * 0.45)
        g.beginPath()
        g.ellipse(x, y, r, r * (0.6 + az() * 0.6), az() * 3, 0, 6.2832)
        g.fill()
        b.fillStyle = `rgba(255,255,255,${0.5 + az() * 0.5})`
        b.beginPath()
        b.ellipse(x, y, r * 0.9, r * 0.7, az() * 3, 0, 6.2832)
        b.fill()
      }
    },
    { repetir: 2.2 },
  )
}

// Puré: liso, con las marcas del tenedor
export function pure(THREE, D, semilla, color = '#efd58a') {
  return par(
    THREE,
    D,
    semilla,
    (g, b, az, T) => {
      g.fillStyle = color
      g.fillRect(0, 0, T, T)
      for (let i = 0; i < 60; i++) mancha(g, az() * T, az() * T, 30 + az() * 60, pick(az, [tono(color, 0.25), tono(color, -0.15)]), 0.3)
      for (let i = 0; i < 46; i++) {
        const x = az() * T
        const y = az() * T
        const a = 0.4 + az() * 0.3
        for (let k = 0; k < 5; k++) {
          g.strokeStyle = tono(color, -0.18)
          g.lineWidth = 2
          b.strokeStyle = '#fff'
          b.lineWidth = 3
          for (const c of [g, b]) {
            c.beginPath()
            c.moveTo(x + k * 7, y)
            c.quadraticCurveTo(x + k * 7 + 14 * Math.cos(a), y + 40, x + k * 7 + 10, y + 80)
            c.stroke()
          }
        }
      }
    },
    { repetir: 1.6 },
  )
}

// Parrilla: marrón con las marcas oscuras en diagonal. Para bifes y hamburguesas.
export function parrilla(THREE, D, semilla, color = '#7a3f20') {
  return par(THREE, D, semilla, (g, b, az, T) => {
    g.fillStyle = color
    g.fillRect(0, 0, T, T)
    for (let i = 0; i < 30; i++) mancha(g, az() * T, az() * T, 40 + az() * 70, pick(az, [tono(color, 0.2), tono(color, -0.35)]), 0.4)
    for (let i = 0; i < 2200; i++) {
      g.fillStyle = tono(color, -0.3 + az() * 0.6)
      g.fillRect(az() * T, az() * T, 2 + az() * 3, 2 + az() * 3)
    }
    // Marcas de la parrilla
    g.save()
    g.rotate(-0.6)
    for (let k = -4; k < 12; k++) {
      const y = k * 62 + 20
      g.fillStyle = 'rgba(30,12,4,0.78)'
      g.fillRect(-400, y, 1400, 20)
      g.fillStyle = 'rgba(30,12,4,0.3)'
      g.fillRect(-400, y - 5, 1400, 30)
    }
    g.restore()
    b.save()
    b.rotate(-0.6)
    for (let k = -4; k < 12; k++) {
      b.fillStyle = '#000'
      b.fillRect(-400, k * 62 + 20, 1400, 20)
    }
    b.restore()
    b.globalAlpha = 0.55
    for (let i = 0; i < 1800; i++) {
      b.fillStyle = '#fff'
      b.fillRect(az() * T, az() * T, 3, 3)
    }
  })
}

// Piel de pollo asado: dorada con manchas y puntitos
export function piel(THREE, D, semilla, color = '#c7782e') {
  return par(
    THREE,
    D,
    semilla,
    (g, b, az, T) => {
      g.fillStyle = color
      g.fillRect(0, 0, T, T)
      for (let i = 0; i < 40; i++) mancha(g, az() * T, az() * T, 30 + az() * 80, pick(az, ['#8f4d17', '#e0a050', '#a85c1e']), 0.45)
      for (let i = 0; i < 1400; i++) {
        const x = az() * T
        const y = az() * T
        const r = 1.5 + az() * 3
        g.fillStyle = pick(az, ['#e8b068', '#8a4616', '#d89445'])
        g.beginPath()
        g.arc(x, y, r, 0, 6.2832)
        g.fill()
        b.fillStyle = '#fff'
        b.beginPath()
        b.arc(x, y, r * 0.9, 0, 6.2832)
        b.fill()
      }
    },
    { repetir: 1.4 },
  )
}

// Carne blanca cocida (pechuga): fibras claras con el borde dorado
export function pechuga(THREE, D, semilla, color = '#eccb92') {
  return par(THREE, D, semilla, (g, b, az, T) => {
    g.fillStyle = color
    g.fillRect(0, 0, T, T)
    for (let i = 0; i < 520; i++) {
      const y = az() * T
      g.strokeStyle = pick(az, [tono(color, 0.35), tono(color, -0.18), tono(color, 0.1)])
      g.lineWidth = 1.5 + az() * 2.5
      g.beginPath()
      g.moveTo(az() * T, y)
      g.bezierCurveTo(az() * T, y + 12, az() * T, y - 12, az() * T, y + 4)
      g.stroke()
      b.strokeStyle = `rgba(255,255,255,${0.3 + az() * 0.4})`
      b.lineWidth = 2
      b.stroke()
    }
    // Borde dorado alrededor (el borde del lienzo es el borde de la pieza)
    const e = g.createLinearGradient(0, 0, 0, T)
    for (const [x0, y0, x1, y1] of [
      [0, 0, 0, 70],
      [0, T, 0, T - 70],
      [0, 0, 70, 0],
      [T, 0, T - 70, 0],
    ]) {
      const gr = g.createLinearGradient(x0, y0, x1, y1)
      gr.addColorStop(0, 'rgba(176,112,40,0.95)')
      gr.addColorStop(1, 'rgba(176,112,40,0)')
      g.fillStyle = gr
      g.fillRect(0, 0, T, T)
    }
    void e
  })
}

// Pescado: lascas de carne apoyadas unas sobre otras, del color de la comida (más claras en el medio, doradas en el borde)
export function pescado(THREE, D, semilla, color = '#f0e0c4') {
  return par(THREE, D, semilla, (g, b, az, T) => {
    g.fillStyle = tono(color, -0.08)
    g.fillRect(0, 0, T, T)
    for (let i = 0; i < 150; i++) {
      const x = az() * T
      const y = az() * T
      const w = 40 + az() * 70
      const h = 16 + az() * 22
      const a = (az() - 0.5) * 0.5
      g.save()
      g.translate(x, y)
      g.rotate(a)
      const gr = g.createLinearGradient(0, -h, 0, h)
      gr.addColorStop(0, tono(color, 0.35 + az() * 0.15))
      gr.addColorStop(1, tono(color, -0.05 - az() * 0.1))
      g.fillStyle = gr
      g.strokeStyle = tono(color, -0.3)
      g.globalAlpha = 0.9
      g.lineWidth = 1.6
      g.beginPath()
      g.ellipse(0, 0, w, h, 0, 0, 6.2832)
      g.fill()
      g.stroke()
      g.restore()
      b.save()
      b.translate(x, y)
      b.rotate(a)
      b.fillStyle = `rgba(255,255,255,${0.5 + az() * 0.5})`
      b.beginPath()
      b.ellipse(0, 0, w * 0.95, h * 0.9, 0, 0, 6.2832)
      b.fill()
      b.restore()
    }
    g.globalAlpha = 1
    // El borde, dorado (el borde del lienzo es el borde de la pieza)
    for (const [x0, y0, x1, y1] of [
      [0, 0, 0, 80],
      [0, T, 0, T - 80],
      [0, 0, 80, 0],
      [T, 0, T - 80, 0],
    ]) {
      const gr = g.createLinearGradient(x0, y0, x1, y1)
      gr.addColorStop(0, 'rgba(206,150,84,0.75)')
      gr.addColorStop(1, 'rgba(206,150,84,0)')
      g.fillStyle = gr
      g.fillRect(0, 0, T, T)
    }
  })
}

// Hoja verde: nervadura central y laterales, en grises (el color lo pone el material)
export function hoja(THREE, D, semilla) {
  return par(THREE, D, semilla, (g, b, az, T) => {
    const gr = g.createLinearGradient(0, T, 0, 0)
    gr.addColorStop(0, '#f2f2f2')
    gr.addColorStop(1, '#cfcfcf')
    g.fillStyle = gr
    g.fillRect(0, 0, T, T)
    for (const c of [g, b]) c.lineCap = 'round'
    g.strokeStyle = '#ffffff'
    g.lineWidth = 12
    b.strokeStyle = '#fff'
    b.lineWidth = 12
    for (const c of [g, b]) {
      c.beginPath()
      c.moveTo(T / 2, T)
      c.lineTo(T / 2, 0)
      c.stroke()
    }
    for (let k = 0; k < 14; k++) {
      const y = T - (k + 1) * (T / 15)
      for (const lado of [-1, 1]) {
        g.strokeStyle = '#e6e6e6'
        g.lineWidth = 4
        b.strokeStyle = '#999'
        b.lineWidth = 3
        for (const c of [g, b]) {
          c.beginPath()
          c.moveTo(T / 2, y + 30)
          c.quadraticCurveTo(T / 2 + lado * 90, y + 6, T / 2 + lado * 200, y - 50)
          c.stroke()
        }
      }
    }
    for (let i = 0; i < 18; i++) mancha(g, az() * T, az() * T, 40 + az() * 50, '#bdbdbd', 0.18)
  })
}

// Una rodaja vista de arriba (para tomate, pepino, zanahoria, limón...): cáscara, pulpa y, si lleva, gajos y semillas
export function rodaja(THREE, D, semilla, { cascara, pulpa, centro, gajos = 0, semillas = false }) {
  return par(THREE, D, semilla, (g, b, az, T) => {
    const c = T / 2
    g.fillStyle = cascara
    g.beginPath()
    g.arc(c, c, c, 0, 6.2832)
    g.fill()
    g.fillStyle = tono(cascara, 0.45)
    g.beginPath()
    g.arc(c, c, c * 0.93, 0, 6.2832)
    g.fill()
    g.fillStyle = pulpa
    g.beginPath()
    g.arc(c, c, c * 0.86, 0, 6.2832)
    g.fill()
    if (gajos) {
      for (let i = 0; i < gajos; i++) {
        const a = (i / gajos) * 6.2832 + 0.3
        g.fillStyle = centro
        g.beginPath()
        g.moveTo(c + Math.cos(a - 0.38) * c * 0.2, c + Math.sin(a - 0.38) * c * 0.2)
        g.arc(c, c, c * 0.78, a - 0.4, a + 0.4)
        g.lineTo(c + Math.cos(a + 0.38) * c * 0.2, c + Math.sin(a + 0.38) * c * 0.2)
        g.fill()
        if (semillas) {
          g.fillStyle = '#f3e3b0'
          for (let s = 0; s < 4; s++) {
            const r = c * (0.38 + az() * 0.28)
            const aa = a + (az() - 0.5) * 0.5
            g.beginPath()
            g.ellipse(c + Math.cos(aa) * r, c + Math.sin(aa) * r, 7, 4, aa, 0, 6.2832)
            g.fill()
          }
        }
      }
    } else {
      g.fillStyle = centro
      g.beginPath()
      g.arc(c, c, c * 0.34, 0, 6.2832)
      g.fill()
    }
    b.fillStyle = '#666'
    b.beginPath()
    b.arc(c, c, c * 0.86, 0, 6.2832)
    b.fill()
  })
}

// Miga de pan con corteza (se usa con el cuadro entero: el borde del lienzo es el borde de la pieza)
export function pan(THREE, D, semilla, miga = '#f1deb0', corteza = '#b9772f') {
  return par(THREE, D, semilla, (g, b, az, T) => {
    g.fillStyle = corteza
    g.fillRect(0, 0, T, T)
    g.fillStyle = miga
    const m = T * 0.07
    g.fillRect(m, m, T - 2 * m, T - 2 * m)
    for (let i = 0; i < 1800; i++) {
      g.fillStyle = pick(az, [tono(miga, -0.08), tono(miga, 0.2), tono(miga, -0.16)])
      const r = 1 + az() * 3
      g.beginPath()
      g.arc(m + az() * (T - 2 * m), m + az() * (T - 2 * m), r, 0, 6.2832)
      g.fill()
    }
    b.fillStyle = '#555'
    b.fillRect(0, 0, T, T)
  })
}

// Tapa de una porción de pizza, tarta o lasaña: queso dorado con manchas tostadas
export function gratinado(THREE, D, semilla, color = '#e0a84a') {
  return par(THREE, D, semilla, (g, b, az, T) => {
    g.fillStyle = tono(color, 0.1)
    g.fillRect(0, 0, T, T)
    for (let i = 0; i < 70; i++) mancha(g, az() * T, az() * T, 20 + az() * 60, pick(az, ['#b8742a', '#f6dd96', '#9c5a1c', '#fbeab4']), 0.55)
    for (let i = 0; i < 900; i++) {
      g.fillStyle = pick(az, ['#fff1c0', '#c68a3a', '#e8b860'])
      g.beginPath()
      g.arc(az() * T, az() * T, 2 + az() * 4, 0, 6.2832)
      g.fill()
    }
    b.fillStyle = '#333'
    b.fillRect(0, 0, T, T)
  })
}

// Salchicha: del color de la comida con vetas más oscuras a lo largo
export function embutido(THREE, D, semilla, color = '#a85a3a') {
  return par(THREE, D, semilla, (g, b, az, T) => {
    g.fillStyle = color
    g.fillRect(0, 0, T, T)
    for (let i = 0; i < 90; i++) {
      g.fillStyle = pick(az, [tono(color, -0.3), tono(color, 0.25)])
      g.globalAlpha = 0.4
      g.fillRect(0, az() * T, T, 4 + az() * 14)
    }
    g.globalAlpha = 1
    for (let i = 0; i < 40; i++) mancha(g, az() * T, az() * T, 25 + az() * 40, '#4a1c0e', 0.5)
    b.fillStyle = '#555'
    b.fillRect(0, 0, T, T)
  })
}

// Masa de ravioles o ñoquis: crema, con borde marcado
export function masa(THREE, D, semilla, color = '#f1d98f') {
  return par(THREE, D, semilla, (g, b, az, T) => {
    g.fillStyle = color
    g.fillRect(0, 0, T, T)
    for (let i = 0; i < 40; i++) mancha(g, az() * T, az() * T, 30 + az() * 60, pick(az, [tono(color, 0.25), tono(color, -0.15)]), 0.35)
    g.strokeStyle = tono(color, -0.25)
    g.lineWidth = 7
    g.setLineDash([10, 8])
    g.strokeRect(46, 46, T - 92, T - 92)
    b.fillStyle = '#444'
    b.fillRect(0, 0, T, T)
    b.strokeStyle = '#fff'
    b.lineWidth = 9
    b.setLineDash([10, 8])
    b.strokeRect(46, 46, T - 92, T - 92)
  })
}

export const hex = hex8
