// Armar o corregir una rutina de gimnasio: un nombre y una lista de ejercicios con sus series, repeticiones y descanso.
import { useState } from 'react'
import ElegirEjercicio from './ElegirEjercicio'
import { Err, Hoja, Icono, Numero } from './ui'
import { useDatos } from '../store/Datos'
import { nombreDeGrupo } from '../lib/gimnasio'
import { errNumero } from '../lib/validar'

const LIM_SERIES = [1, 20]
const LIM_REPS = [1, 100]
const LIM_DESCANSO = [0, 1200]
const MAX_EJERCICIOS = 40
const texto = (v) => (v === null || v === undefined ? '' : String(v))

function errorDeFila(f) {
  const series = errNumero(f.sets_target, LIM_SERIES, { entero: true })
  const min = errNumero(f.reps_min, LIM_REPS, { entero: true })
  const max = errNumero(f.reps_max, LIM_REPS, { entero: true })
  const rango = !min && !max && Number(f.reps_min) > Number(f.reps_max) ? 'Las repeticiones mínimas no pueden superar a las máximas.' : null
  const descanso = errNumero(f.rest_seconds, LIM_DESCANSO, { opcional: true, entero: true })
  return { series, min, max, rango, descanso, hay: !!(series || min || max || rango || descanso) }
}

