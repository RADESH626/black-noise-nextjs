//este archivo funciona como un service de java

import Papa from 'papaparse'; // Importar PapaParse
import bcrypt from "bcryptjs"; // Importa bcryptjs
import connectDB from '@/utils/DBconection';
import Usuario from '@/models/Usuario';

async function guardarUsuarios(data) {

    try {

        console.log('datos de usuario obtenidos:', data);

        connectDB();

        const NuevoUsuario = new Usuario(data);

        console.log('usuario para guardar en la base de datos:', NuevoUsuario);

        const UsuarioGuardado = await NuevoUsuario.save();

        console.log('Usuario guardado en la base de datos:', UsuarioGuardado);


        if (UsuarioGuardado.error) { // Asumiendo que tu API devuelve un campo 'error'
            console.error('Error al registrar el usuario en la base de datos:', UsuarioGuardado.error);
            return { error: 'Error al registrar el usuario en la base de datos' };
        }

        // Si no hay error, puedes devolver los datos o un mensaje de éxito
        return { success: true, data: UsuarioGuardado };
        

    } catch (error) {
        console.error('Error en la petición Axios para registrar el usuario:', error.message);
        // Manejo de errores de red o errores del servidor que no devuelven JSON con 'error'
        // Devuelve un objeto de error para que el llamador pueda manejarlo.
        return { error: 'Error al conectar con la API para registrar el usuario' };
    }
}

//obtener usuarios de la base de datos
async function obtenerUsuarios() {
    "use server"

    try {

        const response = await AxiosInstance.get('/usuarios');

        const result = response.data;

        // console.log('Resultado de la API con Axios:', result);

        if (result.error) { // Asumiendo que tu API devuelve un campo 'error'

            console.error('Error al obtener los usuarios con Axios:', result.error);

            // Considera cómo quieres manejar los errores aquí.

            // Podrías lanzar un error o devolver un objeto de error específico.

            // Para Server Actions, devolver un objeto con una propiedad 'error' es común.

            return { error: 'Error al obtener los usuarios' };

        }

        // Si no hay error, puedes devolver los datos o un mensaje de éxito
        return { data: result.usuarios };

    } catch (error) {

        console.error('Error en la petición Axios para obtener los usuarios:', error);

        // Manejo de errores de red o errores del servidor que no devuelven JSON con 'error'

        // Devuelve un objeto de error para que el llamador pueda manejarlo.

        return { error: 'Error al conectar con la API para obtener los usuarios' };

    }
}

async function RegistrarUsuario(formData) {

    "use server"

    const data = {
        // Obtener los datos del formulario
        tipoDocumento: formData.get('tipoDocumento'),
        numeroDocumento: formData.get('numeroDocumento'),
        primerNombre: formData.get('primerNombre'),
        segundoNombre: formData.get('segundoNombre'),
        primerApellido: formData.get('primerApellido'),
        segundoApellido: formData.get('segundoApellido'),
        fechaNacimiento: formData.get('fechaNacimiento'),
        genero: formData.get('genero'),
        numeroTelefono: formData.get('numeroTelefono'),
        direccion: formData.get('direccion'),
        correo: formData.get('correo'),
        password: formData.get('password')
    }

    console.log('data:', data);

    //hasheamos la contraseña

    const hashedPassword = await bcrypt.hash(data.password, 10);

    data.password = hashedPassword;

    console.log('contraseña hassheada:', hashedPassword);

    // Guardar el usuario en la base de datos(con la contraseña hasheada)

    guardarUsuarios(data);
}

async function RegistroMasivoUsuario(formData) {
    "use server"

    const file = formData.get('file');

    if (!file) {
        return { error: 'No se ha subido ningún archivo' };
    }

    // Leer el archivo como texto (asumiendo que es un archivo CSV o similar)
    const buffer = await file.arrayBuffer();

    const text = new TextDecoder().decode(buffer);

    try {
        const resultadoParseo = Papa.parse(text, {
            header: true,         // La primera fila son los encabezados
            skipEmptyLines: true, // Omite líneas vacías
            transformHeader: header => header.trim(),
            transform: value => typeof value === 'string' ? value.trim() : value,
        });

        if (resultadoParseo.errors.length > 0) {
            console.error("Errores al parsear CSV:", resultadoParseo.errors);
        } else {
            const usuarios = resultadoParseo.data;

            console.log("usuarios:", usuarios);

            usuarios.forEach(async (usuario) => {
                // Aquí puedes llamar a la función para guardar cada usuario
                const resultado = await guardarUsuarios(usuario);
                console.log('Resultado de la API con Axios:', resultado);
            });
        }
    } catch (error) {
        console.error("Error general al usar PapaParse:", error);
    }

}

async function ObtenerUsuarioPorId(id) {

    try {

        console.log('id:', id);

        const response = await AxiosInstance.get(`/usuarios/${id}`);

        const result = response.data;

        console.log('Resultado de la API con Axios:', result);

        if (result.error) { // Asumiendo que tu API devuelve un campo 'error'
            console.error('Error al encontrar el usuario con Axios:', result.error);
            // Considera cómo quieres manejar los errores aquí.
            // Podrías lanzar un error o devolver un objeto de error específico.
            throw new Error(result.error);
        }

        return result;

    } catch (error) {
        console.error('Error en la petición Axios para encontrar el usuario:', error.message);
        // Manejo de errores de red o errores del servidor que no devuelven JSON con 'error'
        // Lanza el error para que el llamador pueda manejarlo o devuelve un objeto de error.
        throw new Error('Error al conectar con la API para encontrar el usuario');
    }
}

async function ObtenerUsuarioPorCorreo(email) {

    try {

        connectDB()

        const user = await Usuario.findOne({ correo: email });


        console.log('Resultado de la API con Axios:', user);

        if (user.error) { // Asumiendo que tu API devuelve un campo 'error'
            console.error('Error al encontrar el usuario con Axios:', user.error);
            // Considera cómo quieres manejar los errores aquí.
            // Podrías lanzar un error o devolver un objeto de error específico.
            throw new Error(user.error);
        }

        return user;

    } catch (error) {
        console.error('Error al encontrar el usuario:', error.message);
    }

}
export { RegistrarUsuario, ObtenerUsuarioPorId, ObtenerUsuarioPorCorreo, RegistroMasivoUsuario };


