# Supplier Returns and Cancellations Management

This functionality allows suppliers to view and manage returns and cancellations requested by users.

## Functionality

-   **View Returns:** Suppliers can view a list of orders that users have requested to return, including the reason for the return.
-   **Manage Returns:** Suppliers can approve or reject return requests.
-   **View Cancellations:** Suppliers can view a list of orders that have been canceled.

## Implementation Details

-   A new view will be created in the supplier panel to display returns and cancellations.
-   The view will fetch data from the database to display the relevant information.
-   Suppliers will be able to filter and sort the list of returns and cancellations.

## UI Design

-   The view will use a table to display the list of returns and cancellations.
-   Each row in the table will display the order ID, user ID, return reason (if applicable), and cancellation date (if applicable).
-   Suppliers will be able to click on a row to view more details about the order.

## Data Model

-   The `Pedido` model will be updated to include a `returnReason` field.
-   The `Pedido` model will have a `status` field to indicate if the order is canceled.

## Future Considerations

-   Implement notifications to alert suppliers of new return requests.
-   Allow suppliers to communicate with users regarding return requests.
