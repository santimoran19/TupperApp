// Verificación en dos pasos en el Perfil (1.29, S-06): activarla escaneando un código QR con una app autenticadora, o
// desactivarla. Es opcional. Desde la 1.32 (S-08): al activarla se muestran códigos de recuperación (para entrar si se
// pierde el teléfono) y se puede sumar otro dispositivo.
import { useEffect, useId, useState } from 'react'
import { Icono, Err } from './ui'
import { useDatos } from '../store/Datos'
import { supabase } from '../lib/supabase'
import {
  codigoValido,
  codigosQueQuedan,
  desactivar,
  empezarActivacion,
  factoresActivos,
  generarCodigosRecuperacion,
  verificarCodigo,
} from '../lib/dosPasos'

// Los códigos recién creados: se ven una sola vez
function CodigosNuevos({ codigos, onListo, avisar }) {
  async function copiar() {
    try {
      await navigator.clipboard.writeText(codigos.join('\n'))
      avisar('Códigos copiados')
    } catch {
      avisar('No se pudieron copiar. Anotalos a mano.', 'error')
    }
  }
  return (
    <div className="mt-3 rounded-2xl bg-naranja-suave p-4" data-testid="codigos-recuperacion">
      <p className="font-semibold text-sm">Tus códigos de recuperación</p>
      <p className="text-xs text-gris mt-1">
        Si perdés el teléfono con la app autenticadora, entrás con uno de estos. Cada uno sirve una vez. Guardalos en un lugar seguro que no
        sea este teléfono: no los vas a poder ver de nuevo.
      </p>
      <ul className="grid grid-cols-2 gap-1.5 mt-3 font-mono text-sm text-center">
        {codigos.map((c) => (
          <li key={c} className="bg-superficie rounded-lg py-1.5 select-all">
            {c}
          </li>
        ))}
      </ul>
      <div className="flex gap-2 mt-3">
        <button onClick={copiar} className="btn-suave flex-1">
          <Icono n="content_copy" size={18} /> Copiar
        </button>
        <button onClick={onListo} className="btn-primario flex-1">
          Ya los guardé
        </button>
      </div>
    </div>
  )
}

