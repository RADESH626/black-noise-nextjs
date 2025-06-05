# Progress

## What Works
- The Next.js application structure is set up.
- Initial authentication and authorization middleware was in place.
- All routes are now accessible without validation for frontend development purposes.
- A session simulation button and associated context/hook have been implemented for visual testing of authenticated/unauthenticated views.
- The main header (`HeaderPrincipal`) now conditionally displays a user icon when a session is active, and clicking it opens a **dropdown menu** with "Ver Perfil" and "Cerrar Sesión" options, positioned next to the profile picture.
- A data simulation button and associated context/hook have been implemented for visual testing and development purposes.
- `UserContext` has been successfully eliminated.
- `src/app/layout.jsx` has been updated to remove `UserProvider`.
- `src/components/common/modales/NewOrderModal.jsx` has been refactored to use `useSession` from `next-auth/react` and `ObtenerUsuarioPorCorreo` from `src/app/acciones/UsuariosActions` based on the session email.
- The `/catalogo` view has been transformed into a social media-like page, including user avatars, like and share buttons, and a "Publicar Diseño" section.
- Mock design data from `src/data/mock/designs.js` is now integrated into the `/catalogo` view.
- Client-side logic has been implemented for a like/unlike toggle functionality on designs using `localStorage`, with visual feedback (outline/filled heart icon).
- The "Maximum update depth exceeded" error in `/catalogo` has been resolved by memoizing data arrays using `useMemo`.
- The `/perfil` view now implements a tabbed interface in `ProfileContent.jsx`, allowing conditional rendering of `DesignsComponent` and `PedidosComponent` based on the active tab ("DISEÑOS" or "PEDIDOS").
- The `useRouter` import and initialization were removed from `ProfileContent.jsx`.
- `DesignsComponent.jsx` was created to encapsulate the design display logic.
- `PedidosComponent.jsx` was updated to fetch and display order data using `obtenerPedidosPorUsuarioId`, handling loading and error states.

## What's Left to Build
- Revert or adjust middleware for production environment.
- Continue with frontend development, now that route access is unrestricted and session simulation/data simulation are available.
- **Debugging:** Resolve the issue where the user icon and login button are not reacting correctly to the simulated session state in the header.

## Current Status
- All necessary code modifications have been implemented to disable NextAuth.js authentication for development purposes, including changes to `src/app/login/page.jsx`, `src/middleware.js`, `src/app/layout.jsx`, and `src/app/api/auth/[...nextauth]/route.js`.
- The session simulation feature has been fully implemented, including:
    - `src/context/MockSessionContext.jsx` (with added debug `console.log`)
    - `src/components/common/SessionToggleButton.jsx`
    - `src/hooks/useSimulatedSession.js`
    - Integration into `src/app/layout.jsx`
    - Usage in `src/app/perfil/ProfileContent.jsx`
- The user profile icon and **dropdown menu** functionality have been integrated into `src/components/layout/general/HeaderPrincipal.jsx`.
- The data simulation feature has been fully implemented, including:
    - `src/context/MockDataContext.jsx`
    - `src/hooks/useMockData.js`
    - `src/components/common/MockDataToggleButton.jsx`
    - Integration into `src/app/layout.jsx`
- `UserContext` has been removed, and `NewOrderModal.jsx` has been refactored to fetch user data directly using `useSession` and `ObtenerUsuarioPorCorreo`.
- The `/catalogo` view has been updated to display designs in a social media-like format, using mock data, and includes a "Publicar Diseño" button.
- The like functionality in `/catalogo` now supports a like/unlike toggle per design per user (client-side, via `localStorage`), with visual feedback (outline/filled heart icon).
- A message "No hay diseños disponibles" is displayed when no designs are present in the `/catalogo` view.

## Known Issues
- The current middleware configuration is not suitable for production as it bypasses all authentication.
- **Persistent Environmental Issue:** Despite correct code changes, the Next.js development server appears to be aggressively caching or failing to hot-reload fundamental configuration changes, leading to persistent 401 Unauthorized errors and redirects. A full manual server restart (`Ctrl+C` and `npm run dev`) is likely required for changes to take effect.
- **Session Simulation Display Issue:** The `HeaderPrincipal` component is not correctly updating its display (user icon appearing, login button disappearing) when the session simulation button is toggled. Debugging steps have been initiated by adding a `console.log` in `MockSessionContext.jsx`.

## Evolution of Project Decisions
- Decision to temporarily disable route validation to accelerate frontend development.
- Decision to implement client-side session and data simulation for visual testing, separate from NextAuth.js's actual authentication flow, to provide a quick way to toggle between authenticated/unauthenticated views and mock data during development.
- Decision to integrate a user profile icon and **dropdown menu** into the main header for session-dependent navigation and actions.
- Decision to eliminate `UserContext` and centralize user data fetching through NextAuth.js session and a server action (`ObtenerUsuarioPorCorreo`) for a cleaner architecture.
- **Product Decision:** Comments are intentionally not implemented for designs to avoid potential negative opinions.
- **Workflow Insight:** When a task is denied, it's often because the project is already running, and I should avoid restarting the server unless explicitly necessary.
- **UI/UX Adaptation:** Adapted the `/catalogo` view to a social media-like interface while adhering to product decisions regarding feature exclusion (e.g., comments) and implementing client-side like prevention.
