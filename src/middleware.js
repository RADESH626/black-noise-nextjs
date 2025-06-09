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

    // Redirect supplier users from non-supplier pages to /proveedor
    if (token?.isSupplier === true && !pathname.startsWith("/proveedor")) {
      return NextResponse.redirect(new URL("/proveedor", req.url));
    }

    // Allow access if no specific redirection is needed
    return NextResponse.next();
    },
    {
      callbacks: {
        authorized: ({ token, req }) => {
          const { pathname } = req.nextUrl;
          // Allow access to login and registration pages for unauthenticated users
          if (pathname === "/login" || pathname === "/registro") {
            return true;
          }
          // Allow access to all authenticated users by default for other pages
          return !!token;
        },
      },
      pages: {
        signIn: "/login", // Redirect unauthenticated users to the login page
      },
    }
);

export default productionMiddleware;

export const config = {
  matcher: [
    // Match all routes for middleware to apply
    "/(.*)",
  ],
};
