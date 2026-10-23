// Poner, cambiar o quitar la foto de un alimento o una receta propia (1.24). Abre la cámara o la galería del teléfono.
import { useRef, useState } from 'react'
import { useDatos } from '../store/Datos'
import Foto from './Foto'
import { Icono } from './ui'

// `tipo`: 'alimento' o 'receta'. `fila`: el alimento o la receta (con image_path). `categoria`: para la ilustración.
export default function ElegirFoto({ tipo, fila, categoria, className = 'w-24 h-24 rounded-3xl' }) {
  const d = useDatos()
  const entrada = useRef(null)
  const [subiendo, setSubiendo] = useState(false)
  const elegir = async (ev) => {
    const archivo = ev.target.files?.[0]
    ev.target.value = ''
    if (!archivo) return
    setSubiendo(true)
    const listo = await d.ponerFoto(tipo, fila.id, archivo)
    setSubiendo(false)
    if (listo) d.avisar('Foto guardada')
  }
  const quitar = async () => {
    if (!(await d.confirmar({ titulo: '¿Quitar la foto?', texto: 'Vuelve a verse el dibujo de su categoría.', boton: 'Quitar' }))) return
    if (await d.quitarFoto(tipo, fila.id)) d.avisar('Foto quitada')
  }
  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <Foto ruta={fila.image_path} categoria={categoria} nombre={fila.name} className={className} icono={40} />
        {subiendo && (
          <div className="absolute inset-0 rounded-[inherit] bg-black/40 flex items-center justify-center" aria-live="polite">
            <span className="w-7 h-7 rounded-full border-[3px] border-white/40 border-t-white animate-spin" />
            <span className="sr-only">Subiendo la foto</span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 items-start">
        <button
          type="button"
          onClick={() => entrada.current?.click()}
          disabled={subiendo}
          className="btn-chico bg-verde-suave text-verde-texto"
        >
          <Icono n="add_a_photo" size={18} /> {fila.image_path ? 'Cambiar foto' : 'Poner foto'}
        </button>
        {fila.image_path && (
          <button type="button" onClick={quitar} disabled={subiendo} className="btn-chico bg-campo text-tinta">
            <Icono n="delete" size={18} /> Quitar
          </button>
        )}
        <input ref={entrada} type="file" accept="image/*" className="hidden" onChange={elegir} aria-label="Elegir una foto" />
      </div>
    </div>
  )
}
