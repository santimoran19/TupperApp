// Lista de compras: lo que falta para el plan, lo anotado a mano y el gasto del mes.
import { useEffect, useMemo, useState } from 'react'
import Marco from '../components/Marco'
import SelectorAlimento from '../components/SelectorAlimento'
import { Chip, Err, Hoja, Icono, Numero, Vacio, pesos } from '../components/ui'
import { useDatos } from '../store/Datos'
import { fechaCorta, hoy, mesDe, nombreMes } from '../lib/fechas'
import { cantidadTexto, pasoDe, redondear, unidadDe } from '../lib/nutricion'
import { convertir, nombreCorto } from '../lib/equivalencias'
import { enlaceWhatsApp, textoDeLista } from '../lib/compartir'
import { LIM, errCantidad, errNumero, maxEnStock } from '../lib/validar'
import Foto from '../components/Foto'
import { fechaAlSumar } from '../lib/despensa'
import { aplicarQuitadas, guardarQuitadas, leerQuitadas } from '../lib/comprasQuitadas'

// Redondea lo que falta a una cantidad razonable de comprar
function redondearCompra(a, falta) {
  if (a.unit === 'u') return Math.ceil(falta - 0.001)
  return Math.ceil(falta / 50) * 50
}

export default function Compras() {
  const d = useDatos()
  // `alimento` es lo anotado en la lista y `producto` lo que se compró: el mismo, o uno que vale por él
  const [comprando, setComprando] = useState(null) // { alimento, producto, qty, price }
  const [agregando, setAgregando] = useState(false)

  const { ordenCategoria } = d
  const faltaPlan = useMemo(
    () =>
      [...d.planFuturo.faltantes]
        .filter(([id]) => d.alimentosPorId.has(id) && !d.lista.some((l) => l.food_id === id))
        .map(([id, falta]) => ({ a: d.alimentosPorId.get(id), qty: redondearCompra(d.alimentosPorId.get(id), falta) }))
        .sort((x, y) => ordenCategoria(x.a.category) - ordenCategoria(y.a.category) || x.a.name.localeCompare(y.a.name, 'es')),
    [d.planFuturo, d.alimentosPorId, d.lista, ordenCategoria],
  )
  // Lo del plan que se sacó a mano: en la base (1.31, F-25), así en un hogar lo ve todo el mundo. Lo que se había sacado en
  // la 1.30 (guardado en el teléfono) se pasa a la base la primera vez.
  const ambito = d.hogar?.id || d.usuario.id
  const [verQuitados, setVerQuitados] = useState(false)
  const quitadas = useMemo(() => Object.fromEntries((d.comprasQuitadas || []).map((q) => [q.food_id, Number(q.qty)])), [d.comprasQuitadas])
  const { visibles: delPlan, quitados } = useMemo(() => aplicarQuitadas(faltaPlan, quitadas), [faltaPlan, quitadas])
  const { quitarDelPlan: sacar, devolverAlPlan } = d
  useEffect(() => {
    const viejas = leerQuitadas(ambito)
    if (Object.keys(viejas).length === 0) return
    guardarQuitadas(ambito, {})
    for (const [food_id, qty] of Object.entries(viejas)) sacar(food_id, qty)
  }, [ambito, sacar])
  // Lo sacado hace más de 3 semanas se olvida (si el plan lo vuelve a pedir, aparece)
  useEffect(() => {
    const limite = Date.now() - 21 * 86400000
    for (const q of d.comprasQuitadas || []) if (q.created_at && Date.parse(q.created_at) < limite) devolverAlPlan(q.food_id)
  }, [d.comprasQuitadas, devolverAlPlan])
  const manuales = d.lista
    .filter((l) => d.alimentosPorId.has(l.food_id))
    .map((l) => ({ id: l.id, a: d.alimentosPorId.get(l.food_id), qty: Number(l.qty) }))
  const mes = mesDe(hoy())
  const comprasMes = d.compras.filter((c) => mesDe(c.date) === mes).sort((a, b) => b.date.localeCompare(a.date))
  // En un hogar, las compras de las otras personas dicen quién las hizo (mientras siga en el hogar)
  const quienCompro = (c) => {
    const nombre = c.comprado_por && c.comprado_por !== d.usuario.id ? d.hogar?.miembros.find((m) => m.id === c.comprado_por)?.nombre : null
    return nombre ? `compró ${nombre}` : null
  }
  const texto = textoDeLista([...delPlan, ...manuales], { hogar: d.hogar?.nombre })
  // El menú de compartir del teléfono si existe; si no (la compu), WhatsApp directo con el texto escrito
  async function compartir() {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Lista de compras', text: texto })
      } catch (e) {
        if (e?.name !== 'AbortError') window.open(enlaceWhatsApp(texto), '_blank', 'noopener')
      }
    } else window.open(enlaceWhatsApp(texto), '_blank', 'noopener')
  }
  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto)
      d.avisar('Lista copiada')
    } catch {
      d.avisar('No se pudo copiar la lista. Probá con Compartir.', 'error')
    }
  }
  const gasto = comprasMes.reduce((s, c) => s + Number(c.price), 0)

  const errVence =
    comprando?.vence && !(comprando.vence >= '2000-01-01' && comprando.vence <= '2100-12-31') ? 'Esa fecha no es válida.' : null
  const errCompra = comprando
    ? {
        qty: errCantidad(comprando.producto, comprando.qty, maxEnStock(comprando.producto)),
        price: errNumero(comprando.price, LIM.precio, { opcional: true }),
      }
    : {}
  // Al tocar "Comprado" se propone el producto vinculado que ya se venía usando, si hay
  function empezarCompra(a, qty) {
    // Se propone lo que viene reemplazando al alimento en la despensa o, si no, un producto propio vinculado
    const producto = d.enUso.get(a.id) || (d.equivalentes.get(a.id) || []).find((p) => p.owner) || a
    setComprando({ alimento: a, producto, qty: String(pasar(a, producto, qty)), price: '', vence: '' })
  }
  const pasar = (de, a, qty) => redondear(convertir(de, a, Number(qty) || 0), a.unit === 'u' ? 1 : 0)
  const opcionesCompra = comprando ? [comprando.alimento, ...(d.equivalentes.get(comprando.alimento.id) || [])] : []
  async function confirmar() {
    if (errCompra.qty || errCompra.price || errVence) return
    const antes = d.vencimientos.get(comprando.producto.id) || null
    const listo = await d.comprar({
      food_id: comprando.producto.id,
      qty: Number(comprando.qty),
      price: Number(comprando.price) || 0,
      anotado: comprando.alimento.id,
    })
    // La fecha del que vence primero: si lo que ya había vence antes, queda esa (F-04)
    const fecha = fechaAlSumar(antes, comprando.vence || null)
    if (listo && fecha && fecha !== antes) await d.fijarVencimiento(comprando.producto.id, fecha)
    if (listo) {
      setComprando(null)
      d.avisar(d.hogar ? 'Sumado a la despensa del hogar' : 'Sumado a tu despensa')
    }
  }

  // Quitar de la lista, con Deshacer (D-06): vuelve con la misma cantidad
  async function quitar(id, a, qty) {
    if (!(await d.quitarDeLista(id))) return
    d.avisar(`Sacaste ${a.name} de la lista`, 'ok', {
      texto: 'Deshacer',
      hacer: async () => {
        if (await d.agregarALista(a.id, qty)) d.avisar(`${a.name} volvió a la lista`)
      },
    })
  }

  // Sacar algo que falta para el plan (ya lo tenés, o no lo vas a comprar), con Deshacer
  async function quitarDelPlan(a, qty) {
    if (!(await d.quitarDelPlan(a.id, qty))) return
    d.avisar(`Sacaste ${a.name} de la lista`, 'ok', {
      texto: 'Deshacer',
      hacer: () => d.devolverAlPlan(a.id),
    })
  }
  const devolver = (a) => d.devolverAlPlan(a.id)

  const Fila = ({ a, qty, origen, id, delPlan: esDelPlan }) => (
    <div className="flex items-center gap-2 py-3">
      <Foto ruta={a.image_path} categoria={a.category} para={a.name} className="w-10 h-10 rounded-xl" icono={20} />
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{a.name}</p>
        <p className="text-xs text-gris">
          {cantidadTexto(a, qty)} · {origen}
        </p>
      </div>
      {(id || esDelPlan) && (
        <button
          onClick={() => (id ? quitar(id, a, qty) : quitarDelPlan(a, qty))}
          className="toque w-8 h-8 text-gris"
          aria-label={`Quitar ${a.name}`}
        >
          <Icono n="close" size={18} />
        </button>
      )}
      <button onClick={() => empezarCompra(a, qty)} className="btn-chico bg-verde text-white">
        <Icono n="check" size={16} /> Comprado
      </button>
    </div>
  )

  return (
    <Marco titulo="Lista de compras" atras>
      <div className="lg:max-w-[760px] lg:mx-auto xl:max-w-none xl:grid xl:grid-cols-[minmax(0,1fr)_22rem] xl:gap-x-6 xl:items-start">
        <section className="rounded-3xl bg-verde text-white p-5 mb-4 xl:col-start-2 xl:row-start-1">
          <p className="text-xs font-semibold">Gastaste en {nombreMes(hoy())}</p>
          <p className="text-3xl font-bold mt-1">{pesos(gasto)}</p>
          <p className="text-sm mt-1">
            {comprasMes.length} {comprasMes.length === 1 ? 'compra anotada' : 'compras anotadas'}
          </p>
        </section>

        <div className="xl:col-start-1 xl:row-start-1 xl:row-span-2 min-w-0">
          <div className="flex items-center justify-between mb-2" data-tour="com-lista">
            <h2 className="text-lg font-semibold min-w-0 truncate">Para comprar</h2>
            <div className="flex items-center gap-2 shrink-0">
              {texto && (
                <>
                  <button onClick={copiar} className="toque w-8 h-8 rounded-full bg-campo text-gris" aria-label="Copiar la lista">
                    <Icono n="content_copy" size={18} />
                  </button>
                  <button onClick={compartir} className="btn-chico bg-campo text-tinta">
                    <Icono n="share" size={16} /> <span className="max-[380px]:sr-only">Compartir</span>
                  </button>
                </>
              )}
              <button onClick={() => setAgregando(true)} className="btn-chico bg-verde-suave text-verde-texto">
                <Icono n="add" size={16} /> Anotar
              </button>
            </div>
          </div>
          {delPlan.length + manuales.length === 0 ? (
            <Vacio
              icono="shopping_cart"
              titulo="No falta nada"
              texto={
                quitados.length ? 'Sacaste todo lo que faltaba para el plan.' : 'Cuando al plan le falte un ingrediente, aparece acá solo.'
              }
            />
          ) : (
            <div className="tarjeta px-4 divide-y divide-linea">
              {delPlan.map((x) => (
                <Fila key={x.a.id} a={x.a} qty={x.qty} origen="falta para el plan" delPlan />
              ))}
              {manuales.map((x) => (
                <Fila key={x.id} a={x.a} qty={x.qty} origen={d.hogar ? 'anotado en el hogar' : 'anotado por vos'} id={x.id} />
              ))}
            </div>
          )}
          {quitados.length > 0 && (
            <div className="mt-3" data-testid="compras-quitados">
              <button
                onClick={() => setVerQuitados(!verQuitados)}
                className="text-sm font-semibold text-gris flex items-center gap-1"
                aria-expanded={verQuitados}
              >
                <Icono n={verQuitados ? 'keyboard_arrow_down' : 'chevron_right'} size={18} />
                {quitados.length === 1
                  ? 'Sacaste 1 cosa que falta para el plan'
                  : `Sacaste ${quitados.length} cosas que faltan para el plan`}
              </button>
              {verQuitados && (
                <div className="tarjeta px-4 mt-2 divide-y divide-linea">
                  {quitados.map((x) => (
                    <div key={x.a.id} className="flex items-center gap-2 py-2.5">
                      <span className="flex-1 min-w-0 truncate text-sm text-gris">
                        {x.a.name} · {cantidadTexto(x.a, x.qty)}
                      </span>
                      <button onClick={() => devolver(x.a)} className="btn-chico bg-campo text-tinta">
                        <Icono n="undo" size={16} /> Volver a la lista
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {comprasMes.length > 0 && (
          <div className="xl:col-start-2 xl:row-start-2">
            <h2 className="text-lg font-semibold mt-6 xl:mt-0 mb-2">Compras del mes</h2>
            <div className="tarjeta px-4 divide-y divide-linea">
              {comprasMes.map((c) => {
                const a = c.food_id && d.alimentosPorId.get(c.food_id)
                return (
                  <div key={c.id} className="flex items-center gap-2 py-3 text-sm">
                    <span className="w-11 text-gris">{fechaCorta(c.date)}</span>
                    <span className="flex-1 min-w-0 truncate">
                      {c.name}
                      {a ? ` · ${cantidadTexto(a, Number(c.qty))}` : ''}
                      {quienCompro(c) && <span className="text-gris"> · {quienCompro(c)}</span>}
                    </span>
                    <span className="font-semibold">{pesos(c.price)}</span>
                    <button
                      onClick={async () => {
                        if (
                          await d.confirmar({
                            titulo: `¿Borrar la compra de ${c.name}?`,
                            texto: 'Se descuenta del gasto del mes. Lo que se sumó a la despensa queda como está.',
                          })
                        )
                          d.borrarCompra(c.id)
                      }}
                      className="toque w-7 h-7 text-gris"
                      aria-label="Borrar compra"
                    >
                      <Icono n="delete" size={18} />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {agregando && (
        <Hoja titulo="Anotar para comprar" onCerrar={() => setAgregando(false)}>
          <SelectorAlimento
            onElegir={async (a) => {
              setAgregando(false)
              await d.agregarALista(a.id, pasoDe(a) * (a.unit === 'u' ? 1 : 10))
            }}
          />
        </Hoja>
      )}
      {comprando && (
        <Hoja titulo={comprando.alimento.name} onCerrar={() => setComprando(null)}>
          {opcionesCompra.length > 1 && (
            <div className="mb-3">
              <p className="etiqueta">¿Qué compraste?</p>
              <div className="flex gap-2 overflow-x-auto sin-scroll -mx-5 px-5">
                {opcionesCompra.map((o) => (
                  <Chip
                    key={o.id}
                    activo={o.id === comprando.producto.id}
                    onClick={() => setComprando({ ...comprando, producto: o, qty: String(pasar(comprando.producto, o, comprando.qty)) })}
                  >
                    {nombreCorto(o)}
                  </Chip>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="etiqueta" htmlFor="cp-cantidad">
                Cantidad ({comprando.producto.unit === 'u' ? unidadDe(comprando.producto) : comprando.producto.unit})
              </label>
              <Numero
                id="cp-cantidad"
                valor={comprando.qty}
                onChange={(v) => setComprando({ ...comprando, qty: v })}
                decimales={comprando.producto.unit === 'u' ? 1 : 0}
                largo={6}
                error={!!errCompra.qty}
              />
              <Err>{errCompra.qty}</Err>
            </div>
            <div>
              <label className="etiqueta" htmlFor="cp-precio">
                Precio total ($)
              </label>
              <Numero
                id="cp-precio"
                valor={comprando.price}
                onChange={(v) => setComprando({ ...comprando, price: v })}
                decimales={2}
                largo={11}
                placeholder="Opcional"
                autoFocus
                error={!!errCompra.price}
              />
              <Err>{errCompra.price}</Err>
            </div>
          </div>
          <div className="mt-3">
            <label className="etiqueta" htmlFor="cp-vence">
              ¿Cuándo vence? (opcional)
            </label>
            <input
              id="cp-vence"
              type="date"
              className="campo"
              min="2000-01-01"
              max="2100-12-31"
              value={comprando.vence}
              onChange={(e) => setComprando({ ...comprando, vence: e.target.value })}
            />
            <Err>{errVence}</Err>
          </div>
          <p className="text-xs text-gris mt-2">
            {d.hogar ? 'Se suma a la despensa del hogar' : 'Se suma a tu despensa'} y el precio cuenta para el gasto del mes. Con la fecha,
            la despensa te avisa antes de que venza.
          </p>
          <button onClick={confirmar} disabled={!!errCompra.qty || !!errCompra.price || !!errVence} className="btn-primario w-full mt-4">
            Confirmar compra
          </button>
        </Hoja>
      )}
    </Marco>
  )
}
