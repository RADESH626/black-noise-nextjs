//este archivo funciona como un service de java

import Papa from 'papaparse'; // Importar PapaParse
import bcrypt from "bcryptjs"; // Importa bcryptjs
import nodemailer from 'nodemailer'; // Importar Nodemailer
import connectDB from '@/utils/DBconection';
import Usuario from '@/models/Usuario';

// Función para enviar correos electrónicos
async function enviarCorreoElectronico(to, subject, html) {
    try {
        // Configura el transportador de Nodemailer
        // Reemplaza con tu configuración de SMTP y credenciales (idealmente desde variables de entorno)
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.example.com', // Servidor SMTP de tu proveedor
            port: parseInt(process.env.SMTP_PORT) || 587, // Puerto SMTP (587 para TLS, 465 para SSL)
            secure: (parseInt(process.env.SMTP_PORT) || 587) === 465, // true para puerto 465, false para otros puertos
            auth: {
                user: process.env.EMAIL_USER, // Tu dirección de correo
                pass: process.env.EMAIL_PASS, // Tu contraseña de correo o contraseña de aplicación
            },
        });

        const mailOptions = {
            from: `"Black Noise" <${process.env.EMAIL_USER}>`, // Dirección del remitente
            to: to, // Lista de destinatarios
            subject: subject, // Asunto del correo
            html: html, // Cuerpo del correo en HTML
        };

        // Envía el correo
        await transporter.sendMail(mailOptions);
        console.log(`Correo enviado exitosamente a: ${to}`);
        return { success: true, message: 'Correo enviado exitosamente' };
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        // Devuelve un objeto de error para que el llamador pueda manejarlo.
        return { error: `Error al enviar el correo: ${error.message}` };
    }
}

async function guardarUsuarios(data, enviarCorreo = false) { // Añadir parámetro enviarCorreo con valor por defecto

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
        if (enviarCorreo && UsuarioGuardado && !UsuarioGuardado.error && UsuarioGuardado.correo) {
            const asunto = 'Bienvenido/a a Black Noise';
            const contenidoHtml = `
                <h1>¡Hola ${UsuarioGuardado.primerNombre}!</h1>
                <p>Gracias por registrarte en Black Noise.</p>
                <p>Tu cuenta ha sido creada exitosamente.</p>
                <p>Usuario: ${UsuarioGuardado.correo}</p>
                <p>¡Esperamos que disfrutes de nuestra plataforma!</p>
                <br>
                <p>Atentamente,</p>
                <p>El equipo de Black Noise</p>
            `;
            // Llama a la función de envío de correo
            const resultadoEnvioCorreo = await enviarCorreoElectronico(UsuarioGuardado.correo, asunto, contenidoHtml);
            if (resultadoEnvioCorreo.error) {
                console.error("Error al enviar correo de bienvenida:", resultadoEnvioCorreo.error);
                // Podrías querer manejar este error de alguna manera, aunque el usuario ya fue guardado.
            }
        }
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

        connectDB()

        const data = {usuarios:await Usuario.find({})}

        // console.log('Resultado de la busqueda', data);

        if (data.error) { // Asumiendo que tu API devuelve un campo 'error'
            console.error('Error al encontrar el usuario ', user.error);
            // Considera cómo quieres manejar los errores aquí.
            // Podrías lanzar un error o devolver un objeto de error específico.
            throw new Error(user.error);
        }

        return data;

    } catch (error) {
        console.error('Error al encontrar el usuario:', error.message);
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
        nombreUsuario: formData.get('primerNombre'),
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

    guardarUsuarios(data, true); // Enviar correo al registrar un solo usuario
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
                const resultado = await guardarUsuarios(usuario, false); // No enviar correo en registro masivo
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

async function buscarUsuarios(formData) {
    "use server"

    const textoBusqueda = formData.get('textoBusqueda');
    const rol = formData.get('rol');
    const genero = formData.get('generoFiltro');
    const tipoDocumento = formData.get('tipoDocumentoFiltro');
    const edad = formData.get('edadFiltro');
    const incluirDeshabilitados = formData.get('incluirDeshabilitados') === 'on'; // Checkbox value is 'on' when checked

    console.log("Buscando usuarios con los siguientes filtros:");

    if (textoBusqueda) console.log(`Texto Busqueda: ${textoBusqueda}`);

    if (rol) console.log(`Rol: ${rol}`);

    if (genero) console.log(`Genero: ${genero}`);

    if (tipoDocumento) console.log(`Tipo Documento: ${tipoDocumento}`);

    if (edad) console.log(`Edad: ${edad}`);

    console.log(`Incluir Deshabilitados: ${incluirDeshabilitados}`);


    // Aquí irá la lógica para construir la consulta a la base de datos
    // y obtener los usuarios según los filtros.
    // Ejemplo:

    await connectDB();

    const query = {};

    if (textoBusqueda) {

        query.$or = [
            { primerNombre: { $regex: textoBusqueda, $options: 'i' } },
            { primerApellido: { $regex: textoBusqueda, $options: 'i' } },
            { correo: { $regex: textoBusqueda, $options: 'i' } },
        ];

    }

    if (rol) query.rol = rol;

    if (genero) query.genero = genero;

    if (tipoDocumento) query.tipoDocumento = tipoDocumento;

    if (edad) { /* Lógica para filtrar por edad, puede requerir conversión a número y rangos */ }

    if (!incluirDeshabilitados) query.habilitado = 'true'; // Asumiendo que tienes un campo 'estado'

    console.log("Consulta a la base de datos:", query);

    const usuariosEncontrados = await Usuario.find(query);

    console.log("Usuarios encontrados:", usuariosEncontrados);

    return { data: usuariosEncontrados, message: "Búsqueda completada." };

    // Simulación de una respuesta (deberás reemplazar esto con tu lógica de base de datos)
    return { data: [], message: "Búsqueda simulada completada. Implementar lógica de BD." };
}

export { RegistrarUsuario, ObtenerUsuarioPorId, ObtenerUsuarioPorCorreo, RegistroMasivoUsuario, buscarUsuarios, obtenerUsuarios };
