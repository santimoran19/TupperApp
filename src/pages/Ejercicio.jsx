// Ejercicio (F-19): los entrenamientos anotados, las sesiones de gimnasio, las rutinas y el progreso de cada ejercicio.
// Solo se usa con el cálculo de gasto prendido (se prende en /gasto).
import { useCallback, useMemo, useState } from 'react'
import ImportarEntrenos from '../components/ImportarEntrenos'
import { Link, useSearchParams } from 'react-router-dom'
import EntrenoForm from '../components/EntrenoForm'
import GraficoProgreso from '../components/GraficoProgreso'
import Marco from '../components/Marco'
import RutinaForm from '../components/RutinaForm'
import SesionGym from '../components/SesionGym'
import { Chip, Icono, Vacio } from '../components/ui'
import { useDatos } from '../store/Datos'
import { borrarBorrador, leerBorrador } from '../lib/borradorEntreno'
import { METODOS, nombreDeCategoria, resumenDeEjercicio } from '../lib/ejercicio'
import { fechaCorta, fechaLarga, hoy, lunesDe, sumarDias } from '../lib/fechas'
import { aMedioKilo, ejerciciosHechos, mejoresMarcas, nombreDeEquipo, nombreDeGrupo, progresoDeEjercicio } from '../lib/gimnasio'
import { errFecha, rangoDiario } from '../lib/validar'
import MapaMuscular from '../components/MapaMuscular'
import { GRUPOS_MUSCULARES, SERIES_LLENO, intensidad, textoDeTrabajo, trabajoPorMusculo } from '../lib/musculos'
import Vista3D, { hayWebGL, tresDPrendido } from '../components/Vista3D'

const miles = (n) => Math.round(Number(n) || 0).toLocaleString('es-AR')
const DIAS_POR_PAGINA = 14

// ---------- Entrenamientos ----------
function Fila({ w, esGym, onAbrir, onBorrar }) {
  return (
    <div className="flex items-center gap-3 py-3">
      <button onClick={onAbrir} className="flex-1 min-w-0 text-left flex items-center gap-3" aria-label={`Corregir ${w.name}`}>
        <span className="w-10 h-10 rounded-full bg-verde-claro text-verde-texto flex items-center justify-center shrink-0">
          <Icono n={esGym ? 'fitness_center' : 'directions_run'} size={20} />
        </span>
        <span className="min-w-0">
          <span className="block font-medium truncate">{w.name}</span>
          <span className="block text-xs text-gris">
            {w.duration_min} min
            {Number(w.distance_km) > 0 && ` · ${Number(w.distance_km).toLocaleString('es-AR')} km`} ·{' '}
            {METODOS[w.metodo]?.texto.toLowerCase() || w.metodo}
          </span>
        </span>
      </button>
      <p className="font-bold text-verde-texto whitespace-nowrap">~{miles(w.kcal)} kcal</p>
      <button
        onClick={onBorrar}
        className="w-9 h-9 rounded-full text-gris flex items-center justify-center"
        aria-label={`Borrar ${w.name}`}
      >
        <Icono n="delete" size={18} />
      </button>
    </div>
  )
}

