// Esqueletos de carga (1.30, D-04): la forma de la pantalla mientras llegan los datos o se baja la pantalla, en vez de
// "Cargando..." o un fondo vacío. Son solo cajas grises que laten suave (quietas si la persona pidió menos movimiento).
// Para los lectores de pantalla es un único "Cargando" (role="status").
import { Logo } from './Marco'

const Caja = ({ className = '' }) => <div className={`esqueleto rounded-xl ${className}`} />

function Cabecera() {
  return (
    <div className="h-16 px-4 lg:px-8 flex items-center gap-3 border-b border-verde-suave/60">
      <Logo size={36} />
      <div className="flex-1 space-y-1.5">
        <Caja className="h-2.5 w-12" />
        <Caja className="h-4 w-28" />
      </div>
      <Caja className="h-8 w-20 rounded-full!" />
      <Caja className="h-10 w-10 rounded-full!" />
    </div>
  )
}

// El Diario: la semana, el anillo de calorías y las comidas
function Diario() {
  return (
    <>
      <Caja className="h-3 w-32 mt-1" />
      <Caja className="h-7 w-44 mt-2" />
      <div className="flex gap-2 mt-4">
        {Array.from({ length: 7 }, (_, i) => (
          <Caja key={i} className="h-14 flex-1 rounded-2xl!" />
        ))}
      </div>
      <div className="tarjeta p-5 mt-4 flex items-center gap-4">
        <div className="esqueleto w-32 h-32 rounded-full shrink-0" />
        <div className="flex-1 space-y-3">
          <Caja className="h-14" />
          <Caja className="h-14" />
        </div>
      </div>
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="tarjeta p-4 mt-3 flex items-center gap-3">
          <Caja className="w-10 h-10 shrink-0" />
          <div className="flex-1 space-y-2">
            <Caja className="h-3 w-24" />
            <Caja className="h-4 w-36" />
          </div>
        </div>
      ))}
    </>
  )
}

// Cualquier otra pantalla: un título y unas tarjetas
function Pantalla() {
  return (
    <>
      <Caja className="h-10 w-full rounded-full! mt-1" />
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="tarjeta p-4 mt-3 flex items-center gap-3">
          <Caja className="w-14 h-14 shrink-0 rounded-2xl!" />
          <div className="flex-1 space-y-2">
            <Caja className="h-4 w-3/4" />
            <Caja className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </>
  )
}

export default function Esqueleto({ tipo = 'pantalla' }) {
  return (
    <div className="min-h-screen bg-fondo lg:pl-64" role="status" aria-label="Cargando" data-testid="esqueleto">
      <Cabecera />
      <div className="max-w-[440px] lg:max-w-[760px] mx-auto px-4 lg:px-8 py-4" aria-hidden="true">
        {tipo === 'diario' ? <Diario /> : <Pantalla />}
      </div>
    </div>
  )
}
