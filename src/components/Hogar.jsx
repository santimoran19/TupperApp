// Hogar: la tarjeta del Perfil para compartir la despensa, la lista de compras, las comidas preparadas y las compras
// con quienes viven juntos (supabase/actualizacion-13.sql). El diario, el plan, las medidas y el perfil siguen siendo de cada uno.
import { useEffect, useState } from 'react'
import { Hoja, Icono } from './ui'
import { useDatos } from '../store/Datos'

// El código que se escribe o se pega: sin espacios ni guiones, en mayúsculas y de a 6 (el campo no tiene `maxLength` para que un
// código pegado con un espacio en el medio no se corte antes de limpiarlo)
const limpiarCodigo = (texto) =>
  texto
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 6)

// Pasa el código a quien se quiere invitar: lo copia al portapapeles; si el navegador no deja, queda a la vista para copiarlo a mano
async function copiar(texto) {
  try {
    await navigator.clipboard.writeText(texto)
    return true
  } catch {
    return false
  }
}

function Persona({ m, yo, puedeSacar, onSacar }) {
  return (
    <li className="flex items-center gap-3 py-2.5" data-testid="miembro-hogar">
      <span className="w-9 h-9 rounded-full bg-verde-suave text-verde-texto font-semibold flex items-center justify-center shrink-0">
        {(m.nombre || '?').charAt(0).toUpperCase()}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-medium truncate">
          {m.nombre}
          {yo && <span className="text-gris font-normal"> (vos)</span>}
        </span>
        {m.usuario && <span className="block text-xs text-gris truncate">@{m.usuario}</span>}
      </span>
      {m.creador && <span className="pill bg-verde-claro text-verde-texto">Armó el hogar</span>}
      {puedeSacar && (
        <button
          onClick={onSacar}
          className="toque w-8 h-8 text-gris"
          aria-label={`Sacar a ${m.nombre} del hogar`}
          title={`Sacar a ${m.nombre} del hogar`}
        >
          <Icono n="person_remove" size={18} />
        </button>
      )}
    </li>
  )
}

