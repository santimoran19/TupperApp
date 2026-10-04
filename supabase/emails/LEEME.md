# Mails de Tupper

Supabase manda dos mails: el de confirmación al crear la cuenta y el de recuperar la contraseña.
La app pide un código de 6 dígitos en los dos casos, así que las plantillas tienen que mostrar ese código.

## 1. Pegar las plantillas

En el panel de Supabase: **Authentication > Emails > Templates**.

| Plantilla de Supabase | Asunto | Cuerpo |
| --- | --- | --- |
| Confirm signup | `{{ .Token }} es tu código de Tupper` | el contenido de `confirmar-cuenta.html` |
| Reset password | `{{ .Token }} es tu código para cambiar la contraseña` | el contenido de `recuperar-contrasena.html` |

El logo del mail se carga desde `{{ .SiteURL }}/icon-192.png`, así que en **Authentication > URL Configuration > Site URL** tiene que estar la dirección de la app (`https://tupperapp.vercel.app`).

## 2. Configurar el envío (SMTP)

El servicio de mails que trae Supabase es solo para probar: manda únicamente a las direcciones del equipo del proyecto y tiene un tope bajo por hora. Mientras esté ese, nadie que no seas vos puede crear una cuenta, porque el mail no le llega.

Para que les llegue a todos hay que cargar un SMTP propio en **Authentication > Emails > SMTP Settings**. Dos caminos:

- **Con dominio propio** (lo recomendable si la app se va a vender): un servicio como Resend o Brevo. Se verifica el dominio y los mails salen desde algo como `hola@tudominio.com`.
- **Sin dominio, para arrancar**: el SMTP de Gmail con una contraseña de aplicación (`smtp.gmail.com`, puerto 465). Sirve para pocos usuarios; Gmail limita la cantidad de mails por día.

## 3. Ajustes de la misma pantalla

- **Confirm email**: activado. Si se desactiva, las cuentas entran directo sin código; la app funciona igual en los dos casos.
- **Email OTP length**: 6.
- **Email OTP expiration**: 3600 segundos (una hora), que es lo que dicen los mails.
