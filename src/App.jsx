import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { sesionGuardada, supabase } from './lib/supabase'
import { ProveedorDatos, useDatos } from './store/Datos'
import { borrarLocal } from './store/local'
import { Logo } from './components/Marco'
import Acceso from './pages/Acceso'
import Diario from './pages/Diario'

// El acceso y el diario cargan de entrada; el resto de las pantallas se baja recién cuando se abre
const Bienvenida = lazy(() => import('./pages/Bienvenida'))
const Registrar = lazy(() => import('./pages/Registrar'))
const Despensa = lazy(() => import('./pages/Despensa'))
const Compras = lazy(() => import('./pages/Compras'))
const Recetas = lazy(() => import('./pages/Recetas'))
const RecetaDetalle = lazy(() => import('./pages/RecetaDetalle'))
const RecetaNueva = lazy(() => import('./pages/RecetaNueva'))
const Plan = lazy(() => import('./pages/Plan'))
const Perfil = lazy(() => import('./pages/Perfil'))
const MisAlimentos = lazy(() => import('./pages/MisAlimentos'))
const Resumen = lazy(() => import('./pages/Resumen'))
const Legal = lazy(() => import('./pages/Legal'))
const NoEncontrada = lazy(() => import('./pages/NoEncontrada'))

const Hueco = <div className="min-h-screen bg-fondo" />

function Cargando({ texto = 'Cargando...' }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-fondo">
      <Logo size={56} />
      <p className="text-sm text-gris">{texto}</p>
    </div>
  )
}

function Pantallas() {
  const { cargando, errorCarga, perfil, recargar } = useDatos()
  if (cargando) return <Cargando />
  if (errorCarga) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center bg-fondo">
        <Logo size={56} />
        <p className="font-semibold">No se pudieron cargar tus datos</p>
        <p className="text-sm text-gris">{errorCarga}</p>
        <button className="btn-primario" onClick={recargar}>
          Reintentar
        </button>
      </div>
    )
  }
  if (!perfil)
    return (
      <Suspense fallback={Hueco}>
        <Bienvenida />
      </Suspense>
    )
  return (
    <Suspense fallback={Hueco}>
      <Routes>
        <Route path="/" element={<Diario />} />
        <Route path="/registrar" element={<Registrar />} />
        <Route path="/plan" element={<Plan />} />
        <Route path="/despensa" element={<Despensa />} />
        <Route path="/compras" element={<Compras />} />
        <Route path="/recetas" element={<Recetas />} />
        <Route path="/recetas/nueva" element={<RecetaNueva />} />
        <Route path="/recetas/:id" element={<RecetaDetalle />} />
        <Route path="/recetas/:id/editar" element={<RecetaNueva />} />
        <Route path="/alimentos" element={<MisAlimentos />} />
        <Route path="/resumen" element={<Resumen />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="*" element={<NoEncontrada />} />
      </Routes>
    </Suspense>
  )
}

export default function App() {
  // undefined = todavía no sabemos. Si hay una sesión guardada en el teléfono se entra enseguida con ese usuario, sin
  // esperar a Supabase: sin conexión y con el permiso vencido, tarda medio minuto en darse por vencido. Si la sesión ya
  // no vale, Supabase avisa (SIGNED_OUT) y se vuelve a la pantalla de acceso.
  const [sesion, setSesion] = useState(() => sesionGuardada() ?? undefined)
  const ruta = useLocation().pathname

  useEffect(() => {
    // Sin conexión y con el permiso vencido, Supabase contesta "sin sesión" aunque la tenga guardada: ahí se sigue
    // con el usuario guardado, y los datos salen de la copia del teléfono (ver store/sincronizacion.js).
    const resolver = (s) => s || sesionGuardada()
    supabase.auth.getSession().then(
      ({ data }) => setSesion(resolver(data.session)),
      () => setSesion(sesionGuardada()),
    )
    const { data } = supabase.auth.onAuthStateChange((evento, s) => {
      // Al recuperar la contraseña, el código ya inicia la sesión: la app espera a que se guarde la nueva para entrar
      if (evento === 'PASSWORD_RECOVERY') return
      setSesion(evento === 'SIGNED_OUT' ? null : resolver(s))
    })
    // Si en otra pestaña la sesión se sacó del teléfono a mano (cerrar sesión sin conexión), Supabase no avisa: se mira acá
    const alGuardar = (ev) => {
      if (ev.key === supabase.auth.storageKey && !ev.newValue) setSesion(null)
    }
    window.addEventListener('storage', alGuardar)
    return () => {
      data.subscription.unsubscribe()
      window.removeEventListener('storage', alGuardar)
    }
  }, [])

  // Cuando la sesión se termina sin pasar por "Cerrar sesión" (venció, o se cerró desde otro dispositivo), la foto de
  // los datos de esa cuenta se borra del teléfono. Los cambios sin mandar se dejan: se mandan si vuelve a entrar.
  const ultimo = useRef(null)
  useEffect(() => {
    if (sesion?.user) ultimo.current = sesion.user.id
    else if (sesion === null && ultimo.current) {
      borrarLocal(`foto:${ultimo.current}`).catch(() => {})
      ultimo.current = null
    }
  }, [sesion])

  // Los textos legales se pueden leer con o sin sesión. Con sesión van adentro del proveedor de datos, así no se corta
  // lo que la app esté haciendo (por ejemplo, mandando cambios que quedaron sin enviar).
  const legal =
    ruta === '/terminos' || ruta === '/privacidad' ? (
      <Suspense fallback={Hueco}>
        <Legal tipo={ruta.slice(1)} />
      </Suspense>
    ) : null
  if (sesion === undefined) return legal || <Cargando />
  if (!sesion) return legal || <Acceso />
  return (
    <ProveedorDatos key={sesion.user.id} usuario={sesion.user}>
      {legal || <Pantallas />}
    </ProveedorDatos>
  )
}
