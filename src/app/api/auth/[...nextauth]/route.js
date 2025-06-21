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
                const proveedor = await Proveedor.findOne({ userId: user._id }).lean();
                if (proveedor) {
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
        return token;
      },
      async session({ session, token }) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.rol = token.rol;
        session.user.isSupplier = token.isSupplier;
        session.user.proveedorId = token.proveedorId;
        session.user.image = token.image;
        session.user.numeroTelefono = token.numeroTelefono; // Pass numeroTelefono to session
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
