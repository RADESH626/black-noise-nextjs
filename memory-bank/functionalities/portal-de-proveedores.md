# ✅ Funcionalidad: Portal de Proveedores

**Descripción:** Proporciona una interfaz para que los proveedores gestionen su perfil y visualicen sus pedidos. Los proveedores acceden al sistema mediante una clave de acceso única, en lugar de un registro de usuario tradicional. La funcionalidad de solicitud para convertirse en proveedor por parte de usuarios no proveedores ha sido eliminada.

**Flujo de Interacción:** Los proveedores inician sesión a través del formulario de login existente, utilizando su correo electrónico y la clave de acceso proporcionada. Una vez autenticados, son redirigidos a `/proveedor`. En este panel, pueden acceder a opciones para editar su perfil y ver sus pedidos. Los usuarios que no son proveedores no tendrán acceso a esta sección.

---

### Archivos Involucrados:

#### 📄 **Archivo:** `src/app/proveedor/page.jsx` (Modificado)
* **Rol:** Página principal del portal de proveedores.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `ProveedorPage` (componente principal), `useSession`, `useRouter`, `Link`, `BotonGeneral`.
    * **Lógica Principal:**
        *   Obtiene la sesión del usuario para verificar si es un proveedor autenticado (usando un flag `isSupplier` en la sesión).
        *   Muestra un panel específico para proveedores logueados con enlaces a `/proveedor/editar-perfil` y `/proveedor/pedidos`.
        *   Asegura que solo los usuarios con el flag `isSupplier` en la sesión puedan acceder a las funcionalidades del portal.
    * **Modelos de Datos / Endpoints:** Consume `ProveedorActions.js`.

#### 📄 **Archivo:** `src/app/proveedor/editar-perfil/page.jsx`
* **Rol:** Página para que un proveedor edite su información de perfil.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `EditarPerfilProveedorPage` (componente principal), `useSession`, `useRouter`, `FormEditarPerfilProveedor`, `obtenerMiPerfilProveedor` (de `ProveedorActions.js`).
    * **Lógica Principal:**
        *   Verifica la sesión del usuario y su tipo (`isSupplier`). Redirige si no está autenticado o no es proveedor.
        *   Obtiene los datos del perfil del proveedor usando `obtenerMiPerfilProveedor` (que ahora usará el `proveedorId` de la sesión).
        *   Renderiza `FormEditarPerfilProveedor` pasándole los datos del perfil.
    * **Modelos de Datos / Endpoints:** Consume `ProveedorActions.js` para obtener y actualizar datos del perfil de proveedor.

#### 📄 **Archivo:** `src/components/layout/proveedor/forms/FormEditarPerfilProveedor.jsx`
* **Rol:** Formulario para que los proveedores editen su perfil.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `FormEditarPerfilProveedor` (componente), `useState`, `useRouter`, `BotonGeneral`, `InputGeneral`, `actualizarPerfilProveedor` (de `ProveedorActions.js`), `Disponibilidad` (enum), `MetodoPago` (enum).
    * **Lógica Principal:**
        *   Maneja el estado del formulario con `useState`, inicializándolo con `perfilInicial`.
        *   Permite editar campos como nombre de empresa, dirección, métodos de pago aceptados, disponibilidad y permisos de detalles de crédito.
        *   Utiliza `actualizarPerfilProveedor` como Server Action para guardar los cambios.
        *   Maneja estados de carga, error y éxito, y redirige a `/proveedor` al finalizar.
    * **Modelos de Datos / Endpoints:** Interactúa con `ProveedorActions.js` para actualizar el perfil del proveedor.

#### 📄 **Archivo:** `src/app/acciones/ProveedorActions.js` (Modificado)
* **Rol:** Contiene Server Actions para la gestión de perfiles de proveedor y la generación/gestión de claves de acceso.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `generarYGuardarAccessKey` (nuevo), `obtenerMiPerfilProveedor`, `actualizarPerfilProveedor`, `obtenerProveedores`.
    * **Lógica Principal:**
        *   `generarYGuardarAccessKey`: Genera una clave de acceso única y la guarda hasheada en el perfil del proveedor.
        *   `obtenerMiPerfilProveedor`: Recupera el perfil del proveedor asociado al usuario autenticado (ahora basado en la sesión de proveedor).
        *   `actualizarPerfilProveedor`: Actualiza los datos del perfil de un proveedor.
        *   `obtenerProveedores`: Recupera una lista de todos los proveedores (para uso administrativo).
        *   Todas las acciones interactúan directamente con el modelo `Proveedor` de Mongoose y utilizan `revalidatePath`.
    * **Modelos de Datos / Endpoints:** Modifica/consume el modelo `Proveedor` de Mongoose.

#### 📄 **Archivo:** `src/app/acciones/PedidoActions.js` (Modificado)
* **Rol:** Contiene Server Actions para la obtención y, si aplica, edición de pedidos, con un enfoque en la seguridad y el alcance para proveedores.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `obtenerPedidoPorProveedorId` (nuevo), `actualizarEstadoPedidoProveedor` (nuevo, si se permite edición).
    * **Lógica Principal:**
        *   `obtenerPedidoPorProveedorId`: Recupera un pedido específico solo si está asociado al `proveedorId` proporcionado.
        *   `actualizarEstadoPedidoProveedor`: (Opcional) Permite a un proveedor actualizar el estado de *sus* pedidos, con validaciones estrictas.
    * **Modelos de Datos / Endpoints:** Modifica/consume el modelo `Pedido` de Mongoose.

#### 📄 **Archivo:** `src/app/proveedor/pedidos/page.jsx` (Nuevo)
* **Rol:** Página principal para que un proveedor vea una lista de sus pedidos.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `useSession`, `useRouter`, `obtenerPedidosPorProveedorId` (de `PedidoActions.js`).
    * **Lógica Principal:**
        *   Verifica la sesión del usuario y su tipo (`isSupplier`). Redirige si no es un proveedor autenticado.
        *   Obtiene el `proveedorId` de la sesión.
        *   Llama a `obtenerPedidosPorProveedorId` para cargar solo los pedidos asociados a ese proveedor.
        *   Renderiza la lista de pedidos.

#### 📄 **Archivo:** `src/app/proveedor/pedidos/ver/[id]/page.jsx` (Nuevo)
* **Rol:** Página para que un proveedor vea los detalles de un pedido específico que le pertenece.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `useSession`, `useRouter`, `obtenerPedidoPorProveedorId` (de `PedidoActions.js`).
    * **Lógica Principal:**
        *   Obtiene el `pedidoId` de los parámetros de la URL y el `proveedorId` de la sesión.
        *   Llama a `obtenerPedidoPorProveedorId(pedidoId, proveedorId)` para obtener los detalles del pedido, asegurando que el pedido realmente pertenece al proveedor autenticado.
        *   Renderiza los detalles del pedido.
