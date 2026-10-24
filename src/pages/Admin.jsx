// Panel de administración (1.31, C-07): solo para quien está en la tabla administradores (se carga a mano en Supabase,
// ver actualizacion-24.sql). Muestra cuentas, actividad, pedidos a la IA por día, errores de la semana y las opiniones.
// Nada de lo que come, pesa o registra cada persona: los números los arma la base (admin_resumen) y la app no ve más.
import { useCallback, useEffect, useState } from 'react'
import Marco from '../components/Marco'
import { Err, Icono, Vacio } from '../components/ui'
import { supabase } from '../lib/supabase'
import { fechaCorta } from '../lib/fechas'
import { iaPorDia } from '../lib/admin'

// Tope gratis aproximado de pedidos de IA por día (para ver si se acerca); ajustalo si cambia el plan del proveedor
const TOPE_IA_DIA = 1000

const NOMBRE_TIPO = { idea: 'Idea', problema: 'Problema', otra: 'Otra' }

function Numero({ valor, texto }) {
  return (
    <div className="bg-campo rounded-2xl p-3">
      <div className="text-2xl font-bold tabular-nums">{valor ?? '—'}</div>
      <div className="text-xs text-gris">{texto}</div>
    </div>
  )
}

export default function Admin() {
  const [estado, setEstado] = useState('cargando') // cargando | ok | no | error
  const [datos, setDatos] = useState(null)

  const cargar = useCallback(async () => {
    setEstado('cargando')
    const { data, error } = await supabase.rpc('admin_resumen')
    if (error) {
      setEstado(error.code === '42501' || /administrador/i.test(error.message || '') ? 'no' : 'error')
      return
    }
    setDatos(data)
    setEstado('ok')
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar])

  if (estado === 'no')
    return (
      <Marco titulo="Administración" atras>
        <Vacio icono="lock" titulo="Solo para administradores" texto="Esta página no está disponible para tu cuenta." />
      </Marco>
    )

  const dias = iaPorDia(datos?.ia_por_dia)
  const maximo = Math.max(1, ...dias.map((d) => d.total))

  return (
    <Marco titulo="Administración" atras>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gris">Números generales, sin datos de salud de nadie.</p>
        <button
          onClick={cargar}
          className="text-sm text-verde-texto font-semibold flex items-center gap-1"
          disabled={estado === 'cargando'}
        >
          <Icono n="refresh" size={18} /> Actualizar
        </button>
      </div>
      {estado === 'error' && <Err>No se pudieron traer los números. Probá de nuevo.</Err>}
      {estado === 'cargando' && !datos && (
        <div role="status" aria-label="Cargando" className="esqueleto h-40 rounded-2xl" data-testid="esqueleto" />
      )}
      {datos && (
        <>
          <section className="tarjeta p-5 mb-4" aria-label="Cuentas">
            <h2 className="font-semibold mb-3">Cuentas</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <Numero valor={datos.cuentas} texto="en total" />
              <Numero valor={datos.nuevas_7} texto="nuevas en 7 días" />
              <Numero valor={datos.nuevas_30} texto="nuevas en 30 días" />
              <Numero valor={datos.hogares} texto="hogares" />
            </div>
            <h3 className="font-medium text-sm mt-4 mb-2">Activas (registraron algo)</h3>
            <div className="grid grid-cols-3 gap-2">
              <Numero valor={datos.activas_1} texto="hoy" />
              <Numero valor={datos.activas_7} texto="en 7 días" />
              <Numero valor={datos.activas_30} texto="en 30 días" />
            </div>
            <p className="text-xs text-gris mt-2">{datos.registros_7} registros en los últimos 7 días.</p>
          </section>

          <section className="tarjeta p-5 mb-4" aria-label="Pedidos a la IA">
            <h2 className="font-semibold">Pedidos a la IA por día</h2>
            <p className="text-xs text-gris mb-3">Últimos 14 días. Foto, voz y texto del registro con IA.</p>
            {dias.length ? (
              <ul className="space-y-1.5">
                {dias.map((d) => (
                  <li key={d.dia} className="grid grid-cols-[4.5rem_1fr_3rem] items-center gap-2 text-sm">
                    <span className="text-gris">{fechaCorta(d.dia)}</span>
                    <span
                      className="h-3 rounded-full bg-campo overflow-hidden"
                      title={`Foto ${d.foto || 0} · Voz ${d.voz || 0} · Texto ${d.texto || 0}`}
                    >
                      <span
                        className={`block h-full rounded-full ${d.total > TOPE_IA_DIA * 0.8 ? 'bg-rojo' : 'bg-verde'}`}
                        style={{ width: `${Math.round((d.total / maximo) * 100)}%` }}
                      />
                    </span>
                    <span className="text-right tabular-nums font-medium">{d.total}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gris">Sin pedidos en estos días.</p>
            )}
          </section>

          <section className="tarjeta p-5 mb-4" aria-label="Errores">
            <h2 className="font-semibold mb-2">Errores de la semana</h2>
            {datos.errores_7?.length ? (
              <ul className="divide-y divide-linea text-sm">
                {datos.errores_7.map((e) => (
                  <li key={e.nombre} className="py-2 flex gap-2">
                    <span className="flex-1 font-mono text-[13px] break-all">{e.nombre}</span>
                    <span className="text-gris text-xs self-center">{e.version}</span>
                    <span className="tabular-nums font-medium w-10 text-right">{e.veces}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gris">Ninguno. 🎉</p>
            )}
          </section>

          <section className="tarjeta p-5 mb-4" aria-label="Opiniones">
            <h2 className="font-semibold mb-2">Opiniones</h2>
            {datos.opiniones?.length ? (
              <ul className="divide-y divide-linea">
                {datos.opiniones.map((o, i) => (
                  <li key={i} className="py-3" data-testid="opinion">
                    <div className="flex gap-2 text-xs text-gris mb-1">
                      <span className="font-semibold text-verde-texto">{NOMBRE_TIPO[o.tipo] || o.tipo}</span>
                      <span>{fechaCorta(String(o.fecha).slice(0, 10))}</span>
                      {o.version && <span>· {o.version}</span>}
                      {o.pantalla && <span>· {o.pantalla}</span>}
                    </div>
                    <p className="text-sm whitespace-pre-wrap break-words">{o.texto}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gris">Todavía no llegó ninguna.</p>
            )}
          </section>
        </>
      )}
    </Marco>
  )
}
