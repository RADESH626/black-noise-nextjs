# Active Session Context

## Date: 2025-06-15

## Task: Fix supplier dashboard redirection

### Problem:
When a supplier logs in, they are not redirected to their specific dashboard (`/proveedor/pedidos`) but instead to `/catalogo`, and then potentially to `/proveedor` by middleware, and then finally redirected back to `/login`. The issue persisted even after initial fixes and client-side redirect disabling. Additionally, an error "Only plain objects can be passed to Client Components" was encountered when fetching orders.

### Analysis:
- **Initial Redirection Issue:** `src/components/layout/general/forms/FormLogin.jsx` handles client-side redirection based on `state.data.userRole` returned by `loginAction`. `src/app/acciones/UsuariosActions.js` (`loginAction` function) was authenticating suppliers but not explicitly setting `userRole: 'PROVEVEEDOR'` in the returned `data` object. This caused `FormLogin` to default to `/catalogo` for suppliers.
- **Subsequent Redirection to Login (Root Cause):** The `authorize` callback in `src/app/api/auth/[...nextauth]/route.js` was authenticating suppliers through the `Usuario` model path first. If a `Usuario` with `rol: PROVEEDOR` was found, the `authorize` callback would return an object with `isSupplier: false` (hardcoded for the `Usuario` path), even though the `Proveedor` specific authentication path (which sets `isSupplier: true`) was not reached. This `isSupplier: false` was then propagated to the client-side session, causing the redirect from `/proveedor/pedidos`.
- **"Only plain objects" Error:** The `obtenerPedidosPorProveedorId` server action in `src/app/acciones/PedidoActions.js` was returning Mongoose documents (or objects with `ObjectId` buffers) that were not fully converted to plain JavaScript objects, causing an error when passed to the client-side `ListaPedidosProveedorPage`.

### Solution Implemented:
1.  **Modified `src/app/acciones/UsuariosActions.js`**: In the `loginAction` function, added `userRole: 'PROVEEDOR'` to the `data` object returned upon successful supplier authentication.
2.  **Modified `src/app/api/auth/[...nextauth]/route.js`**:
    *   In the `authorize` callback, changed `rol: null` to `rol: Rol.PROVEEDOR` for authenticated suppliers.
    *   Refactored the `authorize` callback to correctly handle users with `rol: PROVEEDOR`: If a `Usuario` with `rol: PROVEEDOR` is authenticated, it now explicitly fetches the associated `Proveedor` document and sets `isSupplier: true` and `proveedorId` in the session object returned by `authorize`. This ensures `isSupplier` is correctly `true` for suppliers.
3.  **Modified `src/app/acciones/PedidoActions.js`**: Applied `toPlainObject` to the data returned by `obtenerPedidosPorProveedorId` to ensure all Mongoose documents and `ObjectId`s are converted to plain JavaScript objects with string IDs before being passed to client components.
4.  **Reverted temporary debugging changes**: All temporary changes in `src/app/proveedor/pedidos/page.jsx` and `src/middleware.js` have been reverted.

### Files Modified:
- `src/app/acciones/UsuariosActions.js`
- `src/app/api/auth/[...nextauth]/route.js`
- `src/app/acciones/PedidoActions.js`
- `src/middleware.js` (reverted to original state)
- `src/app/proveedor/pedidos/page.jsx` (reverted to original state)

### Next Steps:
- Verify the fix by logging in as a supplier.
- Update `progress.md`.
- Propose Git commands.
