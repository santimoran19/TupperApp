// Recordatorios con la app cerrada (1.29, F-06). No la llama la app: la llama el reloj de la base (pg_cron) cada 15
// minutos, con la clave CRON_CLAVE en el encabezado x-cron-clave (ver LEEME.md). Para cada persona con los recordatorios
// prendidos y algún teléfono suscripto, mira qué hora es donde está, qué comidas ya anotó y manda los avisos que
// correspondan. Cada aviso se anota en recordatorios_enviados para no mandarlo dos veces.
// Desde la 1.32 (F-06b) también la llama el service worker del teléfono cuando se toca un botón de la notificación
// ("Más tarde", "Tomé un vaso"), sin sesión pero con la firma que va en el aviso (ver leerBoton en logica.ts).
// Necesita la actualización 22 de la base (y la 25 para los botones) y los secretos VAPID_PUBLICA, VAPID_PRIVADA,
// VAPID_SUJETO y CRON_CLAVE.
import { createClient } from 'npm:@supabase/supabase-js@2'
import { avisoPorId, avisosPara, botonesDe, claveCorrecta, firmar, horaLocal, leerBoton, limpiarConfig, POSPONER_MIN } from './logica.ts'
import { mandarPush, type Suscripcion } from './webpush.ts'

const responder = (estado: number, cuerpo: unknown, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(cuerpo), { status: estado, headers: { 'Content-Type': 'application/json', ...extra } })

// Los botones los manda el service worker desde la página de la app (CORS)
const PERMITIDOS = (Deno.env.get('ORIGENES_PERMITIDOS') || 'https://tupperapp.vercel.app').split(',').map((o) => o.trim().replace(/\/+$/, ''))
const cors = (origen: string | null): Record<string, string> =>
  origen && PERMITIDOS.includes(origen) ? { 'Access-Control-Allow-Origin': origen, Vary: 'Origin' } : { Vary: 'Origin' }

const conBase = () =>
  createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

Deno.serve(async (req) => {
  if (req.method !== 'POST') return responder(405, { codigo: 'metodo' })
  // Un botón de la notificación (sin la clave del reloj)
  if (!req.headers.get('x-cron-clave')) return await boton(req)
  if (!claveCorrecta(req.headers.get('x-cron-clave'), Deno.env.get('CRON_CLAVE'))) return responder(401, { codigo: 'clave' })
  const vapid = {
    publica: Deno.env.get('VAPID_PUBLICA') || '',
    privada: Deno.env.get('VAPID_PRIVADA') || '',
    sujeto: Deno.env.get('VAPID_SUJETO') || 'mailto:hola@tupper.app',
  }
  if (!vapid.publica || !vapid.privada) return responder(503, { codigo: 'sin_configurar' })
  const db = conBase()
  try {
    return responder(200, await recorrer(db, vapid))
  } catch (e) {
    console.error('recordatorios-push', e)
    return responder(500, { codigo: 'error' })
  }
})

