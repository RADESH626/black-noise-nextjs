# ✅ Funcionalidad: Gestión de Usuarios (Admin)

**Descripción:** Permite a los administradores ver, agregar, editar, filtrar y gestionar el estado de habilitación de los usuarios del sistema, incluyendo la carga masiva de usuarios.

**Flujo de Interacción:** Los administradores acceden a esta funcionalidad desde el panel de administración (`/admin`) seleccionando la opción "Usuarios". Pueden ver una tabla de todos los usuarios, usar formularios para agregar o cargar masivamente, y realizar acciones individuales como editar o cambiar el estado de habilitación.

---

### Archivos Involucrados:

#### 📄 **Archivo:** `src/components/layout/admin/dashboards/UsuariosDashboard.jsx`
* **Rol:** Componente contenedor para la sección de gestión de usuarios en el panel de administración.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `UsuariosDashboard` (componente), `UsuariosClientPage`.
    * **Lógica Principal:** Simplemente renderiza `UsuariosClientPage`, delegando la lógica de visualización y gestión de usuarios a este componente.
    * **Modelos de Datos / Endpoints:** No interactúa directamente.

#### 📄 **Archivo:** `src/components/layout/admin/dashboards/UsuariosClientPage.jsx`
* **Rol:** Componente cliente que muestra la tabla de usuarios y maneja la obtención inicial de datos.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `UsuariosClientPage` (componente), `ObtenerTodosLosUsuarios` (de `UsuariosActions.js`), `Tabla`, `TablaHeader`, `Thgeneral`, `TdGeneral`.
    * **Lógica Principal:**
        *   Utiliza `useState` y `useEffect` para gestionar el estado de los usuarios, la carga y los errores.
        *   Llama a `ObtenerTodosLosUsuarios` para cargar la lista completa de usuarios.
        *   Renderiza los usuarios en una tabla con encabezados y celdas genéricas.
    * **Modelos de Datos / Endpoints:** Consume `UsuariosActions.js` para obtener datos de usuarios.

#### 📄 **Archivo:** `src/components/layout/admin/usuarios/forms/FormAgregarUsuarios.jsx`
* **Rol:** Formulario para que los administradores agreguen un nuevo usuario individualmente.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `FormAgregarUsuarios` (componente), `useActionState`, `useFormStatus`, `usePopUp`, `addSingleUserAction` (de `UsuariosActions.js`), varios `Input` componentes genéricos.
    * **Lógica Principal:**
        *   Utiliza `addSingleUserAction` como Server Action para procesar el formulario.
        *   Maneja el estado de envío (`pending`) y muestra feedback al usuario a través de `usePopUp`.
        *   Recopila datos como tipo/número de documento, nombres, apellidos, fecha de nacimiento, género, teléfono, dirección, correo, contraseña y rol.
    * **Modelos de Datos / Endpoints:** Interactúa con `UsuariosActions.js` para crear nuevos usuarios.

#### 📄 **Archivo:** `src/components/layout/admin/usuarios/forms/FormCargaMasivaUsuarios.jsx`
* **Rol:** Formulario para que los administradores realicen la carga masiva de usuarios mediante un archivo.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `FormCargaMasivaUsuarios` (componente), `RegistroMasivoUsuario` (de `UsuariosActions.js`), `InputFiles`, `BotonGeneral`.
    * **Lógica Principal:**
        *   Utiliza `RegistroMasivoUsuario` como Server Action para procesar el archivo subido.
        *   Proporciona un campo de entrada de archivo (`InputFiles`) y un botón de envío.
    * **Modelos de Datos / Endpoints:** Interactúa con `UsuariosActions.js` para la creación masiva de usuarios.

#### 📄 **Archivo:** `src/app/acciones/UsuariosActions.js`
* **Rol:** Contiene Server Actions para la gestión de usuarios por parte del administrador.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `addSingleUserAction`, `RegistroMasivoUsuario`, `FiltrarUsuarios`, `toggleUsuarioHabilitado`, `ObtenerTodosLosUsuarios`, `ObtenerUsuarioPorId`, `EditarUsuario`.
    * **Lógica Principal:**
        *   `addSingleUserAction`: Agrega un solo usuario (llamando a `RegistrarUsuario`).
        *   `RegistroMasivoUsuario`: Procesa un archivo CSV para agregar múltiples usuarios.
        *   `FiltrarUsuarios`: Permite buscar y filtrar usuarios por varios criterios (texto, rol, género, tipo de documento, edad, estado de habilitación).
        *   `toggleUsuarioHabilitado`: Cambia el estado `habilitado` de un usuario.
        *   `ObtenerTodosLosUsuarios`: Recupera todos los usuarios de la base de datos.
        *   `ObtenerUsuarioPorId` y `EditarUsuario`: Utilizadas para la edición de usuarios individuales (aunque el componente `FormEditarUsuario` no fue encontrado en la ruta esperada).
        *   Todas las acciones utilizan `revalidatePath` para mantener la UI actualizada.
    * **Modelos de Datos / Endpoints:** Modifica/consume el modelo `Usuario` de Mongoose.

#### 📄 **Archivo:** `src/components/layout/admin/usuarios/THUsuarios.jsx`
* **Rol:** Define los encabezados de la tabla para la visualización de usuarios en el panel de administración.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `THUsuarios` (componente), `Thgeneral`, `TablaHeader`.
    * **Lógica Principal:** Renderiza una fila de encabezados de tabla predefinidos para la información del usuario.
    * **Modelos de Datos / Endpoints:** No interactúa directamente.

