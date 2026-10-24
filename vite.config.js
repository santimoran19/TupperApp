import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { readFileSync } from 'node:fs'

const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))

export default defineConfig({
  // La versión del package.json queda disponible en el código (se muestra en el perfil y va en el registro de errores)
  define: { __APP_VERSION__: JSON.stringify(version) },
  // En desarrollo (y en las pruebas), lo que se carga recién cuando se usa se prepara de entrada: si no, la primera vez
  // que aparece Vite lo descubre y recarga la página (se pierde lo que estaba abierto)
  optimizeDeps: {
    // Se recorren todas las pantallas al arrancar (no solo las que se abren primero), así no aparecen dependencias nuevas a mitad de camino
    entries: ['index.html', 'src/**/*.{js,jsx}', '!src/sw.js'],
    include: [
      '@zxing/library',
      'three',
      'three/examples/jsm/environments/RoomEnvironment.js',
      'three/examples/jsm/geometries/RoundedBoxGeometry.js',
      'three/examples/jsm/utils/BufferGeometryUtils.js',
    ],
  },
  build: {
    // three.js mide unos 750 KB sin comprimir (190 KB comprimido) y se carga solo cuando se usa: no hace falta el aviso
    chunkSizeWarningLimit: 800,
    rolldownOptions: {
      output: {
        // React y Supabase cambian poco: van en archivos aparte para que el navegador los guarde entre versiones.
        // three.js (los dibujos 3D) es grande: va aparte y solo se baja si se usa (ver src/sw.js)
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(id)) return 'react'
          if (id.includes('node_modules/@supabase/')) return 'supabase'
          if (/node_modules\/three\//.test(id)) return 'tres'
          return undefined
        },
      },
    },
  },
  plugins: [
    react(),
    // Los estilos (Tailwind 4: la configuración está en src/index.css, `@theme`)
    tailwindcss(),
    VitePWA({
      // Cuando hay una versión nueva no se cambia sola por detrás: la app muestra un aviso con el botón "Actualizar"
      // (components/AvisoVersion.jsx), que es el que registra el service worker.
      registerType: 'prompt',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Tupper',
        short_name: 'Tupper',
        description: 'Despensa, recetas, plan semanal y registro de calorías',
        lang: 'es',
        theme_color: '#206140',
        background_color: '#f9fbf8',
        display: 'standalone',
        orientation: 'portrait',
        id: '/',
        start_url: '/',
        // Accesos directos al mantener apretado el ícono de la app instalada (Android y compu)
        shortcuts: [
          { name: 'Registrar comida', short_name: 'Registrar', url: '/registrar', icons: [{ src: 'icon-192.png', sizes: '192x192' }] },
          { name: 'Preguntale a la IA', short_name: 'Asistente', url: '/asistente', icons: [{ src: 'icon-192.png', sizes: '192x192' }] },
          { name: 'Despensa', url: '/despensa', icons: [{ src: 'icon-192.png', sizes: '192x192' }] },
          { name: 'Lista de compras', short_name: 'Compras', url: '/compras', icons: [{ src: 'icon-192.png', sizes: '192x192' }] },
        ],
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      // El service worker es propio (src/sw.js, 1.29): además de guardar la app, muestra las notificaciones push
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        // La imagen de vista previa es para las redes: no hace falta guardarla en el teléfono. three.js tampoco se guarda de
        // entrada (pesa ~190 KB comprimido y se puede apagar): se guarda la primera vez que se usa (ver src/sw.js)
        globIgnores: ['**/og.png', '**/assets/tres-*.js'],
      },
    }),
  ],
})
