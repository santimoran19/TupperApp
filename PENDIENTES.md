# Tupper: hoja de ruta

Lo que falta hacer en la app, ordenado por tema. Antes de cada tarea se lee este archivo para ver qué conviene hacer junto, y al terminar se actualiza: lo hecho pasa abajo, a **Hecho**, con la versión en que salió.

**Prioridad**
- **P1**: antes de abrirla al público, o porque si falla se pierden datos o plata.
- **P2**: suma mucho para el que la usa.
- **P3**: cuando haya tiempo.

**Tamaño** (trabajo, no plata)
- **S**: una tanda corta.
- **M**: una tanda.
- **L**: varias tandas, o depende de otra cosa.

Cada tarea tiene un código (F-01, S-03...) para nombrarla sin repetir la descripción. `[ ]` pendiente, `[~]` empezada, `[x]` hecha.

El archivo tiene dos partes:
- **Por importancia:** todas las tareas en el orden en que conviene encararlas.
- **Por tema:** el detalle de cada una.

Si se agrega o cambia una tarea, se actualizan las dos.

---

## Por importancia

Dentro de cada nivel, de arriba hacia abajo es el orden sugerido. Lo que va junto está indicado.

**Primero (P1)**
1. L-03 · Registro de la base de datos (preparado: falta el trámite en TAD)
2. S-04 · Repo privado (al terminar)

**Después (P2)**
3. F-18 · Registrarse e iniciar sesión con Google
4. IA-01 · Chat con IA (va junto con IA-02)
5. IA-02 · Proveedor de respaldo
6. D-07 · Revisión completa de accesibilidad
7. L-04 · Consentimiento al registrarse
8. C-05 · Opiniones desde la app
9. T-03 · Pruebas en Safari
10. T-04 · Base de pruebas aparte
11. T-01 · Actualizar las herramientas
12. F-06 · Recordatorios

**Cuando haya tiempo (P3)**
13. F-08 · Copiar un día entero
14. D-06 · Deshacer en más lugares
15. D-04 · Esqueletos de carga
16. F-10 · Peso: gráfico y fecha estimada
17. F-11 · Exportar el registro a planilla
18. F-09 · Combos frecuentes
19. F-12b · Seguir sumando a la base común
20. F-13 · Categorías editables por el usuario
21. D-08 · Revisión de los textos
22. IA-04 · Cargar una receta desde un texto
23. IA-05 · Probar la carga con IA con los proveedores reales (primera vez que se activa)
24. C-06 · Métricas de uso
25. T-05 · Partir `sincronizacion.js`
26. T-07 · Mandar lo cargado sin conexión con la app cerrada
27. S-06 · Verificación en dos pasos
28. S-03 · Contraseñas filtradas también del lado de Supabase
29. F-22 · Sincronizar con relojes y apps de salud (necesita app nativa o servidor)
30. F-19b · Seguir con gasto y ejercicio (importar archivos, pulso en reposo, validar con mediciones reales)

**Al final, cuando la app esté completa (requieren pagar algo: dominio, planes de pago)**
31. C-03 · Mails propios (SMTP) (necesita el dominio de C-02)
32. C-02 · Dominio propio y página de presentación (va junto con C-03)
33. C-01 · Planes y cobro (para empezar a cobrar)
34. F-18 · Registrarse e iniciar sesión con Google (el nombre de usuario, F-17, ya está hecho)
35. C-04 · Play Store (cuesta la cuenta de desarrollador)

---
## Por tema

## 0. Para verificar ahora

Nada por ahora.

## 1. Funciones

- [~] **F-06 · Recordatorios con la app cerrada (Web Push)** · P2 · L. La 1.27 trajo los recordatorios que avisan **con la app abierta** (agua, cena sin anotar y más; ver F-21). Falta que lleguen con la app cerrada.
  - Necesita notificaciones push del navegador y algo del lado del servidor que las mande a la hora (una función programada en Supabase y claves VAPID).
  - En iPhone solo funcionan con la app instalada en la pantalla de inicio (iOS 16.4 o más).
- [ ] **F-08 · Copiar un día entero** · P3 · S. Hoy se puede repetir la comida de ayer; falta copiar el día completo (o un día cualquiera) a otra fecha.
- [ ] **F-09 · Combos frecuentes** · P3 · M. Guardar "mi desayuno de siempre" con varios alimentos y registrarlo con un toque.
- [ ] **F-18 · Registrarse e iniciar sesión con Google** · P2 · M. Un botón "Continuar con Google" en la pantalla de acceso, para crear la cuenta o entrar sin escribir mail ni contraseña. **Qué hace falta de tu lado:** crear un proyecto en Google Cloud, configurar la pantalla de consentimiento y las credenciales OAuth (cliente web), y activar el proveedor Google en Supabase (Authentication > Providers) con las direcciones de vuelta de la app y de Supabase. Gratis. **Cosas a resolver:** (1) el consentimiento de Google en modo de prueba solo deja entrar a 100 usuarios que vos agregues a mano; para abrirlo a cualquiera hay que publicarlo, y Google pide la Política de privacidad y la página de inicio en un dominio propio (esto se cruza con C-02, dominio propio); (2) si ya existe una cuenta con el mismo mail, Supabase puede unirla con la de Google; hay que dejarlo bien configurado para que nadie tome una cuenta ajena; (3) quien entra con Google no tiene contraseña: la pantalla de "Olvidé mi contraseña" y el Perfil tienen que explicarlo, y se podría ofrecer crear una; (4) igual hay que pasar por el perfil (fecha de nacimiento, para cumplir los 18 años de L-01) y, con F-17, elegir el nombre de usuario; (5) sumar a la Política de privacidad que Google es un proveedor y qué datos se reciben (mail y nombre; la foto no se guarda); (6) probarlo en el navegador del teléfono y en la app instalada (PWA), donde el regreso desde Google a veces se comporta distinto. Va con pruebas (el simulador de las pruebas tiene que fingir el regreso de Google) y los textos del botón. Borrar la cuenta y descargar los datos siguen igual.
- [ ] **F-22 · Sincronizar con relojes y apps de salud** · P3 · L. Traer pasos, ejercicio y peso desde Apple Salud, Google Fit/Health Connect, Garmin o Strava. Una app web (PWA) no puede leer Apple Salud ni Health Connect: hace falta una app nativa (ver C-04) o conectar Strava/Garmin con un servidor propio. Hoy la alternativa es importar archivos (F-19b).
- [ ] **F-19b · Seguir con gasto y ejercicio** · P3 · M. Quedó afuera de la 1.23: (1) importar entrenamientos desde archivos (.gpx, .tcx, .fit o la exportación de Apple Salud); conectar Strava o Garmin directo necesita algo del lado del servidor, y leer Apple Salud o Health Connect directo (los pasos incluidos) no se puede desde una PWA; sí se podría con una app instalable (Capacitor), junto con C-04; (2) usar el pulso en reposo (`profiles.resting_hr`, ya existe la columna) en el cálculo; (3) **validar el cálculo contra mediciones de referencia** (calorimetría indirecta, o al menos el seguimiento de varias personas): hoy los márgenes de error son orientativos, no validados; los coeficientes de movimiento según el trabajo y por paso son criterio propio y quedarían ajustados con esos datos; (4) un tope de proteína o cálculo sobre masa magra para obesidad alta (IMC mayor a 35), que los dos nutricionistas sugirieron; se dejó afuera a propósito la proteína configurable por ser confusa para quien no sabe de nutrición.
- [ ] **F-10 · Peso: gráfico y fecha estimada** · P3 · S. Gráfico de los últimos meses y, con la tendencia, cuándo llegaría al peso objetivo, sin prometer nada.
- [ ] **F-11 · Exportar el registro a planilla** · P3 · S. Hoy "Descargar mis datos" baja un JSON; sumar un CSV que abra en Excel, útil para llevarle al nutricionista.
- [ ] **F-12b · Seguir sumando a la base común** · P3 · S (continuo). Después de la sexta tanda (1.25: 227 alimentos y 1.471 recetas), sumar alimentos y recetas cuando aparezcan faltantes: mirar los alimentos propios que repiten varios usuarios y lo que la gente busca y no encuentra. Los alimentos se agregan en `scripts/datos/alimentos-sexta.mjs` (o en `seed-data.mjs` si es una tanda nueva) y las recetas en una familia de `scripts/datos/f-*.mjs`; se corre `npm run seed`. Ver también F-04b (lista de recetas con más de mil).
- [ ] **F-13 · Categorías editables por el usuario** · P3 · M. Crear, renombrar y elegir categorías para sus alimentos propios.
## 2. Inteligencia artificial

