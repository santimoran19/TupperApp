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
1. L-03 · Registro de la base de datos
2. S-04 · Repo privado (al terminar)

**Después (P2)**
3. F-19 · Gasto calórico y ejercicio (por fases; empezar por la 1, la 2 y la 4)
4. F-18 · Registrarse e iniciar sesión con Google
5. F-01 · Escanear el código de barras (va junto con F-02)
6. F-02 · Catálogo compartido de productos
7. F-12 · Base propia de alimentos más grande
8. IA-01 · Chat con IA (va junto con IA-02)
9. IA-02 · Proveedor de respaldo
10. F-04 · Vencimientos en la despensa
11. D-07 · Revisión completa de accesibilidad
12. L-04 · Consentimiento al registrarse
13. C-05 · Opiniones desde la app
14. T-03 · Pruebas en Safari
15. T-04 · Base de pruebas aparte
16. T-01 · Actualizar las herramientas
17. F-06 · Recordatorios

**Cuando haya tiempo (P3)**
18. F-08 · Copiar un día entero
19. D-06 · Deshacer en más lugares
20. D-04 · Esqueletos de carga
21. F-10 · Peso: gráfico y fecha estimada
22. F-11 · Exportar el registro a planilla
23. F-09 · Combos frecuentes
24. F-13 · Categorías editables por el usuario
25. D-08 · Revisión de los textos
26. IA-04 · Cargar una receta desde un texto
27. IA-03 · Foto de un plato
28. C-06 · Métricas de uso
29. T-05 · Partir `sincronizacion.js`
30. T-07 · Mandar lo cargado sin conexión con la app cerrada
31. S-06 · Verificación en dos pasos
32. S-03 · Contraseñas filtradas también del lado de Supabase

**Al final, cuando la app esté completa (requieren pagar algo: dominio, planes de pago)**
33. C-03 · Mails propios (SMTP) (necesita el dominio de C-02)
34. C-02 · Dominio propio y página de presentación (va junto con C-03)
35. C-01 · Planes y cobro (para empezar a cobrar)
36. F-18 · Registrarse e iniciar sesión con Google (el nombre de usuario, F-17, ya está hecho)
37. C-04 · Play Store (cuesta la cuenta de desarrollador)

---
## Por tema

## 0. Para verificar ahora

Nada por ahora.

## 1. Funciones

- [ ] **F-01 · Escanear el código de barras** · P2 · M.
  - Con el código, Open Food Facts devuelve el producto exacto, sin las confusiones de la búsqueda por nombre.
  - Android tiene lector propio; en iPhone hace falta una librería, que se baja solo al abrir el escáner.
  - Hay que habilitar la cámara en `vercel.json`: hoy dice `camera=()`.
  - Si el producto no está en Open Food, se ofrece cargarlo a mano. Conviene hacerlo junto con F-02.
- [ ] **F-02 · Catálogo compartido de productos** · P2 · M. Cada producto que alguien encuentra en Open Food o carga a mano queda guardado para todos, así el segundo ya no depende de Open Food. Necesita una tabla nueva y algún control para que nadie cargue datos falsos (por ejemplo, que un producto recién cargado lo vea solo quien lo cargó hasta que lo usen varios).
- [ ] **F-04 · Vencimientos en la despensa** · P2 · M. Fecha de vencimiento opcional al comprar o cargar, aviso de "usá esto primero" y que las recetas sugeridas prioricen lo que vence antes.
- [ ] **F-06 · Recordatorios** · P2 · L. Tomar agua, comidas sin registrar y el resumen del domingo.
  - Necesita notificaciones del navegador y algo del lado del servidor que las mande a la hora.
  - En iPhone solo funcionan con la app instalada en la pantalla de inicio.
