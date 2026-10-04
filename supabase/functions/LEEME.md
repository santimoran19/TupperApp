# Análisis semanal con IA

La función `analizar-semana` arma el resumen de la semana del usuario, se lo pasa a un modelo de Claude y guarda la devolución en la tabla `ai_analyses`. La clave de la API vive solo en Supabase: nunca llega al navegador.

La función ya está publicada en el proyecto. Para que funcione falta un solo paso.

## Activarla

1. Creá una cuenta en https://console.anthropic.com, cargá crédito y generá una API key.
2. En el panel de Supabase: **Edge Functions > Secrets**. Agregá un secreto con nombre `ANTHROPIC_API_KEY` y la clave como valor.

Mientras no esté ese secreto, el botón "Analizar mi semana" responde que el análisis todavía no está activado y no se gasta nada.

## Ajustes opcionales (también como secretos)

| Secreto | Para qué | Valor por defecto |
| --- | --- | --- |
| `ANTHROPIC_MODEL` | Qué modelo usar | `claude-haiku-4-5-20251001` (el más barato) |
| `IA_LIMITE_DIARIO` | Cuántos análisis puede pedir cada usuario cada 24 horas | `3` |

## Costo

Se paga por uso a Anthropic. Cada análisis manda unos 1.500 a 2.500 tokens y recibe unos 500. Con Haiku 4.5 (1 dólar el millón de tokens de entrada y 5 el de salida) eso es alrededor de medio centavo de dólar por análisis. Precios actualizados: https://platform.claude.com/docs/en/models/overview

## Qué se manda

Sexo, edad, altura, peso, objetivos, totales de cada día, los alimentos registrados y las medidas de peso. No se manda el nombre ni el email.

## Volver a publicarla

Si cambiás el código, con la CLI de Supabase:

```bash
supabase functions deploy analizar-semana --project-ref bpxxwmcqidoxgmfyzhpc
```

Los registros de cada llamada se ven en **Edge Functions > analizar-semana > Logs**.
