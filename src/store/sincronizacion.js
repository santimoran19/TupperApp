// Sincronización: mantiene lo que se ve en pantalla al día con la base, con o sin conexión.
//
//   - Al abrir, muestra la última foto guardada en el teléfono (si hay) y después trae todo de la base.
//   - Al volver a la app después de un rato trae todo de nuevo sin mostrar "Cargando": lo que se cambió desde otro
//     dispositivo aparece solo.
//   - Los cambios de todos los días (ver cambios.js y envios.js) se pueden hacer sin conexión: se aplican en la copia
//     del teléfono, quedan en una cola y se mandan en orden cuando vuelve la conexión.
//
// La cola vive en el teléfono (IndexedDB) y la comparten las pestañas abiertas: cada cambio se agrega y se saca de a
// uno, y la manda una sola pestaña por vez. Lo que hay en memoria es una copia para mostrar cuántos faltan.
//
// No es un componente: es un objeto con su propio estado, creado una vez por sesión (ver Datos.jsx). A React le avisa
// con `setE` (los datos) y `alEstado` (si hay conexión y cuántos cambios faltan mandar).
//
// Partes (1.32, T-05): sincro/anotaciones.js (lo que va en localStorage), sincro/candado.js (una pestaña por vez),
// sincro/copia.js (la foto y las escrituras en el teléfono) y sincro/cola.js (la cola guardada). Acá queda mandar la
// cola, traer los datos, los avisos del navegador y las acciones. El estado que comparten las partes va en `s`.
import { anotarError } from '../lib/eventos'
import { ok, SIN_CONEXION, supabase } from './base'
import { traer, VACIO } from './carga'
import { GUARDADO, LOCAL } from './cambios'
import { ENVIOS } from './envios'
import { SIN_CLAVE } from './envios-base'
import { nuevaClave } from './listas'
import { borrarLocal, leerLocal } from './local'
import { crearAnotaciones } from './sincro/anotaciones'
import { crearCandado } from './sincro/candado'
import { crearCola } from './sincro/cola'
import { crearCopia, FORMA } from './sincro/copia'
import { anotarSesionParaElSW, olvidarSesionDelSW } from './sincro/sesionSW'

// Cada cuánto, como mínimo, se vuelven a traer los datos al volver a la app
const REFRESCO_MS = 60 * 1000
// Con cambios sin mandar o sin conexión, cada cuánto se prueba de nuevo mientras la app está a la vista
const REINTENTO_MS = 15 * 1000
// Cuánto se espera a que Supabase renueve el permiso de la sesión antes de tratarlo como "sin conexión"
const ESPERA_SESION_MS = 4000
// Cuando la base rechaza un cambio de la cola por algo que no es el dato en sí (el servidor caído, un permiso, una
// función que falta), el cambio NO se tira: se espera esta pausa y se prueba de nuevo...
const PAUSA_MS = 60 * 1000
// ...y recién se da por perdido cuando falló en varias ocasiones separadas por medio día (como mínimo, un día y medio
// fallando). Si no se diera nunca por perdido, trabaría para siempre a los de atrás. Una caída del servidor de un rato
// cuenta como una sola ocasión, por más intentos que se hagan.
const OCASIONES = 4
const ENTRE_OCASIONES_MS = 12 * 60 * 60 * 1000
// Al cerrar sesión, cuánto se espera como mucho a que el teléfono termine de borrar la copia
const ESPERA_BORRADO_MS = 3000

// La base lo rechazó por el dato en sí (algo fuera de rango, un alimento que ya no existe): reintentar no lo arregla
const esDefinitivo = (err) => /^(22|23)/.test(err.codigo || '') || err.codigo === 'P0001'

