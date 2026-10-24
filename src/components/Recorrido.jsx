// Recorrido inicial: oscurece todo menos lo que se está explicando, lo hace brillar y lo cuenta en un cartel.
// Los pasos y la geometría están en lib/recorrido.js. Solo aparece en las cuentas nuevas (ver Bienvenida).
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Icono } from './ui'
import { useDatos } from '../store/Datos'
import { PASOS, aroDe, desplazamiento, franjas, guardarPaso, leerRecorrido, terminarRecorrido, ubicarCartel } from '../lib/recorrido'

const pausa = (ms) => new Promise((r) => setTimeout(r, ms))

// El elemento marcado con esa ancla que se esté viendo (no uno escondido o sin tamaño)
function buscar(ancla) {
  for (const el of document.querySelectorAll(`[data-tour="${ancla}"]`)) {
    const r = el.getBoundingClientRect()
    if (r.width > 0 && r.height > 0) return el
  }
  return null
}

// Espera a que aparezca algo en la pantalla. Se cuenta por vueltas y no por la hora: así no depende del reloj.
async function esperar(hay, vivo, vueltas) {
  for (let n = 0; ; n++) {
    const el = hay()
    if (el) return el
    if (n >= vueltas || !vivo()) return null
    await pausa(50)
  }
}

// Para cerrar las ventanas que subieron desde abajo se usa su propia tecla de cerrar (Escape). La tecla que aprieta la persona
// no llega a ellas (ver más abajo), así que esta se marca para distinguirla.
let apretandoSolo = false
const hayVentana = () => document.querySelector('[role="dialog"]:not([data-recorrido])')
async function cerrarVentanas(vivo) {
  for (let n = 0; n < 4 && hayVentana() && vivo(); n++) {
    apretandoSolo = true
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    apretandoSolo = false
    await pausa(90)
  }
}

// Deja la pantalla lista para un paso: lleva a la persona a la pantalla, abre la ventana que haga falta y muestra el elemento.
// Devuelve cuando ya se puede mostrar (si el elemento no aparece, el cartel sale en el medio y el paso se puede seguir igual).
async function preparar(paso, { vivo, ir, ruta }) {
  if (!paso.enHoja) await cerrarVentanas(vivo)
  if (ruta !== paso.ruta) ir(paso.ruta)
  if (!paso.ancla) {
    await pausa(ruta !== paso.ruta ? 250 : 0)
    return
  }
  let el = await esperar(() => buscar(paso.ancla), vivo, paso.enHoja ? 8 : 50)
  if (!el && paso.enHoja && vivo()) {
    // La ventana no está como hace falta (por ejemplo, se volvió para atrás): se cierra y se abre de nuevo desde cero
    await cerrarVentanas(vivo)
    for (const a of paso.abre || []) {
      const boton = await esperar(() => buscar(a), vivo, 40)
      if (!boton || !vivo()) break
      boton.click()
      await pausa(150)
    }
    el = await esperar(() => buscar(paso.ancla), vivo, 50)
  }
  if (!el || !vivo()) return
  // Si está fuera de lo que se ve, se lo trae
  if (el.closest('[role="dialog"]')) el.scrollIntoView({ block: 'center' })
  else {
    const dy = desplazamiento(el.getBoundingClientRect(), window.innerHeight)
    if (dy) window.scrollBy(0, dy)
  }
  await pausa(60)
}

