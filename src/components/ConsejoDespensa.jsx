// Un consejo por día de la despensa, en el Diario (1.31, F-24): lo que vence primero o, si no hay, uno de los
// alimentos que tenés (cambia cada día). Lleva a la Despensa, donde está el carrusel con todos.
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import Foto from './Foto'
import { Icono } from './ui'
import { useDatos } from '../store/Datos'
import { estadoVencimiento } from '../lib/despensa'
import { consejosPara } from '../lib/consejos'

const TITULOS = {
  vence: 'ANTES DE QUE VENZA',
  guardar: 'PARA QUE DURE MÁS',
  aprovechar: 'PARA APROVECHARLO',
}

export default function ConsejoDespensa({ hoy }) {
  const { stock, alimentosPorId, vencimientos } = useDatos()
  const consejo = useMemo(() => {
    const filas = stock
      .filter((s) => Number(s.qty) > 0 && alimentosPorId.has(s.food_id))
      .map((s) => {
        const vence = vencimientos.get(s.food_id) || null
        return { a: alimentosPorId.get(s.food_id), qty: Number(s.qty), vence, estado: estadoVencimiento(vence, hoy) }
      })
    // Sin despensa cargada no hay nada que decir (los generales quedan para la Despensa)
    if (!filas.length) return null
    const [c] = consejosPara(filas, { hoy, maximo: 1 })
    return c?.alimento ? c : null
  }, [stock, alimentosPorId, vencimientos, hoy])
  if (!consejo) return null
  return (
    <Link to="/despensa" className="flex items-start gap-3 rounded-2xl bg-campo p-3.5 mb-4" data-testid="consejo-despensa">
      <Foto
        ruta={consejo.alimento.image_path}
        categoria={consejo.alimento.category}
        para={consejo.alimento.name}
        className="w-11 h-11 rounded-xl shrink-0"
        icono={20}
      />
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-bold tracking-wider text-verde-texto">
          {TITULOS[consejo.tipo] || 'DE TU DESPENSA'}
          {consejo.tipo === 'vence' && consejo.estado?.texto && (
            <span className="font-semibold tracking-normal normal-case"> · {consejo.estado.texto}</span>
          )}
        </span>
        <span className="block font-semibold leading-snug mt-0.5">{consejo.alimento.name}</span>
        <span className="block text-sm text-gris leading-snug">{consejo.texto}</span>
      </span>
      <Icono n="chevron_right" size={20} className="text-gris self-center" />
    </Link>
  )
}
