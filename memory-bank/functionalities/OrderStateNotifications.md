# Notificaciones de Cambio de Estado de Pedido

## Propósito
Esta funcionalidad tiene como objetivo notificar a los usuarios por correo electrónico sobre los cambios importantes en el estado de sus pedidos. Esto mejora la comunicación y la experiencia del usuario al mantenerlos informados sobre el progreso de su compra.

## Estados que Activan Notificaciones

Las notificaciones se enviarán para los siguientes cambios de estado:

*   **EN_FABRICACION**: Se notifica al usuario que su pedido está en proceso de fabricación y que pronto lo recibirá.
    *   **Asunto del Correo:** "Tu pedido está en fabricación - Black Noise"
    *   **Contenido del Correo:** "¡Hola [Nombre de Usuario]! Queremos informarte que tu pedido #[ID de Pedido] ha cambiado a estado 'En Fabricación'. Estamos trabajando en ello y pronto lo tendrás contigo."

*   **LISTO**: Se notifica al usuario que su pedido ha sido terminado y está listo para la siguiente etapa (envío o recogida).
    *   **Asunto del Correo:** "Tu pedido está listo para ser enviado/recogido - Black Noise"
    *   **Contenido del Correo:** "¡Hola [Nombre de Usuario]! ¡Buenas noticias! Tu pedido #[ID de Pedido] ya fue terminado y está listo. Pronto estará en camino o disponible para recogida."

*   **ENVIADO**: Se notifica al usuario que su pedido ha sido enviado y está en camino.
    *   **Asunto del Correo:** "Tu pedido ha sido enviado - Black Noise"
    *   **Contenido del Correo:** "¡Hola [Nombre de Usuario]! Tu pedido #[ID de Pedido] ha sido enviado y está en camino. ¡Pronto lo recibirás!"

*   **CANCELADO**: Se notifica al usuario que su pedido ha sido cancelado, incluso si el usuario fue quien inició la cancelación, para mantener un registro.
    *   **Asunto del Correo:** "Tu pedido ha sido cancelado - Black Noise"
    *   **Contenido del Correo:** "¡Hola [Nombre de Usuario]! Queremos confirmarte que tu pedido #[ID de Pedido] ha sido cancelado. Si tienes alguna pregunta, no dudes en contactarnos."

## Estados que NO Activan Notificaciones

*   **ENTREGADO**: No se enviará ninguna notificación automática para este estado, ya que se espera que el usuario confirme la recepción del pedido directamente.

## Implementación Técnica

La lógica de notificación se integrará en la función `updateEstadoPedido` dentro de `src/app/acciones/PedidoActions.js`. Se utilizará `src/utils/nodemailer.js` para el envío de correos electrónicos. Se recuperará la información del usuario (`Usuario` modelo) para obtener su dirección de correo electrónico.
