# ✅ Funcionalidad: Autenticación de Usuarios

**Descripción:** Permite a los usuarios registrarse en la plataforma y iniciar sesión, con redirección basada en el rol del usuario (Administrador, Proveedor, Cliente).

---

### Archivos Involucrados:

#### 📄 **Archivo:** `src/app/login/page.jsx`
* **Rol:** Página de inicio de sesión. Sirve como el punto de entrada visual para que los usuarios inicien sesión.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `Login` (componente principal), `FormLogin` (componente de formulario).
    * **Lógica Principal:** Renderiza el `FormLogin` y elementos de UI relacionados con el inicio de sesión. Utiliza `framer-motion` para animaciones.
    * **Modelos de Datos / Endpoints:** No interactúa directamente con modelos o endpoints, delega la lógica al `FormLogin`.

#### 📄 **Archivo:** `src/app/registro/page.jsx`
* **Rol:** Página de registro de usuarios. Permite a los nuevos usuarios crear una cuenta en la plataforma.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `Registro` (componente principal), `FormRegistro` (componente de formulario).
    * **Lógica Principal:** Renderiza el `FormRegistro` y elementos de UI relacionados con el registro. Utiliza `framer-motion` para animaciones.
    * **Modelos de Datos / Endpoints:** No interactúa directamente con modelos o endpoints, delega la lógica al `FormRegistro`.

#### 📄 **Archivo:** `src/components/layout/general/forms/FormLogin.jsx`
* **Rol:** Componente de formulario para el inicio de sesión. Maneja la interacción del usuario y la llamada a la acción de servidor de login.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `FormLogin` (componente), `useActionState`, `useFormStatus`, `usePopUp`, `signIn` (de `next-auth/react`).
    * **Lógica Principal:** Utiliza `loginAction` de `UsuariosActions.js` como Server Action. Maneja el estado del formulario, muestra pop-ups de éxito/error y redirige al usuario según su rol (`ADMINISTRADOR` a `/admin`, `PROVEEDOR` a `/proveedor`, `CLIENTE` a `/catalogo`).
    * **Modelos de Datos / Endpoints:** Interactúa con `UsuariosActions.js` para la autenticación.

#### 📄 **Archivo:** `src/components/layout/general/forms/FormRegistro.jsx`
* **Rol:** Componente de formulario para el registro de nuevos usuarios.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `FormRegistro` (componente), `useActionState`, `useFormStatus`, `usePopUp`.
    * **Lógica Principal:** Utiliza `registerAction` de `UsuariosActions.js` como Server Action. Maneja el estado del formulario y muestra pop-ups de éxito/error.
    * **Modelos de Datos / Endpoints:** Interactúa con `UsuariosActions.js` para el registro.

#### 📄 **Archivo:** `src/app/acciones/UsuariosActions.js`
* **Rol:** Contiene todas las Server Actions y funciones de lógica de negocio relacionadas con la gestión de usuarios, incluyendo autenticación y registro.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:**
        *   `loginAction`: Server Action para el inicio de sesión.
        *   `registerAction`: Server Action para el registro.
        *   `RegistrarUsuario`: Función interna que maneja la lógica de registro, incluyendo hashing de contraseña (`bcryptjs`) y guardado en DB.
        *   `ObtenerUsuarioPorCorreo`: Función para buscar un usuario por correo electrónico.
        *   `guardarUsuarios`: Función genérica para guardar un usuario en la DB, incluyendo la asignación de foto de perfil por defecto y envío de correo de bienvenida (`nodemailer`).
    * **Lógica Principal:**
        *   `loginAction`: Valida credenciales, verifica contraseña con `bcrypt.compare`, obtiene el rol del usuario y lo retorna para la redirección en el cliente.
        *   `registerAction`: Valida la confirmación de contraseña y llama a `RegistrarUsuario`.
        *   `RegistrarUsuario`: Hashea la contraseña, asigna rol `CLIENTE` por defecto, genera `nombreUsuario` y llama a `guardarUsuarios`.
        *   Manejo de errores robusto y revalidación de caché (`revalidatePath`) para operaciones de escritura.
    * **Modelos de Datos / Endpoints:** Modifica/consume el modelo `Usuario` de Mongoose. Envía correos electrónicos usando `nodemailer`.

#### 📄 **Archivo:** `src/middleware.js`
* **Rol:** Middleware de Next.js para la protección de rutas y la redirección basada en roles.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `productionMiddleware` (función principal del middleware).
    * **Lógica Principal:** Intercepta las solicitudes, verifica la sesión del usuario y su rol, y redirige a rutas específicas si no tienen los permisos adecuados. Protege rutas como `/admin` y `/proveedor`.
    * **Modelos de Datos / Endpoints:** Utiliza la sesión de NextAuth.js.

#### 📄 **Archivo:** `src/app/SessionProviderWrapper.jsx`
* **Rol:** Envuelve la aplicación con el `SessionProvider` de NextAuth.js, haciendo que la sesión esté disponible para los componentes cliente.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `SessionProvider` de `next-auth/react`.
    * **Lógica Principal:** Proporciona el contexto de sesión a toda la aplicación.

