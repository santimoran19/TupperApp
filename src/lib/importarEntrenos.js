// Traer entrenamientos de relojes y apps (1.30, F-22). Una app web no puede leer Apple Salud ni Health Connect, pero sí:
//   archivos GPX, TCX y FIT (lib/fit.js), que exportan Garmin Connect, Strava, Polar, Suunto, Coros, Google Fit (Takeout) y casi
//   todas las apps de correr o de bici (y Apple Salud, dentro de su exportación, guarda las rutas como GPX). La conexión directa
//   con Strava se sacó en la 1.31.2 (su API pasó a ser paga; ver PENDIENTES, F-22b).
// Todo termina en lo mismo: una "actividad" { origen, ref, nombre, deporte, inicio (ISO), minutos, distanciaKm, desnivelM,
// pulso, kcal } que se convierte en los datos de guardarEntrenamiento. Funciones puras (el XML se lee con expresiones
// regulares para poder probarlo sin navegador).

const R = 6371000 // radio de la Tierra en metros

function distancia(a, b) {
  const rad = Math.PI / 180
  const dLat = (b.lat - a.lat) * rad
  const dLon = (b.lon - a.lon) * rad
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)))
}

// Lo que se subió: suma de las subidas, sin contar las variaciones de menos de 3 m (el GPS sube y baja solo por error)
export function desnivelPositivo(alturas, umbral = 3) {
  const v = alturas.filter((x) => Number.isFinite(x))
  if (v.length < 2) return 0
  let ref = v[0]
  let total = 0
  for (const x of v.slice(1)) {
    if (x - ref >= umbral) {
      total += x - ref
      ref = x
    } else if (ref - x >= umbral) ref = x
  }
  return Math.round(total)
}

const etiqueta = (xml, nombre) => {
  const m = xml.match(new RegExp(`<(?:\\w+:)?${nombre}\\b[^>]*>([\\s\\S]*?)</(?:\\w+:)?${nombre}>`, 'i'))
  return m ? m[1].trim() : null
}
const todas = (xml, nombre) => [
  ...xml.matchAll(new RegExp(`<(?:\\w+:)?${nombre}\\b([^>]*)(?:/>|>([\\s\\S]*?)</(?:\\w+:)?${nombre}>)`, 'gi')),
]
const atributo = (attrs, nombre) => attrs.match(new RegExp(`\\b${nombre}\\s*=\\s*"([^"]*)"`, 'i'))?.[1] ?? null
const numero = (t) => {
  const n = Number(String(t ?? '').replace(',', '.'))
  return Number.isFinite(n) ? n : null
}
const promedio = (xs) => (xs.length ? Math.round(xs.reduce((s, x) => s + x, 0) / xs.length) : null)
const sinCdata = (t) => (t || '').replace(/^<!\[CDATA\[|\]\]>$/g, '').trim()

// Resumen de una lista de puntos { lat, lon, ele, t (ms), hr }
function resumir(puntos) {
  const conTiempo = puntos.filter((p) => Number.isFinite(p.t))
  const inicio = conTiempo[0]?.t ?? null
  const fin = conTiempo.at(-1)?.t ?? null
  let metros = 0
  const conPos = puntos.filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lon))
  for (let i = 1; i < conPos.length; i++) metros += distancia(conPos[i - 1], conPos[i])
  const pulsos = puntos.map((p) => p.hr).filter((x) => x >= 30 && x <= 230)
  return {
    inicio,
    minutos: inicio != null && fin != null ? Math.round((fin - inicio) / 60000) : null,
    distanciaKm: metros > 0 ? Math.round(metros / 10) / 100 : null,
    desnivelM: desnivelPositivo(puntos.map((p) => p.ele)),
    pulso: promedio(pulsos),
  }
}

// GPX (1.1): pistas con puntos; el deporte a veces viene en <type>
export function leerGpx(xml, archivo = '') {
  const puntos = todas(xml, 'trkpt').map(([, attrs, cuerpo = '']) => ({
    lat: numero(atributo(attrs, 'lat')),
    lon: numero(atributo(attrs, 'lon')),
    ele: numero(etiqueta(cuerpo, 'ele')),
    t: Date.parse(etiqueta(cuerpo, 'time') || '') || NaN,
    hr: numero(etiqueta(cuerpo, 'hr')),
  }))
  if (puntos.length < 2) return []
  const trk = etiqueta(xml, 'trk') || ''
  const r = resumir(puntos)
  if (!r.inicio) return []
  return [
    {
      origen: 'archivo',
      ref: `gpx-${r.inicio}`,
      nombre: sinCdata(etiqueta(trk, 'name')) || archivo.replace(/\.[^.]+$/, ''),
      deporte: sinCdata(etiqueta(trk, 'type')) || '',
      inicio: new Date(r.inicio).toISOString(),
      minutos: r.minutos,
      distanciaKm: r.distanciaKm,
      desnivelM: r.desnivelM || null,
      pulso: r.pulso,
      kcal: null,
    },
  ]
}

