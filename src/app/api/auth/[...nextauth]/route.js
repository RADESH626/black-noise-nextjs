import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { ObtenerUsuarioPorCorreo } from "@/app/acciones/UsuariosActions";

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
        try {
          const user = await ObtenerUsuarioPorCorreo(credentials.email);
          
          if (!user) {
            return null;
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isValid) {
            return null;
          }

          return {
            id: user._id.toString(),
            name: user.primerNombre + ' ' + user.primerApellido,
            email: user.correo,
            image: user.fotoPerfil || "/img/perfil/FotoPerfil.webp",
            rol: user.rol || "CLIENTE"
          };
        } catch (error) {
          console.error("Auth error:", error);
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
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.rol = token.rol;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
