# Funcionalidad: Inicio de Sesión de Usuario

## Descripción
Esta funcionalidad permite a los usuarios existentes iniciar sesión en la aplicación utilizando sus credenciales (correo electrónico y contraseña).

## Componentes Involucrados

### Frontend
*   **`src/app/login/page.jsx`**: La página de inicio de sesión.
*   **`src/components/login/`**: Directorio que contiene componentes relacionados con el formulario de inicio de sesión.

### Backend (Acciones de Servidor/API)
*   **`src/app/acciones/AuthActions.js` (asumido)**: Acciones de servidor para manejar la autenticación de usuarios.
*   **`src/utils/authUtils.js`**: Utilidades para la autenticación.

## Flujo de Trabajo

1.  El usuario navega a la página de inicio de sesión (`/login`).
2.  El usuario ingresa su correo electrónico y contraseña en el formulario.
3.  Al enviar el formulario, las credenciales se envían a una Server Action (ej. `loginUser`).
4.  La Server Action verifica las credenciales contra la base de datos.
5.  Si las credenciales son válidas, se establece una sesión de usuario y el usuario es redirigido a una página de inicio o a la página desde la que intentó acceder.
6.  Si las credenciales son inválidas, se muestra un mensaje de error al usuario.

## Consideraciones Adicionales
*   Manejo de errores de autenticación (credenciales incorrectas, usuario no encontrado).
*   Implementación de seguridad (hashing de contraseñas, tokens de sesión).
*   Opción para "Recordarme" (remember me).
*   Enlace a la funcionalidad de registro y recuperación de contraseña.
