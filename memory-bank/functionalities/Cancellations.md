# Cancellations Functionality

## Description
This functionality allows users to cancel their orders. The process involves defining the order states in which a cancellation is allowed, sending a confirmation email to the user, and displaying cancelled orders in the user's profile.

## User Flow
1.  **Lógica de Cancelación:** Define in which states an order can be cancelled by the user. Actualmente, solo los pedidos en estado `PENDIENTE` pueden ser cancelados por el usuario.
2.  **Mensaje de Confirmación:** Send a confirmation email to the user upon cancellation.
3.  **Visibilidad en el Perfil:** Cancelled orders should appear highlighted and be filterable in the user's profile.

## Implementation Details
*   **Order Status:** Define the order statuses in which a cancellation is allowed. La cancelación por parte del usuario solo está permitida para pedidos en estado `PENDIENTE`. La lógica de cancelación se maneja en la función `cancelarPedido` en `src/app/acciones/PedidoActions.js`.
*   **API Endpoint:** La lógica de cancelación se maneja directamente a través de una Server Action (`cancelarPedido`) en `src/app/acciones/PedidoActions.js`, eliminando la necesidad de un endpoint API REST separado.
*   **Email Notification:** Se utiliza la función `enviarNotificacionCambioEstadoPedido` en `src/app/acciones/PedidoActions.js` para enviar un correo de confirmación al usuario cuando el pedido es cancelado.
*   **User Profile:** La página `src/components/perfil/pedidos/PedidosClientePage.jsx` ahora incluye un botón "Cancelar Pedido" para pedidos `PENDIENTE` y una opción para mostrar/ocultar pedidos cancelados.
