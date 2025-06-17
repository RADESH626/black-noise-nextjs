# Contexto de Sesión Activa

## Resumen de la Sesión
Se ha implementado el nuevo "apartado de pagos pendientes" para clientes, incluyendo una vista resumida en el header y una página detallada (`/pagos-pendientes`) donde los usuarios pueden ver y registrar pagos simulados con datos de entrada para los costos de envío adicionales. La lógica de estado de pago de los pedidos se ha ajustado para reflejar estos pagos pendientes.

## Cambios Realizados

### Archivos Modificados:
*   `src/app/acciones/PagoActions.js`:
    *   Se añadió la acción de servidor `obtenerPagosPendientesPorUsuario` para buscar pedidos con `costoEnvio > 0` y `estadoPago: 'PENDIENTE'`, poblando la información del proveedor.
    *   Se añadió la acción de servidor `registrarPagoEnvioSimulado` para actualizar el `estadoPago` del pedido a `'PAGADO'` y crear un registro en el modelo `Pago` con los datos de pago simulados.
    *   Se importó el modelo `Proveedor`.
    *   **Se corrigió el error "nuevoPedido.save is not a function" en `procesarPagoYCrearPedido` al reemplazar `await nuevoPedido.save()` con `await Pedido.findByIdAndUpdate(nuevoPedido._id, { paymentId: pagoGuardado._id })` para actualizar el `paymentId` del pedido, ya que `guardarPedido` devuelve un objeto plano.**
    *   **Se mejoró el logging en `procesarPagoYCrearPedido` para depurar la asignación de proveedor y pago, incluyendo logs para IDs de pedido y pago, y el resultado de las actualizaciones.**
    *   **Se corrigió la inicialización de `costoEnvio` en `procesarPagoYCrearPedido` para que se calcule dinámicamente basado en `metodoEntrega` (ej. 10.00 para 'DOMICILIO' si no se especifica), asegurando que los pedidos con costo de envío se creen con `costoEnvio > 0` y `estadoPago: 'PENDIENTE'`.**
    *   **Se añadieron logs de depuración en `obtenerPagosPendientesPorUsuario` para mostrar la consulta, los resultados crudos y los datos formateados, facilitando la depuración de la visualización de pagos pendientes.**
*   `src/app/acciones/PedidoActions.js`:
    *   Se añadió la función `guardarPedido` para la creación de pedidos, que ahora establece el `estadoPago` a `'PENDIENTE'` si `costoEnvio > 0` y `'PAGADO'` si `costoEnvio` es 0.
    *   Se eliminó la función `marcarPedidoComoPagado` y su exportación, ya que su lógica fue integrada en `registrarPagoEnvioSimulado`.
    *   Se corrigieron los errores de exportación duplicada de `guardarPedido`, `marcarPedidoComoPagado` y `updateEstadoPedido`.
    *   Se importó `getModel`.
    *   **Se modificó `guardarPedido` para que devuelva la instancia de Mongoose directamente en lugar de un objeto plano, lo que mejora la consistencia y el manejo de objetos de modelo.**
    *   **Se importó el modelo `Proveedor` para permitir la actualización de sus campos.**
    *   **Se modificó `updateEstadoPedido` para decrementar el `activeOrders` del proveedor asociado cuando el estado del pedido cambia a `ENTREGADO`, `CANCELADO` o `LISTO`, asegurando que el contador de pedidos activos del proveedor se mantenga actualizado.**
*   `src/app/acciones/ProveedorPedidoActions.js`:
    *   **Se modificó la función `actualizarPedidoPorProveedor` para recalcular el `total` del pedido sumando el `costoEnvio` al total original de los ítems cuando el proveedor actualiza el `costoEnvio`.**
    *   **Se añadió lógica para actualizar el `estadoPago` del pedido a `PENDIENTE` si el `costoEnvio` es mayor que 0, o a `PAGADO` si el `costoEnvio` se cambia a 0 desde un estado pendiente.**
    *   **Se añadieron revalidaciones de caché para `/perfil`, `/pagos-pendientes` y `/proveedor/pedidos/${pedidoId}` para asegurar que los cambios se reflejen en la interfaz de usuario.**
*   `src/components/layout/general/HeaderPrincipal.jsx`:
    *   Se importó el nuevo componente `PendingPaymentsSummary`.
    *   Se integró `PendingPaymentsSummary` en el header, visible para usuarios autenticados, junto al icono del carrito.
*   `src/app/pagos-pendientes/page.jsx`:
    *   Se modificó para usar `PendingPaymentModal` al hacer clic en "Pagar Ahora".
    *   Se eliminó la importación de `marcarPedidoComoPagado` y se importó `registrarPagoEnvioSimulado` y `PendingPaymentModal`.
    *   Se añadió la importación de `Link`.
    *   Se añadió lógica para controlar la visibilidad del modal y pasar los datos del pedido.
*   `src/components/common/PendingPaymentsSummary.jsx`:
    *   Se añadió la clase `filter invert` a las etiquetas `Image` del icono de dinero para mejorar su visibilidad en el header oscuro.

### Archivos Creados:
*   `src/components/common/PendingPaymentsSummary.jsx`:
    *   Componente React para mostrar un resumen de los pagos pendientes en el header.
    *   Utiliza `icono-dinero.svg` y muestra un contador de pagos pendientes.
    *   Al hacer clic, despliega un cuadro con un resumen y un botón para redirigir a la página de detalles.
*   `src/app/pagos-pendientes/page.jsx`:
    *   Nueva página para mostrar una lista detallada de los pagos de envío pendientes del usuario.
    *   Muestra información del pedido (ID, proveedor, estado, total, costo de envío).
    *   Permite al usuario "pagar" el costo de envío pendiente, lo que actualiza el estado del pedido en la base de datos.
*   `src/components/pagos-pendientes/PendingPaymentModal.jsx`:
    *   Nuevo componente modal para capturar datos de pago simulados (nombre, correo, tarjeta, mes, año, CVV) antes de registrar el pago de envío.

## Próximos Pasos
La implementación de la funcionalidad de "apartado de pagos pendientes" está completa a nivel de código. Se recomienda probar la funcionalidad para asegurar que:
1.  El icono de pagos pendientes aparece y es visible en el header para usuarios autenticados.
2.  El resumen desplegable funciona y muestra los datos correctos.
3.  La página `/pagos-pendientes` muestra la información detallada.
4.  Al hacer clic en "Pagar Ahora", se abre el modal de pago, permite la entrada de datos simulados y, al enviar, registra el pago y actualiza el estado del pedido.
5.  El `estadoPago` de los pedidos se actualiza correctamente cuando el proveedor añade un costo de envío y cuando el usuario lo paga.
