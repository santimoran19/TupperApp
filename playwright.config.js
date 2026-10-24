// Pruebas de navegador: `npm run test:e2e`. Levanta un Supabase simulado y la app apuntando a él; no toca el proyecto real.
import { defineConfig } from '@playwright/test'

// Con REUSAR=1 se usan los servidores que ya estén andando (sirve para repetir un archivo suelto sin empezar de cero)
const reusar = !!process.env.REUSAR
// Con NAVEGADOR=webkit corre en WebKit (el motor de Safari, T-03) una parte de las pruebas: las que no usan cosas propias
// de Chrome (la cámara falsa, el protocolo de Chrome para los avisos push). Arranca con la 01, que crea la cuenta.
const webkit = process.env.NAVEGADOR === 'webkit'
const EN_SAFARI = [
  '01-acceso',
  '03-diario-bebidas-afuera',
  '07-modo-oscuro',
  '10-botones-en-iphone',
  '31-accesibilidad',
  '32-novedades-129',
].map((n) => new RegExp(`${n}\\.spec\\.js$`))

export default defineConfig({
  testDir: 'pruebas/e2e',
  // Los archivos corren en orden y de a uno: cada prueba sigue donde dejó la anterior (misma cuenta, misma despensa)
  workers: 1,
  fullyParallel: false,
  retries: 0,
  timeout: 240000,
  reporter: [['list']],
  use: { browserName: webkit ? 'webkit' : 'chromium' },
  ...(webkit ? { testMatch: EN_SAFARI } : {}),
  webServer: [
    {
      command: 'node pruebas/e2e/servidor/supabase-simulado.mjs',
      url: 'http://localhost:54321/_pruebas/estado',
      reuseExistingServer: reusar,
      timeout: 60000,
    },
    {
      // Las variables del entorno le ganan al archivo .env: la app de las pruebas siempre habla con el simulador.
      // El captcha va prendido (con un Turnstile de mentira, ver apoyo.js) para probar que cada pedido de acceso lo manda.
      command: 'npx vite --port 5199 --strictPort',
      env: { VITE_SUPABASE_URL: 'http://localhost:54321', VITE_SUPABASE_KEY: 'test', VITE_TURNSTILE_SITEKEY: 'clave-de-prueba' },
      url: 'http://localhost:5199',
      reuseExistingServer: reusar,
      timeout: 60000,
    },
  ],
})
