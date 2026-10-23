// Catálogo de actividades físicas de Tupper (F-19, fase 2). Se carga a la base con `npm run seed` (supabase/seed-6.sql).
// Los METs salen del Compendio de Actividades Físicas 2024 (Herrmann et al., pacompendium.com; de libre uso, también comercial),
// redondeados. Se revisaron uno por uno el 2026-10-21: suave, medio y fuerte son valores del Compendio para esa actividad
// (por ejemplo, correr: trote 7,5, 6 mph 9,3, 8 mph 12,0). Donde el Compendio no tiene una entrada propia (pádel, pickleball,
// funcional, CrossFit, parkour, hip hop, body pump...) son valores cercanos a actividades parecidas y son aproximados.
// Cada actividad tiene tres METs: suave, medio y fuerte. La app interpola según el esfuerzo (1 a 10) que cuente la persona.
//   [slug, nombre, categoría, métrica, suave, medio, fuerte, usa distancia, usa desnivel]
// La métrica dice con qué cuenta se puede afinar el gasto: 'correr' y 'caminar' (ecuaciones del ACSM con distancia y
// desnivel), 'bici' (METs según la velocidad) o 'general' (solo METs, duración y esfuerzo).

// Las categorías (con su nombre para mostrar) están en src/lib/ejercicio.js; la base las valida igual (supabase/actualizacion-16.sql).

