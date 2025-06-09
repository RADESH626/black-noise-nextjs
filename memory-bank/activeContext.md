### 9/6/2025, 2:44:53 p. m. - Error al agregar un nuevo proveedor

**Descripción:** Se reportó un error al intentar agregar un nuevo proveedor.

**Acciones Realizadas:**
- Se revisó `src/app/acciones/ProveedorActions.js` para entender la lógica de creación de proveedores.
- Se modificó la función `crearProveedor` en `src/app/acciones/ProveedorActions.js` para que el bloque `catch` retorne el mensaje de error específico (`error.message`) en lugar de un mensaje genérico. Esto permitirá una mejor depuración del problema.

**Archivos Modificados:**
- `src/app/acciones/ProveedorActions.js`

**Próximos Pasos:**
- El usuario debe intentar agregar un proveedor nuevamente y reportar el mensaje de error detallado para identificar la causa raíz.
