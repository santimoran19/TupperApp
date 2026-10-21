// Elegir (o crear) un ejercicio de gimnasio: buscador, lista por grupo muscular y alta de ejercicios propios.
import { useMemo, useState } from 'react'
import { Chip, Icono } from './ui'
import { useDatos } from '../store/Datos'
import { filtrarPorNombre } from '../lib/ejercicio'
import { EQUIPOS, GRUPOS, nombreDeEquipo } from '../lib/gimnasio'

function CrearEjercicio({ onCreado, onVolver }) {
  const d = useDatos()
  const [f, setF] = useState({ name: '', grupo: 'pecho', equipo: 'otro', peso_corporal: false })
  const [guardando, setGuardando] = useState(false)
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }))

  async function crear() {
    setGuardando(true)
    const e = await d.crearEjercicioGym(f)
    setGuardando(false)
    if (e) onCreado(e)
  }

  return (
    <div className="space-y-3">
      <button onClick={onVolver} className="text-sm font-semibold text-verde-texto flex items-center gap-1">
        <Icono n="arrow_back" size={18} /> Volver a la lista
      </button>
      <label className="block">
        <span className="text-sm font-medium">Nombre</span>
        <input
          value={f.name}
          onChange={(ev) => set('name')(ev.target.value)}
          maxLength={60}
          className="campo"
          placeholder="Por ejemplo, Press con agarre cerrado"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Músculo principal</span>
        <select value={f.grupo} onChange={(ev) => set('grupo')(ev.target.value)} className="campo">
          {GRUPOS.map(([clave, nombre]) => (
            <option key={clave} value={clave}>
              {nombre}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-sm font-medium">Equipo</span>
        <select value={f.equipo} onChange={(ev) => set('equipo')(ev.target.value)} className="campo">
          {EQUIPOS.map(([clave, nombre]) => (
            <option key={clave} value={clave}>
              {nombre}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" checked={f.peso_corporal} onChange={(ev) => set('peso_corporal')(ev.target.checked)} className="mt-1" />
        <span>
          Se hace con el peso del cuerpo
          <span className="block text-xs text-gris">Como dominadas o fondos: el peso que anotes es la carga extra (0 si no hay).</span>
        </span>
      </label>
      <button onClick={crear} disabled={!f.name.trim() || guardando} className="btn w-full bg-verde text-white disabled:opacity-50">
        {guardando ? 'Creando...' : 'Crear ejercicio'}
      </button>
    </div>
  )
}

// `onElegir(ejercicio)`. `ocultos`: ids que no se muestran (por ejemplo, los que ya están en la sesión).
export default function ElegirEjercicio({ onElegir, ocultos = [] }) {
  const d = useDatos()
  const [texto, setTexto] = useState('')
  const [grupo, setGrupo] = useState(null)
  const [creando, setCreando] = useState(false)

  const lista = useMemo(() => {
    const quitados = new Set(ocultos)
    const base = d.ejerciciosGym.filter((e) => !quitados.has(e.id) && (!grupo || e.grupo === grupo))
    return filtrarPorNombre(base, texto)
  }, [d.ejerciciosGym, ocultos, grupo, texto])

  const porGrupo = useMemo(
    () =>
      GRUPOS.map(([clave, nombre]) => ({
        clave,
        nombre,
        lista: lista
          .filter((e) => e.grupo === clave)
          .sort((a, b) => (a.owner ? 0 : 1) - (b.owner ? 0 : 1) || a.name.localeCompare(b.name, 'es')),
      })).filter((g) => g.lista.length > 0),
    [lista],
  )

  if (creando) return <CrearEjercicio onVolver={() => setCreando(false)} onCreado={onElegir} />

  return (
    <div>
      <input
        type="search"
        value={texto}
        onChange={(ev) => setTexto(ev.target.value)}
        className="campo mb-2"
        placeholder="Buscar: press, sentadilla, remo..."
        aria-label="Buscar ejercicio"
      />
      <div className="flex gap-2 overflow-x-auto pb-2 mb-2 -mx-1 px-1">
        <Chip activo={!grupo} onClick={() => setGrupo(null)}>
          Todos
        </Chip>
        {GRUPOS.map(([clave, nombre]) => (
          <Chip key={clave} activo={grupo === clave} onClick={() => setGrupo(grupo === clave ? null : clave)}>
            {nombre}
          </Chip>
        ))}
      </div>
      {porGrupo.length === 0 && <p className="text-sm text-gris py-4 text-center">No hay un ejercicio con ese nombre.</p>}
      {porGrupo.map((g) => (
        <div key={g.clave} className="mb-3">
          <p className="text-xs font-bold tracking-wide text-gris mb-1">{g.nombre.toUpperCase()}</p>
          <div className="divide-y divide-linea rounded-2xl bg-campo px-3">
            {g.lista.map((e) => (
              <button key={e.id} onClick={() => onElegir(e)} className="w-full flex items-center gap-2 py-2.5 text-left text-sm">
                <span className="flex-1">
                  <span className="font-medium">{e.name}</span>
                  <span className="block text-xs text-gris">{nombreDeEquipo(e.equipo)}</span>
                </span>
                {e.owner && <span className="pill bg-verde-suave text-verde-texto">Tuyo</span>}
                <Icono n="chevron_right" size={18} className="text-gris" />
              </button>
            ))}
          </div>
        </div>
      ))}
      <button onClick={() => setCreando(true)} className="btn w-full bg-verde-suave text-verde-texto">
        <Icono n="add" size={18} /> Crear un ejercicio propio
      </button>
    </div>
  )
}