export default function RutinaForm({ rutina = null, onCerrar }) {
  const d = useDatos()
  const ejerciciosPorId = new Map(d.ejerciciosGym.map((e) => [e.id, e]))
  const [nombre, setNombre] = useState(rutina?.name || '')
  const [notas, setNotas] = useState(rutina?.notes || '')
  const [filas, setFilas] = useState(() =>
    rutina
      ? d.rutinaItems
          .filter((i) => i.routine_id === rutina.id)
          .sort((a, b) => a.position - b.position)
          .map((i) => ({
            clave: `${i.routine_id}-${i.position}`,
            exercise_id: i.exercise_id,
            sets_target: texto(i.sets_target),
            reps_min: texto(i.reps_min),
            reps_max: texto(i.reps_max),
            rest_seconds: texto(i.rest_seconds),
          }))
      : [],
  )
  const [agregando, setAgregando] = useState(false)
  const [intento, setIntento] = useState(false)
  const [guardando, setGuardando] = useState(false)

  const errNombre = !nombre.trim() ? 'Ponele un nombre a la rutina.' : nombre.trim().length > 40 ? 'Como mucho 40 letras.' : null
  const errFilas = filas.map(errorDeFila)
  const hayError = !!errNombre || filas.length === 0 || errFilas.some((e) => e.hay)

  const cambiar = (clave, campo) => (valor) => setFilas((l) => l.map((f) => (f.clave === clave ? { ...f, [campo]: valor } : f)))
  const mover = (i, delta) =>
    setFilas((l) => {
      const j = i + delta
      if (j < 0 || j >= l.length) return l
      const n = [...l]
      ;[n[i], n[j]] = [n[j], n[i]]
      return n
    })

  function agregar(ej) {
    if (filas.length >= MAX_EJERCICIOS) return d.avisar(`Una rutina puede tener hasta ${MAX_EJERCICIOS} ejercicios.`, 'error')
    setFilas((l) => [
      ...l,
      { clave: `n-${Date.now()}-${l.length}`, exercise_id: ej.id, sets_target: '3', reps_min: '8', reps_max: '12', rest_seconds: '90' },
    ])
    setAgregando(false)
  }

  async function guardar() {
    setIntento(true)
    if (hayError) return
    setGuardando(true)
    const r = await d.guardarRutina({
      id: rutina?.id,
      nombre: nombre.trim(),
      notas: notas.trim() || null,
      ejercicios: filas.map((f) => ({
        exercise_id: f.exercise_id,
        sets_target: Number(f.sets_target),
        reps_min: Number(f.reps_min),
        reps_max: Number(f.reps_max),
        rest_seconds: f.rest_seconds === '' ? null : Number(f.rest_seconds),
      })),
    })
    setGuardando(false)
    if (r) {
      d.avisar(rutina ? 'Rutina guardada' : 'Rutina creada')
      onCerrar()
    }
  }

  if (agregando)
    return (
      <Hoja titulo="Agregar ejercicio" onCerrar={() => setAgregando(false)}>
        <ElegirEjercicio onElegir={agregar} ocultos={filas.map((f) => f.exercise_id)} />
      </Hoja>
    )

  return (
    <Hoja titulo={rutina ? 'Editar rutina' : 'Nueva rutina'} onCerrar={onCerrar}>
      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium">Nombre</span>
          <input
            value={nombre}
            onChange={(ev) => setNombre(ev.target.value)}
            maxLength={40}
            className={`campo ${intento && errNombre ? '!border-rojo-texto' : ''}`}
            placeholder="Por ejemplo, Empuje"
          />
          <Err>{intento && errNombre}</Err>
        </label>
        <label className="block">
          <span className="text-sm font-medium">Notas (opcional)</span>
          <input value={notas} onChange={(ev) => setNotas(ev.target.value)} maxLength={200} className="campo" />
        </label>

        <div>
          <p className="text-sm font-medium mb-2">Ejercicios</p>
          {filas.length === 0 && <p className="text-sm text-gris mb-2">Todavía no agregaste ninguno.</p>}
          {filas.map((f, i) => {
            const ej = ejerciciosPorId.get(f.exercise_id)
            const e = errFilas[i]
            return (
              <div key={f.clave} className="rounded-2xl bg-campo p-3 mb-2">
                <div className="flex items-center gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{ej?.name || 'Ejercicio'}</p>
                    <p className="text-xs text-gris">{ej ? nombreDeGrupo(ej.grupo) : ''}</p>
                  </div>
                  <button
                    onClick={() => mover(i, -1)}
                    disabled={i === 0}
                    className="btn-chico bg-superficie text-tinta disabled:opacity-30"
                    aria-label="Subir"
                  >
                    <Icono n="keyboard_arrow_down" size={18} className="rotate-180" />
                  </button>
                  <button
                    onClick={() => mover(i, 1)}
                    disabled={i === filas.length - 1}
                    className="btn-chico bg-superficie text-tinta disabled:opacity-30"
                    aria-label="Bajar"
                  >
                    <Icono n="keyboard_arrow_down" size={18} />
                  </button>
                  <button
                    onClick={() => setFilas((l) => l.filter((x) => x.clave !== f.clave))}
                    className="btn-chico bg-superficie text-tinta"
                    aria-label={`Quitar ${ej?.name || 'ejercicio'}`}
                  >
                    <Icono n="delete" size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {[
                    ['sets_target', 'Series', 2, e.series],
                    ['reps_min', 'Reps desde', 3, e.min],
                    ['reps_max', 'Reps hasta', 3, e.max],
                    ['rest_seconds', 'Descanso (s)', 4, e.descanso],
                  ].map(([campo, rotulo, largo, error]) => (
                    <label key={campo} className="block">
                      <span className="text-[11px] text-gris">{rotulo}</span>
                      <Numero
                        valor={f[campo]}
                        onChange={cambiar(f.clave, campo)}
                        decimales={0}
                        largo={largo}
                        error={!!error}
                        className="campo !h-9 !px-2 text-center"
                      />
                    </label>
                  ))}
                </div>
                <Err>{e.series || e.min || e.max || e.rango || e.descanso}</Err>
              </div>
            )
          })}
          <button onClick={() => setAgregando(true)} className="btn w-full bg-verde-suave text-verde-texto">
            <Icono n="add" size={18} /> Agregar ejercicio
          </button>
          {intento && filas.length === 0 && <Err>Agregá al menos un ejercicio.</Err>}
        </div>

        <button onClick={guardar} disabled={guardando} className="btn w-full bg-verde text-white disabled:opacity-60">
          {guardando ? 'Guardando...' : 'Guardar rutina'}
        </button>
      </div>
    </Hoja>
  )
}
