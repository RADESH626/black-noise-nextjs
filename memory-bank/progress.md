## Progreso del Proyecto

### 16 de Junio de 2025

**Problemas Resueltos:**
- Se añadió y exportó la función `obtenerPedidosPorProveedorId` en `src/app/acciones/PedidoActions.js` para resolver el error de importación en `/proveedor/pedidos`.
- Se mejoró y corrigió el manejo de errores en `src/app/proveedor/pedidos/page.jsx` para mostrar mensajes de error más precisos y evitar duplicaciones.
- Se corrigió el problema de "Invalid Date" y "Fecha no disponible" en la lista de pedidos del proveedor en `src/app/proveedor/pedidos/page.jsx`. Se identificó que el campo correcto en el modelo es `fechaEstimadaEntrega` y se actualizó el frontend para usarlo. Los logs de depuración se eliminaron.

**Tareas Pendientes:**
- Continuar con el desarrollo y depuración de la aplicación Next.js.
