import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import Barrera from './components/Barrera'
import AvisoVersion from './components/AvisoVersion'
import { escucharErrores } from './lib/eventos'
import '@fontsource-variable/plus-jakarta-sans'
import './index.css'
import { inject } from '@vercel/analytics'

// Visitas anónimas por pantalla, sin cookies. Solo cuenta en el sitio publicado y si está activado en Vercel.
if (import.meta.env.PROD) inject()

// Los errores que nadie atrapa quedan anotados (ver lib/eventos)
escucharErrores()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Barrera>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Barrera>
    <AvisoVersion />
  </React.StrictMode>,
)
