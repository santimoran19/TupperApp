// Acceso: iniciar sesión, crear cuenta con código de confirmación por mail y recuperar la contraseña.
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Logo } from '../components/Marco'
import { Icono } from '../components/ui'
import { errClave, errEmail, requisitosClave, sugerirEmail } from '../lib/validar'

const LARGO_CODIGO = 6
const ESPERA_REENVIO = 60 // segundos entre un mail y otro (es el mínimo que deja Supabase)

// Los errores de Supabase llegan en inglés: se traducen por el texto que traen
function traducir(err) {
  const m = err?.message || ''
  if (/Invalid login credentials/i.test(m)) return 'El email o la contraseña no coinciden.'
  if (/already registered|already been registered/i.test(m)) return 'Ya hay una cuenta con ese email. Iniciá sesión o recuperá la contraseña.'
  if (/Email not confirmed/i.test(m)) return 'Falta confirmar el email.'
  if (/expired|invalid/i.test(m) && /token|otp|code/i.test(m)) return 'El código no es correcto o ya venció. Pedí uno nuevo.'
  if (/rate limit|too many/i.test(m)) return 'Se pidieron muchos mails seguidos. Esperá unos minutos y probá de nuevo.'
  if (/only request this after/i.test(m)) return 'Esperá un minuto antes de pedir otro mail.'
  if (/not authorized|error sending/i.test(m)) return 'No pudimos mandarte el mail. Probá de nuevo en un rato.'
  if (/different from the old/i.test(m)) return 'La contraseña nueva tiene que ser distinta a la anterior.'
  if (/weak|should be at least|password/i.test(m)) return 'La contraseña no es lo bastante segura. Probá con otra.'
  if (/signups? not allowed|disabled/i.test(m)) return 'Por ahora no se pueden crear cuentas nuevas.'
  if (/fetch|network|abort/i.test(m)) return 'No hay conexión. Revisá internet y probá de nuevo.'
  return 'Algo salió mal. Probá de nuevo.'
}

// Campo de contraseña con el ojito para verla
function Clave({ id, etiqueta, valor, onChange, autoComplete }) {
  const [visible, setVisible] = useState(false)
  return (
    <div>
      <label className="etiqueta" htmlFor={id}>{etiqueta}</label>
      <div className="relative">
        <input id={id} type={visible ? 'text' : 'password'} autoComplete={autoComplete} className="campo pr-12" maxLength={72}
          value={valor} onChange={(e) => onChange(e.target.value)} autoCapitalize="none" autoCorrect="off" spellCheck={false} />
        <button type="button" onClick={() => setVisible(!visible)} className="absolute right-1 top-1 w-10 h-10 flex items-center justify-center text-gris"
          aria-label={visible ? 'Ocultar la contraseña' : 'Ver la contraseña'} aria-pressed={visible}>
          <Icono n={visible ? 'visibility_off' : 'visibility'} size={20} />
        </button>
      </div>
    </div>
  )
}

// Lista de requisitos que se van tildando mientras se escribe
function Requisitos({ clave, email }) {
  return (
    <ul className="space-y-1" aria-label="Requisitos de la contraseña">
      {requisitosClave(clave, email).map((r) => (
        <li key={r.texto} className={`flex items-start gap-1.5 text-xs ${r.ok ? 'text-verde-texto' : 'text-gris'}`}>
          <Icono n={r.ok ? 'check_circle' : 'cancel'} lleno={r.ok} size={15} className="mt-px" /> {r.texto}
        </li>
      ))}
    </ul>
  )
}

function Codigo({ valor, onChange }) {
  return (
    <div>
      <label className="etiqueta" htmlFor="codigo">Código de {LARGO_CODIGO} dígitos</label>
      <input id="codigo" inputMode="numeric" autoComplete="one-time-code" className="campo text-center text-2xl font-bold tracking-[0.4em]" maxLength={LARGO_CODIGO}
        placeholder={'•'.repeat(LARGO_CODIGO)} value={valor} onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, LARGO_CODIGO))} autoFocus />
    </div>
  )
}

