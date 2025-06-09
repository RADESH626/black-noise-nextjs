# ✅ Funcionalidad: Panel de Administración

**Descripción:** Proporciona una interfaz centralizada para que los administradores gestionen diversas entidades y operaciones del sistema, incluyendo usuarios, diseños, pedidos, ventas y pagos.

**Flujo de Interacción:** Los administradores acceden al panel a través de `/admin` después de iniciar sesión. Una barra lateral (`AdminSidebar`) les permite navegar entre los diferentes dashboards de gestión. El botón "Volver al Inicio" en la barra de navegación ha sido reemplazado por un botón "Cerrar Sesión" para una gestión de sesión más directa.

---

### Archivos Involucrados:

#### 📄 **Archivo:** `src/app/admin/layout.jsx`
* **Rol:** Layout principal del panel de administración, incluyendo la barra de navegación (`AdminNavbar`) y la barra lateral (`AdminSidebar`).
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `AdminNavbar`, `AdminSidebar`, `signOut` (de `next-auth/react`).
    * **Lógica Principal:** Contiene la estructura general del panel de administración. El botón "Volver al Inicio" en `AdminNavbar` ha sido modificado para ser un botón de "Cerrar Sesión" que invoca la función `signOut` de NextAuth.js.
    * **Modelos de Datos / Endpoints:** Interactúa con la funcionalidad de autenticación de NextAuth.js para cerrar la sesión.

#### 📄 **Archivo:** `src/app/admin/page.jsx`
* **Rol:** Página principal del panel de administración.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `AdminPage` (componente principal), `AdminSidebar`, `HomeDashboard`, `UsuariosDashboard`, `DesignsDashboard`, `GestionProveedoresDashboard`, `PedidosDashboard`, `VentasDashboard`, `PagosDashboard`.
    * **Lógica Principal:**
        *   Maneja el estado del dashboard activo (`activeDashboard`) basado en la selección del usuario en la barra lateral.
        *   Utiliza un objeto `dashboardComponents` para mapear IDs de dashboard a los componentes correspondientes, permitiendo un renderizado dinámico.
        *   Renderiza `AdminSidebar` para la navegación y el `CurrentDashboard` seleccionado.
        *   **Nuevo:** Se ha añadido un dashboard de "Inicio" (`HomeDashboard`) para mostrar métricas clave.
    * **Modelos de Datos / Endpoints:** No interactúa directamente con la base de datos, actúa como un orquestador de la UI del panel.

#### 📄 **Archivo:** `src/components/layout/admin/dashboards/HomeDashboard.jsx`
* **Rol:** Componente de dashboard que muestra métricas clave para el administrador (ventas totales, usuarios registrados, pedidos pendientes).
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `SeccionHeader`, `obtenerMetricasDashboard` (de `src/app/acciones/DashboardActions.js`).
    * **Lógica Principal:**
        *   Fetches key metrics from the backend using `obtenerMetricasDashboard`.
        *   Displays loading and error states.
        *   Presents the metrics in a clear, summarized format.
    * **Modelos de Datos / Endpoints:** Interactúa con `src/app/acciones/DashboardActions.js` para obtener datos agregados de los modelos `Venta`, `Usuario` y `Pedido`.

#### 📄 **Archivo:** `src/app/acciones/DashboardActions.js`
* **Rol:** Contiene las Server Actions para obtener métricas agregadas del dashboard.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `connectDB`, `Venta`, `Usuario`, `Pedido`.
    * **Lógica Principal:**
        *   Define `obtenerMetricasDashboard` para calcular y retornar el total de ventas, el número de usuarios y el número de pedidos pendientes.
        *   Maneja la conexión a la base de datos y la lógica de agregación.
    * **Modelos de Datos / Endpoints:** Interactúa directamente con los modelos de Mongoose (`Venta`, `Usuario`, `Pedido`) para realizar consultas de agregación.

#### 📄 **Directorio:** `src/app/api/administrador/`
* **Rol:** Contiene las rutas de la API para la gestión de entidades por parte del administrador.
* **Refactorización Propuesta:**
    *   **Manejo de Errores Consistente:** Implementar una estrategia unificada para el manejo y reporte de errores en todas las rutas.
    *   **Validación Centralizada:** Centralizar la lógica de validación de entrada para asegurar la consistencia y reducir la duplicación de código.
    *   **Abstracción de Operaciones CRUD:** Crear funciones o un manejador base reutilizable para operaciones CRUD comunes (Crear, Leer, Actualizar, Eliminar) para mejorar la modularidad y reducir la redundancia.
    *   **Autenticación y Autorización Robustas:** Fortalecer las verificaciones de autenticación y autorización para todas las rutas de administrador, asegurando que solo los usuarios autorizados puedan acceder a funcionalidades sensibles.