- [ ] **IA-01 · Chat con IA** · P2 · L. Preguntas como "¿puedo comer tal cosa ahora?" o "¿qué ceno con lo que me queda?", con los datos del día: objetivo, lo comido, lo que falta, la despensa y el plan. El análisis semanal sigue igual. Candidato al plan pago. **Falta definir:**
  - si recuerda las conversaciones (si sí, sumarlo a la Política de privacidad);
  - el tope de mensajes por día (propuesta: 20);
  - si más adelante va a poder registrar cosas ("anotame una manzana").
- [ ] **IA-02 · Proveedor de respaldo** · P2 · S. Si Groq está saturado, probar con otro (NVIDIA tiene API gratis con el mismo formato). Antes, leer sus términos: el acceso gratis parece pensado para pruebas, no para producción.
- [ ] **IA-05 · Probar la carga con IA con los proveedores reales** · P2 · S. La carga por foto, voz y texto (1.27) se probó solo con respuestas simuladas, porque donde se desarrolló no hay salida a esos servicios. Pasos: correr `actualizacion-20.sql`, cargar los secretos (ver `supabase/functions/LEEME.md`), publicar `registrar-ia` y probar con el teléfono una foto, un audio y un texto. Mirar qué tan bien reconoce la comida argentina y, si hace falta, ajustar `INSTRUCCIONES_COMIDA` o el orden de proveedores.
- [ ] **IA-04 · Cargar una receta desde un texto** · P3 · S. Pegar una receta de internet y que la IA la arme con los alimentos de la base.

## 3. Diseño y uso

- [ ] **D-04 · Esqueletos de carga** · P3 · S. Mostrar la forma de la pantalla mientras trae los datos, en vez de "Cargando...".
- [ ] **D-06 · Deshacer en más lugares** · P3 · S. "No comí" ya tiene Deshacer; sumarlo a borrar un registro, quitar de la despensa y quitar de la lista.
- [ ] **D-07 · Revisión completa de accesibilidad** · P2 · M. Lector de pantalla, etiquetas de los campos, contraste en los dos temas y letra grande del sistema (que nada se corte).
- [ ] **D-08 · Revisión de los textos** · P3 · S. Que se digan las mismas cosas con las mismas palabras en toda la app, y que los errores digan qué hacer.

## 4. Seguridad

- [ ] **S-03 · Contraseñas filtradas también del lado de Supabase** · P3 · S. Solo con el plan Pro; la app ya lo revisa por su cuenta.
- [ ] **S-04 · Repo privado** · P1 · S. Al terminar la app, antes de venderla.
- [ ] **S-06 · Verificación en dos pasos** · P3 · M. Opcional para quien la quiera (código de una app autenticadora). Supabase la trae.

## 5. Legal y datos personales

- [ ] **L-03 · Registro de la base de datos** · P1 · S. En Argentina, las bases con datos personales se inscriben en el registro de la Agencia de Acceso a la Información Pública, y acá hay datos de salud. Confirmarlo con legales. **Preparado en la 1.23.3, falta el trámite de tu lado:** la guía paso a paso con el texto de cada campo está en el documento "Tupper: inscripción de la base en la AAIP" (gratis, no vence, unos 20 minutos por TAD con clave fiscal nivel 2). En la app: la Política de privacidad suma las dos leyendas oficiales (acceso gratuito cada seis meses, art. 14 inc. 3, y la AAIP como órgano de control), las copias de seguridad diarias cifradas en GitHub, y muestra el número de inscripción cuando se carga en `registroAAIP` de `src/lib/marca.js`. Antes del trámite: firmar el DPA de Supabase, guardar los de Vercel, Groq, Cloudflare y GitHub, y activar la verificación en dos pasos en los paneles.
- [ ] **L-04 · Consentimiento al registrarse** · P2 · S. Una casilla explícita para el uso de datos de salud, además del texto que ya está debajo del botón.

## 6. Para venderla

- [ ] **C-01 · Planes y cobro** · P1 (para cobrar) · L.
  - El plan de cada usuario guardado de forma que él no lo pueda cambiar.
  - Qué entra en el plan gratis y qué en el pago (la IA, seguro).
  - Suscripciones con Mercado Pago; el aviso de pago lo recibe una función de Supabase.
- [ ] **C-02 · Dominio propio y página de presentación** · P2 · M. Una página para quien todavía no tiene cuenta: qué hace la app, capturas y el botón para crear la cuenta. Con dominio nuevo hay que actualizar el captcha de Cloudflare, Supabase y los archivos que nombra el README. Es la base de C-03 (mails propios) y de F-18 (Google pide la Política de privacidad y la página de inicio en un dominio propio para publicarse). Conviene comprarlo primero.
- [ ] **C-03 · Mails propios (SMTP)** · P1 · S. El servidor de mails que trae Supabase solo manda a direcciones del equipo del proyecto y a 2 mensajes por hora, sin garantía de entrega: sirve para probar, no para que se registre gente de afuera. Con un SMTP propio llegan a cualquier dirección y el límite arranca en 30 por hora (se puede subir). **Va después de comprar el dominio y junto con C-02:** hace falta un dominio propio para mandar desde `no-responder@tudominio` (una casilla de Gmail no sirve: límites, spam y no deja autenticar el dominio); el mismo dominio se usa para la página de presentación y para publicar el acceso con Google (F-18). **Servicio de envío** (verifica el dominio con SPF, DKIM y DMARC): Resend (gratis: 3.000 mails por mes, 100 por día; recomendado por simple) o Brevo (gratis: hasta 300 por día, con su logo probablemente). Cada registro usa 1 o 2 mails. **Pasos:** (1) comprar el dominio; (2) crear la cuenta del servicio, agregar el dominio y cargar los registros DNS que pida; (3) cargar el SMTP en Supabase (Authentication > SMTP); (4) cambiar el remitente y los links de las plantillas de `supabase/emails/`; (5) probar que el código de confirmación y el de recuperar contraseña lleguen a una casilla ajena. Si se quiere recibir respuestas en `soporte@tudominio`, se reenvía a Gmail con un servicio de reenvío gratuito (aparte del envío). Pasos en `supabase/emails/LEEME.md`.
- [ ] **C-04 · Play Store** · P3 · M. Empaquetar la app para Android (USD 25, una vez). Pide una prueba cerrada con 12 testers durante 14 días. App Store después: USD 99 por año, hace falta una Mac y Apple suele rechazar las apps que son solo una web.
- [ ] **C-05 · Opiniones desde la app** · P2 · S. Un "Contanos qué te falta" en el Perfil que llegue a tu mail o a una tabla.
- [ ] **C-06 · Métricas de uso** · P3 · S. Cuántos vuelven a la semana y qué pantallas usan, sin datos personales: Vercel Analytics ya cuenta visitas, falta mirar el recorrido.

## 7. Técnico y calidad

- [ ] **T-01 · Actualizar las herramientas** · P2 · M. Vite 5 → 8, Tailwind 3 → 4, React 18 → 19, Vitest y ESLint. No afecta a los usuarios, pero los avisos de `npm audit` son de estas versiones. Tailwind 4 cambia la configuración: va en una tanda aparte.
- [ ] **T-03 · Pruebas en Safari** · P2 · M. Hoy las pruebas de navegador corren solo en Chrome. Sumar WebKit, que es el motor de Safari, para encontrar antes los problemas de iPhone (ver V-01).
- [ ] **T-04 · Base de pruebas aparte** · P2 · M. Un segundo proyecto de Supabase (el plan gratis permite dos) para probar cambios de la base antes de tocar la de producción.
- [ ] **T-05 · Partir `sincronizacion.js`** · P3 · M. Quedó en unas 740 líneas. Separar la cola, la copia del teléfono y el envío, sin cambiar lo que hace.
- [ ] **T-07 · Mandar lo cargado sin conexión con la app cerrada** · P3 · M. Solo en Android: el navegador lo manda cuando vuelve la señal, aunque la app no esté abierta. En iPhone no existe.