export default function Acceso() {
  // entrar | crear | codigo (confirmar la cuenta) | olvide (pedir el mail) | nueva (código + contraseña nueva)
  const [modo, setModo] = useState('entrar')
  const [email, setEmail] = useState('')
  const [clave, setClave] = useState('')
  const [clave2, setClave2] = useState('')
  const [codigo, setCodigo] = useState('')
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [espera, setEspera] = useState(0) // segundos que faltan para poder pedir otro mail
  const [verificado, setVerificado] = useState(false) // el código de recuperación ya se usó: solo falta guardar la contraseña

  useEffect(() => { document.title = 'Tupper: despensa, recetas y registro de comidas' }, [])
  useEffect(() => {
    if (espera <= 0) return
    const t = setTimeout(() => setEspera((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [espera])

  const correo = email.trim().toLowerCase()
  const sugerencia = modo === 'crear' || modo === 'olvide' ? sugerirEmail(email) : null
  const ir = (m) => { setModo(m); setError(''); setMensaje(''); setCodigo(''); setClave2(''); setVerificado(false); if (m !== 'entrar') setClave('') }

  // Envuelve cada pedido: muestra el error traducido y maneja el "enviando"
  async function pedir(fn) {
    setError('')
    setMensaje('')
    setEnviando(true)
    try {
      const { data, error: err } = await fn()
      if (err) { setError(traducir(err)); return null }
      return data || {}
    } catch (err) {
      setError(traducir(err))
      return null
    } finally {
      setEnviando(false)
    }
  }

  async function entrar() {
    if (errEmail(email)) return setError(errEmail(email))
    if (!clave) return setError('Escribí tu contraseña.')
    setError(''); setEnviando(true)
    const { error: err } = await supabase.auth.signInWithPassword({ email: correo, password: clave })
    setEnviando(false)
    if (!err) return
    // Cuenta creada pero sin confirmar: se manda otro código y se pasa a esa pantalla
    if (/Email not confirmed/i.test(err.message)) {
      await supabase.auth.resend({ type: 'signup', email: correo })
      ir('codigo')
      setEspera(ESPERA_REENVIO)
      return setMensaje('Te falta confirmar el email. Te mandamos un código nuevo.')
    }
    setError(traducir(err))
  }

  async function crear() {
    if (errEmail(email)) return setError(errEmail(email))
    if (errClave(clave, email)) return setError(errClave(clave, email))
    if (clave !== clave2) return setError('Las dos contraseñas no coinciden.')
    const data = await pedir(() => supabase.auth.signUp({ email: correo, password: clave }))
    if (!data) return
    // Si el email ya tenía cuenta, Supabase responde sin sesión y sin identidades
    if (!data.session && data.user?.identities?.length === 0) return setError('Ya hay una cuenta con ese email. Iniciá sesión o recuperá la contraseña.')
    // Con la confirmación por mail apagada en Supabase la sesión llega directo; si no, falta el código
    if (!data.session) { ir('codigo'); setEspera(ESPERA_REENVIO) }
  }

  async function confirmar() {
    if (codigo.length !== LARGO_CODIGO) return setError(`El código tiene ${LARGO_CODIGO} dígitos.`)
    await pedir(() => supabase.auth.verifyOtp({ email: correo, token: codigo, type: 'email' }))
    // Si salió bien, la sesión queda iniciada y la app entra sola
  }

  async function reenviar() {
    const data = await pedir(() => (modo === 'codigo' ? supabase.auth.resend({ type: 'signup', email: correo }) : supabase.auth.resetPasswordForEmail(correo)))
    if (data) { setEspera(ESPERA_REENVIO); setMensaje('Te mandamos un código nuevo.') }
  }

  async function pedirRecuperacion() {
    if (errEmail(email)) return setError(errEmail(email))
    const data = await pedir(() => supabase.auth.resetPasswordForEmail(correo))
    if (data) { ir('nueva'); setEspera(ESPERA_REENVIO) }
  }

  async function guardarNueva() {
    if (!verificado && codigo.length !== LARGO_CODIGO) return setError(`El código tiene ${LARGO_CODIGO} dígitos.`)
    if (errClave(clave, email)) return setError(errClave(clave, email))
    if (clave !== clave2) return setError('Las dos contraseñas no coinciden.')
    if (!verificado) {
      // El código inicia la sesión, pero la app espera a que se guarde la contraseña para entrar (ver App.jsx)
      const data = await pedir(() => supabase.auth.verifyOtp({ email: correo, token: codigo, type: 'recovery' }))
      if (!data) return
      setVerificado(true)
    }
    await pedir(() => supabase.auth.updateUser({ password: clave }))
  }

  const enviar = (ev) => {
    ev.preventDefault()
    if (enviando) return
    return { entrar, crear, codigo: confirmar, olvide: pedirRecuperacion, nueva: guardarNueva }[modo]()
  }
  const pestanas = modo === 'entrar' || modo === 'crear'

  return (
    <div className="min-h-screen bg-fondo flex items-center justify-center p-5">
      <div className="w-full max-w-[400px]">
        <div className="flex flex-col items-center text-center mb-6">
          <Logo size={88} />
          <h1 className="text-3xl font-bold mt-3 tracking-tight">Tupper</h1>
          <p className="text-gris mt-1">Tu despensa, tus recetas y lo que comés, en un solo lugar.</p>
        </div>
        <div className="tarjeta p-5">
          {pestanas ? (
            <div className="relative grid grid-cols-2 bg-campo rounded-full p-1 mb-5">
              {/* La pastilla blanca se desliza de un lado al otro */}
              <span
                className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full bg-superficie shadow-tarjeta transition-transform duration-300 ease-out ${modo === 'crear' ? 'translate-x-full' : 'translate-x-0'}`}
                aria-hidden="true"
              />
              {[['entrar', 'Iniciar sesión'], ['crear', 'Crear cuenta']].map(([m, t]) => (
                <button key={m} type="button" onClick={() => ir(m)}
                  className={`relative z-10 h-10 rounded-full text-sm font-semibold transition-colors duration-300 ${modo === m ? 'text-verde-texto' : 'text-gris'}`}>
                  {t}
                </button>
              ))}
            </div>
          ) : (
            <div className="mb-4">
              <button type="button" onClick={() => ir('entrar')} className="text-sm font-semibold text-verde-texto flex items-center gap-1 mb-3"><Icono n="arrow_back" size={18} /> Volver</button>
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-full bg-verde-claro text-verde-texto flex items-center justify-center shrink-0"><Icono n={modo === 'codigo' ? 'mark_email_read' : 'lock_reset'} /></span>
                <div className="min-w-0">
                  <h2 className="font-semibold text-lg leading-tight">{modo === 'codigo' ? 'Confirmá tu email' : 'Recuperar contraseña'}</h2>
                  <p className="text-sm text-gris break-words">
                    {modo === 'olvide' ? 'Te mandamos un código para poner una nueva.' : <>Te mandamos un código a <b className="text-tinta">{correo}</b></>}
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={enviar} noValidate className="space-y-3">
            {(pestanas || modo === 'olvide') && (
              <div>
                <label className="etiqueta" htmlFor="email">Email</label>
                <input id="email" type="email" autoComplete="email" inputMode="email" autoCapitalize="none" className="campo" maxLength={120} value={email} onChange={(e) => setEmail(e.target.value)} />
                {sugerencia && (
                  <button type="button" onClick={() => setEmail(sugerencia)} className="text-xs text-left text-naranja-oscuro mt-1.5">
                    ¿Quisiste decir <b className="underline">{sugerencia}</b>?
                  </button>
                )}
              </div>
            )}

            {(modo === 'codigo' || (modo === 'nueva' && !verificado)) && <Codigo valor={codigo} onChange={setCodigo} />}

            {modo === 'entrar' && <Clave id="clave" etiqueta="Contraseña" valor={clave} onChange={setClave} autoComplete="current-password" />}
            {(modo === 'crear' || modo === 'nueva') && (
              <>
                <Clave id="clave" etiqueta={modo === 'nueva' ? 'Contraseña nueva' : 'Contraseña'} valor={clave} onChange={setClave} autoComplete="new-password" />
                <Requisitos clave={clave} email={email} />
                <Clave id="clave2" etiqueta="Repetí la contraseña" valor={clave2} onChange={setClave2} autoComplete="new-password" />
                {clave2 && clave !== clave2 && <p className="text-xs text-rojo-texto -mt-1.5">Todavía no coinciden.</p>}
              </>
            )}

            {error && <p className="text-sm text-rojo-texto" role="alert">{error}</p>}
            {mensaje && <p className="text-sm text-verde-texto font-medium">{mensaje}</p>}

            <button type="submit" disabled={enviando} className="btn-primario w-full">
              {{ entrar: 'Entrar', crear: 'Crear cuenta', codigo: 'Confirmar', olvide: 'Mandarme el código', nueva: 'Guardar y entrar' }[modo]}
            </button>

            {modo === 'entrar' && (
              <button type="button" onClick={() => ir('olvide')} className="block mx-auto text-sm font-semibold text-verde-texto">Olvidé mi contraseña</button>
            )}
            {(modo === 'codigo' || (modo === 'nueva' && !verificado)) && (
              <div className="text-center text-sm text-gris">
                <p>¿No llegó? Fijate en spam o correo no deseado.</p>
                <button type="button" onClick={reenviar} disabled={espera > 0 || enviando} className="font-semibold text-verde-texto disabled:text-gris mt-1">
                  {espera > 0 ? `Podés pedir otro en ${espera} s` : 'Mandarme otro código'}
                </button>
              </div>
            )}
            {modo === 'crear' && (
              <p className="text-xs text-gris text-center">
                Al crear la cuenta aceptás los <Link to="/terminos" className="underline font-semibold">Términos</Link> y la <Link to="/privacidad" className="underline font-semibold">Política de privacidad</Link>.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
