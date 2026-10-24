// Anotar o corregir un entrenamiento (F-19, fase 2). Las calorías se calculan con el mejor dato que haya y se muestran con su rango
// antes de guardar. Las sesiones de pesas con series se arman en SesionGym; acá se puede corregir su duración, esfuerzo y notas.
import { useMemo, useState } from 'react'
import { Chip, Err, Hoja, Icono, Numero } from './ui'
import { useDatos } from '../store/Datos'
import { hoy } from '../lib/fechas'
import {
  CATEGORIAS_EJERCICIO,
  ESFUERZOS,
  ESFUERZO_POR_DEFECTO,
  LIM_EJERCICIO,
  METODOS,
  agruparActividades,
  calcularEntrenamiento,
  filtrarPorNombre,
} from '../lib/ejercicio'
import { pesoDelDia } from '../lib/gasto'
import { rangoDiario, errFecha, errNumero } from '../lib/validar'
import MapaMuscular from './MapaMuscular'
import { CLAVES_MUSCULARES, CUERPO_COMPLETO, musculosTipicos } from '../lib/musculos'

const miles = (n) => Math.round(n).toLocaleString('es-AR')
const enTexto = (v) => (v === null || v === undefined ? '' : String(Number(v)))

// ---------- Elegir (o crear) la actividad ----------
function CrearActividad({ onCreada, onVolver }) {
  const d = useDatos()
  const [f, setF] = useState({ name: '', category: 'otro', mets_suave: '3', mets_medio: '5', mets_fuerte: '8' })
  const [guardando, setGuardando] = useState(false)
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }))
  const mets = [Number(f.mets_suave), Number(f.mets_medio), Number(f.mets_fuerte)]
  const errores = {
    name: f.name.trim() ? null : 'Escribí el nombre de la actividad.',
    mets: mets.some((m) => !(m >= 1 && m <= 20))
      ? 'Los METs van de 1 a 20.'
      : mets[0] > mets[1] || mets[1] > mets[2]
        ? 'Tienen que ir de menor a mayor: suave, medio, fuerte.'
        : null,
  }

  async function crear() {
    setGuardando(true)
    const a = await d.crearActividad(f)
    setGuardando(false)
    if (a) onCreada(a)
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
          placeholder="Por ejemplo, Hockey"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Tipo</span>
        <select value={f.category} onChange={(ev) => set('category')(ev.target.value)} className="campo">
          {CATEGORIAS_EJERCICIO.map(([clave, nombre]) => (
            <option key={clave} value={clave}>
              {nombre}
            </option>
          ))}
        </select>
      </label>
      <div>
        <p className="text-sm font-medium">Intensidad (METs)</p>
        <p className="text-xs text-gris mb-1.5">
          Los METs miden cuánto cuesta una actividad respecto de estar quieto (1 MET). Si no sabés, dejá estos valores: sirven para casi
          cualquier deporte.
        </p>
        <div className="grid grid-cols-3 gap-2">
          {[
            ['mets_suave', 'Suave'],
            ['mets_medio', 'Medio'],
            ['mets_fuerte', 'Fuerte'],
          ].map(([k, texto]) => (
            <label key={k} className="block">
              <span className="text-xs text-gris">{texto}</span>
              <Numero valor={f[k]} onChange={set(k)} decimales={1} largo={4} error={!!errores.mets} />
            </label>
          ))}
        </div>
        <Err>{errores.mets}</Err>
      </div>
      <button
        onClick={crear}
        disabled={!!errores.name || !!errores.mets || guardando}
        className="btn w-full bg-verde text-white disabled:opacity-50"
      >
        {guardando ? 'Creando...' : 'Crear actividad'}
      </button>
    </div>
  )
}

