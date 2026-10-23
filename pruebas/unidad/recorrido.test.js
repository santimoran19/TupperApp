// Recorrido inicial (src/lib/recorrido.js y src/components/Recorrido.jsx): que los pasos apunten a cosas que existen,
// que solo lo vea quien lo tiene pendiente y que el resaltado y el cartel queden siempre dentro de la pantalla.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, beforeEach, expect, test } from 'vitest'
import {
  PASOS,
  aroDe,
  desplazamiento,
  franjas,
  guardarPaso,
  iniciarRecorrido,
  leerRecorrido,
  terminarRecorrido,
  ubicarCartel,
} from '../../src/lib/recorrido.js'

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const SRC = path.join(RAIZ, 'src')
const leer = (rel) => fs.readFileSync(path.join(SRC, rel), 'utf8')

// ---------- Los pasos ----------
// En qué archivos puede estar el elemento de cada pantalla (la pantalla y las piezas que usa)
const ARCHIVOS_DE = {
  '/': ['pages/Diario.jsx', 'components/Marco.jsx'],
  '/registrar': ['pages/Registrar.jsx', 'components/SelectorAlimento.jsx'],
  '/recetas': ['pages/Recetas.jsx'],
  '/recetas/nueva': ['pages/RecetaNueva.jsx'],
  '/despensa': ['pages/Despensa.jsx'],
  '/compras': ['pages/Compras.jsx'],
  '/plan': ['pages/Plan.jsx'],
  '/perfil': ['pages/Perfil.jsx', 'components/Hogar.jsx'],
}

// Las anclas que hay marcadas en el código: data-tour="x" o data-tour={cond ? 'x' : undefined}
function anclasEn(rel) {
  const texto = leer(rel)
  const hay = new Set()
  for (const m of texto.matchAll(/data-tour=(?:"([a-z-]+)"|\{[^}]*'([a-z-]+)'[^}]*\})/g)) hay.add(m[1] || m[2])
  return hay
}

test('los pasos tienen lo que tienen que tener', () => {
  const ids = PASOS.map((p) => p.id)
  expect(new Set(ids).size, 'ids repetidos').toBe(ids.length)
  for (const p of PASOS) {
    expect(p.titulo?.trim(), p.id).toBeTruthy()
    expect(p.texto?.trim().length, p.id).toBeGreaterThan(20)
    expect(Object.keys(ARCHIVOS_DE), p.id).toContain(p.ruta)
    expect([undefined, 'info', 'toque'], p.id).toContain(p.tipo)
    // Un paso de tocar necesita algo para tocar
    if (p.tipo === 'toque') expect(p.ancla, p.id).toBeTruthy()
    // Lo que está adentro de una ventana se tiene que poder abrir desde la pantalla limpia
    if (p.enHoja) expect(p.abre?.length, p.id).toBeGreaterThan(0)
    else expect(p.abre, p.id).toBeUndefined()
  }
  // Empieza y termina sin resaltar nada, en el diario
  expect(PASOS[0].ancla).toBeUndefined()
  expect(PASOS.at(-1).ancla).toBeUndefined()
  expect(PASOS[0].ruta).toBe('/')
  expect(PASOS.at(-1).ruta).toBe('/')
  // El nombre solo se usa en la bienvenida
  expect(PASOS.filter((p) => p.titulo.includes('{nombre}')).map((p) => p.id)).toEqual(['bienvenida'])
})

test('cada ancla de un paso está marcada en el código de esa pantalla', () => {
  for (const p of PASOS) {
    if (!p.ancla) continue
    const hay = ARCHIVOS_DE[p.ruta].some((rel) => anclasEn(rel).has(p.ancla))
    expect(hay, `${p.id}: no hay data-tour="${p.ancla}" en ${ARCHIVOS_DE[p.ruta].join(' ni ')}`).toBe(true)
  }
})

