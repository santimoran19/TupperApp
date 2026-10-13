// Cambiar la cantidad de algo que ya se anotó (desde el Diario). Las calorías y los macros se recalculan; si el registro
// había descontado de la despensa, la despensa se ajusta por la diferencia (ver lib/ajuste.js). Cuando el cambio toca la
// despensa se pregunta antes, contando qué pasa; si no, se guarda directo.
import { useState } from 'react'
import { ajustarRegistro, cantidadDeRegistro, describirAjuste, pasaDeCalorias, tocaLaDespensa } from '../lib/ajuste'
import { redondear, unidadDe } from '../lib/nutricion'
import { errCantidad, errNumero, LIM, maxPorComida } from '../lib/validar'
import { useDatos } from '../store/Datos'
import { Err, Hoja, Numero } from './ui'

export default function EditarRegistro({ registro, onCerrar }) {
  const d = useDatos()
  const alimento = registro.food_id ? d.alimentosPorId.get(registro.food_id) : null
  const [texto, setTexto] = useState(String(redondear(registro.qty, 2)))
  const [guardando, setGuardando] = useState(false)

  const n = Number(texto)
  const error =
    texto.trim() === ''
      ? 'Poné una cantidad.'
      : alimento
        ? errCantidad(alimento, texto, maxPorComida(alimento))
        : errNumero(texto, registro.recipe_id ? LIM.porciones : [0.01, 1000000])
  const sinCambio = !error && redondear(n, 2) === redondear(registro.qty, 2)
  const muyAlta = !error && !sinCambio && pasaDeCalorias(registro, n)
  const ok = !error && !sinCambio && !muyAlta
  const vista = ok ? ajustarRegistro(registro, n, d.stock, d.preparado) : null

  async function guardar() {
    if (!ok || guardando) return
    const saber = { alimento: (id) => d.alimentosPorId.get(id), receta: (id) => d.recetasPorId.get(id) }
    const { efectos, avisos } = describirAjuste(vista, saber)
    setGuardando(true)
    try {
      // Solo se pregunta cuando el cambio mueve la despensa
      if (tocaLaDespensa(vista)) {
        const antes = cantidadDeRegistro(registro, alimento)
        const despues = cantidadDeRegistro({ ...registro, qty: redondear(n, 2) }, alimento)
        const seguir = await d.confirmar({
          titulo: `Vas a cambiar ${registro.name} de ${antes} a ${despues}`,
          texto: [...efectos, ...avisos].join(' '),
          boton: 'Cambiar',
          peligro: false,
        })
        if (!seguir) return
      }
      const listo = await d.editarRegistro(registro.id, n)
      if (!listo) return
      if (avisos.length) d.avisar(avisos.join(' '), 'aviso')
      else d.avisar('Cantidad cambiada')
      onCerrar()
    } finally {
      setGuardando(false)
    }
  }

  return (
    <Hoja titulo="Cambiar cantidad" onCerrar={onCerrar}>
      <p className="font-medium">{registro.name}</p>
      <div className="flex items-center gap-2 mt-3">
        <Numero
          valor={texto}
          onChange={setTexto}
          decimales={2}
          largo={7}
          error={!!error || muyAlta}
          className="campo h-11 w-28 text-center font-semibold"
          aria-label="Cantidad"
          autoFocus
          onKeyDown={(ev) => ev.key === 'Enter' && guardar()}
        />
        <span className="text-sm text-gris">
          {alimento ? unidadDe(alimento, n) : registro.recipe_id ? (n === 1 ? 'porción' : 'porciones') : ''}
        </span>
        <span className="ml-auto text-sm text-gris whitespace-nowrap">antes: {cantidadDeRegistro(registro, alimento)}</span>
      </div>
      <Err>{error || (muyAlta ? 'Esa cantidad tiene demasiadas calorías.' : '')}</Err>
      <p className="mt-3 text-sm text-gris">
        {vista
          ? `${redondear(vista.registro.kcal)} kcal · ${redondear(vista.registro.protein)} g de proteína`
          : `${redondear(registro.kcal)} kcal · ${redondear(registro.protein)} g de proteína`}
      </p>
      <button onClick={guardar} disabled={!ok || guardando} className="btn w-full mt-5 bg-verde text-white disabled:opacity-50">
        Guardar
      </button>
    </Hoja>
  )
}
