// Pruebas de navegador: `npm run test:e2e`. Levanta un Supabase simulado y la app apuntando a él; no toca el proyecto real.
import { defineConfig } from '@playwright/test'

// Con REUSAR=1 se usan los servidores que ya estén andando (sirve para repetir un archivo suelto sin empezar de cero)
const reusar = !!process.env.REUSAR

export default defineConfig({
  testDir: 'pruebas/e2e',
  // Los archivos corren en orden y de a uno: cada prueba sigue donde dejó la anterior (misma cuenta, misma despensa)
  workers: 1,
  fullyParallel: false,
  retries: 0,
  timeout: 240000,
  reporter: [['list']],
  use: { browserName: 'chromium' },
  webServer: [
    {
      command: 'node pruebas/e2e/servidor/supabase-simulado.mjs',
      url: 'http://localhost:54321/_pruebas/estado',
      reuseExistingServer: reusar,
      timeout: 60000,
    },
    {
      // Las variables del entorno le ganan al archivo .env: la app de las pruebas siempre habla con el simulador
      command: 'npx vite --port 5199 --strictPort',
      env: { VITE_SUPABASE_URL: 'http://localhost:54321', VITE_SUPABASE_KEY: 'test' },
      url: 'http://localhost:5199',
      reuseExistingServer: reusar,
      timeout: 60000,
    },
  ],
})
