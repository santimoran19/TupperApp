// Alimentos que creó el usuario (a mano o desde Open Food Facts): editar y borrar.
import { useMemo, useState } from 'react'
import Marco from '../components/Marco'
import { NuevoAlimento } from '../components/SelectorAlimento'
import { Hoja, Icono, Vacio } from '../components/ui'
import { useDatos } from '../store/Datos'
import { redondear } from '../lib/nutricion'

export default function MisAlimentos() {
  const d = useDatos()
  const [editando, setEditando] = useState(null) // un alimento, o 'nuevo'
  const propios = useMemo(() => d.alimentos.filter((a) => a.owner).sort((a, b) => a.name.localeCompare(b.name, 'es')), [d.alimentos])

  async function borrar(a) {
    const usos = d.items.filter((i) => i.food_id === a.id).length
    const aviso = usos > 0 ? ` Está en ${usos === 1 ? 'una receta tuya' : `${usos} recetas tuyas`}: se saca de ahí también.` : ''
    if (!(await d.confirmar({ titulo: `¿Borrar ${a.name}?`, texto: `${aviso.trim()} Lo que ya registraste queda como estaba.`.trim() }))) return
    if (await d.borrarAlimento(a.id)) { await d.recargar(); d.avisar('Alimento borrado') }
  }

  return (
    <Marco titulo="Mis alimentos" atras>
      <p className="text-sm text-gris mb-4">Los alimentos que cargaste vos. Los de la base no se pueden tocar, pero podés crear tu versión.</p>
      {propios.length === 0 ? (
        <Vacio icono="eco" titulo="Todavía no creaste ninguno" texto="Cuando no encuentres algo en el buscador, lo creás con los datos de la etiqueta y queda guardado.">
          <button onClick={() => setEditando('nuevo')} className="btn-primario"><Icono n="add" /> Crear alimento</button>
        </Vacio>
      ) : (
        <>
          <div className="tarjeta px-4 divide-y divide-linea">
            {propios.map((a) => (
              <div key={a.id} className="flex items-center gap-1 py-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{a.name}</p>
                  <p className="text-xs text-gris">
                    {redondear(a.kcal)} kcal y {redondear(a.protein, 1)} g prot. cada 100 {a.unit === 'ml' ? 'ml' : 'g'} · {a.category}
                  </p>
                </div>
                <button onClick={() => setEditando(a)} className="w-9 h-9 text-verde" aria-label={`Editar ${a.name}`}><Icono n="edit" size={20} /></button>
                <button onClick={() => borrar(a)} className="w-9 h-9 text-gris" aria-label={`Borrar ${a.name}`}><Icono n="delete" size={20} /></button>
              </div>
            ))}
          </div>
          <button onClick={() => setEditando('nuevo')} className="btn-suave w-full mt-4"><Icono n="add" size={20} /> Crear alimento</button>
        </>
      )}

      {editando && (
        <Hoja titulo={editando === 'nuevo' ? 'Nuevo alimento' : 'Editar alimento'} onCerrar={() => setEditando(null)}>
          <NuevoAlimento
            inicial={editando === 'nuevo' ? null : editando}
            onCancelar={() => setEditando(null)}
            onListo={() => { setEditando(null); d.avisar('Alimento guardado') }}
          />
        </Hoja>
      )}
    </Marco>
  )
}
