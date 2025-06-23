# Admin Design Management - Edit Design

This document outlines the functionality for administrators to edit existing design details.

## Current Implementation

The `src/app/admin/designs/editar/[id]/page.jsx` component allows an administrator to edit the name, description, price, category, and image of a specific design. It fetches the design details using `encontrarDesignsPorId` and updates them using the `actualizarDesign` server action.

## Planned Enhancements: Optimistic UI Update and Rollback

To improve the user experience, the design editing process will be enhanced with optimistic UI updates and rollback capabilities:

1.  **Optimistic UI Update:** When an administrator submits changes to a design, the UI will immediately reflect the new details (name, description, price, category, and image preview), providing instant visual feedback.
2.  **Loading State:** The existing loading indicator will be utilized to prevent multiple submissions and inform the user that the operation is in progress.
3.  **Rollback on Error:** If the server action (`actualizarDesign`) fails for any reason, the UI will automatically revert to the previous design details, ensuring data consistency and clear error handling.

This approach aligns with the "Patrones de Sincronización de Datos" documented in `memory-bank/systemPatterns.md`.
