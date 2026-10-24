// Traer entrenamientos de un reloj o app (1.30, F-22): archivos GPX/TCX/FIT (Garmin, Polar, Coros, Suunto, Google Fit, Apple
// Salud...) o la cuenta de Strava. Se muestra lo encontrado, se elige qué anotar (lo que ya estaba viene destildado) y
// se anota con la misma cuenta de calorías que un entrenamiento cargado a mano.
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Err, Hoja, Icono } from './ui'
import { useDatos } from '../store/Datos'
import { fechaCorta, hoy, sumarDias } from '../lib/fechas'
import { datosDeEntreno, desdeStrava, fechaLocal, leerArchivo, prepararImportacion } from '../lib/importarEntrenos'
import { leerFit } from '../lib/fit'

const STRAVA_CLIENTE = import.meta.env.VITE_STRAVA_CLIENT_ID || ''
const CLAVE_ESTADO = 'tupper:strava-estado'
const MAX_ARCHIVO = 15 * 1024 * 1024

// La dirección de Strava para dar permiso (vuelve a /ejercicio con ?code=...&scope=...&state=...). `estado` es un código
// al azar que se guarda al tocar el enlace y se comprueba a la vuelta.
function urlDeStrava(estado) {
  const p = new URLSearchParams({
    client_id: STRAVA_CLIENTE,
    response_type: 'code',
    redirect_uri: `${location.origin}/ejercicio`,
    approval_prompt: 'auto',
    scope: 'activity:read_all',
    state: estado,
  })
  return `https://www.strava.com/oauth/authorize?${p}`
}
const recordarEstado = (estado) => {
  try {
    sessionStorage.setItem(CLAVE_ESTADO, estado)
  } catch {
    // sin almacenamiento igual se intenta (el estado no se va a poder comprobar)
  }
}

// Al volver de Strava con el permiso: lo canjea y limpia la dirección. Devuelve { atleta } o { error }.
export function useVueltaDeStrava(onListo) {
  const d = useDatos()
  const [params, setParams] = useSearchParams()
  const hecho = useRef(false)
  useEffect(() => {
    const code = params.get('code')
    const estado = params.get('state')
    const error = params.get('error')
    if ((!code && !error) || !estado || hecho.current) return
    hecho.current = true
    let esperado = null
    try {
      esperado = sessionStorage.getItem(CLAVE_ESTADO)
      sessionStorage.removeItem(CLAVE_ESTADO)
    } catch {
      // sin almacenamiento
    }
    const limpia = new URLSearchParams(params)
    for (const k of ['code', 'state', 'scope', 'error']) limpia.delete(k)
    setParams(limpia, { replace: true })
    if (error) return onListo({ error: 'No diste permiso en Strava.' })
    if (esperado && esperado !== estado) return onListo({ error: 'La respuesta de Strava no coincide. Probá conectar de nuevo.' })
    d.strava({ accion: 'conectar', code, scope: params.get('scope') || '' }).then(onListo)
  }, [params, setParams, d, onListo])
}

