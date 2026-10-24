// Datos de quien publica la app. Aparecen en los Términos y en la Política de privacidad.
// Completalos antes de ofrecer la app al público.
export const MARCA = {
  nombre: 'Tupper',
  sitio: 'tupperapp.vercel.app',
  responsable: 'Santiago Morán', // nombre y apellido o razón social de quien responde por la app
  contacto: 'santimorann19@gmail.com', // email para consultas y pedidos sobre datos personales
  vigencia: 'octubre de 2026',
  // Cambia cada vez que se modifican los Términos o la Política: a quien ya tenía cuenta se le avisa una vez qué cambió
  // (L-05, components/AvisoLegal.jsx). `novedadesLegales` es ese resumen.
  versionLegal: '2026-10-b',
  novedadesLegales:
    'Sumamos qué datos se usan en lo nuevo: recordatorios con la app cerrada, verificación en dos pasos, recetas pegadas a la IA y archivos de entrenamiento.',
  // Número de inscripción de la base en el Registro Nacional de Bases de Datos Personales (AAIP), cuando llegue por mail.
  // Mientras esté vacío no se muestra nada; con el número, la Política de privacidad lo dice (ver L-03 en PENDIENTES.md).
  registroAAIP: '',
}
