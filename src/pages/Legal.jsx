// Términos de uso y Política de privacidad. Se pueden leer sin iniciar sesión.
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '../components/Marco'
import { Icono } from '../components/ui'
import { MARCA } from '../lib/marca'

const contacto = MARCA.contacto ? `escribiendo a ${MARCA.contacto}` : 'por los medios de contacto publicados en el sitio'
const responsable = MARCA.responsable || `el equipo de ${MARCA.nombre}`

const TEXTOS = {
  terminos: {
    titulo: 'Términos de uso',
    secciones: [
      [
        'Qué es Tupper',
        [
          `${MARCA.nombre} es una herramienta para organizar tu despensa, tus recetas, el plan de comidas de la semana y un registro de lo que comés y tomás. La ofrece ${responsable} a través de ${MARCA.sitio}.`,
          'Al crear una cuenta aceptás estos términos. Si no estás de acuerdo, no uses la app.',
        ],
      ],
      [
        'No reemplaza a un profesional',
        [
          'Los objetivos de calorías, proteína y líquido, los consejos del día y los valores nutricionales son cálculos orientativos hechos con fórmulas generales. No son un diagnóstico ni una indicación médica o nutricional.',
          'Antes de hacer una dieta, y sobre todo si estás embarazada, tenés una enfermedad, tomás medicación, sos menor de edad o tenés o tuviste un trastorno de la conducta alimentaria, consultá con un médico o un nutricionista.',
          'El análisis con IA del resumen semanal lo escribe un modelo de inteligencia artificial a partir de lo que registraste. Puede equivocarse y no conoce tu historia clínica: tomalo como una orientación general.',
          'Los datos de los alimentos son aproximados. Parte viene de una base propia y parte de Open Food Facts, que carga la comunidad: pueden tener errores. Si tenés una alergia o una restricción, guiate siempre por la etiqueta del producto.',
        ],
      ],
      [
        'Tu cuenta',
        [
          'Para usar la app tenés que tener 18 años o más, o contar con la autorización de un adulto responsable.',
          'Sos responsable de cuidar tu contraseña y de lo que se haga desde tu cuenta. Los datos que cargues tienen que ser tuyos.',
        ],
      ],
      [
        'Uso permitido',
        [
          'No podés usar la app para algo ilegal, intentar entrar a datos de otras personas, sobrecargar el servicio ni copiarlo para revenderlo.',
        ],
      ],
      [
        'Lo que cargás',
        [
          'Las recetas, los alimentos y los registros que cargues son tuyos. Nos das permiso para guardarlos y procesarlos solo para que la app funcione para vos.',
        ],
      ],
      [
        'Disponibilidad y cambios',
        [
          'La app se ofrece tal como está. Puede tener errores, interrupciones o cambiar con el tiempo. Hacemos lo posible para que funcione bien, pero no podemos garantizar que esté siempre disponible ni que los cálculos sean exactos.',
          'Si cambiamos estos términos de forma importante, lo vamos a avisar en la app.',
        ],
      ],
      [
        'Responsabilidad',
        [
          `En la medida en que la ley lo permita, ${responsable} no responde por los daños que surjan de decisiones tomadas a partir de la información de la app.`,
        ],
      ],
      [
        'Dar de baja la cuenta',
        ['Podés borrar tu cuenta cuando quieras desde Perfil. Al hacerlo se eliminan todos tus datos y no se pueden recuperar.'],
      ],
      ['Ley aplicable', ['Estos términos se rigen por las leyes de la República Argentina.']],
    ],
  },
  privacidad: {
    titulo: 'Política de privacidad',
    secciones: [
      [
        'Qué datos guardamos',
        [
          'Tu email y tu contraseña (cifrada, no la podemos ver).',
          'Los datos de tu perfil: nombre, sexo, fecha de nacimiento, altura, peso, peso objetivo, nivel de actividad y objetivos diarios.',
          'Lo que registrás: comidas y bebidas, medidas de peso y cintura, tu despensa, tus recetas, tu plan semanal y tu lista de compras.',
          'Un registro técnico: si la app falla mientras la usás, se anota el error, en qué pantalla pasó, la versión de la app y el tipo de navegador, para poder arreglarlo. También se anota si una búsqueda de productos o un análisis con IA respondió o no. Ahí no se guarda lo que comés ni lo que buscás.',
          'Varios de estos son datos de salud, que la ley considera sensibles. Los cargás por decisión propia y, al hacerlo, das tu consentimiento para que los guardemos con el único fin de que la app funcione para vos.',
        ],
      ],
      [
        'Para qué los usamos',
        [
          'Solo para hacer funcionar la app: calcular tus objetivos, mostrarte tu progreso y armar tu plan.',
          'No vendemos tus datos, no los compartimos con terceros para publicidad y no los usamos para perfilarte.',
        ],
      ],
      [
        'Dónde se guardan',
        [
          'La base de datos y el inicio de sesión están en Supabase, en servidores ubicados en São Paulo, Brasil. El sitio se sirve desde Vercel. Los dos actúan como proveedores y no usan tus datos para otra cosa.',
          'Cuando buscás un producto de marca, el texto de la búsqueda se manda a Open Food Facts. No se manda tu email ni ningún dato tuyo.',
          'Si pedís el análisis con IA del resumen semanal, se envía a Groq (el proveedor del modelo de IA) un resumen de esa semana: tu sexo, edad, altura, peso, objetivos, los totales de cada día, los alimentos que registraste y tus medidas de peso. No se envían tu nombre ni tu email. Solo pasa cuando tocás el botón, y la devolución queda guardada en tu cuenta.',
          'En tu teléfono o computadora se guarda la sesión iniciada y alguna preferencia, como la forma en que endulzás las infusiones. La app no usa cookies de publicidad ni de seguimiento.',
          'Para que la app abra rápido y se pueda usar sin conexión, en ese mismo dispositivo también queda una copia de tus datos y de los cambios que todavía no se enviaron. Esa copia se borra cuando cerrás sesión; si el dispositivo lo usa otra persona, cerrá sesión al terminar.',
          'Para saber qué pantallas se usan, contamos las visitas de forma anónima con Vercel Web Analytics: no usa cookies y no permite identificarte.',
          'Para frenar a los programas que crean cuentas falsas, la pantalla de acceso puede usar Turnstile, un servicio de Cloudflare que comprueba que del otro lado hay una persona. Para eso recibe datos técnicos de tu navegador, como la dirección IP. No recibe tu contraseña ni lo que cargás en la app.',
          'Cuando elegís una contraseña, se consulta un servicio público (Have I Been Pwned) para saber si apareció en filtraciones de otros sitios. La contraseña no sale de tu dispositivo: se manda solo un fragmento de su huella, que no alcanza para reconstruirla.',
        ],
      ],
      ['Cómo los protegemos', ['La conexión va cifrada y cada cuenta puede leer y modificar únicamente sus propios datos.']],
      [
        'Tus derechos',
        [
          `Podés ver, corregir y borrar tus datos cuando quieras. Desde Perfil podés descargar una copia de todo y borrar tu cuenta. Para cualquier otro pedido podés comunicarte ${contacto}.`,
          'La Agencia de Acceso a la Información Pública, en su carácter de órgano de control de la Ley N.º 25.326, tiene la atribución de atender las denuncias y reclamos de quienes resulten afectados en sus derechos por incumplimiento de las normas vigentes en materia de protección de datos personales.',
        ],
      ],
      [
        'Cuánto tiempo los guardamos',
        ['Mientras tengas la cuenta. Si la borrás, se eliminan todos tus datos de la base.', 'El registro técnico se borra a los 90 días.'],
      ],
      ['Menores', ['La app no está pensada para menores de 18 años sin la autorización de un adulto responsable.']],
      ['Cambios', ['Si esta política cambia de forma importante, lo vamos a avisar en la app.']],
    ],
  },
}

