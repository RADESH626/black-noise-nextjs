# Progreso del Proyecto

## Funcionalidades Implementadas Recientemente
*   **Notificaciones de Cambio de Estado de Pedido:** Se ha implementado la lógica para enviar notificaciones por correo electrónico a los usuarios cuando el estado de su pedido cambia a "en fabricación", "listo", "enviado" o "cancelado".
*   **Apartado de Pagos Pendientes:** Se ha implementado una nueva sección para clientes que muestra los costos de envío pendientes. Esto incluye un resumen en el header y una página dedicada para ver detalles y "pagar" estos costos. La lógica de `estadoPago` en los pedidos se ha ajustado para reflejar estos pagos pendientes.
*   **Corrección de Error en Procesamiento de Pago:** Se ha resuelto el error "nuevoPedido.save is not a function" en la lógica de procesamiento de pagos, asegurando que los pedidos se actualicen correctamente con el ID de pago. Se ha mejorado el logging para depurar la asignación de proveedor y pago.
*   **Decremento de Órdenes Activas del Proveedor:** Se ha implementado la lógica para decrementar el contador `activeOrders` de un proveedor cuando un pedido asignado a él cambia a los estados `ENTREGADO`, `CANCELADO` o `LISTO`.
*   **Corrección de Visualización de Pagos Pendientes:** Se ha corregido la inicialización del `costoEnvio` en la creación del pedido, asegurando que los pedidos con método de entrega a domicilio tengan un costo de envío mayor a cero y un estado de pago `PENDIENTE`, lo que permite que sean correctamente listados en la página de pagos pendientes. Se han añadido logs de depuración en `obtenerPagosPendientesPorUsuario` para facilitar la depuración de la visualización.
*   **Actualización del Total del Pedido por Costo de Envío:** Se ha modificado la función `actualizarPedidoPorProveedor` para que, cuando el proveedor establezca el `costoEnvio`, el `total` del pedido se recalcule para incluir este costo. También se ajusta el `estadoPago` del pedido según el `costoEnvio` y se revalidan las rutas relevantes.
*   **Corrección de `revalidatePath` en `ProveedorPedidoActions.js`:** Se ha importado `revalidatePath` en `src/app/acciones/ProveedorPedidoActions.js` para resolver el `ReferenceError`.
*   **Corrección de `ventaId` requerido en `Pago`:** Se ha corregido el error `ventaId: Path \`ventaId\` is required` en `registrarPagoEnvioSimulado` al asegurar que el `ventaId` de la `Venta` recién creada se asigne al `Pedido` en `procesarPagoYCrearPedido` antes de crear el `Pago` principal.
*   **Replanteamiento del Flujo de Pagos:** Se ha ajustado la lógica de creación de pedidos para que el `costoEnvio` inicial sea `0` y el `estadoPago` inicial sea `PAGADO` (ya que el usuario paga los ítems al inicio). La lógica de `actualizarPedidoPorProveedor` se ha modificado para que el `estadoPago` del pedido cambie a `PENDIENTE` si el proveedor establece un `costoEnvio > 0`, y a `PAGADO` si lo establece a `0`. Se ha corregido el error `ventaId: Path \`ventaId\` is required` en `registrarPagoEnvioSimulado` al implementar la creación de una nueva `Venta` específica para el pago de envío.

## Estado General
La funcionalidad de notificaciones de pedido y el apartado de pagos pendientes están completos a nivel de código. El error crítico en el procesamiento de pagos ha sido resuelto y se han añadido mejoras de depuración para la asignación de proveedor y pago. La gestión del contador de órdenes activas del proveedor ahora es más precisa. La visualización de pagos pendientes en la página correspondiente ha sido corregida y mejorada con logs de depuración. El total del pedido ahora se actualiza correctamente para reflejar el costo de envío establecido por el proveedor. El error de `revalidatePath` ha sido resuelto. El problema de `ventaId` requerido en el modelo `Pago` también ha sido solucionado. El flujo de pagos ha sido replanteado para que el pago inicial cubra solo los ítems y el costo de envío se gestione como un pago pendiente posterior.

## Próximos Pasos
*   Verificación y pruebas de la funcionalidad de notificación de pedidos.
*   Verificación y pruebas de la funcionalidad del apartado de pagos pendientes (icono en header, resumen, página de detalles, modal de pago con formulario, acción de "pagar").
*   **Verificación de la creación y actualización de pedidos y pagos después de la corrección del error y las mejoras de logging, prestando especial atención a la asignación correcta de `proveedorId` y `paymentId`.**
*   **Verificación del decremento de `activeOrders` del proveedor cuando un pedido cambia a los estados `ENTREGADO`, `CANCELADO` o `LISTO`.**
*   **Verificación de que los pedidos con costo de envío pendiente se muestren correctamente en la página `/pagos-pendientes` utilizando los nuevos logs para confirmar la consulta y los resultados.**
*   **Verificación de que el `total` del pedido se actualiza correctamente en la base de datos y en la interfaz de usuario (perfil, pagos pendientes) cuando el proveedor establece el `costoEnvio`.**
*   **Verificación completa del nuevo flujo de pagos:**
    *   Crear un pedido: `costoEnvio` inicial 0, `estadoPago` inicial `PAGADO`.
    *   Proveedor establece `costoEnvio > 0`: `total` se actualiza, `estadoPago` cambia a `PENDIENTE`.
    *   Usuario paga `costoEnvio`: `estadoPago` vuelve a `PAGADO`.
