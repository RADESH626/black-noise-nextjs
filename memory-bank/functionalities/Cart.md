# Cart Model Functionality

## Overview

This document describes the `Cart` model, which is designed to store a list of design IDs associated with a user's shopping cart. This model will facilitate the retrieval and display of design information within the cart component in the user's profile section.

## Purpose

The primary purpose of the `Cart` model is to:
- Persist the selected design IDs for a user's shopping cart.
- Enable efficient retrieval of design details when rendering the cart view.
- Decouple the cart's content storage from the actual design data, allowing for flexible updates to design information without affecting existing cart entries.

## Data Structure

The `Cart` model will have the following schema:

- `userId`: (String, Required, Unique) The ID of the user to whom this cart belongs. This ensures each user has a single cart.
- `designIds`: (Array of Strings, Default: []) An array containing the IDs of the designs added to the cart.

## Usage

### Storing Design IDs

When a user adds a design to their cart, the `designId` will be added to the `designIds` array of their corresponding `Cart` document. If a cart document does not exist for the user, a new one will be created. This process will involve a server action to interact with the database.

### Retrieving Design Information

In the cart component (likely located in `src/app/perfil/` or `src/app/carrito/`), the `designIds` from the `Cart` model will be used to query the `Design` model and fetch the complete details of each design. This approach ensures that the displayed design information is always up-to-date.

## Interaction Flow: Client-side to Server-side Cart

The client-side cart management (using `useCartStorage` hook) will now be synchronized with the server-side `Cart` model.

1.  **Client-side Action**: When a user clicks "Add to Cart" on a design, the `addItem` function in `useCartStorage` will be called.
2.  **Server Action Call**: Inside `addItem`, a new server action (e.g., `addDesignToCart`) from `src/app/acciones/CartActions.js` will be invoked. This server action will receive the `userId` and `designId`.
3.  **Server-side Logic**:
    *   The server action will connect to the database.
    *   It will check if a `Cart` document already exists for the given `userId`.
    *   If no cart exists, a new `Cart` document will be created for the user.
    *   The `designId` will be added to the `designIds` array of the user's `Cart` document.
    *   The server will return a success or error response.
4.  **Client-side Update**: Based on the server's response, the `useCartStorage` hook will update its local state and `localStorage` to reflect the changes, ensuring consistency.

## Related Components/Files

- `src/models/Cart.js`: The Mongoose schema definition for the Cart model.
- `src/models/index.js`: Where the Cart model will be exported.
- `src/app/carrito/page.jsx`: The main cart page where designs will be displayed.
- `src/app/perfil/page.jsx` (or a sub-component): Where the cart information might be accessed and displayed within the user's profile.
- `src/hooks/useCartStorage.js`: The client-side hook that manages cart state and will now interact with server actions.
- `src/app/acciones/CartActions.js`: A new actions file to handle server-side cart operations (add, remove, clear designs).

## UI/UX Changes

The cart view has been updated to improve its layout and functionality based on the provided design. Key changes include:
- The main cart section in `src/app/carrito/page.jsx` now uses a `flex-col` layout with `justify-between` to stack cart items and the summary vertically, pushing the summary to the bottom of the available space and improving readability and flow.
- The `CartItemsList` component (`src/components/carrito/CartItemsList.jsx`) has been refactored to display cart items in a grid layout, similar to the design cards in the user profile's "DISEÑOS" tab. This includes:
    - Changing its main container to a responsive grid (`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`).
    - Styling individual cart items as cards (`bg-gray-800 rounded-xl shadow-lg overflow-hidden`) with an image, name, price, quantity input, and an "Eliminar" button.
    - It now accepts `updateQuantity` and `removeItem` functions as props from `src/app/carrito/page.jsx` to manage item quantities and removal.
- The `CartSummaryAndPayment` component (`src/components/carrito/CartSummaryAndPayment.jsx`) has been refactored to:
    - Remove the "TU PEDIDO" header, "Cantidad de productos", "Costo de envío", and the "PAGAR AHORA" button.
    - Introduce "Agregar a Pedido" and "Vaciar Carrito" buttons, positioned horizontally alongside the "Total" display.
    - Adjust its width to `w-full` and remove `mt-20` to ensure proper alignment and responsiveness within its parent container.

### CartComponent (in User Profile)

The `CartComponent` located at `src/components/common/CartComponent.jsx` is responsible for displaying the user's shopping cart within the user profile section (`src/components/layout/ProfileContent.jsx`).

**Current Implementation:**
-   **State Management**: Manages `cartItems`, `loading`, `error`, and `isCreatingOrder` states.
-   **Data Fetching**: Fetches cart data using `getCartByUserId` from `src/app/acciones/CartActions.js`.
-   **Item Rendering**: Iterates over `cartItems` to display each item's image, name, price, quantity input, and a remove button.
-   **Total Calculation**: Calculates and displays the total price of all items.
-   **Actions**: Provides buttons for "Agregar a Pedido" (Add to Order) and "Vaciar Carrito" (Clear Cart), interacting with `PedidoActions.js` and `CartActions.js` respectively.

**Proposed Refactoring:**

To improve modularity, readability, and reusability, the `CartComponent` will be refactored into two distinct components:

1.  **`CartItem.jsx` (New Component)**:
    *   **Location**: `src/components/common/CartItem.jsx`
    *   **Responsibility**: Render a single cart item.
    *   **Props**: Will receive `item` data, `onUpdateQuantity` handler, and `onRemoveItem` handler.
    *   **Content**: Will display the item's image, name, price, a quantity input field, and a button to remove the item from the cart.

2.  **`CartComponent.jsx` (Modified)**:
    *   **Location**: `src/components/common/CartComponent.jsx`
    *   **Responsibility**: Act as a container for the cart, managing overall cart state, data fetching, total calculation, and orchestrating cart-level actions.
    *   **Changes**:
        *   Will no longer directly render individual cart item details.
        *   Will iterate over `cartItems` and render a `CartItem` component for each item, passing the necessary props.
        *   Will retain its current logic for fetching cart data, calculating the total, and handling "Agregar a Pedido" and "Vaciar Carrito" actions.

**Rationale for Refactoring:**

-   **Separation of Concerns**: Clearly separates the responsibility of displaying a single cart item from managing the entire cart's state and actions.
-   **Improved Readability**: Makes `CartComponent.jsx` less cluttered and easier to understand by delegating item-level rendering to `CartItem.jsx`.
-   **Increased Reusability**: `CartItem.jsx` can be potentially reused in other parts of the application where a single cart item needs to be displayed (e.g., order summaries).
-   **Easier Maintenance**: Changes to the display or interaction of a single cart item will only require modifications to `CartItem.jsx`, reducing the risk of unintended side effects in the main `CartComponent.jsx`.
