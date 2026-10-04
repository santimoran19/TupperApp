// Marco común: encabezado, contenido y barra de navegación inferior.
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Icono } from './ui'
import { useDatos } from '../store/Datos'
import { hoy } from '../lib/fechas'
import { redondear, sumar } from '../lib/nutricion'

const PESTANAS = [
  { a: '/', icono: 'calendar_today', texto: 'Diario' },
  { a: '/plan', icono: 'event_note', texto: 'Plan' },
  null,
  { a: '/despensa', icono: 'kitchen', texto: 'Despensa' },
  { a: '/recetas', icono: 'menu_book', texto: 'Recetas' },
]

export function Logo({ size = 36 }) {
  return (
    <div className="rounded-xl bg-verde text-white flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <Icono n="takeout_dining" lleno size={size * 0.6} />
    </div>
  )
}

export default function Marco({ titulo, atras = false, children, sinNav = false }) {
  const { registros, perfil, aviso } = useDatos()
  const nav = useNavigate()
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
            {!atras && <p className="text-[11px] font-bold tracking-wider text-verde leading-none mb-0.5">TUPPER</p>}
            <h1 className="text-lg font-semibold leading-tight truncate">{titulo}</h1>
          </div>
          <span className="pill bg-verde-suave text-verde h-8 px-3">
            <Icono n="local_fire_department" size={16} /> {kcalHoy.toLocaleString('es-AR')} kcal
          </span>
          <Link to="/perfil" className="w-10 h-10 rounded-full bg-verde-medio text-white font-semibold flex items-center justify-center" aria-label="Perfil">
            {inicial}
          </Link>
        </div>
      </header>

      <main className={`max-w-[440px] mx-auto px-4 pt-4 ${sinNav ? 'pb-10' : 'pb-32'}`}>{children}</main>

      {aviso && (
        <div className="fixed left-0 right-0 bottom-28 z-[60] flex justify-center px-4 pointer-events-none">
          <div className={`rounded-full px-4 py-2.5 text-sm font-medium text-white shadow-flotante ${aviso.tipo === 'error' ? 'bg-rojo' : 'bg-tinta'}`}>
            {aviso.texto}
          </div>
        </div>
      )}

      {!sinNav && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-linea pb-seguro">
          <div className="max-w-[440px] mx-auto h-[68px] grid grid-cols-5 items-center">
            {PESTANAS.map((p, i) =>
              p ? (
                <NavLink
                  key={p.a} to={p.a} end={p.a === '/'}
                  className={({ isActive }) => `flex flex-col items-center gap-0.5 text-[11px] font-semibold ${isActive ? 'text-verde' : 'text-gris'}`}
                >
                  {({ isActive }) => (<><Icono n={p.icono} lleno={isActive} /> {p.texto}</>)}
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
