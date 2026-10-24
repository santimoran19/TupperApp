// Avisos: el cartel flotante de abajo ("Comida registrada") y la pregunta de confirmación antes de borrar algo.
// Van separados de los datos para que mostrar un cartel no redibuje la pantalla entera: lo que cambia (el cartel o la
// pregunta que hay en este momento) lo lee solo el Marco; las funciones para avisar y preguntar no cambian nunca.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const CtxEnPantalla = createContext({ aviso: null, pregunta: null })
const CtxAvisar = createContext(null)

// Lo que hay para mostrar ahora: { aviso, pregunta }
export const useAvisos = () => useContext(CtxEnPantalla)
// Las funciones: { avisar, confirmar, responder }
export const useAvisar = () => useContext(CtxAvisar)

export function ProveedorAvisos({ children }) {
  const [aviso, setAviso] = useState(null)
  const [pregunta, setPregunta] = useState(null)

  // `accion` (1.29, D-06): un botón en el cartel, por ejemplo { texto: 'Deshacer', hacer: () => ... }
  const avisar = useCallback((texto, tipo = 'ok', accion = null) => setAviso({ texto, tipo, accion, id: Date.now() }), [])
  const quitarAviso = useCallback(() => setAviso(null), [])
  // `confirmar({...})` devuelve una promesa que da true o false cuando la persona contesta
  const confirmar = useCallback((opciones) => new Promise((resolver) => setPregunta({ ...opciones, resolver })), [])
  const responder = useCallback(
    (valor) =>
      setPregunta((p) => {
        p?.resolver(valor)
        return null
      }),
    [],
  )

  useEffect(() => {
    if (!aviso) return
    // Con un botón (Deshacer) se deja más tiempo: hay que llegar a tocarlo
    const t = setTimeout(() => setAviso(null), aviso.accion ? 7000 : aviso.tipo === 'error' || aviso.tipo === 'aviso' ? 6000 : 2500)
    return () => clearTimeout(t)
  }, [aviso])

  const enPantalla = useMemo(() => ({ aviso, pregunta }), [aviso, pregunta])
  const funciones = useMemo(() => ({ avisar, confirmar, responder, quitarAviso }), [avisar, confirmar, responder, quitarAviso])
  return (
    <CtxAvisar.Provider value={funciones}>
      <CtxEnPantalla.Provider value={enPantalla}>{children}</CtxEnPantalla.Provider>
    </CtxAvisar.Provider>
  )
}
