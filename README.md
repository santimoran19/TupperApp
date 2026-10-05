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
npm test            # la lógica y la base de datos: un par de segundos, sin navegador
npm run test:e2e    # la app entera en un navegador, contra un Supabase simulado: unos 3 minutos
```

Ninguna de las dos toca el proyecto real de Supabase. La primera vez, las de navegador piden bajar Chromium con `npx playwright install chromium`. El detalle está en `pruebas/LEEME.md`.

## Deploy en Vercel

1. Subí el proyecto a un repo de GitHub e importalo en Vercel. Lo detecta como Vite.
2. En *Settings > Environment Variables* cargá `VITE_SUPABASE_URL` y `VITE_SUPABASE_KEY`.
3. Deploy. El `vercel.json` ya redirige todas las rutas a `index.html`.

## Configurar el login en Supabase

En el panel de Supabase, dentro de *Authentication*:

- **URL Configuration > Site URL:** poné la URL de Vercel (`https://tupperapp.vercel.app`). De ahí sale el logo de los mails.
- **Emails:** hay que pegar las dos plantillas y configurar un SMTP propio. Está paso a paso en `supabase/emails/LEEME.md`. Sin SMTP propio, Supabase solo le manda mails al equipo del proyecto y nadie más puede crear una cuenta.
- **Sign In / Providers > Email > Confirm email:** activado, cada cuenta nueva confirma el mail con el código. Si lo desactivás se entra directo; la app funciona de las dos formas.

## Base de datos

Para crear la base desde cero, se ejecutan en este orden:

1. `supabase/schema.sql`: tablas y reglas de seguridad por usuario (RLS).
2. `supabase/actualizacion-2.sql`: topes de validación en la base, "no comí" y el momento "entre comidas".
3. `supabase/actualizacion-3.sql`: objetivo de líquido, bebidas con alcohol, recetas ocultas y favoritas, y la función que borra la cuenta.
4. `supabase/actualizacion-4.sql`: la tabla donde se guardan los análisis hechos con IA.
5. `supabase/actualizacion-5.sql`: el dato que dice por qué alimento de las recetas vale un producto propio.
6. `supabase/actualizacion-6.sql`: las categorías por góndola de los alimentos que ya estaban.
7. `supabase/actualizacion-7.sql`: las funciones que cocinan, registran y compran en un solo paso, la tabla de pedidos ya atendidos y la del registro de errores. Tiene que estar aplicada antes de publicar la versión 1.7 de la app.
8. `supabase/seed.sql`: los 274 alimentos y las 88 recetas base, comunes a todos. Se puede ejecutar de nuevo: agrega solo lo que falta.

La función que consulta a la IA está en `supabase/functions/analizar-semana/`; cómo activarla, en `supabase/functions/LEEME.md`.

`scripts/seed-data.mjs` es de donde sale el seed. Para sumar alimentos o recetas base, editá ese archivo, corré `npm run seed` y ejecutá el SQL en Supabase.

Cocinar, registrar una comida, comprar y guardar una receta tocan varias tablas: cada una es una función de la base (`cocinar`, `registrar_comida`, `comprar`, `guardar_receta`) que hace todo junto o no hace nada, así un corte de conexión no deja nada a medias. El stock se mueve por diferencias ("restá 2"), no pisando el total, para que dos teléfonos con la misma cuenta no se pisen. Como sumar o restar dos veces no es lo mismo que una, cocinar, registrar y comprar viajan con una clave: si la conexión se corta justo después de que la base guardó y la persona toca de nuevo, el segundo pedido no se aplica (tabla `operaciones`).

Los topes de cada dato (altura, peso, calorías, cantidades) están en `src/lib/validar.js` y repetidos como restricciones en la base, así que un valor fuera de rango no entra aunque se saltee el formulario.

Los alimentos guardan calorías y macros cada 100 g (o 100 ml). Si se miden por unidad, `unit_grams` dice cuánto pesa una.

## Antes de ofrecerla al público

- Completá `src/lib/marca.js` con quién responde por la app y un mail de contacto: salen en los Términos y en la Política de privacidad (`/terminos` y `/privacidad`).
- Hacé revisar esos dos textos por un abogado. Son una base razonable, no un documento legal definitivo.
- Configurá el SMTP propio (ver `supabase/emails/LEEME.md`).
- Si querés el análisis con IA, cargá la clave en Supabase (ver `supabase/functions/LEEME.md`).
- Activá Web Analytics en el proyecto de Vercel (pestaña *Analytics*): la app ya manda las visitas, sin cookies, pero Vercel las cuenta recién cuando está activado.
- Si pasás a un dominio propio, cambiá `tupperapp.vercel.app` en `index.html`, `public/robots.txt`, `public/sitemap.xml` y `src/lib/marca.js`.

## Qué trae para la web

- Título y descripción de la página, y vista previa al compartir el enlace (`public/og.png`).
- `robots.txt` y `sitemap.xml` con las páginas públicas (acceso, términos y privacidad).
- Encabezados de seguridad en `vercel.json`, incluida una política de contenido (CSP) que solo deja conectar con Supabase y Open Food Facts. Si sumás otro servicio externo, agregalo ahí en `connect-src`. El HTTPS lo fuerza Vercel.
- Las pantallas se bajan de a una (carga por partes) y los íconos están comprimidos.
- Confirmación propia antes de borrar, página para direcciones que no existen y colores de texto con contraste AA.
- Si una pantalla falla, se muestra un mensaje con el botón para recargar en vez de quedar en blanco (`src/components/Barrera.jsx`).
- Cuando se publica una versión nueva, la app instalada muestra el aviso "Hay una versión nueva" con el botón Actualizar (`src/components/AvisoVersion.jsx`). La versión es la del `package.json` y se ve al pie del Perfil.
- Al volver a la app después de un rato, trae los datos de nuevo sin mostrar "Cargando": lo que se cambió desde otro dispositivo aparece solo.
- Modo oscuro: sigue al teléfono y se puede forzar desde Perfil > Apariencia. Los colores de los dos temas son variables en `src/index.css`; `public/tema.js` aplica la elección antes de pintar.

## Registro de errores

Cuando algo falla en el teléfono de un usuario (una pantalla que se rompe, una acción que la base rechaza, un error que nadie atrapó), la app lo anota en la tabla `eventos` con la pantalla, la versión y el navegador. También anota cómo salió cada búsqueda en Open Food Facts y cada análisis con IA. No guarda nombres de alimentos ni lo que se busca.

Para mirarlo: en Supabase, *Table Editor > eventos*, o en el *SQL Editor*:

```sql
select created_at, tipo, nombre, detalle, version, ruta, dispositivo
from public.eventos order by created_at desc limit 100;
```

Cada usuario puede agregar y leer solo lo suyo (sale en "Descargar mis datos"), nadie puede modificarlo ni borrarlo, hay un tope de 300 por usuario por día y se borra a los 90 días. El código está en `src/lib/eventos.js`.

## Carpetas

```
src/
  lib/          cuentas de calorías, fechas, validaciones, el armado del plan, las equivalencias, los sinónimos (alias.js), la búsqueda en Open Food Facts y el registro de errores (eventos.js)
  store/        Datos.jsx: carga todo de Supabase y tiene las acciones
  components/   piezas de interfaz compartidas
  pages/        una por pantalla
pruebas/
  unidad/       la lógica y la base de datos (Vitest)
  e2e/          la app en un navegador (Playwright) y el Supabase simulado
```
