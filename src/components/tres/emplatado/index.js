// El emplatado (1.26): arma las piezas de un plato (ver componer.js y piezas.js), las apoya en el recipiente y las hace
// aparecer una tras otra, como si las fueran sirviendo.
//   crearEmplatado(THREE, { trozos, semilla, altura(x, z), D, quieto }) → { grupo, actualizar(dt) → true si sigue animando }
import { azar } from '../comida.js'
import { componer } from './componer.js'
import { PIEZAS, espolvoreo, salsa } from './piezas.js'

const salida = (k) => {
  // easeOutBack: llega un poquito pasado y vuelve, como algo que se apoya
  const c1 = 1.5
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2)
}

export function crearEmplatado(THREE, { trozos, semilla = 1, altura = () => 0, D, quieto = false, escala = 1, cama = false }) {
  const lista = componer(trozos, semilla, { cama })
  const grupo = new THREE.Group()
  const objetos = []
  const puestos = []
  lista.forEach((p, i) => {
    const az = azar(semilla + i * 977)
    const c = { THREE, D, az, semilla: semilla + i * 31 }
    const pieza = { ...p, radio: p.radio * escala }
    let obj = null
    if (p.clave === 'salsa') {
      const base =
        p.sobre >= 0
          ? { radio: lista[p.sobre].radio * escala, alturaEn: p.debajo ? null : objetos[p.sobre]?.userData.alturaEn, debajo: p.debajo }
          : null
      obj = salsa(c, pieza, base)
    } else if (p.clave === 'espolvoreo') {
      const base = p.sobre >= 0 ? { radio: lista[p.sobre].radio * escala, alturaEn: objetos[p.sobre]?.userData.alturaEn } : null
      obj = espolvoreo(c, pieza, base)
    } else if (PIEZAS[p.clave]) obj = PIEZAS[p.clave](c, pieza)
    objetos.push(obj)
    if (!obj) return
    obj.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true
        o.receiveShadow = o.material?.side !== THREE.DoubleSide // las hojas y rodajas finas se ven negras con su propia sombra
        if (o.isInstancedMesh) D(o)
      }
    })
    if (p.sobre >= 0 && objetos[p.sobre] && !p.debajo) {
      // Va encima de otra pieza: es hija de ella
      objetos[p.sobre].add(obj)
      return
    }
    obj.rotation.y += p.giro
    // La cama (arroz, hojas) apoya donde el recipiente sube hasta su borde, no en el fondo; lo que va encima, sobre la cama
    const iCama = lista.findIndex((q) => q.cama)
    const camaObj = p.enCama ? objetos[iCama] : null
    const yBase = iCama >= 0 ? altura(lista[iCama].radio * escala * 0.8, 0) : 0
    const y = p.cama ? yBase : camaObj ? yBase + (camaObj.userData.alturaEn?.(p.x, p.z) ?? 0) : altura(p.x * escala, p.z * escala)
    obj.position.set(p.x * escala, y, p.z * escala)
    obj.userData.y0 = obj.position.y
    grupo.add(obj)
    puestos.push(obj)
  })
  let tiempo = 0
  const demora = 0.22
  const dur = 0.6
  const fin = (puestos.length - 1) * demora + dur
  const poner = (t) => {
    puestos.forEach((o, i) => {
      const k = Math.max(0, Math.min(1, (t - i * demora) / dur))
      const s = k === 0 ? 0.001 : Math.max(0.001, salida(k))
      o.scale.setScalar(s)
      o.position.y = o.userData.y0 + (1 - k) * 0.45
      o.visible = k > 0
    })
  }
  if (quieto) tiempo = fin + 1
  poner(tiempo)
  return {
    grupo,
    actualizar: (dt) => {
      if (tiempo > fin) return false
      tiempo += dt
      poner(Math.min(tiempo, fin + 0.01))
      return true
    },
  }
}
