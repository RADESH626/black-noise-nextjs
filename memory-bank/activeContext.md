# Active Context

## Current Session: Cart Page Enhancements and Bug Fixes

### Date: 2025-06-14

### Task: Enhance cart page information and display, and fix React warnings.

### Details:
- **Objective:** Display more design information (description, category), show subtotal, hide shipping cost on the `/carrito` page, and resolve the "unique key prop" warning in `CartComponent.jsx` and "Cannot read properties of undefined (reading 'toFixed')" in `CartItem.jsx`, and ensure full design details are rendered after quantity updates. Implement client-side quantity and subtotal updates with debouncing for server synchronization.

### Actions Taken:
1.  **Modified `src/components/common/CartComponent.jsx`:** Removed shipping cost display and adjusted total calculation to only include subtotal.
2.  **Modified `src/app/acciones/CartActions.js`:** Updated `getCartByUserId` to populate `descripcion` and `categoria` fields from the `Design` model.
3.  **Modified `src/components/common/CartItem.jsx`:** Added display for `item.descripcion` and `item.categoria`.
4.  **Modified `src/components/common/CartItem.jsx`:** Added display for the subtotal of each item (`item.price * item.quantity`).
5.  **Modified `src/components/common/CartComponent.jsx`:** Updated the `key` prop in the `cartItems.map` function to ensure a unique and stable key for each `CartItem`. The `map` callback now includes `index`, and the key is `item.id ? String(item.id) : `${item.name || 'unknown'}-${index}``.
6.  **Modified `src/components/common/CartItem.jsx`:** Implemented safe access to `item.price` and `item.quantity` using the nullish coalescing operator (`?? 0`) before calling `toFixed(2)` to prevent "Cannot read properties of undefined" errors.
7.  **Modified `src/app/acciones/CartActions.js`:** Ensured that `updateCartItemQuantity` returns the fully populated cart data, including all design details, after a quantity update. This prevents the loss of design information when the cart state is updated in the frontend.
8.  **Modified `src/components/common/CartComponent.jsx`:** Implemented client-side quantity updates with debouncing. Quantity changes now update the UI instantly, and a debounced server call (`updateCartItemQuantity`) is made after a 1000ms (1 second) delay to synchronize with the backend.
9.  **Modified `src/components/common/CartComponent.jsx`:** Adjusted `handleUpdateQuantity` to correctly remove an item from the client-side cart state when its quantity is set to 0.

### Problems Encountered:
-   `ERROR in updateCartItemQuantity: Error: Cart validation failed: items.0.quantity: Cast to Number failed for value "NaN" (type number) at path "quantity"`: This error occurred because `parseInt(e.target.value)` was being called in `CartItem.jsx` before passing the value to `CartComponent.jsx`, leading to `NaN` being passed to the action.
    -   **Correction:** Modified `src/components/common/CartItem.jsx` to pass the raw string value (`e.target.value`) directly to `onUpdateQuantity`. The parsing and validation of the quantity now occur solely within `src/components/common/CartComponent.jsx`.
-   `[ts Error] Line 25: Se esperaba '...'.`: This TypeScript error in `src/components/common/CartItem.jsx` was likely due to a subtle JSX parsing issue or malformed structure.
    -   **Correction:** Rewrote the JSX structure within `src/components/common/CartItem.jsx` to ensure clean and correctly formed JSX, and updated `alt={item.nombre || 'Design Image'}` for the image.
-   **Unnecessary full component re-render on cart modifications:** The `CartComponent` was re-rendering entirely on any cart modification (add, remove, update quantity, clear) because `fetchCart()` was called, causing the `cartItems` state to be replaced with a new array reference, and also due to unstable function references passed to memoized child components.
    -   **Correction:** Modified `src/components/common/CartComponent.jsx` to update the `cartItems` state locally after successful `addDesignToCart`, `removeDesignFromCart`, `updateCartItemQuantity`, and `clearUserCart` API calls. This prevents full re-fetches. Additionally, wrapped `handleUpdateQuantity`, `handleRemoveItem`, `handleAddItem`, and `handleClearCart` functions with `useCallback` to ensure stable references.
    -   **Correction:** Wrapped `CartItem` component in `src/components/common/CartItem.jsx` with `React.memo` to prevent unnecessary re-renders when its props haven't changed.
