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

  const avisar = useCallback((texto, tipo = 'ok') => setAviso({ texto, tipo, id: Date.now() }), [])
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
    const t = setTimeout(() => setAviso(null), aviso.tipo === 'error' ? 5000 : 2500)
    return () => clearTimeout(t)
  }, [aviso])

  const enPantalla = useMemo(() => ({ aviso, pregunta }), [aviso, pregunta])
  const funciones = useMemo(() => ({ avisar, confirmar, responder }), [avisar, confirmar, responder])
  return (
    <CtxAvisar.Provider value={funciones}>
      <CtxEnPantalla.Provider value={enPantalla}>{children}</CtxEnPantalla.Provider>
    </CtxAvisar.Provider>
  )
}
