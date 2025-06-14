# Gestión de Pedidos y Pagos

## Visión General

Este documento describe la funcionalidad de gestión de pedidos y el flujo de pago asociado, implementando un sistema de "pago primero". El objetivo es asegurar que los usuarios realicen el pago antes de que se cree formalmente el pedido.

## Flujo de Usuario (Pago Primero)

1.  **Inicio del Proceso de Pago:** Desde el carrito, el usuario inicia el proceso de pago (ej. haciendo clic en "Proceder al Pago" o "Realizar Pedido" en el `CartComponent`).
2.  **Procesamiento de Pago:** El usuario es dirigido a una interfaz de pago donde ingresa sus datos. Se intenta procesar la transacción.
3.  **Confirmación y Creación del Pedido:**
    *   **Pago Exitoso:** Si el pago es exitoso, se crea un nuevo documento `Pedido` en la base de datos con un estado de pago `PAGADO` (o `COMPLETADO`). El usuario es redirigido a una página de confirmación del pedido.
    *   **Pago Fallido:** Si el pago falla, se informa al usuario del error. No se crea ningún `Pedido`, y el usuario permanece en el carrito o es redirigido a una página de error de pago.
4.  **Visualización del Historial de Pedidos:** El usuario puede acceder a su historial de pedidos, donde se listan todos sus pedidos ya pagados. No habrá pedidos con estado `PENDIENTE` en este flujo.

## Componentes y Lógica Involucrados

### Historial de Pedidos (`src/components/common/PedidosComponent.jsx`)

*   **Propósito:** Obtener y mostrar los pedidos del usuario desde la base de datos.
*   **Server Action:** Utiliza `obtenerPedidosPorUsuarioId` (ubicada en `src/app/acciones/PedidoActions.js`) para recuperar los pedidos.
*   **Renderizado Condicional:** Cada pedido en la lista mostrará un botón "Pagar" solo si su `estadoPago` es `PENDIENTE`.
*   **Integración del Modal:** Este componente será responsable de invocar y pasar la información necesaria (como `pedidoId` y `valorPedido`) al `PaymentModal`.

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
*   **Modelos Involucrados:**
    *   `src/models/Pago.js`: Esquema para registrar las transacciones de pago.
    *   `src/models/Pedido.js`: Esquema del pedido, que incluye el campo `estadoPago`.

## Modelos de Base de Datos

*   **`Pedido` Model (`src/models/Pedido.js`):**
    *   Se añade o modifica el campo `estadoPago` (ej: `PENDIENTE`, `PAGADO`, `CANCELADO`).
*   **`Pago` Model (`src/models/Pago.js`):**
    *   Nuevo modelo para registrar cada transacción de pago. Incluirá campos como `pedidoId`, `monto`, `fechaPago`, `metodoPago`, `estadoTransaccion`.
*   **`Pedido` Model (`src/models/Pedido.js`):**
    *   Se añade el campo `paymentId` de tipo `Schema.Types.ObjectId` que hace referencia al modelo `Pago`. Este campo es **requerido** ya que un pedido solo se crea después de un pago exitoso.

## Utilidad de Carga de Modelos (`src/utils/modelLoader.js`)

*   **Propósito:** Centraliza la lógica para obtener instancias de modelos de Mongoose, asegurando que los modelos estén correctamente registrados y accesibles en el entorno de Next.js Server Actions. Esto resuelve problemas como `TypeError: First argument to Model constructor must be an object, not a string.` y `MissingSchemaError`.
*   **Funcionalidad:**
    1.  Asegura la conexión a la base de datos (`connectDB`).
    2.  Verifica si el modelo ya está en `mongoose.models` para evitar re-registro.
    3.  Si no está registrado, intenta obtenerlo, lo que fuerza el registro del esquema si es la primera vez que se accede.
*   **Uso:** Las Server Actions ahora importan `getModel` de esta utilidad y la usan para obtener los modelos (`const MyModel = await getModel('MyModelName');`) en lugar de importaciones directas o `mongoose.model()`.

## Integración con la Vista de Diseños del Perfil

Para mejorar la experiencia del usuario en la pestaña "Diseños" del perfil, se implementará una lógica para ocultar el botón "Agregar al carrito" para aquellos diseños que ya forman parte de un pedido existente o pendiente. Esto se logrará obteniendo todos los `designId` de los pedidos del usuario y pasándolos al componente de diseños para su validación.

## Archivos Clave

*   `src/components/common/CartComponent.jsx`: Componente del carrito que ahora inicia el flujo de "pago primero" redirigiendo al usuario a la página de pago.
*   `src/components/common/PedidosComponent.jsx`: Componente principal del historial de pedidos.
*   `src/app/acciones/PedidoActions.js`: Contiene `obtenerPedidosPorUsuarioId` y ahora utiliza `src/utils/modelLoader.js` para la instanciación de modelos.
*   `src/app/acciones/PagoActions.js`: Contendrá `procesarPagoDePedido` y ahora utiliza `src/utils/modelLoader.js` para la instanciación de modelos.
*   `src/models/Pedido.js`: Definición del modelo Pedido.
*   `src/models/Pago.js`: Definición del modelo Pago.
*   `src/utils/modelLoader.js`: Nueva utilidad para la carga centralizada de modelos.
