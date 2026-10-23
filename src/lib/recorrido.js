// Recorrido inicial: los pasos, dónde se guarda por cuál va cada persona y la geometría del resaltado.
// Solo lo ven las cuentas nuevas: se prende al terminar de armar el perfil (ver Bienvenida) y se borra al terminar o saltarlo.
// Las cuentas que ya existían no tienen la marca, así que nunca lo ven.

// Cada paso:
//   ruta    pantalla donde pasa (si la persona está en otra, el recorrido la lleva)
//   ancla   qué se resalta: el elemento con data-tour="<ancla>" (sin ancla, el cartel va en el medio)
//   tipo    'toque' = se invita a tocar lo resaltado (tocarlo sigue al paso que viene); 'info' = solo se explica
//   enHoja  el elemento vive adentro de una ventana que sube desde abajo; si no está abierta se abre con `abre`
//   abre    anclas a tocar, en orden, para llegar a ese elemento desde la pantalla limpia
export const PASOS = [
  {
    id: 'bienvenida',
    ruta: '/',
    titulo: '¡Bienvenido a Tupper, {nombre}!',
    texto:
      'Te muestro la app en pocos minutos: para qué sirve cada pantalla y cómo cargar alimentos, recetas y comidas. Es solo para mirar: no se guarda nada de lo que veas. Lo podés saltar cuando quieras y no vuelve a aparecer.',
  },
  {
    id: 'diario-resumen',
    ruta: '/',
    ancla: 'diario-resumen',
    titulo: 'Tu día de un vistazo',
    texto:
      'El círculo muestra las calorías que llevás frente a tu objetivo. Abajo ves la proteína, los carbohidratos, las grasas y el líquido que tomaste. Los objetivos salen de tu perfil.',
  },
  {
    id: 'diario-semana',
    ruta: '/',
    ancla: 'diario-semana',
    titulo: 'Elegí el día',
    texto:
      'Tocá un día para ver o cargar lo de esa fecha. Con las flechas pasás de semana, y el puntito marca los días con comidas anotadas.',
  },
  {
    id: 'diario-comida',
    ruta: '/',
    ancla: 'diario-comida',
    titulo: 'Tus comidas',
    texto:
      'Cada tarjeta es una comida del día y muestra lo que anotaste. Con Registrar la cargás, con No comí la salteás y, si tenés plan, Comí esto la anota de un toque.',
  },
  {
    id: 'diario-extras',
    ruta: '/',
    ancla: 'diario-extras',
    titulo: 'Bebidas y entre comidas',
    texto: 'El agua, el mate, el café, el alcohol o algo que picaste van acá, aparte de las cuatro comidas.',
  },
  {
    id: 'nav-registrar',
    ruta: '/',
    ancla: 'nav-registrar',
    tipo: 'toque',
    titulo: 'Anotar lo que comés',
    texto: 'Este es el botón que más vas a usar. Tocalo para ir a registrar una comida.',
  },
  {
    id: 'reg-momentos',
    ruta: '/registrar',
    ancla: 'reg-momentos',
    titulo: '¿Qué comida es?',
    texto: 'Arriba elegís a qué comida va lo que vas a anotar: desayuno, almuerzo, merienda, cena o entre comidas.',
  },
  {
    id: 'reg-tipos',
    ruta: '/registrar',
    ancla: 'reg-tipos',
    titulo: 'Alimento, bebida o receta',
    texto:
      'Elegís qué vas a sumar: un alimento suelto, una bebida o una receta (una porción ya armada). Podés juntar varias cosas en el mismo plato.',
  },
  {
    id: 'reg-alimento',
    ruta: '/registrar',
    ancla: 'reg-alimento',
    tipo: 'toque',
    titulo: 'Probemos con un alimento',
    texto: 'Tocá Alimento para ver cómo se busca. No se anota nada hasta que elijas uno.',
  },
  {
    id: 'selector-buscar',
    ruta: '/registrar',
    ancla: 'selector-buscar',
    enHoja: true,
    abre: ['reg-alimento'],
    titulo: 'Buscalo por el nombre',
    texto:
      'Escribí lo que comiste (por ejemplo «pollo» o «arroz») y elegilo de la lista: Tupper trae cientos de alimentos con sus calorías y proteínas. Si buscás un producto de marca, también lo podés traer de Open Food Facts.',
  },
  {
    id: 'selector-crear',
    ruta: '/registrar',
    ancla: 'selector-crear',
    enHoja: true,
    abre: ['reg-alimento'],
    tipo: 'toque',
    titulo: '¿No está en la lista?',
    texto: 'Podés crear tu propio alimento. Tocá este botón para ver cómo se hace.',
  },
  {
    id: 'na-datos',
    ruta: '/registrar',
    ancla: 'na-datos',
    enHoja: true,
    abre: ['reg-alimento', 'selector-crear'],
    titulo: 'Nombre y medida',
    texto:
      'Ponele un nombre y elegí cómo se mide: gramos, mililitros o unidades (por ejemplo huevos o latas). La categoría sirve para ordenar la despensa.',
  },
  {
    id: 'na-macros',
    ruta: '/registrar',
    ancla: 'na-macros',
    enHoja: true,
    abre: ['reg-alimento', 'selector-crear'],
    titulo: 'Los valores de la etiqueta',
    texto:
      'Copiá de la etiqueta del envase las calorías y la proteína cada 100 g o 100 ml (los carbohidratos y las grasas son opcionales). Queda guardado para siempre y lo usás en tus registros, recetas y plan.',
  },
  {
    id: 'na-botones',
    ruta: '/registrar',
    ancla: 'na-botones',
    enHoja: true,
    abre: ['reg-alimento', 'selector-crear'],
    titulo: 'Guardar',
    texto:
      'Con Guardar el alimento queda creado y listo para sumar a tu plato. Después lo cambiás o lo borrás desde Perfil, en Mis alimentos.',
  },
  {
    id: 'reg-plato',
    ruta: '/registrar',
    ancla: 'reg-plato',
    titulo: 'Tu plato',
    texto:
      'Lo que vas sumando aparece acá con su cantidad, que podés cambiar, y sus calorías. Si es mate, café o té, también elegís con qué lo endulzás.',
  },
  {
    id: 'reg-confirmar',
    ruta: '/registrar',
    ancla: 'reg-confirmar',
    titulo: 'Anotarlo en el diario',
    texto:
      'Cuando el plato está listo, este botón lo guarda en tu diario. Con la casilla «Descontar de mi despensa lo que usé» (aparece al sumar algo) también se resta del stock lo que gastaste.',
  },
  {
    id: 'rec-resumen',
    ruta: '/recetas',
    ancla: 'rec-resumen',
    titulo: 'Recetas',
    texto: 'Acá están las recetas de Tupper y las tuyas. Este cartel te cuenta cuántas podés cocinar ya con lo que tenés en la despensa.',
  },
  {
    id: 'rec-buscar',
    ruta: '/recetas',
    ancla: 'rec-buscar',
    titulo: 'Buscá y filtrá',
    texto:
      'Podés buscar por el nombre de la receta o por un ingrediente, y filtrar por las que podés hacer ya, las favoritas, las que se llevan en tupper, el desayuno o la merienda.',
  },
  {
    id: 'rec-nueva',
    ruta: '/recetas',
    ancla: 'rec-nueva',
    tipo: 'toque',
    titulo: 'Crear una receta propia',
    texto: 'Tocá Nueva para ver cómo se arma una. Tampoco se guarda nada hasta que toques Guardar receta.',
  },
  {
    id: 'rn-datos',
    ruta: '/recetas/nueva',
    ancla: 'rn-datos',
    titulo: 'Los datos básicos',
    texto: 'El nombre, los minutos que lleva y cuántas porciones rinde. Con eso se calculan las calorías y la proteína de cada porción.',
  },
  {
    id: 'rn-sirve',
    ruta: '/recetas/nueva',
    ancla: 'rn-sirve',
    titulo: '¿Para qué comida sirve?',
    texto:
      'Marcá desayuno, almuerzo, merienda o cena: el plan semanal lo usa para saber dónde ponerla. Con «Se puede llevar en un tupper» la tiene en cuenta para las comidas que hacés fuera de casa.',
  },
  {
    id: 'rn-ingredientes',
    ruta: '/recetas/nueva',
    ancla: 'rn-ingredientes',
    titulo: 'Sumá los ingredientes',
    texto:
      'Con Agregar elegís cada ingrediente (o creás uno nuevo) y le ponés la cantidad. Las calorías y la proteína por porción se calculan solas.',
  },
  {
    id: 'rn-guardar',
    ruta: '/recetas/nueva',
    ancla: 'rn-guardar',
    titulo: 'Los pasos y guardar',
    texto:
      'Escribí los pasos, uno por renglón, y guardá. Cuando cocines la receta, tocá Cocinar en su pantalla: se descuentan los ingredientes de la despensa y quedan porciones listas para comer.',
  },
  {
    id: 'des-resumen',
    ruta: '/despensa',
    ancla: 'des-resumen',
    titulo: 'Tu despensa',
    texto:
      'Es lo que tenés en casa. Arriba ves cuántos alimentos tenés, cuántos están por vencer, cuáles se agotaron y cuántas porciones de comida ya cocinada hay.',
  },
  {
    id: 'des-agregar',
    ruta: '/despensa',
    ancla: 'des-agregar',
    titulo: 'Cargá lo que tenés',
    texto:
      'Con este botón sumás un alimento y le ponés cuánto tenés y, si querés, cuándo vence. Después cambiás la cantidad con + y −, o tocándola. Al registrar una comida, lo que usaste se descuenta solo.',
  },
  {
    id: 'des-compras',
    ruta: '/despensa',
    ancla: 'des-compras',
    titulo: 'Lista de compras',
    texto:
      'Lo que le falta a tu plan aparece solo en la lista. Lo que quieras comprar lo sumás vos con el carrito de cada alimento, o marcándolo en «Se está acabando».',
  },
  {
    id: 'com-lista',
    ruta: '/compras',
    ancla: 'com-lista',
    titulo: 'Para comprar',
    texto:
      'Acá se juntan los faltantes del plan y lo que anotaste. Cuando comprás algo, cargás la cantidad y el precio: se suma a la despensa y queda en «Compras del mes», con cuánto gastaste.',
  },
  {
    id: 'plan-armar',
    ruta: '/plan',
    ancla: 'plan-armar',
    titulo: 'Armá tu semana',
    texto:
      'Tupper arma la semana con tus recetas: cuida tus calorías y tu proteína, y prefiere lo que ya tenés en la despensa. Lo que ya elegiste vos no se pisa, y el botón de al lado rehace la semana.',
  },
  {
    id: 'plan-dia',
    ruta: '/plan',
    ancla: 'plan-dia',
    titulo: 'Cada día, cada comida',
    texto:
      'Tocá una comida para elegir a mano una receta o un alimento. El ícono del tupper marca las comidas que hacés fuera de casa, para que el plan no te ponga algo que no podés llevar.',
  },
  {
    id: 'perfil-objetivos',
    ruta: '/perfil',
    ancla: 'perfil-objetivos',
    titulo: 'Tu perfil y tus objetivos',
    texto:
      'Acá están tus objetivos por día de calorías, proteína y líquido, calculados con tus datos. Con Editar los cambiás cuando quieras.',
  },
  {
    id: 'perfil-progreso',
    ruta: '/perfil',
    ancla: 'perfil-progreso',
    titulo: 'Tu progreso',
    texto: 'Anotá tu peso y tu cintura de vez en cuando y Tupper arma la curva para que veas cómo vas.',
  },
  {
    id: 'perfil-hogar',
    ruta: '/perfil',
    ancla: 'perfil-hogar',
    titulo: 'Compartí con tu hogar',
    texto:
      'Si cocinás con alguien, armá un hogar o sumate con un código de 6 caracteres: comparten la despensa, la lista de compras, las comidas preparadas y las compras. El diario, el plan y tu perfil siguen siendo solo tuyos.',
  },
  {
    id: 'perfil-atajos',
    ruta: '/perfil',
    ancla: 'perfil-atajos',
    titulo: 'Y algo más',
    texto:
      'Desde acá abrís el resumen de la semana y Mis alimentos (los que creaste vos). Con Descargar mis datos te bajás una copia de todo lo tuyo.',
  },
  {
    id: 'fin',
    ruta: '/',
    titulo: '¡Listo, ya conocés lo principal!',
    texto: 'Para empezar, cargá lo que tenés en la despensa o registrá tu primera comida. Este recorrido no vuelve a aparecer.',
  },
]

