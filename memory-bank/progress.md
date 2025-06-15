# Project Progress

## Current Status:
- The `Pedido` model has been updated to include a `paymentId` field, ensuring a direct link to the payment transaction.
- The `GestionDePedidosYPagos.md` documentation has been updated to reflect this change and the "payment first" flow.
- The `Pago` model now correctly uses the centralized `MetodoPago` enum, replacing hardcoded values.
- The `PaymentForm.jsx` component has been updated to utilize the `MetodoPago` enum for payment method selection.
- A new directive has been added to `improvement_log.md` to ensure future enum reusability.
- The `Genero` enum has been correctly exported in `src/models/enums/usuario/index.js`.
- The profile page data fetching has been optimized on the client-side by ensuring `userDesigns` are re-fetched after a new design upload, improving UI consistency.
- Resolved repeated client-side console logs in `src/components/layout/ProfileContent.jsx` by moving them into a `useEffect` hook, ensuring they run only once on component mount.
- Implemented a shopping cart icon in the `HeaderPrincipal.jsx` component.
- Created a `CartModal.jsx` component that displays a preview of cart items (image, name, price, quantity) and a message for an empty cart.
- Reintroduced the dedicated `/carrito` page, rendering the `CartComponent` for a full cart view.
- The cart icon in the header now toggles the `CartModal` and fetches cart data.
- Added a directive to `.clinerules` to enforce the use of path aliases for imports.
- Refactored the `CartModal` to be a dropdown-style modal, similar to the profile menu, addressing the user's request for a transparent background behind the modal.
- Fixed `ReferenceError: handleCartIconClick is not defined` in `HeaderPrincipal.jsx` by ensuring the function and ref declaration were correctly included.
- Uncommented the `DesignGrid` component in `src/app/catalogo/page.jsx` to enable design display.
- Implemented `cartItems` state and fetch logic in `src/app/catalogo/page.jsx` to correctly pass cart data to `DesignGrid`, resolving the "Cannot read properties of undefined (reading 'some')" error.
- Corrected the syntax error in `src/components/catalogo/DesignGrid.jsx` related to `cartItems.some`.
- Fixed `Error: useModal is not defined` in `src/components/common/CartComponent.jsx` by importing `usePopUp` and replacing the incorrect hook usage.
- Enhanced the `/carrito` page to display design descriptions and categories, and removed the shipping cost display, showing only the subtotal and total.
- Fixed an issue where updating cart item quantity with an empty or invalid input caused a "Cast to Number failed" validation error by ensuring the raw string value is passed and parsed/validated in the correct component.
- Resolved a TypeScript error (`Se esperaba '...'`) in `CartItem.jsx` by refining the JSX structure and ensuring proper `alt` attribute for images.
- Optimized cart item quantity updates to prevent full component re-renders by updating the `cartItems` state locally instead of refetching the entire cart, and by memoizing `CartItem` and stabilizing callback functions in `CartComponent`.
- Extended local state updates to `handleAddItem`, `handleRemoveItem`, and `handleClearCart` in `CartComponent.jsx` to prevent full component re-renders on all cart modifications.
- Prevented the "Cargando" message from appearing during quantity updates by removing global loading state triggers from `handleUpdateQuantity`.
- Added subtotal display for each design item in `src/components/common/CartItem.jsx`.
- Resolved a syntax error in `src/components/common/CartComponent.jsx` by wrapping multiple JSX elements in a React Fragment.
- Resolved a runtime error in `src/components/common/CartComponent.jsx` by importing the `Link` component from `next/link`.
- Implemented a global cart state using `CartContext.jsx` to allow real-time updates of the cart icon in the navigation bar and other components.
- Integrated `CartProvider` into `SessionProviderWrapper.jsx` to make the cart context available throughout the application.
- Refactored `HeaderPrincipal.jsx` to consume `cartItems` from `CartContext`, ensuring the cart item count updates dynamically.
- Refactored `CartComponent.jsx` to use `cartItems`, `loadingCart`, `cartError`, and `updateCart` from `CartContext`, centralizing its state management.
- Modified `CartActions.js` (specifically `removeDesignFromCart` and `clearUserCart`) to consistently return the updated cart data, facilitating seamless global state synchronization.
- Refactored `src/app/catalogo/page.jsx` to utilize the global `CartContext` for managing cart items, ensuring real-time updates of the cart icon and design status in the catalog.
- Confirmed `src/components/catalogo/DesignGrid.jsx` correctly consumes the `cartItems` prop from its parent to display the `isInCart` status.
- Fixed an issue in `src/components/catalogo/DesignGrid.jsx` where designs already in the cart would incorrectly show the "Add to Cart" button. This was resolved by ensuring consistent ID type comparison (`item.id === diseño._id.toString()`) when checking if a design is in the cart.
- **Fixed React Warning: "Each child in a list should have a unique 'key' prop"** in `src/components/common/CartComponent.jsx` by ensuring a stable and unique key for `CartItem` components.
- **Fixed Runtime Error: "Cannot read properties of undefined (reading 'toFixed')"** in `src/components/common/CartItem.jsx` by safely handling `item.price` and `item.quantity` before calling `toFixed()`.
- **Fixed Missing Design Details After Quantity Update:** Ensured `src/app/acciones/CartActions.js` returns fully populated cart data after quantity updates.
- **Implemented client-side quantity and subtotal updates with debouncing:** Quantity changes in the cart now update the UI instantly, and server synchronization is debounced to improve performance (debounce delay adjusted to 1 second).
- **Fixed item not removing when quantity is 0:** Modified `src/components/common/CartComponent.jsx` to remove items from the client-side cart state when their quantity is set to 0.
- **Implemented optimistic updates and debouncing for "Add to Cart" in Catalog Page:** Refactored `src/app/catalogo/page.jsx` to use optimistic UI updates and debounced server synchronization when adding designs to the cart, improving perceived performance and user experience.

## Remaining Tasks:
- Identify and refactor other pages/components with iterative changes as per the new "Patrones de Sincronización de Datos".
