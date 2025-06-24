# User Management

This document outlines the functionalities related to user management, including registration, login, and logout.

## User Identifiers and Login

To simplify the login process and adhere to modern best practices, the `UsuarioSchema` has been refactored to use `correo` (email) as the sole unique identifier for user authentication. The `nombreUsuario` (username) field has been removed from the schema. This change streamlines the login experience, requiring users to only provide their email and password.

## Logout Functionality

The logout functionality allows a user to end their active session. Upon successful logout, the user is redirected to the login page (`/login`) to ensure they must re-authenticate to access protected areas of the application.
