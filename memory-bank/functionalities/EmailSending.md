# Funcionalidad: Envío de Correos Electrónicos

Este documento describe la funcionalidad global de envío de correos electrónicos en la aplicación, centralizada a través de `src/utils/nodemailer.js`.

## 1. Cómo funciona la funcionalidad

La aplicación utiliza Nodemailer para enviar correos electrónicos. La configuración del transportador de Nodemailer se ha centralizado en `src/utils/nodemailer.js` para asegurar una gestión consistente y reutilizable. En lugar de crear un nuevo transportador en cada lugar donde se necesita enviar un correo, se importa y utiliza la instancia preconfigurada.

El proceso general para enviar un correo es:
1.  Importar el `transporter` desde `@/utils/nodemailer`.
2.  Definir las `mailOptions` (remitente, destinatario, asunto, cuerpo HTML/texto).
3.  Llamar a `transporter.sendMail(mailOptions)`.
4.  Manejar posibles errores durante el envío.

## 2. Archivos involucrados

*   **`src/utils/nodemailer.js`**:
    *   Contiene la configuración principal del transportador de Nodemailer (`nodemailer.createTransport`).
    *   Exporta la instancia `transporter` configurada para ser utilizada en toda la aplicación.
    *   Realiza una verificación inicial de la conexión del transportador al iniciar la aplicación.

*   **`src/app/acciones/ProveedorActions.js`**:
    *   Un ejemplo de archivo que utiliza la funcionalidad de envío de correos.
    *   Importa el `transporter` centralizado.
    *   Utiliza `transporter.sendMail` para enviar correos electrónicos a los proveedores (ej. con claves de acceso generadas).

*   **(Anteriormente) `src/app/api/email/route.js`**:
    *   Esta ruta API fue eliminada. Anteriormente, actuaba como un punto final para enviar correos, pero ahora la lógica de envío se integra directamente en las Server Actions o en otros módulos del lado del servidor que necesiten enviar correos, utilizando el `transporter` centralizado.

## 3. Cómo se utiliza

Para enviar un correo electrónico desde cualquier Server Action o módulo del lado del servidor:

```javascript
// 1. Importar el transportador centralizado
import { transporter } from '@/utils/nodemailer';
import logger from '@/utils/logger'; // Para el manejo de errores

// ... (dentro de una función asíncrona, por ejemplo)

try {
  const mailOptions = {
    from: process.env.EMAIL_USER, // O una dirección específica
    to: 'destinatario@ejemplo.com',
    subject: 'Asunto del Correo',
    html: '<p>Cuerpo del correo en HTML.</p>', // O 'text' para texto plano
  };

  await transporter.sendMail(mailOptions);
  console.log('Correo enviado exitosamente.');
} catch (error) {
  logger.error('Error al enviar correo:', error);
  // Manejo de errores, por ejemplo, retornar un mensaje de fallo
}
```

**Consideraciones:**
*   Asegúrate de que las variables de entorno (`EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_SECURE`) estén configuradas correctamente en el archivo `.env.local`.
*   El cuerpo del correo puede ser HTML para un formato enriquecido o texto plano.
*   El manejo de errores es crucial para asegurar que los fallos en el envío de correos no detengan otras operaciones.
