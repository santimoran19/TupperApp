// Muestra algo en 3D (1.24) sin que el resto de la app cargue three.js: el código 3D se baja recién cuando hace falta.
// Mientras carga, si el teléfono no tiene WebGL, si la persona apagó el 3D (Perfil > Apariencia) o si algo falla, se ve
// `sinTresD` (la versión de siempre, en 2D).
import { Component, Suspense, lazy, useState } from 'react'

const ESCENAS = {
  tupper: () => import('./tres/tupper'),
  cuerpo: () => import('./tres/cuerpo'),
  plato: () => import('./tres/plato'),
}
const VISTAS = Object.fromEntries(
  Object.entries(ESCENAS).map(([k, cargar]) => [
    k,
    lazy(() =>
      Promise.all([import('./tres/Lienzo'), cargar()]).then(([lienzo, escena]) => ({
        default: (p) => <lienzo.default crear={escena.crear} {...p} />,
      })),
    ),
  ]),
)

let webgl = null
export function hayWebGL() {
  if (webgl !== null) return webgl
  try {
    const c = document.createElement('canvas')
    webgl = !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch {
    webgl = false
  }
  return webgl
}

const CLAVE = 'tupper:3d'
export function tresDPrendido() {
  try {
    return localStorage.getItem(CLAVE) !== 'no'
  } catch {
    return true
  }
}
export function prenderTresD(si) {
  try {
    localStorage.setItem(CLAVE, si ? 'si' : 'no')
  } catch {
    /* sin almacenamiento: queda como estaba */
  }
}

class Atajo extends Component {
  state = { fallo: false }
  static getDerivedStateFromError() {
    return { fallo: true }
  }
  componentDidCatch() {}
  render() {
    return this.state.fallo ? this.props.sinTresD : this.props.children
  }
}

// `tipo`: 'tupper', 'cuerpo' o 'plato'. `props`: los datos para la escena (memorizados, así no se rearma en cada render).
// `className`: el tamaño de todo; `lienzo`: el del dibujo (por defecto, cuadrado). `children`: lo que va debajo del dibujo.
export default function Vista3D({
  tipo,
  props,
  sinTresD = null,
  className = '',
  lienzo = 'w-full aspect-square',
  etiqueta,
  giroSolo,
  children,
}) {
  const [fallo, setFallo] = useState(false)
  const Vista = VISTAS[tipo]
  if (fallo || !Vista || !tresDPrendido() || !hayWebGL()) return sinTresD
  const abajo = children ? <div className="flex flex-col items-center text-center -mt-1">{children}</div> : null
  return (
    <Atajo sinTresD={sinTresD}>
      <div className={className}>
        <Suspense fallback={<div className={lienzo} aria-hidden="true" />}>
          <Vista props={props} className={lienzo} etiqueta={etiqueta} giroSolo={giroSolo} onFalla={() => setFallo(true)} />
        </Suspense>
        {abajo}
      </div>
    </Atajo>
  )
}
