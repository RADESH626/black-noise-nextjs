# ✅ Funcionalidad: Gestión de Proveedores (Admin)

**Descripción:** Permite a los administradores ver, filtrar, agregar, editar y eliminar proveedores directamente en la plataforma. Esta es la única vía para incorporar nuevos proveedores al sistema, reemplazando cualquier proceso de solicitud previo por parte de usuarios generales. Se ha eliminado el campo 'rut' del proveedor, ya que el 'nit' es suficiente para acceder a la información del RUT. Además, los proveedores ya no están vinculados a un usuario de la plataforma, eliminando la necesidad del campo `usuarioId`. Se han añadido campos para almacenar el nombre del dueño de la empresa proveedora, así como el correo electrónico y el número de teléfono de contacto de la empresa. La dirección de la empresa (`direccionEmpresa`) se utilizará tanto como dirección principal de la empresa como dirección de contacto. El campo `nombreProveedor` ha sido renombrado a `nombreEmpresa` para mayor claridad en el registro. Se ha incorporado un nuevo campo `metodosDePago` que permite seleccionar múltiples métodos de pago aceptados por el proveedor a través de checkboxes. **Adicionalmente, los administradores ahora pueden generar y gestionar una clave de acceso única para cada proveedor, la cual será utilizada por el proveedor para iniciar sesión en su portal dedicado.**

**Flujo de Interacción:** Los administradores acceden a esta funcionalidad desde el panel de administración (`/admin`) seleccionando la opción "Proveedores". Pueden ver una lista de proveedores existentes, utilizar un filtro por métodos de pago aceptados, y usar el botón "Agregar Proveedor" que abre un modal para incorporar nuevos proveedores.

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
        *   El botón "Agregar Proveedor" ahora abre un modal que contiene el `FormularioAgregarProveedor`.
        *   Después de agregar un proveedor exitosamente en el modal, la lista de proveedores se actualiza automáticamente.
    * **Modelos de Datos / Endpoints:** Consume `ProveedorActions.js` para obtener datos de proveedores.

#### 📄 **Archivo:** `src/components/common/botones/BotonAgregarProveedores.jsx` (Modificado)
* **Rol:** Componente de botón reutilizable para agregar proveedores. Ahora acepta y aplica `children` y otras props (como `onClick` y `className`) para mayor flexibilidad en su uso y estilizado.
* **Implementación Clave:**
    * **Lógica Principal:** Renderiza un botón HTML estándar, pasando todas las props recibidas directamente al elemento `<button>`. El texto por defecto es "Agregar Proveedor", pero puede ser sobrescrito por la prop `children`.

#### 📄 **Archivo:** `src/components/layout/admin/dashboards/proveedores/FormFiltrarProveedores.jsx`
* **Rol:** Componente de formulario (placeholder) para filtrar proveedores en el panel de administración.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `FormFiltrarProveedores` (componente), `useState`.
    * **Lógica Principal:** Actualmente es un marcador de posición que solo muestra los proveedores iniciales pasados como prop. No implementa lógica de filtrado real.
    * **Modelos de Datos / Endpoints:** No interactúa directamente.

#### 📄 **Archivo:** `src/components/layout/admin/dashboards/proveedores/ListaProveedores.jsx` (Modificado)
* **Rol:** Componente encargado de mostrar la información de los proveedores en un formato de lista o tabla, similar a la lista de usuarios, ahora con funcionalidad de filtrado.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `ListaProveedores` (componente), `useState`, `useEffect`, `useCallback`.
    * **Lógica Principal:**
        *   Gestiona dos estados para los proveedores: `allProviders` (todos los proveedores obtenidos) y `filteredProviders` (proveedores después de aplicar el filtro).
        *   Introduce un estado `selectedPaymentMethod` para controlar el método de pago seleccionado para el filtro.
        *   La función `fetchAndSetProviders` obtiene todos los proveedores habilitados.
        *   Un `useEffect` se encarga de filtrar `allProviders` cada vez que `selectedPaymentMethod` o `allProviders` cambian, actualizando `filteredProviders`.
        *   Renderiza un `select` HTML para permitir al usuario elegir un método de pago para filtrar.
        *   Renderiza cada proveedor en una fila de una tabla, mostrando detalles como nombre de la empresa, dueño, email, teléfono, dirección y métodos de pago.
        *   Incluye botones para editar y eliminar cada proveedor.
    * **Modelos de Datos / Endpoints:** Consume los datos de proveedores obtenidos a través de `obtenerProveedoresHabilitados` de `ProveedorActions.js`.

#### 📄 **Archivo:** `src/models/Proveedor.js` (Modificado)
* **Rol:** Define el esquema del modelo de datos para los proveedores.
* **Implementación Clave:**
    * **Cambios:** Se ha añadido el campo `metodosDePago` como un array de strings para almacenar los métodos de pago aceptados por el proveedor. **Se añadirá un campo `accessKey` (hashed) para la autenticación de proveedores.**

#### 📄 **Archivo:** `src/components/layout/admin/dashboards/proveedores/FormularioAgregarProveedor.jsx` (Modificado)
* **Rol:** Componente de formulario para agregar y editar proveedores.
* **Implementación Clave:**
    * **Cambios:** Se ha añadido un nuevo campo de selección múltiple para `metodosDePago` utilizando checkboxes. Los valores seleccionados se gestionan en el estado del formulario y se envían como parte de los datos del proveedor. **Se incluirá un campo para generar o mostrar la clave de acceso del proveedor, permitiendo al administrador gestionarla.**

#### 📄 **Archivo:** `src/app/acciones/ProveedorActions.js` (Modificado)
* **Rol:** Contiene Server Actions para la gestión de proveedores por parte del administrador.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `obtenerProveedoresHabilitados`, `obtenerProveedores`, `crearProveedor`, `actualizarProveedor`, `eliminarProveedor`, `obtenerProveedorPorId`, `generarYGuardarAccessKey` (nuevo).
    * **Lógica Principal:**
        *   `obtenerProveedoresHabilitados`: Recupera solo los proveedores que están habilitados.
        *   `obtenerProveedores`: Recupera todos los proveedores.
        *   `crearProveedor`: Crea un nuevo proveedor. **Esta acción debe incluir una verificación de rol de administrador (`getServerSession`) para asegurar que solo los administradores puedan ejecutarla.** Ahora también maneja el nuevo campo `metodosDePago` y **generará y guardará una `accessKey` inicial para el proveedor.**
        *   `actualizarProveedor`: Actualiza los datos de un proveedor existente. **Permitirá actualizar la `accessKey` si es necesario.**
        *   `eliminarProveedor`: Elimina un proveedor.
        *   `obtenerProveedorPorId`: Busca un proveedor por su ID.
        *   `generarYGuardarAccessKey`: (Nuevo) Función para generar y hashear una nueva clave de acceso para un proveedor específico.
        *   Todas las acciones interactúan directamente con el modelo `Proveedor` de Mongoose y utilizan `revalidatePath`.
    * **Modelos de Datos / Endpoints:** Modifica/consume el modelo `Proveedor` de Mongoose.