export default function Hogar() {
  const d = useDatos()
  const { hogar, usuario, avisar, confirmar } = d
  // 'crear' / 'unirse' / 'nombre': la hoja que está abierta
  const [hoja, setHoja] = useState(null)
  const [texto, setTexto] = useState('')
  const [trabajando, setTrabajando] = useState(false)

  // Al abrir el perfil se mira cómo está el hogar: quién entró, si cambió el código
  const { actualizarHogar } = d
  const tieneHogar = !!hogar
  useEffect(() => {
    if (tieneHogar) actualizarHogar()
  }, [tieneHogar, actualizarHogar])

  const abrir = (cual, inicial = '') => {
    setTexto(inicial)
    setHoja(cual)
  }
  const cerrar = () => !trabajando && setHoja(null)

  // Corre una acción con la hoja trabada. Si salió bien devuelve lo que contestó.
  async function hacer(accion, ...args) {
    setTrabajando(true)
    try {
      return await accion(...args)
    } finally {
      setTrabajando(false)
    }
  }

  async function crear() {
    const r = await hacer(d.crearHogar, texto.trim())
    if (r) {
      setHoja(null)
      avisar('Hogar armado. Compartí el código con quien quieras sumar.')
    }
  }

  async function unirse() {
    const r = await hacer(d.unirseAlHogar, texto)
    if (r) {
      setHoja(null)
      avisar('Ya estás en el hogar. Lo que tenías en tu despensa se sumó a la del hogar.')
    }
  }

  async function renombrar() {
    const r = await hacer(d.renombrarHogar, texto.trim())
    if (r) {
      setHoja(null)
      avisar('Nombre cambiado')
    }
  }

  async function copiarCodigo() {
    if (await copiar(hogar.codigo)) avisar('Código copiado')
    else avisar(`Copialo a mano: ${hogar.codigo}`, 'aviso')
  }

  async function renovar() {
    const seguir = await confirmar({
      titulo: '¿Cambiar el código?',
      texto: 'El código de ahora deja de servir. Quienes ya están en el hogar siguen adentro.',
      boton: 'Cambiar código',
      peligro: false,
    })
    if (seguir && (await hacer(d.renovarCodigo, false))) avisar('Código nuevo listo')
  }

  async function apagar() {
    const seguir = await confirmar({
      titulo: '¿Apagar el código?',
      texto: 'Nadie va a poder entrar al hogar hasta que armes un código nuevo. Quienes ya están adentro siguen.',
      boton: 'Apagar código',
      peligro: false,
    })
    if (seguir && (await hacer(d.renovarCodigo, true))) avisar('Código apagado')
  }

  async function sacar(m) {
    const seguir = await confirmar({
      titulo: `¿Sacar a ${m.nombre} del hogar?`,
      texto: `${m.nombre} se lleva una copia de la despensa del hogar (menos lo de alimentos o recetas de otras personas) y vuelve a tener la suya. Sus alimentos y recetas propios se van con ${m.nombre}.`,
      boton: 'Sacar',
    })
    if (seguir && (await hacer(d.sacarDelHogar, m.id))) avisar(`${m.nombre} ya no está en el hogar`)
  }

  async function salir() {
    const solo = hogar.miembros.length === 1
    const relevo = hogar.soy_creador && !solo
    const seguir = await confirmar({
      titulo: '¿Salir del hogar?',
      texto: [
        solo
          ? 'Sos la única persona del hogar: al salir, el hogar se borra.'
          : 'Dejás de ver la despensa compartida y de compartir la lista de compras y las comidas preparadas.',
        'Te llevás una copia de lo que hay en la despensa, la lista y las comidas preparadas del hogar (menos lo que sea de alimentos o recetas que cargaron otras personas). Lo que tenías antes de entrar queda guardado en un respaldo.',
        'Tus alimentos y recetas propios se van con vos.',
        relevo ? 'La persona que está hace más tiempo pasa a manejar el hogar.' : '',
      ]
        .filter(Boolean)
        .join(' '),
      boton: 'Salir del hogar',
    })
    if (seguir && (await hacer(d.salirDelHogar))) avisar('Saliste del hogar')
  }

  return (
    <>
      <section className="tarjeta p-5 mb-4" aria-labelledby="hogar-titulo">
        <div className="flex items-center gap-2">
          <Icono n="home" className="text-verde-texto" size={22} />
          <h2 id="hogar-titulo" className="font-semibold flex-1 min-w-0 truncate">
            {hogar ? hogar.nombre : 'Hogar'}
          </h2>
          {hogar?.soy_creador && (
            <button
              onClick={() => abrir('nombre', hogar.nombre)}
              className="toque w-8 h-8 text-gris"
              aria-label="Cambiar el nombre del hogar"
            >
              <Icono n="edit" size={18} />
            </button>
          )}
        </div>

        {!hogar ? (
          <>
            <p className="text-sm text-gris mt-2">
              Compartí con quienes viven con vos la despensa, la lista de compras y las comidas preparadas: lo que uno compra o cocina lo
              ven todos. El diario, el plan y tu perfil siguen siendo solo tuyos.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <button onClick={() => abrir('crear')} className="btn-chico bg-verde text-white">
                <Icono n="add" size={16} /> Armar un hogar
              </button>
              <button onClick={() => abrir('unirse')} className="btn-chico bg-verde-suave text-verde-texto">
                <Icono n="key" size={16} /> Tengo un código
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-gris mt-1">
              Despensa, lista de compras y comidas preparadas compartidas · {hogar.miembros.length} de {hogar.maximo} personas
            </p>
            <ul className="divide-y divide-linea mt-2">
              {hogar.miembros.map((m) => (
                <Persona
                  key={m.id}
                  m={m}
                  yo={m.id === usuario.id}
                  puedeSacar={hogar.soy_creador && m.id !== usuario.id}
                  onSacar={() => sacar(m)}
                />
              ))}
            </ul>

            {hogar.soy_creador ? (
              <div className="mt-3 rounded-xl bg-campo p-3">
                <p className="text-xs font-semibold text-gris">Código para sumar gente</p>
                {hogar.codigo ? (
                  <>
                    <p
                      className="text-2xl font-bold tracking-[0.25em] mt-1 select-all"
                      data-testid="codigo-hogar"
                      aria-label={`Código: ${hogar.codigo.split('').join(' ')}`}
                    >
                      {hogar.codigo}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <button onClick={copiarCodigo} className="btn-chico bg-superficie border border-linea text-tinta">
                        <Icono n="content_copy" size={16} /> Copiar
                      </button>
                      <button onClick={renovar} disabled={trabajando} className="btn-chico bg-superficie border border-linea text-tinta">
                        <Icono n="refresh" size={16} /> Cambiar
                      </button>
                      <button onClick={apagar} disabled={trabajando} className="btn-chico bg-superficie border border-linea text-tinta">
                        <Icono n="cancel" size={16} /> Apagar
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm mt-1">El código está apagado: nadie puede entrar.</p>
                    <button
                      onClick={async () => (await hacer(d.renovarCodigo, false)) && avisar('Código nuevo listo')}
                      disabled={trabajando}
                      className="btn-chico bg-verde text-white mt-2"
                    >
                      <Icono n="key" size={16} /> Armar un código
                    </button>
                  </>
                )}
              </div>
            ) : (
              <p className="text-sm text-gris mt-3">Para sumar a alguien, pedile el código a quien armó el hogar.</p>
            )}

            <button onClick={salir} disabled={trabajando} className="mt-4 text-sm text-gris underline flex items-center gap-1.5">
              <Icono n="logout" size={16} /> Salir del hogar
            </button>
          </>
        )}
      </section>

      {hoja === 'crear' && (
        <Hoja titulo="Armar un hogar" onCerrar={cerrar}>
          <p className="text-sm">
            Tu despensa, tu lista de compras y tus comidas preparadas pasan a ser las del hogar. Lo que tenés ahora queda guardado por si
            salís.
          </p>
          <label className="etiqueta mt-4" htmlFor="hg-nombre">
            Nombre del hogar
          </label>
          <input
            id="hg-nombre"
            className="campo"
            maxLength={40}
            autoComplete="off"
            placeholder="Ej.: Casa"
            value={texto}
            onChange={(ev) => setTexto(ev.target.value)}
            autoFocus
          />
          <button onClick={crear} disabled={!texto.trim() || trabajando} className="btn-primario w-full mt-4">
            Armar hogar
          </button>
        </Hoja>
      )}

      {hoja === 'unirse' && (
        <Hoja titulo="Unirme a un hogar" onCerrar={cerrar}>
          <p className="text-sm">
            Pedile a quien armó el hogar el código de 6 letras o números. Lo que tenés hoy en tu despensa se suma a la del hogar (lo tuyo
            queda guardado), y tus alimentos y recetas propios los van a ver las personas del hogar. Si después te vas, te llevás una copia.
          </p>
          <label className="etiqueta mt-4" htmlFor="hg-codigo">
            Código
          </label>
          <input
            id="hg-codigo"
            className="campo text-xl font-bold tracking-[0.25em] uppercase"
            autoCapitalize="characters"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder="ABC123"
            value={texto}
            onChange={(ev) => setTexto(limpiarCodigo(ev.target.value))}
            autoFocus
          />
          <button onClick={unirse} disabled={texto.length !== 6 || trabajando} className="btn-primario w-full mt-4">
            Unirme
          </button>
        </Hoja>
      )}

      {hoja === 'nombre' && (
        <Hoja titulo="Nombre del hogar" onCerrar={cerrar}>
          <label className="etiqueta" htmlFor="hg-nombre2">
            Nombre
          </label>
          <input
            id="hg-nombre2"
            className="campo"
            maxLength={40}
            autoComplete="off"
            value={texto}
            onChange={(ev) => setTexto(ev.target.value)}
            autoFocus
          />
          <button onClick={renombrar} disabled={!texto.trim() || trabajando} className="btn-primario w-full mt-4">
            Guardar
          </button>
        </Hoja>
      )}
    </>
  )
}
