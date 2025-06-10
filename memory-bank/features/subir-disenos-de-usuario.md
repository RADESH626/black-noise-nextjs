# Nueva Funcionalidad: Permitir a los usuarios subir sus propios diseños.

## Objetivo General:
Implementar la capacidad para que un usuario registrado pueda agregar sus propios diseños a la plataforma a través de su página de perfil.

## Historia de Usuario (User Story)
Como usuario registrado, quiero poder subir mis diseños a la plataforma desde mi perfil para que puedan ser vistos y eventualmente comprados por otros.

## Requisitos Detallados / Criterios de Aceptación
1.  **Cambios en la Interfaz de Usuario (UI):**
    *   En la página de perfil (/perfil), dentro de la pestaña "DISEÑOS", debe existir un botón con el texto + Agregar Diseño.
    *   Al hacer clic en este botón, se debe abrir una ventana modal para el registro de un nuevo diseño.

2.  **Contenido del Modal:**
    *   El modal debe contener un formulario claro y fácil de usar con los siguientes campos para registrar un nuevo diseño:
        *   Nombre del Diseño: Campo de texto (requerido).
        *   Descripción: Área de texto (requerido).
        *   Precio: Campo numérico (requerido).
        *   Categoría: Menú desplegable con las opciones del enum CategoriaProducto (requerido).
        *   URL de la Imagen: Campo de texto para la URL de la imagen del diseño (requerido).
        *   Tallas Disponibles: Campo de texto (ej: "S, M, L, XL").
        *   Colores Disponibles: Campo de texto (ej: "Rojo, Azul, Negro").

3.  **Lógica del Backend (Server Action):**
    *   El formulario debe enviar los datos a la Server Action `guardarDesigns` ubicada en `src/app/acciones/DesignActions.js`.
    *   La acción debe identificar al usuario que ha iniciado sesión a través de `getServerSession`.
    *   Es crucial que el `usuarioId` del usuario en sesión se asocie y se guarde en el nuevo documento del diseño.
    *   El `estadoDesing` por defecto para cualquier diseño nuevo debe ser `PRIVADO`.

4.  **Retroalimentación (Feedback) y Comportamiento Post-Envío:**
    *   Mientras se procesa el envío del formulario, el botón debe mostrar un estado de "cargando" o "guardando" para informar al usuario que la acción está en progreso.
    *   Una vez completada la acción, debe aparecer una notificación (pop-up) indicando el resultado:
        *   Éxito: "Diseño guardado exitosamente".
        *   Error: Un mensaje descriptivo del error.
    *   Si la operación es exitosa, el modal debe cerrarse automáticamente y la lista de diseños en la página de perfil debe actualizarse para reflejar inmediatamente el nuevo diseño agregado.

## Notas Técnicas Adicionales:
*   Para la gestión del modal, utilizar el `ModalContext` ya existente en el proyecto a través del hook `useModal`.
*   El formulario debe seguir el patrón de `useActionState` y `useFormStatus` para un manejo de estado y lógica de envío modernos y eficientes.
*   La Server Action debe invocar `revalidatePath('/perfil')` al finalizar exitosamente para garantizar la actualización de los datos en el cliente.
*   Verificar que el modelo `Design` en `src/models/Design.js` contenga todos los campos necesarios (descripcion, tallasDisponibles, coloresDisponibles, etc.).
