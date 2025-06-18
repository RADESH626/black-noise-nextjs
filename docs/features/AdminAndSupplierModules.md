Feature: Módulos de Admin y Proveedor
Resumen
El patrón de actualización optimista se extendió a los paneles de administración y de proveedor para mejorar la experiencia de gestión.

Funcionalidades Implementadas
Admin - Gestión de Usuarios:

Actualización de la foto de perfil de un usuario. La nueva imagen se muestra al instante.

Implementa rollback si la subida falla.

Archivo: src/app/admin/users/page.jsx

Admin - Edición de Diseños:

Los cambios en nombre, precio, descripción, etc., se reflejan inmediatamente en el formulario.

Rollback en caso de fallo en la actualización.

Archivo: src/app/admin/designs/editar/[id]/page.jsx

Proveedor - Edición de Perfil:

Los cambios en el perfil del proveedor se aplican en la UI al instante.

Rollback en caso de error.

Archivo: src/components/layout/proveedor/forms/FormEditarPerfilProveedor.jsx

Admin - Agregar Proveedor:

Permite a los administradores añadir nuevos proveedores a través de un formulario modal. Durante este proceso, se crea automáticamente un usuario asociado (`Usuario`) con rol de `PROVEEDOR` y se vincula al nuevo proveedor. La clave de acceso inicial para el proveedor se genera y se envía directamente a su correo electrónico, sin ser mostrada al administrador.

Componente: src/components/admin/proveedores/AddSupplierModal.jsx
Server Action: src/app/acciones/ProveedorActions.js (crearProveedor)
