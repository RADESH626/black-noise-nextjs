
import axios from 'axios'; // Importar Axios
import usuarios from '../admin/usuarios/page';

const AxiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api',
});

async function guardarUsuarios(data) {
    try {

        // peticion tipo post a la api de usuarios para guardar el usuario en la base de datos
        const response = await AxiosInstance.post('/usuarios', data);

        const result = response.data;

        console.log('Resultado de la API con Axios:', result);

        if (result.error) { // Asumiendo que tu API devuelve un campo 'error'
            console.error('Error al registrar el usuario con Axios:', result.error);
            // Considera cómo quieres manejar los errores aquí.
            // Podrías lanzar un error o devolver un objeto de error específico.
            // Para Server Actions, devolver un objeto con una propiedad 'error' es común.
            return { error: 'Error al registrar el usuario' };
        }
        // Si no hay error, puedes devolver los datos o un mensaje de éxito
        return { success: true, data: result };

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

        console.log('Resultado de la API con Axios:', result);

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

    //se define la variable genero y se le asigna el valor del formulario
    var genero = formData.get('genero');

    if (genero === null || genero === '') {
        genero = 'OTRO';
    }


    const data = {
        // Obtener los datos del formulario
        tipoDocumento: formData.get('tipoDocumento'),
        numeroDocumento: formData.get('numeroDocumento'),
        primerNombre: formData.get('primerNombre'),
        segundoNombre: formData.get('segundoNombre'),
        primerApellido: formData.get('primerApellido'),
        segundoApellido: formData.get('segundoApellido'),
        fechaNacimiento: formData.get('fechaNacimiento'),
        genero,
        numeroTelefono: formData.get('numeroTelefono'),
        direccion: formData.get('direccion'),
        correo: formData.get('correo'),
        password: formData.get('password')
    }

    console.log('data:', data);

    guardarUsuarios(data);
}

async function RegistroMasivoUsuario(formData) {
    "use server"

    console.log('formData:', formData);

    const file = formData.get('file');

    if (!file) {
        return { error: 'No se ha subido ningún archivo' };
    }

    // Leer el archivo como texto (asumiendo que es un archivo CSV o similar)
    const buffer = await file.arrayBuffer();
    const text = new TextDecoder().decode(buffer);

    // Aquí puedes procesar el texto, por ejemplo, parsear CSV o JSON
    // Ejemplo simple: dividir por líneas
    const lineas = text.split('\n');

    // Procesar cada línea según tu formato de datos
    // Por ejemplo, podrías mapear a objetos de usuario si es un CSV
    // const usuarios = lineas.map(linea => { ... });

    // Luego puedes enviar los usuarios a la API o hacer el procesamiento necesario

    console.log('file:', file);

    try {

        // peticion tipo post a la api de usuarios para guardar el usuario en la base de datos
        const response = await AxiosInstance.post('/usuarios', data);

        const result = response.data;

        console.log('Resultado de la API con Axios:', result);

        if (result.error) { // Asumiendo que tu API devuelve un campo 'error'
            console.error('Error al registrar el usuario con Axios:', result.error);
            // Considera cómo quieres manejar los errores aquí.
            // Podrías lanzar un error o devolver un objeto de error específico.
            // Para Server Actions, devolver un objeto con una propiedad 'error' es común.
            return { error: 'Error al registrar el usuario' };
        }
        // Si no hay error, puedes devolver los datos o un mensaje de éxito
        return { success: true, data: result };

    } catch (error) {
        console.error('Error en la petición Axios para registrar el usuario:', error.message);
        // Manejo de errores de red o errores del servidor que no devuelven JSON con 'error'
        // Devuelve un objeto de error para que el llamador pueda manejarlo.
        return { error: 'Error al conectar con la API para registrar el usuario' };
    }
}





async function encontrarUsuarioPorId(id) {
    try {
        const response = await axios.get(`http://localhost:3000/api/usuarios/${id}`);
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

async function IniciarSesion(formData) {
    "use server"

    console.log('formData:', formData);

    //guardar los datos en un objeto para enviarlos a la api
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    };

    console.log('data:', data);

}

export { RegistrarUsuario, IniciarSesion, encontrarUsuarioPorId, obtenerUsuarios , RegistroMasivoUsuario };

//TODO: terminar de hacer el crud

