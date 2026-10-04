import { lazy, Suspense, useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { ProveedorDatos, useDatos } from './store/Datos'
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
        <button className="btn-primario" onClick={recargar}>Reintentar</button>
      </div>
    )
  }
  if (!perfil) return <Suspense fallback={Hueco}><Bienvenida /></Suspense>
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
  const [sesion, setSesion] = useState(undefined) // undefined = todavía no sabemos
  const ruta = useLocation().pathname

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSesion(data.session))
    const { data } = supabase.auth.onAuthStateChange((evento, s) => {
      // Al recuperar la contraseña, el código ya inicia la sesión: la app espera a que se guarde la nueva para entrar
      if (evento === 'PASSWORD_RECOVERY') return
      setSesion(s)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  // Los textos legales se pueden leer con o sin sesión
  if (ruta === '/terminos' || ruta === '/privacidad') return <Suspense fallback={Hueco}><Legal tipo={ruta.slice(1)} /></Suspense>
  if (sesion === undefined) return <Cargando />
  if (!sesion) return <Acceso />
  return (
    <ProveedorDatos key={sesion.user.id} usuario={sesion.user}>
      <Pantallas />
    </ProveedorDatos>
  )
}
