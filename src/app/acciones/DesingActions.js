import axios from 'axios'; // Importar Axios
import Papa from 'papaparse'; // Importar PapaParse


const AxiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api',
});

async function guardarDesings(data) {
    try {

        // peticion tipo post a la api de diseños para guardar el diseño en la base de datos
        const response = await AxiosInstance.post('/disenos', data);

        const result = response.data;

        console.log('Resultado de la API con Axios:', result);

        if (result.error) { // Asumiendo que tu API devuelve un campo 'error'
            console.error('Error al registrar el diseño con Axios:', result.error);
            // Considera cómo quieres manejar los errores aquí.
            // Podrías lanzar un error o devolver un objeto de error específico.
            // Para Server Actions, devolver un objeto con una propiedad 'error' es común.
            return { error: 'Error al registrar el diseño' };
        }
        // Si no hay error, puedes devolver los datos o un mensaje de éxito
        return { success: true, data: result };

    } catch (error) {
        console.error('Error en la petición Axios para registrar el diseño:', error.message);
        // Manejo de errores de red o errores del servidor que no devuelven JSON con 'error'
        // Devuelve un objeto de error para que el llamador pueda manejarlo.
        return { error: 'Error al conectar con la API para registrar el diseño' };
    }
}

//obtener diseños de la base de datos
async function obtenerDesings() {
    "use server"
    try {

        const response = await AxiosInstance.get('/disenos');

        const result = response.data;

        console.log('Resultado de la API con Axios:', result);

        if (result.error) { // Asumiendo que tu API devuelve un campo 'error'

            console.error('Error al obtener los diseños con Axios:', result.error);

            // Considera cómo quieres manejar los errores aquí.

            // Podrías lanzar un error o devolver un objeto de error específico.

            // Para Server Actions, devolver un objeto con una propiedad 'error' es común.

            return { error: 'Error al obtener los diseños' };

        }

        // Si no hay error, puedes devolver los datos o un mensaje de éxito
        return { data: result.disenos };

    } catch (error) {

        console.error('Error en la petición Axios para obtener los diseños:', error);

        // Manejo de errores de red o errores del servidor que no devuelven JSON con 'error'

        // Devuelve un objeto de error para que el llamador pueda manejarlo.

        return { error: 'Error al conectar con la API para obtener los diseños' };

    }
}

async function RegistrarDesing(formData) {
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

async function RegistroMasivoDesings(formData) {
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
            const diseños = resultadoParseo.data;

            console.log("diseños:", diseños);

            diseños.forEach(async (diseño) => {
                // Aquí puedes llamar a la función para guardar cada diseño
                const resultado = await guardarDesings(diseño);
                console.log('Resultado de la API con Axios:', resultado);
            });
        }
    } catch (error) {
        console.error("Error general al usar PapaParse:", error);
    }

}

async function encontrarDesingsPorId(id) {
    try {
        const response = await axios.get(`http://localhost:3000/api/disenos/${id}`);
        const result = response.data;

        console.log('Resultado de la API con Axios:', result);

        if (result.error) { // Asumiendo que tu API devuelve un campo 'error'
            console.error('Error al encontrar el diseño con Axios:', result.error);
            // Considera cómo quieres manejar los errores aquí.
            // Podrías lanzar un error o devolver un objeto de error específico.
            throw new Error(result.error);
        }

        return result;
    } catch (error) {
        console.error('Error en la petición Axios para encontrar el diseño:', error.message);
        // Manejo de errores de red o errores del servidor que no devuelven JSON con 'error'
        // Lanza el error para que el llamador pueda manejarlo o devuelve un objeto de error.
        throw new Error('Error al conectar con la API para encontrar el diseño');
    }
}



export { guardarDesings, obtenerDesings, RegistrarDesing, RegistroMasivoDesings,encontrarDesingsPorId };