-   **"Cargando" message appearing on quantity update:** The global `loading` state was being triggered by `setLoading(true)` and `setLoading(false)` calls within `handleUpdateQuantity`, causing the "Cargando carrito..." message to appear.
    -   **Correction:** Removed `setLoading(true)` and `setLoading(false)` calls specifically from the `handleUpdateQuantity` function in `src/components/common/CartComponent.jsx`. This ensures that quantity updates do not trigger the global loading indicator.
-   **Syntax Error: Expected ',', got 'href' in `src/components/common/CartComponent.jsx`:** This error occurred because multiple JSX elements were returned directly within a conditional block without being wrapped in a single parent element (like a React Fragment).
    -   **Correction:** Wrapped the `<p>` tag and `Link` component within a React Fragment (`<>...</>`) in `src/components/common/CartComponent.jsx` to ensure valid JSX syntax.
-   **Runtime Error: Link is not defined in `src/components/common/CartComponent.jsx`:** This error occurred because the `Link` component was used without being imported from `next/link`.
-   **Correction:** Added `import Link from 'next/link';` to `src/components/common/CartComponent.jsx`.
-   **Implemented Global Cart State:** Created `src/context/CartContext.jsx` to manage the global state of the shopping cart, including `cartItems`, loading status, and error handling.
-   **Integrated Cart Provider:** Wrapped the application with `CartProvider` in `src/app/SessionProviderWrapper.jsx` to make the cart state accessible to all components.
-   **Refactored HeaderPrincipal:** Modified `src/components/layout/general/HeaderPrincipal.jsx` to consume `cartItems` from `CartContext`, enabling the cart icon to dynamically display the number of items.
-   **Refactored CartComponent:** Updated `src/components/common/CartComponent.jsx` to utilize `cartItems`, `loadingCart`, `cartError`, and `updateCart` from `CartContext`, centralizing its state management.
-   **Enhanced Cart Actions:** Modified `src/app/acciones/CartActions.js` (specifically `removeDesignFromCart` and `clearUserCart`) to ensure all cart-related server actions consistently return the updated cart data, facilitating seamless global state synchronization.
-   **Refactored Catalog Page for Real-time Updates:** Modified `src/app/catalogo/page.jsx` to remove local cart state and integrate with the global `CartContext`. The `handleAddItemToCart` function now updates the global cart state after a successful addition, ensuring the cart icon and design status in the catalog update in real-time.
-   **Verified DesignGrid Usage:** Confirmed that `src/components/catalogo/DesignGrid.jsx` correctly receives and utilizes the `cartItems` prop from its parent (`src/app/catalogo/page.jsx`) to display whether a design is in the cart.
-   **Fixed Design Status in Catalog:** Corrected the logic in `src/components/catalogo/DesignGrid.jsx` to ensure that designs already in the cart correctly display their status (e.g., "En el carrito" en lugar de "Agregar al carrito"). This was achieved by ensuring a consistent type comparison (`item.id === diseño._id.toString()`) when checking if a design is in the cart.
-   **React Warning: "Each child in a list should have a unique 'key' prop"** in `src/components/common/CartComponent.jsx` by ensuring a stable and unique key for `CartItem` components.
-   **Runtime Error: "Cannot read properties of undefined (reading 'toFixed')"**: This error occurred in `src/components/common/CartItem.jsx` because `item.price` or `item.quantity` were `undefined` when `toFixed()` was called.
    -   **Correction:** Modified `src/components/common/CartItem.jsx` to safely access `item.price` and `item.quantity` using the nullish coalescing operator (`?? 0`) before performing calculations or calling `toFixed()`.
-   **Missing Design Details After Quantity Update:** When updating the quantity of designs, only price and subtotal were rendered, and full design details were missing.
    -   **Correction:** Modified `src/app/acciones/CartActions.js` to ensure that `updateCartItemQuantity` returns the fully populated cart data, including all design details, after a quantity update.
-   **Quantity 0 does not remove item from UI:** When a user set the quantity of an item to 0, the item remained in the UI with a quantity of 0 instead of being removed.
    -   **Correction:** Modified `src/components/common/CartComponent.jsx` to filter out items from the `cartItems` state when their `newQuantity` is 0, ensuring immediate UI removal.
