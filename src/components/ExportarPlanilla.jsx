// Exportar el registro a una planilla (1.28, F-11): elegís el período y se baja un CSV que abre Excel o Google Sheets.
import { useState } from 'react'
import { Hoja, Icono } from './ui'
import { useDatos } from '../store/Datos'
import { hoy, sumarDias } from '../lib/fechas'
import { registroACsv } from '../lib/planilla'

const PERIODOS = [
  [7, 'Última semana'],
  [30, 'Último mes'],
  [90, 'Últimos 3 meses'],
  [null, 'Todo'],
]

export default function ExportarPlanilla() {
  const d = useDatos()
  const [abierta, setAbierta] = useState(false)
  const [dias, setDias] = useState(30)
  const [trabajando, setTrabajando] = useState(false)

  async function descargar() {
    setTrabajando(true)
    const h = hoy()
    const registros = await d.traerRegistro({ desde: dias ? sumarDias(h, -(dias - 1)) : null, hasta: h })
    setTrabajando(false)
    if (!registros) return
    if (registros.length === 0) return d.avisar('No hay nada anotado en ese período', 'aviso')
    const enlace = document.createElement('a')
    enlace.href = URL.createObjectURL(new Blob([registroACsv(registros, d)], { type: 'text/csv;charset=utf-8' }))
    enlace.download = `tupper-registro-${h}.csv`
    enlace.click()
    URL.revokeObjectURL(enlace.href)
    d.avisar('Planilla descargada')
    setAbierta(false)
  }

  return (
    <>
      <button onClick={() => setAbierta(true)} className="w-full flex items-center gap-3 py-3.5 text-left" data-testid="exportar-planilla">
        <Icono n="bar_chart" className="text-verde-texto" size={20} />{' '}
        <span className="flex-1 font-medium">Exportar mi registro a Excel</span>
      </button>
      {abierta && (
        <Hoja titulo="Exportar a planilla" onCerrar={() => setAbierta(false)}>
          <p className="text-sm text-gris mb-3">
            Se baja un archivo con lo que anotaste (una fila por cosa y el total de cada día) que se abre con Excel o Google Sheets. Sirve
            para llevárselo a tu nutricionista.
          </p>
          <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Período">
            {PERIODOS.map(([valor, nombre]) => (
              <button
                key={nombre}
                role="radio"
                aria-checked={dias === valor}
                onClick={() => setDias(valor)}
                className={`rounded-2xl h-11 text-sm font-semibold ${dias === valor ? 'bg-verde text-white' : 'bg-campo text-tinta'}`}
              >
                {nombre}
              </button>
            ))}
          </div>
          <button onClick={descargar} disabled={trabajando} className="btn-primario w-full mt-4">
            <Icono n="download" size={20} /> {trabajando ? 'Preparando…' : 'Descargar planilla'}
          </button>
        </Hoja>
      )}
    </>
  )
}
