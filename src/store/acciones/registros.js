// Registros: lo que se comió cada día, el "no comí" y el análisis de la semana con IA.
import { pasaDeCalorias } from '../../lib/ajuste'
import { anotarEvento } from '../../lib/eventos'
import { hoy } from '../../lib/fechas'
import { objetivosDeLaSemana } from '../../lib/gastodia'
import { macrosDe, redondear } from '../../lib/nutricion'
import { supabase } from '../base'
import { invalido, nuevaClave } from '../listas'
import { gastoDeReceta } from './despensa'

export const accionesDeRegistros = (k) => ({
  // Registra lo que se comió. `platos` mezcla alimentos sueltos y recetas:
  //   { food_id, qty }  o  { recipe_id, porciones }
  // Va todo en un solo pedido: saca la marca de "no comí" si estaba, guarda lo que se comió y descuenta de la despensa
  // (solo de lo que hay) y de la comida lista. Si se corta en el medio, no queda nada a medias.
  registrar: k.accion(
    'registrar',
    ({ date, meal, platos, descontar = true }) => {
      if (platos.some((p) => !(Number(p.food_id ? p.qty : p.porciones) > 0))) throw invalido('Hay una cantidad que no es válida.')
      const v = k.ver()
      const filas = []
      const cambios = new Map()
      const usadas = new Map() // receta -> porciones de comida lista que se usan
      for (const p of platos) {
        // Lo que descuenta este plato: la diferencia que deja en `cambios` y en `usadas`. Se anota en la fila, así después
        // se puede devolver a la despensa lo mismo que salió (ver ajuste.js).
        const antes = new Map(cambios)
        const usadasAntes = new Map(usadas)
        let fila
        if (p.food_id) {
          const a = v.alimentosPorId.get(p.food_id)
          const m = macrosDe(a, p.qty)
          fila = { name: a.name, food_id: a.id, qty: p.qty, ...m }
          cambios.set(a.id, (cambios.get(a.id) || 0) - p.qty)
        } else {
          const r = v.recetasPorId.get(p.recipe_id)
          const m = v.macrosPorReceta.get(r.id)
          fila = {
            name: r.name,
            recipe_id: r.id,
            qty: p.porciones,
            kcal: m.kcal * p.porciones,
            protein: m.protein * p.porciones,
            carbs: m.carbs * p.porciones,
            fat: m.fat * p.porciones,
          }
          // Primero se usan las porciones ya cocinadas; lo que no alcanza sale de los ingredientes.
          const listas = (v.preparadoMap.get(r.id) || 0) - (usadas.get(r.id) || 0)
          const usa = Math.min(listas, p.porciones)
          if (usa > 0) usadas.set(r.id, (usadas.get(r.id) || 0) + usa)
          const resto = p.porciones - Math.max(0, usa)
          if (resto > 0) gastoDeReceta(v, cambios, r, resto)
        }
        if (descontar) {
          fila.s = [...cambios].map(([f, c]) => ({ f, q: redondear((antes.get(f) || 0) - c, 2) })).filter((x) => x.q > 0)
          fila.p = fila.recipe_id ? redondear((usadas.get(fila.recipe_id) || 0) - (usadasAntes.get(fila.recipe_id) || 0), 1) : 0
        } else {
          // Sin descontar: este plato no cuenta para lo que queda en la despensa
          fila.s = []
          fila.p = 0
          cambios.clear()
          for (const [k, c] of antes) cambios.set(k, c)
          usadas.clear()
          for (const [k, c] of usadasAntes) usadas.set(k, c)
        }
        filas.push(fila)
      }
      // El descuento viaja en cada fila (`s` y `p`): la base descuenta fila por fila, solo de lo que hay, y anota lo que sacó
      return k.operar('registrar', {
        fecha: date,
        comida: meal,
        filas,
        stock: [],
        preparado: [],
        clave: nuevaClave(),
        // Para mostrarlo sin conexión: los identificadores de las filas y la hora
        ids: filas.map(() => nuevaClave()),
        cuando: new Date().toISOString(),
      })
    },
    { enCola: true },
  ),

  // "No comí": deja la comida como resuelta sin sumar nada.
  saltear: k.accion(
    'saltear',
    (date, meal) =>
      k.operar('saltear', {
        fila: {
          id: nuevaClave(),
          user_id: k.uid,
          date,
          meal,
          name: 'No comí',
          qty: 0,
          kcal: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          skipped: true,
        },
        cuando: new Date().toISOString(),
      }),
    { unica: true, enCola: true },
  ),

  // Borra el registro y devuelve a la despensa lo que había descontado.
  borrarRegistro: k.accion(
    'borrarRegistro',
    (id) => {
      // Lo que se registró sin conexión todavía no existe en la base: no hay qué borrar hasta que se mande
      const fila = k.ver().e.registros.find((x) => x.id === id)
      if (fila?.pendiente && !fila.skipped) throw invalido('Todavía no se terminó de guardar. Probá de nuevo cuando vuelva la conexión.')
      return k.operar('borrarRegistro', { id })
    },
    { enCola: true },
  ),

  // Cambia la cantidad de un registro: recalcula calorías y macros y ajusta la despensa por la diferencia (ver ajuste.js).
  editarRegistro: k.accion(
    'editarRegistro',
    (id, qty) => {
      const fila = k.ver().e.registros.find((x) => x.id === id)
      if (!fila) throw invalido('Ese registro ya no existe.')
      if (fila.skipped || !(Number(fila.qty) > 0)) throw invalido('Ese registro no se puede editar.')
      if (fila.pendiente) throw invalido('Todavía no se terminó de guardar. Probá de nuevo cuando vuelva la conexión.')
      const n = redondear(qty, 2)
      if (!(n > 0 && n <= 1000000)) throw invalido('La cantidad no es válida.')
      if (pasaDeCalorias(fila, n)) throw invalido('Esa cantidad tiene demasiadas calorías.')
      return k.operar('editarRegistro', { id, qty: n })
    },
    { enCola: true },
  ),

  // Pide la devolución de la semana a la función de Supabase que consulta a la IA.
  // No usa `accion` porque el error se muestra en la misma tarjeta: devuelve { analisis } o { error }.
  analizarSemana: async (lunes) => {
    try {
      // Se le cuenta el objetivo de cada día (con el modo dinámico cambia según lo entrenado). Una versión vieja de la función lo ignora.
      const { perfil, medidas, entrenamientos } = k.ver().e
      const objetivos = objetivosDeLaSemana(perfil, medidas, entrenamientos, lunes, hoy())
      const { data, error } = await supabase.functions.invoke('analizar-semana', { body: { semana: lunes, hoy: hoy(), objetivos } })
      if (error) {
        // Cuando la función responde con un error, el detalle viene en el cuerpo de la respuesta
        const detalle = await error.context?.json?.().catch(() => null)
        anotarEvento('ia_analisis', { resultado: 'error', codigo: detalle?.codigo || String(error.context?.status || 'red') })
        if (detalle?.mensaje) return { error: detalle.mensaje, codigo: detalle.codigo }
        return {
          error:
            error.context?.status === 404
              ? 'El análisis con IA todavía no está disponible.'
              : 'No se pudo pedir el análisis. Revisá la conexión y probá de nuevo.',
        }
      }
      if (!data?.analisis) return { error: 'No se pudo generar el análisis. Probá de nuevo.' }
      k.tocar()
      k.setE((s) => ({ ...s, analisis: [...s.analisis.filter((a) => a.id !== data.analisis.id), data.analisis] }))
      anotarEvento('ia_analisis', { resultado: 'ok', modelo: data.analisis.model || '' })
      return { analisis: data.analisis, restantes: data.restantes }
    } catch {
      return { error: 'No se pudo pedir el análisis. Revisá la conexión y probá de nuevo.' }
    }
  },
})