function Guia({ uid, inicio, nombre, alTerminar }) {
  const [i, setI] = useState(inicio)
  // Un paso está listo cuando su pantalla ya está preparada. Se guarda de cuál paso (y qué intento) es, así al cambiar de paso
  // deja de estar listo en el mismo instante y el cartel nuevo no se alcanza a ver antes de tiempo.
  const [listoPara, setListoPara] = useState('')
  const [alto, setAlto] = useState(0)
  const [aro, setAro] = useState(null)
  const [saltando, setSaltando] = useState(false)
  const [tamano, setTamano] = useState(0)
  const [vez, setVez] = useState(0)
  const { pathname } = useLocation()
  const navegar = useNavigate()
  const paso = PASOS[i]
  const listo = listoPara === `${i}:${vez}`
  const ultimo = i === PASOS.length - 1

  // Lo que cambia con cada vuelta del componente se lee desde acá, así las funciones de abajo no se rehacen todo el tiempo
  const ahora = useRef({})
  ahora.current = { pathname, navegar }
  const raiz = useRef(null)
  const cartel = useRef(null)
  const principal = useRef(null)
  const saliendo = useRef(false)

  // Al llegar a un paso: se guarda por cuál va y se prepara la pantalla
  useEffect(() => {
    let vigente = true
    const vivo = () => vigente
    setSaltando(false)
    guardarPaso(uid, i)
    preparar(PASOS[i], {
      vivo,
      ir: (ruta) => ahora.current.navegar(ruta, { replace: true }),
      ruta: ahora.current.pathname,
    }).then(() => vigente && setListoPara(`${i}:${vez}`))
    return () => {
      vigente = false
    }
  }, [i, uid, vez])

  // Si la persona se fue de la pantalla del paso (por ejemplo, con "atrás" del navegador), se la vuelve a llevar.
  // Se espera un momento: cuando toca lo resaltado, la pantalla cambia un instante antes de que el paso avance.
  useEffect(() => {
    if (!listo || pathname === paso.ruta) return undefined
    const t = setTimeout(() => setVez((v) => v + 1), 700)
    return () => clearTimeout(t)
  }, [listo, pathname, paso.ruta])

  // El resaltado sigue al elemento si se mueve (la página se desplaza, se achica la ventana, sale el teclado)
  useEffect(() => {
    if (!listo || !paso.ancla) {
      setAro(null)
      return undefined
    }
    let cuadro
    let previa = ''
    const seguir = () => {
      const el = buscar(paso.ancla)
      const nuevo = el ? aroDe(el.getBoundingClientRect(), window.innerWidth, window.innerHeight) : null
      const firma = nuevo ? `${nuevo.top}|${nuevo.left}|${nuevo.width}|${nuevo.height}` : ''
      if (firma !== previa) {
        previa = firma
        setAro(nuevo)
      }
      cuadro = requestAnimationFrame(seguir)
    }
    seguir()
    return () => cancelAnimationFrame(cuadro)
  }, [listo, paso.ancla])

  useEffect(() => {
    const alCambiar = () => setTamano((n) => n + 1)
    window.addEventListener('resize', alCambiar)
    return () => window.removeEventListener('resize', alCambiar)
  }, [])

  const siguiente = useCallback(() => setI((n) => Math.min(n + 1, PASOS.length - 1)), [])
  const atras = () => setI((n) => Math.max(n - 1, 0))

  // Terminar o saltar: la marca se borra, se cierra lo que haya abierto y se vuelve al diario
  const salir = useCallback(async () => {
    if (saliendo.current) return
    saliendo.current = true
    terminarRecorrido(uid)
    await cerrarVentanas(() => true)
    ahora.current.navegar('/', { replace: true })
    alTerminar()
  }, [uid, alTerminar])

  // En los pasos de "tocá esto", tocar lo resaltado sigue al paso que viene (lo que toca la app lo hace igual)
  useEffect(() => {
    if (!listo || paso.tipo !== 'toque') return undefined
    const alTocar = (ev) => {
      const el = buscar(paso.ancla)
      if (el && el.contains(ev.target)) siguiente()
    }
    document.addEventListener('click', alTocar, true)
    return () => document.removeEventListener('click', alTocar, true)
  }, [listo, paso, siguiente])

  // El alto que ocupa el cartel (cambia con el largo del texto), para ponerlo donde entre
  useLayoutEffect(() => {
    const h = cartel.current?.offsetHeight || 0
    if (h !== alto) setAlto(h)
  }, [listo, i, saltando, tamano, alto])

  // El teclado: Escape no cierra las ventanas de abajo por accidente y el foco no se va a lo que está oscurecido
  useEffect(() => {
    const tecla = (ev) => {
      if (apretandoSolo || ev.key !== 'Escape') return
      ev.preventDefault()
      ev.stopPropagation()
      ev.stopImmediatePropagation()
    }
    const foco = (ev) => {
      if (cartel.current?.contains(ev.target)) return
      const cur = paso.ancla && paso.tipo === 'toque' ? buscar(paso.ancla) : null
      if (cur?.contains(ev.target)) return
      principal.current?.focus({ preventScroll: true })
    }
    document.addEventListener('keydown', tecla, true)
    document.addEventListener('focusin', foco)
    return () => {
      document.removeEventListener('keydown', tecla, true)
      document.removeEventListener('focusin', foco)
    }
  }, [paso])

  // Al mostrar el paso, el foco va al botón de seguir (y no queda el teclado del celular abierto sobre un campo)
  useEffect(() => {
    if (listo) principal.current?.focus({ preventScroll: true })
  }, [listo, i])

  // Mientras hay recorrido, la rueda del mouse no mueve lo que está oscurecido
  useEffect(() => {
    const el = raiz.current
    if (!el) return undefined
    const rueda = (ev) => {
      if (!cartel.current?.contains(ev.target)) ev.preventDefault()
    }
    el.addEventListener('wheel', rueda, { passive: false })
    return () => el.removeEventListener('wheel', rueda)
  }, [])

  const vw = window.innerWidth
  const vh = window.innerHeight
  const ubic = ubicarCartel(aro, vw, vh, alto || undefined)
  const estiloCartel = ubic.centrado
    ? { width: ubic.ancho, left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }
    : { width: ubic.ancho, left: ubic.left, top: ubic.top, bottom: ubic.bottom }
  const titulo = paso.titulo.replace(', {nombre}', nombre ? `, ${nombre}` : '')
  const recuadro = (r) => ({ top: r.top, left: r.left, width: r.width, height: r.height })
  const franja = aro ? franjas(aro) : null

  // La capa en sí no recibe toques: solo las franjas, el cartel y lo que tapa lo resaltado. Así el hueco queda libre.
  return (
    <div ref={raiz} className="fixed inset-0 z-100 pointer-events-none" data-recorrido-capa>
      {franja ? (
        <>
          {Object.entries(franja).map(([k, e]) => (
            <div key={k} className="absolute bg-black/70 touch-none pointer-events-auto" style={e} />
          ))}
          <div className="recorrido-aro" style={recuadro(aro)} />
          {/* En los pasos que solo explican, el elemento resaltado tampoco se toca */}
          {paso.tipo !== 'toque' && <div className="absolute touch-none pointer-events-auto" style={recuadro(aro)} />}
        </>
      ) : (
        <div className="absolute inset-0 bg-black/70 touch-none pointer-events-auto" />
      )}

      {listo && (
        <div
          ref={cartel}
          role="dialog"
          aria-modal="true"
          aria-labelledby="rec-titulo"
          aria-describedby="rec-texto"
          data-recorrido
          className="absolute bg-superficie text-tinta rounded-3xl shadow-flotante p-5 overflow-y-auto pointer-events-auto"
          style={{ ...estiloCartel, maxHeight: vh - 24 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-1.5 rounded-full bg-pista overflow-hidden" aria-hidden="true">
              <div className="h-full rounded-full bg-verde" style={{ width: `${((i + 1) / PASOS.length) * 100}%` }} />
            </div>
            <span className="text-xs font-semibold text-gris whitespace-nowrap">
              {i + 1} de {PASOS.length}
            </span>
          </div>
          <h2 id="rec-titulo" className="text-lg font-semibold leading-snug">
            {titulo}
          </h2>
          <p id="rec-texto" className="text-sm text-gris mt-1.5">
            {paso.texto}
          </p>
          {paso.tipo === 'toque' && aro && (
            <p className="text-sm font-semibold text-verde-texto mt-2">Tocá lo que está resaltado, o seguí con el botón de abajo.</p>
          )}

          {saltando ? (
            <div className="mt-4">
              <p className="text-sm font-semibold">¿Saltar el recorrido? No vuelve a aparecer.</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => setSaltando(false)} className="btn bg-campo text-tinta flex-1">
                  Seguir
                </button>
                <button onClick={salir} className="btn-primario flex-1">
                  Sí, saltar
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex gap-2 mt-4">
                {i > 0 && (
                  <button onClick={atras} className="btn bg-campo text-tinta px-4" aria-label="Paso anterior">
                    <Icono n="arrow_back" size={20} />
                  </button>
                )}
                <button ref={principal} onClick={ultimo ? salir : siguiente} className="btn-primario flex-1" data-testid="recorrido-seguir">
                  {i === 0 ? 'Empezar el recorrido' : ultimo ? 'Empezar a usar Tupper' : 'Siguiente'}
                </button>
              </div>
              {!ultimo && (
                <button onClick={() => setSaltando(true)} className="block mx-auto mt-3 text-sm text-gris underline">
                  Saltar recorrido
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default function Recorrido() {
  const { usuario, perfil } = useDatos()
  const [inicio] = useState(() => leerRecorrido(usuario.id))
  const [activo, setActivo] = useState(inicio !== null)
  const alTerminar = useCallback(() => setActivo(false), [])
  if (!activo) return null
  return <Guia uid={usuario.id} inicio={inicio} nombre={(perfil?.name || '').trim().split(' ')[0]} alTerminar={alTerminar} />
}
