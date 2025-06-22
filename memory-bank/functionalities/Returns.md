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
    *   Proveedor revisa la solicitud -> El proveedor contacts the customer. From their panel, they can:
        *   Aprobar Devolución (Reembolso total/parcial): Changes the status to "Devolución aprobada".
        *   Rechazar Devolución: Changes the status to "Devolución rechazada" and must fill in a mandatory field with the reason.
        *   Proponer "Rehacer Pedido": Starts the cost negotiation flow.
    *   Proveedor recibe el producto (si aplica) -> Changes the status to "Devolución completada".

## Flujo para Rehacer Pedido:
1.  **Interfaz de Negociación:** If the supplier chooses "Rehacer Pedido", they must have an interface to configure the new order.
2.  **Negociación de Costos:** The supplier will be able to adjust the costs of the new order (e.g., free manufacturing, customer pays shipping; or vice versa). The customer must approve these new terms.
3.  **Nuevo Pedido sin Costo (o costo negociado):** Upon confirmation, the system generates a new order linked to the original with the negotiated costs.
4.  **Visibilidad para el Proveedor:** The supplier will see this new order in their panel, clearly marked as a "Pedido a Rehacer".

## Implementation Details
*   **Modal Component:** Use the existing `src/components/common/modales/Modal.jsx` or create a new modal component for the return request.
*   **API Endpoint:** Create an API endpoint to handle the return request and send the email notification to the supplier.
*   **Order Status:** Update the order status in the database.
*   **Email Notification:** Use the existing email sending functionality or create a new one for the return request notification.
*   **Interfaz de Negociación:** Create an interface for the supplier to configure the new order.
*   **Negociación de Costos:** Implement the logic for the supplier to adjust the costs of the new order.
*   **Nuevo Pedido sin Costo (o costo negociado):** Implement the logic to generate a new order linked to the original with the negotiated costs.
*   **Visibilidad para el Proveedor:** Update the supplier panel to display the new order clearly marked as a "Pedido a Rehacer".
