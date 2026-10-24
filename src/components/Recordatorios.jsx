// Perfil > Recordatorios (1.27): avisos de comidas, agua y ayuno. Se guardan en el teléfono. Con la app cerrada (1.29,
// F-06) los manda el servidor: ver lib/push.js.
import { useState } from 'react'
import { Icono } from './ui'
import { useDatos } from '../store/Datos'
import { DIAS_SEMANA, RECORDATORIOS_INICIAL, claveRecordatorios, guardar, horaValida, leer } from '../lib/ayuno'
import { avisarCambioRecordatorios } from '../lib/useRecordatorios'
import { apagarPush, prenderPush, pushDisponible, pushPrendido } from '../lib/push'

const COMIDAS = [
  ['desayuno', 'Desayuno'],
  ['almuerzo', 'Almuerzo'],
  ['merienda', 'Merienda'],
  ['cena', 'Cena'],
]

function Interruptor({ activo, onCambiar, etiqueta }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={activo}
      aria-label={etiqueta}
      onClick={() => onCambiar(!activo)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition ${activo ? 'bg-verde' : 'bg-pista'}`}
    >
      <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-all ${activo ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  )
}

export default function Recordatorios() {
  const d = useDatos()
  const clave = claveRecordatorios(d.usuario.id)
  const [c, setC] = useState(() => leer(clave, RECORDATORIOS_INICIAL))
  const [permiso, setPermiso] = useState(() => (typeof Notification === 'undefined' ? 'no-hay' : Notification.permission))
  const [cerrada, setCerrada] = useState(() => pushPrendido(d.usuario.id))
  const [ocupado, setOcupado] = useState(false)

  const cambiar = (parte) => {
    const nuevo = { ...c, ...parte }
    setC(nuevo)
    guardar(clave, nuevo)
    avisarCambioRecordatorios()
  }
  const prender = async (si) => {
    if (si && typeof Notification !== 'undefined' && Notification.permission === 'default') {
      try {
        setPermiso(await Notification.requestPermission())
      } catch {
        /* si no deja pedir el permiso, quedan los avisos dentro de la app */
      }
    }
    cambiar({ activo: si })
  }
  const conAppCerrada = async (si) => {
    setOcupado(true)
    const r = si ? await prenderPush(d.usuario.id) : await apagarPush(d.usuario.id)
    setOcupado(false)
    if (typeof Notification !== 'undefined') setPermiso(Notification.permission)
    if (r.error) return d.avisar(r.error, 'error')
    setCerrada(si)
    d.avisar(si ? 'Listo: te avisamos aunque la app esté cerrada' : 'Los avisos llegan solo con la app abierta')
  }
  const hora = (comida, valor) => horaValida(valor) && cambiar({ comidas: { ...c.comidas, [comida]: valor } })

  return (
    <section className="tarjeta p-5 mb-4" aria-labelledby="recordatorios-titulo" data-testid="recordatorios">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 id="recordatorios-titulo" className="font-semibold flex items-center gap-2">
            <Icono n="notifications" size={20} className="text-teal" /> Recordatorios
          </h2>
          <p className="text-sm text-gris mt-1">Avisos de comidas, agua, ayuno y pesarte.</p>
        </div>
        <Interruptor activo={c.activo} onCambiar={prender} etiqueta="Activar recordatorios" />
      </div>

      {c.activo && (
        <div className="mt-4 space-y-3">
          {COMIDAS.map(([id, nombre]) => (
            <div key={id} className="flex items-center gap-3">
              <Interruptor
                activo={!!c.comidasOn?.[id]}
                onCambiar={(v) => cambiar({ comidasOn: { ...c.comidasOn, [id]: v } })}
                etiqueta={`Avisar ${nombre.toLowerCase()}`}
              />
              <span className="flex-1 text-sm">{nombre}</span>
              <input
                type="time"
                value={c.comidas[id]}
                onChange={(e) => hora(id, e.target.value)}
                aria-label={`Hora de ${nombre.toLowerCase()}`}
                className="h-10 rounded-xl bg-campo px-2 text-sm"
              />
            </div>
          ))}
          <div className="flex items-center gap-3">
            <Interruptor activo={c.agua} onCambiar={(v) => cambiar({ agua: v })} etiqueta="Avisar para tomar agua" />
            <span className="flex-1 text-sm">Tomar agua</span>
            <select
              value={c.aguaCada}
              onChange={(e) => cambiar({ aguaCada: Number(e.target.value) })}
              aria-label="Cada cuántas horas"
              className="h-10 rounded-xl bg-campo px-2 text-sm"
            >
              {[1, 2, 3].map((h) => (
                <option key={h} value={h}>
                  cada {h} h
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <Interruptor activo={c.ayuno} onCambiar={(v) => cambiar({ ayuno: v })} etiqueta="Avisar cuando se cumple el ayuno" />
            <span className="flex-1 text-sm">Cuando cumplo el ayuno</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Interruptor activo={!!c.peso} onCambiar={(v) => cambiar({ peso: v })} etiqueta="Recordarme pesarme una vez por semana" />
            <span className="flex-1 text-sm min-w-[7rem]">Pesarme</span>
            {c.peso && (
              <span className="flex items-center gap-2">
                <select
                  value={c.pesoDia ?? 1}
                  onChange={(e) => cambiar({ pesoDia: Number(e.target.value) })}
                  aria-label="Qué día"
                  className="h-10 rounded-xl bg-campo px-2 text-sm"
                >
                  {DIAS_SEMANA.map((dia, i) => (
                    <option key={dia} value={i}>
                      {dia}
                    </option>
                  ))}
                </select>
                <input
                  type="time"
                  value={c.pesoHora || '08:00'}
                  onChange={(e) => horaValida(e.target.value) && cambiar({ pesoHora: e.target.value })}
                  aria-label="Hora de pesarme"
                  className="h-10 rounded-xl bg-campo px-2 text-sm"
                />
              </span>
            )}
          </div>
          {pushDisponible() && permiso !== 'denied' && (
            <div className="flex items-center gap-3 pt-3 border-t border-linea">
              <Interruptor
                activo={cerrada}
                onCambiar={(v) => !ocupado && conAppCerrada(v)}
                etiqueta="Avisarme aunque la app esté cerrada"
              />
              <span className="flex-1 text-sm">
                Aunque la app esté cerrada
                <span className="block text-xs text-gris">Tus horarios se guardan en tu cuenta para poder avisarte.</span>
              </span>
            </div>
          )}
          <p className="text-xs text-gris leading-snug">
            {permiso === 'granted' && cerrada
              ? 'Te avisamos aunque la app esté cerrada. En iPhone, solo si la instalaste en la pantalla de inicio.'
              : permiso === 'granted'
                ? 'Los avisos llegan mientras la app esté abierta o la hayas usado hace poco. Con la app cerrada del todo, el teléfono no los deja pasar.'
                : permiso === 'denied'
                  ? 'Bloqueaste las notificaciones del navegador: los avisos aparecen solo dentro de la app. Podés permitirlas en los ajustes del navegador.'
                  : permiso === 'no-hay'
                    ? 'Este navegador no tiene notificaciones: los avisos aparecen dentro de la app.'
                    : 'Los avisos aparecen dentro de la app.'}
          </p>
        </div>
      )}
    </section>
  )
}
