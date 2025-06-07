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
    * **Lógica Principal:** Utiliza `loginAction` de `UsuariosActions.js` como Server Action. Maneja el estado del formulario, muestra pop-ups de éxito/error y redirige al usuario según su rol (`ADMINISTRADOR` a `/admin`, `PROVEEDOR` a `/proveedor`, `CLIENTE` a `/`).
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

