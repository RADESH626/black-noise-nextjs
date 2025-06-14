# Active Context

## Current Session: Cart Page Enhancements

### Date: 2025-06-14

### Task: Enhance cart page information and display.

### Details:
- **Objective:** Display more design information (description, category), show subtotal, and hide shipping cost on the `/carrito` page.

### Actions Taken:
1.  **Modified `src/components/common/CartComponent.jsx`:** Removed shipping cost display and adjusted total calculation to only include subtotal.
2.  **Modified `src/app/acciones/CartActions.js`:** Updated `getCartByUserId` to populate `descripcion` and `categoria` fields from the `Design` model.
3.  **Modified `src/components/common/CartItem.jsx`:** Added display for `item.descripcion` and `item.categoria`.
4.  **Modified `src/components/common/CartItem.jsx`:** Added display for the subtotal of each item (`item.price * item.quantity`).

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

### Next Steps:
-   Update `progress.md` and generate git commands.

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
