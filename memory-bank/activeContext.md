### 11/6/2025, 6:42:12 p. m.

**Task:** Solucionar el problema visual del modal de edición (`ModalEditarUsuario`) donde el contenido se mostraba cortado.

**Cambios Realizados:**

*   **`src/components/layout/admin/usuarios/modals/ModalEditarUsuario.jsx`**:
    *   Se eliminó la clase `max-h-[85vh]` del `div` principal para permitir que el modal se adapte a la altura proporcionada por el componente `Modal` genérico.
    *   Se eliminó la clase `overflow-y-auto` del `div` interno, delegando la responsabilidad de desplazamiento al componente `Modal` genérico.

**Resultado:**

El `ModalEditarUsuario` ahora debería mostrar todo su contenido correctamente, con el scroll vertical funcionando a través del componente `Modal` genérico si el contenido del formulario es extenso.
