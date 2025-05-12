//este archivo es el "controlador" de autenticacion y creacion de sesiones 

import { ObtenerUsuarioPorCorreo } from "@/app/acciones/UsuariosActions";
import NextAuth from "next-auth"
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials"

// 'authOptions' es el objeto de configuración principal para NextAuth.
// Aquí defines cómo funcionará la autenticación en tu aplicación.
export const authOptions = {


    // 'providers' es un array donde configuras los diferentes métodos de inicio de sesión
    // que tu aplicación soportará (por ejemplo, Google, GitHub, Apple, o credenciales).
    providers: [

        // Aquí configuramos el proveedor de credenciales.
        CredentialsProvider({

            // 'name': Un nombre para este proveedor. Puede mostrarse en páginas de inicio de sesión genéricas.

            name: "Credentials",
            // 'credentials': Define los campos que tu formulario de inicio de sesión enviará.

            // NextAuth puede usar esto para generar un formulario de inicio de sesión básico si no tienes uno personalizado.

            credentials: {

                correo: { type: "email" },

                password: { type: "password" }

            },

            // 'authorize': Esta es la función MÁS IMPORTANTE para el proveedor de credenciales.
            // Se ejecuta cuando un usuario intenta iniciar sesión con este proveedor.
            // Recibe las 'credentials' enviadas desde el formulario y el objeto 'req' (la solicitud HTTP).
            async authorize(credentials, req) {

                //validamos que las credenciales no sean nulas 
                if (!credentials || !credentials.correo || !credentials.password) {
                    return null;
                }

                // se obtiene el usuario por correo
                const user = await ObtenerUsuarioPorCorreo(credentials.correo);

                //si el usuario no existe, se retorna null
                if (!user) {
                    return null;
                }

                // Verificamos la contraseña del usuario que existe 
                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                if (isPasswordValid) {
                    // Si la contraseña es correcta, devolvemos el objeto 'user'.
                    return user;
                }
                return null;
                                
            }
        })

    ],

    // 'session': Configuración de cómo se manejan las sesiones.
    session: {
        // 'strategy': Define la estrategia de sesión.
        // "jwt": Usa JSON Web Tokens. La sesión se almacena en un token en el cliente. No requiere base de datos para sesiones.
        // "database": La sesión se almacena en una base de datos. Requiere un adaptador de base de datos.
        strategy: "jwt",
    },

    // 'pages': Permite especificar rutas para páginas personalizadas de autenticación.
    pages: {
        // 'signIn': La ruta a tu página de inicio de sesión personalizada.
        // Si el usuario necesita iniciar sesión, será redirigido aquí.
        signIn: '/login'
        // 'error': La ruta a una página personalizada para mostrar errores de autenticación
        // (por ejemplo, credenciales incorrectas).
        
    },

    // 'callbacks': Son funciones que te permiten controlar el comportamiento de NextAuth
    // en ciertos puntos del flujo de autenticación.
    callbacks: {
        // 'jwt': Este callback se ejecuta cada vez que se crea o actualiza un JWT.
        // Ocurre después de que 'authorize' devuelve un usuario (al iniciar sesión)
        // y también cuando se accede a una sesión existente.
        // 'token' es el contenido actual del JWT.
        // 'user' es el objeto devuelto por 'authorize' (solo disponible durante el inicio de sesión).
        async jwt({ token, user }) {
            // Si el objeto 'user' existe, significa que el usuario acaba de iniciar sesión.
            if (user) {

                
                // Añadimos propiedades del objeto 'user' al 'token' JWT.
                token.id = user.id;   // Añade el ID del usuario al token.
                token.role = user.rol; // Añade el rol del usuario al token.
                token.name = user.primerNombre; // Añade el nombre del usuario al token.
                token.email = user.correo; // Añade el correo del usuario al token.
                // Puedes añadir más propiedades si lo necesitas.


            }
            // Devuelve el token (modificado o no). Este token será encriptado y almacenado en una cookie.
            return token;
        },
        // 'session': Este callback se ejecuta cada vez que se accede a una sesión
        // (por ejemplo, usando `useSession()` en el cliente o `getServerSession()` en el servidor).
        // 'session' es el objeto de sesión que se enviará al cliente.
        // 'token' es el JWT decodificado (el mismo que manipulaste en el callback 'jwt').
        async session({ session, token }) {
            // Queremos que la información que añadimos al 'token' (como id y role)
            // esté disponible en el objeto 'session.user' en el cliente.
            if (token && session.user) { // Asegurarse de que 'token' y 'session.user' existen.
                session.user.id = token.id;   // Asigna el 'id' del token a 'session.user.id'.
                session.user.role = token.role; // Asigna el 'role' del token a 'session.user.role'.
                // 'session.user.name' y 'session.user.email' suelen ser poblados automáticamente por NextAuth
                // si están presentes en el objeto 'user' original de 'authorize' y en el 'token'.
            }
            // Devuelve el objeto de sesión modificado.
            return session;
        }
    }
    // COMENTARIO: El 'secret' (NEXTAUTH_SECRET en tu archivo .env.local) se usa internamente
    // por NextAuth para firmar los JWTs, encriptar cookies, etc. No necesitas especificarlo aquí
    // si está en las variables de entorno.
};

// Inicializa NextAuth con las 'authOptions' que acabamos de definir.
// Esto crea los manejadores de ruta (endpoints) para la autenticación (ej. /api/auth/signin, /api/auth/callback, etc.).
const handler = NextAuth(authOptions);

// Exporta los manejadores para las solicitudes GET y POST.
// Esto permite que Next.js dirija las solicitudes a /api/auth/* a NextAuth.
export { handler as GET, handler as POST };

