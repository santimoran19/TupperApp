// Detalle de una receta: ingredientes contra el stock, pasos y cocinar.
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Marco from '../components/Marco'
import { Err, Hoja, Icono, Macros, Numero } from '../components/ui'
import { useDatos } from '../store/Datos'
import { cantidadTexto, listaComidas, redondear } from '../lib/nutricion'
import { disponibilidad } from '../lib/planificador'
import { LIM, errNumero } from '../lib/validar'

export default function RecetaDetalle() {
  const { id } = useParams()
  const d = useDatos()
  const nav = useNavigate()
  const receta = d.recetasPorId.get(id)
  const [cocinando, setCocinando] = useState(null) // porciones a cocinar (texto)

  if (!receta) return <Marco titulo="Receta" atras><p className="text-gris">Esa receta ya no existe.</p></Marco>

  const items = d.itemsDe(id)
  const m = d.macrosPorReceta.get(id)
  const cocinadas = d.preparadoMap.get(id) || 0
  const porciones = Number(cocinando) || 0
  const disp = disponibilidad(receta, items, d.stockMap, porciones || 1)
  const faltaDe = new Map(disp.faltan.map((f) => [f.food_id, f.falta]))

  const errPorciones = cocinando === null ? null : errNumero(cocinando, LIM.porciones)
  async function cocinar() {
    if (errPorciones) return
    const listo = await d.cocinar(id, porciones)
    if (listo) { setCocinando(null); d.avisar(`${porciones} ${porciones === 1 ? 'porción lista' : 'porciones listas'}`) }
  }
  async function anotarFaltantes() {
    for (const f of disponibilidad(receta, items, d.stockMap, 1).faltan) {
      const a = d.alimentosPorId.get(f.food_id)
      await d.agregarALista(f.food_id, a.unit === 'u' ? Math.ceil(f.falta) : Math.ceil(f.falta / 50) * 50)
    }
    d.avisar('Anotado en la lista de compras')
  }
  async function borrar() {
    if (!(await d.confirmar({ titulo: '¿Borrar esta receta?', texto: 'Se saca también del plan. No se puede deshacer.' }))) return
    if (await d.borrarReceta(id)) nav('/recetas', { replace: true })
  }
  const oculta = d.ocultas.has(id)
  const favorita = d.favoritas.has(id)
  async function ocultar() {
    const r = await d.ocultarReceta(id)
    if (!r) return
    d.avisar(r.vaciadas ? `Receta oculta. ${r.vaciadas === 1 ? 'Quedó 1 comida del plan vacía' : `Quedaron ${r.vaciadas} comidas del plan vacías`}` : 'Receta oculta: no te la muestro más')
    nav('/recetas', { replace: true })
  }

  return (
    <Marco titulo="Receta" atras>
      {oculta && (
        <div className="rounded-2xl bg-campo p-4 mb-4 flex items-center gap-3">
          <Icono n="visibility_off" className="text-gris" />
          <p className="text-sm flex-1">Esta receta está oculta.</p>
          <button onClick={() => d.mostrarReceta(id)} className="btn-chico bg-verde text-white">Mostrar de nuevo</button>
        </div>
      )}
      <div className="flex items-start gap-2">
        <h2 className="flex-1 text-2xl font-bold tracking-tight leading-tight">{receta.name}</h2>
        {!oculta && (
          <button onClick={() => d.alternarFavorita(id)} aria-label={favorita ? 'Quitar de favoritas' : 'Marcar como favorita'}
            className={`w-10 h-10 rounded-full bg-white shadow-tarjeta flex items-center justify-center ${favorita ? 'text-coral-oscuro' : 'text-gris/80'}`}>
            <Icono n="favorite" lleno={favorita} />
          </button>
        )}
      </div>
      <p className="text-sm text-gris mt-1 mb-3">
        {receta.minutes} min · {listaComidas(receta.meal_types)} · {receta.servings === 1 ? '1 porción' : `rinde ${receta.servings} porciones`} · {receta.portable ? 'se puede llevar' : 'para comer en casa'}
      </p>
      <Macros m={m} />
      <p className="text-xs text-gris mt-1.5 mb-4">Valores por porción.</p>

      {cocinadas > 0 && (
        <div className="rounded-2xl bg-teal-suave p-4 mb-4 flex items-center gap-3">
          <Icono n="takeout_dining" className="text-teal-oscuro" lleno />
          <p className="text-sm flex-1">Tenés <b>{redondear(cocinadas, 1)} {cocinadas === 1 ? 'porción cocinada' : 'porciones cocinadas'}</b> de esta receta.</p>
        </div>
      )}

      <section className="tarjeta p-4 mb-4">
        <h3 className="font-semibold mb-1">Ingredientes{receta.servings > 1 ? ` (para ${receta.servings} porciones)` : ''}</h3>
        <div className="divide-y divide-linea">
          {items.map((it) => {
            const a = d.alimentosPorId.get(it.food_id)
            if (!a) return null
            const hay = d.stockMap.get(a.id) || 0
            const alcanza = hay + 0.001 >= it.qty / receta.servings
            return (
              <div key={a.id} className="flex items-center gap-3 py-2.5">
                <Icono n={alcanza ? 'check_circle' : 'cancel'} lleno className={alcanza ? 'text-verde-medio' : 'text-naranja-oscuro'} size={20} />
                <span className="flex-1 text-sm">{a.name.split(' (')[0]}</span>
                <span className="text-sm text-right">
                  <b>{cantidadTexto(a, it.qty)}</b>
                  <span className="block text-xs text-gris">tenés {cantidadTexto(a, hay)}</span>
                </span>
              </div>
            )
          })}
        </div>
        {!disponibilidad(receta, items, d.stockMap, 1).ok && (
          <button onClick={anotarFaltantes} className="btn-suave w-full mt-3"><Icono n="add_shopping_cart" size={20} /> Anotar lo que falta en la lista</button>
        )}
      </section>

      <section className="tarjeta p-4 mb-5">
        <h3 className="font-semibold mb-2">Pasos</h3>
        <ol className="space-y-2.5">
          {receta.steps.split('\n').filter(Boolean).map((paso, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="w-6 h-6 shrink-0 rounded-full bg-verde-suave text-verde text-xs font-bold flex items-center justify-center">{i + 1}</span>
              <span>{paso}</span>
            </li>
          ))}
        </ol>
      </section>

      <div className="flex gap-2">
        <button onClick={() => setCocinando(String(receta.servings))} className="btn-primario flex-1"><Icono n="skillet" /> Cocinar</button>
        <button onClick={() => nav(`/registrar?receta=${id}`)} className="btn-suave flex-1"><Icono n="restaurant" /> La comí</button>
      </div>
      {receta.owner ? (
        <div className="flex justify-center gap-6 mt-5 text-sm">
          <button onClick={() => nav(`/recetas/${id}/editar`)} className="font-semibold text-verde flex items-center gap-1"><Icono n="edit" size={16} /> Editar</button>
          <button onClick={borrar} className="font-semibold text-rojo flex items-center gap-1"><Icono n="delete" size={16} /> Borrar</button>
        </div>
      ) : !oculta && (
        <button onClick={ocultar} className="mx-auto mt-5 text-sm font-semibold text-gris flex items-center gap-1.5"><Icono n="visibility_off" size={16} /> No me gusta: no mostrarla más</button>
      )}

      {cocinando !== null && (
        <Hoja titulo="Cocinar" onCerrar={() => setCocinando(null)}>
          <label className="etiqueta">¿Cuántas porciones vas a cocinar?</label>
          <Numero valor={cocinando} onChange={setCocinando} autoFocus decimales={1} largo={4} error={cocinando !== '' && !!errPorciones} />
          <Err>{cocinando !== '' && errPorciones}</Err>
          <p className="text-sm text-gris mt-3">Se descuentan los ingredientes de tu despensa y las porciones quedan como comida lista. Cuando registres que la comiste, se descuenta de ahí.</p>
          {porciones > 0 && !disp.ok && (
            <div className="rounded-xl bg-naranja-suave text-naranja-oscuro text-sm p-3 mt-3">
              Para {porciones} {porciones === 1 ? 'porción' : 'porciones'} te falta: {disp.faltan.map((f) => { const a = d.alimentosPorId.get(f.food_id); return `${a.name.split(' (')[0]} (${cantidadTexto(a, f.falta)})` }).join(', ')}. Podés cocinar igual y el stock queda en cero.
            </div>
          )}
          <button onClick={cocinar} disabled={!!errPorciones} className="btn-primario w-full mt-4">Listo, cociné {porciones || ''} {porciones === 1 ? 'porción' : 'porciones'}</button>
        </Hoja>
      )}
    </Marco>
  )
}
