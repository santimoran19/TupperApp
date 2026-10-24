// El service worker de la app (1.29: propio, antes lo armaba vite-plugin-pwa solo). Hace lo mismo que el anterior —guarda
// la app para abrir rápido y sin conexión, y three.js, el cuerpo 3D y las fotos la primera vez que se usan— y además:
//   - muestra las notificaciones push de los recordatorios con la app cerrada (F-06, supabase/functions/recordatorios-push)
//   - cuando vuelve la conexión, despierta a la app para que mande los cambios que quedaron sin mandar (T-07)
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { CacheFirst } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'

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
      await self.registration.showNotification(datos.titulo || 'Tupper', {
        body: datos.texto || '',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: datos.tag || datos.titulo || 'tupper',
        data: { ruta: typeof datos.ruta === 'string' && datos.ruta.startsWith('/') ? datos.ruta : '/' },
      })
    })(),
  )
})

self.addEventListener('notificationclick', (ev) => {
  ev.notification.close()
  const ruta = ev.notification.data?.ruta || '/'
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
// La app pide un "sync" cuando queda algo en la cola sin conexión. El navegador lo dispara al volver la conexión,
// aunque la pestaña esté en segundo plano, y acá se le avisa a la app para que mande la cola (ella sabe cómo: ver
// store/sincronizacion.js). Con la app cerrada del todo no se manda nada: queda para cuando se abra.
self.addEventListener('sync', (ev) => {
  if (ev.tag !== 'tupper-cola') return
  ev.waitUntil(
    (async () => {
      const ventanas = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      for (const v of ventanas) v.postMessage({ tipo: 'tupper:sincronizar' })
    })(),
  )
})
