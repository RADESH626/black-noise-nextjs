# ✅ Funcionalidad: Gestión de Perfil de Usuario

**Descripción:** Permite a los usuarios autenticados visualizar su información de perfil, diseños publicados, pedidos realizados, el contenido de su carrito de compras y sus pagos registrados, así como editar sus datos personales.

**Flujo de Interacción:** El usuario navega a `/perfil` para ver un resumen de su información y acceder a pestañas para ver diseños, pedidos, carrito y pagos. Desde `/perfil/editar`, o a través de un modal en `/perfil`, puede modificar sus datos personales.

---

### Archivos Involucrados:

#### 📄 **Archivo:** `src/app/perfil/page.jsx`
* **Rol:** Página principal del perfil de usuario.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `ProfilePage` (componente principal), `ProfileContent`.
    * **Lógica Principal:** Actúa como un contenedor simple que renderiza el componente `ProfileContent`, delegando toda la lógica de visualización y gestión de pestañas a este último.
    * **Modelos de Datos / Endpoints:** No interactúa directamente.

#### 📄 **Archivo:** `src/app/perfil/editar/page.jsx`
* **Rol:** Página dedicada a la edición del perfil de usuario.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `EditarPerfil` (componente principal), `FormEditarUsuario` (componente de formulario).
    * **Lógica Principal:** Intenta obtener los datos del usuario autenticado (actualmente mediante una llamada `fetch` a `/api/auth/user`, lo cual podría ser una API route remanente o un patrón a refactorizar). Si el usuario no está autenticado, redirige a `/login`. Renderiza `FormEditarUsuario` pasándole el `userId` y la prop `isProfile={true}`.
    * **Modelos de Datos / Endpoints:** Consume la API route `/api/auth/user` para obtener datos del usuario. El `FormEditarUsuario` interactúa con `UsuariosActions.js`.

#### 📄 **Archivo:** `src/app/perfil/ProfileContent.jsx`
* **Rol:** Componente principal que muestra el contenido del perfil del usuario, incluyendo información personal, pestañas para diseños, pedidos y carrito, y la opción de editar el perfil.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `ProfileContent` (componente), `useSession` (de `next-auth/react`), `useModal`, `useCart`, `useState`, `useEffect`, `DesignsComponent`, `PedidosComponent`, `CartComponent`, `FormEditarUsuario`.
    * **Lógica Principal:**
        *   Obtiene la sesión del usuario con `useSession`.
        *   **Carga la información completa del perfil del usuario usando `ObtenerUsuarioPorId` de `UsuariosActions.js` una vez que la sesión está autenticada.**
        *   Maneja el estado de la pestaña activa (`activeTab`: 'designs', 'orders', 'cart').
        *   Carga los diseños del usuario usando `obtenerDesignsPorUsuarioId` de `DesignActions.js`.
        *   **Muestra la información completa del perfil del usuario (nombre, correo, tipo de documento, número de documento, fecha de nacimiento, género, número de teléfono, dirección, biografía y likes).**
        *   Proporciona funciones `handleEditProfile` para abrir un modal con `FormEditarUsuario` y `handleEditDesign` para una futura edición de diseños.
        *   Renderiza condicionalmente `DesignsComponent`, `PedidosComponent`, `CartComponent` y `PagosComponent` según la pestaña activa.
        *   Permite cerrar sesión (`signOut`).
    * **Modelos de Datos / Endpoints:** Consume `DesignActions.js` (específicamente `obtenerDesignsPorUsuarioId`) para obtener diseños. El `FormEditarUsuario` interactúa con `UsuariosActions.js`.

#### 📄 **Archivo:** `src/app/perfil/ProfileData.jsx`
* **Rol:** Componente que solía manejar la lógica de obtención de datos del perfil, pero ahora delega a `ProfileContent`.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `ProfileData` (componente), `ProfileContent`.
    * **Lógica Principal:** Simplemente renderiza `ProfileContent`.

#### 📄 **Archivo:** `src/app/acciones/UsuariosActions.js`
* **Rol:** Contiene Server Actions para la actualización de datos de usuario.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `updateUserAction`, `EditarUsuario`, `ObtenerUsuarioPorId`, `ObtenerUsuarioPorCorreo`.
    * **Lógica Principal:**
        *   `updateUserAction`: Server Action que recibe el `userId` y `formData`, y llama a `EditarUsuario` para actualizar los datos en la DB. Revalida rutas relevantes.
        *   `EditarUsuario`: Función interna que realiza la actualización del documento `Usuario` en la base de datos.
        *   `ObtenerUsuarioPorId` y `ObtenerUsuarioPorCorreo`: Funciones para obtener datos de usuario por ID o correo, utilizadas para pre-llenar formularios o mostrar información.
    * **Modelos de Datos / Endpoints:** Modifica/consume el modelo `Usuario` de Mongoose.

#### 📄 **Archivo:** `src/app/perfil/DesignsComponent.jsx`
* **Rol:** Componente que muestra los diseños publicados por el usuario en la sección de perfil.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `DesignsComponent` (componente).
    * **Lógica Principal:** Recibe los diseños del usuario como prop y los renderiza en un formato de cuadrícula. Incluye botones para editar cada diseño.
    * **Modelos de Datos / Endpoints:** No interactúa directamente, recibe los datos como prop.

#### 📄 **Archivo:** `src/app/perfil/PedidosComponent.jsx`
* **Rol:** Componente que muestra los pedidos realizados por el usuario en la sección de perfil.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `PedidosComponent` (componente).
    * **Lógica Principal:** Recibe el `userId` como prop y probablemente realiza una llamada a una Server Action (ej. `PedidoActions.js`) para obtener los pedidos del usuario. **Nota:** Se ha adaptado visualmente para mostrar cada producto de un pedido en un formato de tarjeta de cuadrícula, similar a cómo se muestran los diseños en `DesignsComponent.jsx`, incluyendo una imagen (o marcador de posición) y detalles clave.
    * **Modelos de Datos / Endpoints:** Probablemente consume `PedidoActions.js` para obtener datos de pedidos.

#### 📄 **Archivo:** `src/app/perfil/PagosComponent.jsx`
* **Rol:** Componente que muestra los pagos registrados por el usuario en la sección de perfil.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `PagosComponent` (componente).
    * **Lógica Principal:** Recibe el `userId` como prop y realiza una llamada a una Server Action (`PagoActions.js`) para obtener los pagos del usuario. Muestra los pagos en un formato de lista o tabla.
    * **Modelos de Datos / Endpoints:** Consume `PagoActions.js` para obtener datos de pagos.

#### 📄 **Archivo:** `src/app/perfil/CartComponent.jsx`
* **Rol:** Componente que muestra el contenido del carrito de compras del usuario en la sección de perfil.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `CartComponent` (componente), `useCart` (de `src/context/CartContext`).
    * **Lógica Principal:** Muestra los ítems del carrito obtenidos del contexto `useCart`. (Nota: La importación `useCart` de `src/context/CartContext` en `ProfileContent.jsx` y la ausencia de `src/context/CartContext.jsx` sugieren una posible inconsistencia o que `useCart` es un alias para `useCartStorage`).
    * **Modelos de Datos / Endpoints:** No interactúa directamente con la DB, depende del estado del carrito gestionado en el cliente.
