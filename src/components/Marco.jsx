// Marco común: encabezado, contenido y barra de navegación inferior.
import { useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Icono } from './ui'
import { useDatos } from '../store/Datos'
import { useAvisar, useAvisos } from '../store/avisos'
import { hoy } from '../lib/fechas'
import { redondear, sumar } from '../lib/nutricion'

const PESTANAS = [
  { a: '/', icono: 'calendar_today', texto: 'Diario' },
  { a: '/plan', icono: 'event_note', texto: 'Plan' },
  null,
  { a: '/despensa', icono: 'kitchen', texto: 'Despensa' },
  { a: '/recetas', icono: 'menu_book', texto: 'Recetas' },
]

// Logo: en tamaños chicos va la versión simple (un tupper plano que se lee bien);
// en grande, la ilustración completa, que es la misma del ícono de la app.
export function Logo({ size = 36 }) {
  if (size >= 56) return <img src="/icon-192.png" alt="Tupper" width={size} height={size} className="shrink-0" />
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className="shrink-0" role="img" aria-label="Tupper">
      <rect width="64" height="64" rx="15" fill="#cdeee0" />
      <path
        d="M12.5 29h39l-2.3 17.6a5.5 5.5 0 0 1-5.5 4.9H20.3a5.5 5.5 0 0 1-5.5-4.9z"
        fill="#f4fcff"
        stroke="#1b5e63"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <ellipse cx="42" cy="42.5" rx="6.5" ry="4.8" fill="#efb16c" />
      <circle cx="22.5" cy="42" r="5.2" fill="#e5482f" />
      <ellipse cx="32" cy="42" rx="6.4" ry="4" transform="rotate(-38 32 42)" fill="#2f9e44" />
      <rect x="7.5" y="16.5" width="49" height="13.5" rx="5.5" fill="#86cf45" stroke="#2c7a34" strokeWidth="3.2" />
      <path d="M15 22.5h18" stroke="#c9efa6" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}

