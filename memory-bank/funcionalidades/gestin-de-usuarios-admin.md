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
* **Rol:** Componente cliente que muestra la tabla de usuarios y maneja la obtención inicial de datos, búsqueda y acciones de usuario (habilitar/deshabilitar, editar).
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `UsuariosClientPage` (componente), `ObtenerTodosLosUsuarios` (de `UsuariosActions.js`), `FiltrarUsuarios` (de `UsuariosActions.js`), `toggleUsuarioHabilitado` (de `UsuariosActions.js`), `Tabla`, `TablaHeader`, `Thgeneral`, `TdGeneral`, `FormBuscarUsuario`, `ModalAgregarUsuario`, `ModalEditarUsuario` (propuesto).
    * **Lógica Principal:**
        *   Utiliza `useState` y `useEffect` para gestionar el estado de los usuarios, la carga y los errores.
        *   Llama a `ObtenerTodosLosUsuarios` para cargar la lista completa de usuarios.
        *   Integra `FormBuscarUsuario` para permitir la filtración de usuarios.
        *   Maneja la lógica para habilitar/deshabilitar usuarios.
        *   Renderiza los usuarios en una tabla con encabezados y celdas genéricas.
        *   Gestiona la apertura y cierre de modales para agregar y editar usuarios.
    * **Modelos de Datos / Endpoints:** Consume `UsuariosActions.js` para obtener, filtrar, y modificar datos de usuarios.

#### 📄 **Archivo:** `src/components/layout/admin/usuarios/forms/FormBuscarUsuario.jsx`
* **Rol:** Formulario para que los administradores busquen usuarios por texto (nombre, correo, documento, etc.).
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `FormBuscarUsuario` (componente), `useActionState` (de `react`), `useFormStatus` (de `react-dom`), `usePopUp`, `FiltrarUsuarios` (de `UsuariosActions.js`), `InputTextoGeneral`, `InputRol`, `InputGenero`, `InputTipoDocumentoIdentidad`, `InputNumerosGeneral`, `BotonGeneral`.
    * **Lógica Principal:**
        *   Utiliza `FiltrarUsuarios` como Server Action para procesar la búsqueda.
        *   Aplica el patrón de `useActionState` y `useFormStatus` para manejar el estado del formulario y la retroalimentación al usuario a través de `usePopUp`.
        *   Pasa los resultados de la búsqueda a un callback `onSearchSuccess` para que el componente padre (`UsuariosClientPage`) actualice la tabla.
    * **Modelos de Datos / Endpoints:** Interactúa con `UsuariosActions.js` para filtrar usuarios.
    * **Notas de Refactorización:** Se asegurará la alineación con el patrón de `useActionState` de React 19 y las convenciones de nombres de campos.

#### 📄 **Archivo:** `src/components/layout/admin/usuarios/forms/FormAgregarUsuarios.jsx`
* **Rol:** Formulario para que los administradores agreguen un nuevo usuario individualmente.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `FormAgregarUsuarios` (componente), `useActionState` (de `react`), `useFormStatus` (de `react-dom`), `usePopUp`, `addSingleUserAction` (de `UsuariosActions.js`), varios `Input` componentes genéricos (`InputTipoDocumentoIdentidad`, `InputDocumentoIdentidad`, `InputTextoGeneral`, `InputFecha`, `InputGenero`, `InputTelefono`, `InputEmail`, `InputPassword`, `InputRol`).
    * **Lógica Principal:**
        *   Utiliza `addSingleUserAction` como Server Action para procesar el formulario.
        *   Aplica el patrón de `useActionState` y `useFormStatus` para manejar el estado de envío y mostrar feedback al usuario a través de `usePopUp`.
        *   Recopila datos como tipo/número de documento, nombres, apellidos, fecha de nacimiento, género, teléfono, dirección, correo, contraseña y rol.
    * **Modelos de Datos / Endpoints:** Interactúa con `UsuariosActions.js` para crear nuevos usuarios.
    * **Notas de Refactorización:** Se asegurará la alineación con el patrón de `useActionState` de React 19 y las convenciones de nombres de campos.

