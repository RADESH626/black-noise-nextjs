# Cart Functionality

## Overview

This document describes the `Cart` model and its associated functionality, which has been refactored to integrate directly into the user's profile section. The dedicated `/carrito` page has been removed.

## Purpose

The primary purpose of the `Cart` model and its functionality is to:
- Persist the selected design IDs and quantities for a user's shopping cart.
- Enable efficient retrieval and display of design information within the cart component in the user's profile section.
- Facilitate the process of proceeding to payment directly from the user's profile.

## Data Structure

The `Cart` model has the following schema:

- `userId`: (String, Required, Unique) The ID of the user to whom this cart belongs. This ensures each user has a single cart.
- `items`: (Array of Objects, Default: []) An array containing objects, each with:
    - `designId`: (ObjectId, Ref: 'Design') The ID of the design.
    - `quantity`: (Number, Default: 1) The quantity of this design in the cart.

## Usage

### Managing Cart Items

When a user adds a design to their cart, the `designId` and quantity are managed within the `items` array of their corresponding `Cart` document. If a cart document does not exist for the user, a new one will be created. Server actions handle all interactions with the database for adding, removing, updating quantities, and clearing the cart.

### Displaying Cart Information

The cart information is now displayed exclusively within the user's profile, under the "Carrito" tab. The `CartComponent` fetches the cart data and renders the list of items, along with a summary of the total cost and options to clear the cart or proceed to payment.

## Interaction Flow: Client-side to Server-side Cart

The client-side cart management is synchronized with the server-side `Cart` model via server actions.

1.  **Client-side Action**: When a user interacts with cart functionality (e.g., "Add to Cart", "Remove Item", "Update Quantity", "Clear Cart"), the relevant server action from `src/app/acciones/CartActions.js` is invoked.
2.  **Server Action Call**: Server actions receive the `userId` and design-specific data (e.g., `designId`, `newQuantity`).
3.  **Server-side Logic**:
    *   The server action connects to the database.
    *   It performs the necessary CRUD operations on the `Cart` document (create, read, update, delete items).
    *   `revalidatePath('/perfil')` is used to ensure the user's profile page (where the cart is displayed) reflects the latest cart state.
    *   The server returns a success or error response.
4.  **Client-side Update**: Based on the server's response, the `CartComponent` updates its local state to reflect the changes, ensuring consistency in the UI.

## Related Components/Files

- `src/models/Cart.js`: The Mongoose schema definition for the Cart model.
- `src/app/acciones/CartActions.js`: Server actions to handle all server-side cart operations (add, remove, update quantity, clear, get cart).
- `src/components/common/CartComponent.jsx`: The main component responsible for displaying and managing the cart within the user profile. It now includes the full cart display, summary, and payment initiation.
- `src/components/common/CartItem.jsx`: Renders a single item within the cart list.
- `src/components/layout/ProfileContent.jsx`: The parent component that renders `CartComponent.jsx` when the 'Carrito' tab is active.
- `src/components/layout/general/HeaderPrincipal.jsx`: Updated to link directly to `/perfil` for cart access.
- `src/app/confirmacion/page.jsx`: Updated to redirect to `/perfil` if no order is found.

## UI/UX Changes

The cart functionality has been fully integrated into the user profile.
-   The dedicated `/carrito` page has been removed.
-   The `CartComponent` (`src/components/common/CartComponent.jsx`) now provides the complete cart experience within the user's profile 'Carrito' tab, including:
    -   Display of all cart items with quantity controls and removal options.
    -   Calculation and display of subtotal, shipping, and total to pay.
    -   "Vaciar Carrito" (Clear Cart) button.
    -   "Pagar Ahora" (Pay Now) button, which navigates the user to the `/pago` page.
-   The `CartLeftPanel`, `CartItemsList`, and `CartSummaryAndPayment` components from `src/components/carrito/` have been removed as their functionality is now consolidated.
