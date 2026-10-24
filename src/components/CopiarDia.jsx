// Copiar un día entero a otra fecha (F-08, 1.28): lo anotado en cada comida se vuelve a anotar en la fecha elegida, con
// las mismas cantidades. Sirve para los días que se come igual (o para cargar el de ayer de una).
import { useState } from 'react'
import { Hoja, Icono } from './ui'
import { useDatos } from '../store/Datos'
import { fechaLarga, hoy, sumarDias } from '../lib/fechas'
import { COMIDAS, EXTRA, NOMBRE_COMIDA } from '../lib/nutricion'
import { rangoDiario } from '../lib/validar'
import { platosDelDia } from '../lib/combos'

export default function CopiarDia({ fecha, onCopiado }) {
  const d = useDatos()
  const [abierta, setAbierta] = useState(false)
  const rango = rangoDiario()
  const propuesta = fecha === hoy() ? sumarDias(fecha, 1) : hoy()
  const [destino, setDestino] = useState(propuesta)
  const [descontar, setDescontar] = useState(true)
  const [trabajando, setTrabajando] = useState(false)
  const porComida = platosDelDia(d.registros, fecha, d)
  const cuantas = [...porComida.values()].reduce((n, l) => n + l.length, 0)
  const valido = destino && destino !== fecha && destino >= rango.min && destino <= rango.max

  const abrir = () => {
    setDestino(propuesta)
    setDescontar(propuesta <= hoy())
    setAbierta(true)
  }
  const copiar = async (ev) => {
    ev.preventDefault()
    if (!valido || trabajando) return
    setTrabajando(true)
    let copiadas = 0
    try {
      for (const comida of [...COMIDAS, EXTRA]) {
        const platos = porComida.get(comida)
        if (!platos?.length) continue
        const listo = await d.registrar({ date: destino, meal: comida, platos, descontar })
        if (!listo) break
        copiadas += platos.length
      }
    } finally {
      setTrabajando(false)
    }
    if (copiadas > 0) {
      d.avisar(`Copiado: ${copiadas === 1 ? '1 cosa' : `${copiadas} cosas`} al ${fechaLarga(destino).toLowerCase()}`)
      setAbierta(false)
      onCopiado?.(destino)
    }
  }

  return (
    <>
      <button onClick={abrir} className="btn-suave w-full mt-3" data-testid="copiar-dia">
        <Icono n="content_copy" size={20} /> Copiar este día a otra fecha
      </button>
      {abierta && (
        <Hoja titulo="Copiar este día" onCerrar={() => setAbierta(false)}>
          <form onSubmit={copiar}>
            <p className="text-sm text-gris mb-3">
              Se anota lo mismo del {fechaLarga(fecha).toLowerCase()} ({cuantas === 1 ? '1 cosa' : `${cuantas} cosas`}) en la fecha que
              elijas, con las mismas cantidades. Lo que ya tenga ese día queda como está.
            </p>
            <ul className="text-sm mb-4 space-y-1">
              {[...COMIDAS, EXTRA]
                .filter((c) => porComida.get(c)?.length)
                .map((c) => (
                  <li key={c} className="flex justify-between">
                    <span>{c === EXTRA ? 'Bebidas y entre comidas' : NOMBRE_COMIDA[c]}</span>
                    <span className="text-gris">{porComida.get(c).length}</span>
                  </li>
                ))}
            </ul>
            <label htmlFor="copiar-destino" className="text-sm font-semibold">
              Copiar al
            </label>
            <input
              id="copiar-destino"
              type="date"
              value={destino}
              min={rango.min}
              max={rango.max}
              onChange={(e) => {
                setDestino(e.target.value)
                setDescontar(e.target.value <= hoy())
              }}
              className="campo w-full mt-1"
            />
            {destino === fecha && <p className="text-xs text-rojo-texto mt-1">Elegí otro día.</p>}
            <label className="flex items-center gap-3 mt-4 text-sm">
              <input
                type="checkbox"
                checked={descontar}
                onChange={(e) => setDescontar(e.target.checked)}
                className="w-5 h-5 accent-verde"
              />
              Descontar de mi despensa lo que se usa
            </label>
            <button type="submit" disabled={!valido || trabajando} className="btn-primario w-full mt-4">
              <Icono n="content_copy" size={20} /> {trabajando ? 'Copiando…' : 'Copiar'}
            </button>
          </form>
        </Hoja>
      )}
    </>
  )
}
