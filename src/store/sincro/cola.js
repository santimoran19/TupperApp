// La cola de cambios hechos sin conexión: la de memoria (`s.cola`, para mostrar cuántos faltan) y la del teléfono, que es
// la que vale y comparten las pestañas. Ver ../sincronizacion.js.
import { anotarError } from '../../lib/eventos'
import { LOCAL } from '../cambios'
import { leerLocal } from '../local'

export function crearCola({ uid, s, copia, anotaciones, publicar, avisar, pedirAviso }) {
  const { claves, cambiarGuardado, enOrden } = copia
  const confirmados = new Set() // los que ya están guardados en el teléfono (si después no están, los mandó otra pestaña)
  let avisoCopia = false // ya se avisó que el teléfono no deja guardar

  // Lo que vale de la cola guardada: se dejan afuera los cambios que ya se mandaron, los de antes de cerrar sesión y
  // cualquier cosa que no tenga forma de cambio. Si había de los que sobran, se intenta sacarlos del teléfono.
  function loQueVale(guardada) {
    const lista = Array.isArray(guardada) ? guardada : []
    const mandados = anotaciones.mandados()
    const hasta = anotaciones.borradoHasta()
    const vale = (c) => !!c && !!c.id && !!c.tipo && !mandados.has(c.id) && (!hasta || (c.n || 0) > hasta)
    const buena = lista.filter(vale)
    if (buena.length < lista.length || mandados.size > 0 || hasta > 0) limpiarGuardado([...mandados], hasta)
    return buena
  }
  async function limpiarGuardado(mandados, hasta) {
    // Con la sesión cerrada no se escribe nada en el teléfono: tampoco se da nada por limpiado
    if (s.cerrado) return
    const sirve = (c) => !!c && !!c.id && !!c.tipo && !mandados.includes(c.id) && (!hasta || (c.n || 0) > hasta)
    try {
      await cambiarGuardado(claves.cola, (g) => (Array.isArray(g) ? g.filter(sirve) : undefined))
      if (s.cerrado) return
      anotaciones.olvidarMandados(mandados)
      if (!hasta) return
      // Lo que quedó de antes de cerrar sesión: la foto vieja y los cambios apartados
      await cambiarGuardado(claves.foto, (foto) => (foto && (foto.cuando || 0) > hasta ? foto : undefined))
      await cambiarGuardado(claves.descartados, (g) => {
        const nuevos = Array.isArray(g) ? g.filter((c) => (c?.cuando || 0) > hasta) : []
        return nuevos.length > 0 ? nuevos : undefined
      })
      if (!s.cerrado) anotaciones.olvidarBorrado(hasta)
    } catch {
      // se prueba de nuevo la próxima vez
    }
  }

  // La cola guardada al abrir (ya filtrada)
  function empezarCon(guardada) {
    s.cola = loQueVale(guardada)
    for (const c of s.cola) confirmados.add(c.id)
  }

  // Agrega un cambio a la cola del teléfono. Si el teléfono no deja guardar, el cambio queda solo en memoria y se avisa
  // (una vez): se va a mandar igual, salvo que la app se cierre antes.
  async function anotarEnCola(cambio) {
    try {
      await cambiarGuardado(claves.cola, (guardada) => [...(Array.isArray(guardada) ? guardada : []), cambio])
      confirmados.add(cambio.id)
      if (!s.conexion) pedirAviso()
    } catch {
      if (avisoCopia) return
      avisoCopia = true
      avisar('El teléfono no dejó guardar el cambio. Si cerrás la app antes de que vuelva la conexión, se pierde.', 'error')
    }
  }

  // Saca de la cola un cambio que ya se mandó (o que se dio por perdido)
  function sacarDeCola(cambio) {
    s.cola = s.cola.filter((c) => c.id !== cambio.id)
    confirmados.delete(cambio.id)
    anotaciones.anotarMandado(cambio.id)
    publicar()
    const sin = (guardada) => (Array.isArray(guardada) ? guardada.filter((c) => c?.id !== cambio.id) : undefined)
    return cambiarGuardado(claves.cola, sin).then(
      () => anotaciones.olvidarMandados([cambio.id]),
      () => {}, // no se pudo sacar: queda anotado como mandado y se saca la próxima vez
    )
  }

  // Pone la cola de memoria igual a la del teléfono, que es la que vale: puede tener cambios hechos en otra pestaña (o
  // ya mandados por otra pestaña o por el service worker). Los de acá que todavía no se llegaron a guardar se conservan.
  async function ponerAlDia() {
    let guardada
    try {
      guardada = await enOrden(() => leerLocal(claves.cola))
    } catch {
      return // no se pudo leer: se sigue con lo que hay en memoria
    }
    const lista = loQueVale(guardada)
    const enTelefono = new Set(lista.map((c) => c.id))
    for (const c of lista) confirmados.add(c.id)
    const soloAca = s.cola.filter((c) => !enTelefono.has(c.id) && !confirmados.has(c.id))
    s.cola = [...lista, ...soloAca].sort((a, b) => (a.n || 0) - (b.n || 0))
    publicar()
  }

  // Cuántos faltan mandar en el teléfono (contando los de otras pestañas). Si el teléfono tarda, no se lo espera.
  async function cuantosEnTelefono() {
    const guardados = enOrden(() => leerLocal(claves.cola)).then(
      (guardada) => loQueVale(guardada).length,
      () => 0,
    )
    return Promise.race([guardados, new Promise((listo) => setTimeout(() => listo(0), 2000))])
  }

  // Los datos con los cambios de la cola puestos encima (los que tengan número mayor que `desde`)
  function conLaCola(datos, desde = 0) {
    for (const c of s.cola) {
      if ((c.n || 0) <= desde || !LOCAL[c.tipo]) continue
      try {
        datos = LOCAL[c.tipo](datos, c.datos, uid)
      } catch {
        // No se puede mostrar, pero sigue en la cola y se manda igual
      }
    }
    return datos
  }

  // Un cambio que no se va a poder guardar: se avisa, queda anotado y se aparta (por si hay que recuperarlo a mano)
  function darPorPerdido(cambio, err) {
    s.perdidos++
    anotarError('pendiente', err, { accion: cambio.tipo, codigo: err.codigo || '', estado: err.estado || 0, perdido: true })
    const apartado = {
      ...cambio,
      error: String(err.message || err).slice(0, 300),
      cuando: Math.max(Date.now(), anotaciones.borradoHasta() + 1),
    }
    cambiarGuardado(claves.descartados, (g) => [...(Array.isArray(g) ? g : []).slice(-49), apartado]).catch(() => {})
  }

  // Anota en el cambio guardado cuántas veces falló (ver `mandarCola`)
  function marcarFalla(cambio) {
    const { falla, fallas } = cambio
    const marcar = (g) => (Array.isArray(g) ? g.map((c) => (c?.id === cambio.id ? { ...c, falla, fallas } : c)) : undefined)
    cambiarGuardado(claves.cola, marcar).catch(() => {})
  }

  return { empezarCon, anotarEnCola, sacarDeCola, ponerAlDia, cuantosEnTelefono, conLaCola, darPorPerdido, marcarFalla, loQueVale }
}
