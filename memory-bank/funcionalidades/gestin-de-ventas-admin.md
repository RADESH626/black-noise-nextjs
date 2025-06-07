# ✅ Funcionalidad: Gestión de Ventas (Admin)

**Descripción:** Permite a los administradores ver, filtrar y gestionar las ventas registradas en la plataforma. Incluye la capacidad de agregar ventas (aunque el formulario específico no fue encontrado).

**Flujo de Interacción:** Los administradores acceden a esta funcionalidad desde el panel de administración (`/admin`) seleccionando la opción "Ventas". Pueden ver una lista de ventas, usar un formulario de filtro (placeholder) y acceder a una página para agregar nuevas ventas.

---

### Archivos Involucrados:

#### 📄 **Archivo:** `src/components/layout/admin/dashboards/VentasDashboard.jsx`
* **Rol:** Componente principal del dashboard de gestión de ventas para administradores.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `VentasDashboard` (componente), `AdminPage`, `SeccionAcciones`, `SeccionFooter`, `SeccionHeader`, `obtenerVentas` (de `VentaActions.js`), `FormFiltrarVentas`, `BotonAgregarVentas`.
    * **Lógica Principal:**
        *   Utiliza `useState` y `useEffect` para obtener y gestionar la lista de ventas.
        *   Llama a `obtenerVentas` para cargar todas las ventas.
        *   Renderiza un `FormFiltrarVentas` (actualmente un placeholder).
        *   Proporciona un enlace (`Link`) a `/admin/ventas/agregar` para añadir nuevas ventas.
    * **Modelos de Datos / Endpoints:** Consume `VentaActions.js` para obtener datos de ventas.

#### 📄 **Archivo:** `src/components/layout/admin/dashboards/ventas/FormFiltrarVentas.jsx`
* **Rol:** Componente de formulario (placeholder) para filtrar ventas en el panel de administración.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `FormFiltrarVentas` (componente), `useState`.
    * **Lógica Principal:** Actualmente es un marcador de posición que solo muestra las ventas iniciales pasadas como prop. No implementa lógica de filtrado real.
    * **Modelos de Datos / Endpoints:** No interactúa directamente.

#### 📄 **Archivo:** `src/app/acciones/VentaActions.js`
* **Rol:** Contiene Server Actions para la gestión de ventas por parte del administrador.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `guardarVenta`, `obtenerVentas`, `ObtenerVentaPorId`, `EditarVenta`.
    * **Lógica Principal:**
        *   `guardarVenta`: Crea y guarda un nuevo documento `Venta` en la base de datos.
        *   `obtenerVentas`: Recupera todas las ventas.
        *   `ObtenerVentaPorId`: Busca una venta específica por su ID.
        *   `EditarVenta`: Actualiza los datos de una venta existente.
        *   Todas las acciones interactúan directamente con el modelo `Venta` de Mongoose y utilizan `revalidatePath`.
    * **Modelos de Datos / Endpoints:** Modifica/consume el modelo `Venta` de Mongoose.

