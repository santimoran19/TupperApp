// Lo que comparten las escenas 3D: los colores de la app (los mismos del tema claro u oscuro), las luces y la sombra suave.

// Un color de la app ("--c-verde" en src/index.css guarda "r g b") como THREE.Color
export function colorDe(THREE, variable, respaldo = '#206140') {
  try {
    const v = getComputedStyle(document.documentElement).getPropertyValue(variable).trim()
    const [r, g, b] = v.split(/\s+/).map(Number)
    if ([r, g, b].every((x) => Number.isFinite(x))) return new THREE.Color(`rgb(${r}, ${g}, ${b})`)
  } catch {
    /* sin estilos (pruebas): el de respaldo */
  }
  return new THREE.Color(respaldo)
}

// Luz de cielo + una luz principal desde arriba a la izquierda + un contraluz suave
export function luces(THREE, escena) {
  escena.add(new THREE.HemisphereLight(0xffffff, 0xcfe3d6, 1.35))
  const sol = new THREE.DirectionalLight(0xffffff, 1.6)
  sol.position.set(-3, 5, 4)
  escena.add(sol)
  const atras = new THREE.DirectionalLight(0xfff1e0, 0.6)
  atras.position.set(3, 2, -4)
  escena.add(atras)
}

// Una sombra redonda y difusa en el piso, dibujada en un lienzo (más barata que las sombras de verdad)
export function sombra(THREE, ancho = 3, largo = 2, opacidad = 0.22) {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')
  const r = g.createRadialGradient(64, 64, 4, 64, 64, 62)
  r.addColorStop(0, `rgba(0,0,0,${opacidad})`)
  r.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = r
  g.fillRect(0, 0, 128, 128)
  const textura = new THREE.CanvasTexture(c)
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(ancho, largo),
    new THREE.MeshBasicMaterial({ map: textura, transparent: true, depthWrite: false }),
  )
  m.rotation.x = -Math.PI / 2
  return m
}

// Acerca un valor a otro de a poco (para animar sin saltos)
export const acercar = (actual, meta, dt, rapidez = 6) => actual + (meta - actual) * (1 - Math.exp(-rapidez * dt))