- [ ] **F-08 · Copiar un día entero** · P3 · S. Hoy se puede repetir la comida de ayer; falta copiar el día completo (o un día cualquiera) a otra fecha.
- [ ] **F-09 · Combos frecuentes** · P3 · M. Guardar "mi desayuno de siempre" con varios alimentos y registrarlo con un toque.
- [ ] **F-18 · Registrarse e iniciar sesión con Google** · P2 · M. Un botón "Continuar con Google" en la pantalla de acceso, para crear la cuenta o entrar sin escribir mail ni contraseña. **Qué hace falta de tu lado:** crear un proyecto en Google Cloud, configurar la pantalla de consentimiento y las credenciales OAuth (cliente web), y activar el proveedor Google en Supabase (Authentication > Providers) con las direcciones de vuelta de la app y de Supabase. Gratis. **Cosas a resolver:** (1) el consentimiento de Google en modo de prueba solo deja entrar a 100 usuarios que vos agregues a mano; para abrirlo a cualquiera hay que publicarlo, y Google pide la Política de privacidad y la página de inicio en un dominio propio (esto se cruza con C-02, dominio propio); (2) si ya existe una cuenta con el mismo mail, Supabase puede unirla con la de Google; hay que dejarlo bien configurado para que nadie tome una cuenta ajena; (3) quien entra con Google no tiene contraseña: la pantalla de "Olvidé mi contraseña" y el Perfil tienen que explicarlo, y se podría ofrecer crear una; (4) igual hay que pasar por el perfil (fecha de nacimiento, para cumplir los 18 años de L-01) y, con F-17, elegir el nombre de usuario; (5) sumar a la Política de privacidad que Google es un proveedor y qué datos se reciben (mail y nombre; la foto no se guarda); (6) probarlo en el navegador del teléfono y en la app instalada (PWA), donde el regreso desde Google a veces se comporta distinto. Va con pruebas (el simulador de las pruebas tiene que fingir el regreso de Google) y los textos del botón. Borrar la cuenta y descargar los datos siguen igual.
- [ ] **F-19 · Gasto calórico y ejercicio, por fases** · P2 · L. Hoy el objetivo sale de una fórmula general (Mifflin-St Jeor por un factor de actividad fijo de 1,2 a 1,725), que no sabe qué hacés cada día. La idea es estimar cuánto se gasta de verdad por día, anotar el ejercicio y comparar contra lo comido. Se hace en fases, cada una se publica sola y ninguna toca lo que ya cargó cada usuario (tablas y columnas nuevas, con valores por defecto).
  - **El gasto de un día se separa en cuatro partes:** metabolismo basal (TMB), movimiento del día a día sin entrenar (NEAT: trabajo y pasos), efecto térmico de la comida (TEF, se calcula con los macros ya registrados: la proteína gasta mucho más que la grasa) y ejercicio (EAT). Hoy el factor de actividad mezcla NEAT y ejercicio: al sumar el ejercicio registrado hay que **separarlos**, o se cuenta dos veces.
  - **Fase 1 · Motor de gasto y perfil ampliado (M).** Datos opcionales nuevos en el perfil: % de grasa corporal, tipo de trabajo (de escritorio, de pie, físico), pasos por día y pulso en reposo. Fórmula según lo que haya: Mifflin-St Jeor (la de hoy), Katch-McArdle si hay % de grasa. Pantalla "Cómo se calcula tu gasto" con cada parte, la fórmula y un rango (no un número falso de exacto). El objetivo actual de cada usuario **no cambia solo**: el modo nuevo se activa a mano.
  - **Fase 2 · Registrar ejercicio de resistencia y deporte (L).** Tipo (correr, caminar, bici, natación, fútbol, pádel, baile, yoga, HIIT, lo que sea), duración y, según el tipo, distancia, desnivel, pulso promedio o cómo se sintió (esfuerzo de 1 a 10). Catálogo propio de unas 100 actividades con sus METs del Compendio de Actividades Físicas (se pueden crear otras). El cálculo usa el dato más preciso disponible, en este orden: lo que marca el reloj si lo cargás a mano, pulso promedio (fórmula de Keytel), distancia y ritmo (ecuaciones del ACSM para correr y caminar), y METs por duración e intensidad. Se cuenta el gasto **neto** (sin el basal de esos minutos, que ya está en el TMB). En el Diario: gasto estimado del día, comido contra gastado y balance.
  - **Objetivo dinámico (opcional, en la fase 2):** objetivo = gasto del día menos el déficit elegido (o más el superávit), y de lo quemado entrenando se "devuelve" solo una parte configurable (se sugiere 50 %, porque las estimaciones de ejercicio se pasan seguido). Sigue existiendo el objetivo fijo de hoy.
  - **Fase 3 · Gimnasio (L).** Rutinas (Día A, Día B), catálogo de unos 150 ejercicios (grupo muscular, equipo; se pueden crear otros), series con repeticiones, peso, esfuerzo (RPE o repeticiones en reserva) y marca de calentamiento. Muestra lo de la última vez al anotar, temporizador de descanso, copiar la sesión anterior, récord personal, 1RM estimado (Epley), volumen por grupo muscular y gráfico de progreso por ejercicio. **Aviso honesto:** las calorías de una sesión de pesas son difíciles de estimar (repeticiones por peso casi no dice nada del gasto): se estiman por METs, duración e intensidad, con un rango amplio. El valor de esta fase es el seguimiento del entrenamiento, no afinar las calorías. Es casi una app dentro de la app: conviene hacerla simple.
  - **Fase 4 · Gasto real calculado con tus propios datos (M).** Con el peso (tendencia suavizada) y lo comido de 2 a 4 semanas se despeja cuánto gastás realmente (ingesta menos el cambio de peso, con 7700 kcal por kg como aproximación). Corrige la fórmula general con un factor propio, avisa qué tan confiable es (según cuántos días hay registrados) y sugiere ajustar el objetivo. **Es la parte que más afina el cálculo**, porque las fórmulas son promedios de población con un error de 10 a 15 %. Necesita días de datos, por eso conviene que corra desde temprano. No necesita tablas nuevas.
  - **Orden sugerido:** 1, 2, 4 y al final 3. La fase 4 depende de la 1; la 3 es independiente y la más grande.
  - **Base de datos (SQL nuevo por fase, todo aditivo):** columnas nuevas y opcionales en `profiles`; `exercise_types` (catálogo global y propios, como `foods`); `workouts` (fecha, duración, tipo, esfuerzo, pulso, calorías calculadas guardadas con el peso de ese día, calorías del reloj si las cargó); `workout_sets` (ejercicio, serie, repeticiones, peso, RPE, calentamiento); `routines` y `routine_exercises`; y opcionalmente `daily_activity` (pasos). Todo con RLS de cada usuario; los entrenamientos son personales, **no se comparten en el hogar**.
  - **Lo que hay que tocar además de las tablas:** la cola de cambios y la copia del teléfono (`sincronizacion.js` y `store`) para que se pueda cargar sin conexión, el simulador de las pruebas, `borrar_mi_cuenta()`, la descarga de datos, la copia de seguridad diaria (S-01), el recorrido inicial (D-05) y la Política de privacidad: el ejercicio y el peso son datos de salud, que la Ley 25.326 trata como sensibles, así que el texto legal y el consentimiento (L-04) hay que revisarlos **antes** de publicar.
  - **Límites a decir en la app:** son estimaciones con rango, no mediciones; el reloj o la pulsera también se equivocan entre 20 y 40 %; el piso mínimo de calorías que ya existe se mantiene, y a menores de 18 no se les calcula déficit (igual que hoy). Conviene que alguien que estudió nutrición revise las fórmulas y los textos antes de publicar.
  - **Después, si se quiere:** importar entrenamientos desde archivos (.gpx, .tcx, .fit o la exportación de Apple Salud). Conectar Strava o Garmin directo necesita algo del lado del servidor. Leer Apple Salud o Health Connect directo no se puede desde una PWA.
