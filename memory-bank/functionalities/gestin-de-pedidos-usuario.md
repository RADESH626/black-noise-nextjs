# ✅ Funcionalidad: Gestión de Pedidos (Usuario)

**Descripción:** Permite a los usuarios visualizar el historial y los detalles de sus pedidos realizados.

**Flujo de Interacción:** El usuario puede acceder a sus pedidos a través de la pestaña "PEDIDOS" en su perfil (`/perfil`) o directamente navegando a `/pedido`.

---

### Archivos Involucrados:

#### 📄 **Archivo:** `src/app/pedido/page.jsx`
* **Rol:** Página de visualización de pedidos para el usuario.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `PedidosPage` (componente principal), `PedidosContent` (alias para `src/app/perfil/PedidosComponent`).
    * **Lógica Principal:** Actúa como un contenedor simple que renderiza el componente `PedidosContent`, delegando toda la lógica de visualización de pedidos a este último.
    * **Modelos de Datos / Endpoints:** No interactúa directamente.

#### 📄 **Archivo:** `src/app/perfil/PedidosComponent.jsx`
* **Rol:** Componente que muestra los pedidos realizados por el usuario, utilizado tanto en la página de perfil como en la página `/pedido`.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `PedidosComponent` (componente).
    * **Lógica Principal:** Recibe el `userId` como prop (cuando se usa en `ProfileContent`) y realiza una llamada a la Server Action `obtenerPedidosPorUsuarioId` de `PedidoActions.js` para obtener los pedidos del usuario. Renderiza la lista de pedidos.
    * **Modelos de Datos / Endpoints:** Consume `PedidoActions.js` para obtener datos de pedidos.

#### 📄 **Archivo:** `src/app/acciones/PedidoActions.js`
* **Rol:** Contiene Server Actions para la obtención de pedidos.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `obtenerPedidosPorUsuarioId`.
    * **Lógica Principal:**
        *   `obtenerPedidosPorUsuarioId`: Recupera pedidos asociados a un `usuarioId` específico de la base de datos, populando los diseños y el proveedor asociados.
    * **Modelos de Datos / Endpoints:** Consume el modelo `Pedido` de Mongoose.