---

## Hecho

- **F-20 · Plan que aprovecha lo que vence, ayuno y recordatorios, y carga con foto, voz o texto** (versión 1.27.0; hay que correr `supabase/actualizacion-20.sql` y, para la IA, publicar la función `registrar-ia` con sus claves; ver `supabase/functions/LEEME.md`). Salió de comparar con Fitia (su ventaja es la carga con IA; la de Tupper, que el plan sale de la despensa y es gratis).
  - *Plan inteligente (F-20):* `armarPlan` suma un puntaje por aprovechar lo que vence (≤3 días +16, ≤7 +9, ≤14 +3, tope 30, solo si el alimento sigue bueno ese día y queda en el stock simulado) y reparte las calorías del día por comida (`PESO_COMIDA`: desayuno 22 %, almuerzo 34 %, merienda 14 %, cena 30 %) con una pequeña preferencia por la proteína. Al armar, el aviso cuenta cuántos alimentos que vencen se aprovecharon y el Plan muestra una tarjeta con los que quedaron sin plan (`plan-vence`) que lleva a Recetas filtradas por ese alimento.
  - *Ayuno intermitente y recordatorios (F-21):* en el Diario (solo hoy) el ayuno con esquemas 12:12, 14:10, 16:8, 18:6 y 20:4, hora de inicio editable, cuánto pasó, cuánto falta y el cumplimiento semanal. En el Perfil, recordatorios de agua, comidas sin anotar y fin del ayuno, con horas editables; avisan **con la app abierta** (sin servidor no se puede con la app cerrada: ver F-06). Todo se guarda en el teléfono (`tupper:ayuno:`, `tupper:recordatorios:`).
  - *Cargar con IA (IA-03):* en Registrar, la tarjeta "Cargar con IA" con Foto, Voz (hasta 30 s) y Escribir. La función `registrar-ia` usa proveedores gratis: Cloudflare Workers AI (Llama 4 Scout) para foto y texto, Groq Whisper para la voz, Gemini como opción (avisa en la Política de privacidad que Google puede usar lo recibido en el plan gratis). `src/lib/registroIA.js` cruza lo que entendió con los alimentos y recetas (con sinónimos) y calcula las cantidades; lo que no encuentra se lista para buscarlo a mano. Se avisa la primera vez, hay un tope diario por cuenta (`ai_usos`) y no se guarda la foto, el audio ni lo dicho. **Sin probar contra los servicios reales**: ver IA-05.
  - *No se hizo:* la sincronización con relojes (F-22) porque una PWA no puede leer Apple Salud ni Health Connect; las fotos de recetas siguen en pausa (la ruta local con GPU y `scripts/pedidos-fotos.mjs` está en F-04c).
  - *Pruebas:* `plan-inteligente.test.js` (7), `ayuno.test.js` (10), `registrar-ia.test.js` (7, la lógica de la función), `registro-ia.test.js` (14) y las de navegador 28 (plan, ayuno, recordatorios) y 29 (carga con IA con la función simulada).
- **F-04c · Pulido del 3D, íconos y fotos propias** (versión 1.26.0; no hay actualización de esquema ni datos nuevos: solo la app y dos scripts). Salió de probar la 1.25: el tupper y los platos eran "grumos separados", había íconos que no coincidían con el alimento, el selector de "Vence primero" se veía raro, el muñeco casi no cambiaba entre 72 y 109 kilos y la barra de peso se cortaba.
  - *Tupper del día:* ahora es una sola masa, como arena o agua que sube, con una capa por alimento en su color (por porción de calorías) y olas suaves en la superficie; ya no hay trocitos que se pasen del tupper (`tupper.js`: `nivelDelDia`, `capasDelDia`).
  - *Platos:* se arman con una composición por alimento (`emplatado/`: `componer.js` reparte, `piezas.js` modela: milanesa con empanado, bifes, pechuga, pescado, rodajas, hojas, arroz y fideos como "cama", salsas que se derraman, montoncitos que caen y se acomodan). Una milanesa se ve como milanesa. Los fondos (arroz, hojas) apoyan en el borde del recipiente y lo de encima, sobre ellos. Tostadas, pizzas, tartas y sopas siguen con el apilador de siempre (`comida.js`).
  - *Íconos:* `src/lib/emoji.js` elige el dibujo por el nombre del alimento o la receta (la milanesa de pollo ya no es un huevo). Reconoce las 1.603 recetas y 598 de los 617 alimentos; el resto cae al ícono por categoría.
  - *Despensa:* "Ordenar por" pasó de un menú del sistema a tres botones (Vence primero / A–Z / Se acaba) que se manejan también con las flechas.
  - *Cuerpo 3D:* la gordura ya no depende solo del %: se calcula con los kilos de grasa por metro cuadrado, y por encima de lo que deforma el modelo base la malla se infla (panza, costados, caderas, muslos, brazos y cuello; distinto en hombre y en mujer; `inflar` en `cuerpo.js`). A 72 kilos y a 109 kilos ya se distinguen y a 150 sigue creciendo. La barra de peso del perfil llega a 50 kilos más que hoy (y al menos 150); la silueta 2D también sigue creciendo (`medidas`).
  - *Fotos de recetas:* nunca hubo fotos generadas: `scripts/fotos-ia.mjs` no se corrió y por eso se veía solo el dibujo. Ahora el camino es: `node scripts/pedidos-fotos.mjs` (lista con el texto para pedirle cada imagen a una IA) → guardás cada imagen como `<slug>.jpg` → `node scripts/subir-fotos.mjs fotos/` (las achica y las sube a Supabase con la clave service_role). La app las muestra apenas se suben.
  - *Pruebas:* `emoji.test.js` (14), `emplatado.test.js` (35), `cuerpo.test.js` (4) y las de tupper en `diseno.test.js`.
  - *Pendiente de tu lado:* (1) generar las fotos con la IA que quieras y subirlas con los dos scripts; (2) mirar el 3D en un teléfono de verdad: lo probé en un navegador con GL por software, que es más lento y no tiene los mismos colores que una pantalla real.
- **F-04b · 3D profesional y sexta tanda de la base** (versión 1.25.0; no hay actualización de esquema nueva: solo datos. Hay que correr en Supabase `seed-8-alimentos.sql` y después `seed-8-recetas-1.sql` a `seed-8-recetas-8.sql`; todo aditivo, se puede correr de nuevo. La app nueva anda con o sin ellos). Salió de probar la 1.24: el muñeco era tosco, los platos no coincidían con el recipiente (un licuado salía en plato), el tupper era de placas de colores, y faltaban recetas.
  - *Cuerpo:* malla humana real de MakeHuman (CC0) en `public/modelos/cuerpo.bin`, con deformaciones de sexo, % de grasa y músculo; luz de estudio y sombras suaves (`estudio.js`); la vista de músculos pinta cada zona según lo entrenado. three.js a 0.186.1.
  - *Plato:* cada receta se sirve en su recipiente (playo, bowl, plato de sopa, vaso con líquido y espuma, taza con plato, sándwich sobre tabla, tostadas, pizza o tarta, frasco para postres y yogures) con trozos reales de los ingredientes apilados. `tipoDePlato` decide por el nombre; regresiones probadas (tomate y mate, chocolate y cola, dulce de leche, papaya...).
  - *Tupper del día:* tupper de vidrio que se llena con trocitos de lo que comiste (más calorías, más piezas), tapa que cierra al llegar al objetivo; si te pasás, asoman por arriba.
  - *Base:* +227 alimentos y +1.471 recetas (total unas 1.600 recetas y 617 alimentos), armadas por familias con azar de semilla fija, gramos por porción, calorías y proteína chequeadas y nombres únicos. Prueba `base-sexta.test.js` (datos + los SQL se cargan dos veces sin duplicar). El simulador de pruebas y `fotos-ia.mjs` usan la base completa.
  - *Lo que cambió en la app por la base grande:* la lista de recetas se muestra de a 60 con "Ver más recetas" (con 1.600 dibujar todas juntas era pesado en el teléfono); la lista de bebidas del Diario entra entera (63); y al escanear un producto ("Arroz Gallo Oro") se sigue proponiendo el genérico aunque haya más variedades de arroz entre los ingredientes (las variedades valen por el arroz común y lo ya cocinado no se propone para un producto crudo).
  - *Pruebas:* las 527 unitarias y las 29 de navegador pasan (3 saltadas como siempre: nombre de usuario y CORS necesitan el Supabase real). Las pruebas 03, 04, 09 y 27 ahora leen la cantidad de recetas del pie de la lista.
  - *Pendiente de tu lado:* (1) correr los SQL nuevos en el orden indicado antes o después de publicar; (2) `npm install` (three.js cambió de versión); (3) las fotos con IA: `scripts/fotos-ia.mjs` ahora tiene unos 2.200 elementos, así que va a llevar varios días con el cupo gratis de Cloudflare (corre de a tandas y sigue donde quedó; primero `--prueba --limite 10`); (4) probar el cuerpo, los platos y el tupper en teléfonos reales (Safari de iPhone incluido) y avisar qué sigue sintiéndose tosco; (5) mirar la lista de recetas con más de mil en un teléfono viejo: si se siente lenta, hay que paginarla o filtrarla antes.