- [ ] **F-10 · Peso: gráfico y fecha estimada** · P3 · S. Gráfico de los últimos meses y, con la tendencia, cuándo llegaría al peso objetivo, sin prometer nada.
- [ ] **F-11 · Exportar el registro a planilla** · P3 · S. Hoy "Descargar mis datos" baja un JSON; sumar un CSV que abra en Excel, útil para llevarle al nutricionista.
- [ ] **F-12 · Base propia de alimentos más grande** · P2 · M (y continuo). Sumar alimentos, categorías y recetas a medida que aparecen productos nuevos en las despensas, para depender menos de Open Food.
- [ ] **F-13 · Categorías editables por el usuario** · P3 · M. Crear, renombrar y elegir categorías para sus alimentos propios.
## 2. Inteligencia artificial

- [ ] **IA-01 · Chat con IA** · P2 · L. Preguntas como "¿puedo comer tal cosa ahora?" o "¿qué ceno con lo que me queda?", con los datos del día: objetivo, lo comido, lo que falta, la despensa y el plan. El análisis semanal sigue igual. Candidato al plan pago. **Falta definir:**
  - si recuerda las conversaciones (si sí, sumarlo a la Política de privacidad);
  - el tope de mensajes por día (propuesta: 20);
  - si más adelante va a poder registrar cosas ("anotame una manzana").
- [ ] **IA-02 · Proveedor de respaldo** · P2 · S. Si Groq está saturado, probar con otro (NVIDIA tiene API gratis con el mismo formato). Antes, leer sus términos: el acceso gratis parece pensado para pruebas, no para producción.
- [ ] **IA-03 · Foto de un plato** · P3 · M. Sacarle una foto a la comida y que la IA estime qué es y cuántas calorías tiene. Es bastante menos preciso, sobre todo con las cantidades, y cada foto gasta cupo del proveedor. Plan pago.
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

- [ ] **L-03 · Registro de la base de datos** · P1 · S. En Argentina, las bases con datos personales se inscriben en el registro de la Agencia de Acceso a la Información Pública, y acá hay datos de salud. Confirmarlo con legales.
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
