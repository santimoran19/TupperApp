import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { ProveedorDatos, useDatos } from './store/Datos'
import { Logo } from './components/Marco'
import Acceso from './pages/Acceso'
import Bienvenida from './pages/Bienvenida'
import Diario from './pages/Diario'
import Registrar from './pages/Registrar'
import Despensa from './pages/Despensa'
import Compras from './pages/Compras'
import Recetas from './pages/Recetas'
import RecetaDetalle from './pages/RecetaDetalle'
import RecetaNueva from './pages/RecetaNueva'
import Plan from './pages/Plan'
import Perfil from './pages/Perfil'

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
  if (!perfil) return <Bienvenida />
  return (
    <Routes>
      <Route path="/" element={<Diario />} />
      <Route path="/registrar" element={<Registrar />} />
      <Route path="/plan" element={<Plan />} />
      <Route path="/despensa" element={<Despensa />} />
      <Route path="/compras" element={<Compras />} />
      <Route path="/recetas" element={<Recetas />} />
      <Route path="/recetas/nueva" element={<RecetaNueva />} />
      <Route path="/recetas/:id" element={<RecetaDetalle />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  const [sesion, setSesion] = useState(undefined) // undefined = todavía no sabemos

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSesion(data.session))
    const { data } = supabase.auth.onAuthStateChange((_evento, s) => setSesion(s))
    return () => data.subscription.unsubscribe()
  }, [])

  if (sesion === undefined) return <Cargando />
  if (!sesion) return <Acceso />
  return (
    <ProveedorDatos key={sesion.user.id} usuario={sesion.user}>
      <Pantallas />
    </ProveedorDatos>
  )
}
