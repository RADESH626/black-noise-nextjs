# Admin User Management - Profile Picture Update

This document outlines the functionality for administrators to update user profile pictures.

## Current Implementation

The `src/app/admin/users/page.jsx` component allows an administrator to select a user (currently a placeholder) and upload a new profile picture for them. It utilizes the `actualizarFotoPerfilUsuarioPorAdmin` server action to handle the image upload and update in the database.

## Planned Enhancements: Optimistic UI Update and Rollback

To improve the user experience, the profile picture update process will be enhanced with optimistic UI updates and rollback capabilities:

1.  **Optimistic UI Update:** When an administrator uploads a new profile picture, the UI will immediately reflect the new image, providing instant visual feedback.
2.  **Loading State:** A loading indicator will be displayed during the server request to prevent multiple submissions and inform the user that the operation is in progress.
3.  **Rollback on Error:** If the server action (`actualizarFotoPerfilUsuarioPorAdmin`) fails for any reason, the UI will automatically revert to the previous profile picture, ensuring data consistency and clear error handling.

This approach aligns with the "Patrones de Sincronización de Datos" documented in `memory-bank/systemPatterns.md`.
