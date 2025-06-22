# Cancellations Functionality

## Description
This functionality allows users to cancel their orders. The process involves defining the order states in which a cancellation is allowed, sending a confirmation email to the user, and displaying cancelled orders in the user's profile.

## User Flow
1.  **Lógica de Cancelación:** Define in which states an order can be cancelled by the user.
2.  **Mensaje de Confirmación:** Send a confirmation email to the user upon cancellation.
3.  **Visibilidad en el Perfil:** Cancelled orders should appear highlighted and be filterable in the user's profile.

## Implementation Details
*   **Order Status:** Define the order statuses in which a cancellation is allowed.
*   **API Endpoint:** Create an API endpoint to handle the cancellation request and send the confirmation email to the user.
*   **Email Notification:** Use the existing email sending functionality or create a new one for the cancellation confirmation.
*   **User Profile:** Update the user profile to display cancelled orders highlighted and filterable.
