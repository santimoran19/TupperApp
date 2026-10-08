// Comprobación de que del otro lado hay una persona y no un programa (Turnstile, de Cloudflare), para la pantalla de
// acceso. Casi nunca se ve: aparece solo si a Cloudflare le hace falta que la persona toque algo.
// Se enciende poniendo VITE_TURNSTILE_SITEKEY (ver README, "Seguridad de las cuentas"); sin esa variable no hace nada.
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

const CLAVE = import.meta.env.VITE_TURNSTILE_SITEKEY
const GUION = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
// Cuánto se espera la comprobación antes de mandar el pedido sin ella (si Supabase la exige, lo va a rechazar)
const ESPERA_MS = 20000

let cargando = null
function cargar() {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  if (!cargando) {
    cargando = new Promise((listo, fallo) => {
      const guion = document.createElement('script')
      guion.src = GUION
      guion.async = true
      guion.onload = () => (window.turnstile ? listo(window.turnstile) : fallo(new Error('Turnstile no cargó')))
      guion.onerror = () => {
        guion.remove()
        fallo(new Error('Turnstile no cargó'))
      }
      document.head.appendChild(guion)
    })
    // Si falló (sin conexión, un bloqueador), la próxima vez que se pida se prueba de nuevo
    cargando.catch(() => {
      cargando = null
    })
  }
  return cargando
}

const temaOscuro = () => {
  const elegido = document.documentElement.getAttribute('data-tema')
  return elegido ? elegido === 'oscuro' : !!window.matchMedia?.('(prefers-color-scheme: dark)').matches
}

const Captcha = forwardRef(function Captcha(_, ref) {
  const caja = useRef(null)
  // api: Turnstile ya cargado · id: el del recuadro · token: la comprobación lista para usar · esperan: quienes la
  // pidieron · fallo: no cargó o dio error (al próximo pedido se arma de nuevo) · vivo: el componente sigue en pantalla
  const e = useRef({ api: null, id: null, token: null, esperan: [], fallo: false, vivo: false }).current

  useEffect(() => {
    if (!CLAVE) return
    // Cada uno que espera recibe la comprobación una sola vez: sirve para un único pedido
    const avisar = (token) => {
      const primero = e.esperan.shift()
      if (primero) primero(token)
      if (!token) e.esperan.splice(0).forEach((listo) => listo(null))
      else if (primero) e.token = null
    }
    const quitar = () => {
      try {
        if (e.api && e.id !== null) e.api.remove(e.id)
      } catch {
        // ya no estaba
      }
      e.id = null
      e.token = null
    }
    // Carga Turnstile y arma el recuadro. Se llama al abrir la pantalla y de nuevo si algo había fallado.
    e.armar = () => {
      e.fallo = false
      cargar().then(
        (api) => {
          if (!e.vivo || !caja.current) return
          quitar()
          e.api = api
          e.id = api.render(caja.current, {
            sitekey: CLAVE,
            language: 'es',
            size: 'flexible',
            appearance: 'interaction-only',
            theme: temaOscuro() ? 'dark' : 'light',
            callback: (token) => {
              e.fallo = false
              e.token = token
              avisar(token)
            },
            // La comprobación dura unos minutos: cuando vence se pide otra
            'expired-callback': () => {
              e.token = null
              api.reset(e.id)
            },
            'error-callback': () => {
              e.token = null
              e.fallo = true
              avisar(null)
              return true // el error ya está atendido: que no lo tire a la consola
            },
          })
        },
        () => {
          e.fallo = true
          avisar(null)
        },
      )
    }
    e.vivo = true
    e.armar()
    return () => {
      e.vivo = false
      avisar(null)
      quitar()
    }
  }, [e])

  useImperativeHandle(
    ref,
    () => ({
      // La comprobación para mandar con un pedido. Sirve una sola vez. Sin captcha configurado da undefined (el pedido
      // va como siempre); si no se pudo conseguir, null.
      pedir() {
        if (!CLAVE) return Promise.resolve(undefined)
        if (e.token) {
          const token = e.token
          e.token = null
          return Promise.resolve(token)
        }
        // Si antes no había cargado (la app se abrió sin conexión) o dio error, se intenta de nuevo ahora
        if (e.fallo) e.armar?.()
        return new Promise((listo) => {
          const entregar = (token) => {
            clearTimeout(reloj)
            listo(token)
          }
          const reloj = setTimeout(() => {
            e.esperan = e.esperan.filter((x) => x !== entregar)
            listo(null)
          }, ESPERA_MS)
          e.esperan.push(entregar)
        })
      },
      // Después de cada pedido: la que se usó ya no sirve, se prepara otra para el próximo
      renovar() {
        e.token = null
        try {
          if (e.api && e.id !== null && !e.fallo) e.api.reset(e.id)
        } catch {
          // el recuadro ya no está
        }
      },
    }),
    [e],
  )

  if (!CLAVE) return null
  return <div ref={caja} />
})

export default Captcha
