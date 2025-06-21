import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { ObtenerUsuarioPorCorreo } from "@/app/acciones/UsuariosActions";
import Proveedor from "@/models/Proveedor"; // Import Proveedor model
import connectDB from "@/utils/DBconection"; // Import connectDB
import logger from '@/utils/logger';
import { Rol } from "@/models/enums/usuario/Rol"; // Import Rol enum
import { NextResponse } from "next/server"; // Import NextResponse

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "tu@email.com" },
        password: { label: "Contraseña", type: "password" }
      },
      id: "credentials",
      async authorize(credentials, req) {
<<<<<<< HEAD
        await connectDB(); // Ensure DB connection for direct model access

        try {
          // Attempt to authenticate as a regular user first
          logger.debug('Finding user by email:', credentials.email);
          const user = await ObtenerUsuarioPorCorreo(credentials.email);
          
          if (user) {
            logger.debug('Comparing password for user:', credentials.email);
            const isValid = await bcrypt.compare(credentials.password, user.password);

            if (isValid) {
              logger.debug('User authenticated:', user.email);
=======
        logger.info('Authorize callback initiated.');
        logger.info('Credentials received:', credentials);

        await connectDB(); // Ensure DB connection for direct model access
        logger.info('Database connection established in authorize callback.');

        try {
          // Attempt to authenticate as a regular user first
          logger.info('Attempting to find user by email:', credentials.email);
          const user = await ObtenerUsuarioPorCorreo(credentials.email);
          logger.info('Result of ObtenerUsuarioPorCorreo:', user);
          
          if (user) {
            logger.info('User found. Comparing password for user:', credentials.email);
            const isValid = await bcrypt.compare(credentials.password, user.password);
            logger.info('Password comparison result for user:', isValid);

            if (isValid) {
              logger.info('User authenticated successfully:', user.email);
>>>>>>> c32cb53 (primer commit)

              let sessionUser = {
                id: user._id.toString(),
                name: user.Nombre,
                email: user.correo,
                image: user.profileImageUrl,
                rol: user.rol || "CLIENTE",
                isSupplier: false, // Default to false
                proveedorId: undefined, // Default to undefined
                numeroTelefono: user.numeroTelefono
};

              // If the user is a PROVEEDOR, fetch the corresponding Proveedor document
              if (user.rol === Rol.PROVEEDOR) {
<<<<<<< HEAD
                const proveedor = await Proveedor.findOne({ userId: user._id }).lean();
                if (proveedor) {
=======
                logger.info('User is a PROVEEDOR. Attempting to find associated Proveedor document.');
                const proveedor = await Proveedor.findOne({ userId: user._id }).lean();
                if (proveedor) {
                  logger.info('Associated Proveedor found:', proveedor._id);
>>>>>>> c32cb53 (primer commit)
                  sessionUser.isSupplier = true;
                  sessionUser.proveedorId = proveedor._id.toString();
                  // Optionally, update name/image from supplier if preferred for supplier role
                  sessionUser.name = proveedor.nombreEmpresa;
                  sessionUser.image = "/img/proveedores/IMAGEN-SOLICITUD-PROVEEDOR.jpg";
                } else {
                  logger.warn('User has PROVEEDOR role but no associated Proveedor document found.');
                }
              }
              return sessionUser;
            } else {
              logger.warn('Password invalid for user:', credentials.email);
              return null; // Return null for invalid password
            }
          } else {
            logger.warn('User not found with email:', credentials.email);
            return null; // Return null for user not found
          }

        } catch (error) {
          logger.error("Auth error in authorize callback:", error);
          return null; // Return null for any other errors
        }
      },
    }),
  ],
  pages: {
    signIn: "/login", // Specify your custom login page
  },
    callbacks: {
      async jwt({ token, user }) {
<<<<<<< HEAD
=======
        // console.log("[NextAuth Callback] JWT - Initial Token:", token);
        // console.log("[NextAuth Callback] JWT - User:", user);
>>>>>>> c32cb53 (primer commit)
        if (user) {
          token.id = user.id;
          token.name = user.name;
          token.email = user.email; // Ensure email is passed to token
          token.rol = user.rol;
          token.isSupplier = user.isSupplier;
          token.proveedorId = user.proveedorId;
          token.image = user.image;
          token.numeroTelefono = user.numeroTelefono; // Pass numeroTelefono to token
        }
<<<<<<< HEAD
        return token;
      },
      async session({ session, token }) {
=======
        // console.log("[NextAuth Callback] JWT - Final Token:", token);
        return token;
      },
      async session({ session, token }) {
        // console.log("[NextAuth Callback] Session - Initial Session:", session);
        // console.log("[NextAuth Callback] Session - Token:", token);
>>>>>>> c32cb53 (primer commit)
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.rol = token.rol;
        session.user.isSupplier = token.isSupplier;
        session.user.proveedorId = token.proveedorId;
        session.user.image = token.image;
        session.user.numeroTelefono = token.numeroTelefono; // Pass numeroTelefono to session
<<<<<<< HEAD
=======
        // console.log("[NextAuth Callback] Session - Final Session:", session);
>>>>>>> c32cb53 (primer commit)
        return session;
      },
    },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

async function safeHandler(req, res) {
  try {
    return await handler(req, res);
  } catch (error) {
    logger.error("Unhandled error in NextAuth route:", error);
    // Return a JSON error response
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}

export { safeHandler as GET, safeHandler as POST };
