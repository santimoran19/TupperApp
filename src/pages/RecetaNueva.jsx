// Crear una receta propia a partir de los alimentos cargados, o editar una que ya es del usuario.
import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import Marco from '../components/Marco'
import SelectorAlimento from '../components/SelectorAlimento'
import { Err, Hoja, Icono, Macros, Numero } from '../components/ui'
import { useDatos } from '../store/Datos'
import { COMIDAS, NOMBRE_COMIDA, macrosDe, porcionSugerida, sumar, unidadDe } from '../lib/nutricion'
import { LIM, errCantidad, errNumero, errTexto, hayErrores, maxEnReceta } from '../lib/validar'

const MAX_INGREDIENTES = 30

export default function RecetaNueva() {
  const d = useDatos()
  const nav = useNavigate()
  const { id } = useParams() // viene solo al editar
  const original = id ? d.recetasPorId.get(id) : null
  const [f, setF] = useState(
    original
      ? {
          name: original.name,
          minutes: String(original.minutes),
          servings: String(original.servings),
          meal_types: original.meal_types,
          portable: original.portable,
          steps: original.steps || '',
        }
      : { name: '', minutes: '15', servings: '1', meal_types: ['almuerzo', 'cena'], portable: true, steps: '' },
  )
  const [elegidos, setIngredientes] = useState(() =>
    original
      ? d
          .itemsDe(id)
          .filter((i) => d.alimentosPorId.has(i.food_id))
          .map((i) => ({ food_id: i.food_id, qty: String(i.qty) }))
      : [],
  )
  // Si un alimento se borró desde otro dispositivo con esta pantalla abierta, se saca de la lista
  const ingredientes = elegidos.every((i) => d.alimentosPorId.has(i.food_id))
    ? elegidos
    : elegidos.filter((i) => d.alimentosPorId.has(i.food_id))
  if (ingredientes !== elegidos) setIngredientes(ingredientes)
  const [buscando, setBuscando] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }))

  const porciones = Math.max(1, Math.round(Number(f.servings) || 1))
  const total = sumar(ingredientes.map((i) => macrosDe(d.alimentosPorId.get(i.food_id), Number(i.qty) || 0)))
  const porPorcion = {
    kcal: total.kcal / porciones,
    protein: total.protein / porciones,
    carbs: total.carbs / porciones,
    fat: total.fat / porciones,
  }
  const [intento, setIntento] = useState(false)
  const errIngrediente = (i) => errCantidad(d.alimentosPorId.get(i.food_id), i.qty, maxEnReceta(d.alimentosPorId.get(i.food_id)))
  const errores = {
    name: errTexto(f.name, { max: LIM.nombre }),
    minutes: errNumero(f.minutes, LIM.minutos, { entero: true }),
    servings: errNumero(f.servings, LIM.rinde, { entero: true }),
    meal_types: f.meal_types.length === 0 ? 'Elegí al menos una comida.' : null,
    ingredientes:
      ingredientes.length === 0 ? 'Agregá al menos un ingrediente.' : ingredientes.some(errIngrediente) ? 'Revisá las cantidades.' : null,
    steps: f.steps.length > LIM.pasos ? `Como mucho ${LIM.pasos} caracteres.` : null,
  }

  // Solo se pueden editar las recetas propias
  if (id && !original?.owner) return <Navigate to="/recetas" replace />

  const alternarComida = (c) => set('meal_types')(f.meal_types.includes(c) ? f.meal_types.filter((x) => x !== c) : [...f.meal_types, c])

  async function guardar() {
    setIntento(true)
    if (hayErrores(errores)) return
    setGuardando(true)
    const datos = {
      name: f.name.trim(),
      minutes: Number(f.minutes),
      servings: porciones,
      meal_types: COMIDAS.filter((c) => f.meal_types.includes(c)),
      portable: f.portable,
      steps: f.steps.trim(),
    }
    const items = ingredientes.map((i) => ({ food_id: i.food_id, qty: Number(i.qty) }))
    const r = original ? await d.actualizarReceta(id, datos, items) : await d.crearReceta(datos, items)
    setGuardando(false)
    if (r) nav(`/recetas/${r.id}`, { replace: true })
  }

  return (
    <Marco titulo={original ? 'Editar receta' : 'Nueva receta'} atras sinNav>
      <div className="space-y-3">
        <div>
          <label className="etiqueta" htmlFor="rn-nombre">
            Nombre
          </label>
          <input
            id="rn-nombre"
            className="campo bg-superficie shadow-tarjeta"
            maxLength={LIM.nombre}
            value={f.name}
            onChange={(e) => set('name')(e.target.value)}
            placeholder="Ej.: Pollo con arroz"
          />
          <Err>{intento && errores.name}</Err>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="etiqueta" htmlFor="rn-min">
              Minutos
            </label>
            <Numero
              id="rn-min"
              valor={f.minutes}
              onChange={set('minutes')}
              decimales={0}
              largo={3}
              className="campo bg-superficie shadow-tarjeta"
              error={!!errores.minutes && (intento || f.minutes !== '')}
            />
            <Err>{(intento || f.minutes !== '') && errores.minutes}</Err>
          </div>
          <div>
            <label className="etiqueta" htmlFor="rn-rinde">
              Porciones que rinde
            </label>
            <Numero
              id="rn-rinde"
              valor={f.servings}
              onChange={set('servings')}
              decimales={0}
              largo={2}
              className="campo bg-superficie shadow-tarjeta"
              error={!!errores.servings && (intento || f.servings !== '')}
            />
            <Err>{(intento || f.servings !== '') && errores.servings}</Err>
          </div>
        </div>
        <div>
          <label className="etiqueta">Sirve para</label>
          <div className="flex flex-wrap gap-2">
            {COMIDAS.map((c) => (
              <button
                key={c}
                onClick={() => alternarComida(c)}
                className={`rounded-full px-4 h-9 text-[13px] font-semibold ${f.meal_types.includes(c) ? 'bg-verde text-white' : 'bg-superficie border border-linea'}`}
              >
                {NOMBRE_COMIDA[c]}
              </button>
            ))}
          </div>
          <Err>{intento && errores.meal_types}</Err>
        </div>
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={f.portable}
            onChange={(e) => set('portable')(e.target.checked)}
            className="w-5 h-5 accent-verde"
          />
          Se puede llevar en un tupper
        </label>

        <div className="flex items-center justify-between pt-2">
          <h2 className="font-semibold">Ingredientes {porciones > 1 ? `(para las ${porciones} porciones)` : ''}</h2>
          <button
            onClick={() => setBuscando(true)}
            disabled={ingredientes.length >= MAX_INGREDIENTES}
            className="btn-chico bg-verde-suave text-verde-texto"
          >
            <Icono n="add" size={16} /> Agregar
          </button>
        </div>
        <Err>{intento && errores.ingredientes}</Err>
        {ingredientes.length === 0 && (
          <p className="text-sm text-gris">Agregá los ingredientes con su cantidad y las calorías se calculan solas.</p>
        )}
        {ingredientes.map((i, n) => {
          const a = d.alimentosPorId.get(i.food_id)
          return (
            <div key={i.food_id} className="tarjeta p-3">
              <div className="flex items-center gap-2">
                <span className="flex-1 min-w-0 truncate text-sm font-medium">{a.name}</span>
                <Numero
                  valor={i.qty}
                  onChange={(v) => setIngredientes((l) => l.map((x, j) => (j === n ? { ...x, qty: v } : x)))}
                  decimales={a.unit === 'u' ? 2 : 0}
                  largo={5}
                  error={!!errIngrediente(i)}
                  className="campo h-10 w-20 text-center font-semibold"
                  aria-label={`Cantidad de ${a.name}`}
                />
                <span className="text-xs text-gris w-14">{unidadDe(a, Number(i.qty))}</span>
                <button
                  onClick={() => setIngredientes((l) => l.filter((_, j) => j !== n))}
                  className="w-7 h-7 text-gris"
                  aria-label="Quitar"
                >
                  <Icono n="close" size={18} />
                </button>
              </div>
              <Err>{errIngrediente(i)}</Err>
            </div>
          )
        })}
        {ingredientes.length > 0 && (
          <div className="rounded-2xl bg-verde-claro p-4">
            <p className="text-xs font-semibold text-gris mb-2">Por porción</p>
            <Macros m={porPorcion} />
          </div>
        )}

        <div>
          <label className="etiqueta">Pasos (uno por renglón)</label>
          <textarea
            className="campo bg-superficie shadow-tarjeta h-32 py-3"
            maxLength={LIM.pasos}
            value={f.steps}
            onChange={(e) => set('steps')(e.target.value)}
            placeholder={'Hervir el arroz.\nSaltear el pollo.'}
          />
          <Err>{errores.steps}</Err>
        </div>
        <button onClick={guardar} disabled={guardando} className="btn-primario w-full">
          {original ? 'Guardar cambios' : 'Guardar receta'}
        </button>
      </div>

      {buscando && (
        <Hoja titulo="Agregar ingrediente" onCerrar={() => setBuscando(false)}>
          <SelectorAlimento
            onElegir={(a) => {
              setBuscando(false)
              setIngredientes((l) => (l.some((x) => x.food_id === a.id) ? l : [...l, { food_id: a.id, qty: String(porcionSugerida(a)) }]))
            }}
          />
        </Hoja>
      )}
    </Marco>
  )
}
