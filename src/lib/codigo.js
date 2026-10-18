// Códigos de barras: limpiar lo que se escribe y comprobar que el código sea posible.
// Los códigos de los productos (EAN-13, EAN-8, UPC-A) terminan en un dígito verificador. Si una lectura de la cámara
// sale con un número mal, ese dígito no cierra y se descarta en vez de buscar un producto que no existe.

// Deja solo los números (se pegan o se escriben con espacios y guiones)
export const limpiarCodigo = (texto) => String(texto ?? '').replace(/[\s-]/g, '')

// Dígito verificador de GS1: de derecha a izquierda, sin contar el último, se multiplica por 3 y por 1 alternando
function verificador(cuerpo) {
  let suma = 0
  for (let i = 0; i < cuerpo.length; i++) {
    const d = Number(cuerpo[cuerpo.length - 1 - i])
    suma += i % 2 === 0 ? d * 3 : d
  }
  return (10 - (suma % 10)) % 10
}

// 8 (EAN-8), 12 (UPC-A), 13 (EAN-13) o 14 (ITF-14, cajas) números, con el verificador bien
export function codigoValido(texto) {
  const c = limpiarCodigo(texto)
  if (!/^\d+$/.test(c) || ![8, 12, 13, 14].includes(c.length)) return false
  return verificador(c.slice(0, -1)) === Number(c.at(-1))
}

// Mensaje para mostrar cuando lo que se escribió a mano no sirve; null si está bien
export function errCodigo(texto) {
  const c = limpiarCodigo(texto)
  if (!c) return 'Escribí los números que están debajo de las barras.'
  if (!/^\d+$/.test(c)) return 'El código tiene solo números.'
  if (![8, 12, 13, 14].includes(c.length)) return 'Los códigos tienen 8, 12, 13 o 14 números. Revisá que estén todos.'
  if (!codigoValido(c)) return 'Ese código no es válido: revisá que los números estén bien.'
  return null
}

// ¿Es un código de barras que la base acepta? (8 a 14 números; el verificador lo mira `codigoValido`)
export const esCodigoDeBarras = (texto) => /^\d{8,14}$/.test(String(texto ?? ''))