export const actividades = [
  // Caminar y correr
  ['caminar', 'Caminar', 'cardio', 'caminar', 3.0, 4.3, 5.5, true, true],
  ['caminar-cinta', 'Caminar en cinta', 'cardio', 'caminar', 3.0, 4.3, 5.8, true, true],
  ['marcha-nordica', 'Marcha nórdica (con bastones)', 'cardio', 'caminar', 4.3, 5.3, 7.0, true, true],
  ['senderismo', 'Senderismo o trekking', 'aire_libre', 'caminar', 5.3, 6.0, 7.8, true, true],
  ['caminata-mochila', 'Caminata con mochila cargada', 'aire_libre', 'caminar', 5.0, 7.0, 7.8, true, true],
  ['correr', 'Correr', 'cardio', 'correr', 7.5, 9.3, 12.0, true, true],
  ['correr-cinta', 'Correr en cinta', 'cardio', 'correr', 7.5, 9.3, 12.0, true, true],
  ['trote', 'Trote suave', 'cardio', 'correr', 6.5, 7.5, 8.5, true, true],
  ['trail', 'Trail running (cerro)', 'aire_libre', 'correr', 8.0, 9.3, 11.0, true, true],
  ['intervalos-carrera', 'Series o intervalos corriendo', 'cardio', 'general', 8.5, 10.0, 12.0, false, false],
  ['escaleras', 'Subir escaleras', 'cardio', 'general', 4.5, 6.8, 9.3, false, false],
  ['escaladora', 'Escaladora (máquina de escaleras)', 'cardio', 'general', 6.0, 9.3, 10.0, false, false],
  ['eliptico', 'Elíptico', 'cardio', 'general', 4.0, 5.0, 9.0, false, false],
  ['soga', 'Saltar la soga', 'cardio', 'general', 8.3, 11.8, 12.3, false, false],
  // Bicicleta
  ['bici-ruta', 'Bicicleta en la calle', 'bici', 'bici', 4.0, 6.8, 10.0, true, true],
  ['bici-paseo', 'Paseo en bicicleta', 'bici', 'bici', 3.5, 4.0, 6.8, true, true],
  ['bici-montana', 'Mountain bike', 'bici', 'bici', 6.8, 8.5, 10.0, true, true],
  ['bici-fija', 'Bicicleta fija', 'bici', 'general', 4.0, 6.8, 8.8, false, false],
  ['spinning', 'Spinning (clase de bici fija)', 'bici', 'general', 6.8, 9.0, 11.0, false, false],
  ['monopatin', 'Skate o monopatín', 'bici', 'general', 4.0, 5.0, 6.0, false, false],
  ['patin', 'Patín (rollers)', 'bici', 'general', 6.0, 7.5, 9.8, false, false],
  // Agua
  ['natacion', 'Natación (crol)', 'agua', 'general', 5.8, 8.0, 10.5, false, false],
  ['natacion-pecho', 'Natación (pecho)', 'agua', 'general', 5.3, 7.8, 10.3, false, false],
  ['natacion-espalda', 'Natación (espalda)', 'agua', 'general', 4.8, 7.0, 9.5, false, false],
  ['natacion-paseo', 'Nadar de paseo', 'agua', 'general', 4.0, 6.0, 6.0, false, false],
  ['aquagym', 'Aquagym', 'agua', 'general', 3.8, 5.5, 7.5, false, false],
  ['waterpolo', 'Waterpolo', 'agua', 'general', 6.0, 10.0, 10.0, false, false],
  ['kayak', 'Kayak', 'agua', 'general', 3.5, 5.0, 7.0, false, false],
  ['remo-agua', 'Remo o canotaje', 'agua', 'general', 2.8, 5.8, 12.0, false, false],
  ['sup', 'Stand up paddle', 'agua', 'general', 3.8, 5.0, 9.8, false, false],
  ['surf', 'Surf', 'agua', 'general', 3.0, 3.5, 5.0, false, false],
  ['snorkel', 'Snorkel o buceo', 'agua', 'general', 3.0, 5.0, 7.0, false, false],
  ['remo-maquina', 'Remo en máquina', 'cardio', 'general', 5.0, 7.5, 11.0, false, false],
  // Deportes de pelota
  ['futbol', 'Fútbol', 'pelota', 'general', 5.0, 7.0, 9.5, false, false],
  ['futbol-5', 'Fútbol 5 o futsal', 'pelota', 'general', 6.0, 7.8, 9.5, false, false],
  ['basquet', 'Básquet', 'pelota', 'general', 5.0, 7.5, 8.0, false, false],
  ['voley', 'Vóley', 'pelota', 'general', 3.0, 4.0, 6.0, false, false],
  ['voley-playa', 'Vóley de playa', 'pelota', 'general', 4.0, 6.0, 8.0, false, false],
  ['handball', 'Handball', 'pelota', 'general', 6.0, 8.0, 12.0, false, false],
  ['rugby', 'Rugby', 'pelota', 'general', 6.3, 7.3, 8.3, false, false],
  ['hockey-cesped', 'Hockey sobre césped', 'pelota', 'general', 6.0, 7.8, 8.0, false, false],
  ['hockey-patines', 'Hockey sobre patines', 'pelota', 'general', 6.0, 7.3, 9.0, false, false],
  ['ultimate', 'Ultimate (frisbee)', 'pelota', 'general', 6.0, 8.0, 8.0, false, false],
  ['golf', 'Golf (caminando)', 'pelota', 'general', 3.5, 4.3, 5.3, false, false],
  ['bochas', 'Bochas', 'pelota', 'general', 2.5, 3.3, 3.8, false, false],
  ['bowling', 'Bowling', 'pelota', 'general', 2.5, 3.0, 3.8, false, false],
  ['beisbol', 'Béisbol o sóftbol', 'pelota', 'general', 3.5, 5.0, 6.0, false, false],
  // Raqueta y paleta
  ['tenis', 'Tenis', 'raqueta', 'general', 4.5, 6.8, 8.0, false, false],
  ['padel', 'Pádel', 'raqueta', 'general', 4.5, 6.0, 8.0, false, false],
  ['squash', 'Squash', 'raqueta', 'general', 7.3, 10.0, 12.0, false, false],
  ['badminton', 'Bádminton', 'raqueta', 'general', 4.5, 5.5, 7.0, false, false],
  ['tenis-mesa', 'Tenis de mesa (ping pong)', 'raqueta', 'general', 3.5, 4.0, 5.5, false, false],
  ['pickleball', 'Pickleball', 'raqueta', 'general', 3.5, 4.8, 6.0, false, false],
  ['paleta', 'Paleta o frontón', 'raqueta', 'general', 4.5, 6.0, 8.0, false, false],
  // Baile y clases
  ['baile', 'Baile (social, fiesta)', 'baile', 'general', 3.0, 4.5, 7.8, false, false],
  ['zumba', 'Zumba', 'baile', 'general', 5.5, 6.5, 8.5, false, false],
  ['salsa', 'Salsa o bachata', 'baile', 'general', 4.8, 6.0, 7.8, false, false],
  ['tango', 'Tango', 'baile', 'general', 3.0, 4.5, 5.5, false, false],
  ['folklore', 'Folklore', 'baile', 'general', 4.5, 5.5, 7.8, false, false],
  ['hip-hop', 'Hip hop o dancehall', 'baile', 'general', 4.5, 6.0, 7.8, false, false],
  ['danza', 'Danza clásica o contemporánea', 'baile', 'general', 4.0, 5.0, 6.8, false, false],
  ['aerobica', 'Aeróbica (clase)', 'baile', 'general', 4.8, 7.3, 8.0, false, false],
  ['step', 'Step (clase)', 'baile', 'general', 5.5, 7.3, 9.0, false, false],
  // Yoga, pilates y elongación
  ['yoga', 'Yoga', 'mente_cuerpo', 'general', 2.0, 2.3, 4.0, false, false],
  ['pilates', 'Pilates', 'mente_cuerpo', 'general', 2.5, 2.8, 4.0, false, false],
  ['elongacion', 'Elongación o movilidad', 'mente_cuerpo', 'general', 2.0, 2.3, 2.8, false, false],
  ['tai-chi', 'Tai chi', 'mente_cuerpo', 'general', 2.5, 3.3, 4.0, false, false],
  // Fuerza y entrenamiento funcional
  ['pesas', 'Pesas o musculación', 'fuerza', 'general', 3.0, 3.5, 6.0, false, false],
  ['calistenia', 'Calistenia (con el peso del cuerpo)', 'fuerza', 'general', 2.8, 3.8, 7.5, false, false],
  ['core', 'Abdominales y core', 'fuerza', 'general', 2.8, 3.8, 5.0, false, false],
  ['funcional', 'Entrenamiento funcional', 'fuerza', 'general', 4.0, 6.0, 8.0, false, false],
  ['circuito', 'Circuito de ejercicios', 'fuerza', 'general', 3.5, 5.0, 7.5, false, false],
  ['hiit', 'HIIT (intervalos de alta intensidad)', 'fuerza', 'general', 6.0, 7.0, 10.0, false, false],
  ['gimnasia-artistica', 'Gimnasia artística', 'fuerza', 'general', 3.0, 3.8, 5.0, false, false],
  ['parkour', 'Parkour', 'fuerza', 'general', 6.0, 8.0, 10.0, false, false],
  ['trampolin', 'Cama elástica o trampolín', 'fuerza', 'general', 3.5, 5.0, 6.3, false, false],
  ['crossfit', 'CrossFit', 'fuerza', 'general', 6.0, 8.0, 10.0, false, false],
  ['kettlebell', 'Kettlebell', 'fuerza', 'general', 4.5, 6.0, 8.0, false, false],
  ['body-pump', 'Clase de pesas con música (body pump)', 'fuerza', 'general', 4.0, 5.5, 6.0, false, false],
  // Combate
  ['boxeo', 'Boxeo (bolsa y guantes)', 'combate', 'general', 5.8, 7.8, 12.3, false, false],
  ['kickboxing', 'Kickboxing o muay thai', 'combate', 'general', 6.0, 7.3, 10.3, false, false],
  ['artes-marciales', 'Artes marciales (karate, judo, taekwondo)', 'combate', 'general', 5.3, 10.3, 10.3, false, false],
  ['jiu-jitsu', 'Jiu-jitsu o lucha', 'combate', 'general', 5.0, 8.0, 10.3, false, false],
  ['tiro-arco', 'Tiro con arco', 'combate', 'general', 2.5, 3.5, 4.3, false, false],
  ['esgrima', 'Esgrima', 'combate', 'general', 4.5, 6.0, 6.0, false, false],
  // Aire libre
  ['escalada', 'Escalada deportiva', 'aire_libre', 'general', 5.8, 7.5, 8.0, false, false],
  ['esqui', 'Esquí', 'aire_libre', 'general', 4.3, 6.3, 8.0, false, false],
  ['snowboard', 'Snowboard', 'aire_libre', 'general', 4.3, 6.3, 7.5, false, false],
  ['patin-hielo', 'Patinaje sobre hielo', 'aire_libre', 'general', 5.5, 7.0, 9.0, false, false],
  ['equitacion', 'Equitación', 'aire_libre', 'general', 3.8, 5.8, 7.3, false, false],
  ['vela', 'Vela o velero', 'aire_libre', 'general', 2.5, 3.0, 4.5, false, false],
  ['pesca', 'Pesca (caminando)', 'aire_libre', 'general', 2.5, 3.5, 4.0, false, false],
  // Otras
  ['otra', 'Otra actividad', 'otro', 'general', 3.0, 5.0, 8.0, false, false],
]
