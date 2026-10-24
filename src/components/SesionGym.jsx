// Una sesión de gimnasio (F-19, fase 3): ejercicios con sus series, lo que hiciste la vez anterior, descanso entre series,
// récords y el cierre con las calorías estimadas. Lo que se carga queda de borrador en el teléfono hasta guardar o descartar.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ElegirEjercicio from './ElegirEjercicio'
import GraficoProgreso from './GraficoProgreso'
import { Chip, Err, Hoja, Icono, Numero } from './ui'
import { useDatos } from '../store/Datos'
import { nuevaClave } from '../store/listas'
import { borrarBorrador, guardarBorrador } from '../lib/borradorEntreno'
import { ESFUERZOS, METODOS, calcularEntrenamiento } from '../lib/ejercicio'
import { fechaCorta, hoy } from '../lib/fechas'
import { pesoDelDia } from '../lib/gasto'
import {
  cuenta,
  errorDeSerie,
  esfuerzoSugerido,
  nombreDeGrupo,
  progresoDeEjercicio,
  recordsDeSerie,
  resumenDeSesion,
  seriesParaGuardar,
  textoDeSerie,
  ultimaVez,
  volumenPorGrupo,
} from '../lib/gimnasio'

const DESCANSO_POR_DEFECTO = 90
const miles = (n) => Math.round(n).toLocaleString('es-AR')
const texto = (v) => (v === null || v === undefined ? '' : String(Number(v)))
const serieVacia = (extra = {}) => ({ clave: nuevaClave(), reps: '', weight_kg: '', rpe: '', warmup: false, hecha: false, ...extra })
const mmss = (seg) => `${Math.floor(seg / 60)}:${String(seg % 60).padStart(2, '0')}`
const textoDescartar = (editando) =>
  editando
    ? 'Se descartan los cambios que hiciste. La sesión guardada queda como estaba.'
    : 'Se pierde todo lo que cargaste en esta sesión.'
const ETIQUETA_RECORD = { peso: 'más peso', unRm: 'fuerza estimada', reps: 'más repeticiones' }

// Las series de una sesión que ya se guardó, para corregirla
function sesionDesdeGuardada(series, workoutId) {
  const porEjercicio = new Map()
  for (const s of series.filter((x) => x.workout_id === workoutId).sort((a, b) => a.orden - b.orden || a.set_no - b.set_no)) {
    if (!porEjercicio.has(s.orden))
      porEjercicio.set(s.orden, { clave: nuevaClave(), exercise_id: s.exercise_id, descanso: null, series: [] })
    porEjercicio.get(s.orden).series.push(
      serieVacia({
        reps: texto(s.reps),
        weight_kg: Number(s.weight_kg) > 0 ? texto(s.weight_kg) : '',
        rpe: s.rpe == null ? '' : texto(s.rpe),
        warmup: s.warmup,
        hecha: true,
      }),
    )
  }
  return [...porEjercicio.values()]
}

