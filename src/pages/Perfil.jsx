// Perfil: objetivo, progreso de peso y cintura, y comidas que se hacen fuera de casa.
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Marco from '../components/Marco'
import FormularioPerfil from '../components/FormularioPerfil'
import { Err, Hoja, Icono, Numero } from '../components/ui'
import { useDatos } from '../store/Datos'
import { diasCortos, fechaCorta, hoy } from '../lib/fechas'
import { COMIDAS, NOMBRE_COMIDA, litros, objetivoLiquido, redondear } from '../lib/nutricion'
import { LIM, errFecha, errNumero } from '../lib/validar'
import { TEMAS, elegirTema, temaGuardado } from '../lib/tema'
import { VERSION } from '../lib/eventos'

function Grafico({ puntos, meta }) {
  if (puntos.length < 2) return <p className="text-sm text-gris">Cuando tengas dos registros aparece la curva.</p>
  const W = 380, H = 150, m = { i: 34, d: 10, a: 12, b: 22 }
  const valores = puntos.map((p) => p.v).concat(meta ? [meta] : [])
  const min = Math.min(...valores) - 1
  const max = Math.max(...valores) + 1
  const x = (i) => m.i + (i * (W - m.i - m.d)) / (puntos.length - 1)
  const y = (v) => m.a + ((max - v) * (H - m.a - m.b)) / (max - min)
  const linea = puntos.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.v).toFixed(1)}`).join(' ')
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {[min + 1, (min + max) / 2, max - 1].map((v) => (
        <g key={v}>
          <line x1={m.i} x2={W - m.d} y1={y(v)} y2={y(v)} className="stroke-linea" />
          <text x={m.i - 6} y={y(v) + 4} textAnchor="end" fontSize="10" className="fill-gris">{redondear(v, 1)}</text>
        </g>
      ))}
      {meta && (
        <g>
          <line x1={m.i} x2={W - m.d} y1={y(meta)} y2={y(meta)} className="stroke-naranja" strokeDasharray="5 4" />
          <text x={W - m.d} y={y(meta) - 4} textAnchor="end" fontSize="10" className="fill-naranja-oscuro">meta {meta} kg</text>
        </g>
      )}
      <path d={linea} fill="none" className="stroke-verde-texto" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {puntos.map((p, i) => <circle key={p.f} cx={x(i)} cy={y(p.v)} r="3.5" className="fill-verde-texto" />)}
      <text x={x(0)} y={H - 6} fontSize="10" className="fill-gris">{fechaCorta(puntos[0].f)}</text>
      <text x={x(puntos.length - 1)} y={H - 6} textAnchor="end" fontSize="10" className="fill-gris">{fechaCorta(puntos[puntos.length - 1].f)}</text>
    </svg>
  )
}

export default function Perfil() {
  const { perfil, usuario, medidas, reglas, guardarPerfil, guardarMedida, borrarMedida, alternarRegla, salir, avisar, exportar, borrarCuenta, confirmar } = useDatos()
  const [borrando, setBorrando] = useState(null) // texto de confirmación para borrar la cuenta
  const [trabajando, setTrabajando] = useState(false)

  // Arma un archivo con todo lo del usuario y lo descarga
  async function descargar() {
    setTrabajando(true)
    const datos = await exportar()
    setTrabajando(false)
    if (!datos) return
    const enlace = document.createElement('a')
    enlace.href = URL.createObjectURL(new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' }))
    enlace.download = `tupper-mis-datos-${hoy()}.json`
    enlace.click()
    URL.revokeObjectURL(enlace.href)
    avisar('Archivo descargado')
  }
  async function borrarTodo() {
    setTrabajando(true)
    const listo = await borrarCuenta()
    if (!listo) setTrabajando(false)
    else nav('/', { replace: true })
  }
  const nav = useNavigate()
  const [editando, setEditando] = useState(false)
  const [tema, setTema] = useState(temaGuardado)
  const [nueva, setNueva] = useState(null)

  const ordenadas = useMemo(() => [...medidas].sort((a, b) => a.date.localeCompare(b.date)), [medidas])
  const pesos = ordenadas.filter((m) => m.weight_kg).map((m) => ({ f: m.date, v: Number(m.weight_kg) }))
  const actual = pesos.length ? pesos[pesos.length - 1].v : Number(perfil.weight_kg) || null
  const inicio = pesos.length ? pesos[0].v : actual
  const bajado = actual && inicio ? redondear(inicio - actual, 1) : 0
  const falta = actual && perfil.goal_weight_kg ? redondear(actual - perfil.goal_weight_kg, 1) : null

  const errMedida = nueva
    ? {
        date: errFecha(nueva.date, { min: '2000-01-01', max: hoy() }),
        peso: errNumero(nueva.peso, LIM.peso, { opcional: true }),
        cintura: errNumero(nueva.cintura, LIM.cintura, { opcional: true }),
      }
    : {}
  const medidaOk = nueva && !errMedida.date && !errMedida.peso && !errMedida.cintura && (nueva.peso !== '' || nueva.cintura !== '')

  // Al cambiar una regla, el plan que ya estaba armado para esos días se pone al día solo
  async function cambiarRegla(dia, comida) {
    const r = await alternarRegla(dia, comida)
    if (!r || r.marcadas === 0) return
    const n = r.marcadas
    if (!r.afuera) return avisar(`${n} ${n === 1 ? 'comida del plan vuelve' : 'comidas del plan vuelven'} a ser en casa`)
    const c = r.cambiadas.length
    avisar(`${n} ${n === 1 ? 'comida del plan pasa' : 'comidas del plan pasan'} a ser para llevar${c ? ` (${c} ${c === 1 ? 'receta cambiada' : 'recetas cambiadas'})` : ''}`)
  }

  async function guardarNueva() {
    if (!medidaOk) return
    const listo = await guardarMedida({ date: nueva.date, weight_kg: Number(nueva.peso) || null, waist_cm: Number(nueva.cintura) || null })
    if (listo) { setNueva(null); avisar('Medida guardada') }
  }

  return (
    <Marco titulo="Perfil" atras>
      <section className="tarjeta p-5 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-verde text-white text-xl font-semibold flex items-center justify-center">
            {perfil.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-lg truncate">{perfil.name}</p>
            <p className="text-sm text-gris truncate">{usuario.email}</p>
          </div>
          <button onClick={() => setEditando(true)} className="btn-chico bg-verde-suave text-verde-texto"><Icono n="edit" size={16} /> Editar</button>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="rounded-xl bg-verde-claro p-3">
            <p className="text-xs text-gris font-semibold">Calorías</p>
            <p className="text-xl font-bold text-verde-texto">{perfil.kcal_target}</p>
          </div>
          <div className="rounded-xl bg-coral-suave p-3">
            <p className="text-xs text-gris font-semibold">Proteína</p>
            <p className="text-xl font-bold text-coral-oscuro">{perfil.protein_target} g</p>
          </div>
          <div className="rounded-xl bg-teal-suave p-3">
            <p className="text-xs text-gris font-semibold">Líquido</p>
            <p className="text-xl font-bold text-teal-oscuro">{litros(objetivoLiquido(perfil))} L</p>
          </div>
        </div>
        <p className="text-xs text-gris mt-2">Objetivos por día.</p>
      </section>

      <section className="tarjeta p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Progreso</h2>
          <button onClick={() => setNueva({ date: hoy(), peso: '', cintura: '' })} className="btn-chico bg-verde text-white"><Icono n="add" size={16} /> Anotar</button>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <div><p className="text-xs text-gris">Actual</p><p className="font-bold">{actual ? `${actual} kg` : '—'}</p></div>
          <div><p className="text-xs text-gris">{bajado >= 0 ? 'Bajaste' : 'Subiste'}</p><p className="font-bold text-verde-texto">{Math.abs(bajado)} kg</p></div>
          <div><p className="text-xs text-gris">Falta</p><p className="font-bold">{falta === null ? '—' : falta <= 0 ? '¡Llegaste!' : `${falta} kg`}</p></div>
        </div>
        <Grafico puntos={pesos} meta={Number(perfil.goal_weight_kg) || null} />
        {ordenadas.length > 0 && (
          <div className="mt-3 divide-y divide-linea">
            {[...ordenadas].reverse().slice(0, 6).map((m) => (
              <div key={m.date} className="flex items-center py-2 text-sm">
                <span className="w-14 text-gris">{fechaCorta(m.date)}</span>
                <span className="flex-1 font-medium">{m.weight_kg ? `${Number(m.weight_kg)} kg` : '—'}</span>
                <span className="w-24 text-gris">{m.waist_cm ? `${Number(m.waist_cm)} cm cintura` : ''}</span>
                <button onClick={async () => { if (await confirmar({ titulo: `¿Borrar la medida del ${fechaCorta(m.date)}?` })) borrarMedida(m.date) }} className="w-8 h-8 text-gris" aria-label={`Borrar la medida del ${fechaCorta(m.date)}`}><Icono n="delete" size={18} /></button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="tarjeta p-5 mb-4">
        <h2 className="font-semibold">Comidas fuera de casa</h2>
        <p className="text-sm text-gris mt-1 mb-3">
          Marcá las comidas que todas las semanas hacés afuera (trabajo, estudio, lo que sea). El plan usa recetas que se pueden llevar para esos días, te avisa qué preparar y, si ya tenías la semana armada, la actualiza.
        </p>
        <div className="grid grid-cols-[84px_repeat(7,1fr)] gap-1 text-center text-xs">
          <span />
          {diasCortos.map((d) => <span key={d} className="font-semibold text-gris">{d}</span>)}
          {COMIDAS.map((c) => (
            <div key={c} className="contents">
              <span className="text-left font-medium self-center">{NOMBRE_COMIDA[c]}</span>
              {diasCortos.map((_, i) => {
                const activo = reglas.some((r) => r.weekday === i && r.meal === c)
                return (
                  <button key={i} onClick={() => cambiarRegla(i, c)} aria-label={`${NOMBRE_COMIDA[c]} ${diasCortos[i]}`}
                    className={`h-9 rounded-lg flex items-center justify-center ${activo ? 'bg-naranja-fuerte text-white' : 'bg-campo text-gris/80'}`}>
                    <Icono n="takeout_dining" size={18} lleno={activo} />
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </section>

      <section className="tarjeta p-5 mb-4">
        <h2 className="font-semibold">Apariencia</h2>
        <p className="text-sm text-gris mt-1 mb-3">En automático la app sigue el modo claro u oscuro de tu teléfono.</p>
        <div className="grid grid-cols-3 gap-1 bg-campo rounded-full p-1" role="radiogroup" aria-label="Tema de la app">
          {TEMAS.map(([valor, nombre]) => (
            <button key={valor} role="radio" aria-checked={tema === valor} onClick={() => { elegirTema(valor); setTema(valor) }}
              className={`h-9 rounded-full text-[13px] font-semibold transition ${tema === valor ? 'bg-superficie text-verde-texto shadow-tarjeta' : 'text-gris'}`}>
              {nombre}
            </button>
          ))}
        </div>
      </section>

      <section className="tarjeta px-4 mb-4 divide-y divide-linea">
        {[['/resumen', 'bar_chart', 'Resumen de la semana'], ['/alimentos', 'eco', 'Mis alimentos']].map(([a, icono, texto]) => (
          <Link key={a} to={a} className="flex items-center gap-3 py-3.5">
            <Icono n={icono} className="text-verde-texto" size={20} /> <span className="flex-1 font-medium">{texto}</span> <Icono n="chevron_right" className="text-gris" size={20} />
          </Link>
        ))}
        <button onClick={descargar} disabled={trabajando} className="w-full flex items-center gap-3 py-3.5 text-left">
          <Icono n="download" className="text-verde-texto" size={20} /> <span className="flex-1 font-medium">Descargar mis datos</span>
        </button>
        {[['/terminos', 'Términos de uso'], ['/privacidad', 'Política de privacidad']].map(([a, texto]) => (
          <Link key={a} to={a} className="flex items-center gap-3 py-3.5">
            <Icono n="description" className="text-gris" size={20} /> <span className="flex-1 font-medium">{texto}</span> <Icono n="chevron_right" className="text-gris" size={20} />
          </Link>
        ))}
      </section>

      <button onClick={() => { nav('/', { replace: true }); salir() }} className="btn w-full bg-superficie border border-linea text-rojo-texto"><Icono n="logout" size={20} /> Cerrar sesión</button>
      <button onClick={() => setBorrando('')} className="mx-auto mt-5 text-sm text-gris underline flex items-center gap-1.5"><Icono n="person_remove" size={16} /> Borrar mi cuenta</button>
      {VERSION && <p className="mt-6 text-center text-xs text-gris">Tupper {VERSION}</p>}

      {editando && (
        <Hoja titulo="Editar perfil" onCerrar={() => setEditando(false)}>
          <FormularioPerfil inicial={perfil} textoBoton="Guardar" onGuardar={async (d) => { if (await guardarPerfil(d)) { setEditando(false); avisar('Perfil guardado') } }} />
        </Hoja>
      )}
      {borrando !== null && (
        <Hoja titulo="Borrar mi cuenta" onCerrar={() => !trabajando && setBorrando(null)}>
          <p className="text-sm">Se borran tu perfil, tus registros, tu despensa, tus recetas y tu plan. <b>No se puede deshacer.</b></p>
          <p className="text-sm text-gris mt-2">Si querés quedarte con una copia, cerrá esto y tocá "Descargar mis datos" antes.</p>
          <label className="etiqueta mt-4" htmlFor="bc-confirmar">Para confirmar, escribí BORRAR</label>
          <input id="bc-confirmar" className="campo" maxLength={10} autoCapitalize="characters" autoComplete="off" value={borrando} onChange={(e) => setBorrando(e.target.value)} />
          <button onClick={borrarTodo} disabled={borrando.trim().toUpperCase() !== 'BORRAR' || trabajando} className="btn w-full mt-4 bg-rojo text-white">Borrar todo para siempre</button>
        </Hoja>
      )}
      {nueva && (
        <Hoja titulo="Anotar medidas" onCerrar={() => setNueva(null)}>
          <div className="space-y-3">
            <div>
              <label className="etiqueta" htmlFor="md-fecha">Fecha</label>
              <input id="md-fecha" type="date" className={`campo ${errMedida.date ? '!border-rojo-texto !bg-rojo-suave/40' : ''}`} value={nueva.date} min="2000-01-01" max={hoy()} onChange={(e) => setNueva({ ...nueva, date: e.target.value })} />
              <Err>{errMedida.date}</Err>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="etiqueta" htmlFor="md-peso">Peso (kg)</label>
                <Numero id="md-peso" valor={nueva.peso} onChange={(v) => setNueva({ ...nueva, peso: v })} decimales={1} largo={5} placeholder="79.4" error={!!errMedida.peso} />
                <Err>{errMedida.peso}</Err>
              </div>
              <div>
                <label className="etiqueta" htmlFor="md-cintura">Cintura (cm)</label>
                <Numero id="md-cintura" valor={nueva.cintura} onChange={(v) => setNueva({ ...nueva, cintura: v })} decimales={1} largo={5} placeholder="Opcional" error={!!errMedida.cintura} />
                <Err>{errMedida.cintura}</Err>
              </div>
            </div>
            <button onClick={guardarNueva} disabled={!medidaOk} className="btn-primario w-full">Guardar</button>
          </div>
        </Hoja>
      )}
    </Marco>
  )
}
