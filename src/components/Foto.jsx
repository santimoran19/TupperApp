// La foto de un alimento o una receta (1.24). Si no tiene, o si no carga (sin conexión, todavía no generada), se ve una
// ilustración con el ícono y el color de su categoría, así ninguna tarjeta queda vacía.
import { useEffect, useRef, useState } from 'react'
import { urlDeFoto } from '../lib/fotos'
import { Icono } from './ui'

// [ícono, fondo, color del ícono]. Clases escritas enteras para que Tailwind las encuentre.
const ESTILOS = {
  'Carnes y huevos': ['egg', 'bg-coral-suave', 'text-coral-oscuro'],
  Pescados: ['set_meal', 'bg-teal-suave', 'text-teal-oscuro'],
  Lácteos: ['water_full', 'bg-teal-suave', 'text-teal-oscuro'],
  Verduras: ['grocery', 'bg-verde-suave', 'text-verde-texto'],
  Frutas: ['nutrition', 'bg-naranja-suave', 'text-naranja-oscuro'],
  'Pastas y arroz': ['ramen_dining', 'bg-naranja-suave', 'text-naranja-oscuro'],
  Legumbres: ['grain', 'bg-verde-suave', 'text-verde-texto'],
  Panadería: ['bakery_dining', 'bg-naranja-suave', 'text-naranja-oscuro'],
  Cereales: ['breakfast_dining', 'bg-naranja-suave', 'text-naranja-oscuro'],
  Enlatados: ['soup_kitchen', 'bg-campo', 'text-gris'],
  'Salsas y aderezos': ['skillet', 'bg-coral-suave', 'text-coral-oscuro'],
  Despensa: ['kitchen', 'bg-campo', 'text-gris'],
  'Snacks y dulces': ['cookie', 'bg-naranja-suave', 'text-naranja-oscuro'],
  Congelados: ['ac_unit', 'bg-teal-suave', 'text-teal-oscuro'],
  'Comidas hechas': ['lunch_dining', 'bg-verde-suave', 'text-verde-texto'],
  Bebidas: ['local_drink', 'bg-teal-suave', 'text-teal-oscuro'],
  receta: ['restaurant', 'bg-verde-suave', 'text-verde-texto'],
}
const OTROS = ['restaurant', 'bg-campo', 'text-gris']
export const estiloDe = (categoria) => ESTILOS[categoria] || OTROS

// Las fotos que no cargaron no se vuelven a pedir en esta sesión (una base sin generar daría error en cada tarjeta)
const fallidas = new Set()

// `ruta`: image_path de la fila. `categoria`: la del alimento, o 'receta'. `className`: tamaño y redondeo.
export default function Foto({ ruta, categoria, nombre = '', className = 'w-16 h-16 rounded-2xl', icono = 28 }) {
  const url = ruta && !fallidas.has(ruta) ? urlDeFoto(ruta) : null
  const [cargo, setCargo] = useState(false)
  const [fallo, setFallo] = useState(false)
  const img = useRef(null)
  useEffect(() => {
    setCargo(false)
    setFallo(false)
  }, [url])
  // Si la imagen ya estaba en la memoria del navegador, `onLoad` puede llegar antes que React
  useEffect(() => {
    if (img.current?.complete && img.current.naturalWidth > 0) setCargo(true)
  }, [url])
  const [ic, fondo, color] = estiloDe(categoria)
  return (
    <div
      className={`relative overflow-hidden shrink-0 ${fondo} ${className}`}
      role={nombre ? 'img' : undefined}
      aria-label={nombre ? `Foto de ${nombre}` : undefined}
    >
      {(!url || fallo || !cargo) && (
        <div className={`absolute inset-0 flex items-center justify-center ${color}`} aria-hidden="true">
          <Icono n={ic} size={icono} />
        </div>
      )}
      {url && !fallo && (
        <img
          ref={img}
          src={url}
          alt=""
          loading="lazy"
          decoding="async"
          onLoad={() => setCargo(true)}
          onError={() => {
            fallidas.add(ruta)
            setFallo(true)
          }}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${cargo ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  )
}