export default function ImportarEntrenos({ onCerrar, inicial = null }) {
  const d = useDatos()
  const [encontradas, setEncontradas] = useState(null) // [{ act, tipo, repetida }]
  const [elegidas, setElegidas] = useState(new Set())
  const [tipos, setTipos] = useState({}) // ref -> id de la actividad elegida a mano
  const [error, setError] = useState(inicial?.error || null)
  const [trabajando, setTrabajando] = useState(false)
  const [strava, setStrava] = useState(inicial?.atleta !== undefined ? { conectado: true, atleta: inicial.atleta } : null)
  const archivo = useRef(null)
  // La dirección para dar permiso en Strava se arma una vez (lleva un código al azar que se comprueba a la vuelta)
  const [estadoStrava] = useState(() => Math.random().toString(36).slice(2) + Date.now().toString(36))

  const catalogo = useMemo(() => [...d.actividades].sort((a, b) => a.name.localeCompare(b.name, 'es')), [d.actividades])
  const porId = useMemo(() => new Map(d.actividades.map((a) => [a.id, a])), [d.actividades])

  useEffect(() => {
    if (!STRAVA_CLIENTE || strava) return
    let vivo = true
    d.strava({ accion: 'estado' }).then((r) => vivo && setStrava(r.error ? { conectado: false, error: r.codigo } : r))
    return () => {
      vivo = false
    }
  }, [d, strava])

  const mostrar = (actividades) => {
    const lista = prepararImportacion(actividades, { catalogo: d.actividades, entrenamientos: d.entrenamientos })
    setEncontradas(lista)
    setElegidas(new Set(lista.filter((x) => !x.repetida).map((x) => x.act.ref)))
    if (lista.length === 0) setError('No encontré entrenamientos.')
  }

  async function leerArchivos(ev) {
    const lista = [...(ev.target.files || [])]
    ev.target.value = ''
    if (!lista.length) return
    setError(null)
    setTrabajando(true)
    const actividades = []
    const malos = []
    for (const f of lista) {
      if (f.size > MAX_ARCHIVO) {
        malos.push(f.name)
        continue
      }
      try {
        const leidas = /\.fit$/i.test(f.name) ? leerFit(await f.arrayBuffer(), f.name) : leerArchivo(await f.text(), f.name)
        if (leidas.length === 0) malos.push(f.name)
        actividades.push(...leidas)
      } catch {
        malos.push(f.name)
      }
    }
    setTrabajando(false)
    mostrar(actividades)
    if (malos.length)
      setError(
        `${malos.length === 1 ? 'Este archivo no se pudo leer' : 'Estos archivos no se pudieron leer'}: ${malos.join(', ')}. Tiene que ser GPX, TCX o FIT (hasta 15 MB).`,
      )
  }

  async function traerDeStrava() {
    setError(null)
    setTrabajando(true)
    const r = await d.strava({ accion: 'actividades', desde: sumarDias(hoy(), -30) })
    setTrabajando(false)
    if (r.error) {
      if (r.codigo === 'sin_conectar') setStrava({ conectado: false })
      return setError(r.error)
    }
    mostrar((r.actividades || []).map(desdeStrava))
  }
  async function desconectar() {
    const si = await d.confirmar({
      titulo: '¿Desconectar Strava?',
      texto: 'Tupper deja de poder leer tus actividades. Lo que ya anotaste queda.',
      boton: 'Desconectar',
    })
    if (!si) return
    const r = await d.strava({ accion: 'desconectar' })
    if (r.error) return setError(r.error)
    setStrava({ conectado: false })
    d.avisar('Strava desconectado')
  }

  async function importar() {
    const lista = encontradas.filter((x) => elegidas.has(x.act.ref))
    setTrabajando(true)
    let bien = 0
    for (const x of lista) {
      const tipo = tipos[x.act.ref] ? porId.get(tipos[x.act.ref]) : x.tipo
      if (await d.guardarEntrenamiento(datosDeEntreno(x.act, tipo))) bien++
    }
    setTrabajando(false)
    if (bien > 0) {
      d.avisar(bien === 1 ? 'Entrenamiento anotado' : `${bien} entrenamientos anotados`)
      onCerrar()
    }
  }

  return (
    <Hoja titulo="Traer entrenamientos" onCerrar={onCerrar}>
      {!encontradas ? (
        <div className="space-y-3" data-testid="importar-entrenos">
          <p className="text-sm text-gris">
            Desde tu reloj o tu app de correr o de bici. Se calculan las calorías igual que si los cargaras a mano.
          </p>
          <button
            onClick={() => archivo.current?.click()}
            disabled={trabajando}
            className="w-full tarjeta p-4 flex items-center gap-3 text-left"
          >
            <span className="w-10 h-10 rounded-full bg-verde-suave text-verde-texto flex items-center justify-center shrink-0">
              <Icono n="upload_file" />
            </span>
            <span className="min-w-0">
              <span className="block font-semibold">{trabajando ? 'Leyendo...' : 'Subir archivos GPX, TCX o FIT'}</span>
              <span className="block text-xs text-gris">
                Garmin Connect, Polar, Coros, Suunto, Google Fit, Apple Salud (las rutas de la exportación) y casi todas las apps de correr
                o de bici los exportan.
              </span>
            </span>
          </button>
          <input
            ref={archivo}
            type="file"
            accept=".gpx,.tcx,.fit,application/gpx+xml,application/vnd.garmin.tcx+xml,application/vnd.ant.fit"
            multiple
            className="hidden"
            onChange={leerArchivos}
            data-testid="importar-archivo"
            aria-label="Archivos GPX, TCX o FIT"
          />
          {STRAVA_CLIENTE && strava && !strava.error && (
            <div className="tarjeta p-4" data-testid="strava">
              <p className="font-semibold flex items-center gap-2">
                <Icono n="sync_alt" className="text-naranja-oscuro" /> Strava
              </p>
              {strava.conectado ? (
                <>
                  <p className="text-sm text-gris mt-1">Conectado{strava.atleta ? ` como ${strava.atleta}` : ''}.</p>
                  <div className="flex gap-2 mt-3">
                    <button onClick={traerDeStrava} disabled={trabajando} className="btn-primario flex-1">
                      {trabajando ? 'Trayendo...' : 'Traer los últimos 30 días'}
                    </button>
                    <button onClick={desconectar} className="btn bg-campo text-tinta" aria-label="Desconectar Strava">
                      <Icono n="link_off" size={20} />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-gris mt-1">
                    Conectá tu cuenta y traé tus actividades sin exportar nada. Solo se leen tus actividades (no se publica nada).
                  </p>
                  <a
                    href={urlDeStrava(estadoStrava)}
                    onClick={() => recordarEstado(estadoStrava)}
                    className="btn bg-naranja-fuerte text-white w-full mt-3"
                  >
                    <Icono n="link" size={20} /> Conectar con Strava
                  </a>
                </>
              )}
            </div>
          )}
          <p className="text-xs text-gris">
            Apple Salud, Health Connect y Samsung Health no dejan que una web lea sus datos directo. Desde la app de tu reloj podés exportar
            el entrenamiento como GPX, TCX o FIT, o sincronizarlo con Strava.
          </p>
          <Err>{error}</Err>
        </div>
      ) : (
        <div data-testid="importar-lista">
          <p className="text-sm text-gris mb-2">
            {encontradas.length === 1 ? 'Encontré 1 entrenamiento.' : `Encontré ${encontradas.length} entrenamientos.`} Elegí cuáles anotar.
          </p>
          <ul className="divide-y divide-linea max-h-[55vh] overflow-y-auto -mx-1 px-1">
            {encontradas.map(({ act, tipo, repetida }) => {
              const id = `imp-${act.ref}`
              const marcada = elegidas.has(act.ref)
              return (
                <li key={act.ref} className="py-2.5">
                  <label htmlFor={id} className="flex items-start gap-3">
                    <input
                      id={id}
                      type="checkbox"
                      className="mt-1 w-5 h-5 accent-verde"
                      checked={marcada}
                      onChange={() => {
                        const n = new Set(elegidas)
                        if (marcada) n.delete(act.ref)
                        else n.add(act.ref)
                        setElegidas(n)
                      }}
                    />
                    <span className="flex-1 min-w-0">
                      <span className="block font-medium truncate">{act.nombre || tipo?.name || 'Entrenamiento'}</span>
                      <span className="block text-xs text-gris">
                        {fechaCorta(fechaLocal(act.inicio))} · {act.minutos} min
                        {act.distanciaKm > 0 && ` · ${act.distanciaKm.toLocaleString('es-AR')} km`}
                        {act.pulso > 0 && ` · ${act.pulso} ppm`}
                        {repetida && <b className="text-naranja-oscuro"> · ya estaba anotado</b>}
                      </span>
                    </span>
                  </label>
                  {marcada && (
                    <select
                      className="campo h-10! mt-2 text-sm"
                      aria-label={`Actividad de ${act.nombre || 'este entrenamiento'}`}
                      value={tipos[act.ref] || tipo?.id || ''}
                      onChange={(e) => setTipos({ ...tipos, [act.ref]: e.target.value })}
                    >
                      {catalogo.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                  )}
                </li>
              )
            })}
          </ul>
          <Err>{error}</Err>
          <div className="flex gap-2 mt-4">
            <button onClick={() => setEncontradas(null)} className="btn bg-campo text-tinta">
              Volver
            </button>
            <button onClick={importar} disabled={trabajando || elegidas.size === 0} className="btn-primario flex-1">
              {trabajando ? 'Anotando...' : `Anotar ${elegidas.size || ''}`}
            </button>
          </div>
        </div>
      )}
    </Hoja>
  )
}
