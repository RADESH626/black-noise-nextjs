# Returns Functionality

## Description
This functionality allows users to request returns for their orders. The process involves a modal for the user to select a reason for the return, a review process by the supplier, email notifications, and order status updates.

## User Flow
1.  **Modal de Devolución:** When the user clicks on "Solicitar Devolución", a modal is displayed to select the reason for the return.
2.  **Lógica para "Otra" Razón:** If the user chooses "Otra" as the reason, a text box is displayed for them to specify the reason.

### Reasons for Return
*   El producto llegó dañado o es defectuoso.
*   La talla o el tamaño es incorrecto.
*   Recibí un artículo equivocado.
*   El producto es diferente a la descripción o a las fotos. (Posible negociación para rehacer pedido)
*   La calidad no es la esperada. (Posible negociación para rehacer pedido)
*   Otra (mostrar campo de texto para especificar). (Posible negociación para rehacer pedido)

## Review, Notification, and Status Flow
1.  **Proceso de Revisión Manual:** All return requests must be reviewed by the supplier. The supplier must contact the customer to agree on the details.
2.  **Notificación por Correo:** An email is sent to the supplier when a return is requested.
3.  **Cambio de Estado del Pedido (Flujo Sugerido):**
    *   Usuario solicita devolución -> El sistema cambia el estado a "Solicitud de devolución".
    *   Proveedor revisa la solicitud -> El proveedor contacta al cliente. Desde su panel, puede:
        *   Aprobar Devolución (Reembolso total/parcial): Cambia el estado a "Devolución aprobada".
        *   Rechazar Devolución: Cambia el estado a "Devolución rechazada" y debe rellenar un campo obligatorio con el motivo.
        *   Proponer "Rehacer Pedido": Inicia el flujo de negociación de costos.
    *   Proveedor recibe el producto (si aplica) -> Cambia el estado a "Devolución completada".

## Flujo para Rehacer Pedido:
1.  **Interfaz de Negociación:** If the supplier chooses "Rehacer Pedido", they must have an interface to configure the new order. This interface should:
    *   Display the original order details.
    *   Allow the supplier to adjust the costs of the new order.

2.  **Cost Adjustment Options:** The supplier should be able to adjust the following costs:
    *   Manufacturing cost
    *   Shipping cost
    *   Discount

3.  **Customer Approval:** The customer must approve these new terms.
    *   The system should send a notification to the customer with the new order details and the adjusted costs.
    *   The customer should be able to approve or reject the new terms.

4.  **Nuevo Pedido sin Costo (o costo negociado):** Upon confirmation, the system generates a new order linked to the original with the negotiated costs. The new order should have a status of "Pedido a Rehacer".

5.  **Visibilidad para el Proveedor:** The supplier will see this new order in their panel, clearly marked as a "Pedido a Rehacer". The supplier should be able to view the details of the new order, including:
    *   The original order details.
    *   The adjusted costs.
    *   The customer's approval status.

## Implementation Details
*   **Modal Component:** The `src/components/common/modales/Modal.jsx` component is used for the return request.
*   **API Endpoint:** The return request is handled by the `/api/devoluciones` endpoint.
*   **Order Status:** The order status is updated to "SOLICITUD\_DE\_DEVOLUCION" in the database.
*   **Email Notification:** The system sends an email notification to the supplier upon a return request.
*   **Supplier View:** The supplier can view return requests in their panel.

## API Endpoints
*   `/api/devoluciones`: Handles the return request.
*   `/api/proveedor/returns`: Returns a list of return requests for the supplier.

## Components
*   `src/components/common/PedidosComponent.jsx`: Displays the customer's orders and handles the return request action.
*   `src/components/proveedor/DevolucionesProveedor.jsx`: Displays the return requests for the supplier.
