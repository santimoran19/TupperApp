// Primera vez que entra el usuario: carga sus datos y queda calculado el objetivo.
import { useEffect } from 'react'
import FormularioPerfil from '../components/FormularioPerfil'
import { Logo } from '../components/Marco'
import { useDatos } from '../store/Datos'
import { hoy } from '../lib/fechas'

export default function Bienvenida() {
  const { guardarPerfil, guardarMedida, salir } = useDatos()
  useEffect(() => {
    document.title = 'Tu perfil · Tupper'
  }, [])

  async function guardar(datos) {
    const listo = await guardarPerfil(datos)
    if (listo && datos.weight_kg) await guardarMedida({ date: hoy(), weight_kg: datos.weight_kg, waist_cm: null })
  }

  return (
    <div className="min-h-screen bg-fondo p-5">
      <div className="max-w-[440px] mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <Logo size={44} />
          <div>
            <h1 className="text-xl font-bold">Armemos tu perfil</h1>
            <p className="text-sm text-gris">Con esto se calcula cuánto tenés que comer por día.</p>
          </div>
        </div>
        <div className="tarjeta p-5">
          <FormularioPerfil textoBoton="Empezar" onGuardar={guardar} />
        </div>
        <button onClick={() => salir({ preguntar: false })} className="block mx-auto mt-4 text-sm text-gris underline">
          Salir
        </button>
      </div>
    </div>
  )
}
