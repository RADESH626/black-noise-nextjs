import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const isMockModeEnabled = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    console.log('=== MIDDLEWARE DEBUG ===');
    console.log('Path:', path);
    console.log('Token exists:', !!token);
    console.log('Token rol:', token?.rol);
    console.log('Token data:', token);
    console.log('Is Mock Mode Enabled:', isMockModeEnabled);
    console.log('========================');

    // If mock mode is enabled, bypass all role-based and authentication redirects
    if (isMockModeEnabled) {
      console.log('🎭 Mock Mode: Saltando todas las validaciones de middleware.');
      return NextResponse.next();
    }

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
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // If mock mode is enabled, always authorize
        if (isMockModeEnabled) {
          console.log('🎭 Mock Mode: Authorized callback siempre devuelve true.');
          return true;
        }
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
};