- **F-04 · Vencimientos en la despensa y rediseño visual** (versión 1.24.0; hay que correr `actualizacion-19.sql` en Supabase **antes** de publicar; aditiva, no toca lo ya cargado, se puede correr de nuevo). Todo en la app más lo que sigue de tu lado en la lista de arriba.
  - *Vencimientos:* fecha opcional al cargar o comprar (queda la que vence antes), etiqueta en cada tarjeta (vencido, vence hoy o mañana, consumir pronto, bien), "Usá esto primero" con acceso a las recetas que lo usan, y las recetas que salvan algo que vence salen primero. La fecha se borra sola al agotarse y viaja con el hogar.
  - *Despensa nueva:* foto, barra de cuánto queda, "Se está acabando" para anotar en la lista, consejos de conservación y distribución por categoría.
  - *Fotos:* cada persona le pone foto a sus alimentos y recetas (Supabase Storage, achicada en el teléfono). Las de la base se generan con IA gratis: `scripts/fotos-ia.mjs` (Cloudflare Workers AI, corre de a tandas por la cuota diaria).
  - *Cuerpo:* silueta que cambia con el peso para elegir la meta (Perfil y alta), y mapa de músculos para marcar y ver lo entrenado de la semana.
  - *3D:* tupper del día en el Diario, cuerpo que gira y plato de cada receta (three.js, carga aparte y solo si se usa; se apaga en Perfil > Apariencia; sin WebGL se ve el dibujo 2D).
  - *Pendiente de tu lado:* correr `scripts/fotos-ia.mjs` (primero con `--prueba`), y probar los dibujos 3D y las fotos en teléfonos reales (Safari de iPhone incluido).
- **F-19 · Gasto calórico y ejercicio** (versión 1.23.0 y ajustes de la 1.23.1 y la 1.23.2; hay que correr en Supabase, en este orden y **antes** de publicar la app: `actualizacion-15.sql`, `actualizacion-16.sql`, `seed-6.sql`, `actualizacion-17.sql`, `seed-7.sql` y `actualizacion-18.sql`; todo aditivo, no toca nada de lo ya cargado, y se pueden correr de nuevo). Las cuatro fases juntas; todo es opcional y arranca apagado, así que el objetivo de calorías de cada cuenta existente no cambia solo.
  - *Fase 1, motor de gasto y perfil ampliado:* `src/lib/gasto.js` separa el gasto en metabolismo basal (Mifflin-St Jeor, o Katch-McArdle si hay % de grasa), movimiento del día a día (trabajo y pasos, sin contar el ejercicio para no sumarlo dos veces), efecto térmico de la comida (un 10 % fijo) y ejercicio. Siempre con rango y confianza, no con un número falso de exacto. Pantalla `/gasto` (Perfil > Gasto y ejercicio) con "cómo se calcula" parte por parte. Se prende con una hoja de consentimiento (datos de salud, Ley 25.326) y la base no deja prenderlo sin la fecha del consentimiento. Modo de objetivo fijo (el de siempre) o dinámico (gasto del día menos el déficit elegido, devolviendo una parte configurable de lo entrenado); botón "Usar este cálculo como mi objetivo".
  - *Fase 2, entrenamientos:* catálogo de 93 actividades con METs del Compendio (se pueden crear otras), calorías netas con el dato más preciso disponible (reloj, pulso con Keytel, distancia y ritmo con ACSM, o METs por intensidad), vista previa en vivo, editar y borrar. Pantalla `/ejercicio`. En el Diario, tarjeta "Gasto del día" con comido contra gastado y balance, y el objetivo del día sale del modo elegido. Funciona sin conexión (cola de cambios y copia del teléfono).
  - *Fase 3, gimnasio:* catálogo de 150 ejercicios por grupo muscular y equipo (se pueden crear otros), rutinas, sesión con series (repeticiones, kilos, esfuerzo, calentamiento), referencia de la última vez, temporizador de descanso, récords (peso, repeticiones, 1RM de Epley y volumen), borrador de la sesión en curso (se retoma si se cerró la app), series por músculo de la semana y gráfico de progreso por ejercicio.
  - *Fase 4, gasto real con tus datos:* con 4 semanas de comidas y pesajes (al menos 21 días con la comida cargada y 4 pesajes que abarquen 14 días) se despeja cuánto gastás realmente (comido menos cambio de peso a 7.700 kcal/kg), con rango y confianza, y avisa cuánto falta si no alcanza. El ajuste nunca se aplica solo: se confirma y se puede sacar para volver a la fórmula general.
  - *Alrededor:* el resumen semanal y el registrar usan el objetivo de cada día; Perfil muestra los accesos solo si está activo; textos legales (privacidad y términos: son estimaciones, no se comparten con el hogar ni van al análisis con IA, salvo el objetivo de calorías de cada día); la descarga de datos incluye el ejercicio; borrar la cuenta lo borra todo. Eventos de medición: solo `gasto_activado` y `gasto_desactivado` (sin datos de salud).
  - *Pruebas:* unitarias nuevas de gasto, ejercicio, gasto real, gimnasio y borrador (unas 140); de navegador `24-gasto-ejercicio`, `25-gimnasio` y `26-gasto-real`; el servidor de mentira simula las tablas, los catálogos y las dos funciones nuevas.
  - *Revisión de dos nutricionistas (1.23.1):* validaron las ecuaciones (Mifflin-St Jeor, Katch-McArdle, Keytel, ACSM, TEF, Epley) y marcaron como criterio propio, sin validar, los porcentajes de movimiento según el trabajo, las calorías por paso, el recorte de 22 %, los pisos y los márgenes. Cambios hechos: (1) las calorías del reloj se cargan como **activas o totales** (`workouts.watch_activas`, `actualizacion-18.sql`; las activas valen tal cual, a las totales se les descuenta el reposo; lo anterior quedó como totales); (2) el gasto real pide **21 días** con comida y **4 pesajes en 14 días** (antes 14 y 3 en 10), supone un **10 %** de error al anotar la comida y el margen con datos propios pasa de ±8 % a ±10 %, dicho como orientativo; (3) el piso de calorías **nunca deja el objetivo por encima del mantenimiento** cuando hay recorte (si el gasto ya es menor que el piso no se propone déficit y se avisa); (4) el recorte automático según el peso meta es **gradual** (completo con 8 % o más del peso por bajar, nada con menos de 1,5 %) en vez de un salto a 1 kg; (5) más prudencia en los textos: % de grasa solo si es confiable, aviso de menor precisión fuera de 19 a 78 años, advertencias en el gasto real; (6) pruebas del signo del cambio de peso (bajar y subir). Se descartó la proteína configurable (confunde a quien no sabe de nutrición).
  - *Revisión de METs, análisis y limpieza (1.23.2):* (1) los **METs de las 93 actividades se revisaron contra el Compendio 2024** (pacompendium.com, libre uso comercial): se corrigieron 42 (los más movidos: step, HIIT, trote y correr, escaleras, tenis, equitación, esquí; ver `scripts/ejercicio-data.mjs`) y los que el Compendio no tiene (pádel, pickleball, funcional, CrossFit, parkour, hip hop, body pump, hockey sobre patines) quedan marcados como aproximados; para que las cuentas los tengan hay que volver a ejecutar `supabase/seed-6.sql` (pone al día el catálogo y no toca los entrenamientos ya anotados); (2) el **análisis semanal con IA usa el objetivo de calorías de cada día** (con el dinámico cambia según lo entrenado): la app manda `objetivos` (`src/lib/gastodia.js`) y la función (`leerObjetivos` en `logica.ts`) lo valida y descarta todo lo demás; no se manda ejercicio ni gasto, y el texto legal lo aclara; (3) se borró código sin uso (`tefDeMacros`, `ORDEN_DE_METODOS`, `nombresDias`, `esBebida`) y se unificó el cálculo del día en `src/lib/gastodia.js`.
  - *A tener en cuenta:* son estimaciones (el reloj también se equivoca entre 20 y 40 %); el pulso en reposo todavía no se usa (queda en F-19b). El respaldo de la base (S-04) vive en otro repositorio y hay que revisar que incluya las tablas nuevas.

