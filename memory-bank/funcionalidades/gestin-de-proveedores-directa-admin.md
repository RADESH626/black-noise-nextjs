# ✅ Funcionalidad: Gestión Directa de Proveedores (Admin)

**Descripción:** Permite a los administradores agregar, editar y eliminar proveedores directamente en la base de datos. La funcionalidad de "solicitar ser proveedor" para usuarios generales ha sido eliminada.

**Flujo de Interacción:** Los administradores acceden a esta funcionalidad desde el panel de administración (`/admin`) seleccionando la opción "Proveedores". Desde allí, pueden acceder a un formulario para agregar nuevos proveedores, así como gestionar los existentes.

---

### Archivos Involucrados:

#### 📄 **Archivo:** `src/components/layout/admin/dashboards/GestionProveedoresDashboard.jsx` (Nuevo/Modificado)
* **Rol:** Componente principal del dashboard de gestión de proveedores para administradores.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `GestionProveedoresDashboard` (componente), `AdminPage`, `SeccionAcciones`, `SeccionHeader`, `FormularioAgregarProveedor` (nuevo componente), `obtenerProveedores` (de `ProveedorActions.js`).
    * **Lógica Principal:**
        *   Utiliza `useState` y `useEffect` para obtener y gestionar la lista de proveedores.
        *   Llama a `obtenerProveedores` para cargar los proveedores existentes.
        *   Incluye un botón o enlace para acceder al `FormularioAgregarProveedor`.
        *   Muestra la lista de proveedores existentes con opciones para editar o eliminar.
    * **Modelos de Datos / Endpoints:** Consume `ProveedorActions.js` para obtener y gestionar datos de proveedores.

#### 📄 **Archivo:** `src/components/layout/admin/dashboards/proveedores/FormularioAgregarProveedor.jsx` (Nuevo/Modificado)
* **Rol:** Componente de formulario para que los administradores agreguen nuevos proveedores.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `FormularioAgregarProveedor` (componente), `useActionState`, `useFormStatus`, `usePopUp`, `guardarProveedor` (de `ProveedorActions.js`).
    * **Lógica Principal:**
        *   Implementa el patrón de Server Actions para el envío del formulario.
        *   Recopila los datos del nuevo proveedor (nombre, contacto, etc.).
        *   Llama a la Server Action `guardarProveedor` para persistir el proveedor en la base de datos.
        *   Maneja los estados de carga y muestra mensajes de éxito/error usando `PopUpContext`.
    * **Modelos de Datos / Endpoints:** Interactúa con `ProveedorActions.js` para guardar nuevos proveedores.

#### 📄 **Archivo:** `src/app/acciones/ProveedorActions.js` (Modificado)
* **Rol:** Contiene Server Actions para la gestión de proveedores.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `guardarProveedor`, `obtenerProveedores`, `obtenerProveedorPorId`, `editarProveedor`, `eliminarProveedor`.
    * **Lógica Principal:**
        *   `guardarProveedor`: Crea y guarda un nuevo proveedor. **Debe incluir una verificación de rol de administrador (`getServerSession`) para asegurar que solo los administradores puedan ejecutar esta acción.**
        *   `obtenerProveedores`: Recupera todos los proveedores.
        *   `obtenerProveedorPorId`: Busca un proveedor por su ID.
        *   `editarProveedor`: Actualiza los campos de un proveedor existente.
        *   `eliminarProveedor`: Elimina un proveedor.
        *   Todas las acciones interactúan directamente con el modelo `Proveedor` de Mongoose y utilizan `revalidatePath`.
    * **Modelos de Datos / Endpoints:** Modifica/consume el modelo `Proveedor` de Mongoose.

#### 📄 **Archivo:** `src/app/solicitud-proveedor/page.jsx` (Eliminado/Redirigido)
* **Rol:** Anteriormente, la página pública para solicitar ser proveedor.
* **Cambio:** Esta página será eliminada o redirigida, ya que la funcionalidad de solicitud por parte de usuarios generales ha sido removida.

#### 📄 **Archivo:** `src/app/acciones/SolicitudProveedorActions.js` (Eliminado/Modificado)
* **Rol:** Anteriormente, contenía Server Actions para la gestión de solicitudes de proveedor.
* **Cambio:** Las acciones relacionadas con `SolicitudProveedor` serán eliminadas o adaptadas si alguna lógica es reutilizable para la gestión directa de proveedores. Lo más probable es que sea eliminada.

#### 📄 **Archivo:** `src/models/SolicitudProveedor.js` (Eliminado/Modificado)
* **Rol:** Anteriormente, el modelo de Mongoose para las solicitudes de proveedor.
* **Cambio:** Este modelo será eliminado si la funcionalidad de solicitud es completamente removida.
