// Pruebas de la lógica (sin navegador ni red): `npm test`
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['pruebas/unidad/**/*.test.js'],
    environment: 'node',
  },
})
