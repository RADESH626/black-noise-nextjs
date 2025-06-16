### 16/06/2025 - Actualización de `PedidoActions.js`

**Problema:** Error de importación en `src/app/proveedor/pedidos/page.jsx` debido a la ausencia de la función `obtenerPedidosPorProveedorId` en `src/app/acciones/PedidoActions.js`.

**Acciones Tomadas:**
- Se verificó la existencia del archivo `src/app/acciones/PedidoActions.js`.
- Se añadió la función `obtenerPedidosPorProveedorId` a `src/app/acciones/PedidoActions.js`.
- Se exportó la función `obtenerPedidosPorProveedorId` en el mismo archivo.

**Resultado:** La función `obtenerPedidosPorProveedorId` ahora está disponible para ser importada y utilizada.
