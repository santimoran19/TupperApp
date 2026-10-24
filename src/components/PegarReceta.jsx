// Cargar una receta pegando el texto (1.29, IA-04): la IA la pasa a datos y la app busca cada ingrediente entre tus
// alimentos. Llena el formulario de Nueva receta; se revisa antes de guardar.
import { useState } from 'react'
import { Hoja, Icono } from './ui'
import { useDatos } from '../store/Datos'
import { ingredientesDe } from '../lib/registroIA'

export default function PegarReceta({ onReceta }) {
  const d = useDatos()
  const [abierta, setAbierta] = useState(false)
  const [texto, setTexto] = useState('')
  const [trabajando, setTrabajando] = useState(false)
  const [error, setError] = useState(null)

  async function armar(ev) {
    ev.preventDefault()
    if (texto.trim().length < 20 || trabajando) return
    setTrabajando(true)
    setError(null)
    const r = await d.leerRecetaIA(texto.trim())
    setTrabajando(false)
    if (r.error) return setError(r.error)
    const { ingredientes, sinCruzar } = ingredientesDe(r.receta.items, { alimentos: d.alimentos })
    onReceta({ ...r.receta, ingredientes, sinCruzar })
    setAbierta(false)
    setTexto('')
  }

  return (
    <>
      <button onClick={() => setAbierta(true)} className="w-full tarjeta p-4 flex items-center gap-3 text-left" data-testid="pegar-receta">
        <span className="w-10 h-10 rounded-full bg-teal-suave text-teal-oscuro flex items-center justify-center shrink-0">
          <Icono n="wand_stars" />
        </span>
        <span className="flex-1 min-w-0">
          <span className="block font-semibold">¿La tenés escrita? Pegala</span>
          <span className="block text-xs text-gris">La IA arma la receta con tus alimentos y vos la revisás</span>
        </span>
      </button>
      {abierta && (
        <Hoja titulo="Pegar una receta" onCerrar={() => setAbierta(false)}>
          <form onSubmit={armar}>
            <label htmlFor="pr-texto" className="text-sm text-gris block mb-2">
              Pegá la receta con los ingredientes y las cantidades (de una página, un mensaje o tu cuaderno). Se manda a un servicio de IA
              solo para leerla y no se guarda.
            </label>
            <textarea
              id="pr-texto"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              maxLength={4000}
              rows={10}
              placeholder={
                'Tarta de zapallitos (4 porciones)\n3 zapallitos, 1 cebolla, 3 huevos, 100 g de queso rallado, 1 tapa de tarta...\n\nRehogar la cebolla...'
              }
              className="campo w-full !h-auto py-3 resize-y"
            />
            {error && (
              <p className="text-sm mt-2 rounded-xl p-3 bg-naranja-suave text-naranja-oscuro" role="alert">
                {error}
              </p>
            )}
            <button type="submit" disabled={trabajando || texto.trim().length < 20} className="btn-primario w-full mt-3">
              <Icono n={trabajando ? 'hourglass_empty' : 'wand_stars'} size={20} /> {trabajando ? 'Leyendo la receta…' : 'Armar receta'}
            </button>
          </form>
        </Hoja>
      )}
    </>
  )
}
