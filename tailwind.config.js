/** @type {import('tailwindcss').Config} */
// Colores y formas tomados del diseño de Stitch ("Savia").
// Cada color es una variable CSS definida en src/index.css, con un valor para el tema claro y otro para el oscuro.
// Para texto se usan los tonos "oscuro" y "texto": los vivos (coral, teal, naranja) no llegan al contraste mínimo.
const v = (nombre) => `rgb(var(--c-${nombre}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        fondo: v('fondo'), // fondo de la página
        superficie: v('superficie'), // tarjetas, hojas y barra de navegación
        campo: v('campo'), // campos de texto y rellenos suaves
        linea: v('linea'),
        pista: v('pista'), // el riel vacío de barras y anillos
        tinta: v('tinta'),
        gris: v('gris'),
        // DEFAULT y "fuerte" son rellenos (llevan texto blanco); "texto" y "oscuro" son para letras e íconos
        verde: { DEFAULT: v('verde'), texto: v('verde-texto'), medio: v('verde-medio'), tenue: v('verde-tenue'), suave: v('verde-suave'), claro: v('verde-claro') },
        naranja: { DEFAULT: v('naranja'), fuerte: v('naranja-fuerte'), oscuro: v('naranja-oscuro'), suave: v('naranja-suave') },
        coral: { DEFAULT: v('coral'), oscuro: v('coral-oscuro'), suave: v('coral-suave') },
        teal: { DEFAULT: v('teal'), fuerte: v('teal-fuerte'), oscuro: v('teal-oscuro'), suave: v('teal-suave') },
        rojo: { DEFAULT: v('rojo'), texto: v('rojo-texto'), suave: v('rojo-suave') },
      },
      fontFamily: { sans: ['"Plus Jakarta Sans Variable"', 'system-ui', 'sans-serif'] },
      boxShadow: { tarjeta: 'var(--sombra-tarjeta)', flotante: 'var(--sombra-flotante)' },
    },
  },
  plugins: [],
}
