# Active Context

## Current Session: User Schema Refactoring and Codebase Cleanup (2025-06-14)

This session focused on refactoring the `UsuarioSchema` to simplify the login method by removing the `nombreUsuario` field and subsequently cleaning up all references to this field in the codebase.

**Changes Made:**
- Removed the `nombreUsuario` field from `src/models/Usuario.js` to streamline the login process, making `correo` the sole unique identifier for authentication.
- Updated `memory-bank/functionalities/UserManagement.md` to reflect the change in user identifiers and login process.
- Modified `src/components/layout/admin/dashboards/UsuariosClientPage.jsx` to replace `user.nombreUsuario` with `user.Nombre` and `user.primerApellido` for display purposes.
- Removed the `nombreUsuario` creation line from `src/app/acciones/UsuariosActions.js` during user registration.
- Updated `src/app/acciones/PagoActions.js` to change `populate('usuarioId', 'nombreUsuario correo')` to `populate('usuarioId', 'Nombre primerApellido correo')`.
- Updated `src/app/acciones/DesignActions.js` to change `select: 'nombreUsuario imageData imageMimeType'` to `select: 'Nombre primerApellido imageData imageMimeType'` and to use `design.usuarioId.Nombre` and `design.usuarioId.primerApellido` for displaying the user's name.
- Removed the `nombreUsuario` creation line from `src/app/api/administrador/usuarios/route.js`.

## Previous Sessions:
- Payment Flow Consolidation and Refinement (2025-06-14)
- Payment Page Enhancements (2025-06-14)
- Payment Modal Refactoring, useState Fix, and Modal Standardization (2025-06-14)
- Hydration Error Fix (2025-06-14)
- Cart Page Enhancements and Bug Fixes (2025-06-14)