// Diálogo para confirmar las acciones que no se pueden deshacer
function Confirmacion({ pregunta, onResponder }) {
  const cancelar = useRef(null)
  useEffect(() => {
    cancelar.current?.focus()
    const tecla = (ev) => {
      if (ev.key === 'Escape') onResponder(false)
    }
    document.addEventListener('keydown', tecla)
    return () => document.removeEventListener('keydown', tecla)
  }, [onResponder])
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/50" onClick={() => onResponder(false)} />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="conf-titulo"
        aria-describedby="conf-texto"
        className="relative w-full max-w-[340px] bg-superficie rounded-3xl shadow-flotante p-5"
      >
        <h2 id="conf-titulo" className="text-lg font-semibold leading-snug">
          {pregunta.titulo}
        </h2>
        {pregunta.texto && (
          <p id="conf-texto" className="text-sm text-gris mt-1.5">
            {pregunta.texto}
          </p>
        )}
        <div className="flex gap-2 mt-5">
          <button ref={cancelar} onClick={() => onResponder(false)} className="btn flex-1 bg-campo text-tinta">
            {pregunta.cancelar || 'Cancelar'}
          </button>
          <button
            onClick={() => onResponder(true)}
            className={`btn flex-1 text-white ${pregunta.peligro === false ? 'bg-verde' : 'bg-rojo'}`}
          >
            {pregunta.boton || 'Borrar'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Franja debajo del encabezado cuando no hay conexión o quedan cambios por mandar
function Conexion({ sinConexion, pendientes, trabada }) {
  if (!sinConexion && pendientes === 0) return null
  const cambios = pendientes === 1 ? '1 cambio' : `${pendientes} cambios`
  const texto = sinConexion
    ? pendientes > 0
      ? `Sin conexión · ${cambios} por enviar`
      : 'Sin conexión · lo que cargues se envía cuando vuelva'
    : trabada
      ? `Todavía no se ${pendientes === 1 ? 'pudo enviar 1 cambio' : `pudieron enviar ${pendientes} cambios`} · se sigue probando`
      : `Enviando ${cambios}...`
  return (
    <div
      role="status"
      className="bg-naranja-suave text-naranja-oscuro text-xs font-semibold text-center px-4 py-1.5 flex items-center justify-center gap-1.5"
    >
      <Icono n={sinConexion ? 'cloud_off' : 'sync'} size={14} /> {texto}
    </div>
  )
}

export default function Marco({ titulo, atras = false, children, sinNav = false }) {
  const { registros, perfil, sinConexion, pendientes, trabada } = useDatos()
  const { aviso, pregunta } = useAvisos()
  const { responder } = useAvisar()
  const nav = useNavigate()
  // Cada pantalla le pone su nombre a la pestaña del navegador
  useEffect(() => {
    document.title = `${titulo} · Tupper`
  }, [titulo])
  const kcalHoy = redondear(sumar(registros.filter((r) => r.date === hoy())).kcal)
  const inicial = (perfil?.name || '?').trim().charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-fondo">
      <header className="sticky top-0 z-30 bg-fondo/90 backdrop-blur border-b border-verde-suave/60">
        <div className="max-w-[440px] mx-auto h-16 px-4 flex items-center gap-3">
          {atras ? (
            <button onClick={() => nav(-1)} className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center" aria-label="Volver">
              <Icono n="arrow_back" />
            </button>
          ) : (
            <Logo />
          )}
          <div className="min-w-0 flex-1">
            {!atras && <p className="text-[11px] font-bold tracking-wider text-verde-texto leading-none mb-0.5">TUPPER</p>}
            <h1 className={`${atras ? 'text-base' : 'text-lg'} font-semibold leading-tight truncate`}>{titulo}</h1>
          </div>
          <span className="pill bg-verde-suave text-verde-texto h-8 px-3">
            <Icono n="local_fire_department" size={16} /> {kcalHoy.toLocaleString('es-AR')} kcal
          </span>
          <Link
            to="/perfil"
            className="w-10 h-10 rounded-full bg-verde text-white font-semibold flex items-center justify-center"
            aria-label="Perfil"
          >
            {inicial}
          </Link>
        </div>
        <Conexion sinConexion={sinConexion} pendientes={pendientes} trabada={trabada} />
      </header>

      <main className={`max-w-[440px] mx-auto px-4 pt-4 ${sinNav ? 'fin-sin-barra' : 'fin-con-barra'}`}>{children}</main>

      {pregunta && <Confirmacion pregunta={pregunta} onResponder={responder} />}

      {aviso && (
        <div className="fixed left-0 right-0 aviso-barra z-[60] flex justify-center px-4 pointer-events-none">
          <div
            className={`rounded-full px-4 py-2.5 text-sm font-medium shadow-flotante ${aviso.tipo === 'error' ? 'bg-rojo text-white' : 'bg-tinta text-fondo'}`}
          >
            {aviso.texto}
          </div>
        </div>
      )}

      {!sinNav && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-superficie border-t border-linea pb-seguro">
          <div className="max-w-[440px] mx-auto h-[68px] grid grid-cols-5 items-center">
            {PESTANAS.map((p, i) =>
              p ? (
                <NavLink
                  key={p.a}
                  to={p.a}
                  end={p.a === '/'}
                  className={({ isActive }) =>
                    `flex flex-col items-center gap-0.5 text-[11px] font-semibold ${isActive ? 'text-verde-texto' : 'text-gris'}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icono n={p.icono} lleno={isActive} /> {p.texto}
                    </>
                  )}
                </NavLink>
              ) : (
                <Link key={i} to="/registrar" className="flex flex-col items-center text-[11px] font-semibold text-tinta -mt-7">
                  <span className="w-14 h-14 rounded-full bg-verde text-white shadow-flotante flex items-center justify-center mb-0.5">
                    <Icono n="add" size={30} />
                  </span>
                  Registrar
                </Link>
              ),
            )}
          </div>
        </nav>
      )}
    </div>
  )
}