// TCX (Garmin Training Center): una o más actividades, cada una con vueltas que traen tiempo, distancia y calorías
export function leerTcx(xml) {
  return todas(xml, 'Activity')
    .map(([, attrs, cuerpo = '']) => {
      const vueltas = todas(cuerpo, 'Lap').map(([, a, c = '']) => ({
        inicio: Date.parse(atributo(a, 'StartTime') || '') || NaN,
        segundos: numero(etiqueta(c, 'TotalTimeSeconds')) || 0,
        metros: numero(etiqueta(c, 'DistanceMeters')) || 0,
        kcal: numero(etiqueta(c, 'Calories')) || 0,
        pulso: numero(etiqueta(etiqueta(c, 'AverageHeartRateBpm') || '', 'Value')),
      }))
      const puntos = todas(cuerpo, 'Trackpoint').map(([, , c = '']) => ({
        lat: numero(etiqueta(c, 'LatitudeDegrees')),
        lon: numero(etiqueta(c, 'LongitudeDegrees')),
        ele: numero(etiqueta(c, 'AltitudeMeters')),
        t: Date.parse(etiqueta(c, 'Time') || '') || NaN,
        hr: numero(etiqueta(etiqueta(c, 'HeartRateBpm') || '', 'Value')),
      }))
      const r = resumir(puntos)
      const id = etiqueta(cuerpo, 'Id')
      const inicio = Date.parse(id || '') || vueltas.find((v) => Number.isFinite(v.inicio))?.inicio || r.inicio
      if (!Number.isFinite(inicio)) return null
      const segundos = vueltas.reduce((s, v) => s + v.segundos, 0)
      const metros = vueltas.reduce((s, v) => s + v.metros, 0)
      const kcal = vueltas.reduce((s, v) => s + v.kcal, 0)
      // Pulso promedio ponderado por el tiempo de cada vuelta (si no hay, el de los puntos)
      const conPulso = vueltas.filter((v) => v.pulso > 0 && v.segundos > 0)
      const pulso = conPulso.length
        ? Math.round(conPulso.reduce((s, v) => s + v.pulso * v.segundos, 0) / conPulso.reduce((s, v) => s + v.segundos, 0))
        : r.pulso
      const deporte = atributo(attrs, 'Sport') || ''
      return {
        origen: 'archivo',
        ref: `tcx-${inicio}`,
        nombre: sinCdata(etiqueta(cuerpo, 'Notes')) || '',
        deporte,
        inicio: new Date(inicio).toISOString(),
        minutos: segundos > 0 ? Math.round(segundos / 60) : r.minutos,
        distanciaKm: metros > 0 ? Math.round(metros / 10) / 100 : r.distanciaKm,
        desnivelM: r.desnivelM || null,
        pulso,
        kcal: kcal > 0 ? Math.round(kcal) : null,
      }
    })
    .filter(Boolean)
}

// Un archivo cualquiera: se fija por la extensión o por el contenido
export function leerArchivo(texto, nombre = '') {
  const t = String(texto || '')
  if (/\.tcx$/i.test(nombre) || /<TrainingCenterDatabase/i.test(t)) return leerTcx(t)
  if (/\.gpx$/i.test(nombre) || /<gpx[\s>]/i.test(t)) return leerGpx(t, nombre)
  return []
}

