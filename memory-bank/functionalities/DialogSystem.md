# Dialog System (Pop-ups and Modals)

This document outlines the refactored dialog system, which now centralizes the management of on-screen messages (pop-ups) and interactive windows (modals) using a unified `DialogContext`.

## Purpose

The primary goal of this refactoring is to provide a consistent, accessible, and easily manageable way to display various types of dialogs to the user. It distinguishes between transient, informative pop-up messages and persistent, interactive modals.

## Key Components

### 1. `DialogContext` (`src/context/DialogContext.jsx`)

- **Description**: This is the central context provider that manages the state and logic for both pop-up messages and modals. It replaces the previous `PopUpContext`.
- **Provider**: `DialogProvider` wraps the application (or relevant parts) to make the dialog functions available.
- **Hook**: `useDialog` is the custom hook used by components to interact with the dialog system.
- **Functions**:
    - `showPopUp(message, type)`: Displays a transient pop-up message.
        - `message` (string): The text content of the pop-up.
        - `type` (string, optional): The type of message, e.g., 'success', 'error', 'info'. Defaults to 'success'.
    - `openModal(title, content, type)`: Displays an interactive modal.
        - `title` (string): The title displayed at the top of the modal.
        - `content` (ReactNode): The JSX content to be rendered inside the modal.
        - `type` (string, optional): The type of modal, e.g., 'default', 'info', 'success', 'error'. Defaults to 'default'.
    - `closeModal()`: Closes the currently open modal.

### 2. `PopUpMessage` Component (`src/components/common/modales/PopUpMessage.jsx`)

- **Description**: Renders the transient pop-up messages.
- **Technology**: Uses the native HTML `<dialog>` element for improved accessibility and predictable behavior.
- **Positioning**: Designed to appear at the **top-center** of the screen.
- **Auto-hide**: Automatically hides after a short duration (e.g., 2 seconds).

### 3. `Modal` Component (`src/components/common/modales/Modal.jsx`)

- **Description**: Renders the interactive modals.
- **Technology**: Uses the native HTML `<dialog>` element for improved accessibility and predictable behavior.
- **Positioning**: Designed to appear at the **absolute center** of the screen.
- **Usage**: Used by `DialogContext` to render the content provided via `openModal()`.

## Implementation Details

- **Native `<dialog>` Element**: Both `PopUpMessage` and `Modal` components leverage the HTML `<dialog>` element. This provides built-in features like:
    - Semantic meaning for dialogs.
    - Default modal behavior (e.g., blocking interaction with the rest of the page when `showModal()` is called).
    - Accessibility features (e.g., focus management, ARIA attributes).
    - The native backdrop for the `Modal` component is now explicitly removed by setting `background-color: transparent;` on the `dialog::backdrop` pseudo-element in `src/app/globals.css`, as per user request.
- **Styling**: Tailwind CSS classes are used for styling, with specific classes applied to `PopUpMessage` for top-center positioning and `Modal` for central positioning.
- **Context-based State Management**: All dialog states (message, modal content, visibility) are managed within `DialogContext`, ensuring a single source of truth and easy control from any component that consumes the context.

## Usage Example

```jsx
// In a component that needs to show a dialog
import { useDialog } from '@/context/DialogContext';
import MyCustomModalContent from './MyCustomModalContent'; // Example content for a modal

function MyComponent() {
  const { showPopUp, openModal, closeModal } = useDialog();

  const handleShowSuccessPopUp = () => {
    showPopUp("Operación completada exitosamente!", "success");
  };

  const handleShowErrorPopUp = () => {
    showPopUp("Hubo un error al procesar tu solicitud.", "error");
  };

  const handleOpenInfoModal = () => {
    openModal(
      "Información Adicional",
      <div>
        <p>Este es el contenido de tu modal informativo.</p>
        <MyCustomModalContent />
        <button onClick={closeModal}>Cerrar</button>
      </div>,
      "info"
    );
  };

  return (
    <div>
      <button onClick={handleShowSuccessPopUp}>Mostrar Pop-up Éxito</button>
      <button onClick={handleShowErrorPopUp}>Mostrar Pop-up Error</button>
      <button onClick={handleOpenInfoModal}>Abrir Modal de Información</button>
    </div>
  );
}
