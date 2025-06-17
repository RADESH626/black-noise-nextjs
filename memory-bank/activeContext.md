# Contexto de Sesión Activa

## Resumen de la Sesión
Se ha implementado una nueva funcionalidad para notificar a los usuarios por correo electrónico cuando el estado de sus pedidos cambia. Esto incluye notificaciones para los estados "en fabricación", "listo", "enviado" y "cancelado". El estado "entregado" no activa una notificación.

## Cambios Realizados

### Archivos Modificados:
*   `src/app/acciones/PedidoActions.js`:
    *   Se importaron `sendEmail` de `@/utils/nodemailer`, `Usuario` de `@/models/Usuario` y `EstadoPedido` de `@/models/enums/PedidoEnums`.
    *   La función `updateEstadoPedido` ahora captura el `oldEstado` antes de la actualización.
    *   Se añadió una llamada a la nueva función `enviarNotificacionCambioEstadoPedido` después de guardar el pedido, siempre y cuando el estado haya cambiado y el nuevo estado no sea `ENTREGADO`.
    *   Se creó la función `enviarNotificacionCambioEstadoPedido` que:
        *   Recupera los datos del usuario asociado al pedido.
        *   Construye el asunto y el contenido HTML del correo electrónico basándose en el `newEstado` del pedido.
        *   Utiliza `sendEmail` para enviar la notificación.
        *   Maneja los errores en el envío de correos.

### Archivos Creados:
*   `memory-bank/functionalities/OrderStateNotifications.md`:
    *   Documentación detallada de la nueva funcionalidad de notificación de estado de pedidos, incluyendo su propósito, los estados que activan notificaciones y los mensajes de correo electrónico asociados.

## Próximos Pasos
La implementación de la lógica de notificación está completa. Se recomienda probar la funcionalidad para asegurar que los correos se envían correctamente en cada cambio de estado especificado.