- **F-01c · Nombre del producto desde Precios Claros** (versión 1.22.2; no hay SQL nuevo). Salió de medir con datos reales: de 32 productos de góndola de Córdoba (atún, miel, puré de tomate, yerba, fideos, galletitas, aceite...) Open Food Facts tiene **7 (22 %)** y con calorías **3 (9 %)**; los eventos de la app daban lo mismo (1 de 11 búsquedas con datos completos).
  - *Qué se probó:* con un script en la PC (el entorno de trabajo no llega a esos servicios): UPCitemdb no conoce los códigos argentinos (0 resultados), MercadoLibre pide autenticación (403), USDA es de EE. UU. **Precios Claros** (sistema de precios del Estado) responde con CORS abierto, busca por código exacto y trae nombre, marca y presentación de casi todo lo que se vende; **no trae calorías**.
  - *Cómo funciona:* si Open Food Facts no tiene el código, se consulta Precios Claros (`src/lib/preciosclaros.js`: `/sucursales` por zona y `/producto?id_producto=<código>&array_sucursales=...`; Córdoba, Buenos Aires y Rosario, de a una zona si no aparece). Con el nombre ("Atun al Natural La Campagnola 170 Gr") el panel dice cómo se llama y propone el alimento parecido de la base ("Atún al natural") con sus valores como punto de partida, marcados como aproximados y sin compartirse con el catálogo. Nombres más largos que el máximo se cortan en una palabra entera.
  - *Medición:* en `codigo_busqueda` aparece un resultado nuevo, `nombre` (Open Food Facts no lo tenía pero Precios Claros sí).
  - *Servicios externos:* se sumó `https://d3e6htiiul5ek9.cloudfront.net` al `connect-src` de `vercel.json` y el texto de privacidad lo dice (se manda solo el número del código). **Hay que desplegar `vercel.json` junto con la app, si no el navegador bloquea el pedido** (sin nombre, todo sigue como antes).
  - *Riesgo:* no es una API oficial para terceros: puede cambiar o cortarse sin aviso. Está hecho para fallar en silencio (sin respuesta es como si no supiera el nombre). Plan B si se corta: los datos abiertos de precios del Estado (SEPA) cargados a una tabla propia, desde una script en la PC.
  - *Pruebas:* 7 unitarias nuevas (`preciosclaros.test.js`: zonas, caché, fallas, presentación, nombre largo) y dos pasos nuevos en `23-escaner-dificil` (Precios Claros de mentira: nombre + atún de la base + guardar; y un código que no conoce nadie).

- **F-01b · Escáner y productos sin datos, más robustos** (versión 1.22.1; no cambia la base, no hay SQL nuevo). Salió de probar con productos cotidianos argentinos (puré de tomate, atún, miel...): Open Food Facts no los tenía o los tenía sin calorías, y el lector no tomaba códigos chicos ni de colores.
  - *Lector (`src/lib/lectura.js`):* cada imagen se prueba de varias maneras y en cada una normal e **invertida** (blanco sobre oscuro): el cuadro entero, el centro recortado y agrandado ×1,3 a ×2 y ×2 a ×4 (un código chico gana barras más anchas). En Android se prueba además con el lector del navegador, sobre las mismas imágenes. La lectura que funciona se repite; para aceptar un código tiene que salir dos veces en 3 segundos (antes, dos veces seguidas). Se pide video de 1920×1080 (antes 1280×720) y foco continuo donde el teléfono lo permite.
  - *Controles:* **zoom** (deslizador, solo donde el teléfono lo expone: Android sí, iPhone casi nunca), **linterna** (idem) y **"Sacarle una foto"**: abre la cámara del teléfono, que enfoca de cerca y tiene mucha más definición que el video, y la foto se lee en el teléfono con 5 pasadas (no se guarda ni se envía; el texto legal lo dice). Es la salida para códigos muy chicos y para el iPhone.
  - *Open Food Facts, más productos aprovechables:* ahora se leen las calorías también cuando vienen por porción (se pasan a 100 g con el tamaño de la porción), solo en kJ, o sueltas con `nutrition_data_per`; si no hay calorías pero sí proteínas, carbohidratos y grasas, se **calculan** (4/4/9) y se avisa; el nombre cae al genérico si no hay en español. Un producto vacío (sin nombre ni datos) cuenta como "no lo tienen". Las calculadas no se comparten con el catálogo.
  - *Producto sin datos en ningún lado:* en vez de cargar todo a mano, "Partir de un alimento parecido" busca en la base (atún, miel, puré de tomate...), copia sus valores cada 100 g y avisa que son aproximados. Mientras no se corrijan **no se ofrecen al catálogo** (si no, dos personas con el mismo aproximado lo publicarían como confirmado). Si el alimento parecido es un ingrediente de recetas, el producto queda como "cuenta como" ese.
  - *Medición:* nuevos eventos en `eventos`: `escaner_lectura` (`via`: camara/foto/foto_fallida/escrito, y `manera` 0-2 de la cámara) y `codigo_aproximado`. Con `codigo_busqueda` (ya existía) sirven para ver cuántos productos se encuentran: `select detalle->>'resultado' as resultado, count(*) from eventos where nombre = 'codigo_busqueda' group by 1 order by 2 desc;`
  - *Pruebas:* 5 unitarias nuevas (valores por porción, sueltos, kJ, calculadas, nombre genérico) y una de navegador nueva (`23-escaner-dificil`: código blanco sobre negro, de colores, muy chico y borroso, foto grande, foto sin código, zoom/linterna, calculadas, por porción y alimento parecido). Se comprobó que el lector anterior falla en el invertido y en el muy chico. La cámara de mentira ahora es un módulo compartido (`camara-falsa.js`) y la 22 y la 23 usan los mismos atajos (`escaner-apoyo.js`).
  - *Límites:* no se pudo probar con una cámara real ni consultar otras fuentes de productos desde el entorno de trabajo. Un código de menos de ~1,3 píxeles por barra fina en el video (muy lejos o muy borroso) sigue sin leerse: ahí sirven el zoom, acercarse o la foto. **No se sumó otra base de calorías** porque no hay una gratuita con productos argentinos; el nombre sí se resuelve en F-01c y las calorías reales crecen con el catálogo compartido (F-02).

