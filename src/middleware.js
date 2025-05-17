import { withAuth } from "next-auth/middleware"
import { NextResponse } from 'next/server'

const publicPath = [
  '/api/auth/',
  // Ejemplo: '/api/webhooks/stripe'
  // Añade aquí las rutas específicas que necesitas que sean públicas
];


export default withAuth(
  // `withAuth` mejora tu `Request` con el token del usuario.
  function middleware(req) {

    const isPublicPath = publicPath.some((path) => req.nextUrl.pathname.startsWith(path));
    // Si la ruta es pública, no se necesita autenticación.
    if (isPublicPath) {
      return NextResponse.next();
    }


    // Si la ruta es /admin/* y el usuario no tiene el rol 'ADMINISTRADOR', se redirige al index.
    if (req.nextauth.token?.rol !== "ADMINISTRADOR") {

      console.log("error ")

      return NextResponse.redirect(new URL("/", req.url));

    }

    // Si es admin o no es una ruta /admin, permitir el acceso.
    return NextResponse.next();

  },
  {
    callbacks: {
      // Este callback se ejecuta para determinar si el middleware debe ejecutarse.
      // Si `authorized` devuelve false, el usuario es redirigido a la página de signIn.
      // Si devuelve true, la función `middleware` de arriba se ejecuta.
      authorized: ({ token }) => !!token // Solo ejecuta el middleware si el usuario está logueado (tiene un token).
    },
    pages: {
      signIn: "/login", // Asegúrate de que esta es tu página de login si la tienes personalizada
      // error: "/auth/error", // Página de error de autenticación
    }
  }
);

// El matcher especifica qué rutas deben ser protegidas por este middleware.
export const config = {
  matcher: [
    "/admin/:path*",  // Protege todas las rutas bajo /admin
    "/api/:path*", // Protege todas las rutas bajo /api

    //se pueden agregar otras rutas que se deseen proteger
  ]
};


// En este caso, el middleware protege todas las rutas bajo /admin y /api.
