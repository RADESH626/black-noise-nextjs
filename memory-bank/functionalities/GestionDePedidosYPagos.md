# Gestión de Pedidos y Pagos

## Visión General

Este documento describe la nueva funcionalidad de gestión de pedidos y el flujo de pago asociado. El objetivo es permitir a los usuarios crear pedidos desde su carrito y, posteriormente, gestionar y pagar esos pedidos desde su historial.

## Flujo de Usuario Refactorizado

1.  **Creación de Pedido:** El usuario finaliza su compra en el carrito haciendo clic en "Realizar Pedido". Esto crea un documento `Pedido` en la base de datos con un estado de pago `PENDIENTE`.
2.  **Visualización del Historial de Pedidos:** El usuario puede acceder a su historial de pedidos, donde se listan todos sus pedidos.
3.  **Pago de Pedido:** Para los pedidos con estado `PENDIENTE`, se muestra un botón "Pagar". Al hacer clic en este botón, se abre un modal de pago.
4.  **Procesamiento de Pago:** Dentro del modal, el usuario ingresa sus datos de pago. Al confirmar, se invoca una server action que crea un registro de `Pago` y actualiza el estado del `Pedido` a `PAGADO`.

## Componentes y Lógica Involucrados

### Historial de Pedidos (`src/components/common/PedidosComponent.jsx`)

*   **Propósito:** Obtener y mostrar los pedidos del usuario desde la base de datos.
*   **Server Action:** Utiliza `obtenerPedidosPorUsuarioId` (ubicada en `src/app/acciones/PedidoActions.js`) para recuperar los pedidos.
*   **Renderizado Condicional:** Cada pedido en la lista mostrará un botón "Pagar" solo si su `estadoPago` es `PENDIENTE`.
*   **Integración del Modal:** Este componente será responsable de invocar y pasar la información necesaria (como `pedidoId` y `valorPedido`) al `PaymentModal`.

<<<<<<< HEAD
### Historial de Compras (`src/components/common/PagosComponent.jsx`)

*   **Propósito:** Obtener y mostrar el historial de compras (pedidos con estado `PAGADO`) del usuario.
*   **Server Action:** Utiliza `obtenerPedidosPagadosPorUsuarioId` (ubicada en `src/app/acciones/PedidoActions.js`) para recuperar los pedidos pagados.
*   **Renderizado:** Muestra una lista de pedidos pagados, incluyendo detalles del pedido y los ítems comprados.

=======
>>>>>>> 23672fd20f631b662f6c2b26b31a77a6288784c6
### Modal de Pago (`src/components/pago/PaymentModal.jsx`)

*   **Propósito:** Proporcionar una interfaz para que el usuario ingrese sus datos de pago y procese un pedido específico.
*   **Props:** Recibe `pedidoId` y `valorPedido` del componente `PedidosComponent.jsx`.
*   **Formulario de Pago:** Contendrá campos para la información de la tarjeta de crédito/débito u otros métodos de pago.
*   **Server Action:** Al enviar el formulario, invocará la server action `procesarPagoDePedido`.
*   **Feedback al Usuario:** Mostrará mensajes de éxito o error basados en la respuesta de la server action.

### Lógica de Pago en el Backend (`src/app/acciones/PagoActions.js`)

*   **Nueva Server Action:** `procesarPagoDePedido`.
*   **Funcionalidad:**
    1.  Recibe `pedidoId` y los datos de pago.
    2.  Crea un nuevo documento `Pago` en la base de datos, registrando la transacción.
    3.  Actualiza el campo `estadoPago` del `Pedido` correspondiente a `PAGADO`.
    4.  Devuelve un objeto de resultado (`{ success: true }` o `{ success: false, error: '...' }`) para el feedback al cliente.
<<<<<<< HEAD
    5.  **Limpia el carrito del usuario** invocando la server action `clearUserCart` de `CartActions.js`.
    6.  La interfaz de usuario (en `PedidosComponent.jsx` y `ProfileContent.jsx`) se actualiza para reflejar el carrito vacío y permitir la recompra de ítems.
=======
>>>>>>> 23672fd20f631b662f6c2b26b31a77a6288784c6
*   **Modelos Involucrados:**
    *   `src/models/Pago.js`: Esquema para registrar las transacciones de pago.
    *   `src/models/Pedido.js`: Esquema del pedido, que incluye el campo `estadoPago`.

## Modelos de Base de Datos

*   **`Pedido` Model (`src/models/Pedido.js`):**
    *   Se añade o modifica el campo `estadoPago` (ej: `PENDIENTE`, `PAGADO`, `CANCELADO`).
*   **`Pago` Model (`src/models/Pago.js`):**
    *   Nuevo modelo para registrar cada transacción de pago. Incluirá campos como `pedidoId`, `monto`, `fechaPago`, `metodoPago`, `estadoTransaccion`.

## Integración con la Vista de Diseños del Perfil

Para mejorar la experiencia del usuario en la pestaña "Diseños" del perfil, se implementará una lógica para ocultar el botón "Agregar al carrito" para aquellos diseños que ya forman parte de un pedido existente o pendiente. Esto se logrará obteniendo todos los `designId` de los pedidos del usuario y pasándolos al componente de diseños para su validación.

## Archivos Clave

*   `src/components/common/PedidosComponent.jsx`: Componente principal del historial de pedidos.
*   `src/components/pago/PaymentModal.jsx`: Componente del modal de pago.
*   `src/app/acciones/PedidoActions.js`: Contiene `obtenerPedidosPorUsuarioId`.
*   `src/app/acciones/PagoActions.js`: Contendrá `procesarPagoDePedido`.
<<<<<<< HEAD
*   `src/app/acciones/PedidoActions.js`: Contiene `obtenerPedidosPorUsuarioId` y `obtenerPedidosPagadosPorUsuarioId`.
=======
>>>>>>> 23672fd20f631b662f6c2b26b31a77a6288784c6
*   `src/models/Pedido.js`: Definición del modelo Pedido.
*   `src/models/Pago.js`: Definición del modelo Pago.