function Entrenamientos({ fecha, onAnotar, onAbrir, onImportar }) {
  const d = useDatos()
  const [paginas, setPaginas] = useState(1)
  const conSeries = useMemo(() => new Set(d.series.map((s) => s.workout_id)), [d.series])
  const lunes = lunesDe(hoy())
  const semana = resumenDeEjercicio(d.entrenamientos, lunes, sumarDias(lunes, 6))

  const dias = useMemo(() => {
    const porDia = new Map()
    for (const w of [...d.entrenamientos].sort((a, b) =>
      a.fecha === b.fecha ? (a.created_at < b.created_at ? 1 : -1) : a.fecha < b.fecha ? 1 : -1,
    )) {
      if (!porDia.has(w.fecha)) porDia.set(w.fecha, [])
      porDia.get(w.fecha).push(w)
    }
    return [...porDia.entries()]
  }, [d.entrenamientos])
  const visibles = dias.slice(0, paginas * DIAS_POR_PAGINA)

  async function borrar(w) {
    const seguir = await d.confirmar({ titulo: `¿Borrar “${w.name}”?`, texto: `Del ${fechaCorta(w.fecha)}. No se puede deshacer.` })
    if (seguir && (await d.borrarEntrenamiento(w.id))) d.avisar('Entrenamiento borrado')
  }
  async function borrarActividad(a) {
    const seguir = await d.confirmar({
      titulo: `¿Borrar la actividad “${a.name}”?`,
      texto: 'Los entrenamientos que ya anotaste con ella se quedan como están.',
    })
    if (seguir && (await d.borrarActividad(a.id))) d.avisar('Actividad borrada')
  }
  const propias = d.actividades.filter((a) => a.owner)

  return (
    <>
      <section className="tarjeta p-5 mb-4" data-tour="ejercicio-semana">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Esta semana</h2>
          <div className="flex gap-2">
            <button onClick={onImportar} className="btn-chico bg-verde-suave text-verde-texto" data-testid="abrir-importar">
              <Icono n="watch" size={16} /> Traer
            </button>
            <button onClick={() => onAnotar(fecha)} className="btn-chico bg-verde text-white" data-tour="ejercicio-anotar">
              <Icono n="add" size={16} /> Anotar
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl bg-campo p-3">
            <p className="text-xs text-gris">Entrenamientos</p>
            <p className="text-lg font-bold">{semana.cantidad}</p>
          </div>
          <div className="rounded-2xl bg-campo p-3">
            <p className="text-xs text-gris">Minutos</p>
            <p className="text-lg font-bold">{miles(semana.minutos)}</p>
          </div>
          <div className="rounded-2xl bg-campo p-3">
            <p className="text-xs text-gris">Calorías</p>
            <p className="text-lg font-bold">~{miles(semana.kcal)}</p>
          </div>
        </div>
        <p className="text-xs text-gris mt-2">Calorías netas y estimadas: lo que gastaste de más por entrenar.</p>
      </section>

      <SemanaPorMusculo />

      {dias.length === 0 ? (
        <Vacio
          icono="directions_run"
          titulo="Todavía no anotaste entrenamientos"
          texto="Caminar, correr, pádel, yoga, pesas... Anotá el primero y mirá cuántas calorías gastaste."
        >
          <button onClick={() => onAnotar(fecha)} className="btn bg-verde text-white">
            Anotar un entrenamiento
          </button>
        </Vacio>
      ) : (
        visibles.map(([f, lista]) => (
          <section key={f} className="tarjeta px-4 mb-3">
            <div className="flex items-center justify-between pt-3">
              <h3 className="text-sm font-semibold">{f === hoy() ? 'Hoy' : fechaLarga(f)}</h3>
              <span className="text-xs text-gris">~{miles(lista.reduce((t, w) => t + Number(w.kcal), 0))} kcal</span>
            </div>
            <div className="divide-y divide-linea">
              {lista.map((w) => (
                <Fila
                  key={w.id}
                  w={w}
                  esGym={conSeries.has(w.id)}
                  onAbrir={() => onAbrir(w, conSeries.has(w.id))}
                  onBorrar={() => borrar(w)}
                />
              ))}
            </div>
          </section>
        ))
      )}
      {dias.length > visibles.length && (
        <button onClick={() => setPaginas((p) => p + 1)} className="btn w-full bg-campo text-tinta mb-4">
          Ver días anteriores
        </button>
      )}

      {propias.length > 0 && (
        <section className="tarjeta p-5 mb-4">
          <h2 className="font-semibold mb-2">Mis actividades</h2>
          <div className="divide-y divide-linea">
            {propias.map((a) => (
              <div key={a.id} className="flex items-center gap-2 py-2.5">
                <span className="flex-1 text-sm">
                  <span className="font-medium">{a.name}</span>
                  <span className="block text-xs text-gris">{nombreDeCategoria(a.category)}</span>
                </span>
                <button
                  onClick={() => borrarActividad(a)}
                  className="w-9 h-9 rounded-full text-gris flex items-center justify-center"
                  aria-label={`Borrar ${a.name}`}
                >
                  <Icono n="delete" size={18} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  )
}

// ---------- Gimnasio ----------
function Progreso() {
  const d = useDatos()
  const ejerciciosPorId = useMemo(() => new Map(d.ejerciciosGym.map((e) => [e.id, e])), [d.ejerciciosGym])
  const hechos = useMemo(() => ejerciciosHechos(d.series).filter((h) => ejerciciosPorId.has(h.ejercicioId)), [d.series, ejerciciosPorId])
  const [elegido, setElegido] = useState(null)
  const id = elegido && hechos.some((h) => h.ejercicioId === elegido) ? elegido : hechos[0]?.ejercicioId
  const delEjercicio = useMemo(() => d.series.filter((s) => s.exercise_id === id), [d.series, id])
  const puntos = useMemo(() => progresoDeEjercicio(delEjercicio, id), [delEjercicio, id])
  const marcas = useMemo(() => mejoresMarcas(delEjercicio), [delEjercicio])

  if (hechos.length === 0) return null
  return (
    <section className="tarjeta p-5 mb-4" data-tour="gimnasio-progreso">
      <h2 className="font-semibold mb-3">Mi progreso</h2>
      <select value={id} onChange={(ev) => setElegido(ev.target.value)} className="campo mb-3" aria-label="Ejercicio">
        {hechos.map((h) => (
          <option key={h.ejercicioId} value={h.ejercicioId}>
            {ejerciciosPorId.get(h.ejercicioId).name}
          </option>
        ))}
      </select>
      <GraficoProgreso puntos={puntos} />
      <div className="grid grid-cols-3 gap-2 mt-3 text-center">
        <div className="rounded-2xl bg-campo p-3">
          <p className="text-xs text-gris">Más peso</p>
          <p className="font-bold">{marcas.peso > 0 ? `${marcas.peso.toLocaleString('es-AR')} kg` : '—'}</p>
        </div>
        <div className="rounded-2xl bg-campo p-3">
          <p className="text-xs text-gris">Fuerza estimada</p>
          <p className="font-bold">{marcas.unRm > 0 ? `${aMedioKilo(marcas.unRm).toLocaleString('es-AR')} kg` : '—'}</p>
        </div>
        <div className="rounded-2xl bg-campo p-3">
          <p className="text-xs text-gris">Más reps</p>
          <p className="font-bold">{marcas.reps || '—'}</p>
        </div>
      </div>
      <p className="text-xs text-gris mt-2">
        La fuerza estimada (1RM) sale de la fórmula de Epley: peso × (1 + repeticiones ÷ 30). Sirve hasta unas 12 repeticiones.
      </p>
    </section>
  )
}

function SemanaPorMusculo() {
  const d = useDatos()
  const [activo, setActivo] = useState(null)
  const [tresD, setTresD] = useState(false)
  const tocar = useCallback((g) => setActivo((a) => (a === g ? null : g)), [])
  const lunes = lunesDe(hoy())
  const fin = sumarDias(lunes, 6)
  const ejerciciosPorId = useMemo(() => new Map(d.ejerciciosGym.map((e) => [e.id, e])), [d.ejerciciosGym])
  // Las series de gimnasio y los entrenamientos en los que se marcaron músculos (1.24)
  const trabajo = useMemo(
    () =>
      trabajoPorMusculo({
        series: d.series.filter((s) => s.fecha >= lunes && s.fecha <= fin),
        entrenamientos: d.entrenamientos.filter((w) => w.fecha >= lunes && w.fecha <= fin),
        ejerciciosPorId,
      }),
    [d.series, d.entrenamientos, ejerciciosPorId, lunes, fin],
  )
  const props3D = useMemo(
    () => ({
      sexo: d.perfil?.sex,
      grasa: d.perfil?.sex === 'f' ? 22 : 14,
      escala: 1.1,
      altura: Number(d.perfil?.height_cm) || undefined,
      modo: 'musculos',
      trabajo,
      activo,
      onTocar: tocar,
    }),
    [d.perfil?.sex, d.perfil?.height_cm, trabajo, activo, tocar],
  )
  const lista = GRUPOS_MUSCULARES.map(([g, t]) => ({ g, t, ...trabajo.get(g), i: intensidad(trabajo.get(g)) })).sort((x, y) => y.i - x.i)
  if (!lista.some((x) => x.i > 0)) return null
  const elegido = activo ? lista.find((x) => x.g === activo) : null
  return (
    <section className="tarjeta p-5 mb-4" aria-labelledby="ej-musculos">
      <h2 id="ej-musculos" className="font-semibold">
        Esta semana por músculo
      </h2>
      <div className="flex items-start gap-2 mt-0.5 mb-3">
        <p className="text-xs text-gris flex-1">Más oscuro, más trabajado. Tocá un músculo para ver el detalle.</p>
        {tresDPrendido() && hayWebGL() && (
          <button
            type="button"
            onClick={() => setTresD(!tresD)}
            aria-pressed={tresD}
            className={`btn-chico h-8 shrink-0 ${tresD ? 'bg-verde text-white' : 'bg-campo text-tinta'}`}
          >
            <Icono n="3d_rotation" size={16} /> {tresD ? '2D' : '3D'}
          </button>
        )}
      </div>
      {tresD ? (
        <Vista3D
          tipo="cuerpo"
          props={props3D}
          etiqueta="Tu cuerpo en 3D con los músculos de la semana"
          className="w-full max-w-[300px] mx-auto"
          lienzo="w-full h-96"
          giroSolo={false}
          sinTresD={<MapaMuscular sexo={d.perfil?.sex} valores={trabajo} activo={activo} onTocar={tocar} />}
        />
      ) : (
        <MapaMuscular sexo={d.perfil?.sex} valores={trabajo} activo={activo} onTocar={tocar} />
      )}
      <div className="rounded-2xl bg-campo px-4 py-3 mt-3 min-h-[60px]" aria-live="polite">
        {elegido ? (
          <>
            <p className="font-semibold">{elegido.t}</p>
            <p className="text-sm text-gris">
              {textoDeTrabajo(elegido)}
              {elegido.series > 0 && elegido.series < SERIES_LLENO
                ? ` · para ganar músculo se suelen recomendar ${SERIES_LLENO} a 20 series por semana`
                : ''}
            </p>
          </>
        ) : (
          <p className="text-sm text-gris">
            Lo más trabajado:{' '}
            <b className="text-tinta">
              {lista
                .filter((x) => x.i > 0)
                .slice(0, 3)
                .map((x) => x.t)
                .join(', ')}
            </b>
            .
            {lista.some((x) => x.i === 0) &&
              ` Sin entrenar: ${lista
                .filter((x) => x.i === 0)
                .map((x) => x.t.toLowerCase())
                .join(', ')}.`}
          </p>
        )}
      </div>
      <div className="space-y-1.5 mt-4">
        {lista
          .filter((x) => x.i > 0)
          .map((x) => (
            <div key={x.g} className="flex items-center gap-2 text-sm">
              <span className="w-28 shrink-0 leading-tight">{x.t}</span>
              <div className="flex-1 h-2 rounded-full bg-pista overflow-hidden">
                <div className="h-full bg-verde rounded-full" style={{ width: `${x.i * 100}%` }} />
              </div>
              <span className="w-36 text-right text-gris text-xs leading-tight">{textoDeTrabajo(x)}</span>
            </div>
          ))}
      </div>
      <p className="text-xs text-gris mt-2">Sin contar la entrada en calor. Un entrenamiento con músculos marcados cuenta como 3 series.</p>
    </section>
  )
}

function Gimnasio({ onEmpezar, onRutina, borrador, onDescartarBorrador }) {
  const d = useDatos()
  const ejerciciosPorId = useMemo(() => new Map(d.ejerciciosGym.map((e) => [e.id, e])), [d.ejerciciosGym])
  const propios = d.ejerciciosGym.filter((e) => e.owner)

  async function borrarRutina(r) {
    const seguir = await d.confirmar({
      titulo: `¿Borrar la rutina “${r.name}”?`,
      texto: 'Las sesiones que ya hiciste con ella no se borran.',
    })
    if (seguir && (await d.borrarRutina(r.id))) d.avisar('Rutina borrada')
  }
  async function borrarEjercicio(e) {
    const seguir = await d.confirmar({ titulo: `¿Borrar el ejercicio “${e.name}”?`, texto: 'Se saca también de tus rutinas.' })
    if (seguir && (await d.borrarEjercicioGym(e.id))) d.avisar('Ejercicio borrado')
  }

  return (
    <>
      {borrador && (
        <section className="rounded-2xl bg-naranja-suave p-4 mb-4">
          <p className="text-sm font-semibold text-naranja-oscuro flex items-center gap-1.5">
            <Icono n="timer" size={18} /> Tenés una sesión sin terminar
          </p>
          <p className="text-xs text-naranja-oscuro mt-1">
            {borrador.sesion.length} {borrador.sesion.length === 1 ? 'ejercicio' : 'ejercicios'} · {fechaLarga(borrador.fecha)}
          </p>
          <div className="flex gap-2 mt-3">
            <button onClick={() => onEmpezar({ borrador })} className="btn-chico bg-naranja-oscuro text-white">
              Retomar
            </button>
            <button onClick={onDescartarBorrador} className="btn-chico bg-superficie text-tinta">
              Descartar
            </button>
          </div>
        </section>
      )}

      <section className="tarjeta p-5 mb-4" data-tour="gimnasio-rutinas">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Mis rutinas</h2>
          <button onClick={() => onRutina(null)} className="btn-chico bg-verde-suave text-verde-texto">
            <Icono n="add" size={16} /> Nueva
          </button>
        </div>
        {d.rutinas.length === 0 ? (
          <p className="text-sm text-gris">
            Una rutina es una lista de ejercicios con sus series y repeticiones. Armala una vez y empezala cada vez que entrenes.
          </p>
        ) : (
          <div className="divide-y divide-linea">
            {d.rutinas.map((r) => {
              const items = d.rutinaItems.filter((i) => i.routine_id === r.id).sort((a, b) => a.position - b.position)
              return (
                <div key={r.id} className="py-3">
                  <div className="flex items-center gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{r.name}</p>
                      <p className="text-xs text-gris truncate">
                        {items.length} {items.length === 1 ? 'ejercicio' : 'ejercicios'}
                        {items.length > 0 &&
                          ` · ${items
                            .slice(0, 3)
                            .map((i) => ejerciciosPorId.get(i.exercise_id)?.name || 'Ejercicio')
                            .join(', ')}${items.length > 3 ? '...' : ''}`}
                      </p>
                    </div>
                    <button
                      onClick={() => onRutina(r)}
                      className="w-9 h-9 rounded-full text-gris flex items-center justify-center"
                      aria-label={`Editar ${r.name}`}
                    >
                      <Icono n="edit" size={18} />
                    </button>
                    <button
                      onClick={() => borrarRutina(r)}
                      className="w-9 h-9 rounded-full text-gris flex items-center justify-center"
                      aria-label={`Borrar ${r.name}`}
                    >
                      <Icono n="delete" size={18} />
                    </button>
                  </div>
                  <button onClick={() => onEmpezar({ rutinaId: r.id })} className="btn w-full bg-verde text-white mt-2">
                    <Icono n="play_arrow" size={20} lleno /> Empezar
                  </button>
                </div>
              )
            })}
          </div>
        )}
        <button onClick={() => onEmpezar({})} className="btn w-full bg-campo text-tinta mt-3" data-tour="gimnasio-empezar">
          Empezar una sesión libre
        </button>
      </section>

      <SemanaPorMusculo />
      <Progreso />

      {propios.length > 0 && (
        <section className="tarjeta p-5 mb-4">
          <h2 className="font-semibold mb-2">Mis ejercicios</h2>
          <div className="divide-y divide-linea">
            {propios.map((e) => (
              <div key={e.id} className="flex items-center gap-2 py-2.5">
                <span className="flex-1 text-sm">
                  <span className="font-medium">{e.name}</span>
                  <span className="block text-xs text-gris">
                    {nombreDeGrupo(e.grupo)} · {nombreDeEquipo(e.equipo)}
                  </span>
                </span>
                <button
                  onClick={() => borrarEjercicio(e)}
                  className="w-9 h-9 rounded-full text-gris flex items-center justify-center"
                  aria-label={`Borrar ${e.name}`}
                >
                  <Icono n="delete" size={18} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  )
}

// ---------- Pantalla ----------
export default function Ejercicio() {
  const d = useDatos()
  const uid = d.usuario.id
  const [params, setParams] = useSearchParams()
  const rango = rangoDiario()
  const pedida = params.get('fecha')
  const fecha = pedida && !errFecha(pedida, rango) ? pedida : hoy()
  const tab = params.get('tab') === 'gimnasio' ? 'gimnasio' : 'entrenos'
  // Qué hoja está abierta: el formulario de un entrenamiento, una sesión de gimnasio o el editor de una rutina
  const [abierta, setAbierta] = useState(null)
  const [borrador, setBorrador] = useState(() => leerBorrador(uid))

  const cambiarTab = (t) => {
    const p = new URLSearchParams(params)
    if (t === 'gimnasio') p.set('tab', 'gimnasio')
    else p.delete('tab')
    setParams(p, { replace: true })
  }
  const cerrar = () => {
    setAbierta(null)
    setBorrador(leerBorrador(uid))
  }
  async function descartarBorrador() {
    const seguir = await d.confirmar({ titulo: '¿Descartar la sesión?', texto: 'Se pierde lo que cargaste.', boton: 'Descartar' })
    if (!seguir) return
    borrarBorrador(uid)
    setBorrador(null)
  }

  // Empezar una sesión nueva con un borrador sin terminar pisaría ese borrador: se pregunta antes
  async function empezar(opciones) {
    if (!opciones.borrador && borrador) {
      const seguir = await d.confirmar({
        titulo: 'Ya tenés una sesión sin terminar',
        texto: 'Si empezás otra, se descarta la que dejaste a medias.',
        boton: 'Empezar otra',
        peligro: false,
      })
      if (!seguir) return
      borrarBorrador(uid)
      setBorrador(null)
    }
    setAbierta({ tipo: 'sesion', fecha, ...opciones })
  }

  if (!d.perfil.gasto_activo)
    return (
      <Marco titulo="Ejercicio" atras>
        <Vacio
          icono="fitness_center"
          titulo="Primero activá el cálculo de gasto"
          texto="Para anotar entrenamientos y ver cuántas calorías gastás, prendé el cálculo en Gasto y ejercicio. Es opcional y lo podés apagar cuando quieras."
        >
          <Link to="/gasto" className="btn bg-verde text-white">
            Ir a Gasto y ejercicio
          </Link>
        </Vacio>
      </Marco>
    )

  return (
    <Marco titulo="Ejercicio" atras>
      <div className="flex gap-2 mb-4 items-center">
        <Chip activo={tab === 'entrenos'} onClick={() => cambiarTab('entrenos')}>
          Entrenamientos
        </Chip>
        <Chip activo={tab === 'gimnasio'} onClick={() => cambiarTab('gimnasio')}>
          Gimnasio
        </Chip>
        <Link to="/gasto" className="ml-auto text-sm font-semibold text-verde-texto flex items-center gap-1">
          <Icono n="tune" size={16} /> Gasto
        </Link>
      </div>

      {tab === 'entrenos' ? (
        <Entrenamientos
          fecha={fecha}
          onAnotar={(f) => setAbierta({ tipo: 'form', fecha: f })}
          onAbrir={(w, esGym) => setAbierta(esGym ? { tipo: 'sesion', editar: w } : { tipo: 'form', inicial: w })}
          onImportar={() => setAbierta({ tipo: 'importar' })}
        />
      ) : (
        <Gimnasio
          borrador={borrador}
          onDescartarBorrador={descartarBorrador}
          onEmpezar={empezar}
          onRutina={(r) => setAbierta({ tipo: 'rutina', rutina: r })}
        />
      )}

      {abierta?.tipo === 'form' && <EntrenoForm inicial={abierta.inicial} fechaInicial={abierta.fecha} onCerrar={cerrar} />}
      {abierta?.tipo === 'sesion' && (
        <SesionGym
          rutinaId={abierta.rutinaId}
          borrador={abierta.borrador}
          editar={abierta.editar}
          fecha={abierta.fecha}
          onCerrar={cerrar}
        />
      )}
      {abierta?.tipo === 'rutina' && <RutinaForm rutina={abierta.rutina} onCerrar={cerrar} />}
      {abierta?.tipo === 'importar' && <ImportarEntrenos onCerrar={cerrar} />}
    </Marco>
  )
}
