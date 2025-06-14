import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"; // Import getToken

export async function middleware(req) {
  const pathname = req.nextUrl.pathname;

  // Define paths that do NOT require authentication
  const publicPaths = ["/login", "/registro", "/api/email", "/api/auth"];

  // Check if the current path is a public path
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  if (isPublicPath) {
    return NextResponse.next();
  }

  // For all other paths, check for authentication
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    // Redirect unauthenticated users to the login page
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.search = `callbackUrl=${encodeURIComponent(pathname + req.nextUrl.search)}`;
    return NextResponse.redirect(url);
  }

  // Role-based redirection (if token exists)
  if (token?.role === "ADMINISTRADOR" && !pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  if (token?.isSupplier === true && !pathname.startsWith("/proveedor")) {
    return NextResponse.redirect(new URL("/proveedor", req.url));
  }

  // Allow access if authenticated and no specific redirection is needed
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Exclude Next.js internal paths and static files from middleware
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
