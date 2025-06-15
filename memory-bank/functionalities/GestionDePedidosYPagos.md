# Gestión de Pedidos y Pagos

## Visión General

Este documento describe la funcionalidad de gestión de pedidos y el flujo de pago asociado, centrándose en un proceso de pago unificado a través de un modal que se abre desde la página del carrito.

## Flujo de Usuario

### 1. Inicio del Proceso de Pago

*   Desde el carrito (`src/app/carrito/page.jsx`), el usuario inicia el proceso de pago haciendo clic en "Proceder al Pago".

### 2. Modal de Proceso de Pago (dentro de `src/components/common/CartComponent.jsx`)

*   Al hacer clic en "Proceder al Pago", se abre un modal (implementado con un `<dialog>` en `CartComponent.jsx`) que contiene todo el flujo de pago.
*   **Datos del Usuario y Entrega:**
    *   Se presentan campos para el nombre, correo y dirección del usuario (gestionados por `UserDataForm`).
    *   Se incluye una **casilla de verificación** para "Rellenar automáticamente con mis datos" que precarga estos campos con la información del usuario autenticado.
    *   Se incluye una **casilla de verificación** para elegir el método de entrega: "Envío a Domicilio" o "Recoger en Tienda".
    *   Si se selecciona "Envío a Domicilio":
        *   Aparece un campo de dirección con un botón "Rellenar dirección" para precargar la dirección del usuario.
        *   **Nota:** El costo adicional por envío a domicilio no se muestra al usuario en este punto, ya que es un aspecto que debe ser gestionado y modificado por el proveedor.
    *   Si se selecciona "Recoger en Tienda":
        *   El campo de dirección desaparece.
        *   Se indica al usuario que deberá recoger el pedido en un punto específico cuando esté listo.
*   **Datos de la Tarjeta:**
    *   Se presenta un botón "Agregar datos de pago" que abre un segundo modal (`CardDataModal`).
    *   Dentro del `CardDataModal`, el usuario ingresa los detalles de su tarjeta (número, mes, año, CVV).
    *   Al guardar la información, el `CardDataModal` se cierra y aparece un pop-up de confirmación indicando que la información de la tarjeta se guardó.
*   **Resumen del Pedido:** Se muestra un resumen de los ítems del carrito y el total a pagar. El costo de envío, si aplica, se considera en el total pero no se desglosa explícitamente al usuario en este punto.

### 3. Confirmación y Creación del Pedido

*   **Validación:** Antes de confirmar, se valida que todos los datos requeridos (personales, de entrega y de tarjeta) estén completos.
*   **Pago Exitoso:** Si el pago es exitoso, se crea un nuevo documento `Pedido` en la base de datos con un estado de pago `PAGADO` (o `COMPLETADO`). El modal de pago se cierra y el usuario es redirigido a una página de confirmación del pedido.
*   **Pago Fallido:** Si el pago falla, se informa al usuario del error directamente en el modal de pago. No se crea ningún `Pedido`.

### 4. Visualización del Historial de Pedidos

*   El usuario puede acceder a su historial de pedidos, donde se listan todos sus pedidos ya pagados.

## Componentes y Lógica Involucrados

### Historial de Pedidos (`src/components/common/PedidosComponent.jsx`)

*   **Propósito:** Obtener y mostrar los pedidos del usuario desde la base de datos.
*   **Server Action:** Utiliza `obtenerPedidosPorUsuarioId` (ubicada en `src/app/acciones/PedidoActions.js`) para recuperar los pedidos.
*   **Renderizado Condicional:** Cada pedido en la lista mostrará un botón "Pagar" solo si su `estadoPago` es `PENDIENTE`.
*   **Nota:** Este componente ya no invoca un modal de pago externo, ya que el proceso de pago se maneja en el modal del carrito.

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
    *   Se añade el campo `costoEnvio` de tipo `Number` con un valor por defecto de `0`, para indicar el coste de envío del pedido.
    *   Se añade el campo `metodoEntrega` de tipo `String` para registrar si fue "Envío a Domicilio" o "Recoger en Tienda".
*   **`Pago` Model (`src/models/Pago.js`):**
    *   Nuevo modelo para registrar cada transacción de pago. Incluirá campos como `pedidoId`, `monto`, `fechaPago`, `metodoPago`, `estadoTransaccion`.
    *   **Actualización Importante:** El campo `metodoPago` ahora utiliza el enum centralizado `MetodoPago` definido en `src/models/enums/pago/MetodoPago.js` para asegurar consistencia y evitar valores hardcodeados.
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

*   `src/components/common/CartComponent.jsx`: Ahora contiene el modal de proceso de pago completo, incluyendo datos de usuario, opciones de entrega y el botón para el modal de tarjeta.
*   `src/app/proceso-pago/page.jsx`: Ahora redirige al usuario a la página del carrito, ya que el proceso de pago se maneja en un modal desde allí.
*   `src/components/pago/UserDataForm.jsx`: Componente para la entrada de datos del usuario y selección del método de entrega (utilizado dentro del modal de `CartComponent`).
*   `src/components/pago/CardDataModal.jsx`: Componente modal para la entrada de datos de la tarjeta de crédito (utilizado dentro del modal de `CartComponent`).
*   `src/components/common/PedidosComponent.jsx`: Componente principal del historial de pedidos.
*   `src/app/acciones/PedidoActions.js`: Contiene `obtenerPedidosPorUsuarioId` y ahora utiliza `src/utils/modelLoader.js` para la instanciación de modelos.
*   `src/app/acciones/PagoActions.js`: Contendrá `procesarPagoDePedido` y ahora utiliza `src/utils/modelLoader.js` para la instanciación de modelos.
*   `src/models/Pedido.js`: Definición del modelo Pedido.
*   `src/models/Pago.js`: Definición del modelo Pago.
*   `src/utils/modelLoader.js`: Nueva utilidad para la carga centralizada de modelos.
