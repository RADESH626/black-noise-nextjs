Feature: Gestión de Diseños del Usuario
Resumen
Se implementó la capacidad para que los usuarios editen y eliminen sus propios diseños desde su página de perfil (/perfil). Las acciones utilizan actualizaciones optimistas para una experiencia fluida.

Funcionalidades
Eliminar Diseño:

El usuario hace clic en "Eliminar".

El diseño desaparece inmediatamente de la UI (actualización optimista).

Se realiza una llamada a la server action eliminarDesign después de un debounce de 500ms.

En caso de error, el diseño reaparece y se notifica al usuario (rollback).

Editar Diseño:

Al hacer clic en "Editar", se abre un modal (FormEditarDesign.jsx).

Al enviar el formulario, los cambios se aplican instantáneamente en la UI (actualización optimista).

Se llama a la server action actualizarDesign con un debounce de 500ms.

Se implementa lógica de rollback en caso de fallo.

Componentes y Archivos Clave
src/components/layout/ProfileContent.jsx: Orquesta la lógica y los manejadores de eventos.

src/components/common/DesignsComponent.jsx: Ahora acepta mode="profile" para renderizar los botones de acción.

src/components/perfil/FormEditarDesign.jsx: Formulario de edición.