-   **Implemented Optimistic Updates and Debouncing for Cart Actions:** Refactored `handleAddItem`, `handleRemoveItem`, and `handleClearCart` in `src/components/common/CartComponent.jsx` to:
    *   Perform immediate optimistic UI updates on user action.
    *   Use separate `useRef` debouncers for each action to delay server synchronization calls (`addDesignToCart`, `removeDesignFromCart`, `clearUserCart`) by 1000ms.
    *   Implement rollback logic to revert client-side state if the server update fails.
    *   Adjusted the debounce time for `handleUpdateQuantity` to 1000ms for consistency.
-   **Refactored Catalog Page for Optimistic Add to Cart:** Applied the optimistic update and debounced synchronization pattern to `src/app/catalogo/page.jsx`. The `handleAddItemToCart` function now:
    *   Optimistically adds the design to the cart state immediately.
    *   Uses `useRef` and `setTimeout` to debounce the `addDesignToCart` server action.
    *   Includes rollback logic to revert the UI state if the server action fails.
    *   Removed `alert` calls, relying on console logs for now.
-   **Implemented Optimistic Updates and Debouncing for User Design Management:** Applied the optimistic update and debouncing pattern to the user's design management in the profile page (`/perfil`).
    *   **Modified `src/components/common/DesignsComponent.jsx`**: Added "Edit" and "Delete" buttons, conditionally rendered based on a new `mode` prop ('profile' vs 'catalog').
    *   **Created `src/components/perfil/FormEditarDesign.jsx`**: A new client component for editing design details, utilizing `actualizarDesign` server action.
    *   **Modified `src/components/layout/ProfileContent.jsx`**:
        *   Implemented `handleDeleteDesign` with optimistic UI updates (removes design immediately), debouncing (`eliminarDesign` server action after 500ms), and rollback on error.
        *   Implemented `handleUpdateDesign` with optimistic UI updates (updates design details immediately), debouncing (`actualizarDesign` server action after 500ms), and rollback on error.
        *   Updated `handleEditDesign` to open `FormEditarDesign` modal, passing design data and `handleUpdateDesign` as a callback.
        *   Passed `mode="profile"`, `handleEditDesign`, and `handleDeleteDesign` to `DesignsComponent`.
        *   Removed unnecessary `cartItems` and `orderedDesignIds` props from `DesignsComponent` when in 'profile' mode.
    *   Removed `onPaymentSuccess={fetchCartData}` from `PedidosComponent` as `fetchCartData` was not defined in this context.
-   **Implemented Optimistic Updates and Rollback for Admin User Profile Picture Management:**
    *   **Modified `src/app/admin/users/page.jsx`**: Implemented optimistic UI updates for profile picture changes, displaying the new image immediately after selection.
    *   Added a loading state to the update button to prevent multiple submissions.
    *   Implemented rollback logic to revert to the previous profile picture if the `actualizarFotoPerfilUsuarioPorAdmin` server action fails.
    *   **Created `memory-bank/functionalities/AdminUserManagement.md`**: Documented the new functionality and the application of optimistic updates and rollback.

### Next Steps:
-   Update `progress.md` and generate git commands.
-   Identify and refactor other pages/components with iterative changes as per the new "Patrones de Sincronización de Datos".
-   Consider if any other pages in `src/app/admin/` or other user-facing pages could benefit from this pattern.

## Login Credentials (Provided by User)

These credentials can be used for testing different user roles in the application:

*   **Cliente:** `vscodeCLiente@gmail.com`
*   **Proveedor:** `vscodeProveedor@gmail.com`
*   **Administrador:** `vscodeAdministrador@gmail.com`

**Contraseña para todos los roles:** `Contraseña123@`

### Operational Directives for Login

*   **Normal User Flow:** When initiating a login, always follow the normal user flow (click email field, type email, click password field, type password, click the *text* "Iniciar Sesión") without attempting any shortcuts or direct navigations that bypass the standard login page interaction.

### General Operational Directives

*   **Avoid MCP Tools:** Do not use Model Context Protocol (MCP) tools unless explicitly instructed or if no other alternative exists. This includes the `browser_action` tool.
