# Progreso del Proyecto

## Funcionalidades Implementadas Recientemente
*   **Notificaciones de Cambio de Estado de Pedido:** Se ha implementado la lógica para enviar notificaciones por correo electrónico a los usuarios cuando el estado de su pedido cambia a "en fabricación", "listo", "enviado" o "cancelado".
*   **Apartado de Pagos Pendientes:** Se ha implementado una nueva sección para clientes que muestra los costos de envío pendientes. Esto incluye un resumen en el header y una página dedicada para ver detalles y "pagar" estos costos. La lógica de `estadoPago` en los pedidos se ha ajustado para soportar este flujo, incluyendo la captura de datos simulados de pago.
*   **Corrección de Error en Procesamiento de Pago:** Se ha resuelto el error "nuevoPedido.save is not a function" en la lógica de procesamiento de pagos, asegurando que los pedidos se actualicen correctamente con el ID de pago.

## Estado General
La funcionalidad de notificaciones de pedido y el apartado de pagos pendientes están completos a nivel de código. El error crítico en el procesamiento de pagos ha sido resuelto.

## Próximos Pasos
*   Verificación y pruebas de la funcionalidad de notificación de pedidos.
*   Verificación y pruebas de la funcionalidad del apartado de pagos pendientes (icono en header, resumen, página de detalles, modal de pago con formulario, acción de "pagar").
*   **Verificación de la creación y actualización de pedidos y pagos después de la corrección del error.**
