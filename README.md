# Tupper

PWA para llevar la despensa, las recetas, el plan de la semana y lo que se come cada día.

- **Despensa:** stock de cada alimento. Se descuenta solo al cocinar o al registrar una comida.
- **Recetas:** muestra cuáles se pueden hacer con lo que hay y qué falta para las demás. Se pueden marcar favoritas, ocultar las que no gustan y editar las propias.
- **Plan semanal:** se arma con el stock y marca las comidas que se hacen fuera de casa. Esas comidas usan recetas que se pueden llevar.
- **Diario:** lo que se comió contra el objetivo, con un consejo para cerrar el día y el contador de líquido. Se puede marcar "no comí" y cargar bebidas (con sus medidas y el azúcar) o cosas entre comidas.
- **Resumen semanal:** promedios contra el objetivo, días cumplidos y peso, más una devolución de la semana escrita con IA (opcional, ver `supabase/functions/LEEME.md`).
- **Alimentos:** base propia (se busca también por sinónimos y marcas: "spaghetti" encuentra "Fideos secos") más búsqueda de productos de marca en Open Food Facts (gratis, sin clave; prueba sus dos buscadores y reintenta sola). Un producto propio puede valer por un alimento de las recetas ("Aceite girasol Natura" cuenta como "Aceite"): las recetas lo usan, lo descuentan al cocinar y calculan las calorías con sus valores.
- **Lista de compras:** lo que falta para el plan y lo anotado a mano, con el precio de cada compra y el gasto del mes.
- **Perfil:** objetivos de calorías, proteína y líquido, peso y cintura con gráfico, descarga de los datos y borrado de la cuenta.

Cada usuario entra con email y contraseña y ve solo lo suyo. La cuenta se confirma con un código de 6 dígitos que llega por mail, y la contraseña se recupera de la misma forma.

## Stack

React + Vite + Tailwind, Supabase (auth y base de datos) y `vite-plugin-pwa`.

## Correrla en la compu

```bash
npm install
npm run dev
```

Necesita un archivo `.env` con los datos del proyecto de Supabase (ver `.env.example`).

## Pruebas

```bash
npm run lint        # busca errores en el código (variables sin usar, cosas mal escritas, reglas de React)
npm test            # la lógica y la base de datos: unos segundos, sin navegador
npm run test:e2e    # la app entera en un navegador, contra un Supabase simulado: unos 5 minutos
```

Ninguna toca el proyecto real de Supabase. La primera vez, las de navegador piden bajar Chromium con `npx playwright install chromium`. El detalle está en `pruebas/LEEME.md`.

## Formato del código

El formato lo pone Prettier (`.prettierrc.json`): `npm run format` deja todo el código igual, lo escriba quien lo escriba. En VS Code, con la extensión de Prettier instalada (la propone solo al abrir el proyecto), se formatea al guardar; así el editor no cambia los archivos por su cuenta con otro criterio. Los archivos que se generan con un script (`supabase/seed.sql`, `src/components/iconos.js`) y los datos de `scripts/seed-data.mjs` no se formatean (`.prettierignore`).

## Deploy en Vercel

1. Subí el proyecto a un repo de GitHub e importalo en Vercel. Lo detecta como Vite.
2. En *Settings > Environment Variables* cargá `VITE_SUPABASE_URL` y `VITE_SUPABASE_KEY` (y `VITE_TURNSTILE_SITEKEY` si vas a usar el captcha; ver "Seguridad de las cuentas").
3. Deploy. El `vercel.json` ya redirige todas las rutas a `index.html`.

## Configurar el login en Supabase

En el panel de Supabase, dentro de *Authentication*:

- **URL Configuration > Site URL:** poné la URL de Vercel (`https://tupperapp.vercel.app`). De ahí sale el logo de los mails.
- **Emails:** hay que pegar las dos plantillas y configurar un SMTP propio. Está paso a paso en `supabase/emails/LEEME.md`. Sin SMTP propio, Supabase solo le manda mails al equipo del proyecto y nadie más puede crear una cuenta.
- **Sign In / Providers > Email > Confirm email:** activado, cada cuenta nueva confirma el mail con el código. Si lo desactivás se entra directo; la app funciona de las dos formas.

## Seguridad de las cuentas

**Captcha.** La pantalla de acceso puede pedir la comprobación de "no soy un robot" de Cloudflare Turnstile (gratis; casi nunca se ve, aparece solo si hace falta tocar algo). Frena a los programas que crean cuentas de a miles o prueban contraseñas. Se prende en tres pasos, **en este orden**:

