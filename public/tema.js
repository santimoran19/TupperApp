// Aplica el tema elegido (claro u oscuro) antes de pintar la página, para que no parpadee.
// Sin elección guardada no hace nada: el CSS sigue el modo del teléfono.
(function () {
  try {
    var tema = localStorage.getItem('tupper:tema')
    if (tema === 'claro' || tema === 'oscuro') {
      document.documentElement.setAttribute('data-tema', tema)
      var color = tema === 'oscuro' ? '#0f1512' : '#206140'
      var metas = document.querySelectorAll('meta[name="theme-color"]')
      for (var i = 0; i < metas.length; i++) metas[i].setAttribute('content', color)
    }
  } catch (e) { /* sin almacenamiento: queda el automático */ }
})()