// ---------- Un ejercicio dentro de la sesión ----------
function BloqueEjercicio({ ej, ejercicio, previa, records, onCambiar, onQuitar, onHecha, puntos }) {
  const [verProgreso, setVerProgreso] = useState(false)
  const set = (clave, campo) => (valor) =>
    onCambiar({ ...ej, series: ej.series.map((s) => (s.clave === clave ? { ...s, [campo]: valor } : s)) })
  const copiar = () => {
    if (!previa) return
    onCambiar({
      ...ej,
      series: previa.series.map((s) =>
        serieVacia({
          reps: texto(s.reps),
          weight_kg: Number(s.weight_kg) > 0 ? texto(s.weight_kg) : '',
          rpe: s.rpe == null ? '' : texto(s.rpe),
          warmup: s.warmup,
        }),
      ),
    })
  }
  const agregarSerie = () => {
    const ultima = [...ej.series].reverse().find((s) => !s.warmup) || ej.series[ej.series.length - 1]
    onCambiar({ ...ej, series: [...ej.series, serieVacia(ultima ? { reps: ultima.reps, weight_kg: ultima.weight_kg } : {})] })
  }
  const quitarSerie = (clave) => onCambiar({ ...ej, series: ej.series.filter((s) => s.clave !== clave) })
  let numeroDeTrabajo = 0

  return (
    <section className="tarjeta p-4 mb-3">
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-semibold leading-snug">{ejercicio?.name || 'Ejercicio'}</p>
          <p className="text-xs text-gris">{ejercicio ? nombreDeGrupo(ejercicio.grupo) : ''}</p>
        </div>
        <button
          onClick={() => setVerProgreso((v) => !v)}
          className="btn-chico bg-campo text-tinta"
          aria-expanded={verProgreso}
          aria-label="Ver mi progreso"
        >
          <Icono n="show_chart" size={16} />
        </button>
        <button
          onClick={onQuitar}
          className="btn-chico bg-campo text-tinta"
          aria-label={`Quitar ${ejercicio?.name || 'el ejercicio'} de la sesión`}
        >
          <Icono n="delete" size={16} />
        </button>
      </div>

      {previa ? (
        <div className="mt-2 rounded-xl bg-campo px-3 py-2">
          <p className="text-xs text-gris">
            <b>La última vez</b> ({fechaCorta(previa.workout.fecha)}):{' '}
            {previa.series
              .filter(cuenta)
              .map((s) => textoDeSerie(s))
              .join(' · ')}
          </p>
          <button onClick={copiar} className="text-xs font-semibold text-verde-texto mt-1">
            Copiar esas series
          </button>
        </div>
      ) : (
        <p className="text-xs text-gris mt-2">Es la primera vez que lo hacés: tus marcas arrancan desde acá.</p>
      )}

      {verProgreso && (
        <div className="mt-3">
          <p className="text-xs font-semibold text-gris mb-1">Tu fuerza estimada, sesión por sesión</p>
          <GraficoProgreso puntos={puntos} />
        </div>
      )}

      <div className="mt-3 space-y-2">
        <div className="grid grid-cols-[2rem_1fr_1fr_3.5rem_2.5rem] gap-2 text-[11px] font-semibold text-gris px-0.5">
          <span>Serie</span>
          <span>Kg</span>
          <span>Reps</span>
          <span>RPE</span>
          <span />
        </div>
        {ej.series.map((s) => {
          if (!s.warmup) numeroDeTrabajo += 1
          const rotos = records.get(s.clave) || []
          return (
            <div key={s.clave}>
              <div
                className={`grid grid-cols-[2rem_1fr_1fr_3.5rem_2.5rem] gap-2 items-center ${s.hecha ? 'bg-verde-claro rounded-xl' : ''}`}
              >
                <button
                  onClick={() => set(s.clave, 'warmup')(!s.warmup)}
                  className={`h-9 rounded-lg text-xs font-bold ${s.warmup ? 'bg-naranja-suave text-naranja-oscuro' : 'bg-campo text-gris'}`}
                  aria-pressed={s.warmup}
                  aria-label={
                    s.warmup
                      ? 'Entrada en calor (tocá para que cuente como serie)'
                      : 'Serie de trabajo (tocá para marcarla como entrada en calor)'
                  }
                  title="Tocá para marcarla como entrada en calor"
                >
                  {s.warmup ? 'EC' : numeroDeTrabajo}
                </button>
                <Numero
                  valor={s.weight_kg}
                  onChange={set(s.clave, 'weight_kg')}
                  decimales={2}
                  largo={7}
                  className="campo !h-9 !px-2 text-center"
                  placeholder={previa ? '' : 'kg'}
                  aria-label="Peso en kilos"
                  disabled={s.hecha}
                />
                <Numero
                  valor={s.reps}
                  onChange={set(s.clave, 'reps')}
                  decimales={0}
                  largo={3}
                  className="campo !h-9 !px-2 text-center"
                  placeholder="reps"
                  aria-label="Repeticiones"
                  disabled={s.hecha}
                />
                <Numero
                  valor={s.rpe}
                  onChange={set(s.clave, 'rpe')}
                  decimales={1}
                  largo={3}
                  className="campo !h-9 !px-1 text-center"
                  placeholder="1-10"
                  aria-label="Esfuerzo de 1 a 10"
                  disabled={s.hecha}
                />
                <button
                  onClick={() => onHecha(ej, s)}
                  className={`h-9 rounded-lg flex items-center justify-center ${s.hecha ? 'bg-verde text-white' : 'bg-campo text-gris'}`}
                  aria-pressed={s.hecha}
                  aria-label={s.hecha ? 'Serie hecha (tocá para corregirla)' : 'Marcar serie como hecha'}
                >
                  <Icono n="check" size={20} />
                </button>
              </div>
              {rotos.length > 0 && (
                <p className="text-xs font-semibold text-naranja-oscuro flex items-center gap-1 mt-1 pl-9">
                  <Icono n="trophy" size={14} lleno /> ¡Récord! ({rotos.map((r) => ETIQUETA_RECORD[r]).join(', ')})
                </p>
              )}
            </div>
          )
        })}
      </div>
      <div className="flex gap-2 mt-3">
        <button onClick={agregarSerie} className="btn-chico bg-verde-suave text-verde-texto flex-1 justify-center">
          <Icono n="add" size={16} /> Agregar serie
        </button>
        {ej.series.length > 1 && (
          <button onClick={() => quitarSerie(ej.series[ej.series.length - 1].clave)} className="btn-chico bg-campo text-tinta">
            Quitar la última
          </button>
        )}
      </div>
    </section>
  )
}

