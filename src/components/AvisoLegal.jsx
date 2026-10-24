// Aviso de cambios en los Términos o la Política (1.30, L-05): a quien ya tenía cuenta se le muestra una vez, arriba,
// qué cambió. Con "Entendido" queda anotado en el perfil (profiles.legales_vistos). Con una base sin la actualización 23
// la columna no existe (viene undefined) y no se muestra nada.
import { Link } from 'react-router-dom'
import { Icono } from './ui'
import { useDatos } from '../store/Datos'
import { MARCA } from '../lib/marca'

export default function AvisoLegal() {
  const d = useDatos()
  const visto = d.perfil?.legales_vistos
  if (visto === undefined || visto === MARCA.versionLegal) return null
  return (
    <div className="bg-teal-suave text-teal-oscuro text-sm px-4 py-2.5" role="status" data-testid="aviso-legal">
      <div className="max-w-[440px] lg:max-w-[1240px] mx-auto flex items-start gap-2">
        <Icono n="info" size={18} className="mt-0.5" />
        <p className="flex-1 leading-snug">
          <b>Actualizamos la Política de privacidad.</b> {MARCA.novedadesLegales}{' '}
          <Link to="/privacidad" className="underline font-semibold">
            Leerla
          </Link>
        </p>
        <button onClick={() => d.vioLegales(MARCA.versionLegal)} className="font-semibold shrink-0 underline">
          Entendido
        </button>
      </div>
    </div>
  )
}
