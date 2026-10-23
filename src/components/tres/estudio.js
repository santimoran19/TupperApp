// La luz de estudio que comparten las escenas 3D (1.25): un cuarto claro como ambiente (reflejos suaves en vidrio, porcelana
// y piel), una luz principal con sombras y un contraluz. El piso solo recibe la sombra.
//   estudio(THREE, escena, renderer, { sol: [x, y, z], alcance, exposicion, ambiente, piso: radio }) → { liberar, sol, piso }
export function estudio(
  THREE,
  escena,
  renderer,
  {
    sol: posSol = [-0.9, 6, 1.4],
    alcance = 2.4,
    ambiente = 0.55,
    piso = 2.2,
    objetivo = [0, 0.9, 0],
    opacidadPiso = 0.16,
    alDespertar,
  } = {},
) {
  let cuarto = null
  let generador = null
  let sala = null
  import('three/examples/jsm/environments/RoomEnvironment.js')
    .then(({ RoomEnvironment }) => {
      generador = new THREE.PMREMGenerator(renderer)
      sala = new RoomEnvironment()
      cuarto = generador.fromScene(sala, 0.04)
      escena.environment = cuarto.texture
      escena.environmentIntensity = ambiente
      alDespertar?.()
    })
    .catch(() => {})
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap
  const luz = new THREE.DirectionalLight(0xfff4e8, 2.1)
  luz.position.set(...posSol)
  luz.target.position.set(...objetivo)
  luz.castShadow = true
  luz.shadow.mapSize.set(1024, 1024)
  Object.assign(luz.shadow.camera, { left: -alcance, right: alcance, top: alcance + 0.6, bottom: -alcance, near: 0.5, far: 16 })
  luz.shadow.bias = -0.0004
  luz.shadow.normalBias = 0.02
  luz.shadow.radius = 3
  escena.add(luz, luz.target)
  const contraluz = new THREE.DirectionalLight(0xdfeeff, 1.1)
  contraluz.position.set(2.6, 2.4, -3.4)
  escena.add(contraluz)
  escena.add(new THREE.HemisphereLight(0xffffff, 0xd9cfc4, 0.35))
  let suelo = null
  if (piso) {
    suelo = new THREE.Mesh(new THREE.CircleGeometry(piso, 48), new THREE.ShadowMaterial({ opacity: opacidadPiso }))
    suelo.rotation.x = -Math.PI / 2
    suelo.receiveShadow = true
    escena.add(suelo)
  }
  return {
    sol: luz,
    piso: suelo,
    // Para teléfonos lentos: sin sombras (Lienzo.jsx lo llama si los cuadros tardan demasiado)
    bajar() {
      luz.castShadow = false
      if (suelo) suelo.visible = false
      escena.traverse((o) => {
        for (const m of Array.isArray(o.material) ? o.material : o.material ? [o.material] : []) m.needsUpdate = true
      })
    },
    liberar() {
      cuarto?.dispose()
      generador?.dispose()
      sala?.dispose?.()
      escena.environment = null
    },
  }
}