// ---------- Descanso ----------
function BarraDescanso({ descanso, ahora, onSumar, onSaltar }) {
  const faltan = Math.max(0, Math.ceil((descanso.fin - ahora) / 1000))
  return (
    <div
      className="sticky bottom-0 -mx-1 mt-3 rounded-2xl bg-tinta text-fondo px-4 py-3 flex items-center gap-3 shadow-flotante"
      role="timer"
      aria-live="off"
    >
      <Icono n="timer" size={22} />
      <div className="flex-1">
        <p className="text-xs">Descanso</p>
        <p className="text-xl font-bold leading-none tabular-nums">{faltan > 0 ? mmss(faltan) : '¡Listo!'}</p>
      </div>
      <button onClick={() => onSumar(15)} className="btn-chico bg-white/20 text-fondo">
        +15 s
      </button>
      <button onClick={onSaltar} className="btn-chico bg-white/20 text-fondo">
        {faltan > 0 ? 'Saltar' : 'Cerrar'}
      </button>
    </div>
  )
}

// ---------- Pantalla de la sesión ----------
export default function SesionGym({ onCerrar, rutinaId = null, borrador = null, editar = null, fecha: fechaInicial = null }) {
  const d = useDatos()
  const uid = d.usuario.id
  const ejerciciosPorId = useMemo(() => new Map(d.ejerciciosGym.map((e) => [e.id, e])), [d.ejerciciosGym])
  const pesas = useMemo(
    () => d.actividades.find((a) => a.slug === 'pesas') || d.actividades.find((a) => a.category === 'fuerza') || null,
    [d.actividades],
  )
  const rutina = rutinaId ? d.rutinas.find((r) => r.id === rutinaId) : null

  // El estado de arranque: un borrador, una sesión guardada para corregir, una rutina o una sesión vacía
  const [inicial] = useState(() => {
    if (borrador)
      return {
        sesion: borrador.sesion,
        meta: {
          fecha: borrador.fecha,
          inicio: borrador.inicio,
          rutina: borrador.rutina,
          nombre: borrador.nombre,
          editando: borrador.editando,
          notas: borrador.notas,
        },
      }
    if (editar)
      return {
        sesion: sesionDesdeGuardada(d.series, editar.id),
        meta: {
          fecha: editar.fecha,
          inicio: Date.now(),
          rutina: editar.routine_id,
          nombre: editar.name,
          editando: editar.id,
          notas: editar.notes || '',
        },
      }
    const items = rutinaId ? d.rutinaItems.filter((i) => i.routine_id === rutinaId).sort((a, b) => a.position - b.position) : []
    const sesion = items.map((it) => {
      const previa = ultimaVez(d.series, d.entrenamientos, it.exercise_id)
      const deTrabajo = previa ? previa.series.filter(cuenta) : []
      const series = Array.from({ length: it.sets_target }, (_, i) => {
        const base = deTrabajo[Math.min(i, deTrabajo.length - 1)]
        return serieVacia(base ? { reps: texto(base.reps), weight_kg: Number(base.weight_kg) > 0 ? texto(base.weight_kg) : '' } : {})
      })
      return { clave: nuevaClave(), exercise_id: it.exercise_id, descanso: it.rest_seconds, series }
    })
    return {
      sesion,
      meta: { fecha: fechaInicial || hoy(), inicio: Date.now(), rutina: rutinaId, nombre: rutina?.name || '', editando: null, notas: '' },
    }
  })
  const [sesion, setSesion] = useState(inicial.sesion)
  const [meta, setMeta] = useState(inicial.meta)
  const [vista, setVista] = useState(inicial.sesion.length === 0 ? 'agregar' : 'sesion')
  const [descanso, setDescanso] = useState(null)
  const [ahora, setAhora] = useState(() => Date.now())
  const idSesion = useRef(inicial.meta.editando || nuevaClave())

  // Borrador en el teléfono: se guarda en cada cambio (es chico). Con una espera, cerrar la app justo después de tocar algo
  // perdería ese último cambio. Corregir una sesión ya guardada no pisa el borrador de otra sesión que haya quedado a medias.
  useEffect(() => {
    if (!editar) guardarBorrador(uid, { ...meta, sesion })
  }, [uid, meta, sesion, editar])

  // Reloj del descanso: solo corre mientras hay un descanso en marcha
  useEffect(() => {
    if (!descanso) return undefined
    const t = setInterval(() => setAhora(Date.now()), 500)
    return () => clearInterval(t)
  }, [descanso])
  const terminoDescanso = descanso && ahora >= descanso.fin
  const avisado = useRef(null)
  useEffect(() => {
    if (!terminoDescanso || avisado.current === descanso.fin) return
    avisado.current = descanso.fin
    try {
      navigator.vibrate?.([200, 100, 200])
    } catch {
      // el aparato no vibra
    }
  }, [terminoDescanso, descanso])

  // Lo que se hizo antes de cada ejercicio (sin contar esta sesión)
  const historia = useMemo(() => {
    const m = new Map()
    for (const s of d.series) {
      if (s.workout_id === idSesion.current) continue
      if (!m.has(s.exercise_id)) m.set(s.exercise_id, [])
      m.get(s.exercise_id).push(s)
    }
    return m
  }, [d.series])
  const previas = useMemo(() => {
    const m = new Map()
    for (const ej of sesion) m.set(ej.exercise_id, ultimaVez(d.series, d.entrenamientos, ej.exercise_id, { excluir: idSesion.current }))
    return m
  }, [sesion, d.series, d.entrenamientos])

  // Récords: cada serie hecha contra la historia del ejercicio y contra las series hechas antes en esta misma sesión
  const records = useMemo(() => {
    const m = new Map()
    for (const ej of sesion) {
      const previasDelEjercicio = [...(historia.get(ej.exercise_id) || [])]
      for (const s of ej.series) {
        if (!s.hecha) continue
        const serie = { reps: s.reps, weight_kg: s.weight_kg, warmup: s.warmup }
        const rotos = recordsDeSerie(serie, previasDelEjercicio)
        if (rotos.length > 0) m.set(s.clave, rotos)
        previasDelEjercicio.push(serie)
      }
    }
    return m
  }, [sesion, historia])

  const cambiarEjercicio = useCallback((nuevo) => setSesion((l) => l.map((e) => (e.clave === nuevo.clave ? nuevo : e))), [])

  function marcarHecha(ej, s) {
    if (s.hecha) {
      cambiarEjercicio({ ...ej, series: ej.series.map((x) => (x.clave === s.clave ? { ...x, hecha: false } : x)) })
      return
    }
    const error = errorDeSerie(s)
    if (error) return d.avisar(error, 'error')
    cambiarEjercicio({ ...ej, series: ej.series.map((x) => (x.clave === s.clave ? { ...x, hecha: true } : x)) })
    const seg = ej.descanso || DESCANSO_POR_DEFECTO
    setAhora(Date.now())
    setDescanso({ fin: Date.now() + seg * 1000 })
  }

  async function quitarEjercicio(ej) {
    const conDatos = ej.series.some((s) => s.hecha)
    if (conDatos) {
      const seguir = await d.confirmar({
        titulo: '¿Quitar el ejercicio?',
        texto: 'Se pierden las series que cargaste en esta sesión.',
        boton: 'Quitar',
      })
      if (!seguir) return
    }
    setSesion((l) => l.filter((e) => e.clave !== ej.clave))
  }

  function agregar(ejercicio) {
    const previa = ultimaVez(d.series, d.entrenamientos, ejercicio.id, { excluir: idSesion.current })
    const deTrabajo = previa ? previa.series.filter(cuenta) : []
    const cantidad = Math.max(3, Math.min(deTrabajo.length, 8))
    const series = Array.from({ length: cantidad }, (_, i) => {
      const base = deTrabajo[Math.min(i, deTrabajo.length - 1)]
      return serieVacia(base ? { reps: texto(base.reps), weight_kg: Number(base.weight_kg) > 0 ? texto(base.weight_kg) : '' } : {})
    })
    setSesion((l) => [...l, { clave: nuevaClave(), exercise_id: ejercicio.id, descanso: null, series }])
    setVista('sesion')
  }

  // Salir no pierde nada: la sesión queda de borrador en el teléfono. Descartar es una decisión aparte. Si no se hizo ninguna
  // serie (se abrió por error), no queda nada para retomar.
  function cerrar() {
    if (!editar && !sesion.some((e) => e.series.some((x) => x.hecha))) borrarBorrador(uid)
    onCerrar()
  }

  async function descartar() {
    const seguir = await d.confirmar({
      titulo: '¿Descartar la sesión?',
      texto: textoDescartar(meta.editando),
      boton: 'Descartar',
    })
    if (!seguir) return
    if (!editar) borrarBorrador(uid)
    onCerrar()
  }

  const seriesHechas = useMemo(
    () =>
      sesion.flatMap((ej, i) =>
        ej.series
          .filter((s) => s.hecha)
          .map((s) => ({
            exercise_id: ej.exercise_id,
            reps: s.reps,
            weight_kg: s.weight_kg,
            rpe: s.rpe,
            warmup: s.warmup,
            orden: i,
            fecha: meta.fecha,
          })),
      ),
    [sesion, meta.fecha],
  )

  return (
    <Hoja
      titulo={vista === 'agregar' ? 'Agregar ejercicio' : vista === 'terminar' ? 'Terminar sesión' : meta.nombre || 'Sesión de gimnasio'}
      onCerrar={cerrar}
    >
      {vista === 'agregar' && (
        <>
          <ElegirEjercicio onElegir={agregar} ocultos={sesion.map((e) => e.exercise_id)} />
          {sesion.length > 0 && (
            <button onClick={() => setVista('sesion')} className="btn w-full bg-campo text-tinta mt-3">
              Volver a la sesión
            </button>
          )}
        </>
      )}

      {vista === 'sesion' && (
        <>
          <p className="text-xs text-gris mb-3">
            Marcá cada serie con el tilde cuando la hagas. Tocá el número de serie para que sea de entrada en calor (EC): no cuenta para el
            volumen ni para los récords. Si salís, la sesión queda guardada en este teléfono.
          </p>
          {sesion.map((ej) => (
            <BloqueEjercicio
              key={ej.clave}
              ej={ej}
              ejercicio={ejerciciosPorId.get(ej.exercise_id)}
              previa={previas.get(ej.exercise_id)}
              records={records}
              puntos={progresoDeEjercicio(
                [...(historia.get(ej.exercise_id) || []), ...seriesHechas.filter((s) => s.exercise_id === ej.exercise_id)],
                ej.exercise_id,
              )}
              onCambiar={cambiarEjercicio}
              onQuitar={() => quitarEjercicio(ej)}
              onHecha={marcarHecha}
            />
          ))}
          <button onClick={() => setVista('agregar')} className="btn w-full bg-verde-suave text-verde-texto mb-2">
            <Icono n="add" size={18} /> Agregar ejercicio
          </button>
          <button
            onClick={() => setVista('terminar')}
            disabled={seriesHechas.filter(cuenta).length === 0}
            className="btn w-full bg-verde text-white disabled:opacity-50"
          >
            Terminar sesión
          </button>
          <button onClick={descartar} className="btn w-full bg-campo text-tinta mt-2">
            Descartar la sesión
          </button>
          {descanso && (
            <BarraDescanso
              descanso={descanso}
              ahora={ahora}
              onSumar={(s) => setDescanso((x) => ({ fin: x.fin + s * 1000 }))}
              onSaltar={() => setDescanso(null)}
            />
          )}
        </>
      )}

      {vista === 'terminar' && (
        <Terminar
          idSesion={idSesion.current}
          meta={meta}
          setMeta={setMeta}
          sesion={sesion}
          seriesHechas={seriesHechas}
          ejerciciosPorId={ejerciciosPorId}
          pesas={pesas}
          records={records}
          editando={!!editar}
          duracionGuardada={editar?.duration_min}
          onVolver={() => setVista('sesion')}
          onListo={onCerrar}
        />
      )}
    </Hoja>
  )
}

