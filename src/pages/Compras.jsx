// Lista de compras: lo que falta para el plan, lo anotado a mano y el gasto del mes.
import { useMemo, useState } from 'react'
import Marco from '../components/Marco'
import SelectorAlimento from '../components/SelectorAlimento'
import { Err, Hoja, Icono, Numero, Vacio, pesos } from '../components/ui'
import { useDatos } from '../store/Datos'
import { fechaCorta, hoy, mesDe, nombreMes } from '../lib/fechas'
import { cantidadTexto, pasoDe, unidadDe } from '../lib/nutricion'
import { LIM, errCantidad, errNumero, maxEnStock } from '../lib/validar'

// Redondea lo que falta a una cantidad razonable de comprar
function redondearCompra(a, falta) {
  if (a.unit === 'u') return Math.ceil(falta - 0.001)
  return Math.ceil(falta / 50) * 50
}

export default function Compras() {
  const d = useDatos()
  const [comprando, setComprando] = useState(null) // { alimento, qty, price }
  const [agregando, setAgregando] = useState(false)

  const delPlan = useMemo(
    () => [...d.planFuturo.faltantes]
      .filter(([id]) => d.alimentosPorId.has(id) && !d.lista.some((l) => l.food_id === id))
      .map(([id, falta]) => ({ a: d.alimentosPorId.get(id), qty: redondearCompra(d.alimentosPorId.get(id), falta) }))
      .sort((x, y) => x.a.category.localeCompare(y.a.category, 'es') || x.a.name.localeCompare(y.a.name, 'es')),
    [d.planFuturo, d.alimentosPorId, d.lista],
  )
  const manuales = d.lista.filter((l) => d.alimentosPorId.has(l.food_id)).map((l) => ({ id: l.id, a: d.alimentosPorId.get(l.food_id), qty: Number(l.qty) }))
  const mes = mesDe(hoy())
  const comprasMes = d.compras.filter((c) => mesDe(c.date) === mes).sort((a, b) => b.date.localeCompare(a.date))
  const gasto = comprasMes.reduce((s, c) => s + Number(c.price), 0)

  const errCompra = comprando
    ? { qty: errCantidad(comprando.alimento, comprando.qty, maxEnStock(comprando.alimento)), price: errNumero(comprando.price, LIM.precio, { opcional: true }) }
    : {}
  async function confirmar() {
    if (errCompra.qty || errCompra.price) return
    const listo = await d.comprar({ food_id: comprando.alimento.id, qty: Number(comprando.qty), price: Number(comprando.price) || 0 })
    if (listo) { setComprando(null); d.avisar('Sumado a tu despensa') }
  }

  const Fila = ({ a, qty, origen, id }) => (
    <div className="flex items-center gap-2 py-3">
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{a.name}</p>
        <p className="text-xs text-gris">{cantidadTexto(a, qty)} · {origen}</p>
      </div>
      {id && <button onClick={() => d.quitarDeLista(id)} className="w-8 h-8 text-gris" aria-label={`Quitar ${a.name}`}><Icono n="close" size={18} /></button>}
      <button onClick={() => setComprando({ alimento: a, qty: String(qty), price: '' })} className="btn-chico bg-verde text-white"><Icono n="check" size={16} /> Comprado</button>
    </div>
  )

  return (
    <Marco titulo="Lista de compras" atras>
      <section className="rounded-3xl bg-verde text-white p-5 mb-4">
        <p className="text-xs font-semibold opacity-80">Gastaste en {nombreMes(hoy())}</p>
        <p className="text-3xl font-bold mt-1">{pesos(gasto)}</p>
        <p className="text-sm opacity-80 mt-1">{comprasMes.length} {comprasMes.length === 1 ? 'compra anotada' : 'compras anotadas'}</p>
      </section>

      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Para comprar</h2>
        <button onClick={() => setAgregando(true)} className="btn-chico bg-verde-suave text-verde"><Icono n="add" size={16} /> Anotar</button>
      </div>
      {delPlan.length + manuales.length === 0 ? (
        <Vacio icono="shopping_cart" titulo="No falta nada" texto="Cuando al plan le falte un ingrediente, aparece acá solo." />
      ) : (
        <div className="tarjeta px-4 divide-y divide-linea">
          {delPlan.map((x) => <Fila key={x.a.id} a={x.a} qty={x.qty} origen="falta para el plan" />)}
          {manuales.map((x) => <Fila key={x.id} a={x.a} qty={x.qty} origen="anotado por vos" id={x.id} />)}
        </div>
      )}

      {comprasMes.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mt-6 mb-2">Compras del mes</h2>
          <div className="tarjeta px-4 divide-y divide-linea">
            {comprasMes.map((c) => {
              const a = c.food_id && d.alimentosPorId.get(c.food_id)
              return (
                <div key={c.id} className="flex items-center gap-2 py-3 text-sm">
                  <span className="w-11 text-gris">{fechaCorta(c.date)}</span>
                  <span className="flex-1 min-w-0 truncate">{c.name}{a ? ` · ${cantidadTexto(a, Number(c.qty))}` : ''}</span>
                  <span className="font-semibold">{pesos(c.price)}</span>
                  <button onClick={async () => { if (await d.confirmar({ titulo: `¿Borrar la compra de ${c.name}?`, texto: 'Se descuenta del gasto del mes. Lo que se sumó a la despensa queda como está.' })) d.borrarCompra(c.id) }} className="w-7 h-7 text-gris" aria-label="Borrar compra"><Icono n="delete" size={18} /></button>
                </div>
              )
            })}
          </div>
        </>
      )}

      {agregando && (
        <Hoja titulo="Anotar para comprar" onCerrar={() => setAgregando(false)}>
          <SelectorAlimento onElegir={async (a) => { setAgregando(false); await d.agregarALista(a.id, pasoDe(a) * (a.unit === 'u' ? 1 : 10)) }} />
        </Hoja>
      )}
      {comprando && (
        <Hoja titulo={comprando.alimento.name} onCerrar={() => setComprando(null)}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="etiqueta" htmlFor="cp-cantidad">Cantidad ({comprando.alimento.unit === 'u' ? unidadDe(comprando.alimento) : comprando.alimento.unit})</label>
              <Numero id="cp-cantidad" valor={comprando.qty} onChange={(v) => setComprando({ ...comprando, qty: v })} decimales={comprando.alimento.unit === 'u' ? 1 : 0} largo={6} error={!!errCompra.qty} />
              <Err>{errCompra.qty}</Err>
            </div>
            <div>
              <label className="etiqueta" htmlFor="cp-precio">Precio total ($)</label>
              <Numero id="cp-precio" valor={comprando.price} onChange={(v) => setComprando({ ...comprando, price: v })} decimales={2} largo={11} placeholder="Opcional" autoFocus error={!!errCompra.price} />
              <Err>{errCompra.price}</Err>
            </div>
          </div>
          <p className="text-xs text-gris mt-2">Se suma a tu despensa y el precio cuenta para el gasto del mes.</p>
          <button onClick={confirmar} disabled={!!errCompra.qty || !!errCompra.price} className="btn-primario w-full mt-4">Confirmar compra</button>
        </Hoja>
      )}
    </Marco>
  )
}
