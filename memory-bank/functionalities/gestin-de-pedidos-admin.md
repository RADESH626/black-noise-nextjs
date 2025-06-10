# ✅ Funcionalidad: Gestión de Pedidos (Admin)

**Descripción:** Permite a los administradores ver y gestionar los pedidos realizados en la plataforma.

**Flujo de Interacción:** Los administradores acceden a esta funcionalidad desde el panel de administración (`/admin`) seleccionando la opción "Pedidos". Pueden ver una lista de pedidos (actualmente un placeholder).

---

### Archivos Involucrados:

#### 📄 **Archivo:** `src/components/layout/admin/dashboards/PedidosDashboard.jsx`
* **Rol:** Componente principal del dashboard de gestión de pedidos para administradores (actualmente un placeholder). Este componente no debe incluir el `AdminLayout` ni `AdminPage` directamente, ya que se espera que sea renderizado como un hijo de un componente de diseño de página que ya proporciona el `AdminLayout`. Las secciones de acciones (`SeccionAcciones` y `SeccionFooter`) se han eliminado para evitar cuadros grises no deseados y para alinear el diseño con otras páginas de administración.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `PedidosDashboard` (componente).
    * **Lógica Principal:** Es un marcador de posición que indica que el contenido real se agregará más tarde.
    * **Modelos de Datos / Endpoints:** No interactúa directamente.

#### 📄 **Archivo:** `src/app/acciones/PedidoActions.js`
* **Rol:** Contiene Server Actions para la gestión de pedidos por parte del administrador.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `obtenerPedidos`, `ObtenerPedidoPorId`, `EditarPedido`.
    * **Lógica Principal:**
        *   `obtenerPedidos`: Recupera todos los pedidos de la base de datos.
        *   `ObtenerPedidoPorId`: Busca un pedido específico por su ID.
        *   `EditarPedido`: Actualiza los datos de un pedido existente (ej. estado).
        *   Todas las acciones interactúan directamente con el modelo `Pedido` de Mongoose y utilizan `revalidatePath`.
    * **Modelos de Datos / Endpoints:** Modifica/consume el modelo `Pedido` de Mongoose.