// ---------- Cierre ----------
function Terminar({
  idSesion,
  meta,
  setMeta,
  sesion,
  seriesHechas,
  ejerciciosPorId,
  pesas,
  records,
  editando,
  duracionGuardada,
  onVolver,
  onListo,
}) {
  const d = useDatos()
  const uid = d.usuario.id
  const [minutos, setMinutos] = useState(() =>
    String(duracionGuardada || Math.min(1440, Math.max(1, Math.round((Date.now() - meta.inicio) / 60000)))),
  )
  const sugerido = esfuerzoSugerido(seriesHechas)
  const [esfuerzo, setEsfuerzo] = useState(sugerido == null ? 5 : sugerido <= 3 ? 2 : sugerido <= 6 ? 5 : 8)
  const [guardando, setGuardando] = useState(false)
  const base = d.gastoDe(meta.fecha).base
  const peso = pesoDelDia(d.perfil, d.medidas, meta.fecha)

  const resumen = resumenDeSesion(seriesHechas)
  const porGrupo = volumenPorGrupo(seriesHechas, ejerciciosPorId)
  const errMinutos =
    Number.isInteger(Number(minutos)) && Number(minutos) >= 1 && Number(minutos) <= 1440 ? null : 'La duración va de 1 a 1.440 minutos.'
  const calculo =
    !pesas || !base || errMinutos
      ? null
      : calcularEntrenamiento(pesas, { minutos, esfuerzo }, { peso, edad: base.edad, sexo: base.sexo, tmb: base.tmb })
  const cantidadRecords = records.size

  async function guardar() {
    if (errMinutos || !pesas || !calculo || calculo.error) return
    setGuardando(true)
    const listo = await d.guardarEntrenamiento({
      id: idSesion,
      fecha: meta.fecha,
      tipo: pesas,
      nombre: meta.nombre.trim() || 'Pesas',
      minutos,
      esfuerzo,
      notas: meta.notas,
      rutina: meta.rutina,
      series: seriesParaGuardar(sesion.map((ej) => ({ exercise_id: ej.exercise_id, series: ej.series }))),
    })
    setGuardando(false)
    if (listo === false) return
    if (!editando) borrarBorrador(uid)
    d.avisar(
      cantidadRecords > 0
        ? `Sesión guardada · ${cantidadRecords} ${cantidadRecords === 1 ? 'récord' : 'récords'}`
        : editando
          ? 'Sesión corregida'
          : 'Sesión guardada',
    )
    onListo()
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-2xl bg-campo p-3">
          <p className="text-xs text-gris">Ejercicios</p>
          <p className="text-lg font-bold">{resumen.ejercicios}</p>
        </div>
        <div className="rounded-2xl bg-campo p-3">
          <p className="text-xs text-gris">Series</p>
          <p className="text-lg font-bold">{resumen.series}</p>
        </div>
        <div className="rounded-2xl bg-campo p-3">
          <p className="text-xs text-gris">Kilos movidos</p>
          <p className="text-lg font-bold">{miles(resumen.volumen)}</p>
        </div>
      </div>

      {porGrupo.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-1.5">Lo que trabajaste</p>
          <div className="space-y-1.5">
            {porGrupo.map((g) => (
              <div key={g.grupo} className="flex items-center gap-2 text-sm">
                <span className="w-32 shrink-0">{nombreDeGrupo(g.grupo)}</span>
                <div className="flex-1 h-2 rounded-full bg-pista overflow-hidden">
                  <div className="h-full bg-verde rounded-full" style={{ width: `${(g.series / porGrupo[0].series) * 100}%` }} />
                </div>
                <span className="w-16 text-right text-gris">
                  {g.series} {g.series === 1 ? 'serie' : 'series'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {cantidadRecords > 0 && (
        <p className="text-sm font-semibold text-naranja-oscuro flex items-center gap-1.5">
          <Icono n="trophy" size={18} lleno /> {cantidadRecords} {cantidadRecords === 1 ? 'récord personal' : 'récords personales'} en esta
          sesión
        </p>
      )}

      <label className="block">
        <span className="text-sm font-medium">Nombre de la sesión</span>
        <input
          value={meta.nombre}
          onChange={(ev) => setMeta((m) => ({ ...m, nombre: ev.target.value }))}
          maxLength={60}
          className="campo"
          placeholder="Pesas"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Cuánto duró (minutos)</span>
        <Numero valor={minutos} onChange={setMinutos} decimales={0} largo={4} error={!!errMinutos} />
        <Err>{errMinutos}</Err>
      </label>

      <div>
        <p className="text-sm font-medium mb-1.5">Esfuerzo de la sesión</p>
        <div className="flex gap-2">
          {ESFUERZOS.map((e) => (
            <Chip key={e.valor} activo={esfuerzo === e.valor} onClick={() => setEsfuerzo(e.valor)}>
              {e.texto}
            </Chip>
          ))}
        </div>
        <p className="text-xs text-gris mt-1.5">{ESFUERZOS.find((e) => e.valor === esfuerzo)?.ayuda}</p>
      </div>

      <label className="block">
        <span className="text-sm font-medium">Notas (opcional)</span>
        <textarea
          value={meta.notas}
          onChange={(ev) => setMeta((m) => ({ ...m, notas: ev.target.value }))}
          rows={2}
          maxLength={300}
          className="campo"
        />
      </label>

      {calculo && !calculo.error && (
        <div className="rounded-2xl bg-verde-claro p-4">
          <p className="text-xs font-semibold text-gris">Gastaste aproximadamente</p>
          <p className="text-2xl font-bold text-verde-texto">
            {miles(calculo.kcal)} <span className="text-sm">kcal</span>
          </p>
          <p className="text-xs text-gris mt-0.5">
            Entre {miles(calculo.rango[0])} y {miles(calculo.rango[1])} · método: {METODOS[calculo.metodo].texto.toLowerCase()}
          </p>
          <p className="text-xs text-gris mt-1">
            Las pesas son lo más difícil de estimar: el margen es grande. Son calorías netas (sin lo que gastás en reposo).
          </p>
        </div>
      )}
      {calculo?.error && <Err>{calculo.error}</Err>}
      {!base && <Err>Para calcular las calorías hace falta tu perfil completo.</Err>}
      {!pesas && <Err>No se encontró la actividad “Pesas”. Corré supabase/seed-6.sql.</Err>}

      <button
        onClick={guardar}
        disabled={guardando || !calculo || !!calculo.error}
        className="btn w-full bg-verde text-white disabled:opacity-50"
      >
        {guardando ? 'Guardando...' : 'Guardar sesión'}
      </button>
      <button onClick={onVolver} className="btn w-full bg-campo text-tinta">
        Volver a la sesión
      </button>
    </div>
  )
}
