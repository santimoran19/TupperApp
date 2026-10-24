// Perfil, medidas y cuenta (descargar los datos, cerrar sesión, borrar la cuenta).
import { olvidarSesion, sesionGuardada } from '../../lib/supabase'
import { ok, supabase, traerTodo } from '../base'
import { traerEjercicio } from '../carga'
import { reemplazar } from '../listas'
import { borrarFotos, rutasDe } from '../../lib/fotos'

// Cuánto se espera a que Supabase cierre la sesión antes de cerrarla a mano en el teléfono
const ESPERA_SALIR_MS = 4000

// Cierra la sesión. Sin conexión y con el permiso vencido, Supabase no puede: tarda hasta medio minuto en darse por
// vencido y la deja como estaba. No se lo espera tanto: se saca a mano del teléfono y se recarga, para que la persona
// no quede adentro con la copia ya borrada.
async function cerrarSesion() {
  await Promise.race([supabase.auth.signOut().catch(() => {}), new Promise((listo) => setTimeout(listo, ESPERA_SALIR_MS))])
  if (sesionGuardada()) {
    olvidarSesion()
    location.replace('/')
  }
}

export const accionesDePerfil = (k) => ({
  guardarPerfil: k.accion('guardarPerfil', async (datos) => {
    const subir = (d) =>
      supabase
        .from('profiles')
        .upsert({ id: k.uid, ...d }, { onConflict: 'id' })
        .select()
    let respuesta = await subir(datos)
    // Con una base sin la actualización 21 no existe la columna del consentimiento: se guarda el resto igual
    if (respuesta.error?.code === 'PGRST204' && 'salud_consentida_at' in datos) {
      const { salud_consentida_at: _sinColumna, ...resto } = datos
      respuesta = await subir(resto)
    }
    const [p] = ok(respuesta)
    k.setE((s) => ({ ...s, perfil: p }))
  }),

  // Quien ya tenía cuenta acepta el uso de sus datos de salud (1.28, L-04)
  aceptarSalud: k.accion('aceptarSalud', async () => {
    const [p] = ok(await supabase.from('profiles').update({ salud_consentida_at: new Date().toISOString() }).eq('id', k.uid).select())
    k.setE((s) => ({ ...s, perfil: p }))
  }),

  // Cambia solo algunos datos del perfil (por ejemplo, el tamaño del termo)
  ajustarPerfil: k.accion('ajustarPerfil', async (cambios) => {
    const [p] = ok(await supabase.from('profiles').update(cambios).eq('id', k.uid).select())
    k.setE((s) => ({ ...s, perfil: p }))
  }),

  // ¿Está libre este nombre de usuario? true / false, o null si no se pudo preguntar (sin conexión, o falta aplicar
  // supabase/actualizacion-12.sql): ahí la base lo vuelve a revisar al guardar. No pasa por `accion` para no mostrar avisos
  // mientras la persona todavía está escribiendo.
  usuarioDisponible: async (usuario) => {
    try {
      const { data, error } = await supabase.rpc('usuario_disponible', { p_usuario: usuario })
      return error ? null : !!data
    } catch {
      return null
    }
  },

  guardarMedida: k.accion('guardarMedida', async ({ date, weight_kg, waist_cm }) => {
    const fila = { user_id: k.uid, date, weight_kg: weight_kg || null, waist_cm: waist_cm || null }
    const [g] = ok(await supabase.from('measurements').upsert(fila, { onConflict: 'user_id,date' }).select())
    k.setE((s) => ({ ...s, medidas: reemplazar(s.medidas, g, (x) => x.date === date) }))
  }),

  borrarMedida: k.accion('borrarMedida', async (date) => {
    ok(await supabase.from('measurements').delete().eq('user_id', k.uid).eq('date', date))
    k.setE((s) => ({ ...s, medidas: s.medidas.filter((x) => x.date !== date) }))
  }),

  // Todo lo del usuario en un solo objeto, para descargarlo.
  exportar: k.accion('exportar', async () => {
    const uid = k.uid
    // Las compras son del hogar si la persona está en uno; las de antes de entrar siguen siendo suyas
    const duenos = [...new Set([uid, k.ver().e.hogar?.id].filter(Boolean))]
    const [registros, plan, compras, eventos, opiniones] = await Promise.all([
      traerTodo(() => supabase.from('log_entries').select('*').eq('user_id', uid).order('id')),
      traerTodo(() => supabase.from('plan').select('*').eq('user_id', uid).order('id')),
      traerTodo(() => supabase.from('purchases').select('*').in('user_id', duenos).order('id')),
      traerTodo(() =>
        supabase.from('eventos').select('created_at,tipo,nombre,detalle,version,ruta,dispositivo').eq('user_id', uid).order('id'),
      ),
      // Con una base sin la actualización 21 la tabla no existe
      supabase
        .from('opiniones')
        .select('created_at,tipo,texto')
        .eq('user_id', uid)
        .order('created_at')
        .then((r) => r.data || []),
    ])
    const v = k.ver()
    const { e } = v
    // Con el cálculo de gasto prendido, todo el historial de ejercicio (no solo el último año que se muestra en la app)
    const ejercicio = e.perfil?.gasto_activo ? await traerEjercicio(uid, { dias: null }) : null
    const nombreAlimento = (id) => v.alimentosPorId.get(id)?.name || null
    const nombreReceta = (id) => v.recetasPorId.get(id)?.name || null
    return {
      exportado: new Date().toISOString(),
      email: v.usuario.email,
      perfil: e.perfil,
      medidas: e.medidas,
      registros: registros.map(({ user_id: _u, ...r }) => r),
      plan: plan.map(({ user_id: _u, ...p }) => ({ ...p, receta: nombreReceta(p.recipe_id), alimento: nombreAlimento(p.food_id) })),
      comidas_fuera_de_casa: e.reglas.map((r) => ({ dia: r.weekday, comida: r.meal })),
      despensa: e.stock.map((s) => ({ alimento: nombreAlimento(s.food_id), cantidad: Number(s.qty) })),
      comida_lista: e.preparado.map((p) => ({ receta: nombreReceta(p.recipe_id), porciones: Number(p.portions) })),
      lista_de_compras: e.lista.map((l) => ({ alimento: nombreAlimento(l.food_id), cantidad: Number(l.qty) })),
      compras: compras.map((c) => ({ fecha: c.date, producto: c.name, cantidad: Number(c.qty), precio: Number(c.price) })),
      alimentos_propios: e.alimentos
        .filter((a) => a.owner === k.uid)
        .map(({ same_as, ...resto }) => {
          const b = v.base({ ...resto, same_as })
          return { ...resto, cuenta_como: b.id === resto.id ? null : b.name }
        }),
      recetas_propias: e.recetas
        .filter((r) => r.owner === k.uid)
        .map((r) => ({ ...r, ingredientes: v.itemsDe(r.id).map((i) => ({ alimento: nombreAlimento(i.food_id), cantidad: i.qty })) })),
      recetas_favoritas: [...v.favoritas].map(nombreReceta),
      recetas_ocultas: [...v.ocultas].map(nombreReceta),
      ejercicio: ejercicio && {
        actividades_propias: ejercicio.actividades.filter((a) => a.owner === uid).map(({ owner: _o, id: _i, slug: _s, ...a }) => a),
        entrenamientos: ejercicio.entrenamientos.map(({ user_id: _u, type_id, routine_id, ...w }) => ({
          ...w,
          actividad: ejercicio.actividades.find((a) => a.id === type_id)?.name || null,
          rutina: ejercicio.rutinas.find((r) => r.id === routine_id)?.name || null,
        })),
        series: ejercicio.series.map(({ user_id: _u, id: _i, exercise_id, ...s }) => ({
          ...s,
          ejercicio: ejercicio.ejerciciosGym.find((g) => g.id === exercise_id)?.name || null,
        })),
        rutinas: ejercicio.rutinas.map((r) => ({
          nombre: r.name,
          notas: r.notes,
          ejercicios: ejercicio.rutinaItems
            .filter((i) => i.routine_id === r.id)
            .map((i) => ({
              ejercicio: ejercicio.ejerciciosGym.find((g) => g.id === i.exercise_id)?.name || null,
              series: i.sets_target,
              repeticiones_desde: i.reps_min,
              repeticiones_hasta: i.reps_max,
              descanso_segundos: i.rest_seconds,
            })),
        })),
        ejercicios_propios: ejercicio.ejerciciosGym.filter((g) => g.owner === uid).map(({ owner: _o, id: _i, slug: _s, ...g }) => g),
      },
      analisis_con_ia: e.analisis.map((a) => ({ semana: a.week_start, generado: a.created_at, ...a.content })),
      combos: (e.combos || []).map((c) => ({
        nombre: c.name,
        items: (c.items || []).map((p) =>
          p.food_id
            ? { alimento: nombreAlimento(p.food_id), cantidad: p.qty }
            : { receta: nombreReceta(p.recipe_id), porciones: p.porciones },
        ),
      })),
      opiniones: opiniones.map((o) => ({ fecha: o.created_at, tipo: o.tipo, texto: o.texto })),
      registro_tecnico: eventos.map((ev) => ({
        fecha: ev.created_at,
        tipo: ev.tipo,
        que: ev.nombre,
        detalle: ev.detalle,
        version: ev.version,
        pantalla: ev.ruta,
        dispositivo: ev.dispositivo,
      })),
    }
  }),

  // Borra la cuenta y, en cascada, todos los datos. No tiene vuelta atrás.
  borrarCuenta: k.accion(
    'borrarCuenta',
    async () => {
      // Primero las fotos que subió (están en Storage, fuera de la base): si no se pueden borrar, no se borra la cuenta
      try {
        await borrarFotos(await rutasDe(k.uid), k.uid)
      } catch (err) {
        throw Object.assign(new Error('No se pudieron borrar tus fotos. Revisá la conexión y probá de nuevo.'), { causa: err })
      }
      ok(await supabase.rpc('borrar_mi_cuenta'))
      await k.vaciar()
      await cerrarSesion()
    },
    { unica: true },
  ),

  // Cerrar sesión: se borra del teléfono la copia de los datos. Si quedaban cambios hechos sin conexión, se pierden:
  // por eso antes se pregunta (salvo con `preguntar: false`). Devuelve false si la persona se arrepintió.
  salir: async ({ preguntar = true } = {}) => {
    const n = preguntar ? await k.pendientes() : 0
    if (n > 0) {
      const seguir = await k.confirmar({
        titulo: n === 1 ? 'Hay un cambio sin enviar' : `Hay ${n} cambios sin enviar`,
        texto: 'Los hiciste sin conexión y todavía no se guardaron. Si cerrás sesión ahora, se pierden.',
        boton: 'Cerrar sesión',
        cancelar: 'Volver',
      })
      if (!seguir) return false
    }
    await k.vaciar()
    await cerrarSesion()
    return true
  },
})