export default function DosPasos() {
  const d = useDatos()
  const id = useId()
  const [usuario, setUsuario] = useState(d.usuario)
  const [alta, setAlta] = useState(null) // { id, qr, secreto } mientras se activa o se suma un dispositivo
  const [codigo, setCodigo] = useState('')
  const [error, setError] = useState(null)
  const [trabajando, setTrabajando] = useState(false)
  const [codigos, setCodigos] = useState(null) // los de recuperación recién creados
  const [quedan, setQuedan] = useState(null)
  // Los factores vienen en el usuario de la sesión, que cambia al activar o desactivar
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_e, s) => s?.user && setUsuario(s.user))
    return () => data.subscription.unsubscribe()
  }, [])
  const activos = factoresActivos(usuario)
  const activa = activos.length > 0
  useEffect(() => {
    if (!activa || codigos) return
    let vivo = true
    codigosQueQuedan().then((n) => vivo && setQuedan(n))
    return () => {
      vivo = false
    }
  }, [activa, codigos])

  async function empezar() {
    setTrabajando(true)
    setError(null)
    const r = await empezarActivacion()
    setTrabajando(false)
    if (r.error) return setError(r.error)
    setAlta(r)
    setCodigo('')
  }
  async function nuevosCodigos() {
    const r = await generarCodigosRecuperacion()
    if (r.error) {
      setError(`La verificación quedó activada, pero no se pudieron crear los códigos de recuperación: ${r.error}`)
      return false
    }
    setCodigos(r.codigos)
    return true
  }
  async function confirmar(ev) {
    ev.preventDefault()
    if (!codigoValido(codigo) || trabajando) return
    setTrabajando(true)
    setError(null)
    const eraPrimero = !activa
    const r = await verificarCodigo(alta.id, codigo)
    if (r.error) {
      setTrabajando(false)
      return setError(r.error)
    }
    setAlta(null)
    const { data } = await supabase.auth.getUser()
    if (data?.user) setUsuario(data.user)
    // Al activarla por primera vez se crean los códigos de recuperación
    if (eraPrimero) await nuevosCodigos()
    setTrabajando(false)
    d.avisar(eraPrimero ? 'Verificación en dos pasos activada' : 'Dispositivo sumado')
  }
  async function regenerar() {
    const si = await d.confirmar({
      titulo: '¿Crear códigos nuevos?',
      texto: 'Los que tenías dejan de servir. Vas a tener que guardar los nuevos.',
      boton: 'Crear nuevos',
    })
    if (!si) return
    setTrabajando(true)
    setError(null)
    const r = await generarCodigosRecuperacion()
    setTrabajando(false)
    if (r.error) return setError(r.error)
    setCodigos(r.codigos)
  }
  async function apagar() {
    const si = await d.confirmar({
      titulo: '¿Desactivar la verificación en dos pasos?',
      texto: 'Para entrar alcanzará con tu contraseña. La podés volver a activar cuando quieras.',
      boton: 'Desactivar',
    })
    if (!si) return
    setTrabajando(true)
    setError(null)
    let r = { ok: true }
    for (const f of activos) {
      r = await desactivar(f.id)
      if (r.error) break
    }
    setTrabajando(false)
    if (r.error) return setError(r.error)
    const { data } = await supabase.auth.getUser()
    if (data?.user) setUsuario(data.user)
    setCodigos(null)
    d.avisar('Verificación en dos pasos desactivada')
  }

  const formAlta = alta && (
    <form onSubmit={confirmar} className="mt-2">
      <ol className="text-sm space-y-1 list-decimal pl-5">
        <li>
          Abrí tu app autenticadora (Google Authenticator, Authy, Microsoft Authenticator, 1Password...)
          {activa ? ' en el otro dispositivo' : ''}.
        </li>
        <li>Escaneá este código o cargá la clave a mano.</li>
        <li>Escribí el código de 6 números que te muestra.</li>
      </ol>
      <div className="flex justify-center my-3">
        <img src={alta.qr} alt="Código QR para la app autenticadora" className="w-44 h-44 rounded-xl bg-white p-2" />
      </div>
      <p className="text-xs text-gris text-center">Clave para cargar a mano:</p>
      <p className="text-sm font-mono text-center break-all select-all" data-testid="dos-pasos-secreto">
        {alta.secreto}
      </p>
      <label htmlFor={`${id}-c`} className="etiqueta mt-3">
        Código de 6 números
      </label>
      <input
        id={`${id}-c`}
        className="campo text-center text-xl tracking-[0.3em] font-semibold"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        value={codigo}
        onChange={(e) => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
      />
      <Err>{error}</Err>
      <div className="flex gap-2 mt-3">
        <button type="button" onClick={() => setAlta(null)} className="btn-suave flex-1">
          Cancelar
        </button>
        <button type="submit" disabled={!codigoValido(codigo) || trabajando} className="btn-primario flex-1">
          {activa ? 'Sumar' : 'Activar'}
        </button>
      </div>
    </form>
  )

  return (
    <section className="tarjeta p-5 mb-4" aria-labelledby={`${id}-t`} data-testid="dos-pasos">
      <h2 id={`${id}-t`} className="font-semibold flex items-center gap-2">
        <Icono n="key" className="text-verde-texto" /> Verificación en dos pasos
      </h2>
      {activa ? (
        <>
          <p className="text-sm text-gris mt-1">
            <b className="text-verde-texto">Activada</b>
            {activos.length > 1 ? ` en ${activos.length} dispositivos` : ''}. Al entrar, además de la contraseña te pedimos el código de tu
            app autenticadora.
          </p>
          {codigos ? (
            <CodigosNuevos codigos={codigos} onListo={() => setCodigos(null)} avisar={d.avisar} />
          ) : alta ? (
            formAlta
          ) : (
            <>
              {quedan !== null && (
                <p className="text-sm mt-2" data-testid="codigos-quedan">
                  {quedan > 0 ? (
                    <>Te {quedan === 1 ? 'queda 1 código' : `quedan ${quedan} códigos`} de recuperación.</>
                  ) : (
                    <b className="text-naranja-oscuro">No tenés códigos de recuperación: creá unos por si perdés el teléfono.</b>
                  )}
                </p>
              )}
              <Err>{error}</Err>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <button onClick={regenerar} disabled={trabajando} className="btn-suave">
                  Códigos nuevos
                </button>
                <button onClick={empezar} disabled={trabajando} className="btn-suave">
                  Otro dispositivo
                </button>
              </div>
              <button onClick={apagar} disabled={trabajando} className="btn-suave w-full mt-2">
                Desactivar
              </button>
            </>
          )}
        </>
      ) : alta ? (
        formAlta
      ) : (
        <>
          <p className="text-sm text-gris mt-1">
            Opcional. Suma un código de una app autenticadora al entrar, así nadie puede usar tu cuenta aunque sepa tu contraseña.
          </p>
          <Err>{error}</Err>
          <button onClick={empezar} disabled={trabajando} className="btn-suave w-full mt-3">
            <Icono n="key" size={20} /> Activar
          </button>
        </>
      )}
    </section>
  )
}
