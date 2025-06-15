import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { ObtenerUsuarioPorCorreo } from "@/app/acciones/UsuariosActions";
import Proveedor from "@/models/Proveedor"; // Import Proveedor model
import connectDB from "@/utils/DBconection"; // Import connectDB
import logger from '@/utils/logger';

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
            logger.info('User found. Comparing password for user:', user.email);
            const isValid = await bcrypt.compare(credentials.password, user.password);
            logger.info('Password comparison result for user:', isValid);
            if (isValid) {
              logger.info('User authenticated successfully:', user.email);
              return {
                id: user._id.toString(),
                name: user.primerNombre + ' ' + user.primerApellido,
                email: user.correo,
                image: user.profileImageUrl, // Use the new profileImageUrl
                rol: user.rol || "CLIENTE",
                isSupplier: false // Explicitly mark as not a supplier
              };
            }
          }

          logger.info('User not found or password invalid. Attempting to authenticate as a supplier.');
          // If not a regular user or password invalid, attempt to authenticate as a supplier
          const proveedor = await Proveedor.findOne({ emailContacto: { $regex: new RegExp(`^${credentials.email.trim()}$`, 'i') } }).lean();
          logger.info('Result of Proveedor.findOne:', proveedor);

          if (proveedor) {
            logger.info('Supplier found. Comparing accessKey for supplier:', proveedor.emailContacto);
            const isValidAccessKey = await bcrypt.compare(credentials.password, proveedor.accessKey);
            if (isValidAccessKey) {
              logger.info('Supplier authenticated successfully:', proveedor.emailContacto);
              return {
                id: proveedor._id.toString(), // Use supplier's _id as the session ID
                name: proveedor.nombreEmpresa, // Use company name as user name
                email: proveedor.emailContacto,
                image: "/img/proveedores/IMAGEN-SOLICITUD-PROVEEDOR.jpg", // Default image for suppliers
                rol: null, // Suppliers don't have a 'rol' in Usuario model sense
                isSupplier: true, // Mark as supplier
                proveedorId: proveedor._id.toString() // Store supplier's actual ID
              };
            }
          }

          logger.info('Neither user nor supplier found/authenticated. Returning null.');
          // If neither user nor supplier found/authenticated
          return null;

        } catch (error) {
          logger.error("Auth error in authorize callback:", error);
          // Log the full error object for more details
          logger.error("Full error object:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
          return null;
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
        token.rol = user.rol;
        token.isSupplier = user.isSupplier;
        token.proveedorId = user.proveedorId;
        token.image = user.profileImageUrl; // Add image to token
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.rol = token.rol;
      session.user.isSupplier = token.isSupplier;
      session.user.proveedorId = token.proveedorId;
      session.user.image = token.image; // Add image to session
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
