# ✅ Funcionalidad: Gestión de Proveedores (Admin)

**Descripción:** Permite a los administradores ver, filtrar y gestionar los proveedores habilitados en la plataforma. Incluye la capacidad de agregar proveedores (aunque el formulario específico no fue encontrado).

**Flujo de Interacción:** Los administradores acceden a esta funcionalidad desde el panel de administración (`/admin`) seleccionando la opción "Proveedores". Pueden ver una lista de proveedores, usar un formulario de filtro (placeholder) y acceder a una página para agregar nuevos proveedores.

---

### Archivos Involucrados:

#### 📄 **Archivo:** `src/components/layout/admin/dashboards/ProveedoresDashboard.jsx`
* **Rol:** Componente principal del dashboard de gestión de proveedores para administradores.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `ProveedoresDashboard` (componente), `AdminPage`, `SeccionAcciones`, `SeccionFooter`, `SeccionHeader`, `obtenerProveedoresHabilitados` (de `ProveedorActions.js`), `FormFiltrarProveedores`, `BotonAgregarProveedores`.
    * **Lógica Principal:**
        *   Utiliza `useState` y `useEffect` para obtener y gestionar la lista de proveedores habilitados.
        *   Llama a `obtenerProveedoresHabilitados` para cargar los proveedores.
        *   Renderiza un `FormFiltrarProveedores` (actualmente un placeholder).
        *   Proporciona un enlace (`Link`) a `/admin/proveedores/agregar` para añadir nuevos proveedores.
    * **Modelos de Datos / Endpoints:** Consume `ProveedorActions.js` para obtener datos de proveedores.

#### 📄 **Archivo:** `src/components/layout/admin/dashboards/proveedores/FormFiltrarProveedores.jsx`
* **Rol:** Componente de formulario (placeholder) para filtrar proveedores en el panel de administración.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `FormFiltrarProveedores` (componente), `useState`.
    * **Lógica Principal:** Actualmente es un marcador de posición que solo muestra los proveedores iniciales pasados como prop. No implementa lógica de filtrado real.
    * **Modelos de Datos / Endpoints:** No interactúa directamente.

#### 📄 **Archivo:** `src/app/acciones/ProveedorActions.js`
* **Rol:** Contiene Server Actions para la gestión de proveedores por parte del administrador.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `obtenerProveedoresHabilitados`, `obtenerProveedores`, `crearProveedor`, `actualizarProveedor`, `eliminarProveedor`, `obtenerProveedorPorId`.
    * **Lógica Principal:**
        *   `obtenerProveedoresHabilitados`: Recupera solo los proveedores que están habilitados.
        *   `obtenerProveedores`: Recupera todos los proveedores.
        *   `crearProveedor`: Crea un nuevo proveedor.
        *   `actualizarProveedor`: Actualiza los datos de un proveedor existente.
        *   `eliminarProveedor`: Elimina un proveedor.
        *   `obtenerProveedorPorId`: Busca un proveedor por su ID.
        *   Todas las acciones interactúan directamente con el modelo `Proveedor` de Mongoose y utilizan `revalidatePath`.
    * **Modelos de Datos / Endpoints:** Modifica/consume el modelo `Proveedor` de Mongoose.

