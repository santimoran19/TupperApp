// Para quien ya tenía cuenta antes de la 1.28 (L-04): una sola vez, la casilla del consentimiento de los datos de salud.
// Si no la acepta, puede salir o borrar su cuenta desde acá mismo.
import { useEffect, useState } from 'react'
import CasillaSalud from '../components/CasillaSalud'
import { Logo } from '../components/Marco'
import { Icono } from '../components/ui'
import { useDatos } from '../store/Datos'

export default function ConsentimientoSalud() {
  const { aceptarSalud, salir, borrarCuenta } = useDatos()
  const [acepto, setAcepto] = useState(false)
  const [intento, setIntento] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [borrar, setBorrar] = useState(false)
  useEffect(() => {
    document.title = 'Tus datos · Tupper'
  }, [])

  async function guardar(ev) {
    ev.preventDefault()
    setIntento(true)
    if (!acepto) return
    setGuardando(true)
    await aceptarSalud()
    setGuardando(false)
  }
  async function borrarTodo() {
    setGuardando(true)
    if (!(await borrarCuenta())) setGuardando(false)
  }

  return (
    <div className="min-h-screen bg-fondo flex items-center justify-center p-5" data-testid="consentimiento-salud">
      <div className="w-full max-w-[420px]">
        <div className="flex flex-col items-center text-center mb-6">
          <Logo size={64} />
          <h1 className="text-2xl font-bold mt-3 tracking-tight">Tus datos de salud</h1>
          <p className="text-gris mt-1">
            Para seguir, confirmanos con esta casilla que la app puede usar tus datos de salud. Lo pide la ley de protección de datos
            personales y es una sola vez.
          </p>
        </div>
        <form onSubmit={guardar} noValidate className="tarjeta p-5 space-y-4">
          <CasillaSalud acepto={acepto} onCambiar={setAcepto} error={intento && !acepto} />
          <button type="submit" disabled={guardando} className="btn-primario w-full">
            Continuar
          </button>
          <div className="flex justify-center gap-4 text-sm font-semibold text-gris">
            <button type="button" onClick={() => salir({ preguntar: false })}>
              Salir
            </button>
            <button type="button" onClick={() => setBorrar(true)} aria-expanded={borrar}>
              No acepto: borrar mi cuenta
            </button>
          </div>
          {borrar && (
            <div className="rounded-2xl bg-rojo-suave p-3 text-sm" role="alert">
              <p>Se borran tu cuenta y todos tus datos, y no se puede deshacer.</p>
              <button type="button" onClick={borrarTodo} disabled={guardando} className="btn w-full mt-3 bg-rojo text-white">
                <Icono n="delete" size={20} /> Sí, borrar todo
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
