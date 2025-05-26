# Active Context

## Current Work Focus
Debugging authentication issue where providers can't access `/proveedor/solicitud` route despite being logged in.

## Recent Changes
- **Authentication Investigation**: Discovered dual authentication systems running in parallel:
  1. NextAuth.js system (used by middleware and pages)
  2. Custom cookie-based system (used by some API routes and UserContext)
- **Debug Implementation**: Added comprehensive debugging logs to:
  - `/proveedor/solicitud/page.jsx` - Shows session data and user role
  - `src/middleware.js` - Shows token validation and role checking
- **Environment Fix**: Updated `NEXTAUTH_URL` from port 3000 to 3001 to match running server
- **Route Fix**: Corrected redirect from `/proveedores` to `/proveedor` in solicitud page

## Next Steps
- Monitor console logs to identify the exact authentication flow issue
- Remove duplicate authentication systems if needed
- Test the `/proveedor/solicitud` route with a logged-in provider user
- Clean up debug logs once issue is resolved

## Active Decisions and Considerations
- **Authentication Conflict**: The project has two separate auth systems that may be conflicting:
  - NextAuth.js handles login form (`FormLogin.jsx` uses `signIn('credentials')`)
  - Custom system in `UserContext.jsx` calls `/api/auth/user` route
  - Middleware expects NextAuth tokens but custom routes use cookies
- **Port Configuration**: Server runs on port 3001, environment variables updated accordingly
- **Role Validation**: Middleware properly checks for `PROVEEDOR` or `ADMINISTRADOR` roles for `/proveedor/*` routes

## Important Patterns and Preferences
- **Debug Strategy**: Always add comprehensive console.log statements when debugging auth issues
- **Environment Consistency**: Ensure NEXTAUTH_URL matches the actual running port
- **Role-based Access**: Use enum values from `src/models/enums/usuario/Rol.js` for consistency

## Learnings and Project Insights
- **Authentication Architecture**: NextAuth.js is the primary authentication system, but there's legacy custom auth code
- **Role System**: Uses string-based roles: 'CLIENTE', 'EMPLEADO', 'ADMINISTRADOR', 'PROVEEDOR'
- **Route Protection**: Middleware protects `/admin/*`, `/proveedor/*`, and `/perfil/*` routes
- **Session Management**: NextAuth session includes user ID, name, email, image, and rol
- **Database Integration**: MongoDB with Mongoose, user data properly structured in `UsuariosActions.js`
