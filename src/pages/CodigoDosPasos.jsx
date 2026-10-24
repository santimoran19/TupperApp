// Al entrar con la verificación en dos pasos activada (1.29, S-06): después de la contraseña, el código de la app
// autenticadora. Hasta ponerlo no se ve ningún dato (la base tampoco los da).
import { useEffect, useState } from 'react'
import { Logo } from '../components/Marco'
import { Err } from '../components/ui'
import { supabase } from '../lib/supabase'
import { codigoValido, factoresActivos, verificarCodigo } from '../lib/dosPasos'

export default function CodigoDosPasos({ sesion }) {
  const [codigo, setCodigo] = useState('')
  const [error, setError] = useState(null)
  const [trabajando, setTrabajando] = useState(false)
  useEffect(() => {
    document.title = 'Código de verificación · Tupper'
  }, [])

  async function entrar(ev) {
    ev.preventDefault()
    if (!codigoValido(codigo) || trabajando) return
    setTrabajando(true)
    setError(null)
    const [factor] = factoresActivos(sesion.user)
    const r = await verificarCodigo(factor.id, codigo)
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
          <p className="text-xs text-gris text-center">
            ¿Perdiste el teléfono con la app? Escribinos desde la Política de privacidad y te ayudamos a recuperar la cuenta.
          </p>
          <button type="button" onClick={() => supabase.auth.signOut()} className="block mx-auto text-sm font-semibold text-gris">
            Salir
          </button>
        </form>
      </div>
    </div>
  )
}
