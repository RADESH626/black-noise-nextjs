# ✅ Funcionalidad: Gestión de Diseños (Admin)

**Descripción:** Permite a los administradores ver, filtrar y gestionar los diseños de ropa en la plataforma. Incluye la capacidad de agregar diseños (aunque el formulario específico no fue encontrado) y la carga masiva.

**Flujo de Interacción:** Los administradores acceden a esta funcionalidad desde el panel de administración (`/admin`) seleccionando la opción "Diseños". Pueden ver una lista de diseños, usar un formulario de filtro (placeholder) y acceder a una página para agregar nuevos diseños.

---

### Archivos Involucrados:

#### 📄 **Archivo:** `src/components/layout/admin/dashboards/DesignsDashboard.jsx`
* **Rol:** Componente principal del dashboard de gestión de diseños para administradores.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `DesignsDashboard` (componente), `AdminPage`, `SeccionAcciones`, `SeccionFooter`, `SeccionHeader`, `obtenerDesigns` (de `DesignActions.js`), `FormFiltrarDesigns`, `BotonAgregarDesigns`.
    * **Lógica Principal:**
        *   Utiliza `useState` y `useEffect` para obtener y gestionar la lista de diseños.
        *   Llama a `obtenerDesigns` para cargar todos los diseños.
        *   Renderiza un `FormFiltrarDesigns` (actualmente un placeholder).
        *   Proporciona un enlace (`Link`) a `/admin/designs/agregar` para añadir nuevos diseños.
    * **Modelos de Datos / Endpoints:** Consume `DesignActions.js` para obtener datos de diseños.

#### 📄 **Archivo:** `src/components/layout/admin/dashboards/designs/FormFiltrarDesigns.jsx`
* **Rol:** Componente de formulario (placeholder) para filtrar diseños en el panel de administración.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `FormFiltrarDesigns` (componente), `useState`.
    * **Lógica Principal:** Actualmente es un marcador de posición que solo muestra los diseños iniciales pasados como prop. No implementa lógica de filtrado real.
    * **Modelos de Datos / Endpoints:** No interactúa directamente.

#### 📄 **Archivo:** `src/app/acciones/DesignActions.js`
* **Rol:** Contiene Server Actions para la gestión de diseños por parte del administrador.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `guardarDesigns`, `obtenerDesigns`, `RegistrarDesign`, `RegistroMasivoDesigns`, `encontrarDesignsPorId`, `actualizarDesign`, `eliminarDesign`.
    * **Lógica Principal:**
        *   `guardarDesigns` / `RegistrarDesign`: Guarda un nuevo diseño en la base de datos.
        *   `obtenerDesigns`: Recupera todos los diseños.
        *   `RegistroMasivoDesigns`: Permite la carga masiva de diseños mediante un archivo CSV.
        *   `encontrarDesignsPorId`, `actualizarDesign`, `eliminarDesign`: Funciones para la gestión individual de diseños (obtener, actualizar, eliminar).
        *   Todas las acciones interactúan directamente con el modelo `Design` de Mongoose y utilizan `revalidatePath`.
    * **Modelos de Datos / Endpoints:** Modifica/consume el modelo `Design` de Mongoose.