test('lo que se toca para abrir una ventana también está marcado, y antes de usarlo se muestra', () => {
  const todas = new Set(
    Object.values(ARCHIVOS_DE)
      .flat()
      .flatMap((rel) => [...anclasEn(rel)]),
  )
  for (const p of PASOS.filter((x) => x.abre)) {
    for (const a of p.abre) expect(todas.has(a), `${p.id}: abre ${a}`).toBe(true)
  }
  // Cada cosa que se abre con un toque tiene su paso (para que la persona la haya visto antes de que se toque sola)
  const ids = PASOS.map((p) => p.ancla)
  for (const p of PASOS.filter((x) => x.abre)) {
    for (const a of p.abre) expect(ids.indexOf(a), `${p.id}: ${a} no tiene paso`).toBeGreaterThan(-1)
    for (const a of p.abre) expect(ids.indexOf(a), `${a} va después de ${p.id}`).toBeLessThan(PASOS.indexOf(p))
  }
})

test('los pasos de una ventana van seguidos y los de después no quedan tapados por ella', () => {
  const dentro = PASOS.map((p, n) => (p.enHoja ? n : -1)).filter((n) => n >= 0)
  // Un bloque seguido: no se vuelve a una ventana después de salir de ella
  expect(dentro.at(-1) - dentro[0] + 1).toBe(dentro.length)
})

test('los textos nombran botones y pantallas que existen', () => {
  const cosas = [
    ['Comí esto', 'pages/Diario.jsx'],
    ['No comí', 'pages/Diario.jsx'],
    ['Registrar', 'pages/Diario.jsx'],
    ['Cocinar', 'pages/RecetaDetalle.jsx'],
    ['Descontar de mi despensa lo que usé', 'pages/Registrar.jsx'],
    ['Se puede llevar en un tupper', 'pages/RecetaNueva.jsx'],
    ['Guardar receta', 'pages/RecetaNueva.jsx'],
    ['Compras del mes', 'pages/Compras.jsx'],
    ['Mis alimentos', 'pages/Perfil.jsx'],
    ['Descargar mis datos', 'pages/Perfil.jsx'],
    ['Open Food Facts', 'components/SelectorAlimento.jsx'],
    ['Se está acabando', 'pages/Despensa.jsx'],
    ['Editar', 'pages/Perfil.jsx'],
    ['Nueva', 'pages/Recetas.jsx'],
    ['Agregar', 'pages/RecetaNueva.jsx'],
    ['Guardar', 'components/SelectorAlimento.jsx'],
    ['Alimento', 'pages/Registrar.jsx'],
  ]
  const texto = PASOS.map((p) => p.texto + ' ' + p.titulo).join(' ')
  for (const [palabra, archivo] of cosas) {
    expect(texto, `el recorrido no nombra "${palabra}"`).toContain(palabra)
    expect(leer(archivo), `${archivo} no tiene "${palabra}"`).toContain(palabra)
  }
})

// ---------- Quién lo ve ----------
let guardado
beforeEach(() => {
  guardado = new Map()
  globalThis.localStorage = {
    getItem: (k) => (guardado.has(k) ? guardado.get(k) : null),
    setItem: (k, v) => guardado.set(k, String(v)),
    removeItem: (k) => guardado.delete(k),
  }
})
afterEach(() => {
  delete globalThis.localStorage
})

test('una cuenta que ya existía no tiene recorrido', () => {
  expect(leerRecorrido('u1')).toBeNull()
  // y guardar el lugar o terminar no se lo arman
  guardarPaso('u1', 3)
  expect(leerRecorrido('u1')).toBeNull()
  terminarRecorrido('u1')
  expect(leerRecorrido('u1')).toBeNull()
})

