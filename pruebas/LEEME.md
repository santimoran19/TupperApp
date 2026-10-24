# Pruebas

Dos grupos. Ninguno toca el proyecto real de Supabase ni necesita el archivo `.env`.

## `npm test`: la lógica y la base de datos

Tarda unos segundos y no abre ningún navegador. Corre todo lo que hay en `pruebas/unidad/`:

| Archivo | Qué prueba |
| --- | --- |
| `equivalencias.test.js` | Un producto propio que vale por un alimento de las recetas: stock sumado, de dónde se gasta, calorías, plan y sugerencias. |
| `base-de-alimentos.test.js` | Los alimentos y recetas base: categorías, familias (cualquier leche cuenta como leche), sugerencias con productos reales y lectura de los productos de Open Food Facts. |
| `base-ampliada.test.js` | La base ampliada (F-12): datos de cada alimento y receta (calorías contra macros, rangos por comida), sinónimos, familias y medidas, búsquedas de ejemplo, que las sugerencias de "cuenta como" de los productos de siempre no cambien y que `seed-5.sql` se pueda correr dos veces sobre la base anterior. |
| `preciosclaros.test.js` | El nombre de un producto por su código en Precios Claros: las zonas, la memoria de sucursales, las fallas en silencio, la presentación y los nombres largos (con la red simulada). |
| `openfoodfacts.test.js` | La búsqueda: los dos buscadores, la memoria por búsqueda y los reintentos (con la red y el reloj simulados), la búsqueda de un producto por su código de barras y cómo se leen sus calorías (por porción, en kJ, calculadas). |
| `codigo.test.js` | Los códigos de barras: limpieza, dígito verificador (EAN-13, EAN-8, UPC-A, ITF-14), mensajes de error y cómo se ve un producto del catálogo. |
| `catalogo.test.js` | El catálogo compartido en la base de verdad (`actualizacion-14.sql`): nadie toca las tablas, un aporte solo no se publica, dos personas con valores parecidos sí, topes por día, búsqueda sin comodines y borrar la cuenta. |
| `analisis.test.js` | El análisis con IA: los datos que se le mandan al modelo, la lectura de la respuesta y la elección del proveedor. |
| `gasto.test.js` | El motor de gasto (F-19): metabolismo basal (Mifflin-St Jeor y Katch-McArdle), movimiento del día a día, mantenimiento con efecto térmico, recorte gradual según el peso meta, piso de calorías y objetivo del día. |
| `ejercicio.test.js` | Las calorías de un entrenamiento por cada método (reloj activas o totales, pulso con Keytel, distancia con el ACSM, METs), la suma del día y el catálogo de 93 actividades con sus METs del Compendio 2024. |
| `gastoreal.test.js` | El gasto real con tus datos: regresión del peso, confianza, el signo del cambio de peso, los mínimos de datos y el factor de ajuste. |
| `gastodia.test.js` | El gasto, el ejercicio y el objetivo de un día, y lo único que se le cuenta al análisis con IA de cada día (el objetivo de calorías). |
| `gimnasio.test.js`, `borrador-entreno.test.js` | El gimnasio (volumen, 1RM de Epley, récords) y el borrador de la sesión en curso. |
| `gasto-base.test.js`, `guardar-entreno.test.js` | Las tablas y funciones de gasto y ejercicio contra la base de verdad (`actualizacion-15` a `18`): topes, permisos, guardar un entrenamiento con sus series. |
| `base-de-datos.test.js` | La base de verdad: arma un Postgres en memoria, le aplica los `.sql` de `supabase/` en orden y prueba las funciones (cocinar, registrar, comprar, guardar receta), que nada quede a medias cuando algo falla, los permisos por usuario y el registro de errores. |
| `topes.test.js` | Los topes de la base: textos con largo máximo, filas que no pesan de más y el máximo de filas por usuario. |
| `editar-registros.test.js` | Cambiar la cantidad de un registro y borrarlo con la despensa al día, contra la base de verdad: stock que no alcanza, producto que ya no está, registros viejos, recetas con comida lista, otra cuenta. |
| `ajuste.test.js` | La cuenta y los textos de esos cambios en la app (`src/lib/ajuste.js`). |
| `filtradas.test.js` | La consulta de contraseñas filtradas: qué se le manda al servicio, cómo se lee la respuesta y qué pasa si no contesta. |
| `sin-conexion.test.js` | Lo que la app hace en el teléfono cuando no hay conexión contra lo que hace la base cuando el cambio llega: tienen que dar lo mismo (stock, comida lista, registros, lista y compras), también dentro de un hogar. |
| `hogares.test.js` | Los hogares (`actualizacion-13.sql`) contra la base de verdad: armar uno, unirse con el código (se suma lo de cada uno y lo suyo queda intacto), que cada uno vea lo mismo y nadie más vea nada, sacar a alguien, irse con una copia y un respaldo, relevo de quien lo armó, máximo de personas, código que se renueva y se apaga, límite de intentos, borrar cuentas (que no quede nada suelto) y que quien nunca entró a un hogar se comporte como siempre. |
| `diseno.test.js` | Lo de la 1.24 que se puede probar sin pantalla: la despensa (`src/lib/despensa.js`: estados de vencimiento, referencias de compra, nivel de stock), la silueta (`src/lib/silueta.js`: % de grasa, peso proyectado, límites), el mapa de músculos (`src/lib/musculos.js`), las porciones del plato 3D y las rutas de las fotos. |
| `base-sexta.test.js` | La sexta tanda de la base (1.25, `scripts/seed-sexta.mjs`): que los 227 alimentos y las 1.471 recetas nuevos estén completos (campos, categorías, topes de la base, ingredientes que existen, unidades de a medias, calorías por porción razonables para cada comida, nombres y slugs únicos, voseo y sin textos rotos) y que `seed-8-alimentos.sql` y `seed-8-recetas-*.sql` se carguen en un Postgres en memoria sobre la base anterior, sin duplicar si se corren de nuevo. |
| `despensa-base.test.js` | `actualizacion-19.sql` contra la base de verdad: fecha de vencimiento (límites, se borra al agotarse, el hogar suma con la que vence antes), fotos (rutas válidas, solo las propias) y músculos de cada entrenamiento (se guardan, una app vieja no los borra, solo grupos conocidos). |
| `recorrido.test.js` | El recorrido inicial (`src/lib/recorrido.js`): que los 34 pasos estén completos, que cada ancla `data-tour` exista en su pantalla, que los textos nombren botones reales, cuándo se muestra y se borra la marca, y la geometría del cartel (arriba, abajo, al costado). |
| `porciones.test.js` | Ver una receta para otras porciones (F-07): los pasos del selector (de a 1, y por debajo de 1 a la mitad), los topes, cómo se escriben las cantidades en unidades fraccionadas y lo que falta según las porciones que se miran. |
| `compartir.test.js` | La lista de compras hecha texto para WhatsApp (F-05): agrupada por categoría, con las cantidades de la app, el título con el nombre del hogar y el enlace de WhatsApp bien escapado. |

