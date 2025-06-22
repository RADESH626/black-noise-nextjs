# Cancellations Functionality

## Description
This functionality allows users to cancel their orders. The process involves defining the order states in which a cancellation is allowed, sending a confirmation email to the user, and displaying cancelled orders in the user's profile.

## User Flow
1.  **Lógica de Cancelación:** Define in which states an order can be cancelled by the user. Only orders with the status "PENDIENTE" can be cancelled.
2.  **Mensaje de Confirmación:** Send a confirmation email to the user upon cancellation.
3.  **Visibilidad en el Perfil:** Cancelled orders appear highlighted and are filterable in the user's profile.

## Implementation Details
*   **Order Status:** Cancellations are allowed only when the order status is "PENDIENTE".
*   **API Endpoint:** The cancellation request is handled by the `/api/cancelar-pedido` endpoint.
*   **Email Notification:** The system sends a confirmation email to the user upon successful cancellation.
*   **User Profile:** The user profile displays cancelled orders highlighted and filterable.
*   **Supplier View:** The supplier can view cancelled orders in their panel.

## API Endpoints
*   `/api/cancelar-pedido`: Handles the cancellation request.
*   `/api/proveedor/cancellations`: Returns a list of cancelled orders for the supplier.

## Components
*   `src/components/common/PedidosComponent.jsx`: Displays the customer's orders and handles the cancellation action.
*   `src/components/proveedor/DevolucionesProveedor.jsx`: Displays the cancelled orders for the supplier.
