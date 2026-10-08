// Datos personales y objetivo diario. Se usa al crear la cuenta y al editar el perfil.
import { useMemo, useState } from 'react'
import { Err, Numero } from './ui'
import { ACTIVIDADES, liquidoSugerido, objetivoSugerido } from '../lib/nutricion'
import { edad } from '../lib/fechas'
import { LIM, errFecha, errNumero, errTexto, hayErrores, rangoNacimiento } from '../lib/validar'

export default function FormularioPerfil({ inicial, textoBoton, onGuardar }) {
  const [f, setF] = useState({
    name: inicial?.name || '',
    sex: inicial?.sex || 'm',
    birth_date: inicial?.birth_date || '',
    height_cm: inicial?.height_cm ?? '',
    weight_kg: inicial?.weight_kg ?? '',
    goal_weight_kg: inicial?.goal_weight_kg ?? '',
    activity: inicial?.activity ?? 1.375,
    kcal_target: inicial?.kcal_target ?? '',
    protein_target: inicial?.protein_target ?? '',
    // en litros; vacío = se usa el sugerido según el peso
    liquido: inicial?.water_target_ml ? String(inicial.water_target_ml / 1000) : '',
  })
  // Si ya había un objetivo guardado, se respeta; si no, se va calculando solo.
  const [manual, setManual] = useState(!!inicial?.kcal_target)
  const [guardando, setGuardando] = useState(false)
  const [intento, setIntento] = useState(false) // los errores de campos vacíos se muestran recién al intentar guardar
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }))
  const nac = rangoNacimiento()

  const errDatos = {
    name: errTexto(f.name, { max: LIM.nombre }),
    birth_date: errFecha(f.birth_date, nac),
    height_cm: errNumero(f.height_cm, LIM.altura),
    weight_kg: errNumero(f.weight_kg, LIM.peso),
    goal_weight_kg: errNumero(f.goal_weight_kg, LIM.peso, { opcional: true }),
  }
  const datosOk = !hayErrores(errDatos)

  const sugerido = useMemo(
    () =>
      datosOk
        ? objetivoSugerido({
            sexo: f.sex,
            edad: edad(f.birth_date),
            altura: Number(f.height_cm),
            peso: Number(f.weight_kg),
            pesoMeta: Number(f.goal_weight_kg) || null,
            actividad: Number(f.activity),
          })
        : null,
    [datosOk, f.sex, f.birth_date, f.height_cm, f.weight_kg, f.goal_weight_kg, f.activity],
  )
  const kcal = manual ? f.kcal_target : (sugerido?.kcal ?? '')
  const prot = manual ? f.protein_target : (sugerido?.protein ?? '')
  const liquidoAuto = liquidoSugerido(datosOk ? f.weight_kg : null) / 1000
  const errObjetivo = {
    kcal: errNumero(kcal, LIM.kcalObjetivo, { entero: true }),
    prot: errNumero(prot, LIM.protObjetivo, { entero: true }),
    liquido:
      errNumero(f.liquido === '' ? '' : Number(f.liquido) * 1000, LIM.liquido, { opcional: true }) &&
      'Tiene que estar entre 0,5 y 6 litros.',
  }
  const valido = datosOk && !hayErrores(errObjetivo)
  // Un error de rango se muestra al toque; uno de "falta completar", solo después de tocar Guardar
  const ver = (k, e) => (e && (intento || !['', null, undefined].includes(k)) ? e : null)

  async function guardar(ev) {
    ev.preventDefault()
    setIntento(true)
    if (!valido) return
    setGuardando(true)
    await onGuardar({
      name: f.name.trim(),
      sex: f.sex,
      birth_date: f.birth_date,
      height_cm: Number(f.height_cm),
      weight_kg: Number(f.weight_kg),
      goal_weight_kg: Number(f.goal_weight_kg) || null,
      activity: Number(f.activity),
      kcal_target: Math.round(Number(kcal)),
      protein_target: Math.round(Number(prot)),
      water_target_ml: f.liquido === '' ? null : Math.round(Number(f.liquido) * 1000),
    })
    setGuardando(false)
  }

  return (
    <form onSubmit={guardar} noValidate className="space-y-3">
      <div>
        <label className="etiqueta" htmlFor="pf-nombre">
          Nombre
        </label>
        <input
          id="pf-nombre"
          className="campo"
          maxLength={LIM.nombre}
          value={f.name}
          onChange={(e) => set('name')(e.target.value)}
          placeholder="Cómo te llamamos"
        />
        <Err>{ver(f.name, errDatos.name)}</Err>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="etiqueta" htmlFor="pf-sexo">
            Sexo
          </label>
          <select id="pf-sexo" className="campo" value={f.sex} onChange={(e) => set('sex')(e.target.value)}>
            <option value="m">Masculino</option>
            <option value="f">Femenino</option>
          </select>
        </div>
        <div>
          <label className="etiqueta" htmlFor="pf-nac">
            Fecha de nacimiento
          </label>
          <input
            id="pf-nac"
            type="date"
            className={`campo ${ver(f.birth_date, errDatos.birth_date) ? '!border-rojo-texto !bg-rojo-suave/40' : ''}`}
            min={nac.min}
            max={nac.max}
            value={f.birth_date}
            onChange={(e) => set('birth_date')(e.target.value)}
          />
        </div>
        <div className="col-span-2 -mt-2 empty:hidden">
          <Err>{ver(f.birth_date, errDatos.birth_date)}</Err>
        </div>
        <div>
          <label className="etiqueta" htmlFor="pf-altura">
            Altura (cm)
          </label>
          <Numero
            id="pf-altura"
            valor={f.height_cm}
            onChange={set('height_cm')}
            decimales={0}
            largo={3}
            placeholder="170"
            error={!!ver(f.height_cm, errDatos.height_cm)}
          />
          <Err>{ver(f.height_cm, errDatos.height_cm)}</Err>
        </div>
        <div>
          <label className="etiqueta" htmlFor="pf-peso">
            Peso actual (kg)
          </label>
          <Numero
            id="pf-peso"
            valor={f.weight_kg}
            onChange={set('weight_kg')}
            decimales={1}
            largo={5}
            placeholder="80"
            error={!!ver(f.weight_kg, errDatos.weight_kg)}
          />
          <Err>{ver(f.weight_kg, errDatos.weight_kg)}</Err>
        </div>
        <div>
          <label className="etiqueta" htmlFor="pf-meta">
            Peso objetivo (kg)
          </label>
          <Numero
            id="pf-meta"
            valor={f.goal_weight_kg}
            onChange={set('goal_weight_kg')}
            decimales={1}
            largo={5}
            placeholder="Opcional"
            error={!!errDatos.goal_weight_kg}
          />
          <Err>{errDatos.goal_weight_kg}</Err>
        </div>
        <div>
          <label className="etiqueta" htmlFor="pf-act">
            Actividad
          </label>
          <select id="pf-act" className="campo" value={f.activity} onChange={(e) => set('activity')(e.target.value)}>
            {ACTIVIDADES.map((a) => (
              <option key={a.valor} value={a.valor}>
                {a.texto}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-2xl bg-verde-claro p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="font-semibold text-verde-texto">Objetivo diario</p>
          <button
            type="button"
            className="text-xs font-semibold text-verde-texto underline"
            onClick={() => {
              if (!manual) setF((s) => ({ ...s, kcal_target: sugerido?.kcal ?? '', protein_target: sugerido?.protein ?? '' }))
              setManual(!manual)
            }}
          >
            {manual ? 'Usar el calculado' : 'Poner el mío'}
          </button>
        </div>
        {!manual && !sugerido && (
          <p className="text-sm text-gris">Con la fecha de nacimiento, la altura y el peso bien cargados se calcula solo.</p>
        )}
        {(manual || sugerido) && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="etiqueta" htmlFor="pf-kcal">
                Calorías por día
              </label>
              <Numero
                id="pf-kcal"
                valor={kcal}
                onChange={set('kcal_target')}
                disabled={!manual}
                decimales={0}
                largo={4}
                className="campo bg-superficie disabled:opacity-70"
                error={manual && !!errObjetivo.kcal}
              />
              {manual && <Err>{errObjetivo.kcal}</Err>}
            </div>
            <div>
              <label className="etiqueta" htmlFor="pf-prot">
                Proteína por día (g)
              </label>
              <Numero
                id="pf-prot"
                valor={prot}
                onChange={set('protein_target')}
                disabled={!manual}
                decimales={0}
                largo={3}
                className="campo bg-superficie disabled:opacity-70"
                error={manual && !!errObjetivo.prot}
              />
              {manual && <Err>{errObjetivo.prot}</Err>}
            </div>
          </div>
        )}
        {!manual && sugerido && (
          <p className="text-xs text-gris mt-2">
            Estimado a partir de tus datos: gastás unas {sugerido.gasto.toLocaleString('es-AR')} kcal por día. Es un cálculo orientativo.
          </p>
        )}
        {sugerido?.menor && (
          <p className="text-xs text-naranja-oscuro mt-2">
            Como tenés menos de 18, el objetivo es lo que gastás, sin recorte. Para bajar de peso a tu edad, hacelo con un médico o un
            nutricionista.
          </p>
        )}
        <div className="mt-3">
          <label className="etiqueta" htmlFor="pf-liquido">
            Líquido por día (litros)
          </label>
          <Numero
            id="pf-liquido"
            valor={f.liquido}
            onChange={set('liquido')}
            decimales={1}
            largo={3}
            className="campo bg-superficie"
            placeholder={`${String(liquidoAuto).replace('.', ',')} (sugerido)`}
            error={!!errObjetivo.liquido}
          />
          <Err>{errObjetivo.liquido}</Err>
          <p className="text-xs text-gris mt-1">
            Si lo dejás vacío se usan unos 35 ml por kilo de peso. Cuenta agua, mate, infusiones y cualquier bebida sin alcohol.
          </p>
        </div>
      </div>
      <button type="submit" disabled={guardando} className="btn-primario w-full">
        {textoBoton}
      </button>
    </form>
  )
}