- **F-01 y F-02 · Escanear el código de barras y catálogo compartido** (versión 1.22.0; hay que correr `supabase/actualizacion-14.sql` en Supabase **antes** de publicar la app, ver abajo).
  - *Escáner (F-01):* en "Agregar" (despensa, compras, registrar, recetas) hay un botón de código de barras al lado del buscador. Abre la cámara y lee EAN-13, EAN-8 y UPC-A; descarta lecturas con el dígito verificador mal y pide dos lecturas iguales seguidas. En Android usa el lector del navegador; donde no existe (iPhone, Firefox) baja `@zxing/library` solo al abrir el escáner (no pesa en el resto de la app). Sin cámara o sin permiso, avisa y deja escribir el código a mano (también acepta espacios y guiones, y rechaza uno mal escrito con un mensaje claro). La cámara se habilitó en `vercel.json` (`camera=(self)`).
  - *Qué pasa con el código:* primero se busca entre los alimentos que ya cargaste (si está, abre ese sin preguntar), después en el catálogo compartido y por último en Open Food Facts por código (`/api/v2/product/<código>`, con reintentos; si no responde dice que no pudo consultar, no "no existe"). Si no está en ningún lado, o está sin calorías, ofrece cargarlo a mano con el código y el nombre ya puestos. Los alimentos guardan su código (`foods.codigo`) para encontrarlos la próxima vez, también los que vienen de la búsqueda por nombre.
  - *Catálogo compartido (F-02):* cada producto que se guarda (de Open Food Facts, escaneado o a mano, en g o ml) aporta a la base solo sus datos: código, nombre, valores cada 100 g/ml y categoría. Un aporte es privado; recién cuando **dos personas distintas** cargaron valores que coinciden (calorías con 10 % de margen, macros con 2 o 3 g) el producto pasa a `catalogo` y lo ven todos (por código y, mientras se escribe, por nombre, en "Cargados por otras personas"). Un dato inventado por una sola cuenta no le llega a nadie; lo publicado no cambia por lo que se cargue después, y cada persona que coincide suma una confirmación (una sola vez). Las tablas no se leen ni escriben directo; todo va por tres funciones. Topes: 100 productos nuevos por día y 3.000 por persona. En la carga a mano hay una casilla para no compartir. Si alguien borra la cuenta se van sus aportes; lo ya publicado queda.
  - *Texto legal:* la Política de privacidad ahora explica la cámara (no se graba ni se manda nada, solo el número del código a Open Food Facts) y el catálogo compartido.
  - *Pruebas:* 14 de la base de verdad (`catalogo.test.js`), 5 del código de barras, 4 de la búsqueda por código y una de navegador (`22-escaner-catalogo`, independiente): con una cámara de mentira que dibuja un código real prueba el lector de la librería (Ana) y el nativo (Beto), cómo se publica el producto al coincidir dos cuentas, que una tercera (Caro, sin permiso de cámara) lo encuentra por nombre y por código con Open Food Facts apagado, y que nadie puede leer las tablas del catálogo.
  - *Cómo se aplica:* en el SQL Editor de Supabase, pegar y correr `supabase/actualizacion-14.sql` (una sola vez; no toca nada de lo ya cargado) y después publicar la app. Para revisar o sacar algo del catálogo, las consultas están al principio del archivo.
  - *Límites a tener en cuenta:* el lector de iPhone se probó con una imagen de un código real en Chromium, no con un iPhone de verdad (queda dentro de T-03, pruebas en Safari). Con muchas cuentas falsas que se pongan de acuerdo se podría publicar un dato falso; el captcha y la confirmación de mail de la cuenta son la barrera, y el catálogo se puede revisar y limpiar a mano. Los productos medidos en unidades no se comparten todavía.

- **F-12 · Base propia de alimentos más grande** (versión 1.21.0; hay que correr `supabase/seed-5.sql` en Supabase, ver abajo). Quinta tanda de la base común: **116 alimentos y 44 recetas** más (ahora 390 alimentos y 132 recetas).
  - *Alimentos:* cortes de vaca y cerdo, pescados y mariscos, quesos, kéfir, verduras y frutas, legumbres y cereales ya cocidos (arroz, fideos, quinoa, porotos hervidos), semillas, panadería, snacks y frutas secas, despensa, salsas, enlatados, congelados, comidas hechas y 5 bebidas. Los valores son por 100 g/ml; cada uno pasa una prueba de que las calorías cierran con los macros.
  - *Recetas:* pescados, cerdo y carne, pollo, pastas y cereales, huevos y verduras, desayunos y meriendas, todas con ingredientes que ya existen en la base y con calorías dentro de un rango razonable por comida.
  - *Búsqueda:* nuevos sinónimos ("bacon", "rabas", "porotos cocidos", "fideos cocidos"…), 8 familias nuevas (ej. el peceto y el lomo valen por bife de nalga en las recetas) y medidas rápidas (cucharada, puñado) para los productos que corresponden. Al buscar, lo que empieza con lo escrito va primero ("huevo" muestra "Huevo" antes que "Clara de huevo"); la lógica salió del componente a `src/lib/buscar.js`.
  - *Categorías:* no se sumó ninguna a propósito; todo entra en las que ya existen, para no mover lo que ya eligió cada usuario.
  - *Cuidado con lo existente:* es solo aditivo. No toca alimentos propios, stock, registros ni nada de cada usuario. Una prueba confirma que las sugerencias de "cuenta como" de ~39 productos de siempre no cambian.
  - *Cómo se aplica:* en el SQL editor de Supabase, pegar y correr `supabase/seed-5.sql` (se puede correr más de una vez). Puede correrse antes o después de publicar la app.
  - *Cómo seguir:* es un trabajo continuo. Se decide qué sumar mirando qué alimentos propios repiten varios usuarios (consulta de la revisión mensual) y qué productos no encuentra la gente; se agrega en `scripts/seed-data.mjs`, se corre `npm run seed` y se corre el SQL nuevo. Queda como nota de P3 abajo.
  - Se actualizaron los conteos de las pruebas (390 alimentos, 132 recetas, 579 ingredientes) y se arreglaron pruebas de navegador que suponían qué alimento o receta aparece primero.

- **T-06 y S-05 · Avisos automáticos** (no cambia la app ni la base, no hay versión nueva). Dos tareas programadas que corren solas en la nube, de solo lectura, y mandan notificación al teléfono:
  - *Aviso diario de errores* (todos los días 8:47, hora de Argentina): mira `eventos` de las últimas 24 horas con `tipo = 'error'`, agrupa por nombre, versión y pantalla. Si no hay errores no avisa nada; si hay, manda un resumen (total, cuántos usuarios y los más frecuentes).
  - *Revisión mensual* (día 1 de cada mes, 10:12): avisos de seguridad y de rendimiento de Supabase (ERROR y WARN), tamaño de la base, filas de `eventos`, cantidad de usuarios, que las dos funciones estén activas y errores 4xx/5xx de las funciones en el último mes.
  - Quedan fuera, porque desde la nube no se pueden mirar: `npm audit` (correrlo en la carpeta del repo), el captcha de Turnstile (probar un registro nuevo) y los límites del plan de Supabase. La revisión mensual te lo recuerda.
  - Se pausan o cambian desde la lista de tareas programadas de la app de escritorio. Probado: la consulta del aviso diario corre bien contra la base real (hoy no hay errores en las últimas 24 horas).

- **T-02 · Pruebas automáticas en cada push** (no cambia la app, no hay versión nueva). Nuevo `.github/workflows/pruebas.yml`: en cada push GitHub corre el lint, el formato, las pruebas de unidad y de la base, y el build; al subir a `main` (o a mano desde *Actions*) corre además las de navegador, con Deno para las funciones. Si falla, GitHub avisa por mail al que hizo el push. No usa claves ni el Supabase real; si se sube otra cosa a la misma rama mientras corre, cancela la anterior.
  - Probado acá en una copia limpia del repo, sin `node_modules` ni `.env` (como lo ve GitHub): `npm ci`, lint, formato, 238 pruebas de unidad, build y las 26 de navegador, todo en verde. Lo que no se pudo probar acá es GitHub mismo: la primera corrida se ve en la pestaña *Actions* del repo después del push.
  - Primera corrida en GitHub (17/10/2026): verde, 6 min 25 s en total. Avisaba dos cosas, ya arregladas: las acciones corrían con Node 20 (en desuso; se pasaron a `checkout@v5`, `setup-node@v5` y `upload-artifact@v5`) y `ubuntu-latest` pasaba a Ubuntu 26 el 19/10/2026 (se fijó `ubuntu-24.04` para que no rompa solo la instalación de Chromium). Cuando se quiera pasar a una Ubuntu nueva, se cambia a propósito y se mira la corrida.
  - Costo: gratis con el repo público; con el privado (ver S-04) hay unos 2.000 minutos gratis por mes y una corrida completa gasta unos 15, así que alcanza para unos 130 pushes a `main`; los demás pushes gastan unos 3.