export function crearSincronizacion({ uid, setE, avisar, alEstado }) {
  // Lo que comparten las partes (sincro/*)
  const s = {
    cola: [], // cambios hechos sin conexión que faltan mandar, en el orden en que se hicieron
    conexion: true, // false desde que un pedido falla por falta de conexión hasta que alguno anda
    cerrado: false, // se cerró la sesión: no se guarda nada más en el teléfono
    numero: 0, // número del último cambio anotado en la cola (la foto guarda hasta cuál tiene aplicado)
    perdidos: 0, // cambios que se dieron por perdidos en esta pasada
  }
  const anotaciones = crearAnotaciones(uid)
  const conCandado = crearCandado(uid, anotaciones)
  const copia = crearCopia(uid, s, anotaciones)
  const { claves, guardarFoto, escribirFoto, enOrden } = copia
  const cola = crearCola({ uid, s, copia, anotaciones, publicar: () => publicar(), avisar, pedirAviso: () => pedirAviso() })

  let trabada = false // la base está rechazando el primer cambio de la cola
  let enPausa = false // se está esperando para probar de nuevo
  let hayDatos = false // ya hay algo para mostrar (de la copia del teléfono o de la base)
  let ultimaCarga = 0 // cuándo se trajeron los datos de la base por última vez
  let enCurso = 0 // acciones que están esperando a la base
  let cambiosLocales = 0 // sube con cada cambio hecho desde acá: sirve para no pisarlo con una foto sacada antes
  let debeTraer = false // hay que traer todo de nuevo en cuanto no haya nada en curso
  let pasada = null // la sincronización que está corriendo
  let otraPasada = false // pidieron sincronizar mientras corría una: se hace otra al terminar
  let renovada = false // ya se renovó el permiso de la sesión por un rechazo de la base (una vez, hasta que algo ande)
  let turno = 0 // cambia cada vez que se inicia o se cierra: lo que quedó de antes no sigue
  let arrancado = false // ya se leyó la copia del teléfono: recién ahí se puede sincronizar
  let ultimoFallo = 0 // cuándo falló por última vez traer los datos por algo que no es la conexión
  let relojCadaTanto = null
  let relojPronto = null
  let relojPausa = null
  let publicado = ''
  let swLimpio = false // ya se borró el permiso del service worker que pudo quedar de antes

  // Le avisa a React solo cuando cambió algo (cada aviso redibuja la pantalla)
  function publicar() {
    const estado = { sinConexion: !s.conexion, pendientes: s.cola.length, trabada: trabada && s.cola.length > 0 }
    const huella = `${estado.sinConexion}|${estado.pendientes}|${estado.trabada}`
    if (huella === publicado) return
    publicado = huella
    alEstado(estado)
  }
  const marcarConexion = (hay) => {
    if (s.conexion !== hay) {
      s.conexion = hay
      publicar()
    }
  }
  // El error de "no hay conexión" cuando el pedido ni llegó a salir (se sabe que la base no lo recibió)
  const sinConexion = () => Object.assign(new Error(SIN_CONEXION), { sinConexion: true, noSalio: true })

  // Sin una sesión válida de este usuario no se manda nada: Supabase mandaría los pedidos "sin usuario" (o con el de
  // otra cuenta, si en otra pestaña se cambió de usuario). Pasa cuando el permiso venció (dura una hora) y no se pudo
  // renovar por falta de conexión. Con el permiso al día esto contesta al instante; si hay que renovarlo y no hay red,
  // Supabase insiste hasta medio minuto: no se lo espera. Si la conexión solo estaba lenta, se sincroniza cuando llega.
  async function conSesion() {
    const esDeAca = (r) => r?.data?.session?.user?.id === uid
    const pedido = supabase.auth.getSession().catch(() => null)
    let tarde = false
    const espera = new Promise((listo) =>
      setTimeout(() => {
        tarde = true
        listo(null)
      }, ESPERA_SESION_MS),
    )
    if (esDeAca(await Promise.race([pedido, espera]))) return
    if (tarde)
      pedido.then((r) => {
        if (esDeAca(r)) sincronizar()
      })
    throw sinConexion()
  }

  // Un pedido liviano para saber si la base contesta, antes de pedirle todo. No insiste: la librería de Supabase repite
  // sola las lecturas que fallan (hasta 3 veces, unos 7 segundos en total) y acá hace falta saberlo enseguida.
  const probar = async () => ok(await supabase.from('profiles').select('id').eq('id', uid).limit(1).retry(false))

  // Manda la cola, en orden. Devuelve 'lista' si quedó vacía o 'trabada' si la base rechazó el primero por algo que
  // puede ser pasajero. Si no hay conexión tira el error. La corre una sola pestaña por vez (ver `conCandado`).
  async function mandarCola(mio, permiso) {
    anotaciones.latir()
    await cola.ponerAlDia()
    while (s.cola.length > 0) {
      if (!permiso.vale) return 'ocupada'
      anotaciones.latir()
      const cambio = s.cola[0]
      try {
        await ENVIOS[cambio.tipo](cambio.datos, uid)
        renovada = false
      } catch (err) {
        if (err.sinConexion) throw err
        // La base contestó: conexión hay, aunque no lo haya aceptado
        if (mio === turno) marcarConexion(true)
        // El permiso de la sesión no le sirvió a la base aunque acá parecía vigente (pasa si el reloj del teléfono
        // atrasa): se pide uno nuevo y se prueba otra vez
        if (err.estado === 401 && !renovada) {
          renovada = true
          anotaciones.latir()
          await supabase.auth.refreshSession().catch(() => {})
          continue
        }
        if (!esDefinitivo(err)) {
          // Cuenta como una ocasión más solo si pasó medio día desde la anterior
          const ahora = Date.now()
          // (una hora de falla en el futuro quiere decir que el reloj del teléfono estaba adelantado: se cuenta igual)
          if (!cambio.falla || ahora < cambio.falla || ahora - cambio.falla >= ENTRE_OCASIONES_MS) {
            cambio.falla = ahora
            cambio.fallas = (cambio.fallas || 0) + 1
            cola.marcarFalla(cambio)
            anotarError('pendiente', err, { accion: cambio.tipo, codigo: err.codigo || '', estado: err.estado || 0, fallas: cambio.fallas })
          }
          if ((cambio.fallas || 1) < OCASIONES) return 'trabada'
        }
        cola.darPorPerdido(cambio, err)
      }
      // Ya llegó a la base (o se dio por perdido): se saca de la cola aunque la sesión se haya cerrado en el camino,
      // para que no se mande de nuevo la próxima vez
      await cola.sacarDeCola(cambio)
      if (mio !== turno) return 'cerrada'
      marcarConexion(true)
    }
    return 'lista'
  }

  function pausar() {
    trabada = true
    enPausa = true
    publicar()
    clearTimeout(relojPausa)
    relojPausa = setTimeout(() => {
      enPausa = false
      renovada = false
      sincronizar()
    }, PAUSA_MS)
  }

  // ---------- Sincronizar: mandar lo que quedó en cola y traer todo ----------
  // Corre de a una. Si la piden mientras está corriendo, al terminar se hace otra.
  function sincronizar() {
    if (!arrancado || s.cerrado) return Promise.resolve()
    if (pasada) {
      otraPasada = true
      return pasada
    }
    const mio = turno
    pasada = (async () => {
      try {
        do {
          otraPasada = false
          await unaPasada(mio)
        } while (otraPasada && s.conexion && !enPausa && mio === turno)
      } finally {
        pasada = null
      }
    })()
    return pasada
  }

  async function unaPasada(mio) {
    s.perdidos = 0
    try {
      await conSesion()
      // Antes que nada, un pedido liviano: si no hay conexión se sabe enseguida y aparece el aviso.
      // Con cambios para mandar no hace falta: el primero hace de prueba.
      if (s.cola.length === 0) {
        await probar()
        if (mio !== turno) return
        marcarConexion(true)
      }
      // 1. Lo que quedó en cola. Mientras haya algo ahí, los cambios nuevos se anotan atrás (ver `operar`).
      const sinColaAntes = s.cola.length === 0
      if (!enPausa) {
        const fin = await conCandado((permiso) => mandarCola(mio, permiso))
        if (mio !== turno) return
        if (fin === 'trabada') pausar()
        else if (fin === 'lista' && trabada) {
          trabada = false
          publicar()
        } else if (fin === 'ocupada' && s.cola.length > 0) {
          // La está mandando otra pestaña. Para no dejar "Sin conexión" si en realidad hay, se comprueba.
          await probar()
          if (mio !== turno) return
          marcarConexion(true)
        }
      }
      // Sin nada para mandar, el service worker ya no necesita el permiso (T-07b). Se mira al vaciarse la cola y una vez
      // al abrir (por si quedó de antes y la cola la mandó el service worker)
      if (s.cola.length === 0 && (!sinColaAntes || !swLimpio)) {
        swLimpio = true
        olvidarSesionDelSW(uid)
      }
      // Si quedó algo (otra pestaña la está mandando, o se está esperando para probar de nuevo), todavía no se trae:
      // lo que vendría de la base no tiene esos cambios y pisaría lo que se ve
      if (s.cola.length > 0) {
        // Salvo que no haya nada para mostrar (no había foto en el teléfono): ahí se trae y se le ponen encima los
        // cambios de la cola, para que la app no se quede en "Cargando..." hasta que la cola se destrabe.
        if (!hayDatos) {
          const datos = await traer(uid)
          if (mio !== turno || hayDatos) return
          hayDatos = true
          setE(cola.conLaCola(datos))
        }
        return
      }
      // 2. Todo de nuevo desde la base, salvo que justo haya un cambio en curso (lo pide ese cambio al terminar)
      if (enCurso > 0) {
        debeTraer = true
        return
      }
      const antes = cambiosLocales
      const datos = await traer(uid)
      if (mio !== turno) return
      marcarConexion(true)
      renovada = false
      // Mientras se traía hubo un cambio desde acá: esta foto ya no sirve
      if (antes !== cambiosLocales || enCurso > 0 || s.cola.length > 0) {
        if (enCurso > 0) debeTraer = true
        else otraPasada = true
        return
      }
      debeTraer = false
      ultimoFallo = 0
      ultimaCarga = Date.now()
      hayDatos = true
      setE(datos)
      // Queda a la vista que lo que hay en pantalla ya es lo de la base y no la copia del teléfono (lo usan las pruebas)
      document.documentElement.dataset.datos = 'base'
    } catch (err) {
      if (mio !== turno) return
      if (err.sinConexion) marcarConexion(false)
      else {
        // Se prueba de nuevo más tarde (ver `cadaTanto`)
        debeTraer = true
        ultimoFallo = Date.now()
        anotarError('carga', err)
        // El permiso de la sesión no le sirvió a la base: se pide uno nuevo y se prueba otra vez (una sola)
        if (err.estado === 401 && !renovada) {
          renovada = true
          await supabase.auth.refreshSession().catch(() => {})
          otraPasada = true
        }
      }
      // Sin nada para mostrar, se avisa en pantalla. Con datos (aunque sean los de la copia), se sigue con lo que hay.
      if (!hayDatos) setE((s) => ({ ...s, cargando: false, errorCarga: err.message }))
    } finally {
      if (s.perdidos > 0 && mio === turno)
        avisar(
          s.perdidos === 1
            ? 'Un cambio que hiciste sin conexión no se pudo guardar.'
            : `${s.perdidos} cambios que hiciste sin conexión no se pudieron guardar.`,
          'error',
        )
    }
  }

  // Al volver a la app o al recuperar la conexión. (Volver dispara dos avisos seguidos, de ahí el `pasada`.)
  function alVolver() {
    if (pasada || document.visibilityState !== 'visible') return
    if (s.cola.length > 0 || !s.conexion || debeTraer || Date.now() - ultimaCarga >= REFRESCO_MS) sincronizar()
  }
  // Cada tanto, mientras falte algo. Se prueba aunque el teléfono diga que no hay red: hay navegadores que se equivocan.
  function cadaTanto() {
    if (pasada || enPausa || document.visibilityState !== 'visible') return
    if (s.cola.length > 0 || !s.conexion || !hayDatos || (debeTraer && Date.now() - ultimoFallo >= PAUSA_MS)) sincronizar()
  }
  const alSalir = () => {
    if (document.visibilityState === 'hidden') escribirFoto()
  }
  // Sin conexión y con cambios en la cola, se le pide al navegador que avise cuando vuelva (1.29, T-07): el service
  // worker (src/sw.js) le pasa el aviso a la app aunque esté en segundo plano, y ahí se manda la cola sin esperar a volver.
  function pedirAviso() {
    // Y si la app se cierra del todo, el service worker manda la cola solo (T-07b)
    anotarSesionParaElSW(uid)
    try {
      globalThis.navigator?.serviceWorker?.ready.then((r) => r.sync?.register('tupper-cola')).catch(() => {})
    } catch {
      // navegadores sin esto: se manda al volver a la app, como siempre
    }
  }
  const alAvisoDelSW = (ev) => {
    if (ev.data?.tipo === 'tupper:sincronizar' && !pasada && (s.cola.length > 0 || !s.conexion)) sincronizar()
  }

  // "Reintentar": lo pide la persona, así que no se espera la pausa
  function reintentar() {
    enPausa = false
    renovada = false
    clearTimeout(relojPausa)
    return sincronizar()
  }

  // ---------- Arranque y cierre ----------
  async function iniciar() {
    const mio = ++turno
    s.cerrado = false
    document.documentElement.dataset.datos = 'cargando'
    document.addEventListener('visibilitychange', alVolver)
    document.addEventListener('visibilitychange', alSalir)
    window.addEventListener('focus', alVolver)
    window.addEventListener('online', alVolver)
    window.addEventListener('pagehide', escribirFoto)
    globalThis.navigator?.serviceWorker?.addEventListener?.('message', alAvisoDelSW)
    relojCadaTanto = setInterval(cadaTanto, REINTENTO_MS)
    // Se le pide al navegador que no borre la copia si le falta lugar (puede decir que no; no cambia nada)
    navigator.storage?.persist?.().catch(() => {})
    let foto, guardada
    try {
      ;[foto, guardada] = await Promise.all([leerLocal(claves.foto), leerLocal(claves.cola)])
    } catch {
      // El teléfono no dejó leer la copia: se arranca sin ella. La cola se vuelve a leer en cada pasada.
    }
    if (mio !== turno) return
    cola.empezarCon(guardada)
    s.numero = Math.max(s.numero, foto?.hasta || 0, ...s.cola.map((c) => c.n || 0))
    // Una foto de antes de cerrar sesión que no se pudo borrar en su momento no se usa
    if (foto?.forma === FORMA && foto.datos && (foto.cuando || 0) > anotaciones.borradoHasta()) {
      // Los cambios de la cola que la foto todavía no tenía (la app se cerró antes de guardarla) se aplican ahora
      hayDatos = true
      setE({ ...cola.conLaCola({ ...VACIO, ...foto.datos }, foto.hasta || 0), cargando: false, errorCarga: null })
    }
    arrancado = true
    publicar()
    await sincronizar()
  }

  function cerrar() {
    turno++
    arrancado = false
    escribirFoto()
    document.removeEventListener('visibilitychange', alVolver)
    document.removeEventListener('visibilitychange', alSalir)
    window.removeEventListener('focus', alVolver)
    window.removeEventListener('online', alVolver)
    window.removeEventListener('pagehide', escribirFoto)
    globalThis.navigator?.serviceWorker?.removeEventListener?.('message', alAvisoDelSW)
    clearInterval(relojCadaTanto)
    clearTimeout(relojPronto)
    clearTimeout(relojPausa)
    relojPronto = null
    enPausa = false
  }

  // Al cerrar sesión: no queda nada de esta cuenta en el teléfono
  async function vaciar() {
    turno++
    s.cerrado = true
    copia.olvidarFoto()
    s.cola = []
    // Antes de borrar se anota la hora: si el teléfono no deja borrar (o tarda demasiado), lo guardado antes de ese
    // momento no se usa ni se manda nunca más, y se borra la próxima vez que se pueda (ver `loQueVale` en sincro/cola.js)
    anotaciones.marcarBorrado(Math.max(Date.now(), s.numero))
    // También el permiso que tenía el service worker para mandar la cola (T-07b)
    const borrado = enOrden(() => borrarLocal([claves.foto, claves.cola, claves.descartados]).then(() => olvidarSesionDelSW(uid))).then(
      () => anotaciones.olvidarTodo(),
      () => {}, // queda la anotación
    )
    await Promise.race([borrado, new Promise((listo) => setTimeout(listo, ESPERA_BORRADO_MS))])
  }

  // Cuántos cambios faltan mandar, contando los que haya anotado otra pestaña
  async function pendientes() {
    return Math.max(s.cola.length, await cola.cuantosEnTelefono())
  }

  // ---------- Acciones ----------
  // Envuelve cada acción: si falla muestra el error (y lo deja anotado) y devuelve false.
  // Con `unica`, si llega el mismo pedido mientras el anterior sigue en curso (un doble toque con la conexión lenta),
  // no se manda de nuevo: los dos toques reciben el resultado del primero. Sin eso, cocinar o comprar contarían dos veces.
  // Con `enCola`, la acción se puede hacer sin conexión (usa `operar`). Las demás necesitan la base: antes de arrancar
  // se comprueba que haya sesión, para avisar enseguida que no hay conexión en vez de quedar esperando.
  const enVuelo = new Map()
  const accion =
    (nombre, fn, { unica = false, enCola = false } = {}) =>
    (...args) => {
      const clave = unica ? `${nombre}|${JSON.stringify(args)}` : null
      if (clave && enVuelo.has(clave)) return enVuelo.get(clave)
      const pedido = (async () => {
        enCurso++
        cambiosLocales++
        try {
          if (!enCola) await conSesion()
          const r = await fn(...args)
          return r === undefined ? true : r
        } catch (err) {
          avisar(err?.message || 'Algo salió mal. Probá de nuevo en un rato.', 'error')
          if (!err?.sinConexion && !err?.esperado) anotarError('accion', err, { accion: nombre, codigo: err?.codigo || '' })
          // Si se cortó, no se sabe si el cambio llegó a guardarse: en cuanto se pueda se trae todo de nuevo
          if (err?.sinConexion) {
            debeTraer = true
            marcarConexion(false)
          }
          return false
        } finally {
          enCurso--
          cambiosLocales++
          if (enCurso === 0 && s.conexion && !enPausa && (s.cola.length > 0 || debeTraer))
            setTimeout(sincronizar, s.cola.length > 0 ? 0 : 2000)
        }
      })()
      if (clave) {
        enVuelo.set(clave, pedido)
        pedido.finally(() => enVuelo.delete(clave))
      }
      return pedido
    }

  // Un cambio de los que se pueden hacer sin conexión. Con conexión va directo a la base, como siempre. Si no hay
  // (o si se corta en el camino), se aplica en la copia del teléfono y queda en la cola. Se usa adentro de una `accion`.
  async function operar(tipo, datos) {
    if (s.cerrado) throw sinConexion()
    // Si el teléfono avisa que no tiene red, ni se intenta: el pedido no saldría
    if (navigator.onLine === false) marcarConexion(false)
    // Con cambios esperando, este va atrás de los otros: el orden importa
    if (s.cola.length === 0 && s.conexion) {
      try {
        await conSesion()
        const r = await ENVIOS[tipo](datos, uid)
        // `repetida`: la base ya lo tenía (no debería pasar con una clave nueva). Lo de pantalla se pone al día trayendo todo.
        if (r?.repetida) debeTraer = true
        else setE((s) => GUARDADO[tipo](s, r, datos))
        return
      } catch (err) {
        // Lo que la base rechaza por el dato (o por algo que no se arregla solo) se le muestra a la persona, como siempre
        if (!err.sinConexion && !err.pasajero) throw err
        if (err.sinConexion) marcarConexion(false)
        // Un cambio que suma y no lleva clave: si el pedido salió y no se sabe si llegó, mandarlo de nuevo podría
        // contarlo dos veces. Se avisa y, en cuanto se pueda, se trae lo que quedó en la base.
        // (Con un 401 o un 429 la base lo rechazó antes de hacer nada: ahí sí se puede dejar para después.)
        if (SIN_CLAVE.has(tipo) && !err.noSalio && err.estado !== 401 && err.estado !== 429) {
          debeTraer = true
          throw err
        }
      }
    }
    // Si mientras se esperaba a la base se cerró la sesión, ya no se anota nada en el teléfono
    if (s.cerrado) throw sinConexion()
    const cambio = { id: nuevaClave(), tipo, datos, n: (s.numero = Math.max(Date.now(), s.numero + 1, anotaciones.borradoHasta() + 1)) }
    setE((e) => LOCAL[tipo](e, datos, uid))
    s.cola = [...s.cola, cambio]
    publicar()
    await cola.anotarEnCola(cambio)
    // Puede que la conexión ya haya vuelto y todavía no nos enteramos: se prueba enseguida (una vez, no por cada cambio)
    if (!s.conexion && !relojPronto) {
      relojPronto = setTimeout(() => {
        relojPronto = null
        sincronizar()
      }, 1500)
    }
  }

  // Pedidos en fila: los toques seguidos sobre lo mismo (el + y el - de la despensa) salen de a uno y en orden,
  // así la pantalla siempre termina mostrando el último valor que devolvió la base.
  const filas = new Map()
  const enFila = (clave, fn) => {
    const anterior = filas.get(clave) || Promise.resolve()
    const esta = anterior.catch(() => {}).then(fn)
    filas.set(clave, esta)
    esta
      .catch(() => {})
      .finally(() => {
        if (filas.get(clave) === esta) filas.delete(clave)
      })
    return esta
  }

  return {
    iniciar,
    cerrar,
    vaciar,
    sincronizar,
    reintentar,
    guardarFoto,
    accion,
    operar,
    enFila,
    pendientes,
    // Para los cambios que no pasan por `accion` (el análisis con IA): avisa que el estado se tocó desde acá
    tocar: () => {
      cambiosLocales++
    },
  }
}
