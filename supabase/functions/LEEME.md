# Análisis semanal con IA

La función `analizar-semana` arma el resumen de la semana del usuario, se lo pasa a un modelo de IA y guarda la devolución en la tabla `ai_analyses`. La clave del proveedor vive solo en Supabase: nunca llega al navegador.

La función ya está publicada en el proyecto. Para que funcione falta un solo paso: cargar la clave de un proveedor.

## Activarla con Groq (plan gratis)

1. Creá una cuenta en https://console.groq.com y generá una API key (**API Keys > Create API Key**).
2. En el panel de Supabase: **Edge Functions > Secrets**. Agregá un secreto con nombre `GROQ_API_KEY` y la clave como valor.

Mientras no haya ninguna clave cargada, el botón "Analizar mi semana" responde que el análisis todavía no está activado.

El plan gratis de Groq tiene topes que comparten todos los usuarios de la app: con el modelo por defecto, 30 pedidos por minuto, 1.000 por día, 8.000 tokens por minuto y 200.000 por día (octubre de 2026; los vigentes están en https://console.groq.com/docs/rate-limits). Cada análisis gasta unos 2.500 tokens, así que entran unos 80 por día. Si se llega al tope, la app avisa que la IA está con mucha demanda y no se guarda nada.

## Cambiar de proveedor

La función también sabe hablar con Anthropic (Claude), que se paga por uso. Para pasar de uno a otro no hay que tocar el código:

1. Cargá el secreto `ANTHROPIC_API_KEY` (cuenta y crédito en https://console.anthropic.com).
2. Agregá el secreto `IA_PROVEEDOR` con valor `anthropic` (o borrá `GROQ_API_KEY`).

Si cambiás de proveedor, actualizá el nombre en la Política de privacidad (`src/pages/Legal.jsx`), que dice a quién se le mandan los datos.

Para sumar otro proveedor, se agrega en `analizar-semana/proveedores.ts`.

## Ajustes opcionales (también como secretos)

| Secreto | Para qué | Valor por defecto |
| --- | --- | --- |
| `IA_PROVEEDOR` | `groq` o `anthropic` | El que tenga su clave cargada (primero Groq) |
| `GROQ_MODEL` | Qué modelo de Groq usar | `openai/gpt-oss-120b` |
| `ANTHROPIC_MODEL` | Qué modelo de Claude usar | `claude-haiku-4-5-20251001` |
| `IA_LIMITE_DIARIO` | Cuántos análisis puede pedir cada usuario cada 24 horas | `3` |

La base tiene sus propios topes por cuenta (`supabase/actualizacion-8.sql`): no guarda más de 10 análisis por día ni más de 500 en total. Por eso `IA_LIMITE_DIARIO` no pasa de 10 aunque le pongas más; para subirlo hay que cambiar los dos lugares (la base y `TOPE_DIARIO_BASE` en `index.ts`).

## Qué se manda

Sexo, edad, altura, peso, objetivos (con el objetivo de calorías de cada día: el modo dinámico cambia de un día a otro y la app lo manda en `objetivos`), totales de cada día, los alimentos registrados y las medidas de peso. No se manda el nombre ni el email, ni nada de ejercicio o gasto (la función descarta cualquier campo que no sea la fecha y el objetivo de cada día). Si la app es nueva y la función vieja, la IA compara con el objetivo fijo como antes; si es al revés, funciona igual.

## Volver a publicarla

Si cambiás el código, con la CLI de Supabase:

```bash
supabase functions deploy analizar-semana --project-ref bpxxwmcqidoxgmfyzhpc
```

Los registros de cada llamada se ven en **Edge Functions > analizar-semana > Logs**.

# Iniciar sesión con el nombre de usuario

La función `entrar` deja iniciar sesión con el nombre de usuario en vez del email. La app le manda el usuario y la contraseña; ella busca el email de esa cuenta, inicia la sesión en Supabase y le devuelve a la app solo la sesión. **El email nunca sale de la función**, y si el usuario no existe contesta lo mismo que con una contraseña equivocada. No necesita ningún secreto: Supabase le da solo `SUPABASE_URL` y las claves del proyecto (usa las de siempre y, cuando Supabase las apague a fin de 2026, las nuevas).

Para publicarla (una sola vez, y de nuevo si cambia el código):

```bash
supabase functions deploy entrar --no-verify-jwt --project-ref bpxxwmcqidoxgmfyzhpc
```

Va **sin** verificación de JWT (`--no-verify-jwt`; en el panel, la opción *Verify JWT* apagada): quien inicia sesión todavía no tiene ninguno, y con las claves nuevas de Supabase la verificación rechazaría a todos. No es un hueco: la función no hace nada privilegiado si no llega la contraseña correcta y el pedido lleva el captcha igual que el del email. Antes de publicar la app corré `supabase/actualizacion-12.sql`. Los registros de cada llamada se ven en **Edge Functions > entrar > Logs** (no guarda usuarios ni contraseñas, solo errores inesperados).

Un límite a tener en cuenta: Supabase limita los inicios de sesión por dirección de IP (unos 30 cada 5 minutos). Con la función, todos los que entran con usuario le llegan a Supabase desde el servidor de la función y no desde su teléfono, así que ese tope puede compartirse entre ellos. Con pocos usuarios no se nota; si la app crece y aparece "Se hicieron muchos intentos" a quien entra bien, hay que revisarlo.

# Desde qué páginas se puede llamar (las dos funciones)

Las dos funciones (`analizar-semana` y `entrar`) contestan solo a pedidos que vienen de la página de la app: `https://tupperapp.vercel.app`. Un navegador siempre avisa desde qué página llama (el encabezado `Origin`): si es otra, la función contesta 403 sin procesar nada, y a la app le devuelve el permiso de CORS con su nombre exacto (antes decía `*`, o sea, cualquiera). Un pedido sin `Origin` (curl, otro servidor) no pasa por acá: lo que protege a cada función sigue siendo su sesión (`analizar-semana`) o la contraseña y el captcha (`entrar`).

Para sumar otra página (otro dominio de la app, o probar en la compu con `npm run dev` contra el Supabase real), cargá el secreto **`ORIGENES_PERMITIDOS`** en *Edge Functions > Secrets*, con todas las páginas separadas por coma (también la de la app, porque reemplaza a la lista de siempre):

```
https://tupperapp.vercel.app,http://localhost:5173
```

Se aplica sin volver a publicar la función. Las previsualizaciones de Vercel (`algo-xxxx.vercel.app`) son otro dominio: si querés probarlas contra el Supabase real, hay que sumarlas ahí.

---

# Cargar comida con foto, voz o texto (`registrar-ia`)

La app tiene un botón "Cargar con IA" en Registrar: sacás una foto del plato, decís lo que comiste o lo escribís, y la función devuelve una lista (`nombre`, `cantidad`, `unidad`, `gramos`). La app la cruza con tus alimentos y recetas y arma el plato; **siempre se revisa antes de anotar**. No se guarda la foto, el audio ni lo dicho: la tabla `ai_usos` solo cuenta cuántos pedidos hizo cada cuenta.

## Pasos para activarla

1. Correr `supabase/actualizacion-20.sql` en el editor SQL (crea `ai_usos`, es aditivo).
2. Cargar al menos un proveedor de **visión** y uno de **voz** como secretos (más abajo).
3. Publicar la función: `supabase functions deploy registrar-ia --project-ref bpxxwmcqidoxgmfyzhpc`.

Mientras no haya claves, la app contesta que la función todavía no está activada y se sigue cargando a mano.

## Proveedores gratis (octubre de 2026)

| Para qué | Proveedor | Secretos | Notas |
| --- | --- | --- | --- |
| Foto y texto (recomendado primero) | Cloudflare Workers AI (`@cf/meta/llama-4-scout-17b-16e-instruct`) | `CF_ACCOUNT_ID`, `CF_API_TOKEN` | Cupo gratis diario (10.000 neuronas). Cloudflare se compromete a no entrenar con los datos. |
| Foto y texto (alternativa) | Google Gemini (`gemini-3.1-flash-lite`) | `GEMINI_API_KEY` | Cupo gratis generoso, **pero en el plan gratis Google puede usar lo enviado para mejorar sus productos**: por eso no es el primero. |
| Foto (opcional) | Groq con modelo de visión | `GROQ_API_KEY`, `GROQ_VISION_MODEL` | Solo si Groq ofrece un modelo de visión vigente. |
| Voz | Groq Whisper (`whisper-large-v3-turbo`) | `GROQ_API_KEY` | Unos 2.000 pedidos por día gratis. Si falla, cae a Whisper de Cloudflare. |

`VISION_ORDEN` (por ejemplo `cloudflare,gemini`) cambia el orden en que se prueban; si uno falla o se queda sin cupo, se pasa al siguiente.

## Otros secretos

| Secreto | Para qué | Por defecto |
| --- | --- | --- |
| `REGISTRO_IA_LIMITE_DIARIO` | Pedidos por cuenta cada 24 horas (foto + voz + texto; tope 200) | `30` |
| `ORIGENES_PERMITIDOS` | Sitios desde los que se acepta el pedido (CORS) | Los de la app |

Los cupos gratis los comparten todas las cuentas: si se llega al tope, la app avisa que la IA está con mucha demanda.

## Qué se manda y a quién

Solo la foto (achicada a 1024 px), el audio (hasta 30 s) o el texto escrito, para reconocer la comida. No se manda nombre, email ni otros datos. Si cambiás de proveedor, actualizá `src/pages/Legal.jsx`, que dice a quién se le mandan.

## Pruebas

Las pruebas de navegador reemplazan la función por una de mentira (acá no corre Deno). La lógica de la función (`logica.ts`) tiene pruebas unitarias; **lo que no se probó nunca es hablar con los proveedores reales**: la primera vez, probá una foto, un audio y un texto desde el teléfono y mirá los registros de la función en el panel de Supabase.

---

# Asistente con IA (`asistente-ia`) y respaldo del análisis semanal (1.28)

El asistente ("Preguntale a la IA", en el Diario y en `/asistente`) responde preguntas como "¿qué ceno con lo que me queda?" con un resumen del día que arma la app (objetivo, lo comido, lo que falta, la despensa y el plan; sin nombre ni email). No guarda la conversación: solo cuenta cada pregunta en `ai_usos` (tipo `chat`) para el tope diario.

## Pasos para activarlo

1. Correr `supabase/actualizacion-21.sql` en el editor SQL (combos, consentimiento, opiniones y el tipo `chat` en `ai_usos`; es aditivo).
2. Cargar el secreto `GEMINI_API_KEY` (gratis en https://aistudio.google.com/apikey → **Create API key**). Si no está, el asistente usa `GROQ_API_KEY`, que ya está cargada.
3. Publicar la función: `supabase functions deploy asistente-ia --project-ref bpxxwmcqidoxgmfyzhpc`.
4. Volver a publicar `analizar-semana` para que tenga el respaldo: `supabase functions deploy analizar-semana --project-ref bpxxwmcqidoxgmfyzhpc`.

## Proveedores

| Función | Primero | Respaldo |
| --- | --- | --- |
| `asistente-ia` | Gemini (`gemini-3.1-flash-lite`) | Groq (`openai/gpt-oss-120b`) |
| `analizar-semana` | Groq | Gemini (solo los gratis: Anthropic nunca entra de respaldo porque se paga) |
| `registrar-ia` | Cloudflare (foto) / Groq (voz y texto) | Gemini si está la clave |

Con `GEMINI_API_KEY` cargada, Gemini también entra de respaldo en la carga con foto (ver arriba). **Ojo:** en el plan gratis, Google puede usar lo que se le manda para mejorar sus productos; la Política de privacidad ya lo dice.

## Secretos opcionales

| Secreto | Para qué | Por defecto |
| --- | --- | --- |
| `CHAT_ORDEN` | Orden de proveedores del asistente | `gemini,groq` |
| `GEMINI_MODEL` | Qué modelo de Gemini usar | `gemini-3.1-flash-lite` |
| `ASISTENTE_LIMITE_DIARIO` | Preguntas por cuenta cada 24 horas (tope 200) | `30` |

## Pruebas

Como con `registrar-ia`, las pruebas de navegador reemplazan la función por una de mentira; la lógica (`logica.ts`, `proveedores.ts`) tiene pruebas unitarias (`pruebas/unidad/novedades-128.test.js` y `analisis.test.js`). Nunca se probó contra Gemini de verdad: la primera vez, hacé un par de preguntas desde el teléfono y mirá los registros de la función.
