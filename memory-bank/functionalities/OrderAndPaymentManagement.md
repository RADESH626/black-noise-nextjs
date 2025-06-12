# Funcionalidad: Gestión de Pedidos y Pagos

## Descripción
Esta funcionalidad centraliza la creación, visualización, gestión y procesamiento de pagos de los pedidos de los usuarios. Permite a los usuarios finalizar compras desde el carrito, ver su historial de pedidos y realizar pagos pendientes.

## Sub-funcionalidades

### 1. Creación de Pedidos
Permite a los usuarios convertir el contenido de su carrito en un pedido formal.

#### Flujo de Trabajo
1.  El usuario finaliza su compra en el carrito haciendo clic en "Realizar Pedido".
2.  Esto crea un documento `Pedido` en la base de datos con un estado de pago `PENDIENTE`.

#### Componentes Involucrados
*   **`src/app/carrito/page.jsx`**: La página del carrito donde se inicia la creación del pedido.
*   **`src/app/acciones/CartActions.js`**: Contiene la lógica para procesar el carrito y crear el pedido.
*   **`src/models/Pedido.js`**: Modelo de la base de datos para los pedidos.

### 2. Visualización y Gestión del Historial de Pedidos
Permite a los usuarios ver una lista de todos sus pedidos, con la opción de interactuar con ellos (ej. pagar pedidos pendientes).

#### Flujo de Trabajo
1.  El usuario accede a su historial de pedidos (ej. desde su perfil).
2.  Se listan todos sus pedidos, mostrando detalles como estado, fecha y valor.
3.  Para los pedidos con estado `PENDIENTE`, se muestra un botón "Pagar".

#### Componentes Involucrados
*   **`src/app/pedido/page.jsx`**: La página que muestra el historial de pedidos.
*   **`src/components/common/PedidosComponent.jsx`**: Componente principal para obtener y mostrar los pedidos del usuario.
*   **`src/app/acciones/PedidoActions.js`**: Contiene `obtenerPedidosPorUsuarioId` para recuperar los pedidos.
*   **`src/models/Pedido.js`**: Modelo de la base de datos para los pedidos.

### 3. Procesamiento de Pagos
Permite a los usuarios realizar pagos para pedidos pendientes.

#### Flujo de Trabajo
1.  Desde el historial de pedidos, el usuario hace clic en "Pagar" para un pedido pendiente.
2.  Se abre un modal de pago donde el usuario ingresa sus datos de pago.
3.  Al confirmar, se invoca una server action que crea un registro de `Pago` y actualiza el estado del `Pedido` a `PAGADO`.

#### Componentes y Lógica Involucrados
*   **`src/app/pago/page.jsx`**: Posible página de pago o redirección.
*   **`src/app/proceso-pago/page.jsx`**: Página o ruta para el proceso de pago.
*   **`src/components/pago/PaymentModal.jsx`**: Proporciona la interfaz para que el usuario ingrese sus datos de pago.
*   **`src/app/acciones/PagoActions.js`**: Contendrá la server action `procesarPagoDePedido`.
*   **`src/models/Pago.js`**: Nuevo modelo para registrar cada transacción de pago.
*   **`src/models/Pedido.js`**: El modelo `Pedido` se actualiza con el campo `estadoPago`.

## Modelos de Base de Datos Clave
*   **`Pedido` Model (`src/models/Pedido.js`):**
    *   Campo `estadoPago` (ej: `PENDIENTE`, `PAGADO`, `CANCELADO`).
*   **`Pago` Model (`src/models/Pago.js`):**
    *   Nuevo modelo para registrar transacciones de pago: `pedidoId`, `monto`, `fechaPago`, `metodoPago`, `estadoTransaccion`.

## Integración Adicional
*   **Ocultar "Agregar al carrito" para diseños en pedidos:** Lógica para ocultar el botón "Agregar al carrito" para diseños que ya forman parte de un pedido existente o pendiente, obteniendo `designId` de los pedidos del usuario.

## Archivos Clave
*   `src/components/common/PedidosComponent.jsx`
*   `src/components/pago/PaymentModal.jsx`
*   `src/app/acciones/PedidoActions.js`
*   `src/app/acciones/PagoActions.js`
*   `src/models/Pedido.js`
*   `src/models/Pago.js`
