# Supplier Profile Management - Edit Profile

This document outlines the functionality for suppliers to edit their own profile details.

## Current Implementation

The `src/app/proveedor/editar-perfil/page.jsx` component fetches the supplier's profile and passes it to `src/components/layout/proveedor/forms/FormEditarPerfilProveedor.jsx`. This form allows the supplier to edit their profile details. The form submission likely interacts with a server action (e.g., `actualizarPerfilProveedor`).

## Planned Enhancements: Optimistic UI Update and Rollback

To improve the user experience, the supplier profile editing process will be enhanced with optimistic UI updates and rollback capabilities:

1.  **Optimistic UI Update:** When a supplier submits changes to their profile, the UI will immediately reflect the new details (e.g., name, contact information), providing instant visual feedback.
2.  **Loading State:** A loading indicator will be displayed during the server request to prevent multiple submissions and inform the user that the operation is in progress.
3.  **Rollback on Error:** If the server action (e.g., `actualizarPerfilProveedor`) fails for any reason, the UI will automatically revert to the previous profile details, ensuring data consistency and clear error handling.

This approach aligns with the "Patrones de Sincronización de Datos" documented in `memory-bank/systemPatterns.md`.
