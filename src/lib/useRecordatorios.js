// Avisos de comidas, agua y ayuno (1.27). Corre mientras la app está abierta (o en segundo plano reciente): una PWA no puede
// despertarse sola sin notificaciones push, que necesitan un servidor aparte (queda en la hoja de ruta).
import { useEffect, useRef } from 'react'
import { claveAyuno, claveRecordatorios, estadoAyuno, leer, guardar, RECORDATORIOS_INICIAL, recordatoriosAhora } from './ayuno'
import { hoy } from './fechas'

const EVENTO = 'tupper:recordatorios'
// Lo avisa Perfil al cambiar la configuración, así el aviso se entera sin recargar
export const avisarCambioRecordatorios = () => window.dispatchEvent(new Event(EVENTO))

const NOMBRES = { desayuno: 'desayunar', almuerzo: 'almorzar', merienda: 'merendar', cena: 'cenar' }

// Muestra el aviso del sistema si la persona lo permitió y la app no se está viendo; si no, queda el cartelito de la app
async function notificar(titulo, texto) {
  try {
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted' || document.visibilityState === 'visible') return false
    const reg = await navigator.serviceWorker?.getRegistration?.()
    if (reg?.showNotification) await reg.showNotification(titulo, { body: texto, icon: '/icon-192.png', tag: titulo })
    else new Notification(titulo, { body: texto, icon: '/icon-192.png' })
    return true
  } catch {
    return false
  }
}

export function useRecordatorios({ uid, registros, avisar }) {
  const ref = useRef({ registros, avisar })
  useEffect(() => {
    ref.current = { registros, avisar }
  })

  useEffect(() => {
    if (!uid) return undefined
    const revisar = () => {
      const config = leer(claveRecordatorios(uid), RECORDATORIOS_INICIAL)
      if (!config.activo) return
      const fecha = hoy()
      const claveAvisados = `tupper:avisados:${uid}`
      const guardados = leer(claveAvisados, { fecha: '', ids: [] })
      const yaAvisados = new Set(guardados.fecha === fecha ? guardados.ids.map((i) => `${fecha}|${i}`) : [])
      const registradas = new Set(ref.current.registros.filter((r) => r.date === fecha).map((r) => r.meal))
      const pendientes = recordatoriosAhora({ config, ahora: new Date(), fecha, registradas, yaAvisados, nombres: NOMBRES })
      // El ayuno que llegó a su meta
      const ay = leer(claveAyuno(uid), { actual: null })
      if (config.ayuno && ay.actual && estadoAyuno({ ...ay.actual, ahora: Date.now() }).cumplido) {
        const id = `ayuno-${ay.actual.inicio}`
        if (!yaAvisados.has(`${fecha}|${id}`) && !guardados.ids.includes(id))
          pendientes.push({ id, titulo: '¡Cumpliste tu ayuno!', texto: `Pasaron las ${ay.actual.horas} horas.` })
      }
      if (pendientes.length === 0) return
      guardar(claveAvisados, { fecha, ids: [...(guardados.fecha === fecha ? guardados.ids : []), ...pendientes.map((p) => p.id)] })
      for (const p of pendientes) {
        notificar(p.titulo, p.texto).then((sistema) => {
          if (!sistema) ref.current.avisar(p.titulo)
        })
      }
    }
    revisar()
    const t = setInterval(revisar, 30000)
    const alVolver = () => document.visibilityState === 'visible' && revisar()
    document.addEventListener('visibilitychange', alVolver)
    window.addEventListener(EVENTO, revisar)
    return () => {
      clearInterval(t)
      document.removeEventListener('visibilitychange', alVolver)
      window.removeEventListener(EVENTO, revisar)
    }
  }, [uid])
}
