// El service worker de la app (1.29: propio, antes lo armaba vite-plugin-pwa solo). Hace lo mismo que el anterior —guarda
// la app para abrir rápido y sin conexión, y three.js, el cuerpo 3D y las fotos la primera vez que se usan— y además:
//   - muestra las notificaciones push de los recordatorios con la app cerrada (F-06, supabase/functions/recordatorios-push),
//     con botones desde la 1.32 (F-06b): "Más tarde" y, en el del agua, "Tomé un vaso" (se atienden sin abrir la app)
//   - cuando vuelve la conexión, despierta a la app para que mande los cambios que quedaron sin mandar (T-07) y, si la
//     app está cerrada del todo, los manda él (1.32, T-07b; ver mandarColaSinApp)
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { CacheFirst } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { PostgrestClient } from '@supabase/postgrest-js'
import { crearEnvios, SIN_CLAVE } from './store/envios-base'
import { CLAVE_SESION_SW, cambiarLocal, leerLocal } from './store/local'
import { nombreDelCandado } from './store/sincro/candado'

// La versión nueva espera a que la persona toque "Actualizar" (components/AvisoVersion.jsx)
self.addEventListener('message', (ev) => {
  if (ev.data?.type === 'SKIP_WAITING') self.skipWaiting()
})

precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()
registerRoute(new NavigationRoute(createHandlerBoundToURL('/index.html')))

// three.js se guarda la primera vez que se usa (pesa ~190 KB comprimido y se puede apagar)
registerRoute(
  ({ url }) => url.pathname.startsWith('/assets/tres-'),
  new CacheFirst({ cacheName: 'tres', plugins: [new ExpirationPlugin({ maxEntries: 4 })] }),
)
// La malla del cuerpo en 3D (~800 KB, MakeHuman CC0)
registerRoute(
  ({ url }) => url.pathname.startsWith('/modelos/'),
  new CacheFirst({
    cacheName: 'modelos',
    plugins: [new ExpirationPlugin({ maxEntries: 4 }), new CacheableResponsePlugin({ statuses: [200] })],
  }),
)
// Las fotos de alimentos y recetas (Supabase Storage): una vez vistas, se ven sin conexión
registerRoute(
  ({ url }) => url.pathname.includes('/storage/v1/object/public/fotos/'),
  new CacheFirst({
    cacheName: 'fotos',
    plugins: [
      new ExpirationPlugin({ maxEntries: 800, maxAgeSeconds: 60 * 60 * 24 * 60 }),
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  }),
)

// ---------- Recordatorios con la app cerrada ----------
const aLaVista = async () =>
  (await self.clients.matchAll({ type: 'window', includeUncontrolled: true })).some((c) => c.visibilityState === 'visible')

self.addEventListener('push', (ev) => {
  let datos = {}
  try {
    datos = ev.data?.json() || {}
  } catch {
    datos = { titulo: ev.data?.text() }
  }
  ev.waitUntil(
    (async () => {
      // Con la app a la vista, el aviso ya lo muestra ella adentro (lib/useRecordatorios.js): no se repite
      if (await aLaVista()) return
      const botones = Array.isArray(datos.botones) && datos.firma && datos.url ? datos.botones.filter((b) => NOMBRE_BOTON[b]) : []
      await self.registration.showNotification(datos.titulo || 'Tupper', {
        body: datos.texto || '',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: datos.tag || datos.titulo || 'tupper',
        // En iPhone (y donde no hay botones) no se muestran: queda el toque, que abre la app
        actions: botones.map((b) => ({ action: b, title: NOMBRE_BOTON[b] })),
        data: {
          ruta: typeof datos.ruta === 'string' && datos.ruta.startsWith('/') ? datos.ruta : '/',
          ...(botones.length ? { firma: datos.firma, url: datos.url } : {}),
        },
      })
    })(),
  )
})

const NOMBRE_BOTON = { vaso: 'Tomé un vaso', posponer: 'Más tarde' }

// Un botón: se le avisa a la función con la firma que vino en el aviso (no hace falta la sesión). Si no se pudo, se abre la app.
async function tocarBoton(accion, data) {
  try {
    const r = await fetch(data.url, {
      method: 'POST',
      // texto plano: así el navegador no hace la consulta previa de CORS
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ accion, ...data.firma }),
    })
    const respuesta = await r.json().catch(() => ({}))
    if (!r.ok) throw new Error('boton ' + r.status)
    if (respuesta.titulo)
      await self.registration.showNotification(respuesta.titulo, {
        body: respuesta.texto || '',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'tupper-listo',
        silent: true,
        data: { ruta: '/' },
      })
    return true
  } catch {
    return false
  }
}

