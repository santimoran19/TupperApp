// Se les pide a las cuentas que ya existían y todavía no tienen nombre de usuario. Se puede dejar para después: vuelve a
// aparecer la próxima vez que se abre la app.
import { useEffect, useState } from 'react'
import CampoUsuario, { useEstadoUsuario } from '../components/CampoUsuario'
import { Logo } from '../components/Marco'
import { useDatos } from '../store/Datos'

export default function ElegirUsuario({ onDespues }) {
  const { ajustarPerfil } = useDatos()
  const [valor, setValor] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [intento, setIntento] = useState(false)
  const estado = useEstadoUsuario(valor)
  useEffect(() => {
    document.title = 'Elegí tu usuario · Tupper'
  }, [])

  async function guardar(ev) {
    ev.preventDefault()
    setIntento(true)
    // Si todavía se está comprobando si está libre, se guarda igual: la base lo vuelve a revisar y avisa si se lo ganaron
    if (estado.error) return
    setGuardando(true)
    // Si se guarda, el perfil cambia y la app sigue sola; si no (por ejemplo, se lo ganaron), el aviso explica por qué
    await ajustarPerfil({ username: estado.usuario })
    setGuardando(false)
  }

  return (
    <div className="min-h-screen bg-fondo flex items-center justify-center p-5">
      <div className="w-full max-w-[400px]">
        <div className="flex flex-col items-center text-center mb-6">
          <Logo size={64} />
          <h1 className="text-2xl font-bold mt-3 tracking-tight">Elegí tu usuario</h1>
          <p className="text-gris mt-1">
            Con un nombre de usuario podés iniciar sesión sin escribir el email. El email también sigue sirviendo.
          </p>
        </div>
        <form onSubmit={guardar} noValidate className="tarjeta p-5 space-y-4">
          <CampoUsuario valor={valor} onChange={setValor} estado={estado} mostrarError={intento || !!valor} />
          <button type="submit" disabled={guardando} className="btn-primario w-full">
            Guardar
          </button>
          <button type="button" onClick={onDespues} className="block mx-auto text-sm font-semibold text-gris">
            Ahora no
          </button>
        </form>
      </div>
    </div>
  )
}