function ElegirActividad({ actividades, onElegir, onCrear }) {
  const [texto, setTexto] = useState('')
  const grupos = useMemo(() => agruparActividades(filtrarPorNombre(actividades, texto)), [actividades, texto])
  return (
    <div>
      <input
        type="search"
        value={texto}
        onChange={(ev) => setTexto(ev.target.value)}
        className="campo mb-3"
        placeholder="Buscar: correr, pádel, yoga..."
        aria-label="Buscar actividad"
      />
      {grupos.length === 0 && <p className="text-sm text-gris py-4 text-center">No hay una actividad con ese nombre.</p>}
      {grupos.map((g) => (
        <div key={g.clave} className="mb-3">
          <p className="text-xs font-bold tracking-wide text-gris mb-1">{g.nombre.toUpperCase()}</p>
          <div className="divide-y divide-linea rounded-2xl bg-campo px-3">
            {g.lista.map((a) => (
              <button key={a.id} onClick={() => onElegir(a)} className="w-full flex items-center gap-2 py-2.5 text-left text-sm">
                <span className="flex-1 font-medium">{a.name}</span>
                {a.owner && <span className="pill bg-verde-suave text-verde-texto">Tuya</span>}
                <Icono n="chevron_right" size={18} className="text-gris" />
              </button>
            ))}
          </div>
        </div>
      ))}
      <button onClick={onCrear} className="btn w-full bg-verde-suave text-verde-texto">
        <Icono n="add" size={18} /> Crear una actividad propia
      </button>
    </div>
  )
}

