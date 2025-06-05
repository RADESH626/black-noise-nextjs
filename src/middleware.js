<<<<<<< HEAD
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    console.log('=== MIDDLEWARE DEBUG ===');
    console.log('Path:', path);
    console.log('Token exists:', !!token);
    console.log('Token rol:', token?.rol);
    console.log('Token data:', token);
    console.log('========================');

    // Si no hay token, redireccionar a login
    if (!token) {
      console.log('No token found, redirecting to login');
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Rutas protegidas por rol
    if (path.startsWith("/admin") && token.rol !== "ADMINISTRADOR") {
      console.log('Admin access denied, user rol:', token.rol);
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (path.startsWith("/proveedor") && !["PROVEEDOR", "ADMINISTRADOR"].includes(token.rol)) {
      console.log('Proveedor access denied, user rol:', token.rol, 'path:', path);
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Rutas API protegidas por rol
    if (path.startsWith("/api/administrador") && token.rol !== "ADMINISTRADOR") {
      console.log('Admin API access denied, user rol:', token.rol);
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (path.startsWith("/api/proveedor") && !["PROVEEDOR", "ADMINISTRADOR"].includes(token.rol)) {
      console.log('Proveedor API access denied, user rol:', token.rol, 'path:', path);
      return NextResponse.redirect(new URL("/", req.url));
    }

    console.log('Access granted for path:', path, 'with rol:', token.rol);
=======
import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

const productionMiddleware = withAuth(
  async function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Example: Redirect admin users from non-admin pages to /admin
    if (token?.role === "ADMINISTRADOR" && !pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    // Example: Redirect provider users from non-provider pages to /proveedor
    if (token?.role === "PROVEVEEDOR" && !pathname.startsWith("/proveedor")) {
      return NextResponse.redirect(new URL("/proveedor", req.url));
    }

    // Allow access if no specific redirection is needed
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d
    return NextResponse.next();
  },
  {
    callbacks: {
<<<<<<< HEAD
      authorized: ({ req, token }) => {
        console.log('Authorized callback - token exists:', !!token);
        return !!token;
      }
    }
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/proveedor/:path*",
    "/perfil/:path*",
    "/api/administrador/:path*",
    "/api/cliente/:path*",
    "/api/proveedor/:path*"
  ]
=======
      authorized: ({ token }) => {
        // Allow access to all authenticated users by default
        return !!token;
      },
    },
    pages: {
      signIn: "/login", // Redirect unauthenticated users to the login page
    },
  }
);

const developmentMiddleware = async function middleware(req) {
  // Unconditionally allow access to all routes for development purposes
  return NextResponse.next();
};

export default developmentMiddleware;

export const config = {
  matcher: [
    // Match all routes for middleware to apply
    "/(.*)",
  ],
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d
};
