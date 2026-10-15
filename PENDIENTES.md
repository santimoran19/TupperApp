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
1. C-03 · Mails propios (SMTP)
2. L-02 · Revisión de los textos legales
3. L-03 · Registro de la base de datos
4. C-01 · Planes y cobro (para empezar a cobrar)
5. S-04 · Repo privado (al terminar)

**Después (P2)**
6. D-01 · Hojas que suben desde abajo (va junto con D-02)
7. D-02 · Botones del tamaño del dedo
8. D-05 · Recorrido inicial
9. F-07 · Ajustar las porciones de una receta
10. F-15 · Alimentos solos en el plan
11. F-05 · Compartir la lista de compras por WhatsApp
12. S-02 · CORS de la función de IA
13. T-02 · Pruebas automáticas en cada push
14. T-06 · Aviso de errores (va junto con S-05)
15. S-05 · Revisión periódica
16. F-01 · Escanear el código de barras (va junto con F-02)
17. F-02 · Catálogo compartido de productos
18. F-12 · Base propia de alimentos más grande
19. IA-01 · Chat con IA (va junto con IA-02)
20. IA-02 · Proveedor de respaldo
21. F-04 · Vencimientos en la despensa
22. D-07 · Revisión completa de accesibilidad
23. L-04 · Consentimiento al registrarse
24. C-02 · Dominio propio y página de presentación
25. C-05 · Opiniones desde la app
26. T-03 · Pruebas en Safari
27. T-04 · Base de pruebas aparte
28. T-01 · Actualizar las herramientas
29. F-03 · Despensa compartida entre los de una misma casa
30. F-06 · Recordatorios

**Cuando haya tiempo (P3)**
31. F-08 · Copiar un día entero
32. D-06 · Deshacer en más lugares
33. D-04 · Esqueletos de carga
34. F-10 · Peso: gráfico y fecha estimada
35. F-11 · Exportar el registro a planilla
36. F-09 · Combos frecuentes
37. F-13 · Categorías editables por el usuario
38. D-08 · Revisión de los textos
39. IA-04 · Cargar una receta desde un texto
40. IA-03 · Foto de un plato
41. C-06 · Métricas de uso
42. C-04 · Play Store
43. T-05 · Partir `sincronizacion.js`
44. T-07 · Mandar lo cargado sin conexión con la app cerrada
45. S-06 · Verificación en dos pasos
46. S-03 · Contraseñas filtradas también del lado de Supabase

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
- [ ] **F-03 · Despensa compartida entre los de una misma casa** · P2 · L. Un "hogar" con varios miembros que ven y mueven la misma despensa y la misma lista de compras; cada uno sigue con su diario. Invitación por link o por código. Toca las reglas de acceso de varias tablas.
- [ ] **F-04 · Vencimientos en la despensa** · P2 · M. Fecha de vencimiento opcional al comprar o cargar, aviso de "usá esto primero" y que las recetas sugeridas prioricen lo que vence antes.
- [ ] **F-05 · Compartir la lista de compras por WhatsApp** · P2 · S. Botón que arma el texto de la lista y abre el menú de compartir del teléfono (o WhatsApp directo).
- [ ] **F-06 · Recordatorios** · P2 · L. Tomar agua, comidas sin registrar y el resumen del domingo.
  - Necesita notificaciones del navegador y algo del lado del servidor que las mande a la hora.
  - En iPhone solo funcionan con la app instalada en la pantalla de inicio.
- [ ] **F-07 · Ajustar las porciones de una receta** · P2 · S. Ver las cantidades para 1, 2 o N porciones, y cocinar más o menos de lo que rinde la receta.
- [ ] **F-15 · Alimentos solos en el plan** · P2 · M. Hoy, en Plan, al tocar una comida solo se puede elegir una receta. Que también se pueda poner un alimento suelto con su cantidad (por ejemplo, mate solo en la merienda) en cualquiera de las cuatro comidas, aunque el día no tenga nada planeado.
  - La hoja de elegir comida ofrece dos caminos: receta o alimento (con el mismo buscador y las mismas medidas del diario).
  - Que cuente como cualquier otra comida del plan: calorías del día, "Comí esto" en el diario (anota el alimento con esa cantidad), lo que falta de la despensa y la lista de compras.
  - Hace falta guardar el alimento y la cantidad en la tabla del plan (hoy solo guarda la receta): un SQL nuevo, y que "Armar con lo que tengo" respete lo que se puso a mano.
- [ ] **F-08 · Copiar un día entero** · P3 · S. Hoy se puede repetir la comida de ayer; falta copiar el día completo (o un día cualquiera) a otra fecha.
- [ ] **F-09 · Combos frecuentes** · P3 · M. Guardar "mi desayuno de siempre" con varios alimentos y registrarlo con un toque.
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

- [ ] **D-01 · Hojas que suben desde abajo** · P2 · S. Que se cierren con Escape, que el foco no se escape de la hoja abierta y que vuelva al botón que la abrió. El diálogo de confirmación ya lo hace.
- [ ] **D-02 · Botones del tamaño del dedo** · P2 · S. El tachito y la cruz miden 32 px; lo recomendado es 44.
- [ ] **D-04 · Esqueletos de carga** · P3 · S. Mostrar la forma de la pantalla mientras trae los datos, en vez de "Cargando...".
- [ ] **D-05 · Recorrido inicial** · P2 · S. Tres pantallas que expliquen despensa, plan y registro. Hoy el usuario nuevo cae directo al diario.
- [ ] **D-06 · Deshacer en más lugares** · P3 · S. "No comí" ya tiene Deshacer; sumarlo a borrar un registro, quitar de la despensa y quitar de la lista.
- [ ] **D-07 · Revisión completa de accesibilidad** · P2 · M. Lector de pantalla, etiquetas de los campos, contraste en los dos temas y letra grande del sistema (que nada se corte).
- [ ] **D-08 · Revisión de los textos** · P3 · S. Que se digan las mismas cosas con las mismas palabras en toda la app, y que los errores digan qué hacer.

