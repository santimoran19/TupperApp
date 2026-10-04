/** @type {import('tailwindcss').Config} */
// Colores y formas tomados del diseño de Stitch ("Savia").
// Para texto se usan los tonos "oscuro": los vivos (coral, teal, naranja) no llegan al contraste mínimo sobre fondos claros.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        fondo: '#f9fbf8',
        tinta: '#1e293b',
        gris: '#5b6b82',
        linea: '#e2e8f0',
        verde: { DEFAULT: '#206140', medio: '#3b7a57', suave: '#e0eedf', claro: '#eef6ee' },
        naranja: { DEFAULT: '#e67e22', fuerte: '#cf6a0c', oscuro: '#944a00', suave: '#fdf4eb' },
        coral: { DEFAULT: '#e76f51', oscuro: '#b8482a', suave: '#fdf0ed' },
        teal: { DEFAULT: '#408a9b', oscuro: '#2b6b7b', suave: '#edf6f7' },
        rojo: { DEFAULT: '#ba1a1a', suave: '#ffdad6' },
        campo: '#f1f5f0',
      },
      fontFamily: { sans: ['"Plus Jakarta Sans Variable"', 'system-ui', 'sans-serif'] },
      boxShadow: {
        tarjeta: '0px 4px 20px -2px rgba(46,125,50,0.06), 0px 2px 6px -1px rgba(30,41,59,0.04)',
        flotante: '0px 16px 36px -6px rgba(30,41,59,0.16), 0px 6px 12px -2px rgba(59,122,87,0.10)',
      },
    },
  },
  plugins: [],
}
