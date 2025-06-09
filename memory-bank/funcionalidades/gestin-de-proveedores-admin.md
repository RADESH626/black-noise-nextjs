# ✅ Funcionalidad: Gestión de Proveedores (Admin)

**Descripción:** Permite a los administradores ver, filtrar, agregar, editar y eliminar proveedores directamente en la plataforma. Esta es la única vía para incorporar nuevos proveedores al sistema, reemplazando cualquier proceso de solicitud previo por parte de usuarios generales.

**Flujo de Interacción:** Los administradores acceden a esta funcionalidad desde el panel de administración (`/admin`) seleccionando la opción "Proveedores". Pueden ver una lista de proveedores existentes, usar un formulario de filtro (placeholder) y acceder a un formulario dedicado para agregar nuevos proveedores.

---

### Archivos Involucrados:

#### 📄 **Archivo:** `src/components/layout/admin/dashboards/GestionProveedoresDashboard.jsx` (Renombrado/Modificado)
* **Rol:** Componente principal del dashboard de gestión de proveedores para administradores. Este componente no debe incluir el `AdminLayout` ni `AdminPage` directamente, ya que se espera que sea renderizado como un hijo de un componente de diseño de página que ya proporciona el `AdminLayout`. Las secciones de acciones (`SeccionAcciones` y `SeccionFooter`) se han eliminado para evitar cuadros grises no deseados y para alinear el diseño con otras páginas de administración. El botón "Agregar Proveedor" se integrará directamente en la sección del encabezado.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `GestionProveedoresDashboard` (componente), `SeccionHeader`, `obtenerProveedoresHabilitados` (de `ProveedorActions.js`), `FormFiltrarProveedores`, `BotonAgregarProveedores`.
    * **Lógica Principal:**
        *   Utiliza `useState` y `useEffect` para obtener y gestionar la lista de proveedores habilitados.
        *   Llama a `obtenerProveedoresHabilitados` para cargar los proveedores.
        *   Renderiza un `FormFiltrarProveedores` (actualmente un placeholder).
        *   Proporciona un enlace (`Link`) a la página de agregar proveedor (e.g., `/admin/proveedores/agregar`).
    * **Modelos de Datos / Endpoints:** Consume `ProveedorActions.js` para obtener datos de proveedores.

#### 📄 **Archivo:** `src/components/layout/admin/dashboards/proveedores/FormFiltrarProveedores.jsx`
* **Rol:** Componente de formulario (placeholder) para filtrar proveedores en el panel de administración.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `FormFiltrarProveedores` (componente), `useState`.
    * **Lógica Principal:** Actualmente es un marcador de posición que solo muestra los proveedores iniciales pasados como prop. No implementa lógica de filtrado real.
    * **Modelos de Datos / Endpoints:** No interactúa directamente.

#### 📄 **Archivo:** `src/app/acciones/ProveedorActions.js` (Modificado)
* **Rol:** Contiene Server Actions para la gestión de proveedores por parte del administrador.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `obtenerProveedoresHabilitados`, `obtenerProveedores`, `crearProveedor`, `actualizarProveedor`, `eliminarProveedor`, `obtenerProveedorPorId`.
    * **Lógica Principal:**
        *   `obtenerProveedoresHabilitados`: Recupera solo los proveedores que están habilitados.
        *   `obtenerProveedores`: Recupera todos los proveedores.
        *   `crearProveedor`: Crea un nuevo proveedor. **Esta acción debe incluir una verificación de rol de administrador (`getServerSession`) para asegurar que solo los administradores puedan ejecutarla.**
        *   `actualizarProveedor`: Actualiza los datos de un proveedor existente.
        *   `eliminarProveedor`: Elimina un proveedor.
        *   `obtenerProveedorPorId`: Busca un proveedor por su ID.
        *   Todas las acciones interactúan directamente con el modelo `Proveedor` de Mongoose y utilizan `revalidatePath`.
    * **Modelos de Datos / Endpoints:** Modifica/consume el modelo `Proveedor` de Mongoose.
