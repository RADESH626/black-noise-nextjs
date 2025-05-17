//este archivo funciona como un service de java

"use server"

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
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
        console.error('Error en la función guardarUsuarios:', error.message);
        // Manejo de errores de red o errores del servidor que no devuelven JSON con 'error'
        // Devuelve un objeto de error para que el llamador pueda manejarlo.
        return { error: 'Error al conectar con la API para registrar el usuario' };
    }
}

//obtener usuarios de la base de datos
async function obtenerUsuarios() {
    try {
        connectDB();
        const data = { usuarios: await Usuario.find({}) };
        if (data.error) {
            console.error('Error al encontrar el usuario ', user.error);
            throw new Error(user.error);
        }
        return data;
    } catch (error) {
        console.error('Error al encontrar el usuario:', error.message);
    }
}
async function obtenerUsuariosHabilitados() {
    try {
        connectDB();
        const data = { usuarios: await Usuario.find({ habilitado: true }).lean() };

        if (data.error) {
            console.error('Error al encontrar el usuario ', data.error);
            throw new Error(data.error);
        }
        // console.log("Datos retornados por ObtenerTodosLosUsuarios:", data.usuarios); // Log para depuración
        return data.usuarios;

    } catch (error) {
        console.error('Error al encontrar el usuario:', error.message);
    }
}
async function ObtenerUsuarioPorId(id) {
    try {
        connectDB();
        console.log('id:', id);
        const response = await Usuario.findById(id);
        if (!response) {
            console.log('Error al encontrar el usuario', result.error);
        }
        return response;
    } catch (error) {
        console.log('Error al encontrar el usuario:', error.message);
    }
}
async function ObtenerUsuarioPorCorreo(email) {
    try {
        connectDB();
        const user = await Usuario.findOne({ correo: email });
        console.log('Resultado de la API con Axios:', user);
        if (user.error) {
            console.error('Error al encontrar el usuario con Axios:', user.error);
            throw new Error(user.error);
        }
        return user;
    } catch (error) {
        console.error('Error al encontrar el usuario:', error.message);
    }
}
async function RegistrarUsuario(formData) {
    const data = {
        // Obtener los datos del formulario
        tipoDocumento: formData.get('tipoDocumento'),
        numeroDocumento: formData.get('numeroDocumento'),
        primerNombre: formData.get('primerNombre'),
        nombreUsuario: formData.get('primerNombre'), // Asignar primerNombre a nombreUsuario
        segundoNombre: formData.get('segundoNombre'),
        primerApellido: formData.get('primerApellido'),
        segundoApellido: formData.get('segundoApellido'),
        fechaNacimiento: formData.get('fechaNacimiento'),
        genero: formData.get('genero'),
        numeroTelefono: formData.get('numeroTelefono'),
        direccion: formData.get('direccion'),
        correo: formData.get('correo'),
        password: formData.get('password'),
        rol: 'cliente', // Asignar rol de cliente por defecto
        habilitado: true // Asegurar que el usuario está habilitado por defecto
    }

    console.log('data:', data);

    //hasheamos la contraseña

    const hashedPassword = await bcrypt.hash(data.password, 10);

    data.password = hashedPassword;

    console.log('contraseña hassheada:', hashedPassword);

    // Guardar el usuario en la base de datos(con la contraseña hasheada)

    const resultado = await guardarUsuarios(data, true); // Enviar correo al registrar un solo usuario

    // Verificar si el usuario fue guardado exitosamente y es un cliente
    if (resultado.success && resultado.data.rol === 'cliente') {
        redirect('/'); // Redirigir a index si es cliente
    } else {
        redirect('/login'); // Mantener la redirección a login para otros roles
    }
}

async function RegistroMasivoUsuario(formData, userId) {

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

            // Obtener el usuario que realizó la carga masiva
            connectDB();
            const user = await Usuario.findById(userId);

            // Verificar si el usuario es un administrador
            if (user && user.rol === 'admin') {
                redirect('/admin/usuarios');
            } else {
                redirect('/login');
            }
        }
    } catch (error) {
        console.error("Error general al usar PapaParse:", error);
    }

}

async function FiltrarUsuarios(formData) {

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

    const usuariosEncontradosRaw = await Usuario.find(query).lean(); // Use .lean() here too

    // Manually convert to plain objects with string IDs and dates
    const usuariosEncontrados = usuariosEncontradosRaw.map(user => {
        const plainUser = { ...user };
        if (plainUser._id) {
            plainUser._id = plainUser._id.toString();
        }
        if (plainUser.fechaNacimiento && typeof plainUser.fechaNacimiento !== 'string') {
             if (plainUser.fechaNacimiento instanceof Date) {
                plainUser.fechaNacimiento = plainUser.fechaNacimiento.toISOString().split('T')[0];
             } else {
                try {
                    plainUser.fechaNacimiento = new Date(plainUser.fechaNacimiento).toISOString().split('T')[0];
                } catch (e) {
                    plainUser.fechaNacimiento = null; 
                }
             }
        }
        if (plainUser.createdAt instanceof Date) {
            plainUser.createdAt = plainUser.createdAt.toISOString();
        }
        if (plainUser.updatedAt instanceof Date) {
            plainUser.updatedAt = plainUser.updatedAt.toISOString();
        }
        return plainUser;
    });

    console.log("Usuarios encontrados (plain):", usuariosEncontrados);

    return { data: usuariosEncontrados, message: "Búsqueda completada." };

    // Simulación de una respuesta (deberás reemplazar esto con tu lógica de base de datos)
    return { data: [], message: "Búsqueda simulada completada." };
}