1. En [Cloudflare](https://dash.cloudflare.com) > *Turnstile* > *Add widget*: modo *Managed*, y en los dominios `tupperapp.vercel.app` (y `localhost` para probar en la compu). Te da dos claves: *Site Key* (pública) y *Secret Key*.
2. Cargá la *Site Key* como `VITE_TURNSTILE_SITEKEY` en Vercel (*Settings > Environment Variables*) y en tu `.env`, y publicá la app. Hasta acá no cambia nada para nadie: la app ya manda la comprobación, pero Supabase todavía no la exige.
3. Recién cuando todos tengan esa versión: en Supabase > *Authentication > Attack Protection* (en algunas versiones del panel figura como *Bot and Abuse Protection*), activá *Enable Captcha protection*, elegí *Turnstile* y pegá la *Secret Key*.

Desde el paso 3, Supabase rechaza cualquier pedido de acceso que no traiga la comprobación. Por eso el orden: si se hace antes que el 2, nadie puede entrar ni crear cuenta hasta publicar la app con la clave. Y la app instalada no se actualiza sola (muestra "Hay una versión nueva" y espera el toque en *Actualizar*): quien siga en una versión anterior y tenga que iniciar sesión de nuevo va a ver "Algo salió mal" hasta que actualice. Quien ya tiene la sesión iniciada no se entera en ningún caso. Para saber qué versiones están en uso antes de dar el paso 3, en el *SQL Editor*:

```sql
select version, count(distinct user_id) as usuarios from public.eventos
where created_at > now() - interval '14 days' group by 1 order by 1 desc;
```

(Cuenta solo a quienes dejaron algo anotado en esos días: alguien que no abrió la app, o que no buscó productos ni tuvo errores, no aparece.)

Cada dominio desde el que se abre la app tiene que estar en la lista del widget de Cloudflare: si pasás a un dominio propio, agregalo ahí antes de cambiar. En las direcciones de prueba de Vercel (las de cada rama) el captcha no pasa, salvo que las agregues. Sin `VITE_TURNSTILE_SITEKEY` la app anda igual, sin captcha. El componente es `src/components/Captcha.jsx`.

**Contraseñas filtradas.** Al crear la cuenta o cambiar la contraseña, la app consulta si esa contraseña apareció en filtraciones de otros sitios (Have I Been Pwned) y, si apareció, pide otra. La contraseña no sale del teléfono: se manda solo un fragmento de su huella (`src/lib/filtradas.js`). Supabase puede hacer lo mismo del lado del servidor (*Authentication > Sign In / Providers > Email > Prevent use of leaked passwords*), pero solo en el plan Pro; si pasás a ese plan, conviene prenderlo también.

**Emails que ya tienen cuenta.** Al crear una cuenta con un email que ya estaba registrado, la app no lo dice: muestra la misma pantalla del código que con una cuenta nueva (el mail no llega, y ahí mismo se explica qué hacer). Tampoco lo delata al pedir dos veces seguidas el mail de recuperación. Si lo dijera, cualquiera podría averiguar quién usa la app probando emails en la pantalla. Para que esto sirva, *Confirm email* tiene que estar activado en Supabase (ver arriba, "Configurar el login en Supabase"): con eso apagado, Supabase mismo contesta que el email ya está registrado. Aun activado, alguien que le hable a Supabase con un programa (no desde la app) puede notar diferencias en la respuesta; eso no se puede tapar desde la app, y es parte de lo que frena el captcha.

**Topes en la base.** Cada cuenta tiene un máximo de filas por tabla, los textos y los números tienen tope y ninguna fila puede pesar de más (`supabase/actualizacion-8.sql`). Antes, una sola cuenta podía llenar la base hablándole por fuera de la app; ahora, cargando todo al máximo, no pasa de unos 100 MB (el plan gratis de Supabase tiene 500 MB para todos), y para eso tiene que pasar el captcha y confirmar un email. Los máximos están muy por encima del uso normal: 30.000 registros de comida por cuenta son 4 años anotando 20 cosas por día. Si alguien llega, la app le muestra el aviso que manda la base, y el número se cambia con una línea (está explicado en el archivo). Para ver cuánto usa cada cuenta, en el *SQL Editor*:

```sql
select user_id, count(*) from public.log_entries group by user_id order by 2 desc limit 20;
```

## Base de datos

Para crear la base desde cero, se ejecutan en este orden:

1. `supabase/schema.sql`: tablas y reglas de seguridad por usuario (RLS).
2. `supabase/actualizacion-2.sql`: topes de validación en la base, "no comí" y el momento "entre comidas".
3. `supabase/actualizacion-3.sql`: objetivo de líquido, bebidas con alcohol, recetas ocultas y favoritas, y la función que borra la cuenta.
4. `supabase/actualizacion-4.sql`: la tabla donde se guardan los análisis hechos con IA.
5. `supabase/actualizacion-5.sql`: el dato que dice por qué alimento de las recetas vale un producto propio.
6. `supabase/actualizacion-6.sql`: las categorías por góndola de los alimentos que ya estaban.
7. `supabase/actualizacion-7.sql`: las funciones que cocinan, registran y compran en un solo paso, la tabla de pedidos ya atendidos y la del registro de errores. Tiene que estar aplicada antes de publicar la versión 1.7 de la app.
8. `supabase/actualizacion-8.sql`: los topes para que una cuenta no pueda llenar la base: máximo de filas por usuario, textos con largo máximo y filas que no pesan de más. No depende de ninguna versión de la app.
9. `supabase/seed.sql`: los 274 alimentos y las 88 recetas base, comunes a todos. Se puede ejecutar de nuevo: agrega solo lo que falta.

La función que consulta a la IA está en `supabase/functions/analizar-semana/`; cómo activarla, en `supabase/functions/LEEME.md`.

`scripts/seed-data.mjs` es de donde sale el seed. Para sumar alimentos o recetas base, editá ese archivo, corré `npm run seed` y ejecutá el SQL en Supabase.

Cocinar, registrar una comida, comprar y guardar una receta tocan varias tablas: cada una es una función de la base (`cocinar`, `registrar_comida`, `comprar`, `guardar_receta`) que hace todo junto o no hace nada, así un corte de conexión no deja nada a medias. El stock se mueve por diferencias ("restá 2"), no pisando el total, para que dos teléfonos con la misma cuenta no se pisen. Como sumar o restar dos veces no es lo mismo que una, cocinar, registrar y comprar viajan con una clave: si la conexión se corta justo después de que la base guardó y la persona toca de nuevo, el segundo pedido no se aplica (tabla `operaciones`).

Los topes de cada dato (altura, peso, calorías, cantidades) están en `src/lib/validar.js` y repetidos como restricciones en la base, así que un valor fuera de rango no entra aunque se saltee el formulario.

Los alimentos guardan calorías y macros cada 100 g (o 100 ml). Si se miden por unidad, `unit_grams` dice cuánto pesa una.

## Antes de ofrecerla al público

- Completá `src/lib/marca.js` con quién responde por la app y un mail de contacto: salen en los Términos y en la Política de privacidad (`/terminos` y `/privacidad`).
- Hacé revisar esos dos textos por un abogado. Son una base razonable, no un documento legal definitivo.
- Configurá el SMTP propio (ver `supabase/emails/LEEME.md`).
- Prendé el captcha (ver "Seguridad de las cuentas").
- Si la vas a vender, pasá el repo de GitHub a privado (*Settings > General > Change repository visibility*). Vercel sigue publicando igual.
- Si querés el análisis con IA, cargá la clave en Supabase (ver `supabase/functions/LEEME.md`).
- Activá Web Analytics en el proyecto de Vercel (pestaña *Analytics*): la app ya manda las visitas, sin cookies, pero Vercel las cuenta recién cuando está activado.
- Si pasás a un dominio propio, cambiá `tupperapp.vercel.app` en `index.html`, `public/robots.txt`, `public/sitemap.xml` y `src/lib/marca.js`.

## Qué trae para la web

- Título y descripción de la página, y vista previa al compartir el enlace (`public/og.png`).
- `robots.txt` y `sitemap.xml` con las páginas públicas (acceso, términos y privacidad).
- Encabezados de seguridad en `vercel.json`, incluida una política de contenido (CSP) que solo deja conectar con Supabase, Open Food Facts, el captcha de Cloudflare y el servicio de contraseñas filtradas. Si sumás otro servicio externo, agregalo ahí en `connect-src`. El HTTPS lo fuerza Vercel.
- Las pantallas se bajan de a una (carga por partes) y los íconos están comprimidos.
- Confirmación propia antes de borrar, página para direcciones que no existen y colores de texto con contraste AA.
- Si una pantalla falla, se muestra un mensaje con el botón para recargar en vez de quedar en blanco (`src/components/Barrera.jsx`).
- Cuando se publica una versión nueva, la app instalada muestra el aviso "Hay una versión nueva" con el botón Actualizar (`src/components/AvisoVersion.jsx`). La versión es la del `package.json` y se ve al pie del Perfil.
- Al volver a la app después de un rato, trae los datos de nuevo sin mostrar "Cargando": lo que se cambió desde otro dispositivo aparece solo.
- Funciona sin conexión (ver más abajo).
- Modo oscuro: sigue al teléfono y se puede forzar desde Perfil > Apariencia. Los colores de los dos temas son variables en `src/index.css`; `public/tema.js` aplica la elección antes de pintar.

## Sin conexión

La app guarda en el teléfono (IndexedDB) la última foto de los datos. Al abrir muestra eso enseguida y después trae lo nuevo; si no hay conexión, se queda con la copia y avisa con una franja debajo del encabezado.

Lo de todos los días se puede hacer igual: registrar comidas y agua, "no comí", borrar un registro, cocinar, comprar, la lista de compras y la despensa. Cada cambio se aplica en la copia, queda en una cola y se manda solo, en orden, cuando vuelve la conexión. Lo que es de configuración (perfil, medidas, recetas y alimentos propios, el plan, el análisis con IA, descargar los datos) necesita conexión y lo dice.

Cómo está hecho, en `src/store/`:

- `cambios.js` dice cómo queda cada cambio en la copia del teléfono y `envios.js`, cómo se manda a la base. `pruebas/unidad/sin-conexion.test.js` comprueba contra un Postgres de verdad que las dos cuentas den lo mismo.
- `sincronizacion.js` decide cuándo se manda la cola y cuándo se trae todo. La cola vive en el teléfono y la comparten las pestañas abiertas; la manda una sola por vez.
- Un cambio que la base rechaza por el dato en sí (una cantidad fuera de rango, un alimento que ya no existe) se saca de la cola y se avisa. Si el problema es otro (el servidor caído, un permiso), el cambio no se tira: queda en la cola, la franja lo dice y se prueba de nuevo cada minuto y cada vez que se abre la app. Recién se da por perdido cuando falló en 4 ocasiones separadas por al menos 12 horas (un día y medio como mínimo), y queda apartado en el teléfono (`descartados:<usuario>`) y anotado en `eventos`.
- Para que un cambio no cuente dos veces si la conexión se corta justo después de que la base guardó, cocinar, registrar y comprar viajan con una clave que la base recuerda (tabla `operaciones`); el resto pisa o borra, que repetido da lo mismo. La excepción es el + y el - de la despensa, que suma y no lleva clave: con conexión, si el pedido salió y no se sabe si llegó, no se manda de nuevo (avisa y después muestra lo que quedó en la base). Queda un caso sin cubrir: un toque hecho sin conexión que, al mandarse, llega a la base justo antes de otro corte.
- Los cambios se mandan con la app abierta; no hay envío en segundo plano.
- La copia y la cola se borran al cerrar sesión. Si quedan cambios sin enviar, antes pregunta.

## Registro de errores

Cuando algo falla en el teléfono de un usuario (una pantalla que se rompe, una acción que la base rechaza, un error que nadie atrapó), la app lo anota en la tabla `eventos` con la pantalla, la versión y el navegador. También anota cómo salió cada búsqueda en Open Food Facts y cada análisis con IA. No guarda nombres de alimentos ni lo que se busca.

Para mirarlo: en Supabase, *Table Editor > eventos*, o en el *SQL Editor*:

```sql
select created_at, tipo, nombre, detalle, version, ruta, dispositivo
from public.eventos order by created_at desc limit 100;
```

Cada usuario puede agregar y leer solo lo suyo (sale en "Descargar mis datos"), nadie puede modificarlo ni borrarlo, hay un tope de 100 por usuario por día y se borra a los 90 días. El código está en `src/lib/eventos.js`.

## Carpetas

```
src/
  lib/          cuentas de calorías, fechas, validaciones, el armado del plan, las equivalencias, los sinónimos (alias.js), la búsqueda en Open Food Facts y el registro de errores (eventos.js)
  store/        el estado de la app. Datos.jsx junta las piezas: la carga (carga.js), lo que se calcula con eso
                (derivados.js), la sincronización y el modo sin conexión (sincronizacion.js, cambios.js, envios.js,
                local.js), los avisos (avisos.jsx) y las acciones por tema (acciones/)
  components/   piezas de interfaz compartidas
  pages/        una por pantalla
pruebas/
  unidad/       la lógica y la base de datos (Vitest)
  e2e/          la app en un navegador (Playwright) y el Supabase simulado
```
