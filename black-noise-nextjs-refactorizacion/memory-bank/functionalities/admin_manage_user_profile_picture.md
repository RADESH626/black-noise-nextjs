# Funcionalidad: Gestión de Foto de Perfil de Usuario por Administrador

## Objetivo
Permitir a los administradores del sistema la capacidad de cambiar la foto de perfil de cualquier usuario registrado, centralizando la gestión de imágenes de perfil y asegurando la coherencia visual y el control administrativo.

## Flujo de Usuario (Administrador)
1.  **Acceso al Panel de Administración:** El administrador inicia sesión y navega a la sección de gestión de usuarios dentro del panel de administración.
2.  **Selección/Búsqueda de Usuario:** El administrador utiliza una interfaz de búsqueda o listado para encontrar y seleccionar el usuario cuya foto de perfil desea modificar.
3.  **Visualización de Foto Actual:** Una vez seleccionado el usuario, se muestra su foto de perfil actual (si existe).
4.  **Subida de Nueva Imagen:** El administrador interactúa con un campo de subida de archivos (`<input type="file">`) para seleccionar una nueva imagen desde su dispositivo.
5.  **Confirmación y Actualización:** El administrador confirma la subida. La aplicación procesa la imagen y la guarda, reemplazando la foto de perfil existente del usuario en la base de datos.
6.  **Feedback:** Se muestra un mensaje de éxito o error al administrador, indicando el resultado de la operación.

## Proceso Técnico

### 1. Modificaciones en el Modelo de Usuario (`src/models/Usuario.js`)
Para almacenar la foto de perfil directamente en la base de datos (MongoDB), se añadirán o modificarán los siguientes campos en el esquema del modelo `Usuario`:
*   `imageData`: Tipo `Buffer`. Almacenará los datos binarios de la imagen.
*   `imageMimeType`: Tipo `String`. Almacenará el tipo MIME de la imagen (ej. `image/jpeg`, `image/png`).

Estos campos seguirán el patrón ya establecido para el almacenamiento de imágenes de diseño, garantizando la consistencia en la gestión de datos binarios.

### 2. Nueva Server Action (`src/app/acciones/AdminActions.js`)
Se creará una nueva Server Action para manejar la lógica de actualización de la foto de perfil.
*   **Nombre Sugerido:** `actualizarFotoPerfilUsuarioPorAdmin`
*   **Parámetros de Entrada:**
    *   `userId`: ID del usuario cuya foto de perfil se va a actualizar.
    *   `formData`: Objeto `FormData` que contiene el archivo de imagen subido.
*   **Lógica Interna:**
    1.  **Verificación de Rol:** Se realizará una verificación estricta para asegurar que solo los usuarios con rol de "administrador" puedan ejecutar esta acción.
    2.  **Procesamiento de Imagen:**
        *   Extraer el archivo de imagen del `formData`.
        *   Validar el archivo:
            *   **Tamaño Máximo:** Limitar el tamaño del archivo (ej. 5MB).
            *   **Tipos MIME Permitidos:** Aceptar solo tipos de imagen específicos (ej. `image/jpeg`, `image/png`, `image/webp`). Se reutilizará la lógica de validación existente en `DesignActions.js` o se adaptará.
        *   Convertir el archivo de imagen a un `Buffer`.
        *   Obtener el `imageMimeType` del archivo.
    3.  **Actualización en Base de Datos:**
        *   Buscar el documento del usuario por `userId`.
        *   Actualizar los campos `imageData` y `imageMimeType` con los nuevos valores.
        *   Manejar posibles errores de base de datos.
    4.  **Respuesta:** Retornar un objeto con el estado de la operación (éxito/error) y un mensaje.

### 3. Componentes del Frontend (Panel de Administración)
Se desarrollará o modificará la interfaz de usuario en el panel de administración para permitir esta funcionalidad.
*   **Ubicación Sugerida:** Una nueva página o una sección dentro de una página existente de gestión de usuarios (ej. `src/app/admin/users/page.jsx` o `src/components/admin/UserProfilePictureManager.jsx`).
*   **Elementos de UI:**
    *   Un componente para listar y/o buscar usuarios.
    *   Un componente para mostrar los detalles del usuario seleccionado, incluyendo su foto de perfil actual.
    *   Un `<input type="file">` para la subida de la nueva imagen.
    *   Un botón para activar la subida y la llamada a la Server Action.
    *   Indicadores de carga y mensajes de feedback (éxito/error).
*   **Interacción:** Al enviar el formulario, se construirá un objeto `FormData` y se invocará la Server Action `actualizarFotoPerfilUsuarioPorAdmin` con el `userId` y el `FormData`.

## Identificación de Componentes Nuevos o Modificados
*   **Modelo:** `src/models/Usuario.js` (modificación)
*   **Server Action:** `src/app/acciones/AdminActions.js` (nuevo archivo o adición a existente)
*   **Frontend:**
    *   `src/app/admin/users/page.jsx` (modificación o nueva página)
    *   `src/components/admin/UserProfilePictureManager.jsx` (nuevo componente, si se decide modularizar)
    *   Posiblemente un componente de listado/búsqueda de usuarios si no existe uno adecuado.

## Consideraciones de Seguridad
*   **Autorización:** La Server Action `actualizarFotoPerfilUsuarioPorAdmin` DEBE verificar que el usuario que realiza la solicitud tiene el rol de "administrador". Cualquier intento de un usuario no autorizado debe ser rechazado.
*   **Validación de Entrada:** Implementar validaciones robustas para el tipo de archivo y el tamaño de la imagen para prevenir ataques de subida de archivos maliciosos o sobrecarga del servidor/base de datos.
*   **Manejo de Errores:** Asegurar que los mensajes de error no expongan información sensible del sistema o de la base de datos.

## Pruebas Conceptuales
*   **Subida Exitosa:**
    *   Un administrador sube una imagen JPG válida para un usuario existente.
    *   Verificar que la imagen se actualiza correctamente en la base de datos y se muestra en la interfaz.
*   **Intento por No-Administrador:**
    *   Un usuario sin rol de administrador intenta llamar a la Server Action.
    *   Verificar que la acción es rechazada y se retorna un error de autorización.
*   **Tipo de Archivo Inválido:**
    *   Un administrador intenta subir un archivo que no es una imagen (ej. `.pdf`, `.txt`).
    *   Verificar que la validación falla y se muestra un mensaje de error apropiado.
*   **Archivo Muy Grande:**
    *   Un administrador intenta subir una imagen que excede el tamaño máximo permitido.
    *   Verificar que la validación falla y se muestra un mensaje de error apropiado.
*   **Usuario Inexistente:**
    *   Un administrador intenta cambiar la foto de perfil de un `userId` que no existe.
    *   Verificar que la acción maneja este caso y retorna un error.
*   **Visualización Correcta:**
    *   Después de una subida exitosa, verificar que la nueva foto de perfil se renderiza correctamente en la interfaz de usuario del administrador y, si aplica, en la vista de perfil del usuario.
