# ✅ Funcionalidad: Panel de Administración

**Descripción:** Proporciona una interfaz centralizada para que los administradores gestionen diversas entidades y operaciones del sistema, incluyendo usuarios, diseños, proveedores, solicitudes de proveedor, pedidos, ventas y pagos.

**Flujo de Interacción:** Los administradores acceden al panel a través de `/admin` después de iniciar sesión. Una barra lateral (`AdminSidebar`) les permite navegar entre los diferentes dashboards de gestión.

---

### Archivos Involucrados:

#### 📄 **Archivo:** `src/app/admin/page.jsx`
* **Rol:** Página principal del panel de administración.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `AdminPage` (componente principal), `AdminSidebar`, `MockDataDemo`, `UsuariosDashboard`, `DesignsDashboard`, `ProveedoresDashboard`, `SolicitudesProveedorDashboard`, `PedidosDashboard`, `VentasDashboard`, `PagosDashboard`.
    * **Lógica Principal:**
        *   Maneja el estado del dashboard activo (`activeDashboard`) basado en la selección del usuario en la barra lateral.
        *   Utiliza un objeto `dashboardComponents` para mapear IDs de dashboard a los componentes correspondientes, permitiendo un renderizado dinámico.
        *   Renderiza `AdminSidebar` para la navegación y el `CurrentDashboard` seleccionado.
    * **Modelos de Datos / Endpoints:** No interactúa directamente con la base de datos, actúa como un orquestador de la UI del panel.

