# Plan de Refactorización de la Funcionalidad de Autenticación de Usuarios

Este plan detalla las sub-tareas necesarias para refactorizar la funcionalidad de autenticación de usuarios, asegurando que cumpla con los patrones de diseño y las mejores prácticas establecidas en `systemPatterns.md`.

## Sub-tareas:

1.  **Revisión de `src/app/acciones/UsuariosActions.js`:**
    *   **Objetivo:** Asegurar que `loginAction` y `registerAction` cumplan estrictamente con el patrón de Server Actions definido, incluyendo validación robusta, manejo de errores estandarizado y revalidación de rutas (`revalidatePath`) cuando sea necesario.
    *   **Cambios Esperados:**
        *   Verificar la estructura de retorno de las acciones (`{ message, success, data }`).
        *   Confirmar el uso de `try-catch` para la lógica de negocio y el manejo de excepciones.
        *   Asegurar que `revalidatePath` se use apropiadamente después de operaciones de registro o actualización de perfil que afecten la visualización de datos de usuario.

2.  **Refactorización de Componentes UI (`src/components/layout/general/forms/FormLogin.jsx`, `src/components/layout/general/forms/FormRegistro.jsx`):**
    *   **Objetivo:** Implementar `useActionState` y `useFormStatus` de React 19 (importados de `react` y `react-dom` respectivamente) para una gestión de estado de formulario más eficiente y declarativa. Integrar `usePopUp` para feedback consistente.
    *   **Cambios Esperados:**
        *   Actualizar importaciones de `useActionState` a `import { useActionState } from 'react';`.
        *   Asegurar que `useFormStatus` se use en un componente `SubmitButton` separado para manejar el estado `pending`.
        *   Implementar `useEffect` para escuchar cambios en el estado de la acción y mostrar pop-ups de éxito/error.
        *   Verificar que los nombres de los campos del formulario (`name` attribute) sigan las convenciones de `Form Field Naming Conventions`.
        *   En `FormLogin.jsx`, revisar la llamada a `signIn` de NextAuth.js y la lógica de redirección post-autenticación para asegurar que sea robusta y basada en roles.

3.  **Revisión de `src/middleware.js`:**
    *   **Objetivo:** Confirmar que el middleware maneja correctamente la protección de rutas y la redirección basada en roles, utilizando la sesión de NextAuth.js de manera eficiente.
    *   **Cambios Esperados:**
        *   Verificar la lógica de redirección para rutas protegidas (`/admin`, `/proveedor`).
        *   Asegurar que la obtención de la sesión sea eficiente y no cause cuellos de botella.

4.  **Revisión de `src/app/api/auth/[...nextauth]/route.js`:**
    *   **Objetivo:** Validar la configuración de NextAuth.js, prestando especial atención al `CredentialsProvider` y los callbacks, para asegurar una autenticación segura y eficiente.
    *   **Cambios Esperados:**
        *   Confirmar que la lógica de autorización en el `authorize` callback es correcta y segura.
        *   Revisar los callbacks de `session` y `jwt` para asegurar que la información del usuario (especialmente el rol) se propague correctamente a la sesión.

5.  **Revisión de `src/app/admin/layout.jsx`:**
    *   **Objetivo:** Asegurar que el botón de "Cerrar Sesión" funcione correctamente y que la integración con `signOut` de NextAuth.js sea adecuada.
    *   **Cambios Esperados:**
        *   Verificar que la llamada a `signOut` se realice correctamente.
        *   Asegurar que la redirección post-logout sea la esperada.