test('una cuenta nueva lo empieza, sigue donde quedó y no lo vuelve a ver al terminar', () => {
  iniciarRecorrido('u1')
  expect(leerRecorrido('u1')).toBe(0)
  guardarPaso('u1', 7)
  expect(leerRecorrido('u1')).toBe(7)
  // volver a "iniciar" (por ejemplo al reintentar guardar el perfil) no lo manda al principio
  iniciarRecorrido('u1')
  expect(leerRecorrido('u1')).toBe(7)
  // cada cuenta tiene el suyo
  expect(leerRecorrido('u2')).toBeNull()
  terminarRecorrido('u1')
  expect(leerRecorrido('u1')).toBeNull()
  expect([...guardado.keys()], 'no queda nada guardado').toEqual([])
  // y después de terminarlo, guardar un paso rezagado no lo resucita
  guardarPaso('u1', 4)
  expect(leerRecorrido('u1')).toBeNull()
})

test('un lugar guardado que no sirve vuelve al principio y sin almacenamiento no se rompe nada', () => {
  guardado.set('tupper:recorrido:u1', JSON.stringify({ paso: 999 }))
  expect(leerRecorrido('u1')).toBe(0)
  guardado.set('tupper:recorrido:u1', 'cualquier cosa')
  expect(leerRecorrido('u1')).toBeNull()
  delete globalThis.localStorage
  expect(() => iniciarRecorrido('u1')).not.toThrow()
  expect(leerRecorrido('u1')).toBeNull()
  expect(() => guardarPaso('u1', 1)).not.toThrow()
  expect(() => terminarRecorrido('u1')).not.toThrow()
})

// ---------- El resaltado y el cartel ----------
const rect = (left, top, width, height) => ({ left, top, width, height, right: left + width, bottom: top + height })

// Cuántos puntos de la pantalla cubren las franjas (se prueba de a 1 px)
function cubiertos(f, vw, vh) {
  const dentro = (e, x, y) => {
    const l = e.left ?? 0
    const t = e.top ?? 0
    const r = e.right !== undefined ? vw - e.right : l + e.width
    const b = e.bottom !== undefined ? vh - e.bottom : t + e.height
    return x >= l && x < r && y >= t && y < b
  }
  let n = 0
  let dobles = 0
  for (let y = 0; y < vh; y++)
    for (let x = 0; x < vw; x++) {
      const veces = Object.values(f).filter((e) => dentro(e, x, y)).length
      if (veces > 0) n++
      if (veces > 1) dobles++
    }
  return { n, dobles }
}

test('el resaltado se agranda un poco y nunca se sale de la pantalla', () => {
  expect(aroDe(rect(50, 100, 200, 40), 400, 800)).toEqual({ top: 94, left: 44, width: 212, height: 52 })
  // pegado a los bordes
  const a = aroDe(rect(0, 0, 400, 800), 400, 800)
  expect(a).toEqual({ top: 0, left: 0, width: 400, height: 800 })
  // medio afuera
  const b = aroDe(rect(-30, 780, 100, 100), 400, 800)
  expect(b.left).toBe(0)
  expect(b.top + b.height).toBeLessThanOrEqual(800)
  expect(b.left + b.width).toBeLessThanOrEqual(400)
  // totalmente afuera: no tiene tamaño negativo
  const c = aroDe(rect(500, 900, 50, 50), 400, 800)
  expect(c.width).toBeGreaterThanOrEqual(0)
  expect(c.height).toBeGreaterThanOrEqual(0)
})

test('las franjas oscurecen todo menos el hueco, sin encimarse', () => {
  const vw = 60
  const vh = 50
  for (const aro of [
    { top: 10, left: 8, width: 20, height: 12 },
    { top: 0, left: 0, width: 60, height: 50 },
    { top: 0, left: 5, width: 10, height: 50 },
    { top: 40, left: 50, width: 10, height: 10 },
  ]) {
    const { n, dobles } = cubiertos(franjas(aro), vw, vh)
    expect(n, JSON.stringify(aro)).toBe(vw * vh - aro.width * aro.height)
    expect(dobles, JSON.stringify(aro)).toBe(0)
  }
})

