# Funcionalidad: Confirmación de Pedido

## Descripción
Esta funcionalidad se encarga de mostrar al usuario una página de confirmación después de que un pedido ha sido realizado exitosamente. Proporciona un resumen del pedido y los próximos pasos.

## Componentes Involucrados

### Frontend
*   **`src/app/confirmacion/page.jsx`**: La página que muestra la confirmación del pedido.

### Backend (Acciones de Servidor/API)
*   Podría interactuar con acciones de pedido (`src/app/acciones/PedidoActions.js`) para obtener los detalles finales del pedido si no se pasan directamente.

## Flujo de Trabajo

1.  Después de completar el proceso de pago, el usuario es redirigido a la página de confirmación (`/confirmacion`).
2.  La página muestra un mensaje de éxito y un resumen del pedido (número de pedido, artículos, total, dirección de envío, etc.).
3.  Puede incluir información sobre el tiempo estimado de entrega o instrucciones adicionales.

## Consideraciones Adicionales
*   Asegurar que los detalles del pedido se muestren de forma clara y concisa.
*   Proporcionar un número de pedido o identificador único para futuras referencias.
*   Considerar la opción de enviar un correo electrónico de confirmación al usuario.
