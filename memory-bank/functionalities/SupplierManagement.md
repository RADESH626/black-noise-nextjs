# Funcionalidad: Gestión de Proveedores

## Descripción
Esta funcionalidad permite a los administradores gestionar la información de los proveedores del sistema, incluyendo la adición, edición y eliminación de registros de proveedores.

## Componentes Involucrados

### Frontend
*   **`src/app/proveedor/page.jsx`**: La página principal para la gestión de proveedores.
*   **`src/components/admin/suppliers/SupplierForm.jsx` (asumido)**: Formulario para añadir o editar proveedores.
*   **`src/components/admin/suppliers/SupplierList.jsx` (asumido)**: Componente para listar los proveedores.

### Backend (Acciones de Servidor/API)
*   **`src/app/acciones/ProveedorActions.js`**: Contiene las funciones para interactuar con los datos de proveedores (ej. `CrearProveedor`, `ObtenerProveedores`, `EditarProveedor`, `EliminarProveedor`).
*   **`src/models/Proveedor.js`**: Modelo de la base de datos para los proveedores.

## Flujo de Trabajo

1.  El administrador navega a la sección de gestión de proveedores (`/proveedor`).
2.  La página muestra una lista de proveedores existentes.
3.  El administrador puede:
    *   Hacer clic en un botón "Agregar" para abrir un formulario de nuevo proveedor.
    *   Hacer clic en un botón "Editar" junto a un proveedor existente para precargar el formulario con sus datos.
    *   Hacer clic en un botón "Eliminar" para remover un proveedor.
4.  Al enviar el formulario (agregar/editar), una Server Action correspondiente en `ProveedorActions.js` actualiza la base de datos.
5.  Se muestra un mensaje de éxito o error.

## Consideraciones Adicionales
*   Validación de datos para la información del proveedor.
*   Manejo de errores durante las operaciones CRUD.
*   Autorización para asegurar que solo los administradores puedan gestionar proveedores.
