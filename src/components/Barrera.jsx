// Red de seguridad: si una pantalla se rompe, en vez de quedar todo en blanco se muestra un mensaje con salida.
import { Component } from 'react'
import { Logo } from './Marco'
import { anotarError } from '../lib/eventos'
import { borrarFotos } from '../store/local'

// Después de publicar una versión nueva, una pestaña vieja puede pedir una pantalla que ya no está en el servidor.
// Cada navegador lo dice distinto (el último texto es el de Safari cuando en lugar del archivo recibe la página de inicio).
const esPantallaVieja = (error) =>
  /dynamically imported module|importing a module script failed|unable to preload css|error loading dynamically|is not a valid javascript mime type/i.test(
    String(error?.message || error),
  )

// Recarga para traer la versión nueva, pero una sola vez: si igual falla, se muestra el mensaje
const CLAVE = 'tupper:recarga'
function recargarUnaVez() {
  if (navigator.onLine === false) return false // sin conexión, recargar dejaría la app peor: se muestra el mensaje
  try {
    if (Date.now() - Number(sessionStorage.getItem(CLAVE) || 0) < 30000) return false
    sessionStorage.setItem(CLAVE, String(Date.now()))
  } catch {
    return false
  }
  location.reload()
  return true
}

export default class Barrera extends Component {
  state = { rota: false, error: null, recargando: false }

  static getDerivedStateFromError(error) {
    return { rota: true, error }
  }

  componentDidCatch(error, info) {
    if (esPantallaVieja(error) && recargarUnaVez()) {
      this.setState({ recargando: true })
      return
    }
    anotarError('pantalla', error, {
      componentes: String(info?.componentStack || '')
        .trim()
        .slice(0, 600),
    })
    // Por si lo que rompió la pantalla venía en la foto de los datos guardada en el teléfono: se borra, así al recargar
    // la app arranca con lo que traiga de la base. Va un momento después, cuando la app ya terminó de cerrarse (al
    // cerrarse guarda la foto una última vez). Los cambios sin mandar no se tocan.
    // Si lo que falló fue bajar una pantalla (sin conexión, o una versión vieja), la foto no tiene nada que ver: se deja.
    if (!esPantallaVieja(error)) setTimeout(() => borrarFotos().catch(() => {}), 1000)
  }

  render() {
    const { rota, error, recargando } = this.state
    if (!rota) return this.props.children
    if (recargando) return <div className="min-h-screen bg-fondo" />
    const vieja = esPantallaVieja(error)
    return (
      <div role="alert" className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center bg-fondo text-tinta">
        <Logo size={56} />
        <p className="font-semibold">{vieja ? 'No se pudo abrir esta pantalla' : 'Algo salió mal'}</p>
        <p className="text-sm text-gris max-w-[300px]">
          {vieja
            ? 'Puede que haya una versión nueva o que se haya cortado la conexión. Recargá la app para seguir.'
            : 'Lo que ya habías guardado sigue estando. Recargá la app para seguir.'}
        </p>
        <button className="btn-primario" onClick={() => location.reload()}>
          Recargar
        </button>
        {location.pathname !== '/' && (
          <a href="/" className="text-sm font-semibold text-verde-texto">
            Ir al inicio
          </a>
        )}
      </div>
    )
  }
}