Si agregás una actualización de la base (`supabase/actualizacion-10.sql`, por ejemplo), sumala a la lista `ARCHIVOS` de `postgres.js` (el Postgres en memoria que comparten las pruebas de la base).

## `npm run test:e2e`: la app entera en un navegador

Tarda unos 5 minutos. Levanta dos cosas solo y las apaga al terminar:

- un **Supabase simulado** (`e2e/servidor/supabase-simulado.mjs`, puerto 54321) con el acceso, las tablas, las funciones de la base y un modelo de IA falso, todo en memoria;
- la **app** apuntando a ese simulador (puerto 5199).

Después abre Chromium y recorre la app como una persona: crea la cuenta, arma el perfil, carga la despensa, cocina, planifica, compra, registra comidas, etc.

La primera vez hay que bajar el navegador:

```bash
npx playwright install chromium
```

Cosas a saber:

- **La `22-escaner-catalogo` no depende de las otras:** crea sus propias cuentas y usa una cámara de mentira (un lienzo que dibuja un código EAN-13 de verdad), así se prueba el lector de la librería y el propio del teléfono sin cámara real. Se puede correr sola con `npx playwright test 22-escaner`.
- **La `23-escaner-dificil` tampoco depende de las otras:** misma idea con un video de 1280x720 y el código dibujado más chico, de colores, borroso o blanco sobre negro, más la foto del código (`camara-falsa.js` también arma la "foto"), el zoom y la linterna, y los productos de Open Food Facts sin calorías (por porción, calculadas, con el nombre de Precios Claros o a partir de un alimento parecido). Se puede correr sola con `npx playwright test 23-escaner`. `camara-falsa.js` y `escaner-apoyo.js` son los atajos que comparten la 22 y la 23.
- **Las `24-gasto-ejercicio`, `25-gimnasio` y `26-gasto-real` siguen la cuenta de la `01-acceso`** (hay que correr la 01 antes; la 24 empieza dejando los pesos como los dejó el alta, porque los números dependen del peso; `npx playwright test 01-acceso 24-gasto 25-gimnasio 26-gasto` tarda unos 30 segundos): activar el gasto con consentimiento, calcular, anotar y corregir entrenamientos, rutinas y sesiones con series (récords, borrador, ejercicios propios), el gasto real con comidas y pesajes cargados, el ajuste y el objetivo de cada día en el resumen. El servidor de mentira (`servidor/supabase-simulado.mjs`) ahora también simula las tablas de ejercicio, los catálogos (se cargan de `scripts/ejercicio-data.mjs` y `scripts/gym-data.mjs`) y las funciones `guardar_entrenamiento` y `guardar_rutina`.
- **El simulador carga la base completa** (`foodsTodos` y `recipesTodas` de `scripts/seed-sexta.mjs`: unas 1.600 recetas y 617 alimentos), igual que la base real con los `seed-8`. Por eso la lista de recetas se muestra de a 60 ("Ver más recetas") y las pruebas leen la cantidad del pie de la lista ("60 de 1603 recetas") en vez de contar tarjetas; la lista de bebidas del Diario muestra las 63.
- **La `27-despensa-fotos-cuerpo` sigue la cuenta de las anteriores:** vencimientos en la despensa (etiqueta, "Usá esto primero", recetas que lo usan, se borra al agotarse), foto propia de un alimento (se sube achicada y se quita), la silueta para elegir la meta, el mapa de músculos y el interruptor de los dibujos 3D. El servidor de mentira simula también Supabase Storage.
- **La `32-novedades-129` no depende de las otras:** crea su cuenta y prueba la verificación en dos pasos con códigos TOTP de verdad (`servidor/totp.mjs`, el mismo cálculo que una app autenticadora; el simulador tiene `/factors` y la base simulada no da datos a una sesión sin el código), Deshacer, el gráfico de peso, "Revisar y anotar" del asistente y pegar una receta (las funciones de IA, de mentira).
- **La `12-version-nueva` también prueba los avisos push:** entrega un push al service worker por el protocolo de Chrome y mira que la notificación salga solo con la app cerrada. Usa el Chromium completo (`channel: 'chromium'`), porque el "headless shell" no da permiso de notificaciones.
- **3D apagado:** `contexto()` de `apoyo.js` apaga los dibujos 3D salvo con `tresD: true` (con GL por software el 3D hacía lentas, y a veces fallar, a las pruebas que no lo miran).
- **Safari (WebKit):** `NAVEGADOR=webkit npx playwright test` corre la lista `EN_SAFARI` de `playwright.config.js` (antes, `npx playwright install webkit`).
- **Los demás archivos corren en orden y cada uno sigue donde dejó el anterior** (misma cuenta, misma despensa). Por eso no se puede correr uno suelto de entrada. Para repetir uno solo mientras lo arreglás, dejá los servidores andando en otras dos terminales y usá `REUSAR=1`:

  ```bash
  node pruebas/e2e/servidor/supabase-simulado.mjs
  VITE_SUPABASE_URL=http://localhost:54321 VITE_SUPABASE_KEY=test VITE_TURNSTILE_SITEKEY=clave-de-prueba npx vite --port 5199 --strictPort
  REUSAR=1 npx playwright test          # una vez entero, para dejar los datos cargados
  REUSAR=1 npx playwright test 08-      # y después el que quieras
  ```

  En Windows (PowerShell) las variables se ponen antes: `$env:REUSAR=1; npx playwright test 08-`.

