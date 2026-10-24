// Verificación en dos pasos en el Perfil (1.29, S-06): activarla escaneando un código QR con una app autenticadora, o
// desactivarla. Es opcional.
import { useEffect, useId, useState } from 'react'
import { Icono, Err } from './ui'
import { useDatos } from '../store/Datos'
import { supabase } from '../lib/supabase'
import { codigoValido, desactivar, empezarActivacion, factoresActivos, verificarCodigo } from '../lib/dosPasos'

export default function DosPasos() {
  const d = useDatos()
  const id = useId()
  const [usuario, setUsuario] = useState(d.usuario)
  const [alta, setAlta] = useState(null) // { id, qr, secreto } mientras se activa
  const [codigo, setCodigo] = useState('')
  const [error, setError] = useState(null)
  const [trabajando, setTrabajando] = useState(false)
  // Los factores vienen en el usuario de la sesión, que cambia al activar o desactivar
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_e, s) => s?.user && setUsuario(s.user))
    return () => data.subscription.unsubscribe()
  }, [])
  const activos = factoresActivos(usuario)
  const activa = activos.length > 0

  async function empezar() {
    setTrabajando(true)
    setError(null)
    const r = await empezarActivacion()
    setTrabajando(false)
    if (r.error) return setError(r.error)
    setAlta(r)
    setCodigo('')
  }
  async function confirmar(ev) {
    ev.preventDefault()
    if (!codigoValido(codigo) || trabajando) return
    setTrabajando(true)
    setError(null)
    const r = await verificarCodigo(alta.id, codigo)
    setTrabajando(false)
    if (r.error) return setError(r.error)
    setAlta(null)
    const { data } = await supabase.auth.getUser()
    if (data?.user) setUsuario(data.user)
    d.avisar('Verificación en dos pasos activada')
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
    d.avisar('Verificación en dos pasos desactivada')
  }

  return (
    <section className="tarjeta p-5 mb-4" aria-labelledby={`${id}-t`} data-testid="dos-pasos">
      <h2 id={`${id}-t`} className="font-semibold flex items-center gap-2">
        <Icono n="key" className="text-verde-texto" /> Verificación en dos pasos
      </h2>
      {activa ? (
        <>
          <p className="text-sm text-gris mt-1">
            <b className="text-verde-texto">Activada.</b> Al entrar, además de la contraseña te pedimos el código de tu app autenticadora.
          </p>
          <button onClick={apagar} disabled={trabajando} className="btn-suave w-full mt-3">
            Desactivar
          </button>
        </>
      ) : alta ? (
        <form onSubmit={confirmar} className="mt-2">
          <ol className="text-sm space-y-1 list-decimal pl-5">
            <li>Abrí tu app autenticadora (Google Authenticator, Authy, Microsoft Authenticator, 1Password...).</li>
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
              Activar
            </button>
          </div>
        </form>
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
