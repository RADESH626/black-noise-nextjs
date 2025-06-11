# Gestión de Detalles de Usuario en el Panel de Administración

## Descripción
Esta funcionalidad permite a los administradores ver una lista de todos los usuarios registrados en el sistema y editar sus detalles completos (nombre, documento, correo, rol, etc.). Actualmente, la página de administración de usuarios (`src/app/admin/users/page.jsx`) solo permite la gestión de la foto de perfil. Esta nueva implementación añadirá una tabla de usuarios con un botón "Editar" para cada entrada, que redirigirá a una página de edición de detalles de usuario.

## Componentes Involucrados

### Frontend
*   **`src/app/admin/page.jsx`**: El dashboard principal de administración que renderiza dinámicamente los sub-dashboards.
*   **`src/components/layout/admin/dashboards/UsuariosDashboard.jsx`**: El componente que actualmente gestiona la foto de perfil. Será modificado para incluir o integrar un nuevo componente de tabla de usuarios.
*   **`src/components/layout/admin/dashboards/UsuariosClientPage.jsx`**: Este componente ahora contiene directamente la lógica y el JSX para renderizar la tabla de usuarios, incluyendo sus detalles y acciones (Editar, Deshabilitar/Habilitar).
*   **`src/components/layout/admin/usuarios/modals/ModalEditarUsuario.jsx`**: Este modal se utiliza para la edición de usuarios. Se ha ajustado su comportamiento de altura y desbordamiento para asegurar que todo el contenido del formulario (`FormEditarUsuario`) sea visible y se pueda desplazar verticalmente si excede el espacio disponible. La gestión principal del scroll y la altura máxima ahora recae en el componente genérico `Modal` (`src/components/common/modales/Modal.jsx`), eliminando restricciones redundantes en este componente.
*   **`src/components/common/modales/Modal.jsx`**: El componente modal genérico que proporciona la estructura base y el manejo de altura máxima (`max-h-[calc(100vh-10rem)]`) y desbordamiento (`overflow-y-auto`) para su contenido.
*   **`src/components/layout/admin/usuarios/forms/FormEditarUsuario.jsx`**: El formulario de edición de usuario que se renderiza dentro de `ModalEditarUsuario`. Su contenido ahora se adapta correctamente al espacio disponible y permite el scroll a través del modal padre.
*   **`src/app/admin/users/editar/[id]/page.jsx` (NUEVO)**: Una nueva página de Next.js que contendrá el formulario para editar los detalles de un usuario específico.
*   **`src/components/layout/admin/users/EditUserForm.jsx` (NUEVO)**: Un componente de formulario reutilizable para la edición de usuarios.

### Backend (Acciones de Servidor)
*   **`src/app/acciones/UsuariosActions.js`**: Este archivo ya contiene las funciones necesarias para:
    *   `ObtenerTodosLosUsuarios()`: Para obtener la lista de usuarios.
    *   `ObtenerUsuarioPorId(id)`: Para obtener los detalles de un usuario específico.
    *   `EditarUsuario(id, formData)`: Para actualizar los detalles de un usuario.
    *   `updateUserAction(userId, prevState, formData)`: Server Action que envuelve `EditarUsuario`.
    *   `toggleUsuarioHabilitado(formData)`: Para cambiar el estado de habilitado/deshabilitado de un usuario.

## Flujo de Trabajo

1.  El administrador navega a la sección de "Usuarios" en el panel de administración.
2.  `UsuariosDashboard.jsx` renderiza `UsuariosClientPage.jsx`.
3.  `UsuariosClientPage.jsx` obtiene la lista de usuarios usando `ObtenerTodosLosUsuarios` de `UsuariosActions.js` y renderiza la tabla directamente.
4.  La tabla muestra los usuarios con un botón "Editar" para cada uno.
5.  Al hacer clic en "Editar", el usuario es redirigido a `/admin/users/editar/[id]`, donde `[id]` es el ID del usuario.
6.  `src/app/admin/users/editar/[id]/page.jsx` carga el `EditUserForm.jsx`.
7.  `EditUserForm.jsx` obtiene los detalles del usuario usando `ObtenerUsuarioPorId` y precarga el formulario.
8.  El administrador modifica los detalles y envía el formulario.
9.  El formulario llama a `updateUserAction` (que a su vez usa `EditarUsuario`) para guardar los cambios en la base de datos.
10. Tras una actualización exitosa, el administrador es redirigido de vuelta a la lista de usuarios.

## Consideraciones Adicionales

*   Se debe asegurar la validación de datos tanto en el frontend como en el backend para la edición de usuarios.
*   Se debe manejar el estado de carga y los errores durante la obtención y actualización de datos.
*   Se considerará la paginación y filtrado en la tabla de usuarios dentro de `UsuariosClientPage.jsx` para mejorar la experiencia de usuario si la lista de usuarios es extensa.
