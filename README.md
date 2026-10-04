# Tupper

PWA para llevar la despensa, las recetas, el plan de la semana y lo que se come cada día.

- **Despensa:** stock de cada alimento. Se descuenta solo al cocinar o al registrar una comida.
- **Recetas:** muestra cuáles se pueden hacer con lo que hay y qué falta para las demás.
- **Plan semanal:** se arma con el stock y marca las comidas que se hacen fuera de casa. Esas comidas usan recetas que se pueden llevar.
- **Diario:** lo que se comió contra el objetivo, con un consejo para cerrar el día. Se puede marcar "no comí" y cargar bebidas o cosas entre comidas.
- **Alimentos:** base propia más búsqueda de productos de marca en Open Food Facts (gratis, sin clave).
- **Lista de compras:** lo que falta para el plan, con precio y gasto del mes.
- **Perfil:** objetivo de calorías y proteína, peso y cintura con gráfico.

Cada usuario entra con email y contraseña y ve solo lo suyo.

## Stack

React + Vite + Tailwind, Supabase (auth y base de datos) y `vite-plugin-pwa`.

## Correrla en la compu

```bash
npm install
npm run dev
```

Necesita un archivo `.env` con los datos del proyecto de Supabase (ver `.env.example`).

## Deploy en Vercel

1. Subí el proyecto a un repo de GitHub e importalo en Vercel. Lo detecta como Vite.
2. En *Settings > Environment Variables* cargá `VITE_SUPABASE_URL` y `VITE_SUPABASE_KEY`.
3. Deploy. El `vercel.json` ya redirige todas las rutas a `index.html`.

## Configurar el login en Supabase

En el panel de Supabase, dentro de *Authentication*:

- **URL Configuration > Site URL:** poné la URL de Vercel. Si no, el link del mail de confirmación apunta a `localhost`.
- **Sign In / Providers > Email > Confirm email:** si lo dejás activado, cada cuenta nueva tiene que confirmar el mail antes de entrar. Si la app es para pocos usuarios, podés desactivarlo y se entra directo.

## Base de datos

Para crear la base desde cero, se ejecutan en este orden:

1. `supabase/schema.sql`: tablas y reglas de seguridad por usuario (RLS).
2. `supabase/actualizacion-2.sql`: topes de validación en la base, "no comí" y el momento "entre comidas".
3. `supabase/seed.sql`: los 139 alimentos y las 62 recetas base, comunes a todos.

`supabase/seed-2.sql` trae solo la segunda tanda de alimentos y recetas, por si la base ya tenía la primera.

`scripts/seed-data.mjs` es de donde salen los dos seed. Para sumar alimentos o recetas base, editá ese archivo, corré `npm run seed` y ejecutá el SQL en Supabase.

Los topes de cada dato (altura, peso, calorías, cantidades) están en `src/lib/validar.js` y repetidos como restricciones en la base, así que un valor fuera de rango no entra aunque se saltee el formulario.

Los alimentos guardan calorías y macros cada 100 g (o 100 ml). Si se miden por unidad, `unit_grams` dice cuánto pesa una.

## Carpetas

```
src/
  lib/          cuentas de calorías, fechas, validaciones, el armado del plan y la búsqueda en Open Food Facts
  store/        Datos.jsx: carga todo de Supabase y tiene las acciones
  components/   piezas de interfaz compartidas
  pages/        una por pantalla
```
