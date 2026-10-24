// La casilla del consentimiento de los datos de salud (1.28, L-04). La Ley 25.326 trata como sensibles los datos de salud
// (peso, altura, lo que comés, la grasa corporal) y pide un consentimiento expreso: por eso es una casilla aparte y no solo
// el texto debajo del botón.
import { Err } from './ui'

export const TEXTO_CONSENTIMIENTO =
  'Acepto que Tupper guarde y use mis datos de salud (peso, altura, medidas, lo que como y mi actividad) para calcular mis objetivos y mostrarme mi progreso.'

export default function CasillaSalud({ acepto, onCambiar, error = false }) {
  return (
    <div className="rounded-2xl border border-linea p-3">
      <label className="flex items-start gap-3 text-sm leading-snug" htmlFor="pf-consentimiento">
        <input
          id="pf-consentimiento"
          type="checkbox"
          checked={acepto}
          onChange={(e) => onCambiar(e.target.checked)}
          className="w-5 h-5 mt-0.5 shrink-0 accent-verde"
          aria-describedby="pf-consentimiento-detalle"
          aria-invalid={error || undefined}
        />
        <span>{TEXTO_CONSENTIMIENTO}</span>
      </label>
      <p id="pf-consentimiento-detalle" className="text-xs text-gris mt-2 ml-8">
        No se comparten con nadie para publicidad. Podés descargarlos o borrar tu cuenta cuando quieras. Más detalle en la{' '}
        <a href="/privacidad" target="_blank" rel="noreferrer" className="underline">
          Política de privacidad
        </a>
        .
      </p>
      {error && (
        <div className="ml-8">
          <Err>Para usar la app necesitamos que lo aceptes.</Err>
        </div>
      )}
    </div>
  )
}
