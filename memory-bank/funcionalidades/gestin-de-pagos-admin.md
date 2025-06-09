# ✅ Funcionalidad: Gestión de Pagos (Admin)

**Descripción:** Permite a los administradores ver, filtrar y gestionar los pagos registrados en la plataforma. Incluye la capacidad de agregar pagos (aunque el formulario específico no fue encontrado).

**Flujo de Interacción:** Los administradores acceden a esta funcionalidad desde el panel de administración (`/admin`) seleccionando la opción "Pagos". Pueden ver una lista de pagos, usar un formulario de filtro (placeholder) y acceder a una página para agregar nuevos pagos.

---

### Archivos Involucrados:

#### 📄 **Archivo:** `src/components/layout/admin/dashboards/PagosDashboard.jsx`
* **Rol:** Componente principal del dashboard de gestión de pagos para administradores. Este componente no debe incluir el `AdminLayout` ni `AdminPage` directamente, ya que se espera que sea renderizado como un hijo de un componente de diseño de página que ya proporciona el `AdminLayout`. Las secciones de acciones (`SeccionAcciones` y `SeccionFooter`) se han eliminado para evitar cuadros grises no deseados y para alinear el diseño con otras páginas de administración. El botón "Agregar Pago" se integrará directamente en la sección del encabezado.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `PagosDashboard` (componente), `SeccionHeader`, `obtenerPagos` (de `PagoActions.js`), `FormFiltrarPagos`, `BotonAgregarPagos`.
    * **Lógica Principal:**
        *   Utiliza `useState` y `useEffect` para obtener y gestionar la lista de pagos.
        *   Llama a `obtenerPagos` para cargar todos los pagos.
        *   Renderiza un `FormFiltrarPagos` (actualmente un placeholder).
        *   Proporciona un enlace (`Link`) a `/admin/pagos/agregar` para añadir nuevos pagos.
    * **Modelos de Datos / Endpoints:** Consume `PagoActions.js` para obtener datos de pagos.

#### 📄 **Archivo:** `src/components/layout/admin/dashboards/pagos/FormFiltrarPagos.jsx`
* **Rol:** Componente de formulario (placeholder) para filtrar pagos en el panel de administración.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `FormFiltrarPagos` (componente), `useState`.
    * **Lógica Principal:** Actualmente es un marcador de posición que solo muestra los pagos iniciales pasados como prop. No implementa lógica de filtrado real.
    * **Modelos de Datos / Endpoints:** No interactúa directamente.

#### 📄 **Archivo:** `src/app/acciones/PagoActions.js`
* **Rol:** Contiene Server Actions para la gestión de pagos por parte del administrador.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `guardarPago`, `obtenerPagos`, `ObtenerPagoPorId`, `EditarPago`.
    * **Lógica Principal:**
        *   `guardarPago`: Crea y guarda un nuevo pago en la base de datos.
        *   `obtenerPagos`: Recupera todos los pagos.
        *   `ObtenerPagoPorId`: Busca un pago específico por su ID.
        *   `EditarPago`: Actualiza los datos de un pago existente.
        *   Todas las acciones interactúan directamente con el modelo `Pago` de Mongoose y utilizan `revalidatePath`.
    * **Modelos de Datos / Endpoints:** Modifica/consume el modelo `Pago` de Mongoose.