// ---------- A qué actividad del catálogo corresponde ----------
// Nombres de deporte de Strava, Garmin (TCX: Running, Biking, Other) y lo que suelen poner las apps en GPX
const DEPORTES = [
  [/trail ?run/i, 'trail'],
  [/virtual ?run|treadmill|cinta/i, 'correr-cinta'],
  [/run|correr|carrera|running/i, 'correr'],
  [/hike|trek|sender/i, 'senderismo'],
  [/walk|caminat|caminar/i, 'caminar'],
  [/mountain ?bike|mtb|gravel/i, 'bici-montana'],
  [/virtual ?ride|indoor ?cycl|spin|estatica|fija/i, 'bici-fija'],
  [/e-?bike/i, 'bici-paseo'],
  [/ride|bik|cycl|bici/i, 'bici-ruta'],
  [/swim|natac|nadar/i, 'natacion'],
  [/indoor ?row|rowing ?machine|ergo|remo en maquina/i, 'remo-maquina'],
  [/row|remo/i, 'remo-agua'],
  [/kayak|canoe/i, 'kayak'],
  [/stand ?up|paddle|sup\b/i, 'sup'],
  [/surf/i, 'surf'],
  [/elliptical|eliptic/i, 'eliptico'],
  [/stair|escalera/i, 'escaladora'],
  [/weight|strength|pesas|musculac/i, 'pesas'],
  [/crossfit/i, 'crossfit'],
  [/hiit/i, 'hiit'],
  [/yoga/i, 'yoga'],
  [/pilates/i, 'pilates'],
  [/soccer|futbol|football/i, 'futbol'],
  [/tennis|tenis/i, 'tenis'],
  [/padel|pádel/i, 'padel'],
  [/golf/i, 'golf'],
  [/rock ?climb|escalada/i, 'escalada'],
  [/alpine ?ski|ski|esqui/i, 'esqui'],
  [/snowboard/i, 'snowboard'],
  [/inline ?skate|roller|patin/i, 'patin'],
  [/skate/i, 'monopatin'],
  [/workout|entren|training/i, 'funcional'],
]

// El slug de la actividad que corresponde a un deporte (o null si no se sabe). Mira el deporte y, si no, el nombre.
export function slugDeDeporte(deporte, nombre = '') {
  for (const texto of [deporte, nombre]) {
    if (!texto) continue
    for (const [patron, slug] of DEPORTES) if (patron.test(texto)) return slug
  }
  return null
}

// La fecha local (AAAA-MM-DD) de un momento ISO, en la zona del teléfono
export function fechaLocal(iso) {
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// ¿Ya está anotada? Mismo origen (la referencia va en las notas) o mismo día, actividad y duración parecida
export function yaEsta(act, entrenamientos, tipo) {
  const fecha = fechaLocal(act.inicio)
  return (entrenamientos || []).some(
    (w) =>
      (w.notes || '').includes(act.ref) ||
      (w.fecha === fecha && (!tipo || w.type_id === tipo.id) && Math.abs(Number(w.duration_min) - Number(act.minutos)) <= 2),
  )
}

// Lo que se le pasa a guardarEntrenamiento. Las calorías del reloj, si vienen, se usan como "reloj" (activas: es lo que
// marcan los relojes para una actividad).
export function datosDeEntreno(act, tipo) {
  return {
    fecha: fechaLocal(act.inicio),
    tipo,
    nombre: tipo && tipo.slug !== 'otra' ? undefined : (act.nombre || 'Entrenamiento').slice(0, 60),
    minutos: Math.max(1, Math.min(1440, Math.round(Number(act.minutos) || 0))),
    distancia: act.distanciaKm > 0 ? Math.min(1000, act.distanciaKm) : '',
    desnivel: act.desnivelM > 0 ? Math.min(20000, act.desnivelM) : '',
    pulso: act.pulso >= 30 && act.pulso <= 230 ? act.pulso : '',
    reloj: act.kcal > 0 ? Math.min(10000, Math.round(act.kcal)) : '',
    relojActivas: true,
    notas: `${act.nombre ? `${act.nombre.slice(0, 120)} · ` : ''}Importado de archivo (${act.ref})`.slice(0, 300),
  }
}

// Las actividades listas para mostrar: con su actividad del catálogo y si ya estaban anotadas. Las de menos de un minuto
// (archivos vacíos o cortados) no se ofrecen.
export function prepararImportacion(actividades, { catalogo, entrenamientos }) {
  const porSlug = new Map((catalogo || []).map((t) => [t.slug, t]))
  const otra = porSlug.get('otra') || null
  return actividades
    .filter((a) => a && a.inicio && Number(a.minutos) >= 1)
    .map((a) => {
      const tipo = porSlug.get(slugDeDeporte(a.deporte, a.nombre)) || otra
      return { act: a, tipo, repetida: yaEsta(a, entrenamientos, tipo) }
    })
    .sort((x, y) => (x.act.inicio < y.act.inicio ? 1 : -1))
}