// ---------- Formulario ----------
// `inicial`: el entrenamiento que se corrige (o null). `fechaInicial`: el día en que se anota.
export default function EntrenoForm({ inicial = null, fechaInicial = null, onCerrar, rutina = null }) {
  const d = useDatos()
  const rango = rangoDiario()
  const tipoInicial = inicial ? (d.actividades.find((a) => a.id === inicial.type_id) ?? null) : null
  const [tipo, setTipo] = useState(tipoInicial)
  const [paso, setPaso] = useState(inicial || tipoInicial ? 'datos' : 'actividad')
  const [fecha, setFecha] = useState(inicial?.fecha || fechaInicial || hoy())
  const [f, setF] = useState({
    minutos: enTexto(inicial?.duration_min),
    distancia: enTexto(inicial?.distance_km),
    desnivel: enTexto(inicial?.ascent_m),
    pulso: enTexto(inicial?.avg_hr),
    esfuerzo: inicial?.rpe ?? ESFUERZO_POR_DEFECTO,
    reloj: enTexto(inicial?.kcal_watch),
    relojActivas: !!inicial?.watch_activas,
    notas: inicial?.notes || '',
  })
  // Los músculos que trabajó (1.24): para el mapa de la semana
  const [musculos, setMusculos] = useState(() => new Set(inicial?.muscles || []))
  const alternarMusculo = (g) =>
    setMusculos((s) => {
      const n = new Set(s)
      if (n.has(g)) n.delete(g)
      else n.add(g)
      n.delete(CUERPO_COMPLETO)
      return n
    })
  const [intento, setIntento] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }))

  const nombre = tipo?.name ?? inicial?.name ?? ''
  const base = d.gastoDe(fecha).base
  const peso = pesoDelDia(d.perfil, d.medidas, fecha)

  const errores = {
    fecha: errFecha(fecha, rango),
    minutos: errNumero(f.minutos, LIM_EJERCICIO.minutos, { entero: true }),
    distancia: tipo?.usa_distancia ? errNumero(f.distancia, LIM_EJERCICIO.distancia, { opcional: true }) : null,
    desnivel: tipo?.usa_desnivel ? errNumero(f.desnivel, LIM_EJERCICIO.desnivel, { opcional: true }) : null,
    pulso: errNumero(f.pulso, LIM_EJERCICIO.pulso, { opcional: true, entero: true }),
    reloj: errNumero(f.reloj, LIM_EJERCICIO.reloj, { opcional: true, entero: true }),
    notas: f.notas.length > LIM_EJERCICIO.notas ? `Como mucho ${LIM_EJERCICIO.notas} caracteres.` : null,
  }
  const hayError = Object.values(errores).some(Boolean)

  // Lo que dan las calorías con lo cargado hasta ahora
  const calculo =
    !tipo || !base || errores.minutos || errores.pulso || errores.reloj || errores.distancia || errores.desnivel
      ? null
      : calcularEntrenamiento(
          tipo,
          {
            minutos: f.minutos,
            distancia: tipo.usa_distancia ? f.distancia : '',
            desnivel: tipo.usa_desnivel ? f.desnivel : '',
            pulso: f.pulso,
            esfuerzo: f.esfuerzo,
            reloj: f.reloj,
            relojActivas: f.relojActivas,
          },
          { peso, edad: base.edad, sexo: base.sexo, tmb: base.tmb },
        )

  async function guardar() {
    setIntento(true)
    if (hayError || !tipo) return
    setGuardando(true)
    const listo = await d.guardarEntrenamiento({
      id: inicial?.id,
      fecha,
      tipo,
      // Si se corrige sin cambiar la actividad, el nombre que tenía se conserva (por ejemplo, el de la rutina)
      nombre: inicial && tipo?.id === inicial.type_id ? inicial.name : undefined,
      minutos: f.minutos,
      distancia: tipo.usa_distancia ? f.distancia : '',
      desnivel: tipo.usa_desnivel ? f.desnivel : '',
      pulso: f.pulso,
      esfuerzo: f.esfuerzo,
      reloj: f.reloj,
      relojActivas: f.relojActivas,
      notas: f.notas,
      musculos: [...musculos],
      rutina: inicial?.routine_id ?? rutina ?? null,
    })
    setGuardando(false)
    if (listo !== false) {
      d.avisar(inicial ? 'Entrenamiento corregido' : 'Entrenamiento anotado')
      onCerrar()
    }
  }

  const titulo =
    paso === 'actividad' || paso === 'crear' ? 'Elegí la actividad' : inicial ? 'Corregir entrenamiento' : 'Anotar entrenamiento'
  return (
    <Hoja titulo={titulo} onCerrar={onCerrar}>
      {paso === 'actividad' && (
        <ElegirActividad
          actividades={d.actividades}
          onElegir={(a) => {
            setTipo(a)
            setPaso('datos')
          }}
          onCrear={() => setPaso('crear')}
        />
      )}
      {paso === 'crear' && (
        <CrearActividad
          onVolver={() => setPaso('actividad')}
          onCreada={(a) => {
            setTipo(a)
            setPaso('datos')
          }}
        />
      )}
      {paso === 'datos' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-2xl bg-campo p-3">
            <span className="w-10 h-10 rounded-full bg-verde-claro text-verde-texto flex items-center justify-center">
              <Icono n="directions_run" size={20} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold truncate">{nombre || 'Sin actividad'}</p>
              {!tipo && <p className="text-xs text-naranja-oscuro">Esa actividad ya no existe. Elegí una para recalcular.</p>}
            </div>
            <button onClick={() => setPaso('actividad')} className="btn-chico bg-superficie text-tinta">
              Cambiar
            </button>
          </div>

          {!base && (
            <p className="text-sm text-naranja-oscuro bg-naranja-suave rounded-2xl p-3">
              Para calcular las calorías hace falta tu perfil completo (sexo, nacimiento, altura y peso).
            </p>
          )}

          <label className="block">
            <span className="text-sm font-medium">Día</span>
            <input
              type="date"
              value={fecha}
              min={rango.min}
              max={rango.max}
              onChange={(ev) => setFecha(ev.target.value)}
              className={`campo ${errores.fecha ? 'border-rojo-texto!' : ''}`}
            />
            <Err>{errores.fecha}</Err>
          </label>

          <label className="block">
            <span className="text-sm font-medium">Duración (minutos)</span>
            <Numero valor={f.minutos} onChange={set('minutos')} decimales={0} largo={4} error={intento && !!errores.minutos} autoFocus />
            <Err>{(intento || f.minutos !== '') && errores.minutos}</Err>
          </label>

          {tipo?.usa_distancia && (
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-sm font-medium">Distancia (km)</span>
                <Numero
                  valor={f.distancia}
                  onChange={set('distancia')}
                  decimales={2}
                  largo={6}
                  error={!!errores.distancia}
                  placeholder="Opcional"
                />
                <Err>{errores.distancia}</Err>
              </label>
              {tipo.usa_desnivel && (
                <label className="block">
                  <span className="text-sm font-medium">Subida (m)</span>
                  <Numero
                    valor={f.desnivel}
                    onChange={set('desnivel')}
                    decimales={0}
                    largo={5}
                    error={!!errores.desnivel}
                    placeholder="Opcional"
                  />
                  <Err>{errores.desnivel}</Err>
                </label>
              )}
            </div>
          )}

          <div>
            <p className="text-sm font-medium mb-1.5">Esfuerzo</p>
            <div className="flex gap-2">
              {ESFUERZOS.map((e) => (
                <Chip key={e.valor} activo={f.esfuerzo === e.valor} onClick={() => set('esfuerzo')(e.valor)}>
                  {e.texto}
                </Chip>
              ))}
            </div>
            <p className="text-xs text-gris mt-1.5">
              {ESFUERZOS.find((e) => e.valor === f.esfuerzo)?.ayuda || `Esfuerzo ${f.esfuerzo} de 10`}
            </p>
          </div>

          <details className="rounded-2xl bg-campo px-3 py-2.5" open={inicial?.avg_hr || inicial?.kcal_watch ? true : undefined}>
            <summary className="text-sm font-medium cursor-pointer">Tengo datos del reloj o de la banda (opcional)</summary>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <label className="block">
                <span className="text-sm font-medium">Pulso promedio</span>
                <Numero valor={f.pulso} onChange={set('pulso')} decimales={0} largo={3} error={!!errores.pulso} placeholder="lat/min" />
                <Err>{errores.pulso}</Err>
              </label>
              <label className="block">
                <span className="text-sm font-medium">Calorías del reloj</span>
                <Numero valor={f.reloj} onChange={set('reloj')} decimales={0} largo={5} error={!!errores.reloj} placeholder="kcal" />
                <Err>{errores.reloj}</Err>
              </label>
            </div>
            {String(f.reloj).trim() !== '' && (
              <div className="mt-3">
                <span className="text-sm font-medium">Esas calorías son…</span>
                <div className="flex gap-2 mt-1.5">
                  <Chip activo={!f.relojActivas} onClick={() => set('relojActivas')(false)}>
                    Totales
                  </Chip>
                  <Chip activo={f.relojActivas} onClick={() => set('relojActivas')(true)}>
                    Activas
                  </Chip>
                </div>
                <p className="text-xs text-gris mt-1.5">
                  Muchos relojes muestran las dos. Las <b>activas</b> son solo lo que gastaste moviéndote; las <b>totales</b> incluyen
                  también lo que el cuerpo gasta en reposo. Si tu reloj dice solo «calorías», suelen ser las totales.
                </p>
              </div>
            )}
            <p className="text-xs text-gris mt-2">
              Con estos datos el cálculo es más preciso, aunque los relojes también se equivocan (entre un 20 y un 40 %). Para no contar dos
              veces, a las calorías totales les descontamos lo que igual habrías gastado en reposo.
            </p>
          </details>

          <details className="rounded-2xl bg-campo px-3 py-2.5" open={musculos.size > 0 ? true : undefined}>
            <summary className="text-sm font-semibold cursor-pointer flex items-center gap-2">
              <Icono n="body_system" size={18} className="text-verde-texto" /> ¿Qué músculos trabajaste? (opcional)
              {musculos.size > 0 && <span className="pill bg-coral text-white ml-auto">{musculos.size}</span>}
            </summary>
            <p className="text-xs text-gris mt-2">Tocá el cuerpo o los nombres. Sirve para ver en el mapa qué entrenaste en la semana.</p>
            {musculosTipicos(tipo).length > 0 && (
              <button
                type="button"
                onClick={() => {
                  const t = musculosTipicos(tipo)
                  setMusculos(new Set(t[0] === CUERPO_COMPLETO ? CLAVES_MUSCULARES : t))
                }}
                className="btn-chico bg-superficie text-verde-texto h-8 mt-2"
              >
                <Icono n="check" size={14} /> Marcar los de {tipo.name.toLowerCase()}
              </button>
            )}
            <div className="mt-2">
              <MapaMuscular sexo={d.perfil?.sex} modo="elegir" seleccion={musculos} onTocar={alternarMusculo} />
            </div>
          </details>

          <label className="block">
            <span className="text-sm font-medium">Notas (opcional)</span>
            <textarea
              value={f.notas}
              onChange={(ev) => set('notas')(ev.target.value)}
              rows={2}
              maxLength={LIM_EJERCICIO.notas}
              className="campo"
            />
            <Err>{errores.notas}</Err>
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
              <p className="text-xs text-gris mt-1">Son calorías netas: no incluyen lo que gastás en reposo en esos minutos.</p>
              {calculo.aviso && <p className="text-xs text-naranja-oscuro mt-1">{calculo.aviso}</p>}
            </div>
          )}
          {calculo?.error && <Err>{calculo.error}</Err>}

          <button
            onClick={guardar}
            disabled={guardando || !tipo || !base || !!calculo?.error}
            className="btn w-full bg-verde text-white disabled:opacity-50"
          >
            {guardando ? 'Guardando...' : inicial ? 'Guardar cambios' : 'Guardar entrenamiento'}
          </button>
        </div>
      )}
    </Hoja>
  )
}
