# User Registration Functionality

## Overview
This document outlines the implementation of the user registration logic, including the client-side form with validations using React Hook Form and Zod, and the server-side API route responsible for saving the user to the database with a hashed password.

## Scope
- **Client-side:**
    - Creation of a user registration form.
    - Implementation of form validations using React Hook Form and Zod.
    - Handling form submission and communication with the API route.
- **Server-side:**
    - Creation of an API route (`/api/register`) to handle user registration requests.
    - Hashing of user passwords before saving them to the database.
    - Saving new user data to the database.
    - Error handling for registration failures (e.g., duplicate email).

## Technical Details

### Client-side (React Hook Form + Zod)
- **Form Component:** A new React component will be created for the registration form.
- **Validation Schema:** Zod will be used to define the schema for user input validation (e.g., email format, password strength, required fields).
- **Form Management:** React Hook Form will manage form state, input handling, and integrate with the Zod schema for validation.
- **API Interaction:** The form will submit data to the `/api/register` endpoint.

### Server-side (API Route)
- **Endpoint:** `/api/register` (POST method).
- **Password Hashing:** `bcrypt` or a similar library will be used to hash passwords before storage.
- **Database Interaction:** The existing database connection and `Usuario` model will be used to save the new user.
- **Error Handling:** The API route will return appropriate error responses for invalid input or database issues (e.g., 400 for bad request, 409 for conflict if email already exists).

## Data Model (Usuario)
The `Usuario` model will be used, ensuring that the password field is handled securely (hashed).

## Dependencies
- `react-hook-form`
- `zod`
- `bcrypt` (or similar for password hashing)

## Authentication System (NextAuth.js)

### Overview
NextAuth.js is being integrated to handle authentication, providing a robust and flexible solution for managing user sessions, sign-in, and sign-out processes. It supports various authentication strategies, including credential-based (email/password) and OAuth providers.

### Configuration (`/pages/api/auth/[...nextauth].js` or equivalent in App Router)
A dynamic API route `[...nextauth]` will be created to handle all authentication requests. This file will contain the core NextAuth.js configuration.

-   **Providers:**
    -   **CredentialsProvider:** This provider will be used for email/password authentication. It will involve:
        -   Defining a `authorize` function to validate user credentials against the database.
        -   Fetching the user from the database based on the provided email.
        -   Comparing the provided password with the hashed password stored in the database using `bcrypt.compare`.
        -   Returning the user object if authentication is successful, or `null` otherwise.
-   **Callbacks:**
    -   **`jwt` callback:** This callback is executed whenever a JSON Web Token (JWT) is created (on sign-in) or updated. It will be used to persist user information (e.g., user ID, role) into the JWT.
    -   **`session` callback:** This callback is executed whenever a session is checked. It will expose the user information from the JWT to the client-side session object, making it accessible via `useSession` or `getSession`.
-   **Session Strategy:** The session strategy will be set to `'jwt'` to use JWTs for session management, providing a stateless and scalable authentication mechanism.

### Login Flow

-   **Client-side Form:** A login form will be created (e.g., at `/login`) to capture user email and password.
-   **`signIn` Function:** Upon form submission, the `signIn` function from `next-auth/react` will be called with the `credentials` provider and the user's email and password.
-   **API Route Interaction:** NextAuth.js internally handles the POST request to `/api/auth/callback/credentials` (or similar) which triggers the `authorize` function in the NextAuth.js configuration.
-   **Success/Error Handling:** The client-side will handle the response from `signIn`, redirecting the user on success or displaying error messages on failure.

### Session Management and Route Protection

-   **`SessionProvider`:** The Next.js application will be wrapped with `SessionProvider` from `next-auth/react` to make the session available throughout the application.
-   **`useSession` Hook:** For client-side components, the `useSession` hook will be used to access the current session status and user data. This allows for conditional rendering and redirection based on authentication status.
-   **`getSession` Function:** For server-side rendering (e.g., `getServerSideProps` or API routes), the `getSession` function can be used to retrieve the session directly from the request.
-   **Middleware Protection:** A `middleware.js` file will be implemented at the root of the `src` directory to protect routes globally. This middleware will check for an active session and redirect unauthenticated users from protected routes (e.g., `/admin`, `/perfil`).

## Future Considerations
- Email verification.
- User roles and permissions (further integration with NextAuth.js callbacks).
- Social login providers (e.g., Google, Facebook).
