// Aviso de versión nueva. La app instalada guarda una copia para abrir rápido y sin conexión; cuando se publica
// una versión nueva, se baja de fondo y acá se ofrece pasarse a ella (en vez de seguir con la vieja sin saberlo).
import { useEffect, useRef, useState } from 'react'
import { registerSW } from 'virtual:pwa-register'
import { Icono } from './ui'

const CADA_CUANTO = 30 * 60 * 1000 // con la app abierta, se busca una versión nueva cada media hora

export default function AvisoVersion() {
  const [hayNueva, setHayNueva] = useState(false)
  const [aplicando, setAplicando] = useState(false)
  const aplicar = useRef(null)

  useEffect(() => {
    let registro = null
    let ultima = Date.now()
    const buscar = () => {
      if (!registro || document.visibilityState !== 'visible' || !navigator.onLine) return
      ultima = Date.now()
      registro.update().catch(() => { /* sin conexión: se busca la próxima vez */ })
    }
    // Al volver a la app también se busca (si pasó un rato): el teléfono no la "abre de nuevo", la trae como estaba
    const alVolver = () => { if (Date.now() - ultima > 60 * 1000) buscar() }
    aplicar.current = registerSW({
      onNeedRefresh: () => setHayNueva(true),
      onRegisteredSW: (_url, r) => { registro = r || null },
    })
    const reloj = setInterval(buscar, CADA_CUANTO)
    document.addEventListener('visibilitychange', alVolver)
    return () => {
      clearInterval(reloj)
      document.removeEventListener('visibilitychange', alVolver)
    }
  }, [])

  const actualizar = () => {
    setAplicando(true)
    aplicar.current?.(true)
    // Lo normal es que la app se recargue sola en cuanto la versión nueva toma el control. Si esta pestaña no la manejaba
    // la copia guardada, ese aviso no llega nunca: ahí se recarga directamente, y en cualquier caso a los pocos segundos.
    setTimeout(() => location.reload(), navigator.serviceWorker?.controller ? 4000 : 300)
  }

  if (!hayNueva) return null
  return (
    <div className="fixed top-[72px] left-0 right-0 z-[65] flex justify-center px-4 pointer-events-none">
      <div role="status" className="pointer-events-auto flex items-center gap-2 rounded-full bg-tinta text-fondo shadow-flotante pl-4 pr-1.5 py-1.5 text-sm font-medium">
        <span>Hay una versión nueva</span>
        <button onClick={actualizar} disabled={aplicando} className="btn-chico bg-verde text-white">
          <Icono n="refresh" size={16} /> {aplicando ? 'Actualizando...' : 'Actualizar'}
        </button>
        <button onClick={() => setHayNueva(false)} className="w-9 h-9 rounded-full flex items-center justify-center" aria-label="Después">
          <Icono n="close" size={18} />
        </button>
      </div>
    </div>
  )
}