#### 📄 **Archivo:** `src/app/api/auth/[...nextauth]/route.js`
* **Rol:** Configuración de NextAuth.js para la autenticación.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `NextAuth`, `CredentialsProvider`, `MongoDBAdapter`.
    * **Lógica Principal:** Define los proveedores de autenticación (en este caso, credenciales), cómo se maneja la sesión y los callbacks para la autorización. Se conecta a la base de datos para validar usuarios.
    * **Modelos de Datos / Endpoints:** Interactúa con el modelo `Usuario` para la autenticación.

---

### Plan de Refactorización:

El objetivo de esta refactorización es asegurar que la funcionalidad de autenticación de usuarios cumpla con los patrones de diseño y las mejores prácticas establecidas en `systemPatterns.md`, especialmente en lo que respecta a Server Actions, manejo de estado de formularios, y gestión de sesiones.

#### 1. **Revisión de `src/app/acciones/UsuariosActions.js`:**
*   **Objetivo:** Asegurar que `loginAction` y `registerAction` cumplan estrictamente con el patrón de Server Actions definido, incluyendo validación robusta, manejo de errores estandarizado y revalidación de rutas (`revalidatePath`) cuando sea necesario.
*   **Cambios Esperados:**
    *   Verificar la estructura de retorno de las acciones (`{ message, success, data }`).
    *   Confirmar el uso de `try-catch` para la lógica de negocio y el manejo de excepciones.
    *   Asegurar que `revalidatePath` se use apropiadamente después de operaciones de registro o actualización de perfil que afecten la visualización de datos de usuario.

#### 2. **Refactorización de Componentes UI (`src/components/layout/general/forms/FormLogin.jsx`, `src/components/layout/general/forms/FormRegistro.jsx`):**
*   **Objetivo:** Implementar `useActionState` y `useFormStatus` de React 19 (importados de `react` y `react-dom` respectivamente) para una gestión de estado de formulario más eficiente y declarativa. Integrar `usePopUp` para feedback consistente.
*   **Cambios Esperados:**
    *   Actualizar importaciones de `useActionState` a `import { useActionState } from 'react';`.
    *   Asegurar que `useFormStatus` se use en un componente `SubmitButton` separado para manejar el estado `pending`.
    *   Implementar `useEffect` para escuchar cambios en el estado de la acción y mostrar pop-ups de éxito/error.
    *   Verificar que los nombres de los campos del formulario (`name` attribute) sigan las convenciones de `Form Field Naming Conventions`.
    *   En `FormLogin.jsx`, revisar la llamada a `signIn` de NextAuth.js y la lógica de redirección post-autenticación para asegurar que sea robusta y basada en roles.

#### 3. **Revisión de `src/middleware.js`:**
*   **Objetivo:** Confirmar que el middleware maneja correctamente la protección de rutas y la redirección basada en roles, utilizando la sesión de NextAuth.js de manera eficiente.
*   **Cambios Esperados:**
    *   Verificar la lógica de redirección para rutas protegidas (`/admin`, `/proveedor`).
    *   Asegurar que la obtención de la sesión sea eficiente y no cause cuellos de botella.

#### 4. **Revisión de `src/app/api/auth/[...nextauth]/route.js`:**
*   **Objetivo:** Validar la configuración de NextAuth.js, prestando especial atención al `CredentialsProvider` y los callbacks, para asegurar una autenticación segura y eficiente.
*   **Cambios Esperados:**
    *   Confirmar que la lógica de autorización en el `authorize` callback es correcta y segura.
    *   Revisar los callbacks de `session` y `jwt` para asegurar que la información del usuario (especialmente el rol) se propague correctamente a la sesión.

#### 5. **Revisión de `src/app/admin/layout.jsx`:**
*   **Objetivo:** Asegurar que el botón de "Cerrar Sesión" funcione correctamente y que la integración con `signOut` de NextAuth.js sea adecuada.
*   **Cambios Esperados:**
    *   Verificar que la llamada a `signOut` se realice correctamente.
    *   Asegurar que la redirección post-logout sea la esperada.

#### 📄 **Archivo:** `src/app/admin/layout.jsx`
* **Rol:** Contiene la barra de navegación del panel de administración, que ahora incluye un botón de "Cerrar Sesión".
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `signOut` (de `next-auth/react`).
    * **Lógica Principal:** El botón "Cerrar Sesión" en la barra de navegación del administrador invoca la función `signOut` de NextAuth.js para terminar la sesión del usuario.
    * **Modelos de Datos / Endpoints:** Interactúa con la funcionalidad de autenticación de NextAuth.js.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `NextAuth`, `CredentialsProvider`, `MongoDBAdapter`.
    * **Lógica Principal:** Define los proveedores de autenticación (en este caso, credenciales), cómo se maneja la sesión y los callbacks para la autorización. Se conecta a la base de datos para validar usuarios.
    * **Modelos de Datos / Endpoints:** Interactúa con el modelo `Usuario` para la autenticación.
