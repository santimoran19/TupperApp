// Mis categorías (1.30, F-13): crear, renombrar y borrar las propias. Las de siempre se ven pero no se tocan.
// Para mover un alimento a una categoría: en la Despensa, tocando el alimento (o al crearlo).
import { useMemo, useState } from 'react'
import { Err, Hoja, Icono } from './ui'
import { useDatos } from '../store/Datos'
import { cuantosPorCategoria, errorNombre, MAX_CATEGORIAS } from '../lib/categorias'

export default function Categorias() {
  const d = useDatos()
  const [hoja, setHoja] = useState(null) // { tipo: 'nueva' } | { tipo: 'renombrar', nombre }
  const [nombre, setNombre] = useState('')
  const [tocado, setTocado] = useState(false)
  const propias = d.categoriasPropias || []
  const cuantos = useMemo(() => cuantosPorCategoria(d.alimentos), [d.alimentos])
  const error = hoja ? errorNombre(nombre, propias, hoja.tipo === 'renombrar' ? hoja.nombre : null) : null

  const abrir = (h) => {
    setHoja(h)
    setNombre(h.nombre || '')
    setTocado(false)
  }
  async function guardar(ev) {
    ev.preventDefault()
    setTocado(true)
    if (error) return
    const listo = hoja.tipo === 'nueva' ? await d.crearCategoria(nombre) : await d.renombrarCategoria(hoja.nombre, nombre)
    if (!listo) return
    setHoja(null)
    d.avisar(hoja.tipo === 'nueva' ? 'Categoría creada' : 'Categoría renombrada')
  }
  async function borrar(c) {
    const n = cuantos.get(c.nombre) || 0
    const si = await d.confirmar({
      titulo: `¿Borrar "${c.nombre}"?`,
      texto:
        n > 0
          ? `${n === 1 ? 'El alimento que tiene pasa' : `Los ${n} alimentos que tiene pasan`} a "Otros" (los de la base vuelven a su categoría de siempre).`
          : 'No tiene alimentos.',
      boton: 'Borrar',
    })
    if (si && (await d.borrarCategoria(c.nombre))) d.avisar('Categoría borrada')
  }

  return (
    <section className="tarjeta p-4 mt-6" aria-labelledby="cat-titulo" data-testid="categorias">
      <h2 id="cat-titulo" className="font-bold flex items-center gap-2">
        <Icono n="checklist" className="text-verde-texto" /> Mis categorías
      </h2>
      <p className="text-sm text-gris mt-1">
        Armá las tuyas ("Para el mate", "Cosas del bebé"). Para mover un alimento, tocalo en la Despensa y elegí la categoría: los de la
        base cambian solo para vos.
      </p>
      {propias.length > 0 && (
        <ul className="mt-3 divide-y divide-linea">
          {propias.map((c) => (
            <li key={c.id || c.nombre} className="flex items-center gap-1 py-2.5">
              <span className="flex-1 min-w-0">
                <span className="block font-medium truncate">{c.nombre}</span>
                <span className="block text-xs text-gris">
                  {(cuantos.get(c.nombre) || 0) === 1 ? '1 alimento' : `${cuantos.get(c.nombre) || 0} alimentos`}
                </span>
              </span>
              <button
                onClick={() => abrir({ tipo: 'renombrar', nombre: c.nombre })}
                className="toque w-9 h-9 text-verde-texto"
                aria-label={`Renombrar ${c.nombre}`}
              >
                <Icono n="edit" size={20} />
              </button>
              <button onClick={() => borrar(c)} className="toque w-9 h-9 text-gris" aria-label={`Borrar la categoría ${c.nombre}`}>
                <Icono n="delete" size={20} />
              </button>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => abrir({ tipo: 'nueva' })} disabled={propias.length >= MAX_CATEGORIAS} className="btn-suave w-full mt-3">
        <Icono n="add" size={20} /> Nueva categoría
      </button>
      <details className="mt-3 text-sm">
        <summary className="text-gris font-semibold cursor-pointer">Las de siempre ({d.categorias.length - propias.length})</summary>
        <p className="text-gris mt-2 leading-relaxed">{d.categorias.filter((c) => !propias.some((p) => p.nombre === c)).join(' · ')}</p>
      </details>

      {hoja && (
        <Hoja titulo={hoja.tipo === 'nueva' ? 'Nueva categoría' : `Renombrar "${hoja.nombre}"`} onCerrar={() => setHoja(null)}>
          <form onSubmit={guardar} noValidate>
            <label className="etiqueta" htmlFor="cat-nombre">
              Nombre
            </label>
            <input
              id="cat-nombre"
              className="campo"
              value={nombre}
              maxLength={40}
              onChange={(e) => setNombre(e.target.value)}
              onBlur={() => setTocado(true)}
              autoFocus
              aria-invalid={(tocado && !!error) || undefined}
            />
            <Err>{tocado ? error : null}</Err>
            <button type="submit" className="btn-primario w-full mt-4">
              {hoja.tipo === 'nueva' ? 'Crear' : 'Guardar'}
            </button>
          </form>
        </Hoja>
      )}
    </section>
  )
}
