// Al entrar con la verificación en dos pasos activada (1.29, S-06): después de la contraseña, el código de la app
// autenticadora. Hasta ponerlo no se ve ningún dato (la base tampoco los da). Desde la 1.32 (S-08): con más de un
// dispositivo vale el código de cualquiera, y quien perdió el teléfono puede entrar con un código de recuperación.
import { useEffect, useState } from 'react'
import { Logo } from '../components/Marco'
import { Err } from '../components/ui'
import { supabase } from '../lib/supabase'
import { codigoRecuperacionValido, codigoValido, factoresActivos, usarCodigoRecuperacion, verificarConCualquiera } from '../lib/dosPasos'

export default function CodigoDosPasos({ sesion }) {
  const [codigo, setCodigo] = useState('')
  const [error, setError] = useState(null)
  const [trabajando, setTrabajando] = useState(false)
  const [recuperar, setRecuperar] = useState(false) // con un código de recuperación
  useEffect(() => {
    document.title = 'Código de verificación · Tupper'
  }, [])

  async function entrar(ev) {
    ev.preventDefault()
    if (!codigoValido(codigo) || trabajando) return
    setTrabajando(true)
    setError(null)
    const r = await verificarConCualquiera(factoresActivos(sesion.user), codigo)
    setTrabajando(false)
    // Si salió bien, Supabase cambia la sesión por una con el segundo paso y la app sigue sola
    if (r.error) {
      setError(r.error)
      setCodigo('')
    }
  }

  return (
    <div className="min-h-screen bg-fondo flex items-center justify-center p-5" data-testid="codigo-dos-pasos">
      <div className="w-full max-w-[380px]">
        <div className="flex flex-col items-center text-center mb-6">
          <Logo size={64} />
          <h1 className="text-2xl font-bold mt-3 tracking-tight">Verificación en dos pasos</h1>
          <p className="text-gris mt-1">Escribí el código de 6 números que muestra tu app autenticadora.</p>
        </div>
        {recuperar ? (
          <Recuperar onVolver={() => setRecuperar(false)} />
        ) : (
          <form onSubmit={entrar} noValidate className="tarjeta p-5 space-y-4">
            <div>
              <label className="etiqueta" htmlFor="dp-codigo">
                Código
              </label>
              <input
                id="dp-codigo"
                className="campo text-center text-2xl tracking-[0.4em] font-semibold"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
                autoFocus
                aria-invalid={!!error || undefined}
                aria-describedby={error ? 'dp-error' : undefined}
              />
              <div id="dp-error">
                <Err>{error}</Err>
              </div>
            </div>
            <button type="submit" disabled={!codigoValido(codigo) || trabajando} className="btn-primario w-full">
              {trabajando ? 'Verificando…' : 'Entrar'}
            </button>
            <button type="button" onClick={() => setRecuperar(true)} className="block mx-auto text-sm font-semibold text-verde-texto">
              Perdí el teléfono: usar un código de recuperación
            </button>
            <button type="button" onClick={() => supabase.auth.signOut()} className="block mx-auto text-sm font-semibold text-gris">
              Salir
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

// Entrar con un código de recuperación (los que se mostraron al activar la verificación)
function Recuperar({ onVolver }) {
  const [codigo, setCodigo] = useState('')
  const [error, setError] = useState(null)
  const [trabajando, setTrabajando] = useState(false)
  async function usar(ev) {
    ev.preventDefault()
    if (!codigoRecuperacionValido(codigo) || trabajando) return
    setTrabajando(true)
    setError(null)
    const r = await usarCodigoRecuperacion(codigo)
    setTrabajando(false)
    // Si salió bien, la sesión se renueva sin la verificación y la app sigue sola
    if (r.error) setError(r.error)
  }
  return (
    <form onSubmit={usar} noValidate className="tarjeta p-5 space-y-4" data-testid="recuperar-dos-pasos">
      <p className="text-sm">
        Escribí uno de los códigos de recuperación que guardaste al activar la verificación. Se desactiva la verificación en dos pasos y
        entrás con tu contraseña; después la podés activar de nuevo con otro teléfono.
      </p>
      <div>
        <label className="etiqueta" htmlFor="dp-recuperacion">
          Código de recuperación
        </label>
        <input
          id="dp-recuperacion"
          className="campo text-center text-xl tracking-[0.2em] font-semibold uppercase"
          autoComplete="off"
          autoCapitalize="characters"
          maxLength={9}
          placeholder="ABCD-EFGH"
          value={codigo}
          onChange={(e) =>
            setCodigo(
              e.target.value
                .toUpperCase()
                .replace(/[^A-Z0-9-]/g, '')
                .slice(0, 9),
            )
          }
          autoFocus
          aria-invalid={!!error || undefined}
          aria-describedby={error ? 'dp-rec-error' : undefined}
        />
        <div id="dp-rec-error">
          <Err>{error}</Err>
        </div>
      </div>
      <button type="submit" disabled={!codigoRecuperacionValido(codigo) || trabajando} className="btn-primario w-full">
        {trabajando ? 'Verificando…' : 'Entrar'}
      </button>
      <p className="text-xs text-gris text-center">
        ¿No tenés los códigos? Escribinos desde la Política de privacidad y te ayudamos a recuperar la cuenta.
      </p>
      <button type="button" onClick={onVolver} className="block mx-auto text-sm font-semibold text-gris">
        Volver
      </button>
    </form>
  )
}
