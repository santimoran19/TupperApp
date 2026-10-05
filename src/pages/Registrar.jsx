// Registrar una comida: alimentos sueltos con su cantidad, bebidas o porciones de una receta.
import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Marco from '../components/Marco'
import SelectorAlimento from '../components/SelectorAlimento'
import { Barra, Chip, Err, Hoja, Icono, Numero } from '../components/ui'
import { useDatos } from '../store/Datos'
import { fechaLarga, hoy, sumarDias } from '../lib/fechas'
import {
  COMIDAS, EXTRA, GRAMOS_CUCHARADITA, NOMBRE_COMIDA, grupoDe, macrosDe, medidasDe, porcionSugerida, redondear, seEndulza, sumar, textoMedida, unidadDe,
} from '../lib/nutricion'
import { LIM, errCantidad, errFecha, errNumero, maxPorComida, rangoDiario } from '../lib/validar'

const MOMENTOS = [...COMIDAS, EXTRA]
const BOTON = { desayuno: 'Agregar al desayuno', almuerzo: 'Agregar al almuerzo', merienda: 'Agregar a la merienda', cena: 'Agregar a la cena', extra: 'Agregar entre comidas' }
const TERMOS = [500, 750, 1000, 1200, 1500, 2000]
const MAX_CUCHARADITAS = 20

// Comida que corresponde según la hora, para proponerla por defecto
function comidaPorHora() {
  const h = new Date().getHours()
  if (h < 11) return 'desayuno'
  if (h < 16) return 'almuerzo'
  if (h < 20) return 'merienda'
  return 'cena'
}

// Cómo endulza cada infusión la persona: se recuerda en el teléfono para no preguntarlo cada vez
const CLAVE_DULCE = 'tupper:endulzado'
function leerDulce() {
  try { return JSON.parse(localStorage.getItem(CLAVE_DULCE)) || {} } catch { return {} }
}
function guardarDulce(mapa) {
  try { localStorage.setItem(CLAVE_DULCE, JSON.stringify(mapa)) } catch { /* sin almacenamiento: no pasa nada */ }
}

