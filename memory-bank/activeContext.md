### 2025-06-20 - Mejoras en la Experiencia de Usuario del Perfil

**Objetivo:** Mejorar la experiencia del usuario proporcionando información clara y accesible sobre su actividad en las secciones "Mis Diseños", "Mis Pedidos" y "Mis Pagos".

**Cambios Realizados:**

1.  **Sección "Mis Diseños":**
    *   **`src/components/common/DesignsComponent.jsx`**: Se añadió la visualización del estado del diseño (`design.estadoDesing`) y la fecha de creación (`new Date(design.createdAt).toLocaleDateString()`) en cada tarjeta de diseño.
    *   **`src/models/Design.js`**: Se añadió el campo `tallasDisponibles` como un array de strings para gestionar las tallas de los diseños.

2.  **Sección "Mis Pedidos":**
    *   **`src/components/common/PedidosComponent.jsx`**:
        *   Se añadió la visualización del `estadoPago` y `estadoPedido` de cada pedido.
        *   Se implementó un resumen visual de los ítems del pedido, mostrando el `nombreDesing` y la `quantity` de cada ítem.
        *   Se muestra el `nombreEmpresa` del proveedor asociado al pedido.
        *   Se añadió un botón "Solicitar Devolución" (con funcionalidad de alerta placeholder).
        *   Se implementó un filtro (`showCancelled` state y checkbox) para mostrar/ocultar pedidos cancelados y se añadió un estilo visual (`border-2 border-red-500 opacity-70`) para resaltarlos.
    *   **`src/models/Pedido.js`**: Se añadieron los siguientes campos:
        *   `motivo_devolucion` (String)
        *   `motivo_rechazo_devolucion` (String)
        *   `es_pedido_refabricado` (Boolean, default `false`)
        *   `pedido_original_id` (ObjectId, ref 'Pedido')
        *   `costos_negociados` (Number)
        *   `fue_cancelado` (Boolean, default `false`)
        *   `fecha_cancelacion` (Date)
    *   **`src/models/enums/PedidoEnums.js`**: Se extendió el `EstadoPedido` para incluir `SOLICITUD_DEVOLUCION`, `DEVOLUCION_APROBADA`, `DEVOLUCION_RECHAZADA` y `DEVUELTO`.

3.  **Sección "Mis Pagos":**
    *   **`src/components/perfil/PaymentHistory.jsx`**: Se modificó la tabla para incluir una columna "Motivo" que muestra el nuevo campo `motivo` del pago.
    *   **`src/models/Pago.js`**: Se añadió el campo `motivo` (String) para especificar la razón del pago (ej. "por pedido", "por envío del pedido").

**Archivos Modificados:**
*   `src/components/common/DesignsComponent.jsx`
*   `src/components/common/PedidosComponent.jsx`
*   `src/components/perfil/PaymentHistory.jsx`
*   `src/models/Design.js`
*   `src/models/Pago.js`
*   `src/models/Pedido.js`
*   `src/models/enums/PedidoEnums.js`
