# Funcionalidad: Gestión de Pedidos (Proveedor)

**Descripción:** Permite a los proveedores autenticados ver y gestionar exclusivamente los pedidos que les corresponden, sin acceso a información de usuarios o pedidos de otros proveedores.

**Flujo de Interacción:** Los proveedores inician sesión utilizando una clave de acceso única. Una vez autenticados, son redirigidos a su portal (`/proveedor`), desde donde pueden navegar a la sección de "Mis Pedidos" (`/proveedor/pedidos`). En esta sección, podrán ver una lista de sus pedidos y acceder a los detalles de cada uno.

---

### Archivos Involucrados:

#### 📄 **Archivo:** `src/models/Proveedor.js` (Modificado)
* **Rol:** Define el esquema del modelo de datos para los proveedores.
* **Implementación Clave:**
    * **Cambios:** Se añadirá un campo `accessKey` (hashed) para la autenticación de proveedores.

#### 📄 **Archivo:** `src/app/acciones/ProveedorActions.js` (Modificado)
* **Rol:** Contiene Server Actions para la gestión de perfiles de proveedor y la generación/gestión de claves de acceso.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `generarYGuardarAccessKey`, `obtenerMiPerfilProveedor`, `actualizarPerfilProveedor`.
    * **Lógica Principal:**
        *   `generarYGuardarAccessKey`: Genera una clave de acceso única y la guarda hasheada en el perfil del proveedor.
        *   `obtenerMiPerfilProveedor`: Recupera el perfil del proveedor asociado al usuario autenticado (ahora basado en la sesión de proveedor).
        *   `actualizarPerfilProveedor`: Actualiza los datos del perfil de un proveedor.

#### 📄 **Archivo:** `src/app/acciones/UsuariosActions.js` (Modificado)
* **Rol:** Contiene Server Actions para la autenticación de usuarios, ahora extendida para manejar la autenticación de proveedores mediante clave de acceso.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `loginAction`.
    * **Lógica Principal:**
        *   `loginAction`: Primero intenta autenticar como usuario regular. Si falla, intenta autenticar como proveedor usando la clave de acceso proporcionada contra el campo `accessKey` en el modelo `Proveedor`. Si es exitoso, establece una sesión que identifica al usuario como proveedor y contiene su `proveedorId`.

#### 📄 **Archivo:** `src/app/api/auth/[...nextauth]/route.js` (Modificado)
* **Rol:** Configuración de NextAuth.js para la autenticación.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `CredentialsProvider`, `jwt` callback, `session` callback.
    * **Lógica Principal:**
        *   `authorize` callback: Modificado para manejar la lógica de autenticación tanto para usuarios regulares como para proveedores (usando la clave de acceso).
        *   `jwt` callback: Asegura que la información del proveedor (como `proveedorId` y un flag `isSupplier`) se añada al token JWT.
        *   `session` callback: Asegura que la información del proveedor esté disponible en el objeto de sesión del cliente.

#### 📄 **Archivo:** `src/middleware.js` (Modificado)
* **Rol:** Middleware de Next.js para la protección de rutas y la redirección basada en roles/tipo de usuario.
* **Implementación Clave:**
    * **Lógica Principal:** Intercepta las solicitudes, verifica la sesión del usuario (ahora incluyendo el flag `isSupplier` y `proveedorId`), y redirige a rutas específicas si no tienen los permisos adecuados. Protege rutas como `/proveedor` para asegurar que solo los proveedores autenticados puedan acceder.

#### 📄 **Archivo:** `src/app/proveedor/pedidos/page.jsx` (Nuevo/Modificado)
* **Rol:** Página principal para que un proveedor vea una lista de sus pedidos.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `useSession`, `useRouter`, `obtenerPedidosPorProveedorId` (de `PedidoActions.js`).
    * **Lógica Principal:**
        *   Verifica la sesión del usuario y su rol/tipo (`isSupplier`). Redirige si no es un proveedor autenticado.
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

#### 📄 **Archivo:** `src/app/acciones/PedidoActions.js` (Modificado)
* **Rol:** Contiene Server Actions para la obtención y, si aplica, edición de pedidos, con un enfoque en la seguridad y el alcance para proveedores.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `obtenerPedidoPorProveedorId`, `actualizarEstadoPedidoProveedor` (nuevo, si se permite edición).
    * **Lógica Principal:**
        *   `obtenerPedidoPorProveedorId`: Recupera un pedido específico solo si está asociado al `proveedorId` proporcionado.
        *   `actualizarEstadoPedidoProveedor`: (Opcional) Permite a un proveedor actualizar el estado de *sus* pedidos, con validaciones estrictas.

#### 📄 **Archivo:** `src/app/proveedor/page.jsx` (Modificado)
* **Rol:** Página principal del portal de proveedores.
* **Implementación Clave:**
    * **Lógica Principal:** Se modificará el enlace existente para "Ver Pedidos" para que apunte a la nueva ruta `/proveedor/pedidos`.
