// El lienzo 3D (1.24): arma el renderizador de three.js, hace girar la escena arrastrando el dedo y la deja quieta cuando
// no se ve (fuera de pantalla o en otra pestaña) para no gastar batería. Este archivo y todo lo de three.js se cargan
// aparte, solo cuando una pantalla muestra algo en 3D (ver ../Vista3D.jsx).
//
// `crear(THREE, { ancho, alto })` arma la escena y devuelve:
//   { escena, camara, pivote (lo que gira al arrastrar), actualizar(dt, t) → true si sigue animando, tocar?(objetos, rayo),
//     cambiar?(props) para recibir datos nuevos sin rearmar todo, liberar?() }
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const reducirMovimiento = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export default function Lienzo({ crear, props, className = 'w-full h-64', etiqueta, onFalla, giroInicial = 0, giroSolo = true }) {
  const caja = useRef(null)
  const escenaRef = useRef(null)
  const propsRef = useRef(props)
  propsRef.current = props

  useEffect(() => {
    const el = caja.current
    if (!el) return
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
    } catch (err) {
      onFalla?.(err)
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.touchAction = 'pan-y'
    el.appendChild(renderer.domElement)

    const medir = () => ({ ancho: Math.max(1, el.clientWidth), alto: Math.max(1, el.clientHeight) })
    let { ancho, alto } = medir()
    renderer.setSize(ancho, alto, false)
    const e = crear(THREE, { ancho, alto, props: propsRef.current, quieto: reducirMovimiento() })
    escenaRef.current = e
    const quieto = reducirMovimiento()

    // ---------- Girar arrastrando (con un poco de inercia) ----------
    let giro = giroInicial
    let velocidad = 0
    let arrastre = null
    let ultimoToque = 0
    const abajo = (ev) => {
      arrastre = { x: ev.clientX, y: ev.clientY, giro, t: performance.now(), movio: false }
      velocidad = 0
      despertar()
    }
    const mover = (ev) => {
      if (!arrastre) return
      const dx = ev.clientX - arrastre.x
      // Un arrastre más vertical que horizontal es la página que se mueve: no se gira
      if (!arrastre.movio && Math.abs(ev.clientY - arrastre.y) > Math.abs(dx) + 4) {
        arrastre = null
        return
      }
      if (Math.abs(dx) > 3) {
        arrastre.movio = true
        renderer.domElement.setPointerCapture?.(ev.pointerId)
      }
      const nuevo = arrastre.giro + dx * 0.012
      const ahora = performance.now()
      velocidad = (nuevo - giro) / Math.max(8, ahora - (arrastre.tUltimo || arrastre.t))
      arrastre.tUltimo = ahora
      giro = nuevo
      despertar()
    }
    const arriba = (ev) => {
      if (arrastre && !arrastre.movio && e.tocar) {
        // Un toque sin arrastrar: ¿qué hay debajo del dedo?
        const r = renderer.domElement.getBoundingClientRect()
        const punto = new THREE.Vector2(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1)
        const rayo = new THREE.Raycaster()
        rayo.setFromCamera(punto, e.camara)
        e.tocar(rayo)
      }
      arrastre = null
      ultimoToque = performance.now()
      despertar()
    }
    const cel = renderer.domElement
    cel.addEventListener('pointerdown', abajo)
    cel.addEventListener('pointermove', mover)
    cel.addEventListener('pointerup', arriba)
    cel.addEventListener('pointercancel', arriba)

    // ---------- Dibujar solo cuando hace falta ----------
    let visible = true
    let corriendo = false
    let anterior = 0
    let id = 0
    const cuadro = (t) => {
      const dt = Math.min(0.05, (t - (anterior || t)) / 1000)
      anterior = t
      if (!arrastre && Math.abs(velocidad) > 0.00002) {
        giro += velocidad * dt * 1000
        velocidad *= Math.pow(0.04, dt)
      } else if (!arrastre && giroSolo && !quieto && t - ultimoToque > 2500) {
        giro += dt * 0.35
      }
      if (e.pivote) e.pivote.rotation.y = giro
      const sigue = e.actualizar ? e.actualizar(dt, t / 1000) : false
      renderer.render(e.escena, e.camara)
      const girando = !!arrastre || Math.abs(velocidad) > 0.00002 || (giroSolo && !quieto)
      if (visible && (sigue || girando)) id = requestAnimationFrame(cuadro)
      else {
        corriendo = false
        anterior = 0
      }
    }
    function despertar() {
      if (corriendo || !visible) return
      corriendo = true
      id = requestAnimationFrame(cuadro)
    }
    escenaRef.current.despertar = despertar

    const io = new IntersectionObserver(([x]) => {
      visible = x.isIntersecting && document.visibilityState === 'visible'
      if (visible) despertar()
    })
    io.observe(el)
    const pestana = () => {
      visible = document.visibilityState === 'visible'
      if (visible) despertar()
    }
    document.addEventListener('visibilitychange', pestana)
    const ro = new ResizeObserver(() => {
      ;({ ancho, alto } = medir())
      renderer.setSize(ancho, alto, false)
      e.camara.aspect = ancho / alto
      e.camara.updateProjectionMatrix()
      e.ajustar?.(ancho, alto)
      despertar()
    })
    ro.observe(el)
    // Si el contexto de WebGL se pierde (el sistema lo reclama), se muestra la versión sin 3D
    const perdido = (ev) => {
      ev.preventDefault()
      onFalla?.(new Error('Se perdió el contexto 3D'))
    }
    cel.addEventListener('webglcontextlost', perdido)
    despertar()

    return () => {
      cancelAnimationFrame(id)
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', pestana)
      cel.removeEventListener('pointerdown', abajo)
      cel.removeEventListener('pointermove', mover)
      cel.removeEventListener('pointerup', arriba)
      cel.removeEventListener('pointercancel', arriba)
      cel.removeEventListener('webglcontextlost', perdido)
      e.liberar?.()
      e.escena.traverse((o) => {
        o.geometry?.dispose?.()
        const ms = Array.isArray(o.material) ? o.material : o.material ? [o.material] : []
        for (const m of ms) {
          for (const v of Object.values(m)) if (v && v.isTexture) v.dispose()
          m.dispose()
        }
      })
      renderer.dispose()
      renderer.forceContextLoss?.()
      cel.remove()
      escenaRef.current = null
    }
    // La escena se arma una sola vez; los datos nuevos llegan por `cambiar` (abajo)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Datos nuevos: la escena los toma y se redibuja
  useEffect(() => {
    const e = escenaRef.current
    if (!e) return
    e.cambiar?.(props)
    e.despertar?.()
  }, [props])

  return <div ref={caja} className={`relative ${className}`} role="img" aria-label={etiqueta} />
}
