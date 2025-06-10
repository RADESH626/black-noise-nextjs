# ✅ Funcionalidad: Proceso de Pago y Confirmación

**Descripción:** Guía al usuario a través de las etapas de pago, desde la introducción de datos de facturación y método de pago hasta la confirmación final del pedido.

**Flujo de Interacción:** El usuario es redirigido desde el carrito a `/pago` para ingresar sus datos. Luego, es llevado a `/proceso-pago` para simular la entrada de detalles de tarjeta. Finalmente, una vez "pagado", se muestra una página de confirmación en `/confirmacion`. La lógica actual utiliza `localStorage` para simular el flujo de pedido y pago.

---

### Archivos Involucrados:

#### 📄 **Archivo:** `src/app/pago/page.jsx`
* **Rol:** Página de entrada de datos de cliente y selección de método de pago.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `Pago` (componente principal), `useCartStorage`.
    * **Lógica Principal:**
        *   Recopila el nombre, correo y dirección del cliente, y el método de pago seleccionado.
        *   Valida que los campos requeridos estén completos.
        *   Al confirmar, guarda un objeto `pedidoCompleto` (con datos del cliente, productos del carrito, fecha, proveedor ficticio, método de pago y total) en `localStorage`.
        *   Limpia el carrito (`clearCart`).
        *   Redirige a `/confirmacion`.
        *   Si el carrito está vacío al cargar la página, redirige a `/proceso-pago` (posiblemente un error de redirección, debería ser `/carrito`).
    * **Modelos de Datos / Endpoints:** Interactúa con `useCartStorage` y `localStorage`. No interactúa directamente con Server Actions o la base de datos para el procesamiento de pago real.

#### 📄 **Archivo:** `src/app/proceso-pago/page.jsx`
* **Rol:** Página de simulación de entrada de detalles de tarjeta de crédito.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `ProcesoPago` (componente principal).
    * **Lógica Principal:**
        *   Recopila el número de tarjeta, mes, año y CVV.
        *   Valida que los campos de la tarjeta estén completos.
        *   Simula un procesamiento de pago guardando un `pedidoCompleto` en `localStorage` (incluyendo los datos de la tarjeta).
        *   Limpia el carrito (`localStorage.removeItem("cartItems")`).
        *   Redirige a `/pedido` después de un retraso de 3 segundos.
    * **Modelos de Datos / Endpoints:** Interactúa con `localStorage`. No interactúa directamente con Server Actions o la base de datos para el procesamiento de pago real.

#### 📄 **Archivo:** `src/app/confirmacion/page.jsx`
* **Rol:** Página de confirmación de pago exitoso.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `Pago` (componente principal, nombre confuso), `useCartStorage`.
    * **Lógica Principal:**
        *   Verifica si el carrito está vacío; si lo está, redirige a `/carrito`.
        *   Guarda el `pedidoCompleto` en `localStorage` (redundante si ya se hizo en `/pago` o `/proceso-pago`) y limpia el carrito.
        *   Muestra un mensaje de "¡Pago exitoso!" y redirige a sí mismo (`/confirmacion`) después de 3 segundos, lo cual es un comportamiento inusual.
        *   Finalmente, elimina el `pedidoCompleto` de `localStorage` después de un breve retraso.
    * **Modelos de Datos / Endpoints:** Interactúa con `useCartStorage` y `localStorage`. No interactúa directamente con Server Actions o la base de datos.

#### 📄 **Archivo:** `src/app/acciones/PagoActions.js`
* **Rol:** Contiene Server Actions para la gestión de pagos en la base de datos.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `guardarPago`, `obtenerPagos`, `ObtenerPagoPorId`, `EditarPago`.
    * **Lógica Principal:**
        *   `guardarPago`: Crea y guarda un nuevo documento `Pago` en la base de datos.
        *   `obtenerPagos`: Recupera todos los pagos, populando `usuarioId` y `ventaId`.
        *   `ObtenerPagoPorId`: Busca un pago por su ID, populando relaciones.
        *   `EditarPago`: Actualiza el estado u otros campos de un pago existente.
        *   Utiliza `revalidatePath` para invalidar la caché de rutas de administración de pagos.
    * **Modelos de Datos / Endpoints:** Modifica/consume el modelo `Pago` de Mongoose.

#### 📄 **Archivo:** `src/app/acciones/PedidoActions.js`
* **Rol:** Contiene Server Actions para la gestión de pedidos en la base de datos.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `guardarPedido`, `obtenerPedidos`, `obtenerPedidosPorUsuarioId`, `ObtenerPedidoPorId`, `EditarPedido`.
    * **Lógica Principal:**
        *   `guardarPedido`: Crea y guarda un nuevo documento `Pedido` en la base de datos.
        *   `obtenerPedidos`: Recupera todos los pedidos, populando `desingIds` y `proveedorId`.
        *   `obtenerPedidosPorUsuarioId`: Recupera pedidos asociados a un `usuarioId` específico.
        *   `ObtenerPedidoPorId`: Busca un pedido por su ID, populando relaciones.
        *   `EditarPedido`: Actualiza el estado u otros campos de un pedido existente.
        *   Utiliza `revalidatePath` para invalidar la caché de rutas de administración de pedidos.
    * **Modelos de Datos / Endpoints:** Modifica/consume el modelo `Pedido` de Mongoose.

#### 📄 **Archivo:** `src/app/acciones/VentaActions.js`
* **Rol:** Contiene Server Actions para la gestión de ventas en la base de datos.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `guardarVenta`, `obtenerVentas`, `ObtenerVentaPorId`, `EditarVenta`.
    * **Lógica Principal:**
        *   `guardarVenta`: Crea y guarda un nuevo documento `Venta` en la base de datos.
        *   `obtenerVentas`: Recupera todas las ventas, populando `pagoIds` y `pedidoId`.
        *   `ObtenerVentaPorId`: Busca una venta por su ID, populando relaciones.
        *   `EditarVenta`: Actualiza el estado u otros campos de una venta existente.
        *   Utiliza `revalidatePath` para invalidar la caché de rutas de administración de ventas.
    * **Modelos de Datos / Endpoints:** Modifica/consume el modelo `Venta` de Mongoose.