// ---- Dónde va cada persona ----------------------------------------------------------------------------------------

const clave = (uid) => `tupper:recorrido:${uid}`

// Pasa a mano la persona que arma su perfil por primera vez; las cuentas que ya existían no tienen esta marca
export function iniciarRecorrido(uid) {
  try {
    if (localStorage.getItem(clave(uid)) === null) localStorage.setItem(clave(uid), JSON.stringify({ paso: 0 }))
  } catch {
    // sin almacenamiento no hay recorrido: no pasa nada
  }
}

// El número de paso en el que quedó, o null si no tiene recorrido pendiente
export function leerRecorrido(uid) {
  try {
    const crudo = localStorage.getItem(clave(uid))
    if (crudo === null) return null
    const paso = Number(JSON.parse(crudo)?.paso)
    return Number.isInteger(paso) && paso >= 0 && paso < PASOS.length ? paso : 0
  } catch {
    return null
  }
}

export function guardarPaso(uid, paso) {
  try {
    if (localStorage.getItem(clave(uid)) !== null) localStorage.setItem(clave(uid), JSON.stringify({ paso }))
  } catch {
    // se sigue sin guardar el lugar
  }
}

// Al terminarlo o saltarlo la marca se borra y no se vuelve a ofrecer
export function terminarRecorrido(uid) {
  try {
    localStorage.removeItem(clave(uid))
  } catch {
    // nada que borrar
  }
}

