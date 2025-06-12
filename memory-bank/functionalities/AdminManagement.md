# Funcionalidad: Gestión de Administración

## Descripción
Esta funcionalidad abarca todas las capacidades de los administradores del sistema para gestionar usuarios, incluyendo la visualización, edición de detalles y actualización de fotos de perfil. El objetivo es centralizar el control administrativo sobre los datos de usuario y asegurar la coherencia visual.

## Sub-funcionalidades

### 1. Gestión de Detalles de Usuario
Permite a los administradores ver una lista de todos los usuarios registrados en el sistema y editar sus detalles completos (nombre, documento, correo, rol, etc.).

#### Componentes Involucrados

##### Frontend
*   **`src/app/admin/page.jsx`**: El dashboard principal de administración que renderiza dinámicamente los sub-dashboards.
*   **`src/components/layout/admin/dashboards/UsuariosDashboard.jsx`**: El componente que gestiona la foto de perfil y será modificado para incluir o integrar un nuevo componente de tabla de usuarios.
*   **`src/components/layout/admin/dashboards/UsuariosClientPage.jsx`**: Contiene la lógica y el JSX para renderizar la tabla de usuarios, incluyendo sus detalles y acciones (Editar, Deshabilitar/Habilitar).
*   **`src/components/layout/admin/usuarios/modals/ModalEditarUsuario.jsx`**: Modal para la edición de usuarios, ajustado para asegurar la visibilidad y scroll del contenido del formulario.
*   **`src/components/common/modales/Modal.jsx`**: Componente modal genérico que proporciona la estructura base y el manejo de altura máxima y desbordamiento.
*   **`src/components/layout/admin/usuarios/forms/FormEditarUsuario.jsx`**: Formulario de edición de usuario que se renderiza dentro de `ModalEditarUsuario`.
*   **`src/app/admin/users/editar/[id]/page.jsx`**: Nueva página de Next.js que contendrá el formulario para editar los detalles de un usuario específico.
*   **`src/components/layout/admin/users/EditUserForm.jsx`**: Componente de formulario reutilizable para la edición de usuarios.

##### Backend (Acciones de Servidor)
*   **`src/app/acciones/UsuariosActions.js`**: Contiene las funciones necesarias para:
    *   `ObtenerTodosLosUsuarios()`: Obtener la lista de usuarios.
    *   `ObtenerUsuarioPorId(id)`: Obtener los detalles de un usuario específico.
    *   `EditarUsuario(id, formData)`: Actualizar los detalles de un usuario.
    *   `updateUserAction(userId, prevState, formData)`: Server Action que envuelve `EditarUsuario`.
    *   `toggleUsuarioHabilitado(formData)`: Cambiar el estado de habilitado/deshabilitado de un usuario.

#### Flujo de Trabajo

1.  El administrador navega a la sección de "Usuarios" en el panel de administración.
2.  `UsuariosDashboard.jsx` renderiza `UsuariosClientPage.jsx`.
3.  `UsuariosClientPage.jsx` obtiene la lista de usuarios usando `ObtenerTodosLosUsuarios` y renderiza la tabla.
4.  La tabla muestra los usuarios con un botón "Editar" para cada uno.
5.  Al hacer clic en "Editar", el usuario es redirigido a `/admin/users/editar/[id]`.
6.  `src/app/admin/users/editar/[id]/page.jsx` carga el `EditUserForm.jsx`.
7.  `EditUserForm.jsx` obtiene los detalles del usuario usando `ObtenerUsuarioPorId` y precarga el formulario.
8.  El administrador modifica los detalles y envía el formulario.
9.  El formulario llama a `updateUserAction` para guardar los cambios.
10. Tras una actualización exitosa, el administrador es redirigido de vuelta a la lista de usuarios.

### 2. Gestión de Foto de Perfil de Usuario
Permite a los administradores cambiar la foto de perfil de cualquier usuario registrado.

#### Flujo de Usuario (Administrador)
1.  **Acceso al Panel de Administración:** El administrador navega a la sección de gestión de usuarios.
2.  **Selección/Búsqueda de Usuario:** El administrador selecciona el usuario cuya foto de perfil desea modificar.
3.  **Visualización de Foto Actual:** Se muestra su foto de perfil actual.
4.  **Subida de Nueva Imagen:** El administrador selecciona una nueva imagen desde su dispositivo.
5.  **Confirmación y Actualización:** El administrador confirma la subida. La aplicación procesa la imagen y la guarda, reemplazando la foto de perfil existente.
6.  **Feedback:** Se muestra un mensaje de éxito o error.

#### Proceso Técnico

##### 1. Modificaciones en el Modelo de Usuario (`src/models/Usuario.js`)
*   `imageData`: Tipo `Buffer`. Almacenará los datos binarios de la imagen.
*   `imageMimeType`: Tipo `String`. Almacenará el tipo MIME de la imagen.

##### 2. Nueva Server Action (`src/app/acciones/AdminActions.js`)
*   **Nombre Sugerido:** `actualizarFotoPerfilUsuarioPorAdmin`
*   **Parámetros de Entrada:** `userId`, `formData` (con el archivo de imagen).
*   **Lógica Interna:**
    1.  Verificación de Rol: Solo administradores pueden ejecutar esta acción.
    2.  Procesamiento de Imagen: Extraer, validar (tamaño, tipo MIME), y convertir a `Buffer`.
    3.  Actualización en Base de Datos: Actualizar `imageData` y `imageMimeType` del usuario.
    4.  Respuesta: Retornar estado de la operación.

##### 3. Componentes del Frontend (Panel de Administración)
*   **Ubicación Sugerida:** `src/app/admin/users/page.jsx` o `src/components/admin/UserProfilePictureManager.jsx`.
*   **Elementos de UI:** Componente para listar/buscar usuarios, mostrar foto actual, `<input type="file">`, botón de subida, indicadores de carga y feedback.
*   **Interacción:** Construir `FormData` e invocar `actualizarFotoPerfilUsuarioPorAdmin`.

## Consideraciones de Seguridad
*   **Autorización:** Ambas sub-funcionalidades DEBEN verificar que el usuario que realiza la solicitud tiene el rol de "administrador".
*   **Validación de Entrada:** Implementar validaciones robustas para todos los campos de entrada y archivos subidos.
*   **Manejo de Errores:** Asegurar que los mensajes de error no expongan información sensible.

## Pruebas Conceptuales
*   **Gestión de Detalles:**
    *   Edición exitosa de detalles de usuario.
    *   Intento de edición por no-administrador (debe fallar).
    *   Validación de datos (ej. correo inválido).
*   **Gestión de Foto de Perfil:**
    *   Subida exitosa de imagen válida.
    *   Intento de subida por no-administrador (debe fallar).
    *   Subida de archivo inválido (tipo, tamaño).
    *   Actualización de foto para usuario inexistente.
    *   Verificación de visualización correcta de la nueva foto.
