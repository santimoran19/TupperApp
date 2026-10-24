// "Cómo te verías" (1.24): la silueta de hoy y la de otro peso, que se elige con el deslizador o arrastrando el dedo sobre
// el cuerpo. Sirve para ponerse una meta con algo que se ve, no solo con un número. Es una ilustración orientativa.
import { useEffect, useMemo, useRef, useState } from 'react'
import Silueta from './Silueta'
import Vista3D, { hayWebGL, tresDPrendido } from './Vista3D'
import { Icono } from './ui'
import { edad as edadDe } from '../lib/fechas'
import { ALTURA_MAX, ALTURA_MIN, escalaDe, grasaConPeso, grasaEstimada, nombreDeGrasa, pesoMinimoBarra } from '../lib/silueta'
import { redondear } from '../lib/nutricion'

const KG_POR_PIXEL = 1 / 7
// Los kilos con coma decimal, como se escriben acá (79,2 y no 79.2)
const kgTexto = (n) => redondear(n, 1).toLocaleString('es-AR')

// `perfil`: el de la persona. `peso`: el de hoy (la última medida). `onUsarMeta(kg)`: si está, aparece el botón para
// guardar el peso elegido como meta. `onGuardarAltura(cm)`: si está, la altura que se ajusta acá se puede guardar en el perfil.
export default function SiluetaInteractiva({ perfil, peso, onUsarMeta, onGuardarAltura, compacta = false }) {
  const sexo = perfil?.sex === 'f' ? 'f' : 'm'
  const alturaPerfil = Number(perfil?.height_cm) || null
  // La altura se puede ajustar acá mismo (1.28): cambia la regla, el % de grasa estimado y el ancho del cuerpo
  const [alturaElegida, setAlturaElegida] = useState(alturaPerfil)
  useEffect(() => {
    setAlturaElegida(alturaPerfil)
  }, [alturaPerfil])
  const altura = alturaElegida || alturaPerfil
  // Lo que está escrito en el campo (puede estar a medio escribir); la altura de verdad solo cambia con un valor válido
  const [textoAltura, setTextoAltura] = useState(String(altura || ''))
  useEffect(() => {
    setTextoAltura(String(altura || ''))
  }, [altura])
  const edad = perfil?.birth_date ? edadDe(perfil.birth_date) : null
  const propia = perfil?.body_fat_pct != null && perfil.body_fat_pct !== '' ? Number(perfil.body_fat_pct) : null
  const grasaHoy = propia ?? grasaEstimada({ peso, altura, edad, sexo })
  const meta = Number(perfil?.goal_weight_kg) || null

  const rango = useMemo(() => {
    if (!(peso > 0) || grasaHoy == null) return null
    // Hasta 50 kilos más que hoy (y al menos 150): hay personas de 120 kilos y más, y ver adónde se llega también sirve
    return [pesoMinimoBarra({ peso, altura }), Math.min(250, Math.ceil(Math.max(peso + 50, 150)))]
  }, [peso, grasaHoy, altura])
  const [elegido, setElegido] = useState(() => meta || (peso ? Math.round(peso - Math.max(2, peso * 0.08)) : null))
  const arrastre = useRef(null)
  const [tresD, setTresD] = useState(false)
  // Si la meta cambia desde afuera (el campo del formulario), la silueta la sigue
  useEffect(() => {
    if (meta) setElegido(meta)
  }, [meta])
  const cambiarAltura = (cm) => setAlturaElegida(Math.min(ALTURA_MAX, Math.max(ALTURA_MIN, Math.round(cm))))

  if (!rango || !altura || !edad) {
    return (
      <div className="rounded-2xl bg-campo p-4 text-sm text-gris flex items-center gap-3">
        <Icono n="accessibility_new" className="text-verde-texto" />
        Completá sexo, fecha de nacimiento, altura y peso en tu perfil para ver tu silueta.
      </div>
    )
  }
  const kg = Math.min(rango[1], Math.max(rango[0], Number(elegido) || peso))
  const datos = { peso, grasa: grasaHoy, sexo, altura }
  const grasaNueva = grasaConPeso(datos, kg)
  const escalaHoy = escalaDe(datos)
  const escalaNueva = escalaDe({ ...datos, peso: kg, grasa: grasaNueva })
  const diferenciaGrasa = redondear((kg * grasaNueva) / 100 - (peso * grasaHoy) / 100, 1)
  const fijar = (v) => setElegido(Math.round(Math.min(rango[1], Math.max(rango[0], v)) * 2) / 2)

  // Arrastrar sobre la silueta: a la izquierda baja de peso, a la derecha sube
  const empezar = (ev) => {
    arrastre.current = { x: ev.clientX, kg }
    ev.currentTarget.setPointerCapture?.(ev.pointerId)
  }
  const mover = (ev) => {
    if (!arrastre.current) return
    fijar(arrastre.current.kg + (ev.clientX - arrastre.current.x) * KG_POR_PIXEL)
  }
  const soltar = () => {
    arrastre.current = null
  }

  const puede3D = tresDPrendido() && hayWebGL()
  const siluetaNueva = (
    <div
      className="touch-none cursor-ew-resize select-none"
      onPointerDown={empezar}
      onPointerMove={mover}
      onPointerUp={soltar}
      onPointerCancel={soltar}
    >
      <Silueta
        grasa={grasaNueva}
        sexo={sexo}
        escala={escalaNueva}
        comparar={kg < peso ? grasaHoy : null}
        escalaComparar={escalaHoy}
        className={compacta ? 'w-28 max-w-[34vw]' : 'w-32 sm:w-36 max-w-[34vw]'}
        titulo={`Tu silueta con ${kgTexto(kg)} kilos`}
      />
    </div>
  )

  return (
    <div>
      {puede3D && (
        <div className="flex justify-end -mt-1 mb-1">
          <button
            type="button"
            onClick={() => setTresD(!tresD)}
            aria-pressed={tresD}
            className={`btn-chico h-8 ${tresD ? 'bg-verde text-white' : 'bg-campo text-tinta'}`}
          >
            <Icono n="3d_rotation" size={16} /> {tresD ? 'Ver en 2D' : 'Ver en 3D'}
          </button>
        </div>
      )}
      {tresD ? (
        <div className="flex flex-col items-center">
          <Vista3D
            tipo="cuerpo"
            props={{ sexo, grasa: grasaNueva, escala: escalaNueva, altura, modo: 'silueta' }}
            etiqueta={`Tu cuerpo en 3D con ${kgTexto(kg)} kilos`}
            className="w-full max-w-[280px]"
            lienzo="w-full h-80"
            sinTresD={siluetaNueva}
          />
          <p className="text-xs text-gris -mt-1">
            Arrastrá para girar · {kgTexto(kg)} kg · {String((altura / 100).toFixed(2)).replace('.', ',')} m
          </p>
        </div>
      ) : (
        <div className="flex items-end justify-center gap-2">
          <figure className="flex flex-col items-center">
            <Silueta
              grasa={grasaHoy}
              sexo={sexo}
              escala={escalaHoy}
              altura={altura}
              className={compacta ? 'w-32 max-w-[38vw]' : 'w-36 sm:w-40 max-w-[38vw]'}
              titulo="Tu silueta de hoy"
            />
            <figcaption className="text-center mt-1">
              <span className="block text-xs text-gris">Hoy</span>
              <span className="block font-bold">{kgTexto(peso)} kg</span>
            </figcaption>
          </figure>
          <Icono n="chevron_right" className="text-gris mb-14" />
          <figure className="flex flex-col items-center">
            {siluetaNueva}
            <figcaption className="text-center mt-1">
              <span className="block text-xs text-gris">Con</span>
              <span className="block font-bold text-verde-texto text-lg leading-tight">{kgTexto(kg)} kg</span>
            </figcaption>
          </figure>
        </div>
      )}

      <div className="mt-4">
        <label htmlFor="sil-peso" className="sr-only">
          Peso para ver la silueta
        </label>
        <input
          id="sil-peso"
          type="range"
          min={rango[0]}
          max={rango[1]}
          step="0.5"
          value={kg}
          onChange={(e) => fijar(Number(e.target.value))}
          className="w-full accent-[rgb(var(--c-verde))]"
          aria-valuetext={`${kgTexto(kg)} kilos`}
        />
        <div className="flex justify-between text-[11px] text-gris">
          <span>{rango[0]} kg</span>
          <span className="flex items-center gap-1">
            <Icono n="touch_app" size={14} /> Arrastrá el cuerpo o la barra
          </span>
          <span>{rango[1]} kg</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3 rounded-2xl bg-campo px-3 py-2" data-testid="silueta-altura">
        <Icono n="straighten" size={20} className="text-verde-texto" />
        <span className="text-sm flex-1">Altura</span>
        <button
          type="button"
          onClick={() => cambiarAltura(altura - 1)}
          disabled={altura <= ALTURA_MIN}
          className="toque w-9 h-9 rounded-full bg-superficie flex items-center justify-center"
          aria-label="Un centímetro menos"
        >
          <Icono n="remove" size={18} />
        </button>
        <label htmlFor="sil-altura" className="sr-only">
          Altura en centímetros
        </label>
        <input
          id="sil-altura"
          type="number"
          inputMode="numeric"
          min={ALTURA_MIN}
          max={ALTURA_MAX}
          value={textoAltura}
          onChange={(e) => {
            setTextoAltura(e.target.value)
            const v = Number(e.target.value)
            if (v >= ALTURA_MIN && v <= ALTURA_MAX) setAlturaElegida(Math.round(v))
          }}
          onBlur={() => setTextoAltura(String(altura))}
          className="w-14 h-9 rounded-xl bg-superficie text-center font-semibold"
        />
        <span className="text-sm text-gris">cm</span>
        <button
          type="button"
          onClick={() => cambiarAltura(altura + 1)}
          disabled={altura >= ALTURA_MAX}
          className="toque w-9 h-9 rounded-full bg-superficie flex items-center justify-center"
          aria-label="Un centímetro más"
        >
          <Icono n="add" size={18} />
        </button>
      </div>
      {onGuardarAltura && alturaPerfil && altura !== alturaPerfil && altura >= ALTURA_MIN && altura <= ALTURA_MAX && (
        <button type="button" onClick={() => onGuardarAltura(altura)} className="btn-suave w-full mt-2">
          <Icono n="check" size={20} /> Guardar {altura} cm como mi altura
        </button>
      )}

      <div className="grid grid-cols-2 gap-2 mt-3 text-center">
        <div className="rounded-2xl bg-campo p-3">
          <p className="text-[11px] text-gris">Grasa hoy{propia == null ? ' (estimada)' : ''}</p>
          <p className="font-bold">
            {Math.round(grasaHoy)} % <span className="text-xs font-semibold text-gris">· {nombreDeGrasa(grasaHoy, sexo)}</span>
          </p>
        </div>
        <div className="rounded-2xl bg-verde-suave p-3">
          <p className="text-[11px] text-verde-texto">Con {kgTexto(kg)} kg</p>
          <p className="font-bold text-verde-texto">
            {Math.round(grasaNueva)} % <span className="text-xs font-semibold">· {nombreDeGrasa(grasaNueva, sexo)}</span>
          </p>
        </div>
      </div>
      {Math.abs(diferenciaGrasa) >= 0.5 && (
        <p className="text-sm text-center mt-2">
          Serían unos{' '}
          <b>
            {Math.abs(diferenciaGrasa)} kg {diferenciaGrasa < 0 ? 'menos' : 'más'}
          </b>{' '}
          de grasa.
        </p>
      )}
      {onUsarMeta && Math.abs(kg - (meta || 0)) >= 0.5 && (
        <button type="button" onClick={() => onUsarMeta(kg)} className="btn-suave w-full mt-3">
          <Icono n="check" size={20} /> Usar {kgTexto(kg)} kg como mi meta
        </button>
      )}
      <p className="text-[11px] text-gris mt-2 leading-snug">
        Es una ilustración orientativa.{' '}
        {propia == null ? 'El % de grasa se estima con tu IMC y tu edad (fórmula de Deurenberg) y puede errar unos 4 puntos. ' : ''}
        Supone que de lo que se baja, unos 3/4 son grasa.
      </p>
    </div>
  )
}
