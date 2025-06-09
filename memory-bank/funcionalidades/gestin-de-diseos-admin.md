# ✅ Funcionalidad: Gestión de Diseños (Admin)

**Descripción:** Permite a los administradores ver, filtrar y gestionar los diseños de ropa en la plataforma. Incluye la capacidad de agregar diseños (aunque el formulario específico no fue encontrado) y la carga masiva.

**Flujo de Interacción:** Los administradores acceden a esta funcionalidad desde el panel de administración (`/admin`) seleccionando la opción "Diseños". Pueden ver una lista de diseños, usar un formulario de filtro (placeholder) y acceder a una página para agregar nuevos diseños.

---

### Archivos Involucrados:

#### 📄 **Archivo:** `src/components/layout/admin/dashboards/DesignsDashboard.jsx`
* **Rol:** Componente de contenido para el dashboard de gestión de diseños para administradores. Este componente no debe incluir el `AdminLayout` directamente, ya que se espera que sea renderizado como un hijo de un componente de diseño de página que ya proporciona el `AdminLayout`. Las secciones de acciones (`SeccionAcciones` y `SeccionFooter`) se han eliminado para evitar cuadros grises no deseados y para alinear el diseño con otras páginas de administración. El botón "Agregar Diseño" se integrará directamente en la sección del encabezado.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `DesignsDashboard` (componente), `SeccionHeader`, `obtenerDesigns` (de `DesignActions.js`), `FormFiltrarDesigns`, `BotonAgregarDesigns`.
    * **Lógica Principal:**
        *   Utiliza `useState` y `useEffect` para obtener y gestionar la lista de diseños.
        *   Llama a `obtenerDesigns` para cargar todos los diseños.
        *   Renderiza un `FormFiltrarDesigns` (actualmente un placeholder).
        *   Proporciona un enlace (`Link`) a `/admin/designs/agregar` para añadir nuevos diseños, integrado visualmente con el encabezado.
    * **Modelos de Datos / Endpoints:** Consume `DesignActions.js` para obtener datos de diseños, esperando que la respuesta contenga un objeto con la propiedad `data` que es un array de diseños.

#### 📄 **Archivo:** `src/components/layout/admin/dashboards/designs/FormFiltrarDesigns.jsx`
* **Rol:** Componente de formulario para filtrar diseños en el panel de administración, con un estilo similar a la sección de búsqueda de usuarios.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `FormFiltrarDesigns` (componente), `useState`.
    * **Lógica Principal:** Se actualizará para incluir campos de entrada y un botón de búsqueda, con un diseño que imita la sección de filtro de la página de gestión de usuarios.
    * **Modelos de Datos / Endpoints:** No interactúa directamente con acciones de servidor para el filtrado en esta etapa, pero su diseño se alinea con la interfaz de usuario general.

#### 📄 **Archivo:** `src/components/layout/admin/dashboards/designs/DesignsTable.jsx` (Nuevo)
* **Rol:** Componente para mostrar la lista de diseños en formato de tabla, siguiendo el estilo de la tabla de usuarios.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `DesignsTable` (componente).
    * **Lógica Principal:** Recibirá un array de diseños como prop y los renderizará en una tabla con columnas para información relevante del diseño (e.g., nombre, categoría, precio, acciones).
    * **Modelos de Datos / Endpoints:** Recibe datos de diseños como prop.

#### 📄 **Archivo:** `src/components/common/botones/BotonAgregarDesigns.jsx`
* **Rol:** Componente de botón reutilizable para agregar diseños.
* **Implementación Clave:**
    * **Lógica Principal:** Un botón simple con estilos básicos de Tailwind CSS para asegurar un tamaño compacto y una apariencia consistente.
    * **Estilos:** Incluye clases de Tailwind para padding, color de fondo, color de texto y bordes redondeados.

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
