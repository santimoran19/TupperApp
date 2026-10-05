# Pruebas

Dos grupos. Ninguno toca el proyecto real de Supabase ni necesita el archivo `.env`.

## `npm test`: la lógica y la base de datos

Tarda unos segundos y no abre ningún navegador. Corre todo lo que hay en `pruebas/unidad/`:

| Archivo | Qué prueba |
| --- | --- |
| `equivalencias.test.js` | Un producto propio que vale por un alimento de las recetas: stock sumado, de dónde se gasta, calorías, plan y sugerencias. |
| `base-de-alimentos.test.js` | Los alimentos y recetas base: categorías, familias (cualquier leche cuenta como leche), sugerencias con productos reales y lectura de los productos de Open Food Facts. |
| `openfoodfacts.test.js` | La búsqueda: los dos buscadores, la memoria por búsqueda y los reintentos (con la red y el reloj simulados). |
| `analisis.test.js` | El análisis con IA: los datos que se le mandan al modelo, la lectura de la respuesta y la elección del proveedor. |
| `base-de-datos.test.js` | La base de verdad: arma un Postgres en memoria, le aplica los `.sql` de `supabase/` en orden y prueba las funciones (cocinar, registrar, comprar, guardar receta), que nada quede a medias cuando algo falla, los permisos por usuario y el registro de errores. |

Si agregás una actualización de la base (`supabase/actualizacion-8.sql`), sumala a la lista `ARCHIVOS` de `base-de-datos.test.js`.

## `npm run test:e2e`: la app entera en un navegador

Tarda unos 3 minutos. Levanta dos cosas solo y las apaga al terminar:

- un **Supabase simulado** (`e2e/servidor/supabase-simulado.mjs`, puerto 54321) con el acceso, las tablas, las funciones de la base y un modelo de IA falso, todo en memoria;
- la **app** apuntando a ese simulador (puerto 5199).

Después abre Chromium y recorre la app como una persona: crea la cuenta, arma el perfil, carga la despensa, cocina, planifica, compra, registra comidas, etc.

La primera vez hay que bajar el navegador:

```bash
npx playwright install chromium
```

Cosas a saber:

- **Los archivos corren en orden y cada uno sigue donde dejó el anterior** (misma cuenta, misma despensa). Por eso no se puede correr uno suelto de entrada. Para repetir uno solo mientras lo arreglás, dejá los servidores andando en otras dos terminales y usá `REUSAR=1`:

  ```bash
  node pruebas/e2e/servidor/supabase-simulado.mjs
  VITE_SUPABASE_URL=http://localhost:54321 VITE_SUPABASE_KEY=test npx vite --port 5199 --strictPort
  REUSAR=1 npx playwright test          # una vez entero, para dejar los datos cargados
  REUSAR=1 npx playwright test 08-      # y después el que quieras
  ```

  En Windows (PowerShell) las variables se ponen antes: `$env:REUSAR=1; npx playwright test 08-`.

- **El navegador cree que siempre es sábado 3/10/2026 a las 21:30.** Varias pruebas dependen del día de la semana; así dan lo mismo cualquier día.
- **Capturas:** con `CAPTURAS=1` se guardan las pantallas en `pruebas/e2e/capturas/` (no se suben al repo). Sirve para mirar cómo quedó algo.
- **Análisis con IA:** la función corre de verdad si tenés [Deno](https://deno.com) instalado; si no, esa parte se saltea y el resto corre igual. La lógica de la función se prueba siempre en `npm test`.
- Si una prueba falla, las siguientes probablemente también: mirá la primera que falló.

## Cuándo correrlas

Antes de cada `git push`: `npm test` siempre, y `npm run test:e2e` cuando el cambio toca pantallas o el guardado de datos.