self.addEventListener('notificationclick', (ev) => {
  ev.notification.close()
  const ruta = ev.notification.data?.ruta || '/'
  if (NOMBRE_BOTON[ev.action] && ev.notification.data?.firma) {
    ev.waitUntil(
      tocarBoton(ev.action, ev.notification.data).then((bien) => {
        if (!bien) return self.clients.openWindow(ruta)
      }),
    )
    return
  }
  ev.waitUntil(
    (async () => {
      const ventanas = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      const abierta = ventanas.find((c) => new URL(c.url).origin === self.location.origin)
      if (abierta) {
        await abierta.focus()
        if ('navigate' in abierta && new URL(abierta.url).pathname !== ruta) await abierta.navigate(ruta).catch(() => {})
        return
      }
      await self.clients.openWindow(ruta)
    })(),
  )
})

// ---------- Cambios sin mandar ----------
// La app pide un "sync" cuando queda algo en la cola sin conexión. El navegador lo dispara al volver la conexión, aunque
// la pestaña esté en segundo plano o la app cerrada del todo (Android/Chrome). Si hay una ventana abierta, se le avisa
// para que mande la cola ella (sabe cómo: ver store/sincronizacion.js). Si no hay ninguna, la manda el service worker.
self.addEventListener('sync', (ev) => {
  if (ev.tag !== 'tupper-cola') return
  ev.waitUntil(
    (async () => {
      const ventanas = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      if (ventanas.length) {
        for (const v of ventanas) v.postMessage({ tipo: 'tupper:sincronizar' })
        return
      }
      await mandarColaSinApp()
    })(),
  )
})

// Manda la cola con la app cerrada (T-07b), con el permiso que dejó la app (store/sincro/sesionSW.js). Es lo mismo que
// hace la app, más prudente:
//   - solo con el permiso todavía vigente (dura una hora): no renueva la sesión;
//   - con el mismo candado que las pestañas, así nunca la mandan dos a la vez;
//   - en orden, y se frena en el primero que la base rechace o que no se pueda repetir sin contar doble (el + y el - de
//     la despensa): eso queda para cuando se abra la app, que sabe avisar y reintentar.
// Si se corta la conexión en el medio, tira el error y el navegador vuelve a probar más tarde.
async function mandarColaSinApp() {
  const ses = await leerLocal(CLAVE_SESION_SW).catch(() => null)
  if (!ses?.uid || !ses.token || !(ses.vence > Date.now() + 60000)) return
  const claveCola = `cola:${ses.uid}`
  const mandar = async () => {
    // Solo la parte de Supabase que habla con la base (from y rpc), con el permiso que dejó la app
    const cliente = new PostgrestClient(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1`, {
      headers: { apikey: import.meta.env.VITE_SUPABASE_KEY, Authorization: `Bearer ${ses.token}` },
    })
    const envios = crearEnvios(cliente)
    const guardada = await leerLocal(claveCola)
    const cola = (Array.isArray(guardada) ? guardada : []).filter((c) => c?.id && c.tipo).sort((a, b) => (a.n || 0) - (b.n || 0))
    for (const c of cola) {
      if (SIN_CLAVE.has(c.tipo) || !envios[c.tipo]) return
      try {
        await envios[c.tipo](c.datos, ses.uid)
      } catch (err) {
        if (err.sinConexion) throw err
        return
      }
      await cambiarLocal(claveCola, (g) => (Array.isArray(g) ? g.filter((x) => x?.id !== c.id) : undefined))
    }
    await cambiarLocal(CLAVE_SESION_SW, (v) => (v?.uid === ses.uid ? undefined : v))
  }
  if (self.navigator?.locks?.request)
    await self.navigator.locks.request(nombreDelCandado(ses.uid), { ifAvailable: true }, async (candado) => {
      if (candado) await mandar()
    })
  else await mandar()
}
