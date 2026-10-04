// Piezas chicas de interfaz que se usan en todas las pantallas.
import { useEffect } from 'react'
import { redondear } from '../lib/nutricion'
import { ICONOS } from './iconos'

export function Icono({ n, className = '', lleno = false, size = 22 }) {
  const trazos = ICONOS[n]
  if (!trazos) return null
  return (
    <svg viewBox="0 -960 960 960" width={size} height={size} fill="currentColor" className={`shrink-0 inline-block ${className}`} aria-hidden="true">
      <path d={trazos[lleno ? 1 : 0]} />
    </svg>
  )
}

// Hoja que sube desde abajo (para formularios cortos y selectores)
export function Hoja({ titulo, onCerrar, children }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-tinta/40" onClick={onCerrar} />
      <div className="relative w-full max-w-[440px] max-h-[88vh] overflow-y-auto bg-white rounded-t-3xl shadow-flotante p-5 pb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{titulo}</h2>
          <button onClick={onCerrar} className="w-9 h-9 rounded-full bg-campo flex items-center justify-center" aria-label="Cerrar">
            <Icono n="close" size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function Anillo({ valor, total, size = 132, grosor = 13, children }) {
  const r = (size - grosor) / 2
  const largo = 2 * Math.PI * r
  const pct = total > 0 ? Math.min(valor / total, 1) : 0
  const pasado = total > 0 && valor > total * 1.05
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e7efe8" strokeWidth={grosor} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={pasado ? '#e67e22' : '#206140'} strokeWidth={grosor}
          strokeLinecap="round" strokeDasharray={largo} strokeDashoffset={largo * (1 - pct)}
          style={{ transition: 'stroke-dashoffset .4s' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>
    </div>
  )
}

export function Barra({ nombre, valor, total, color = 'bg-verde', unidad = 'g' }) {
  const pct = total > 0 ? Math.min((valor / total) * 100, 100) : 0
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1.5">
        <span className="font-medium">{nombre}</span>
        <span className="text-gris">
          <b className="text-tinta">{redondear(valor)} {unidad}</b> / {total} {unidad}
        </span>
      </div>
      <div className="h-2 rounded-full bg-[#e7efe8] overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%`, transition: 'width .4s' }} />
      </div>
    </div>
  )
}

export function Macros({ m, className = '' }) {
  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      <span className="pill bg-verde-suave text-verde">{redondear(m.kcal)} kcal</span>
      <span className="pill bg-coral-suave text-coral-oscuro">{redondear(m.protein)} g prot.</span>
      {m.carbs !== undefined && <span className="pill bg-naranja-suave text-naranja-oscuro">{redondear(m.carbs)} g carb.</span>}
      {m.fat !== undefined && <span className="pill bg-teal-suave text-teal-oscuro">{redondear(m.fat)} g grasa</span>}
    </div>
  )
}

export function Chip({ activo, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 h-9 text-[13px] font-semibold transition ${activo ? 'bg-verde text-white' : 'bg-white text-tinta border border-linea'}`}
    >
      {children}
    </button>
  )
}

export function Vacio({ icono, titulo, texto, children }) {
  return (
    <div className="tarjeta p-6 text-center">
      <div className="w-12 h-12 mx-auto rounded-full bg-verde-claro text-verde flex items-center justify-center mb-3">
        <Icono n={icono} />
      </div>
      <p className="font-semibold">{titulo}</p>
      {texto && <p className="text-sm text-gris mt-1">{texto}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  )
}

// Campo numérico: acepta coma o punto, deja un solo separador y limita decimales y largo,
// así no se pueden tipear cosas como 170000 en la altura o 12.3.4
export function Numero({ valor, onChange, className = 'campo', decimales = 2, largo = 7, error = false, ...resto }) {
  function limpiar(texto) {
    let t = texto.replace(',', '.').replace(/[^0-9.]/g, '')
    const [entero, ...resto2] = t.split('.')
    t = decimales > 0 && resto2.length ? `${entero}.${resto2.join('').slice(0, decimales)}` : entero
    return t.slice(0, largo)
  }
  return (
    <input
      type="text" inputMode={decimales > 0 ? 'decimal' : 'numeric'} value={valor ?? ''}
      className={`${className} ${error ? '!border-rojo !bg-rojo-suave/40' : ''}`}
      onChange={(ev) => onChange(limpiar(ev.target.value))}
      {...resto}
    />
  )
}

// Mensaje de error debajo de un campo
export function Err({ children }) {
  if (!children) return null
  return <p className="text-xs text-rojo mt-1">{children}</p>
}

export const pesos = (n) => '$' + Math.round(Number(n) || 0).toLocaleString('es-AR')