## 4. Seguridad

- [ ] **S-02 · CORS de la función de IA** · P2 · S. Hoy acepta pedidos de cualquier página (`*`); dejar solo el dominio de la app.
- [ ] **S-03 · Contraseñas filtradas también del lado de Supabase** · P3 · S. Solo con el plan Pro; la app ya lo revisa por su cuenta.
- [ ] **S-04 · Repo privado** · P1 · S. Al terminar la app, antes de venderla.
- [ ] **S-05 · Revisión periódica** · P2 · S. Una vez por mes: avisos de seguridad del panel de Supabase, `npm audit` y que sigan andando el captcha y los topes de la base. Se puede dejar programado (ver T-06).
- [ ] **S-06 · Verificación en dos pasos** · P3 · M. Opcional para quien la quiera (código de una app autenticadora). Supabase la trae.

## 5. Legal y datos personales

- [ ] **L-02 · Revisión de los textos legales** · P1 · S. Términos y Política de privacidad, por un abogado. Son una base razonable, no un documento definitivo.
- [ ] **L-03 · Registro de la base de datos** · P1 · S. En Argentina, las bases con datos personales se inscriben en el registro de la Agencia de Acceso a la Información Pública, y acá hay datos de salud. Confirmarlo con legales.
- [ ] **L-04 · Consentimiento al registrarse** · P2 · S. Una casilla explícita para el uso de datos de salud, además del texto que ya está debajo del botón.

## 6. Para venderla

- [ ] **C-01 · Planes y cobro** · P1 (para cobrar) · L.
  - El plan de cada usuario guardado de forma que él no lo pueda cambiar.
  - Qué entra en el plan gratis y qué en el pago (la IA, seguro).
  - Suscripciones con Mercado Pago; el aviso de pago lo recibe una función de Supabase.
- [ ] **C-02 · Dominio propio y página de presentación** · P2 · M. Una página para quien todavía no tiene cuenta: qué hace la app, capturas y el botón para crear la cuenta. Con dominio nuevo hay que actualizar el captcha de Cloudflare, Supabase y los archivos que nombra el README.
- [ ] **C-03 · Mails propios (SMTP)** · P1 · S. El servidor de mails que trae Supabase manda muy pocos por hora: con más usuarios no alcanza para los códigos de confirmación. Pasos en `supabase/emails/LEEME.md`.
- [ ] **C-04 · Play Store** · P3 · M. Empaquetar la app para Android (USD 25, una vez). Pide una prueba cerrada con 12 testers durante 14 días. App Store después: USD 99 por año, hace falta una Mac y Apple suele rechazar las apps que son solo una web.
- [ ] **C-05 · Opiniones desde la app** · P2 · S. Un "Contanos qué te falta" en el Perfil que llegue a tu mail o a una tabla.
- [ ] **C-06 · Métricas de uso** · P3 · S. Cuántos vuelven a la semana y qué pantallas usan, sin datos personales: Vercel Analytics ya cuenta visitas, falta mirar el recorrido.

## 7. Técnico y calidad

- [ ] **T-01 · Actualizar las herramientas** · P2 · M. Vite 5 → 8, Tailwind 3 → 4, React 18 → 19, Vitest y ESLint. No afecta a los usuarios, pero los avisos de `npm audit` son de estas versiones. Tailwind 4 cambia la configuración: va en una tanda aparte.
- [ ] **T-02 · Pruebas automáticas en cada push** · P2 · S. GitHub Actions corre el lint y las pruebas al subir algo, y avisa si se rompió. Gratis con el repo público; con el repo privado hay minutos gratis por mes.
- [ ] **T-03 · Pruebas en Safari** · P2 · M. Hoy las pruebas de navegador corren solo en Chrome. Sumar WebKit, que es el motor de Safari, para encontrar antes los problemas de iPhone (ver V-01).
- [ ] **T-04 · Base de pruebas aparte** · P2 · M. Un segundo proyecto de Supabase (el plan gratis permite dos) para probar cambios de la base antes de tocar la de producción.
- [ ] **T-05 · Partir `sincronizacion.js`** · P3 · M. Quedó en unas 740 líneas. Separar la cola, la copia del teléfono y el envío, sin cambiar lo que hace.
- [ ] **T-06 · Aviso de errores** · P2 · S. Una tarea programada que mire la tabla `eventos` una vez por día y te mande un resumen si aparecieron errores nuevos.
- [ ] **T-07 · Mandar lo cargado sin conexión con la app cerrada** · P3 · M. Solo en Android: el navegador lo manda cuando vuelve la señal, aunque la app no esté abierta. En iPhone no existe.

---

## Hecho

- **S-01 · Copias de seguridad propias** (14/10/2026): repo privado `tupper-respaldos` en GitHub con copia diaria cifrada (3:17 AR, guardada 90 días) y scripts para abrirla y restaurarla. Respaldo verificado el 14/10 (4 cuentas, 174 registros, 309 alimentos, 91 recetas, 42 del plan). Contraseña de la base cambiada, `RESPALDO_CLAVE` guardada aparte y prueba de restauración hecha.
- **Verificado el 13/10/2026:** el análisis con IA anda (V-02, función `analizar-semana` versión 4) y `actualizacion-9.sql` está aplicada en Supabase.
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
