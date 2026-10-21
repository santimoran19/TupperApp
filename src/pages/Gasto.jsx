// Gasto y ejercicio (F-19): prender el cálculo, ver cómo se arma tu gasto, elegir cómo se usa en el objetivo y, con el tiempo,
// ajustarlo con tus propios datos. Todo es una estimación y la pantalla lo dice con rangos y supuestos a la vista.
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Marco from '../components/Marco'
import { Chip, Err, Hoja, Icono, Numero } from '../components/ui'
import { useDatos } from '../store/Datos'
import { fechaCorta, hoy } from '../lib/fechas'
import {
  MARGEN_FORMULA,
  TIPOS_DE_TRABAJO,
  TRABAJO_POR_DEFECTO,
  confianzaDelGasto,
  objetivoDesdeGasto,
  partesDelGasto,
  pesoDelDia,
} from '../lib/gasto'
import { calcularGastoReal } from '../lib/gastoreal'
import { errNumero } from '../lib/validar'

const miles = (n) => Math.round(n).toLocaleString('es-AR')
const signo = (n) => (n > 0 ? '+' : n < 0 ? '−' : '')

// Recorte o superávit que se puede elegir (en %). `null` es el automático, según el peso meta.
const AJUSTES = [
  [null, 'Automático (según tu peso meta)'],
  [-25, 'Bajar fuerte (−25 %)'],
  [-20, 'Bajar (−20 %)'],
  [-15, 'Bajar suave (−15 %)'],
  [-10, 'Bajar muy suave (−10 %)'],
  [0, 'Mantener mi peso'],
  [10, 'Subir de peso (+10 %)'],
]
const LIM_GRASA = [3, 60]
const LIM_PASOS = [0, 60000]

function Tarjeta({ titulo, icono, children, ...resto }) {
  return (
    <section className="tarjeta p-5 mb-4" {...resto}>
      <h2 className="font-semibold flex items-center gap-2 mb-3">
        {icono && <Icono n={icono} className="text-verde-texto" size={20} />} {titulo}
      </h2>
      {children}
    </section>
  )
}

// ---------- Sin activar ----------
function Presentacion({ onActivar }) {
  return (
    <>
      <Tarjeta titulo="Cuánto gastás por día" icono="local_fire_department">
        <p className="text-sm">
          Tupper puede estimar cuántas calorías gastás por día (tu metabolismo, tu movimiento y lo que entrenás) y ajustar tu objetivo en
          base a eso. También te deja anotar tus entrenamientos y tus rutinas de gimnasio.
        </p>
        <ul className="text-sm text-gris mt-3 space-y-1.5 list-disc pl-5">
          <li>Es opcional: si no lo activás, la app sigue funcionando con tu objetivo de siempre.</li>
          <li>Es una estimación, siempre con un rango: las fórmulas se equivocan entre un 10 y un 15 %.</li>
          <li>Te mostramos de dónde sale cada número y qué suponemos.</li>
          <li>Podés apagarlo y borrar todo lo de ejercicio cuando quieras.</li>
        </ul>
        <button onClick={onActivar} className="btn w-full bg-verde text-white mt-4" data-tour="gasto-activar">
          Activar el cálculo de gasto
        </button>
      </Tarjeta>
    </>
  )
}

function HojaConsentimiento({ onCerrar, onAceptar, trabajando }) {
  return (
    <Hoja titulo="Antes de activar" onCerrar={onCerrar}>
      <div className="space-y-3 text-sm">
        <p>
          Para estimar tu gasto usamos datos de tu cuerpo y de tu actividad: tu peso, altura, edad, sexo y los entrenamientos que anotes.
          Son <b>datos de salud</b>.
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-gris">
          <li>Solo los ves vos. No se comparten con tu hogar ni con nadie.</li>
          <li>Se guardan en tu cuenta y se borran con ella.</li>
          <li>Podés descargarlos o borrarlos cuando quieras desde esta pantalla y desde tu perfil.</li>
          <li>Lo que mostramos son estimaciones, no mediciones, y no reemplazan la consulta con un profesional de la salud.</li>
        </ul>
        <p className="text-gris">
          Si tenés una condición médica, un trastorno alimentario o estás embarazada, consultá con un profesional antes de seguir un
          objetivo de calorías.
        </p>
        <button onClick={onAceptar} disabled={trabajando} className="btn w-full bg-verde text-white disabled:opacity-60">
          {trabajando ? 'Activando...' : 'Acepto y activo el cálculo'}
        </button>
        <button onClick={onCerrar} className="btn w-full bg-campo text-tinta">
          Ahora no
        </button>
      </div>
    </Hoja>
  )
}

