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

## Qué se manda

Sexo, edad, altura, peso, objetivos, totales de cada día, los alimentos registrados y las medidas de peso. No se manda el nombre ni el email.

## Volver a publicarla

Si cambiás el código, con la CLI de Supabase:

```bash
supabase functions deploy analizar-semana --project-ref bpxxwmcqidoxgmfyzhpc
```

Los registros de cada llamada se ven en **Edge Functions > analizar-semana > Logs**.
