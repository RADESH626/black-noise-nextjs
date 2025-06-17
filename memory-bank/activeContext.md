### 16/06/2025 - Actualización de `PedidoActions.js`

**Problema:** Error de importación en `src/app/proveedor/pedidos/page.jsx` debido a la ausencia de la función `obtenerPedidosPorProveedorId` en `src/app/acciones/PedidoActions.js`.

**Acciones Tomadas:**
- Se verificó la existencia del archivo `src/app/acciones/PedidoActions.js`.
- Se añadió la función `obtenerPedidosPorProveedorId` a `src/app/acciones/PedidoActions.js`.
- Se exportó la función `obtenerPedidosPorProveedorId` en el mismo archivo.

**Resultado:** La función `obtenerPedidosPorProveedorId` ahora está disponible para ser importada y utilizada.

### 16/06/2025 - Mejora y corrección del manejo de errores en `src/app/proveedor/pedidos/page.jsx`

**Problema:** El mensaje de error al cargar los pedidos era genérico y no proporcionaba detalles específicos. Se identificó que la lógica inicial de manejo de errores en `queryFn` no distinguía correctamente entre la ausencia de pedidos y un error real del servidor, lo que llevaba a un mensaje de "Respuesta indefinida" o duplicación del mensaje de error.

**Acciones Tomadas:**
- Se refactorizó la `queryFn` en `src/app/proveedor/pedidos/page.jsx` para manejar explícitamente los casos de éxito (incluyendo cuando no hay pedidos) y los errores del servidor.
- Se añadió una verificación para `result.success === false` o `result.error` para capturar errores explícitos del servidor.
- Se aseguró que `ErrorMessage` muestre directamente el `error.message` sin prefijos adicionales, ya que el mensaje de error ya es descriptivo desde la acción del servidor.

**Resultado:** El manejo de errores es más robusto y los mensajes de error son más precisos, mostrando el detalle exacto del problema o un mensaje claro si el formato de respuesta es inesperado.

### 16/06/2025 - Corrección y depuración de la fecha en `src/app/proveedor/pedidos/page.jsx`

**Problema:** Inicialmente, la fecha de los pedidos se mostraba como "Invalid Date" y luego como "Fecha no disponible". Los logs revelaron que la propiedad `fechaPedido` era `undefined` en el objeto `pedido`. Se identificó que el esquema del modelo `Pedido` utiliza `fechaEstimadaEntrega` en lugar de `fechaPedido`.

**Acciones Tomadas:**
- Se modificó `src/app/proveedor/pedidos/page.jsx` para utilizar `pedido.fechaEstimadaEntrega` en lugar de `pedido.fechaPedido`.
- Se eliminaron los `console.log` de depuración una vez que se identificó la causa raíz.
- Se mantiene la lógica de verificación de validez de la fecha para mostrar "Fecha no disponible" si `fechaEstimadaEntrega` es inválida o no está presente en pedidos antiguos.

**Resultado:** La página de pedidos del proveedor ahora intenta mostrar la `fechaEstimadaEntrega` correctamente. Si esta fecha no es válida o no está presente, se mostrará "Fecha no disponible", lo que es un comportamiento esperado para datos incompletos.