- **S-02 · CORS de las funciones** (solo las funciones de Supabase; la app no cambia, no hay versión nueva). Las dos funciones (`analizar-semana`, versión 7, y `entrar`, versión 2) ya están publicadas en Supabase desde el 17/10/2026. Verificado desde un navegador: desde `tupperapp.vercel.app` contestan normal y desde otra página (`example.com`) el navegador las bloquea.
  - Las dos contestan solo a pedidos que vienen de `https://tupperapp.vercel.app`: a esa página le devuelven el permiso de CORS con su nombre (antes `*`) y a cualquier otra le contestan 403 sin procesar nada. Un pedido sin `Origin` (curl, otro servidor) sigue como siempre.
  - Para sumar otro dominio (o probar desde `localhost` contra el Supabase real) se carga el secreto `ORIGENES_PERMITIDOS` en Supabase, sin volver a publicar. Detalle en `supabase/functions/LEEME.md`.
  - Ojo: las previsualizaciones de Vercel y `npm run dev` contra el Supabase real dejan de andar hasta sumarlas en ese secreto.
  - Pruebas nuevas: `cors` (unidad, 10 casos, las dos funciones) y la de navegador `21-cors-funciones` (con las funciones de verdad en Deno: la app sí, otra página no, y sin `Origin` pasa).
- **1.20.0** (solo la app, sin cambios en Supabase):
  - F-05: en Lista de compras, "Compartir" arma el texto de lo que hay para comprar (lo que falta para el plan y lo anotado a mano), agrupado por categoría y con el formato de WhatsApp (negrita en el título y las categorías), por ejemplo `• Arroz: 500 g`. En el teléfono abre el menú de compartir (WhatsApp, Notas, mail, etc.); donde no existe (la compu) abre WhatsApp con el texto ya escrito. Al lado, un botón para copiar la lista. En un hogar el título lleva el nombre del hogar. Sin nada para comprar los botones no aparecen.
  - Pruebas nuevas: `compartir` (unidad, 5 casos) y la de navegador `20-compartir-lista` (menú del teléfono, cancelar, WhatsApp directo, copiar y pantallas angostas). Se sumó el ícono `share` a los íconos de la app.
- **17/10/2026, por tu lado:** borradas las funciones de plantilla `super-service` y `super-task` de Supabase y rotada la Secret Key de Turnstile.
- **1.19.0** (solo la app, sin cambios en Supabase):
  - F-07: selector de porciones en el detalle de la receta (− y +, de a 1 y por debajo de 1 a la mitad, de 0,25 a 50). Recalcula los ingredientes (las unidades quedan en fracciones: 0,5 huevo), los tildes de lo que alcanza con la despensa y lo que "Anotar lo que falta en la lista" agrega, y "Cocinar" arranca con ese número. Arranca en lo que rinde la receta y vuelve ahí al abrir otra. Es solo una vista: no cambia la receta guardada ni nada de lo cargado.
  - Cambio chico: antes el tilde decía si alcanzaba para 1 porción; ahora dice si alcanza para las porciones que se están mirando (al entrar, las de la receta).
  - Qué no se hizo: el plan guarda una comida por casilla (siempre 1 porción), así que no hay "porciones del plan" para ajustar. Cocinar para varias personas en el plan necesitaría una columna nueva en `plan`: queda anotado como idea, no se hizo.
  - Pruebas nuevas: `porciones` (unidad, 6 casos) y la de navegador `19-porciones-receta`.
- **1.18.0** (solo la app, sin cambios en Supabase):
  - D-05: recorrido inicial. Al crear la cuenta, la persona nueva ve una guía de 34 pasos que oscurece la pantalla y hace brillar lo que hay que tocar: diario, cómo registrar una comida, cómo crear un alimento, recetas (cómo crear una), despensa, compras, plan, objetivos, peso, hogar y atajos. Algunos pasos se avanzan tocando de verdad el botón resaltado.
  - No crea ningún dato. Se puede saltar (con confirmación) o volver atrás; al terminar o saltar se borra la marca del teléfono y no vuelve a aparecer. Las cuentas que ya existían no lo ven nunca.
  - Pruebas nuevas: `recorrido` (unidad, 12 casos) y la de navegador `18-recorrido` (celular y compu).
- **1.17.0** (necesita `supabase/actualizacion-13.sql` en Supabase **antes** de publicar la app; no modifica, mueve ni borra nada de lo que ya cargó cada usuario):
  - F-03: hogares. Desde Perfil se arma un hogar (con nombre) o se entra a uno con un código de 6 caracteres. Hasta 6 personas comparten la **despensa, la lista de compras, las comidas preparadas y las compras**; el diario, el plan, las medidas y el perfil siguen siendo de cada uno. Los alimentos y recetas propios los ven todas las personas del hogar (solo los edita quien los creó).
  - Quien armó el hogar ve el código (lo puede copiar, cambiar —el anterior deja de servir— o apagar), puede cambiarle el nombre y sacar a otras personas; cualquiera puede salir. Si se va quien lo armó, pasa a manejarlo la persona que lleva más tiempo; si se va la última, el hogar se borra.
  - Al unirse, lo que la persona tenía se **suma** a la despensa del hogar (la lista queda con la cantidad mayor y se copian las compras de los últimos 90 días); lo suyo de antes no se toca y queda guardado. Al salir (o si la sacan) se lleva una **copia** de lo del hogar y antes se guarda un respaldo de lo que tenía (los últimos 5).
  - Las compras del hogar dicen quién las hizo ("compró Ana"); en Despensa aparece "Despensa compartida · nombre". Si te sacan del hogar, al abrir la app avisa. Armar un hogar, unirse y salir necesitan conexión y que no haya cambios sin enviar.
  - Seguridad: las tablas del hogar no se pueden tocar directo (solo con funciones de la base); 5 códigos equivocados por hora y hay que esperar; el código lo ve solo quien armó el hogar. Las cuatro tablas compartidas guardan en `user_id` a la persona o al hogar (`despensa_de()`); quien no está en un hogar se comporta exactamente como antes. La Política de privacidad ahora explica qué se comparte.
  - Pruebas nuevas: `hogares` (la base de verdad, 22 casos), un caso más en `sin-conexion` (la copia del teléfono cuenta igual que la base dentro de un hogar) y la de navegador `17-hogar` (dos personas).
  - Limitación conocida: si alguien sale de un hogar y vuelve a entrar al mismo, se le suma otra vez su copia personal y las cantidades se duplican (se corrigen a mano en la despensa).
  - Una app anterior a la 1.17 usada por alguien que ya está en un hogar ve la despensa vacía (no se pierde nada; se arregla actualizando).
- **1.16.0** (solo la app, sin cambios en Supabase):
  - D-01: las hojas que suben desde abajo se cierran con Escape, el foco no se sale de la hoja abierta (Tab y Mayús+Tab dan la vuelta adentro), al abrirse el foco entra a la hoja y al cerrarse vuelve al botón que la abrió. Si hay una pregunta de confirmación encima, Escape es de ella.
  - D-02: los botones de solo icono (cruz, tachito, quitar, más/menos, editar, corazón, "afuera") tienen un área de toque de al menos 44 px sin cambiar cómo se ven ni el diseño.
