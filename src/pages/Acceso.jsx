// Inicio de sesión y registro con email y contraseña.
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Logo } from '../components/Marco'
import { errEmail } from '../lib/validar'

const ERRORES = {
  'Invalid login credentials': 'El email o la contraseña no coinciden.',
  'User already registered': 'Ya hay una cuenta con ese email.',
  'Email not confirmed': 'Falta confirmar el email. Revisá tu casilla.',
}

export default function Acceso() {
  const [modo, setModo] = useState('entrar')
  const [email, setEmail] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function enviar(ev) {
    ev.preventDefault()
    setError('')
    setMensaje('')
    if (errEmail(email)) return setError(errEmail(email))
    if (modo === 'crear' && clave.length < 6) return setError('La contraseña tiene que tener al menos 6 caracteres.')
    if (clave.length > 72) return setError('La contraseña es demasiado larga (máximo 72 caracteres).')
    setEnviando(true)
    const datos = { email: email.trim(), password: clave }
    const { data, error: err } = modo === 'entrar'
      ? await supabase.auth.signInWithPassword(datos)
      : await supabase.auth.signUp(datos)
    setEnviando(false)
    if (err) return setError(ERRORES[err.message] || err.message)
    if (modo === 'crear' && !data.session) setMensaje('Te mandamos un mail para confirmar la cuenta. Abrilo y después iniciá sesión.')
  }

  return (
    <div className="min-h-screen bg-fondo flex items-center justify-center p-5">
      <div className="w-full max-w-[400px]">
        <div className="flex flex-col items-center text-center mb-7">
          <Logo size={64} />
          <h1 className="text-3xl font-bold mt-4 tracking-tight">Tupper</h1>
          <p className="text-gris mt-1">Tu despensa, tus recetas y lo que comés, en un solo lugar.</p>
        </div>
        <div className="tarjeta p-5">
          <div className="relative grid grid-cols-2 bg-campo rounded-full p-1 mb-5">
            {/* La pastilla blanca se desliza de un lado al otro */}
            <span
              className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full bg-white shadow-tarjeta transition-transform duration-300 ease-out ${modo === 'crear' ? 'translate-x-full' : 'translate-x-0'}`}
              aria-hidden="true"
            />
            {[['entrar', 'Iniciar sesión'], ['crear', 'Crear cuenta']].map(([m, t]) => (
              <button key={m} type="button" onClick={() => { setModo(m); setError(''); setMensaje('') }}
                className={`relative z-10 h-10 rounded-full text-sm font-semibold transition-colors duration-300 ${modo === m ? 'text-verde' : 'text-gris'}`}>
                {t}
              </button>
            ))}
          </div>
          <form onSubmit={enviar} noValidate className="space-y-3">
            <div>
              <label className="etiqueta" htmlFor="email">Email</label>
              <input id="email" type="email" required autoComplete="email" className="campo" maxLength={120} value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="etiqueta" htmlFor="clave">Contraseña</label>
              <input id="clave" type="password" required autoComplete={modo === 'entrar' ? 'current-password' : 'new-password'} className="campo" maxLength={72} value={clave} onChange={(e) => setClave(e.target.value)} />
            </div>
            {error && <p className="text-sm text-rojo">{error}</p>}
            {mensaje && <p className="text-sm text-verde font-medium">{mensaje}</p>}
            <button type="submit" disabled={enviando} className="btn-primario w-full">
              {modo === 'entrar' ? 'Entrar' : 'Crear cuenta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