export default function Legal({ tipo }) {
  const nav = useNavigate()
  const { titulo, secciones } = TEXTOS[tipo]
  useEffect(() => {
    document.title = `${titulo} · Tupper`
  }, [titulo])
  const otro = tipo === 'terminos' ? ['privacidad', 'Política de privacidad'] : ['terminos', 'Términos de uso']
  return (
    <div className="min-h-screen bg-fondo">
      <header className="sticky top-0 z-30 bg-fondo/90 backdrop-blur border-b border-verde-suave/60">
        <div className="max-w-[640px] mx-auto h-16 px-4 flex items-center gap-3">
          <button
            onClick={() => (window.history.length > 1 ? nav(-1) : nav('/'))}
            className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center"
            aria-label="Volver"
          >
            <Icono n="arrow_back" />
          </button>
          <h1 className="flex-1 text-lg font-semibold truncate">{titulo}</h1>
          <Logo />
        </div>
      </header>
      <main className="max-w-[640px] mx-auto px-5 pt-5 pb-16">
        <p className="text-sm text-gris mb-5">Vigente desde {MARCA.vigencia}.</p>
        {secciones.map(([nombre, parrafos], i) => (
          <section key={nombre} className="mb-6">
            <h2 className="font-semibold text-[17px] mb-1.5">
              {i + 1}. {nombre}
            </h2>
            {parrafos.map((p) => (
              <p key={p} className="text-sm leading-relaxed text-tinta/90 mb-2">
                {p}
              </p>
            ))}
          </section>
        ))}
        <Link to={`/${otro[0]}`} replace className="text-sm font-semibold text-verde-texto underline">
          Ver {otro[1]}
        </Link>
      </main>
    </div>
  )
}