- **`18-recorrido` y las cuentas nuevas:** el recorrido inicial aparece al crear un perfil. Las pruebas que arman una cuenta (`01`, `04`, `16`) lo saltan con `saltarRecorrido(pg)` de `apoyo.js`; `18-recorrido` lo recorre entero en celular y en compu, prueba que se puede saltar y que una cuenta que ya existía no lo ve. Necesita la sesión que deja `01-acceso`.
- **Anchos de pantalla:** todas las pruebas corren con pantalla de celular (412 px), salvo `14-escritorio`, que prueba la compu: barra lateral, columnas, ventanas centradas y que nada se salga de la pantalla de 360 a 2560 px.
- **El navegador cree que siempre es sábado 3/10/2026 a las 21:30.** Varias pruebas dependen del día de la semana; así dan lo mismo cualquier día.
- **Al abrir, la app muestra un instante lo que tenía guardado en el teléfono y enseguida lo que trae la base.** Para que ninguna prueba lea lo viejo, `goto` y `reload` esperan solos a que estén los datos de la base (`apoyo.js`; la app lo deja marcado en `<html data-datos="base">`). Cuando la prueba sabe que eso no va a pasar (sin conexión, o con la base rechazando un cambio), se apaga con `ctx.sinEsperarDatos = true`.
- **El captcha va prendido, con un Turnstile de mentira** (`apoyo.js`): el simulador exige una comprobación nueva en cada pedido de acceso, como Supabase con la protección activada. El servicio de contraseñas filtradas también está reemplazado: las pruebas no salen a internet.
- **Capturas:** con `CAPTURAS=1` se guardan las pantallas en `pruebas/e2e/capturas/` (no se suben al repo). Sirve para mirar cómo quedó algo.
- **Funciones del servidor (análisis con IA y entrar con el usuario):** corren de verdad si tenés [Deno](https://deno.com) instalado; si no, esas partes se saltean y el resto corre igual. La lógica de las funciones se prueba siempre en `npm test`. Si Deno no está en el `PATH`, pasale la ruta en la variable `DENO`.
- Si una prueba falla, las siguientes probablemente también: mirá la primera que falló.

## Cuándo correrlas

Antes de cada `git push`: `npm run lint` y `npm test` siempre, y `npm run test:e2e` cuando el cambio toca pantallas o el guardado de datos.

Después del push, GitHub las vuelve a correr solo (`.github/workflows/pruebas.yml`): lint, formato, unidad y build en cada push, y las de navegador al subir a `main`. Si llega un mail de que falló, abrí la pestaña *Actions* del repo, entrá a la corrida y mirá el primer paso en rojo; para repetirlo en tu compu, el mismo comando de esta guía.