// ---- Geometría ----------------------------------------------------------------------------------------------------

const AIRE = 6 // lo que se agranda el resaltado alrededor del elemento
const CARTEL_MAX = 360
const CARTEL_ALTO = 300 // lo que se calcula que ocupa el cartel hasta que se lo mide, para decidir si entra arriba o abajo
const BORDE = 12

const entre = (v, min, max) => Math.min(Math.max(v, min), Math.max(min, max))

// El recuadro que se resalta: el del elemento con un poco de aire, sin salirse de la pantalla
export function aroDe(r, vw, vh) {
  const top = entre(r.top - AIRE, 0, vh)
  const left = entre(r.left - AIRE, 0, vw)
  const bottom = entre(r.bottom + AIRE, 0, vh)
  const right = entre(r.right + AIRE, 0, vw)
  return { top, left, width: Math.max(0, right - left), height: Math.max(0, bottom - top) }
}

// Las cuatro franjas que oscurecen todo lo que rodea al resaltado y dejan el hueco para tocarlo
export function franjas(aro) {
  return {
    arriba: { top: 0, left: 0, right: 0, height: aro.top },
    abajo: { top: aro.top + aro.height, left: 0, right: 0, bottom: 0 },
    izquierda: { top: aro.top, left: 0, width: aro.left, height: aro.height },
    derecha: { top: aro.top, left: aro.left + aro.width, right: 0, height: aro.height },
  }
}