async function DeshabilitarUsuario(formData) {

    const id = formData.get('id');

    console.log('Intentando deshabilitar usuario con id:', id);

    if (!id) {
        console.error('Error: ID de usuario no proporcionado para deshabilitar.');

        return { error: 'ID de usuario no proporcionado.' };
    }

    try {

        await connectDB();
        
        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            id,
            { habilitado: false },
            { new: true } // Devuelve el documento modificado
        );

        if (!usuarioActualizado) {
            console.error(`Error: No se encontró ningún usuario con el ID ${id} para deshabilitar.`);
            return { error: `No se encontró ningún usuario con el ID ${id}.` };
        }

        console.log('Usuario deshabilitado exitosamente:', usuarioActualizado);
        revalidatePath('/admin/usuarios'); // Revalida la página de usuarios para reflejar el cambio
        return { success: true, message: 'Usuario deshabilitado exitosamente.', data: JSON.parse(JSON.stringify(usuarioActualizado)) };

    } catch (error) {
        console.error(`Error al deshabilitar el usuario con ID ${id}:`, error.message);
        // Considera si quieres devolver un mensaje de error más genérico al cliente
        return { error: `Error al procesar la solicitud: ${error.message}` };
    }
}

async function HabilitarUsuario(formData) {
    const id = formData.get('id');
    console.log('Intentando habilitar usuario con id:', id);

    if (!id) {
        console.error('Error: ID de usuario no proporcionado para habilitar.');
        return { error: 'ID de usuario no proporcionado.' };
    }

    try {
        await connectDB();
        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            id,
            { habilitado: true }, // Set habilitado to true
            { new: true } // Devuelve el documento modificado
        );

        if (!usuarioActualizado) {
            console.error(`Error: No se encontró ningún usuario con el ID ${id} para habilitar.`);
            return { error: `No se encontró ningún usuario con el ID ${id}.` };
        }

        console.log('Usuario habilitado exitosamente:', usuarioActualizado);
        revalidatePath('/admin/usuarios'); // Revalida la página de usuarios para reflejar el cambio
        return { success: true, message: 'Usuario habilitado exitosamente.', data: JSON.parse(JSON.stringify(usuarioActualizado)) };

    } catch (error) {
        console.error(`Error al habilitar el usuario con ID ${id}:`, error.message);
        return { error: `Error al procesar la solicitud: ${error.message}` };
    }
}

async function EditarUsuario(formData) {

    const id = formData.get('id');

    //

    console.log('id:', id);

    try {

        connectDB()

        const usuario = await Usuario.findByIdAndUpdate(id, { habilitado: false });

        console.log('Resultado del cambio:', usuario);

        if (usuario.error) { // Asumiendo que tu API devuelve un campo 'error'
            console.error('Error al encontrar el usuario con Axios:', usuario.error);
            // Considera cómo quieres manejar los errores aquí.
            // Podrías lanzar un error o devolver un objeto de error específico.
            throw new Error(usuario.error);
        }

        return usuario;

    } catch (error) {
        console.error('Error al encontrar el usuario:', error.message);
    }

    
}

async function ObtenerTodosLosUsuarios() {
    try {
        connectDB();
        const data = { usuarios: await Usuario.find({}).lean() };

        if (data.error) {
            console.error('Error al encontrar el usuario ', data.error);
            throw new Error(data.error);
        }

        // Manually convert to plain objects with string IDs and dates
        const plainUsers = data.usuarios.map(user => {
            const plainUser = { ...user }; // Create a shallow copy from the lean object
            if (plainUser._id) {
                plainUser._id = plainUser._id.toString();
            }
            // Ensure fechaNacimiento is handled correctly, it might already be a string or null
            if (plainUser.fechaNacimiento && typeof plainUser.fechaNacimiento !== 'string') {
                 if (plainUser.fechaNacimiento instanceof Date) {
                    plainUser.fechaNacimiento = plainUser.fechaNacimiento.toISOString().split('T')[0]; // Format as YYYY-MM-DD
                 } else {
                    // If it's an object but not a Date (e.g., from bad data), try to convert or nullify
                    try {
                        plainUser.fechaNacimiento = new Date(plainUser.fechaNacimiento).toISOString().split('T')[0];
                    } catch (e) {
                        plainUser.fechaNacimiento = null; // Or handle as an error
                    }
                 }
            }
            if (plainUser.createdAt instanceof Date) {
                plainUser.createdAt = plainUser.createdAt.toISOString();
            }
            if (plainUser.updatedAt instanceof Date) {
                plainUser.updatedAt = plainUser.updatedAt.toISOString();
            }
            // Add any other date fields you might have
            return plainUser;
        });
        
        // console.log("Datos retornados por ObtenerTodosLosUsuarios (plain):", plainUsers); // Log para depuración
        return plainUsers;

    } catch (error) {
        console.error('Error al encontrar el usuario:', error.message);
    }
}

export {
    RegistrarUsuario,
    obtenerUsuarios,
    RegistroMasivoUsuario,
    ObtenerUsuarioPorId,
    ObtenerUsuarioPorCorreo,
    FiltrarUsuarios,
    DeshabilitarUsuario,
    HabilitarUsuario, // Add the new action
    EditarUsuario,
    obtenerUsuariosHabilitados,
    ObtenerTodosLosUsuarios
};
