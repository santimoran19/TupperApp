// Perfil, medidas y cuenta (descargar los datos, cerrar sesión, borrar la cuenta).
import { olvidarSesion, sesionGuardada } from '../../lib/supabase'
import { ok, supabase, traerTodo } from '../base'
import { reemplazar } from '../listas'

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
    const [p] = ok(
      await supabase
        .from('profiles')
        .upsert({ id: k.uid, ...datos }, { onConflict: 'id' })
        .select(),
    )
    k.setE((s) => ({ ...s, perfil: p }))
  }),

  // Cambia solo algunos datos del perfil (por ejemplo, el tamaño del termo)
  ajustarPerfil: k.accion('ajustarPerfil', async (cambios) => {
    const [p] = ok(await supabase.from('profiles').update(cambios).eq('id', k.uid).select())
    k.setE((s) => ({ ...s, perfil: p }))
  }),

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
    const [registros, plan, compras, eventos] = await Promise.all([
      traerTodo(() => supabase.from('log_entries').select('*').eq('user_id', uid).order('id')),
      traerTodo(() => supabase.from('plan').select('*').eq('user_id', uid).order('id')),
      traerTodo(() => supabase.from('purchases').select('*').eq('user_id', uid).order('id')),
      traerTodo(() =>
        supabase.from('eventos').select('created_at,tipo,nombre,detalle,version,ruta,dispositivo').eq('user_id', uid).order('id'),
      ),
    ])
    const v = k.ver()
    const { e } = v
    const nombreAlimento = (id) => v.alimentosPorId.get(id)?.name || null
    const nombreReceta = (id) => v.recetasPorId.get(id)?.name || null
    return {
      exportado: new Date().toISOString(),
      email: v.usuario.email,
      perfil: e.perfil,
      medidas: e.medidas,
      registros: registros.map(({ user_id: _u, ...r }) => r),
      plan: plan.map(({ user_id: _u, ...p }) => ({ ...p, receta: nombreReceta(p.recipe_id) })),
      comidas_fuera_de_casa: e.reglas.map((r) => ({ dia: r.weekday, comida: r.meal })),
      despensa: e.stock.map((s) => ({ alimento: nombreAlimento(s.food_id), cantidad: Number(s.qty) })),
      comida_lista: e.preparado.map((p) => ({ receta: nombreReceta(p.recipe_id), porciones: Number(p.portions) })),
      lista_de_compras: e.lista.map((l) => ({ alimento: nombreAlimento(l.food_id), cantidad: Number(l.qty) })),
      compras: compras.map((c) => ({ fecha: c.date, producto: c.name, cantidad: Number(c.qty), precio: Number(c.price) })),
      alimentos_propios: e.alimentos
        .filter((a) => a.owner)
        .map(({ same_as, ...resto }) => {
          const b = v.base({ ...resto, same_as })
          return { ...resto, cuenta_como: b.id === resto.id ? null : b.name }
        }),
      recetas_propias: e.recetas
        .filter((r) => r.owner)
        .map((r) => ({ ...r, ingredientes: v.itemsDe(r.id).map((i) => ({ alimento: nombreAlimento(i.food_id), cantidad: i.qty })) })),
      recetas_favoritas: [...v.favoritas].map(nombreReceta),
      recetas_ocultas: [...v.ocultas].map(nombreReceta),
      analisis_con_ia: e.analisis.map((a) => ({ semana: a.week_start, generado: a.created_at, ...a.content })),
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
