// Campo para elegir el nombre de usuario: valida las reglas mientras se escribe y pregunta si está libre.
// Lo usan el perfil (al crear la cuenta y al editarlo) y la pantalla que se les muestra a las cuentas que todavía no tienen uno.
import { useEffect, useState } from 'react'
import { Icono } from './ui'
import { useDatos } from '../store/Datos'
import { LIM, errUsuario, normalizarUsuario } from '../lib/validar'

const ESPERA_MS = 400 // se pregunta cuando la persona deja de escribir un momento

// Cómo está el usuario escrito. `actual` es el que la cuenta ya tiene guardado: ese no hace falta validarlo ni preguntarlo.
//   error:  el motivo por el que no sirve (o null)
//   estado: 'libre' | 'ocupado' | 'comprobando' | null (todavía no se sabe, o no se pudo preguntar)
export function useEstadoUsuario(valor, actual = null, { obligatorio = true } = {}) {
  const { usuarioDisponible } = useDatos()
  const u = normalizarUsuario(valor)
  const esElActual = !!actual && u === actual
  const error = esElActual || (!u && !obligatorio) ? null : errUsuario(u)
  const hayQueComprobar = !!u && !error && !esElActual
  const [resultado, setResultado] = useState({ para: '', libre: null })

  useEffect(() => {
    if (!hayQueComprobar) return
    let vigente = true
    const t = setTimeout(async () => {
      const libre = await usuarioDisponible(u)
      if (vigente) setResultado({ para: u, libre })
    }, ESPERA_MS)
    return () => {
      vigente = false
      clearTimeout(t)
    }
  }, [u, hayQueComprobar, usuarioDisponible])

  let estado = null
  if (hayQueComprobar)
    estado = resultado.para !== u ? 'comprobando' : resultado.libre === null ? null : resultado.libre ? 'libre' : 'ocupado'
  return { error: error || (estado === 'ocupado' ? 'Ese usuario ya lo tiene otra persona. Elegí otro.' : null), estado, usuario: u }
}

export default function CampoUsuario({ id = 'pf-usuario', valor, onChange, estado, mostrarError = true, ayuda = true }) {
  const { error, estado: disponibilidad } = estado
  const verError = mostrarError && error
  return (
    <div>
      <label className="etiqueta" htmlFor={id}>
        Usuario
      </label>
      <input
        id={id}
        className={`campo ${verError ? '!border-rojo-texto !bg-rojo-suave/40' : ''}`}
        maxLength={LIM.usuario[1] + 10}
        autoCapitalize="none"
        autoCorrect="off"
        autoComplete="username"
        spellCheck={false}
        placeholder="Por ejemplo: santi.m"
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!verError}
      />
      {verError ? (
        <p className="text-xs text-rojo-texto mt-1" role="alert">
          {error}
        </p>
      ) : disponibilidad === 'libre' ? (
        <p className="text-xs text-verde-texto mt-1 flex items-center gap-1">
          <Icono n="check_circle" lleno size={15} /> Está libre
        </p>
      ) : disponibilidad === 'comprobando' ? (
        <p className="text-xs text-gris mt-1">Comprobando...</p>
      ) : (
        ayuda && (
          <p className="text-xs text-gris mt-1">
            Con este nombre podés iniciar sesión en vez de escribir el email. Entre 3 y 20 letras sin tilde, números, punto, guion o guion
            bajo.
          </p>
        )
      )}
    </div>
  )
}