export default function Registrar() {
  const d = useDatos()
  const nav = useNavigate()
  const [params] = useSearchParams()
  // La fecha viene en la dirección: si no es una fecha válida dentro del rango, se usa hoy
  const fecha = params.get('fecha') && !errFecha(params.get('fecha'), rangoDiario()) ? params.get('fecha') : hoy()
  const [comida, setComida] = useState(MOMENTOS.includes(params.get('comida')) ? params.get('comida') : comidaPorHora())
  const [elegidos, setPlatos] = useState(() => {
    const r = params.get('receta')
    return r && d.recetasPorId.has(r) ? [{ recipe_id: r, porciones: '1' }] : []
  })
  // Si algo de lo elegido se borró desde otro dispositivo con esta pantalla abierta, se saca de la lista
  const sigue = (p) => (p.food_id ? d.alimentosPorId.has(p.food_id) : d.recetasPorId.has(p.recipe_id))
  const platos = elegidos.every(sigue) ? elegidos : elegidos.filter(sigue)
  if (platos !== elegidos) setPlatos(platos)
  const [buscando, setBuscando] = useState(params.get('abrir') === 'bebida' ? 'bebida' : null) // 'alimento' | 'bebida' | 'receta'
  const [descontar, setDescontar] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const termo = d.perfil.thermos_ml || 1000
  const azucar = useMemo(() => d.alimentos.find((a) => a.slug === 'azucar'), [d.alimentos])

  const enDespensa = useMemo(
    () => d.stock.filter((s) => Number(s.qty) > 0 && d.alimentosPorId.has(s.food_id)).map((s) => d.alimentosPorId.get(s.food_id)).sort((a, b) => a.name.localeCompare(b.name, 'es')),
    [d.stock, d.alimentosPorId],
  )
  const recetasComida = useMemo(
    () => [...d.recetas].sort((a, b) => Number(b.meal_types.includes(comida)) - Number(a.meal_types.includes(comida))
      || Number(d.favoritas.has(b.id)) - Number(d.favoritas.has(a.id)) || a.name.localeCompare(b.name, 'es')),
    [d.recetas, d.favoritas, comida],
  )

  // Lo que más se registra: primero lo de este mismo momento del día, después lo más repetido y lo más reciente
  const frecuentes = useMemo(() => {
    const grupos = new Map()
    for (const r of d.registros) {
      if (r.skipped || r.food_id === azucar?.id) continue
      const clave = r.food_id ? `a:${r.food_id}` : r.recipe_id ? `r:${r.recipe_id}` : null
      if (!clave) continue
      if (r.food_id ? !d.alimentosPorId.has(r.food_id) : !d.recetasPorId.has(r.recipe_id) || d.ocultas.has(r.recipe_id)) continue
      const g = grupos.get(clave) || { clave, food_id: r.food_id, recipe_id: r.recipe_id, veces: 0, enEsta: 0, ultima: '', qty: 0 }
      g.veces += 1
      if (r.meal === comida) g.enEsta += 1
      if (r.date >= g.ultima) { g.ultima = r.date; g.qty = Number(r.qty) }
      grupos.set(clave, g)
    }
    return [...grupos.values()].sort((a, b) => b.enEsta - a.enEsta || b.veces - a.veces || b.ultima.localeCompare(a.ultima)).slice(0, 8)
  }, [d.registros, d.alimentosPorId, d.recetasPorId, d.ocultas, comida, azucar])

  // Lo que se registró ayer en esta misma comida, para repetirlo de una
  const deAyer = useMemo(() => {
    const ayer = sumarDias(fecha, -1)
    return d.registros.filter((r) => r.date === ayer && r.meal === comida && !r.skipped
      && (r.food_id ? d.alimentosPorId.has(r.food_id) : r.recipe_id && d.recetasPorId.has(r.recipe_id)))
  }, [d.registros, d.alimentosPorId, d.recetasPorId, fecha, comida])

  const platoDeAlimento = (a, qty) => {
    const recordado = seEndulza(a) ? leerDulce()[a.id] : null
    return { food_id: a.id, qty: String(qty ?? porcionSugerida(a, termo)), dulce: recordado?.dulce || 'nada', cucharaditas: recordado?.cucharaditas || 1 }
  }
  const agregarAlimento = (a, qty) => {
    setPlatos((p) => (p.some((x) => x.food_id === a.id) ? p : [...p, platoDeAlimento(a, qty)]))
    setBuscando(null)
  }
  const agregarReceta = (r, porciones = 1) => {
    setPlatos((p) => (p.some((x) => x.recipe_id === r.id) ? p : [...p, { recipe_id: r.id, porciones: String(porciones) }]))
    setBuscando(null)
  }
  const agregarFrecuente = (g) => (g.food_id ? agregarAlimento(d.alimentosPorId.get(g.food_id), g.qty) : agregarReceta(d.recetasPorId.get(g.recipe_id), g.qty))
  const repetirAyer = () => {
    setPlatos((p) => {
      const nuevos = [...p]
      for (const r of deAyer) {
        if (r.food_id && !nuevos.some((x) => x.food_id === r.food_id)) nuevos.push({ ...platoDeAlimento(d.alimentosPorId.get(r.food_id), Number(r.qty)), dulce: 'nada' })
        if (r.recipe_id && !nuevos.some((x) => x.recipe_id === r.recipe_id)) nuevos.push({ recipe_id: r.recipe_id, porciones: String(Number(r.qty)) })
      }
      return nuevos
    })
  }
  const cambiar = (i, cambios) => setPlatos((p) => p.map((x, j) => (j === i ? { ...x, ...cambios } : x)))
  const quitar = (i) => setPlatos((p) => p.filter((_, j) => j !== i))

  const gramosAzucar = (p) => (p.food_id && p.dulce === 'azucar' && azucar ? p.cucharaditas * GRAMOS_CUCHARADITA : 0)
  const macrosPlato = (p) => {
    if (p.food_id) return sumar([macrosDe(d.alimentosPorId.get(p.food_id), Number(p.qty) || 0), gramosAzucar(p) ? macrosDe(azucar, gramosAzucar(p)) : {}])
    const m = d.macrosPorReceta.get(p.recipe_id)
    const n = Number(p.porciones) || 0
    return { kcal: m.kcal * n, protein: m.protein * n, carbs: m.carbs * n, fat: m.fat * n }
  }
  const total = sumar(platos.map(macrosPlato))
  const yaComido = sumar(d.registros.filter((r) => r.date === fecha))
  const errorDe = (p) => (p.food_id
    ? errCantidad(d.alimentosPorId.get(p.food_id), p.qty, maxPorComida(d.alimentosPorId.get(p.food_id)))
    : errNumero(p.porciones, LIM.porciones))
  const valido = platos.length > 0 && platos.every((p) => !errorDe(p))

  async function confirmar() {
    setGuardando(true)
    const lista = platos.map((p) => (p.food_id ? { food_id: p.food_id, qty: Number(p.qty) } : { recipe_id: p.recipe_id, porciones: Number(p.porciones) }))
    // El azúcar de las infusiones se anota como un alimento más, todo junto
    const totalAzucar = platos.reduce((t, p) => t + gramosAzucar(p), 0)
    if (totalAzucar > 0) {
      const ya = lista.find((x) => x.food_id === azucar.id)
      if (ya) ya.qty += totalAzucar
      else lista.push({ food_id: azucar.id, qty: totalAzucar })
    }
    const recordado = leerDulce()
    for (const p of platos) if (p.food_id && seEndulza(d.alimentosPorId.get(p.food_id))) recordado[p.food_id] = { dulce: p.dulce, cucharaditas: p.cucharaditas }
    guardarDulce(recordado)
    const listo = await d.registrar({ date: fecha, meal: comida, descontar, platos: lista })
    setGuardando(false)
    if (listo) { d.avisar(comida === EXTRA ? 'Registrado' : 'Comida registrada'); nav('/') }
  }

  const yaEsta = (g) => platos.some((x) => (g.food_id ? x.food_id === g.food_id : x.recipe_id === g.recipe_id))
  const chipsFrecuentes = frecuentes.filter((g) => !yaEsta(g))

  return (
    <Marco titulo="Registrar" atras sinNav>
      {fecha !== hoy() && <p className="text-sm text-gris mb-2">{fechaLarga(fecha)}</p>}
      <div className="flex gap-2 overflow-x-auto sin-scroll -mx-4 px-4 mb-4">
        {MOMENTOS.map((c) => <Chip key={c} activo={c === comida} onClick={() => setComida(c)}>{NOMBRE_COMIDA[c]}</Chip>)}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <button onClick={() => setBuscando('alimento')} className="tarjeta p-3 text-left">
          <div className="w-10 h-10 rounded-full bg-verde-claro text-verde-texto flex items-center justify-center mb-2"><Icono n="search" /></div>
          <p className="font-semibold">Alimento</p>
          <p className="text-xs text-gris">Buscá o creá uno</p>
        </button>
        <button onClick={() => setBuscando('bebida')} className="tarjeta p-3 text-left">
          <div className="w-10 h-10 rounded-full bg-teal-suave text-teal-oscuro flex items-center justify-center mb-2"><Icono n="local_bar" /></div>
          <p className="font-semibold">Bebida</p>
          <p className="text-xs text-gris">Agua, mate, café, alcohol</p>
        </button>
        <button onClick={() => setBuscando('receta')} className="tarjeta p-3 text-left">
          <div className="w-10 h-10 rounded-full bg-verde-claro text-verde-texto flex items-center justify-center mb-2"><Icono n="menu_book" /></div>
          <p className="font-semibold">Receta</p>
          <p className="text-xs text-gris">Una porción armada</p>
        </button>
      </div>

      {platos.length === 0 && deAyer.length > 0 && (
        <button onClick={repetirAyer} className="w-full tarjeta p-3 mb-4 flex items-center gap-3 text-left">
          <span className="w-10 h-10 rounded-full bg-naranja-suave text-naranja-oscuro flex items-center justify-center"><Icono n="replay" /></span>
          <span className="flex-1 min-w-0">
            <span className="block font-semibold">Repetir lo de ayer</span>
            <span className="block text-xs text-gris truncate">{deAyer.map((r) => r.name).join(', ')}</span>
          </span>
        </button>
      )}

      {chipsFrecuentes.length > 0 && (
        <>
          <p className="text-sm font-semibold mb-2 flex items-center gap-1.5"><Icono n="history" size={18} className="text-verde-texto" /> Lo que más registrás</p>
          <div className="flex gap-2 overflow-x-auto sin-scroll -mx-4 px-4 mb-4">
            {chipsFrecuentes.map((g) => {
              const nombre = (g.food_id ? d.alimentosPorId.get(g.food_id) : d.recetasPorId.get(g.recipe_id)).name
              return (
                <button key={g.clave} onClick={() => agregarFrecuente(g)} className="shrink-0 max-w-[220px] rounded-full bg-superficie shadow-tarjeta border border-verde-suave/60 pl-4 pr-2 h-10 flex items-center gap-2 text-sm font-medium">
                  <span className="truncate">{nombre.split(' (')[0]}</span> <span className="w-6 h-6 shrink-0 rounded-full bg-verde-suave text-verde-texto flex items-center justify-center"><Icono n="add" size={16} /></span>
                </button>
              )
            })}
          </div>
        </>
      )}

      {enDespensa.length > 0 && (
        <>
          <p className="text-sm font-semibold mb-2 flex items-center gap-1.5"><Icono n="kitchen" size={18} className="text-verde-texto" /> Desde tu despensa</p>
          <div className="flex gap-2 overflow-x-auto sin-scroll -mx-4 px-4 mb-5">
            {enDespensa.map((a) => (
              <button key={a.id} onClick={() => agregarAlimento(a)} className="shrink-0 rounded-full bg-superficie shadow-tarjeta border border-verde-suave/60 pl-4 pr-2 h-10 flex items-center gap-2 text-sm font-medium">
                {a.name.split(' (')[0]} <span className="w-6 h-6 rounded-full bg-verde-suave text-verde-texto flex items-center justify-center"><Icono n="add" size={16} /></span>
              </button>
            ))}
          </div>
        </>
      )}

      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Tu plato</h2>
        <span className="pill bg-campo text-gris">{platos.length} {platos.length === 1 ? 'cosa' : 'cosas'}</span>
      </div>

      {platos.length === 0 && (
        <div className="tarjeta border-dashed border-linea shadow-none p-5 text-center text-sm text-gris">Agregá lo que comiste o tomaste: un alimento, una bebida, varios o una receta.</div>
      )}

      <div className="space-y-3">
        {platos.map((p, i) => {
          const a = p.food_id && d.alimentosPorId.get(p.food_id)
          const r = p.recipe_id && d.recetasPorId.get(p.recipe_id)
          const m = macrosPlato(p)
          const error = errorDe(p)
          const medidas = a ? medidasDe(a, termo) : []
          return (
            <div key={p.food_id || p.recipe_id} className="tarjeta p-4">
              <div className="flex items-start gap-2">
                <p className="flex-1 font-medium">{a ? a.name : r.name}</p>
                <span className="font-bold text-verde-texto whitespace-nowrap">{redondear(m.kcal)} kcal</span>
                <button onClick={() => quitar(i)} className="w-7 h-7 -mr-1 text-gris" aria-label="Quitar"><Icono n="close" size={20} /></button>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Numero valor={a ? p.qty : p.porciones} onChange={(v) => cambiar(i, a ? { qty: v } : { porciones: v })} decimales={a && a.unit !== 'u' ? 0 : 2} largo={5}
                  error={!!error} className="campo h-10 w-24 text-center font-semibold" aria-label="Cantidad" />
                <span className="text-sm text-gris">{a ? unidadDe(a, Number(p.qty)) : Number(p.porciones) === 1 ? 'porción' : 'porciones'}</span>
                <span className="ml-auto pill bg-coral-suave text-coral-oscuro">{redondear(m.protein)} g prot.</span>
              </div>
              <Err>{error}</Err>

              {medidas.length > 0 && (
                <div className="flex gap-1.5 overflow-x-auto sin-scroll mt-2.5">
                  {medidas.map(([nombre, cantidad]) => (
                    <button key={nombre} onClick={() => cambiar(i, { qty: String(cantidad) })}
                      className={`shrink-0 rounded-full px-3 h-8 text-xs font-semibold ${Number(p.qty) === cantidad ? 'bg-teal-fuerte text-white' : 'bg-teal-suave text-teal-oscuro'}`}>
                      {nombre} · {textoMedida(a, cantidad)}
                    </button>
                  ))}
                </div>
              )}
              {a && grupoDe(a) === 'mate' && (
                <label className="flex items-center gap-2 mt-2.5 text-xs text-gris">
                  Tu termo es de
                  <select className="rounded-lg bg-campo px-2 h-8 text-sm text-tinta font-semibold" value={termo} aria-label="Tamaño del termo"
                    onChange={(e) => d.ajustarPerfil({ thermos_ml: Number(e.target.value) })}>
                    {TERMOS.map((t) => <option key={t} value={t}>{t >= 1000 ? `${String(t / 1000).replace('.', ',')} L` : `${t} ml`}</option>)}
                  </select>
                </label>
              )}

              {a && seEndulza(a) && azucar && (
                <div className="mt-3 pt-3 border-t border-linea">
                  <p className="text-xs font-semibold text-gris mb-1.5">Endulzado con</p>
                  <div className="flex gap-1.5">
                    {[['nada', 'Nada'], ['azucar', 'Azúcar'], ['edulcorante', 'Edulcorante']].map(([k, t]) => (
                      <button key={k} onClick={() => cambiar(i, { dulce: k })}
                        className={`rounded-full px-3 h-8 text-xs font-semibold ${p.dulce === k ? 'bg-verde text-white' : 'bg-campo text-tinta'}`}>{t}</button>
                    ))}
                  </div>
                  {p.dulce === 'azucar' && (
                    <div className="flex items-center gap-2 mt-2.5">
                      <div className="flex items-center rounded-full bg-campo">
                        <button onClick={() => cambiar(i, { cucharaditas: Math.max(0.5, p.cucharaditas - 0.5) })} disabled={p.cucharaditas <= 0.5} className="w-9 h-9 flex items-center justify-center disabled:opacity-30" aria-label="Menos azúcar"><Icono n="remove" size={18} /></button>
                        <span className="min-w-[30px] text-center text-sm font-semibold">{String(p.cucharaditas).replace('.', ',')}</span>
                        <button onClick={() => cambiar(i, { cucharaditas: Math.min(MAX_CUCHARADITAS, p.cucharaditas + 0.5) })} disabled={p.cucharaditas >= MAX_CUCHARADITAS} className="w-9 h-9 flex items-center justify-center disabled:opacity-30" aria-label="Más azúcar"><Icono n="add" size={18} /></button>
                      </div>
                      <span className="text-sm text-gris">{p.cucharaditas === 1 ? 'cucharadita' : 'cucharaditas'} en total · {redondear(macrosDe(azucar, gramosAzucar(p)).kcal)} kcal</span>
                    </div>
                  )}
                  {p.dulce === 'edulcorante' && <p className="text-xs text-gris mt-2">El edulcorante no suma calorías.</p>}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {platos.length > 0 && (
        <section className="tarjeta rounded-3xl p-5 mt-4">
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-xs font-bold tracking-wider text-gris">TOTAL</p>
              <p className="text-3xl font-bold text-verde-texto leading-none mt-1">{redondear(total.kcal)} <span className="text-sm">kcal</span></p>
            </div>
            <p className="text-sm text-gris text-right">Con esto llevás<br /><b className="text-tinta">{redondear(yaComido.kcal + total.kcal)} de {d.perfil.kcal_target} kcal</b></p>
          </div>
          <div className="space-y-3">
            <Barra nombre="Proteína del día" valor={yaComido.protein + total.protein} total={d.perfil.protein_target} color="bg-coral" />
          </div>
          <label className="flex items-center gap-3 mt-4 text-sm">
            <input type="checkbox" checked={descontar} onChange={(e) => setDescontar(e.target.checked)} className="w-5 h-5 accent-verde" />
            Descontar de mi despensa lo que usé
          </label>
        </section>
      )}

      <button onClick={confirmar} disabled={!valido || guardando} className="btn-primario w-full h-14 text-base mt-5">
        <Icono n="check_circle" /> {BOTON[comida]}
      </button>

      {buscando === 'alimento' && (
        <Hoja titulo="Agregar alimento" onCerrar={() => setBuscando(null)}>
          <SelectorAlimento onElegir={(a) => agregarAlimento(a)} />
        </Hoja>
      )}
      {buscando === 'bebida' && (
        <Hoja titulo="Agregar bebida" onCerrar={() => setBuscando(null)}>
          <SelectorAlimento onElegir={(a) => agregarAlimento(a)} categoria="Bebidas" />
        </Hoja>
      )}
      {buscando === 'receta' && (
        <Hoja titulo="Elegir receta" onCerrar={() => setBuscando(null)}>
          <div className="divide-y divide-linea">
            {recetasComida.map((r) => {
              const m = d.macrosPorReceta.get(r.id)
              const listas = d.preparadoMap.get(r.id) || 0
              return (
                <button key={r.id} onClick={() => agregarReceta(r)} className="w-full flex items-center gap-3 py-3 text-left">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{d.favoritas.has(r.id) && <Icono n="favorite" lleno size={14} className="text-coral-oscuro mr-1 align-[-2px]" />}{r.name}</p>
                    <p className="text-xs text-gris">
                      {redondear(m.kcal)} kcal y {redondear(m.protein)} g prot. por porción
                      {listas > 0 && <span className="text-verde-texto font-semibold"> · {redondear(listas, 1)} ya cocinadas</span>}
                    </p>
                  </div>
                  <Icono n="add_circle" className="text-verde-texto" />
                </button>
              )
            })}
          </div>
        </Hoja>
      )}
    </Marco>
  )
}
