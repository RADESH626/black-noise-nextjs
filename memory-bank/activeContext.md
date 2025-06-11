# Session Change Log

## Task: Fix - Prevent adding already ordered designs to cart

### Description:
Corrected a logic issue where designs already part of a user's order (paid or pending) still showed the "Add to Cart" button in the "Diseños" tab of the user profile.

### Changes Made:
1.  **Identified Parent Component**: Confirmed `src/components/layout/ProfileContent.jsx` as the parent component rendering `DesignsComponent.jsx`.
2.  **Modified `src/components/layout/ProfileContent.jsx`**:
    *   Imported `obtenerPedidosPorUsuarioId` from `src/app/acciones/PedidoActions.js`.
    *   Added `userOrders`, `ordersLoading`, `ordersError`, and `orderedDesignIds` states.
    *   Implemented `fetchOrdersData` to fetch user orders and extract `designId`s from all items within those orders, storing them in a `Set` called `orderedDesignIds`.
    *   Called `fetchOrdersData` within the `useEffect` hook.
    *   Passed `orderedDesignIds` as a new prop to `DesignsComponent`.
3.  **Modified `src/components/common/DesignsComponent.jsx`**:
    *   Accepted `orderedDesignIds` as a new prop.
    *   Updated the conditional rendering logic for the "Agregar al carrito" button. Now, it first checks if `design._id` is present in `orderedDesignIds`. If true, it displays a disabled button with the text "Ya en un pedido". Otherwise, it proceeds to check if the design is in the current `cartItems`.

### Files Modified:
- `src/components/layout/ProfileContent.jsx`
- `src/components/common/DesignsComponent.jsx`
