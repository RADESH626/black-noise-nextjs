# ✅ Funcionalidad: Portal de Proveedores

**Descripción:** Proporciona una interfaz para que los usuarios con rol de "Proveedor" gestionen su perfil y visualicen sus pedidos. También permite a los usuarios no proveedores solicitar convertirse en uno.

**Flujo de Interacción:** Los usuarios acceden a `/proveedor`. Si son proveedores, ven un panel con opciones para editar su perfil y ver sus pedidos. Si no son proveedores, ven una lista de proveedores existentes y un botón para enviar una solicitud para ser proveedor.

---

### Archivos Involucrados:

#### 📄 **Archivo:** `src/app/proveedor/page.jsx`
* **Rol:** Página principal del portal de proveedores.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `ProveedorPage` (componente principal), `useSession`, `useRouter`, `Link`, `BotonGeneral`, `Rol` (enum).
    * **Lógica Principal:**
        *   Obtiene la sesión del usuario para determinar su rol.
        *   Muestra un panel específico para proveedores logueados con enlaces a `/proveedor/editar-perfil` y `/proveedor/pedidos`.
        *   Muestra una lista de "Nuestros Proveedores" (aunque la obtención de datos está actualmente comentada/bypasseada).
        *   Si el usuario no es proveedor, muestra un botón para "Solicitar ser Proveedor" que enlaza a `/proveedor/solicitud`.
        *   Nota: La lógica de obtención de datos de proveedores (`obtenerProveedores`, `obtenerMiPerfilProveedor`) está actualmente comentada o bypassada para desarrollo.
    * **Modelos de Datos / Endpoints:** Consume `ProveedorActions.js` (aunque actualmente bypassado).

#### 📄 **Archivo:** `src/app/proveedor/editar-perfil/page.jsx`
* **Rol:** Página para que un proveedor edite su información de perfil.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `EditarPerfilProveedorPage` (componente principal), `useSession`, `useRouter`, `FormEditarPerfilProveedor`, `obtenerMiPerfilProveedor` (de `ProveedorActions.js`), `Rol` (enum).
    * **Lógica Principal:**
        *   Verifica la sesión del usuario y su rol (`PROVEEDOR`). Redirige si no está autenticado o no es proveedor.
        *   Obtiene los datos del perfil del proveedor usando `obtenerMiPerfilProveedor`.
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

#### 📄 **Archivo:** `src/app/proveedor/pedidos/editar/[id]/page.jsx`
* **Rol:** Página para que un proveedor (o administrador) edite un pedido específico.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `EditarPedidoPage` (componente principal), `AdminFormPage`, `FormEditarPedido`.
    * **Lógica Principal:**
        *   Obtiene el `pedidoId` de los parámetros de la URL.
        *   Renderiza `FormEditarPedido` pasándole el `pedidoId`.
        *   Utiliza `AdminFormPage` para proporcionar un layout con título y breadcrumbs (lo que sugiere que este componente podría ser compartido con el panel de administración).
        *   Nota: El componente `FormEditarPedido` no fue encontrado en la ruta esperada.
    * **Modelos de Datos / Endpoints:** El `FormEditarPedido` (si existe) interactuaría con `PedidoActions.js`.

#### 📄 **Archivo:** `src/app/acciones/ProveedorActions.js`
* **Rol:** Contiene Server Actions para la gestión de perfiles de proveedor.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `obtenerMiPerfilProveedor`, `actualizarPerfilProveedor`, `obtenerProveedores`.
    * **Lógica Principal:**
        *   `obtenerMiPerfilProveedor`: Recupera el perfil del proveedor asociado al usuario autenticado.
        *   `actualizarPerfilProveedor`: Actualiza los datos del perfil de un proveedor.
        *   `obtenerProveedores`: Recupera una lista de todos los proveedores.
        *   Todas las acciones interactúan directamente con el modelo `Proveedor` de Mongoose y utilizan `revalidatePath`.
    * **Modelos de Datos / Endpoints:** Modifica/consume el modelo `Proveedor` de Mongoose.

#### 📄 **Archivo:** `src/app/acciones/PedidoActions.js`
* **Rol:** Contiene Server Actions para la obtención y edición de pedidos, relevantes para el portal de proveedores.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `obtenerPedidosPorUsuarioId`, `ObtenerPedidoPorId`, `EditarPedido`.
    * **Lógica Principal:**
        *   `obtenerPedidosPorUsuarioId`: Permite a un proveedor ver sus pedidos.
        *   `ObtenerPedidoPorId`: Permite obtener los detalles de un pedido específico.
        *   `EditarPedido`: Permite actualizar el estado u otros detalles de un pedido (relevante si los proveedores pueden gestionar sus pedidos).
    * **Modelos de Datos / Endpoints:** Modifica/consume el modelo `Pedido` de Mongoose.