#### 📄 **Archivo:** `src/components/layout/admin/usuarios/forms/FormEditarUsuario.jsx` (Propuesto/A Adaptar)
* **Rol:** Formulario para que los administradores editen la información de un usuario existente.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `FormEditarUsuario` (componente), `useActionState` (de `react`), `useFormStatus` (de `react-dom`), `usePopUp`, `EditarUsuario` (de `UsuariosActions.js`), varios `Input` componentes genéricos.
    * **Lógica Principal:**
        *   Recibe los datos del usuario a editar.
        *   Utiliza `EditarUsuario` como Server Action para procesar el formulario.
        *   Aplica el patrón de `useActionState` y `useFormStatus` para manejar el estado de envío y mostrar feedback al usuario a través de `usePopUp`.
        *   Permite la edición de campos como nombres, apellidos, fecha de nacimiento, género, teléfono, dirección, correo y rol.
    * **Modelos de Datos / Endpoints:** Interactúa con `UsuariosActions.js` para actualizar usuarios.
    * **Notas de Refactorización:** Este componente será creado o adaptado para manejar la edición de usuarios, asegurando la alineación con los patrones de formularios y nombres de campos.

#### 📄 **Archivo:** `src/components/layout/admin/usuarios/forms/FormCargaMasivaUsuarios.jsx`
* **Rol:** Formulario para que los administradores realicen la carga masiva de usuarios mediante un archivo.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `FormCargaMasivaUsuarios` (componente), `useActionState` (de `react`), `useFormStatus` (de `react-dom`), `usePopUp`, `RegistroMasivoUsuario` (de `UsuariosActions.js`), `InputFiles`, `BotonGeneral`.
    * **Lógica Principal:**
        *   Utiliza `RegistroMasivoUsuario` como Server Action para procesar el archivo subido.
        *   Aplica el patrón de `useActionState` y `useFormStatus` para manejar el estado de envío y mostrar feedback al usuario a través de `usePopUp`.
        *   Proporciona un campo de entrada de archivo (`InputFiles`) y un botón de envío.
    * **Modelos de Datos / Endpoints:** Interactúa con `UsuariosActions.js` para la creación masiva de usuarios.
    * **Notas de Refactorización:** Se asegurará la alineación con el patrón de `useActionState` de React 19 y las convenciones de nombres de campos.

#### 📄 **Archivo:** `src/app/acciones/UsuariosActions.js`
* **Rol:** Contiene Server Actions para la gestión de usuarios por parte del administrador.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `addSingleUserAction`, `RegistroMasivoUsuario`, `FiltrarUsuarios`, `toggleUsuarioHabilitado`, `ObtenerTodosLosUsuarios`, `ObtenerUsuarioPorId`, `EditarUsuario`.
    * **Lógica Principal:**
        *   `addSingleUserAction`: Agrega un solo usuario (llamando a `RegistrarUsuario`).
        *   `RegistroMasivoUsuario`: Procesa un archivo CSV para agregar múltiples usuarios, validando y transformando los datos según los patrones establecidos.
        *   `FiltrarUsuarios`: Permite buscar y filtrar usuarios por varios criterios (texto, rol, género, tipo de documento, edad, estado de habilitación).
        *   `toggleUsuarioHabilitado`: Cambia el estado `habilitado` de un usuario.
        *   `ObtenerTodosLosUsuarios`: Recupera todos los usuarios de la base de datos, convirtiendo los objetos de Mongoose a objetos planos.
        *   `ObtenerUsuarioPorId`: Recupera un usuario por su ID, convirtiendo el objeto de Mongoose a objeto plano.
        *   `EditarUsuario`: Actualiza la información de un usuario existente.
        *   Todas las acciones utilizan `revalidatePath` para mantener la UI actualizada y manejan errores de forma consistente, devolviendo mensajes y estados de éxito/fallo.
    * **Modelos de Datos / Endpoints:** Modifica/consume el modelo `Usuario` de Mongoose.
    * **Notas de Refactorización:** Se asegurará la alineación con el patrón de Server Actions, incluyendo validación, manejo de errores, y uso de `revalidatePath`. Se estandarizará la conversión de objetos de Mongoose a objetos planos.

#### 📄 **Archivo:** `src/components/layout/admin/usuarios/THUsuarios.jsx`
* **Rol:** Define los encabezados de la tabla para la visualización de usuarios en el panel de administración.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `THUsuarios` (componente), `Thgeneral`, `TablaHeader`.
    * **Lógica Principal:** Renderiza una fila de encabezados de tabla predefinidos para la información del usuario.
    * **Modelos de Datos / Endpoints:** No interactúa directamente.