// Dónde va el cartel: abajo o arriba de lo resaltado, el que tenga más lugar; si no entra, al costado; y si tampoco, pegado abajo
export function ubicarCartel(aro, vw, vh, alto = CARTEL_ALTO) {
  const ancho = Math.min(CARTEL_MAX, vw - BORDE * 2)
  if (!aro) return { ancho, centrado: true }
  const centro = aro.left + aro.width / 2
  const left = entre(centro - ancho / 2, BORDE, vw - ancho - BORDE)
  const libreArriba = aro.top
  const libreAbajo = vh - (aro.top + aro.height)
  const aire = 14
  if (libreAbajo >= alto + aire && libreAbajo >= libreArriba) return { ancho, left, top: aro.top + aro.height + aire }
  if (libreArriba >= alto + aire) return { ancho, left, bottom: vh - aro.top + aire }
  if (libreAbajo >= alto + aire) return { ancho, left, top: aro.top + aro.height + aire }
  // En una pantalla ancha, si arriba y abajo no entra, va al costado
  const libreDerecha = vw - (aro.left + aro.width)
  const top = entre(aro.top, BORDE, vh - alto - BORDE)
  if (libreDerecha >= ancho + aire + BORDE) return { ancho, left: aro.left + aro.width + aire, top }
  if (aro.left >= ancho + aire + BORDE) return { ancho, left: aro.left - aire - ancho, top }
  return { ancho, left, bottom: BORDE }
}

// Cuánto hay que bajar o subir la página para que el elemento se vea entero, o 0 si ya se ve.
// `alto` y `arriba` son los del espacio libre (sin el encabezado ni la barra de abajo).
export function desplazamiento(r, vh, { arriba = 80, abajo = 90 } = {}) {
  const libre = vh - arriba - abajo
  if (r.top >= arriba && r.bottom <= vh - abajo) return 0
  if (r.height > libre) return r.top - arriba
  return r.top + r.height / 2 - (arriba + libre / 2)
}
