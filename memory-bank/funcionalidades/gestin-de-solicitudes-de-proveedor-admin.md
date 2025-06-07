# ✅ Funcionalidad: Gestión de Solicitudes de Proveedor (Admin)

**Descripción:** Permite a los administradores ver y filtrar las solicitudes de nuevos proveedores.

**Flujo de Interacción:** Los administradores acceden a esta funcionalidad desde el panel de administración (`/admin`) seleccionando la opción "Solicitudes". Pueden ver una lista de solicitudes y usar un formulario de filtro (placeholder).

---

### Archivos Involucrados:

#### 📄 **Archivo:** `src/components/layout/admin/dashboards/SolicitudesProveedorDashboard.jsx`
* **Rol:** Componente principal del dashboard de gestión de solicitudes de proveedor para administradores.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `SolicitudesProveedorDashboard` (componente), `AdminPage`, `SeccionAcciones`, `SeccionHeader`, `obtenerSolicitudesProveedor` (de `SolicitudProveedorActions.js`), `FormFiltrarSolicitudesProveedor`.
    * **Lógica Principal:**
        *   Utiliza `useState` y `useEffect` para obtener y gestionar la lista de solicitudes de proveedor.
        *   Llama a `obtenerSolicitudesProveedor` para cargar las solicitudes.
        *   Renderiza un `FormFiltrarSolicitudesProveedor` (actualmente un placeholder).
        *   No incluye un botón para agregar solicitudes, ya que los administradores no las crean directamente.
    * **Modelos de Datos / Endpoints:** Consume `SolicitudProveedorActions.js` para obtener datos de solicitudes.

#### 📄 **Archivo:** `src/components/layout/admin/dashboards/solicitudes-proveedor/FormFiltrarSolicitudesProveedor.jsx`
* **Rol:** Componente de formulario (placeholder) para filtrar solicitudes de proveedor en el panel de administración.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `FormFiltrarSolicitudesProveedor` (componente), `useState`.
    * **Lógica Principal:** Actualmente es un marcador de posición que solo muestra las solicitudes iniciales pasadas como prop. No implementa lógica de filtrado real.
    * **Modelos de Datos / Endpoints:** No interactúa directamente.

#### 📄 **Archivo:** `src/app/acciones/SolicitudProveedorActions.js`
* **Rol:** Contiene Server Actions para la gestión de solicitudes de proveedor.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `guardarSolicitudProveedor`, `obtenerSolicitudesProveedor`, `ObtenerSolicitudProveedorPorId`, `EditarSolicitudProveedor`, `eliminarSolicitudProveedor`.
    * **Lógica Principal:**
        *   `guardarSolicitudProveedor`: Crea y guarda una nueva solicitud de proveedor.
        *   `obtenerSolicitudesProveedor`: Recupera todas las solicitudes de proveedor.
        *   `ObtenerSolicitudProveedorPorId`: Busca una solicitud por su ID.
        *   `EditarSolicitudProveedor`: Actualiza el estado u otros campos de una solicitud (ej. aprobar/rechazar).
        *   `eliminarSolicitudProveedor`: Elimina una solicitud.
        *   Todas las acciones interactúan directamente con el modelo `SolicitudProveedor` de Mongoose y utilizan `revalidatePath`.
    * **Modelos de Datos / Endpoints:** Modifica/consume el modelo `SolicitudProveedor` de Mongoose.

