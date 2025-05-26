# System Patterns

## System Architecture
The "Black Noise Next.js E-commerce" project follows a client-server architecture, leveraging Next.js's full-stack capabilities.

- **Frontend (Client-side):** Built with React components rendered by Next.js. Handles user interaction, data display, and client-side routing.
- **Backend (Server-side/API):** Implemented using Next.js API Routes. These routes act as a RESTful API, handling business logic, database interactions, and authentication.
- **Database:** MongoDB, a NoSQL database, is used for data persistence. Mongoose is likely used as an ODM (Object Data Modeling) library for interacting with MongoDB.

## Key Technical Decisions
- **Next.js for Full-Stack:** Chosen for its ability to handle both frontend rendering (SSR, SSG, CSR) and backend API routes, simplifying deployment and development workflow.
- **NextAuth.js for Authentication:** Provides a robust and flexible authentication solution, supporting various providers and session management.
- **MongoDB/Mongoose:** Selected for its flexibility with schema-less data and ease of integration with Node.js applications.
- **Modular Component Design:** UI is broken down into reusable React components (`src/components`).
- **Centralized Context Management:** React Context API (`src/context`) is used for global state management (e.g., user authentication, modals, pop-ups).
- **API Route Structure:** API routes are organized logically under `src/app/api/` based on resource (e.g., `users`, `products`, `orders`).
- **Action Files:** `src/app/acciones` likely contains client-side functions that interact with the API routes, abstracting API calls from components.

## Design Patterns in Use
- **Component-Based Architecture:** React components are used to build the UI, promoting reusability and maintainability.
- **API Layer Abstraction:** API calls are likely abstracted into separate "action" files or utility functions, keeping components clean and focused on UI.
- **Context API for State Management:** Used for managing global state, avoiding prop drilling.
- **MVC-like Structure (Implicit):** While not a strict MVC, the separation of models (`src/models`), views (React components in `src/app` and `src/components`), and controllers (API routes in `src/app/api`) loosely follows this pattern.
- **Enum Usage:** `src/models/enums` indicates the use of enums for defining fixed sets of values, improving code readability and preventing errors.

## Component Relationships
- **Layout Components:** `src/components/layout` contains higher-order components or wrappers for different sections of the application (e.g., `AdminLayout`, `HeaderPrincipal`).
- **Common Components:** `src/components/common` houses generic, reusable UI elements (buttons, inputs, modals, tables) that can be used across the application.
- **Page Components:** Components within `src/app` are typically page-level components that compose smaller components to form a complete view.

## Critical Implementation Paths
- **User Authentication Flow:**
    - User registration (`src/app/registro/page.jsx`, `src/app/api/usuarios/route.js`)
    - User login (`src/app/login/page.jsx`, `src/app/api/auth/login/route.js`, `src/context/UserContext.jsx`, `src/app/api/auth/[...nextauth]/route.js`)
    - Session management (`src/app/SessionProviderWrapper.jsx`, `src/middleware.js`)
    - Profile access and editing (`src/app/perfil/page.jsx`, `src/app/perfil/editar/page.jsx`, `src/app/api/auth/user/route.js`)
- **Admin Management Flows:**
    - User management (`src/app/admin/usuarios/page.jsx`, `src/app/api/usuarios/route.js`)
    - Design management (`src/app/admin/designs/page.jsx`, `src/app/api/designs/route.js`)
    - Supplier management (`src/app/admin/proveedores/page.jsx`, `src/app/api/proveedores/route.js`)
- **Supplier Application Flow:**
    - Supplier registration/application (`src/app/proveedor/solicitud/page.jsx`, `src/app/api/solicitudes-proveedor/route.js`)
    - Admin approval of supplier applications (`src/app/admin/solicitudes-proveedor/page.jsx`, `src/app/api/solicitudes-proveedor/[id]/route.js`)
- **Database Connection:** `src/utils/DBconection.js` is critical for establishing and maintaining the connection to MongoDB.

# Patrón de Gestión de Ramas

## Nuevas Funcionalidades
- Cuando se requiera implementar una nueva funcionalidad, crear una nueva rama específica para esa funcionalidad
- La rama debe crearse a partir de main
- El nombre de la rama debe ser descriptivo de la funcionalidad

## Proceso de Fusión
- Una vez que la funcionalidad está implementada al 100%, fusionar la rama con main
- Después de la fusión exitosa, eliminar la rama de la funcionalidad
- Mantener la rama main como la fuente principal de verdad

Este patrón asegura:
1. Desarrollo aislado de nuevas funcionalidades
2. Código estable en main
3. Repositorio limpio y organizado