// deno-lint-ignore no-explicit-any
async function recorrer(db: any, vapid: { publica: string; privada: string; sujeto: string }) {
  const ahora = new Date()
  const { data: suscripciones, error: e1 } = await db.from('push_suscripciones').select('id, user_id, endpoint, p256dh, auth')
  if (e1) throw e1
  const porUsuario = new Map<string, (Suscripcion & { id: string })[]>()
  for (const s of suscripciones || []) porUsuario.set(s.user_id, [...(porUsuario.get(s.user_id) || []), s])
  if (porUsuario.size === 0) return { usuarios: 0, enviados: 0 }

  const { data: filas, error: e2 } = await db
    .from('recordatorios')
    .select('user_id, config, zona, ayuno_inicio, ayuno_horas')
    .eq('activo', true)
    .in('user_id', [...porUsuario.keys()])
  if (e2) throw e2
  const ayer = new Date(ahora.getTime() - 36 * 3600000).toISOString().slice(0, 10)
  const { data: enviados } = await db.from('recordatorios_enviados').select('user_id, fecha, aviso').gte('fecha', ayer)
  const yaDe = (uid: string) =>
    new Set<string>(
      (enviados || []).filter((e: { user_id: string }) => e.user_id === uid).flatMap((e: { fecha: string; aviso: string }) => [`${e.fecha}|${e.aviso}`, e.aviso]),
    )

  let mandados = 0
  for (const fila of filas || []) {
    const config = limpiarConfig(fila.config)
    const { fecha, min } = horaLocal(ahora, fila.zona)
    const { data: registros } = await db.from('log_entries').select('meal').eq('user_id', fila.user_id).eq('date', fecha)
    const pesado = config.peso
      ? ((await db.from('measurements').select('date').eq('user_id', fila.user_id).eq('date', fecha)).data || []).length > 0
      : false
    const ayuno = fila.ayuno_inicio ? { inicio: Number(fila.ayuno_inicio), horas: Number(fila.ayuno_horas) } : null
    const avisos = avisosPara({
      config,
      min,
      fecha,
      registradas: new Set((registros || []).map((r: { meal: string }) => r.meal)),
      yaAvisados: yaDe(fila.user_id),
      ayuno,
      ahora: ahora.getTime(),
      pesadoHoy: pesado,
    })
    for (const aviso of avisos) {
      // Primero se anota: si otra corrida ya lo anotó (choca la clave), no se manda de nuevo
      const { data: nuevo } = await db
        .from('recordatorios_enviados')
        .upsert({ user_id: fila.user_id, fecha, aviso: aviso.id }, { onConflict: 'user_id,fecha,aviso', ignoreDuplicates: true })
        .select('aviso')
      if (!nuevo?.length) continue
      const datos = await conBotones(aviso, fila.user_id, fecha)
      for (const sus of porUsuario.get(fila.user_id) || []) {
        try {
          const r = await mandarPush(sus, datos, vapid, { ttl: 45 * 60, tema: aviso.id })
          if (r.ok) mandados++
          else if (r.vencida) await db.from('push_suscripciones').delete().eq('id', sus.id)
          else console.warn('push rechazado', r.estado)
        } catch (e) {
          console.warn('push falló', e)
        }
      }
    }
  }
  // Los que alguien pidió "Más tarde" y ya es la hora (sin la actualización 25 la tabla no existe: no pasa nada)
  const { data: pospuestos } = await db.from('recordatorios_pospuestos').select('*').lte('cuando', ahora.toISOString())
  for (const p of pospuestos || []) {
    await db.from('recordatorios_pospuestos').delete().eq('id', p.id)
    const fecha = horaLocal(ahora, (filas || []).find((x: { user_id: string }) => x.user_id === p.user_id)?.zona).fecha
    const datos = await conBotones({ id: p.aviso, titulo: p.titulo, texto: p.texto, ruta: p.ruta }, p.user_id, fecha)
    for (const sus of porUsuario.get(p.user_id) || []) {
      try {
        const r = await mandarPush(sus, datos, vapid, { ttl: 45 * 60, tema: p.aviso })
        if (r.ok) mandados++
        else if (r.vencida) await db.from('push_suscripciones').delete().eq('id', sus.id)
      } catch (e) {
        console.warn('push falló', e)
      }
    }
  }
  // Lo anotado de hace más de 3 días ya no hace falta
  const viejo = new Date(ahora.getTime() - 3 * 86400000).toISOString().slice(0, 10)
  await db.from('recordatorios_enviados').delete().lt('fecha', viejo)
  await db.from('recordatorios_acciones').delete().lt('fecha', viejo)
  return { usuarios: (filas || []).length, enviados: mandados }
}

// El aviso con sus botones y la firma para usarlos (sin CRON_CLAVE, sin botones)
async function conBotones(aviso: { id: string; titulo: string; texto: string; ruta: string }, usuario: string, fecha: string) {
  const botones = botonesDe(aviso.id)
  const clave = Deno.env.get('CRON_CLAVE')
  if (!botones.length || !clave) return { ...aviso, tag: aviso.id }
  return {
    ...aviso,
    tag: aviso.id,
    botones,
    firma: await firmar(clave, usuario, fecha, aviso.id),
    url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/recordatorios-push`,
  }
}

// Un botón tocado en la notificación: "posponer" lo vuelve a mandar en 15 minutos, "vaso" anota un vaso de agua.
// Cada botón de cada aviso se atiende una sola vez (recordatorios_acciones).
async function boton(req: Request): Promise<Response> {
  const extra = cors(req.headers.get('Origin'))
  const cuerpo = await req
    .text()
    .then((t) => JSON.parse(t))
    .catch(() => null)
  const b = await leerBoton(cuerpo, Deno.env.get('CRON_CLAVE'))
  if (!b) return responder(400, { codigo: 'boton' }, extra)
  const db = conBase()
  try {
    const { data: nueva, error } = await db
      .from('recordatorios_acciones')
      .upsert({ user_id: b.u, fecha: b.f, aviso: b.a, accion: b.accion }, { onConflict: 'user_id,fecha,aviso,accion', ignoreDuplicates: true })
      .select('aviso')
    if (error) throw error
    if (!nueva?.length) return responder(200, { ok: true, repetido: true }, extra)
    if (b.accion === 'vaso') {
      const { error: e } = await db.rpc('anotar_vaso', { p_usuario: b.u, p_fecha: b.f })
      if (e) throw e
      return responder(200, { ok: true, titulo: 'Vaso anotado', texto: '250 ml de agua. ¡Bien!' }, extra)
    }
    const aviso = avisoPorId(b.a)!
    const { error: e } = await db.from('recordatorios_pospuestos').insert({
      user_id: b.u,
      aviso: aviso.id,
      titulo: aviso.titulo,
      texto: aviso.texto,
      ruta: aviso.ruta,
      cuando: new Date(Date.now() + POSPONER_MIN * 60000).toISOString(),
    })
    if (e) throw e
    return responder(200, { ok: true }, extra)
  } catch (e) {
    console.error('recordatorios-push botón', e)
    return responder(500, { codigo: 'error' }, extra)
  }
}
