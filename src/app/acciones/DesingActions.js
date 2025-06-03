import axios from 'axios'; // Importar Axios
import Papa from 'papaparse'; // Importar PapaParse


const AxiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api',
});

async function guardarDesings(data) {
    console.log('DEBUG: Entering guardarDesings with data:', data);
    try {
        console.log('DEBUG: Making POST request to /disenos with data:', data);
        // peticion tipo post a la api de diseños para guardar el diseño en la base de datos
        const response = await AxiosInstance.post('/disenos', data);
        console.log('DEBUG: Axios response received:', response);

        const result = response.data;

        console.log('DEBUG: Result from API:', result);

        if (result.error) { // Asumiendo que tu API devuelve un campo 'error'
            console.error('ERROR in guardarDesings (API returned error):', result.error);
            // Considera cómo quieres manejar los errores aquí.
            // Podrías lanzar un error o devolver un objeto de error específico.
            // Para Server Actions, devolver un objeto con una propiedad 'error' es común.
            return { error: 'Error al registrar el diseño' };
        }
        // Si no hay error, puedes devolver los datos o un mensaje de éxito
        console.log('DEBUG: Exiting guardarDesings with success data:', result);
        return { success: true, data: result };

    } catch (error) {
        console.error('ERROR in guardarDesings (Axios request failed):', error.message);
        // Manejo de errores de red o errores del servidor que no devuelven JSON con 'error'
        // Devuelve un objeto de error para que el llamador pueda manejarlo.
        return { error: 'Error al conectar con la API para registrar el diseño' };
    }
}

//obtener diseños de la base de datos
async function obtenerDesings() {
    console.log('DEBUG: Entering obtenerDesings.');
    "use server"
    try {
        console.log('DEBUG: Making GET request to /disenos.');
        const response = await AxiosInstance.get('/disenos');
        console.log('DEBUG: Axios response received:', response);

        const result = response.data;

        console.log('DEBUG: Result from API:', result);

        if (result.error) { // Asumiendo que tu API devuelve un campo 'error'
            console.error('ERROR in obtenerDesings (API returned error):', result.error);
            // Considera cómo quieres manejar los errores aquí.
            // Podrías lanzar un error o devolver un objeto de error específico.
            // Para Server Actions, devolver un objeto con una propiedad 'error' es común.
            return { error: 'Error al obtener los diseños' };
        }

        // Si no hay error, puedes devolver los datos o un mensaje de éxito
        console.log('DEBUG: Exiting obtenerDesings with success data:', result.disenos);
        return { data: result.disenos };

    } catch (error) {
        console.error('ERROR in obtenerDesings (Axios request failed):', error);
        // Manejo de errores de red o errores del servidor que no devuelven JSON con 'error'
        // Devuelve un objeto de error para que el llamador pueda manejarlo.
        return { error: 'Error al conectar con la API para obtener los diseños' };
    }
}

async function RegistrarDesing(formData) {
    console.log('DEBUG: Entering RegistrarDesing with formData:', formData);
    "use server"

    //se define la variable genero y se le asigna el valor del formulario
    var genero = formData.get('genero');
    console.log('DEBUG: Initial genero from formData:', genero);

    if (genero === null || genero === '') {
        genero = 'OTRO';
        console.log('DEBUG: Genero was null or empty, set to:', genero);
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

    console.log('DEBUG: Constructed data object:', data);

    // Assuming guardarUsuarios is imported or available in scope
    // This function call is outside the try-catch block, consider wrapping it if it can throw
    guardarUsuarios(data);
    console.log('DEBUG: Called guardarUsuarios with data.');
}

async function RegistroMasivoDesings(formData) {
    console.log('DEBUG: Entering RegistroMasivoDesings with formData:', formData);
    "use server"

    const file = formData.get('file');
    console.log('DEBUG: File from formData:', file);

    if (!file) {
        console.log('DEBUG: No file uploaded.');
        return { error: 'No se ha subido ningún archivo' };
    }

    // Leer el archivo como texto (asumiendo que es un archivo CSV o similar)
    const buffer = await file.arrayBuffer();
    console.log('DEBUG: File buffer obtained.');
    const text = new TextDecoder().decode(buffer);
    console.log('DEBUG: File content decoded to text (first 100 chars):', text.substring(0, 100));

    try {
        const resultadoParseo = Papa.parse(text, {
            header: true,         // La primera fila son los encabezados
            skipEmptyLines: true, // Omite líneas vacías
            transformHeader: header => header.trim(),
            transform: value => typeof value === 'string' ? value.trim() : value,
        });
        console.log('DEBUG: PapaParse result:', resultadoParseo);

        if (resultadoParseo.errors.length > 0) {
            console.error("ERROR in RegistroMasivoDesings (CSV parsing errors):", resultadoParseo.errors);
        } else {
            const diseños = resultadoParseo.data;

            console.log("DEBUG: Parsed designs:", diseños);

            for (const diseño of diseños) { // Use for...of for async/await in loop
                console.log('DEBUG: Processing design for saving:', diseño);
                // Aquí puedes llamar a la función para guardar cada diseño
                const resultado = await guardarDesings(diseño);
                console.log('DEBUG: Result of guardarDesings for current design:', resultado);
            }
            console.log('DEBUG: All designs processed for mass registration.');
        }
    } catch (error) {
        console.error("ERROR in RegistroMasivoDesings (general PapaParse error):", error);
    }
}

async function encontrarDesingsPorId(id) {
    console.log('DEBUG: Entering encontrarDesingsPorId with ID:', id);
    try {
        console.log(`DEBUG: Making GET request to /api/disenos/${id}`);
        const response = await axios.get(`http://localhost:3000/api/disenos/${id}`);
        console.log('DEBUG: Axios response received:', response);
        const result = response.data;

        console.log('DEBUG: Result from API:', result);

        if (result.error) { // Asumiendo que tu API devuelve un campo 'error'
            console.error('ERROR in encontrarDesingsPorId (API returned error):', result.error);
            // Considera cómo quieres manejar los errores aquí.
            // Podrías lanzar un error o devolver un objeto de error específico.
            throw new Error(result.error);
        }
        console.log('DEBUG: Exiting encontrarDesingsPorId with success data:', result);
        return result;
    } catch (error) {
        console.error('ERROR in encontrarDesingsPorId (Axios request failed):', error.message);
        // Manejo de errores de red o errores del servidor que no devuelven JSON con 'error'
        // Lanza el error para que el llamador pueda manejarlo o devuelve un objeto de error.
        throw new Error('Error al conectar con la API para encontrar el diseño');
    }
}



export { guardarDesings, obtenerDesings, RegistrarDesing, RegistroMasivoDesings,encontrarDesingsPorId };