test('el cartel va del lado que tiene lugar y siempre dentro de la pantalla', () => {
  const vw = 412
  const vh = 900
  // arriba del todo: el cartel va abajo
  const abajo = ubicarCartel(aroDe(rect(16, 90, 380, 60), vw, vh), vw, vh)
  expect(abajo.top).toBeGreaterThan(150)
  expect(abajo.bottom).toBeUndefined()
  // pegado abajo (la barra de navegación): el cartel va arriba
  const arriba = ubicarCartel(aroDe(rect(170, 820, 70, 60), vw, vh), vw, vh)
  expect(arriba.bottom).toBeGreaterThan(0)
  expect(arriba.top).toBeUndefined()
  expect(vh - arriba.bottom).toBeLessThan(820) // no tapa lo resaltado
  // algo altísimo, que ocupa casi toda la pantalla: el cartel se pega abajo
  const alto = ubicarCartel(aroDe(rect(16, 80, 380, 780), vw, vh), vw, vh)
  expect(alto.bottom).toBeLessThanOrEqual(16)
  // si el cartel mide más de lo calculado, el lugar que alcanzaba ya no alcanza
  const medio = aroDe(rect(16, 156, 380, 88), 412, 600)
  expect(ubicarCartel(medio, 412, 600, 300).top).toBeGreaterThan(0)
  expect(ubicarCartel(medio, 412, 600, 380).bottom).toBeLessThanOrEqual(16)
  // en una pantalla ancha, algo alto que deja poco lugar arriba y abajo lleva el cartel al costado (sin tapar ni salirse)
  const ancha = aroDe(rect(280, 100, 384, 420), 1280, 800)
  const costado = ubicarCartel(ancha, 1280, 800, 320)
  expect(costado.left).toBeGreaterThanOrEqual(ancha.left + ancha.width)
  expect(costado.top).toBeGreaterThanOrEqual(12)
  expect(costado.top + 320).toBeLessThanOrEqual(800 - 12)
  // si lo resaltado está pegado a la derecha, va a la izquierda
  const derecha = ubicarCartel(aroDe(rect(860, 100, 400, 420), 1280, 800), 1280, 800, 320)
  expect(derecha.left + derecha.ancho).toBeLessThanOrEqual(854)
  // sin nada resaltado, va en el medio
  expect(ubicarCartel(null, vw, vh).centrado).toBe(true)
  // horizontalmente nunca se sale, esté donde esté lo resaltado
  for (const x of [0, 20, 200, 380, 400]) {
    const u = ubicarCartel(aroDe(rect(x, 300, 30, 30), vw, vh), vw, vh)
    expect(u.left).toBeGreaterThanOrEqual(12)
    expect(u.left + u.ancho).toBeLessThanOrEqual(vw - 12)
  }
  // en una pantalla muy angosta el cartel se achica
  expect(ubicarCartel(null, 300, 600).ancho).toBe(276)
  expect(ubicarCartel(null, 1280, 800).ancho).toBe(360)
})

test('la página se corre solo lo que hace falta para ver lo resaltado', () => {
  const vh = 800
  expect(desplazamiento(rect(16, 200, 380, 100), vh)).toBe(0)
  // abajo de todo: se sube hasta el medio
  const bajar = desplazamiento(rect(16, 900, 380, 100), vh)
  expect(bajar).toBeGreaterThan(0)
  const arribaAhora = 900 - bajar
  expect(arribaAhora).toBeGreaterThanOrEqual(80)
  expect(arribaAhora + 100).toBeLessThanOrEqual(vh - 90)
  // tapado por el encabezado: se baja
  expect(desplazamiento(rect(16, 20, 380, 100), vh)).toBeLessThan(0)
  // más alto que lo que se ve: se alinea con el borde de arriba
  expect(desplazamiento(rect(16, 300, 380, 1500), vh)).toBe(300 - 80)
})