// ---------- Cómo se calcula ----------
function ComoSeCalcula({ base }) {
  const confianza = confianzaDelGasto(base)
  const partes = partesDelGasto(base)
  return (
    <Tarjeta titulo="Tu gasto de un día sin entrenar" icono="bolt" data-tour="gasto-calculo">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-3xl font-bold text-verde-texto leading-none">~{miles(base.mantenimiento)}</p>
          <p className="text-xs text-gris mt-1">kcal por día</p>
        </div>
        <p className="text-sm text-gris text-right">
          Entre <b className="text-tinta">{miles(base.rango[0])}</b> y <b className="text-tinta">{miles(base.rango[1])}</b>
          <br />
          <span className="text-xs">{confianza.texto}</span>
        </p>
      </div>
      <div className="mt-4 divide-y divide-linea">
        {partes.map((p) => (
          <div key={p.clave} className="py-3">
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium">{p.titulo}</p>
              <p className="font-bold">{miles(p.kcal)} kcal</p>
            </div>
            <p className="text-xs text-gris mt-0.5">{p.detalle}</p>
            <p className="text-xs text-gris mt-0.5 italic">{p.formula}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-gris mt-1">
        Calculado con tu peso de hoy ({base.peso} kg), {base.altura} cm y {base.edad} años. El ejercicio se suma aparte, según lo que
        anotes.
      </p>
      {base.supuestos.length > 0 && (
        <div className="rounded-2xl bg-campo p-3 mt-3">
          <p className="text-xs font-semibold text-gris mb-1">Lo que estamos suponiendo</p>
          <ul className="text-xs text-gris space-y-1 list-disc pl-4">
            {base.supuestos.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      )}
      <p className="text-xs text-gris mt-3">
        Margen de error de la fórmula: ±{Math.round(MARGEN_FORMULA * 100)} %. Con el tiempo, tus propios datos (más abajo) pueden afinarlo.
      </p>
    </Tarjeta>
  )
}

// ---------- Tus datos ----------
function TusDatos({ perfil, onGuardar }) {
  const [f, setF] = useState({
    body_fat_pct: perfil.body_fat_pct ?? '',
    work_type: perfil.work_type || '',
    steps_per_day: perfil.steps_per_day ?? '',
  })
  const [guardando, setGuardando] = useState(false)
  const errores = {
    body_fat_pct: errNumero(f.body_fat_pct, LIM_GRASA, { opcional: true }),
    steps_per_day: errNumero(f.steps_per_day, LIM_PASOS, { opcional: true, entero: true }),
  }
  const hayError = Object.values(errores).some(Boolean)
  const cambio =
    String(f.body_fat_pct) !== String(perfil.body_fat_pct ?? '') ||
    f.work_type !== (perfil.work_type || '') ||
    String(f.steps_per_day) !== String(perfil.steps_per_day ?? '')
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }))

  async function guardar() {
    setGuardando(true)
    await onGuardar(f)
    setGuardando(false)
  }

  return (
    <Tarjeta titulo="Tus datos para el cálculo" icono="tune">
      <p className="text-xs text-gris mb-3">Todos son opcionales. Cuantos más cargues, más preciso es el cálculo.</p>
      <p className="text-sm font-medium mb-1.5">¿Cómo es tu día de trabajo o estudio?</p>
      <div className="space-y-2 mb-4">
        {TIPOS_DE_TRABAJO.map((t) => {
          const elegido = (f.work_type || TRABAJO_POR_DEFECTO) === t.valor
          return (
            <button
              key={t.valor}
              onClick={() => set('work_type')(t.valor)}
              aria-pressed={elegido}
              className={`w-full text-left rounded-2xl px-4 py-3 border transition ${elegido ? 'border-verde bg-verde-claro' : 'border-linea bg-superficie'}`}
            >
              <span className="block text-sm font-semibold">{t.texto}</span>
              <span className="block text-xs text-gris">{t.ejemplo}</span>
            </button>
          )
        })}
      </div>
      <label className="block mb-4">
        <span className="text-sm font-medium">Pasos por día (promedio)</span>
        <Numero
          valor={f.steps_per_day}
          onChange={set('steps_per_day')}
          decimales={0}
          largo={5}
          error={!!errores.steps_per_day}
          placeholder="Por ejemplo, 6000"
        />
        <Err>{errores.steps_per_day}</Err>
        <span className="block text-xs text-gris mt-1">Lo podés ver en tu celular o en tu reloj.</span>
      </label>
      <label className="block mb-4">
        <span className="text-sm font-medium">% de grasa corporal</span>
        <Numero
          valor={f.body_fat_pct}
          onChange={set('body_fat_pct')}
          decimales={1}
          largo={4}
          error={!!errores.body_fat_pct}
          placeholder="Opcional"
        />
        <Err>{errores.body_fat_pct}</Err>
        <span className="block text-xs text-gris mt-1">
          Si lo sabés, por ejemplo de una balanza de bioimpedancia. Con este dato el basal es más preciso.
        </span>
      </label>
      <button onClick={guardar} disabled={!cambio || hayError || guardando} className="btn w-full bg-verde text-white disabled:opacity-50">
        {guardando ? 'Guardando...' : 'Guardar'}
      </button>
    </Tarjeta>
  )
}

// ---------- Objetivo ----------
function Objetivo({ perfil, base, onGuardarModo, onUsar }) {
  const [modo, setModo] = useState(perfil.gasto_modo === 'dinamico' ? 'dinamico' : 'fijo')
  const [devuelve, setDevuelve] = useState(String(perfil.gasto_devuelve ?? 50))
  const [ajuste, setAjuste] = useState(perfil.gasto_ajuste_pct == null ? '' : String(Number(perfil.gasto_ajuste_pct)))
  const [guardando, setGuardando] = useState(false)
  const errDevuelve = errNumero(devuelve, [0, 100], { entero: true })
  const ajusteNum = ajuste === '' ? null : Number(ajuste)
  const cambio =
    modo !== (perfil.gasto_modo === 'dinamico' ? 'dinamico' : 'fijo') ||
    Number(devuelve) !== Number(perfil.gasto_devuelve ?? 50) ||
    ajusteNum !== (perfil.gasto_ajuste_pct == null ? null : Number(perfil.gasto_ajuste_pct))

  // El objetivo que saldría con lo elegido ahora (antes de guardar)
  const sugerido = useMemo(() => objetivoDesdeGasto({ ...perfil, gasto_ajuste_pct: ajusteNum }, base), [perfil, base, ajusteNum])

  async function guardar() {
    setGuardando(true)
    await onGuardarModo({ modo, devuelve, ajuste: ajusteNum })
    setGuardando(false)
  }

  return (
    <Tarjeta titulo="Tu objetivo de calorías" icono="trending_down" data-tour="gasto-objetivo">
      <div className="rounded-2xl bg-verde-claro p-3 mb-4">
        <p className="text-xs font-semibold text-gris">Objetivo guardado hoy</p>
        <p className="text-xl font-bold text-verde-texto">{miles(perfil.kcal_target)} kcal</p>
      </div>

      <p className="text-sm font-medium mb-1.5">Qué hacer con el ejercicio</p>
      <div className="flex gap-2 mb-2">
        <Chip activo={modo === 'fijo'} onClick={() => setModo('fijo')}>
          Objetivo fijo
        </Chip>
        <Chip activo={modo === 'dinamico'} onClick={() => setModo('dinamico')}>
          Se ajusta cada día
        </Chip>
      </div>
      <p className="text-xs text-gris mb-4">
        {modo === 'fijo'
          ? 'Tu objetivo es siempre el mismo, entrenes o no. Lo que gastás entrenando se ve aparte, como dato.'
          : 'Tu objetivo de cada día sale de tu gasto sin entrenar (con el recorte que elijas) más una parte de lo que entrenaste ese día.'}
      </p>

      {modo === 'dinamico' && (
        <>
          <label className="block mb-4">
            <span className="text-sm font-medium">Qué parte del ejercicio se suma al objetivo (%)</span>
            <Numero valor={devuelve} onChange={setDevuelve} decimales={0} largo={3} error={!!errDevuelve} />
            <Err>{errDevuelve}</Err>
            <span className="block text-xs text-gris mt-1">
              Se recomienda la mitad (50 %): las estimaciones de ejercicio suelen pasarse y comer de más es fácil.
            </span>
          </label>
          <label className="block mb-4">
            <span className="text-sm font-medium">Recorte o aumento sobre tu gasto</span>
            <select value={ajuste} onChange={(ev) => setAjuste(ev.target.value)} className="campo mt-1">
              {AJUSTES.map(([valor, texto]) => (
                <option key={String(valor)} value={valor == null ? '' : String(valor)}>
                  {texto}
                </option>
              ))}
            </select>
          </label>
        </>
      )}

      <button
        onClick={guardar}
        disabled={!cambio || !!errDevuelve || guardando}
        className="btn w-full bg-verde text-white disabled:opacity-50"
      >
        {guardando ? 'Guardando...' : 'Guardar'}
      </button>

      {sugerido && (
        <div className="mt-5 pt-4 border-t border-linea">
          <p className="text-sm font-medium">Lo que sale del cálculo</p>
          <p className="text-xs text-gris mt-0.5">
            Gasto de {miles(sugerido.mantenimiento)} kcal
            {sugerido.ajuste !== 0 && ` ${signo(sugerido.ajuste)} ${Math.abs(Math.round(sugerido.ajuste * 100))} %`} ={' '}
            <b className="text-tinta">{miles(sugerido.kcal)} kcal</b> y {sugerido.protein} g de proteína por día.
          </p>
          <button
            onClick={() => onUsar(sugerido)}
            disabled={sugerido.kcal === perfil.kcal_target && sugerido.protein === perfil.protein_target}
            className="btn w-full bg-verde-suave text-verde-texto mt-3 disabled:opacity-50"
          >
            Usar este cálculo como mi objetivo
          </button>
        </div>
      )}
    </Tarjeta>
  )
}

// ---------- Gasto real (con tus datos) ----------
function Progreso({ texto, valor, total }) {
  const pct = Math.min(100, Math.round((valor / total) * 100))
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between text-sm mb-1">
        <span>{texto}</span>
        <span className="text-gris">
          {Math.min(valor, total)} de {total}
        </span>
      </div>
      <div className="h-2 rounded-full bg-pista overflow-hidden">
        <div className="h-full rounded-full bg-verde" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function GastoReal({ perfil, real, onAplicar, onQuitar }) {
  const p = real.progreso
  return (
    <Tarjeta titulo="Tu gasto real" icono="show_chart" data-tour="gasto-real">
      <p className="text-xs text-gris mb-3">
        Si cargás tus comidas y te pesás seguido, la app puede despejar cuánto gastás de verdad: lo que comiste menos lo que cambió tu peso.
        Mira las últimas 4 semanas.
      </p>
      {!real.listo ? (
        <>
          <Progreso texto="Días con la comida cargada" valor={p.diasRegistrados} total={p.diasNecesarios} />
          <Progreso texto="Pesajes" valor={p.pesajes} total={p.pesajesNecesarios} />
          <ul className="text-xs text-gris space-y-1 list-disc pl-4">
            {real.faltan.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-3xl font-bold text-verde-texto leading-none">~{miles(real.gastoReal)}</p>
              <p className="text-xs text-gris mt-1">kcal por día, con todo</p>
            </div>
            <p className="text-sm text-gris text-right">
              Entre <b className="text-tinta">{miles(real.rango[0])}</b> y <b className="text-tinta">{miles(real.rango[1])}</b>
              <br />
              <span className="text-xs">Confianza {real.confianza}</span>
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4 text-center">
            <div className="rounded-2xl bg-campo p-3">
              <p className="text-xs text-gris">Comiste en promedio</p>
              <p className="font-bold">{miles(real.ingestaPromedio)} kcal</p>
            </div>
            <div className="rounded-2xl bg-campo p-3">
              <p className="text-xs text-gris">Tu peso cambió</p>
              <p className="font-bold">
                {signo(real.cambioPesoPorSemana)}
                {Math.abs(real.cambioPesoPorSemana).toLocaleString('es-AR', { maximumFractionDigits: 2 })} kg por semana
              </p>
            </div>
          </div>
          {real.mantenimientoFormula != null && (
            <p className="text-sm mt-3">
              Sin entrenar, tu gasto real da <b>{miles(real.mantenimientoReal)} kcal</b>; la fórmula decía{' '}
              {miles(real.mantenimientoFormula)} ({signo(real.diferenciaConFormula)}
              {Math.abs(Math.round(real.diferenciaConFormula * 100))} %).
            </p>
          )}
          {real.motivo && <p className="text-xs text-gris mt-3">{real.motivo}</p>}
          {real.factorAplicable && (
            <div className="mt-3">
              <button onClick={() => onAplicar(real.factor)} className="btn w-full bg-verde text-white">
                Ajustar mi gasto con estos datos
              </button>
              {real.objetivoSugerido && (
                <p className="text-xs text-gris mt-2">
                  Con el ajuste, tu objetivo sugerido sería de {miles(real.objetivoSugerido.kcal)} kcal. No se cambia solo: lo decidís vos.
                </p>
              )}
            </div>
          )}
        </>
      )}
      {perfil.gasto_factor != null && (
        <div className="mt-4 pt-4 border-t border-linea">
          <p className="text-sm">
            Tu gasto está <b>ajustado con tus datos</b>
            {perfil.gasto_factor_fecha ? ` desde el ${fechaCorta(perfil.gasto_factor_fecha)}` : ''} (factor{' '}
            {Number(perfil.gasto_factor).toLocaleString('es-AR')}).
          </p>
          <button onClick={onQuitar} className="btn w-full bg-campo text-tinta mt-2">
            Volver a la fórmula general
          </button>
        </div>
      )}
    </Tarjeta>
  )
}

// ---------- Pantalla ----------
export default function Gasto() {
  const d = useDatos()
  const { perfil, confirmar, avisar } = d
  const [consentimiento, setConsentimiento] = useState(false)
  const [trabajando, setTrabajando] = useState(false)
  const fecha = hoy()
  const activo = !!perfil.gasto_activo
  const base = d.gastoDe(fecha).base
  const peso = pesoDelDia(perfil, d.medidas, fecha)

  const real = useMemo(
    () =>
      activo
        ? calcularGastoReal({ perfil, registros: d.registros, medidas: d.medidas, entrenamientos: d.entrenamientos, hoy: fecha })
        : null,
    [activo, perfil, d.registros, d.medidas, d.entrenamientos, fecha],
  )

  async function activar() {
    setTrabajando(true)
    const listo = await d.activarGasto()
    setTrabajando(false)
    if (listo !== false) {
      setConsentimiento(false)
      avisar('Cálculo de gasto activado')
    }
  }

  async function apagar() {
    const seguir = await confirmar({
      titulo: '¿Apagar el cálculo de gasto?',
      texto: 'Tu objetivo vuelve a ser el fijo de siempre. Lo que anotaste de ejercicio queda guardado por si lo volvés a prender.',
      boton: 'Apagar',
      peligro: false,
    })
    if (seguir) await d.desactivarGasto()
  }

  async function borrarTodo() {
    const seguir = await confirmar({
      titulo: '¿Borrar todo lo de ejercicio?',
      texto:
        'Se borran tus entrenamientos, series, rutinas y las actividades y ejercicios que creaste. No se puede deshacer. Tu comida y tu peso no se tocan.',
      boton: 'Borrar todo',
    })
    if (!seguir) return
    const listo = await d.borrarMiEjercicio()
    if (listo !== false) avisar('Se borró todo lo de ejercicio')
  }

  async function usar(sugerido) {
    const seguir = await confirmar({
      titulo: '¿Cambiar tu objetivo?',
      texto: `Tu objetivo pasa a ser de ${miles(sugerido.kcal)} kcal y ${sugerido.protein} g de proteína por día.`,
      boton: 'Cambiar objetivo',
      peligro: false,
    })
    if (seguir) {
      const listo = await d.usarComoObjetivo({ kcal: sugerido.kcal, protein: sugerido.protein })
      if (listo !== false) avisar('Objetivo actualizado')
    }
  }

  async function aplicarFactor(factor) {
    const seguir = await confirmar({
      titulo: '¿Ajustar tu gasto?',
      texto: 'Desde ahora tu gasto se calcula con este ajuste en vez de la fórmula general. Lo podés sacar cuando quieras.',
      boton: 'Ajustar',
      peligro: false,
    })
    if (seguir) {
      const listo = await d.fijarFactorPropio(factor)
      if (listo !== false) avisar('Gasto ajustado con tus datos')
    }
  }

  return (
    <Marco titulo="Gasto y ejercicio" atras>
      {!activo ? (
        <Presentacion onActivar={() => setConsentimiento(true)} />
      ) : (
        <div className="dos-columnas">
          <div className="min-w-0">
            <Link to="/ejercicio" className="tarjeta p-4 mb-4 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-verde-claro text-verde-texto flex items-center justify-center">
                <Icono n="fitness_center" size={20} />
              </span>
              <span className="flex-1">
                <span className="block font-semibold">Mi ejercicio</span>
                <span className="block text-xs text-gris">Anotá entrenamientos y armá tus rutinas de gimnasio</span>
              </span>
              <Icono n="chevron_right" className="text-gris" size={20} />
            </Link>
            {base ? (
              <ComoSeCalcula base={base} />
            ) : (
              <Tarjeta titulo="Tu gasto" icono="bolt">
                <p className="text-sm text-gris">
                  No se puede calcular todavía: revisá en tu perfil que estén cargados tu sexo, fecha de nacimiento, altura y peso
                  {peso ? '' : ' (hoy no hay ningún peso)'}.
                </p>
              </Tarjeta>
            )}
            <TusDatos
              key={`${perfil.work_type}|${perfil.steps_per_day}|${perfil.body_fat_pct}`}
              perfil={perfil}
              onGuardar={d.guardarDatosGasto}
            />
          </div>
          <div className="min-w-0">
            {base && (
              <Objetivo
                key={`${perfil.gasto_modo}|${perfil.gasto_devuelve}|${perfil.gasto_ajuste_pct}|${perfil.kcal_target}|${perfil.gasto_factor}`}
                perfil={perfil}
                base={base}
                onGuardarModo={d.guardarModoGasto}
                onUsar={usar}
              />
            )}
            {real && <GastoReal perfil={perfil} real={real} onAplicar={aplicarFactor} onQuitar={() => d.fijarFactorPropio(null)} />}
            <Tarjeta titulo="Tus datos de ejercicio" icono="lock_reset">
              <p className="text-xs text-gris mb-3">
                Son solo tuyos. Podés apagar el cálculo (no se borra nada) o borrar todo lo que anotaste de ejercicio.
              </p>
              <button onClick={apagar} className="btn w-full bg-campo text-tinta mb-2">
                Apagar el cálculo de gasto
              </button>
              <button onClick={borrarTodo} className="btn w-full bg-rojo-suave text-rojo-texto">
                Borrar todo lo de ejercicio
              </button>
            </Tarjeta>
          </div>
        </div>
      )}
      {consentimiento && <HojaConsentimiento onCerrar={() => setConsentimiento(false)} onAceptar={activar} trabajando={trabajando} />}
    </Marco>
  )
}
