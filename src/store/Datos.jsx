// Estado de la app: lo que se trajo de Supabase, lo que se calcula a partir de eso y las acciones que lo modifican.
// Este archivo solo junta las piezas; cada una está en su archivo:
//   carga.js            qué se trae de la base
//   derivados.js        lo que se calcula con eso (mapas por id, stock visto por las recetas, estado del plan)
//   sincronizacion.js   cuándo se trae, la copia en el teléfono y los cambios hechos sin conexión
//   cambios.js, envios.js   esos cambios: cómo quedan en el teléfono y cómo se mandan a la base
//   acciones/           lo que se puede hacer, por tema (despensa, registros, compras, recetas, plan, perfil)
//   avisos.jsx          el cartel flotante y la pregunta de confirmación
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { descartadas, descartar } from '../lib/equivalencias'
import { accionesDeCompras } from './acciones/compras'
import { accionesDeDespensa } from './acciones/despensa'
import { accionesDePerfil } from './acciones/perfil'
import { accionesDePlan } from './acciones/plan'
import { accionesDeRecetas } from './acciones/recetas'
import { accionesDeRegistros } from './acciones/registros'
import { ProveedorAvisos, useAvisar } from './avisos'
import { VACIO } from './carga'
import { useDerivados } from './derivados'
import { crearSincronizacion } from './sincronizacion'

const Ctx = createContext(null)
export const useDatos = () => useContext(Ctx)

export function ProveedorDatos({ usuario, children }) {
  return (
    <ProveedorAvisos>
      <Datos usuario={usuario}>{children}</Datos>
    </ProveedorAvisos>
  )
}

function Datos({ usuario, children }) {
  const uid = usuario.id
  const { avisar, confirmar, responder } = useAvisar()
  const [e, setE] = useState(VACIO)
  // Si hay conexión, cuántos cambios hechos sin conexión faltan mandar y si la base los está rechazando
  const [conexion, setConexion] = useState({ sinConexion: false, pendientes: 0, trabada: false })
  // Productos para los que ya se contestó que no valen por el alimento sugerido (se recuerda en el dispositivo)
  const [sinEquivalencia, setSinEquivalencia] = useState(descartadas)
  const noPreguntar = useCallback((id) => setSinEquivalencia(descartar(id)), [])

  const derivados = useDerivados(e)

  // Las acciones se arman una sola vez y no cambian nunca. Para trabajar con los datos como están en el momento en que
  // se las llama (y no como estaban cuando se dibujó la pantalla), los leen de acá con `ver()`.
  const vista = useRef(null)
  vista.current = { e, usuario, ...derivados }

  const [sinc] = useState(() => crearSincronizacion({ uid, setE, avisar, alEstado: setConexion }))
  const [acciones] = useState(() => {
    const k = {
      uid,
      setE,
      avisar,
      confirmar,
      ver: () => vista.current,
      accion: sinc.accion,
      operar: sinc.operar,
      enFila: sinc.enFila,
      tocar: sinc.tocar,
      pendientes: sinc.pendientes,
      vaciar: sinc.vaciar,
    }
    return {
      recargar: sinc.reintentar,
      avisar,
      confirmar,
      responder,
      noPreguntar,
      ...accionesDePerfil(k),
      ...accionesDeDespensa(k),
      ...accionesDeRegistros(k),
      ...accionesDeCompras(k),
      ...accionesDeRecetas(k),
      ...accionesDePlan(k),
    }
  })

  useEffect(() => {
    sinc.iniciar()
    return () => sinc.cerrar()
  }, [sinc])

  // Cada vez que cambian los datos se actualiza la copia del teléfono (la sincronización junta los cambios seguidos)
  useEffect(() => {
    sinc.guardarFoto(e)
  }, [sinc, e])

  const valor = useMemo(() => {
    const { recetasVisibles, ...resto } = derivados
    return {
      ...e,
      ...resto,
      usuario,
      sinEquivalencia,
      ...conexion,
      // `recetas` son las visibles; las ocultas van aparte y recetasPorId las tiene todas (para mostrar nombres viejos)
      recetas: recetasVisibles,
      ...acciones,
    }
  }, [e, derivados, usuario, sinEquivalencia, conexion, acciones])

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>
}