- **S-01 · Copias de seguridad propias** (14/10/2026): repo privado `tupper-respaldos` en GitHub con copia diaria cifrada (3:17 AR, guardada 90 días) y scripts para abrirla y restaurarla. Respaldo verificado el 14/10 (4 cuentas, 174 registros, 309 alimentos, 91 recetas, 42 del plan). Contraseña de la base cambiada, `RESPALDO_CLAVE` guardada aparte y prueba de restauración hecha.
- **Verificado el 13/10/2026:** el análisis con IA anda (V-02, función `analizar-semana` versión 4) y `actualizacion-9.sql` está aplicada en Supabase.
- **L-02 · Revisión de los textos legales** (15/10/2026): hecha por tu lado; Términos y Política quedan como están.
- **1.15.0** (`actualizacion-12.sql` y la función `entrar` ya están en Supabase desde el 16/10/2026, esta sin verificación de JWT; falta publicar la app en Vercel):
  - F-17: nombre de usuario. Se elige al crear la cuenta (campo obligatorio en "Armemos tu perfil", con aviso de si está libre mientras se escribe) y se cambia desde Perfil > Editar. Se muestra como `@usuario` en el Perfil.
  - Iniciar sesión: el campo ahora es "Email o usuario" y sirven los dos (si lleva "@" es un email). Con el usuario, la contraseña la comprueba la función `entrar` en el servidor: busca el email, inicia la sesión y devuelve solo la sesión. Si el usuario no existe contesta lo mismo que con una contraseña equivocada, y lleva el mismo captcha que el email. Recuperar la contraseña sigue pidiendo el email.
  - Cuentas que ya existían: la próxima vez que entran se les pide elegir un usuario. Pueden tocar "Ahora no" (vuelve a aparecer cuando abran la app de nuevo); no pierden nada y siguen entrando con el email.
  - Seguridad: solo letras sin tilde, números, punto, guion y guion bajo (de 3 a 20); no puede empezar ni terminar con símbolo, ni tener dos símbolos seguidos, ni ser solo números, ni parecer una dirección de internet. Se bloquean palabras reservadas (admin, root, tupper, soporte, postgres, null...) y los que llevan adentro tupper, admin, soporte, support, staff, moderador o supabase. Se repite el chequeo en la base (`actualizacion-12.sql`), así que no se puede saltear hablándole directo a Supabase. No se repite sin importar mayúsculas y se guarda en minúsculas.
  - Si se agrega una palabra reservada más adelante, nadie pierde el usuario que ya tiene (la base solo juzga un nombre cuando cambia).
  - La Política de privacidad ahora nombra el usuario entre los datos del perfil. Pruebas nuevas: `nombre-de-usuario` (reglas en la app y la base, y que las dos listas sean iguales), `entrar` y la de navegador `16-nombre-de-usuario`. Ahora las pruebas corren también la función `entrar` de verdad (con Deno).
  - La función usa las claves de siempre de Supabase y, si las apagan a fin de 2026, las nuevas. Las dos funciones de plantilla `super-service` y `super-task` que quedaron en el panel ya se borraron (17/10/2026).
  - Límite a vigilar: Supabase limita los inicios de sesión por IP y con la función todos salen desde el servidor; con pocos usuarios no se nota (detalle en `supabase/functions/LEEME.md`).
- **1.14.0** (no hay que correr nada en Supabase):
  - F-16: el "Líquido" del día ya no suma las bebidas azucaradas. Una bebida con 4 g o más de hidratos cada 100 ml (gaseosa común, jugo, energizante, chocolatada) sigue sumando sus calorías al día pero no cuenta para la meta de líquido. Cuentan el agua, el mate, las infusiones, la soda, las bebidas sin azúcar y la leche. El alcohol sigue sin contar.
  - Es automático: sirve también para los alimentos propios y los que vienen de Open Food, sin marcar nada ni tocar la base. El azúcar que se le pone a una infusión se deja como está (el mate o el café siguen contando completos).
  - Cambió el texto de ayuda del objetivo de líquido en el Perfil. Prueba nueva: `liquido`. La de navegador 03 espera 0,25 L (antes 0,5 L, porque la gaseosa del día ya no suma).
- **1.13.0** (hay que correr `actualizacion-11.sql`):
  - F-15: en Plan, al tocar una comida se elige una receta o un **alimento suelto** con su cantidad (por ejemplo, mate solo en la merienda), en cualquiera de las cuatro comidas y aunque el día no tenga nada planeado. Usa el mismo buscador que el diario, con las medidas de siempre (un mate, un termo, una taza...).
  - Cuenta en todo el plan: las calorías del día, el "Comí esto" del diario (registra el alimento con su cantidad y descuenta de la despensa lo que haya), "Para llevar" y lo que falta para la lista de compras.
  - Un alimento suelto solo cuenta como "falta comprar" si lo llevás en la despensa (aunque esté agotado): el agua, el mate o una fruta que nunca anotaste no llenan la lista.
  - "Armar con lo que tengo" lo respeta y no lo pisa. "Rehacer la semana" sí lo borra, como a las recetas (ya lo avisa la confirmación).
  - Cada comida del plan tiene una sola cosa: receta o alimento. Si el alimento propio se borra, se va también del plan.
  - La base: `actualizacion-11.sql` agrega `food_id` y `qty` a la tabla `plan`, con reglas para que sean coherentes. No toca lo que ya estaba.
  - Pruebas nuevas: `plan-alimentos` (la base), `plan-suelto` (calorías, faltantes y armar) y la de navegador `15-plan-alimento-suelto`.
- **1.12.0** (hay que correr `actualizacion-10.sql`):
  - L-01: la app es solo para mayores de 18 años. La fecha de nacimiento no deja poner menos (aviso "Tupper es solo para mayores de 18 años."), debajo de "Crear cuenta" dice que se confirma tener 18 o más, y los Términos y la Política de privacidad dicen 18 sin la excepción del adulto responsable.
  - La base lo cuida también (`actualizacion-10.sql`): no deja guardar una fecha de menos de 18, pero no toca ninguna cuenta que ya exista; si alguna tuviera menos de 18, sigue andando y puede editar el resto del perfil.
  - Pruebas nuevas: `mayores-de-edad` (la base) y `objetivo` (sin recorte de calorías para una cuenta anterior de menor); las de navegador `01` y `04` ahora comprueban que un menor no puede crear el perfil.
  - Queda para L-02: que un abogado revise la redacción de "Menores" y "Tu cuenta".
- **1.11.0**:
  - D-03: diseño para computadora desde 1024 px de ancho. Barra de navegación al costado (con Registrar, todas las pantallas y el perfil), varias columnas en diario, despensa, recetas, plan, compras, resumen, perfil, receta y registrar, y las ventanas (hojas) como recuadro centrado en vez de subir desde abajo.
  - Hasta 1023 px (celulares y tablets) el diseño es el de siempre: comparado píxel a píxel con la versión anterior a 390 y 412 px, sin diferencias.
  - Pantallas de acceso y textos legales: ya eran una columna centrada y quedan así.
  - Prueba nueva de navegador (`14-escritorio`): barra, columnas, ventanas, cambio al achicar la ventana y que nada se salga de 360 a 2560 px.
- **1.10.0** (`actualizacion-9.sql` aplicada):
  - F-14: cada registro del diario muestra su cantidad y se puede cambiar; calorías y macros se recalculan.
  - La despensa se ajusta sola al cambiar la cantidad o borrar un registro (con cartel de confirmación cuando la toca, y aviso si no alcanza o el producto ya no está).
  - Anda sin conexión. Los registros anteriores solo corrigen el diario.
  - "Repetir lo de ayer" ya traía la cantidad exacta.
- **1.9.1**:
  - Datos de quien responde por la app en `src/lib/marca.js`.
  - Verificado: sin conexión en iPhone (V-01).
- **1.9.0**:
  - Captcha (Cloudflare Turnstile).
  - Contraseñas filtradas revisadas desde la app.
  - El registro ya no dice si un email tiene cuenta.
  - Topes en la base: filas por usuario, largo de textos, números y peso de cada fila (`actualizacion-8.sql`).
  - Función de IA con tope por cuenta, publicada como versión 4.
- **1.8.0**:
  - Modo sin conexión.
  - Estado de la app partido por tema.
  - Lint y formato.
  - `react-router-dom` actualizado.
- **1.7.0**:
  - Pruebas automáticas.
  - Operaciones en un solo paso con clave.
  - Pantalla de error.
  - Registro de errores.
  - Aviso de versión nueva.
