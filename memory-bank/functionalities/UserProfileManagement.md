# Funcionalidad: Gestión de Perfil de Usuario

## Descripción
Esta funcionalidad permite a los usuarios registrados ver y actualizar su propia información de perfil, incluyendo detalles personales y, potencialmente, su foto de perfil.

## Componentes Involucrados

### Frontend
*   **`src/app/perfil/page.jsx`**: La página principal del perfil del usuario.
*   **`src/components/perfil/`**: Directorio que contiene componentes relacionados con la visualización y edición del perfil.

### Backend (Acciones de Servidor/API)
*   **`src/app/acciones/UsuariosActions.js`**: Contendrá funciones para obtener y actualizar los detalles del perfil del usuario (ej. `ObtenerMiPerfil`, `ActualizarMiPerfil`).
*   **`src/models/Usuario.js`**: Modelo de la base de datos para los usuarios.

## Flujo de Trabajo

1.  El usuario inicia sesión y navega a su página de perfil (`/perfil`).
2.  La página carga los detalles actuales del perfil del usuario.
3.  El usuario puede ver su información y hacer clic en un botón "Editar" para modificarla.
4.  Se presenta un formulario con los datos precargados.
5.  El usuario realiza los cambios deseados y envía el formulario.
6.  Una Server Action actualiza los datos del perfil en la base de datos.
7.  Se muestra un mensaje de éxito o error.

## Consideraciones Adicionales
*   Validación de datos en el frontend y backend.
*   Manejo de la subida de fotos de perfil por parte del usuario (similar a la gestión de fotos de perfil por el administrador, pero con permisos de usuario).
*   Seguridad para asegurar que un usuario solo pueda modificar su propio perfil.
