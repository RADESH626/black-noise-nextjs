//este archivo funciona como un service de java

"use server"

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Papa from 'papaparse'; // Importar PapaParse
import bcrypt from "bcryptjs"; // Importa bcryptjs
import nodemailer from 'nodemailer'; // Importar Nodemailer
import connectDB from '@/utils/DBconection';
import Usuario from '@/models/Usuario';
import { signIn } from "next-auth/react"; // Import signIn

const DEFAULT_PROFILE_PICTURE_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAKwAAACUCAMAAAA5xjIqAAAAMFBMVEXk5ueutLenrrHn6eqrsbTq7O3Lz9Hh4+S4vcDGyszT1tjP09Te4OKyuLvCx8nW2dvDGAcOAAAECUlEQVR4nO2c23LjIAxAbcTVBvP/f7vQZLNJx7SAsGTPcp4605czqpC4yJ2mwWAwGAwGg8FgMBgMBq+AUmDisizR5x+5dT4Dk4kuiAfSOm+mUworv25ByPkZKcK2mNPpqsmF+dX07jvbByfTdWLP9O4r9XmSAaY1fFbNiLCcxBYm+7PqV3DdKVIX4i9hvesGz28LukQ124p4Gdesu/LGtsY12ypWV1HhmqoCY2xhrYnrV2wjly3EStVEMEyy5vf6+h5ay+MKW71rSlvHkQgQW1xTbDmaAzSp8iQCuLbA5mpLLutDoytHaKta1ytiIXY1zYHN0HZdWOr67LfQ0vYxZTGBlRtpaA0msKnpekLXup3hDpRHMkBlQcoDR+eKKLJ3WUu3+UpnRJxs2iDQyWJTdqY8PDbvCx6R1WQrzDTtZF9k6SqtQRaDRKCTxa6vmXB74PGukk4Wm7KpHJAtsCE7ZKeLLbBLla5rNYWGS65XpKU72FxpI3OpLSIsSFfKzTf6WDNbQln0gXGnc73WUfxSlxyTwiUtYZWd8qPShS7mLnXliWpi9O+MiFIbiFVRDyCaXHaaWmUJL+UewNL4aMfy1tz2HEp8Rf+gZY1xPTQ3JQLfWI+q3s9Ixvmu2rQVdKeZPapsJcuswQOosSU8JX7SLe5kgv7p/t22bARJcq6tf4AvuPOQ2ykGJ3Piut053yfVoM8z8AvG/jDsO4uzhPWO8jbI3TFqGTbDOYK4B4B3dv4+oC5nq08wN/tOysqvgXohZCLP/odt8eY8yfoGpAjHVWu9Rn9izRtJFtSN/CO3zgeynfFxyVF1Ce30usTov37BLfcMgInOhqd19VQYgt3WU2QE5M9pVmfzovqhJaTVNm86si42NUW9vZWrx8bSbi7y+ILyLsy/tNn3BhHsQq2bKqqTZRF9Qwgb6T68SjFd7W5rLQ2wsC7SxFeZbf9jqirf2R5/1wF584p/Zr75xkOTASBunVQzwq7HbR3BbOi//wupmh2WDLqv6g17RHAhBtwLzQek0L11cwYcRcqFricJ8EdkwMO25+0HYEbnixC219mn6oqoERn6lAXAz22U2M493psgHpmuz7r4K0Yy1w4fX+FnNipAxrb1+ajVdkPYtnykiEK0vzsd2wp2aW4PNDXrO61Xzsf3gj2aeln7szcKGRpkATmz027rGhZZh7HTRuq3CZrNtf4rIfQAH8a28sFM8VSCO6LKFTzT6rpRN0ChONrBMxVnSOgwLo+iZv/VNv3Sk4r52g7T8khk+RfatLvYXdnynS17FiTb4sgyNoS/FI/bc21hnikttfivELpQJov7wr4Xsmw3o7g9bxQmLbfmjbKjY+P/h+lNWcddxCmwRbLmJJS4Dv5D/gBmFDnwIIZzJgAAAABJRU5ErkJggg==';

// Server Action para manejar el login
export async function loginAction(prevState, formData) {
  const email = formData.get('correo');
  const password = formData.get('password');

  console.log('Server Action Login: Iniciado.');
  console.log('Server Action Login: Datos recibidos.');

  // Perform basic server-side validation if needed
  if (!email || !password) {
    return { message: 'Por favor, ingresa correo y contraseña.', success: false };
  }

  // Return the credentials to the client for signIn
  return { email, password, message: null, success: false, readyForSignIn: true };
}

// Server Action para manejar la adición de un solo usuario (Admin)
export async function addSingleUserAction(prevState, formData) {
    console.log('Server Action Add Single User: Iniciado.');

    // RegistrarUsuario expects formData with password field named 'password'
    // Ensure the password field from the form (named 'contrasena') is correctly mapped
    const password = formData.get('contrasena');
    if (password) {
        formData.set('password', password); // Set the correct name for RegistrarUsuario
        formData.delete('contrasena'); // Remove the old name
    } else {
         // Handle case where password is missing if needed
         return { message: 'La contraseña es requerida.', success: false };
    }

    // Call the existing RegistrarUsuario function
    const result = await RegistrarUsuario(formData);

    // RegistrarUsuario already returns { success: true, data: ... } or { error: ... }
    // Map the result to the state structure expected by useActionState
    if (result.success) {
        // Revalidate path for admin user list after adding a user
        revalidatePath('/admin/usuarios');
        return { message: result.message || 'Usuario agregado exitosamente.', success: true, data: result.data };
    } else {
        return { message: result.error || 'Error al agregar el usuario.', success: false };
    }
}


// Función para guardar usuarios en la base de datos
async function guardarUsuarios(data, enviarCorreo = false) { // Añadir parámetro enviarCorreo con valor por defecto

    try {

        //aqui se asigna la imagen de perfil por defecto

        // Si no se proporciona fotoPerfil o está vacía, usa la imagen por defecto
        if (!data.fotoPerfil) {
            data.fotoPerfil = `data:image/webp;base64,${DEFAULT_PROFILE_PICTURE_BASE64}`;
        } 

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
        
        // Convertir el documento de Mongoose a un objeto plano
        const usuarioPlano = {
            tipoDocumento: UsuarioGuardado.tipoDocumento,
            numeroDocumento: UsuarioGuardado.numeroDocumento,
            primerNombre: UsuarioGuardado.primerNombre,
            segundoNombre: UsuarioGuardado.segundoNombre,
            primerApellido: UsuarioGuardado.primerApellido,
            segundoApellido: UsuarioGuardado.segundoApellido,
            nombreUsuario: UsuarioGuardado.nombreUsuario,
            fechaNacimiento: UsuarioGuardado.fechaNacimiento,
            genero: UsuarioGuardado.genero,
            numeroTelefono: UsuarioGuardado.numeroTelefono,
            direccion: UsuarioGuardado.direccion,
            correo: UsuarioGuardado.correo,
            rol: UsuarioGuardado.rol,
            habilitado: UsuarioGuardado.habilitado,
            _id: UsuarioGuardado._id.toString()
        };
        return { success: true, data: usuarioPlano };
        
    } catch (error) {
        console.error('Error en la función guardarUsuarios:', error.message);
        // Manejo de errores de red o errores del servidor que no devuelven JSON con 'error'
        // Devuelve un objeto de error para que el llamador pueda manejarlo.
        return { error: 'Error al registrar el usuario' };
    }
}

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
        console.log(`Correo enviado exitosamente a: ${to} en usuarioActions.enviarCorreoElectronico`);
        return { success: true, message: 'Correo enviado exitosamente' };
    } catch (error) {
        console.error('Error al enviar el correo en usuarioActions.enviarCorreoElectronico:', error);
        // Devuelve un objeto de error para que el llamador pueda manejarlo.
        return { error: `Error al enviar el correo: ${error.message}` };
    }
}

//obtener usuarios de la base de datos
async function obtenerUsuarios() {
    try {
        connectDB();

        const data = { usuarios: await Usuario.find({}) };

        if (data.error) {
            console.error('Error al encontrar el usuario ', data.error);
        }
        
        return data;

    } catch (error) {
        console.error('Error al encontrar el usuario:', error.message);
    }
}

//obtener usuarios habilitados de la base de datos
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

//obtener usuario por id
async function ObtenerUsuarioPorId(id) {
    console.log('DEBUG: Entering ObtenerUsuarioPorId with ID:', id);
    try {
        await connectDB(); // Ensure DB connection is awaited
        console.log('DEBUG: Database connected for ObtenerUsuarioPorId.');
        
        const response = await Usuario.findById(id).lean();
        console.log('DEBUG: Raw response from DB for ObtenerUsuarioPorId:', response);

        if (!response) {
            console.log('DEBUG: User not found for ID:', id);
            return null;
        }
        // Convert MongoDB specific types to plain JavaScript types
        const plainUser = {
            ...response,
            _id: response._id.toString(),
            fechaNacimiento: response.fechaNacimiento ? 
                new Date(response.fechaNacimiento).toISOString().split('T')[0] : null,
            createdAt: response.createdAt ? 
                new Date(response.createdAt).toISOString() : null,
            updatedAt: response.updatedAt ? 
                new Date(response.updatedAt).toISOString() : null
        };
        console.log('DEBUG: Exiting ObtenerUsuarioPorId with plain user:', plainUser);
        return plainUser;
    } catch (error) {
        console.error('ERROR in ObtenerUsuarioPorId:', error.message);
        return null;
    }
}

//obtener usuario por correo
async function ObtenerUsuarioPorCorreo(email) {
    try {
        
        
        console.log('Iniciando la función ObtenerUsuarioPorCorreo para el correo:', email);

        connectDB();

        // Realizar la búsqueda de correo electrónico de forma insensible a mayúsculas y minúsculas y eliminando espacios
        const user = await Usuario.findOne({ correo: { $regex: new RegExp(`^${email.trim()}$`, 'i') } });

        if (!user) {
            console.error('Usuario no encontrado por correo:', email);
        }

        return user;
        
    } catch (error) {
        console.error('Error al encontrar el usuario:', error.message);
    }
}

// Función para registrar un nuevo usuario
async function RegistrarUsuario(formData) {



    const data = {

        // Obtener los datos del formulario
        tipoDocumento: formData.get('tipoDocumento'),
        numeroDocumento: formData.get('numeroDocumento'),
        primerNombre: formData.get('primerNombre'),
        // Generar nombre de usuario con primer nombre y un número aleatorio de 4 cifras
        nombreUsuario: `${formData.get('primerNombre')}${Math.floor(1000 + Math.random() * 9000)}`,
        segundoNombre: formData.get('segundoNombre'),
        primerApellido: formData.get('primerApellido'),
        segundoApellido: formData.get('segundoApellido'),
        fechaNacimiento: formData.get('fechaNacimiento'),
        genero: formData.get('genero'),
        numeroTelefono: formData.get('numeroTelefono'),
        direccion: formData.get('direccion'),
        correo: formData.get('correo'),
        password: formData.get('password'),
        rol: 'CLIENTE', // Asignar rol de cliente por defecto
        habilitado: true // Asegurar que el usuario está habilitado por defecto

    }

    console.log('data:', data);

    //hasheamos la contraseña

    const hashedPassword = await bcrypt.hash(data.password, 10);

    data.password = hashedPassword;


    // Guardar el usuario en la base de datos(con la contraseña hasheada)

    const resultado = await guardarUsuarios(data, true); // Enviar correo al registrar un solo usuario

    return resultado;
}

// Función para registrar un usuario masivo
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

// Función para filtrar usuarios
async function FiltrarUsuarios(formData) {

    const textoBusqueda = formData.get('textoBusqueda');
    const rol = formData.get('rol');
    const genero = formData.get('generoFiltro');
    const tipoDocumento = formData.get('tipoDocumentoFiltro');
    const edad = formData.get('edadFiltro');
    const incluirDeshabilitados = formData.get('incluirDeshabilitados') === 'true'; // Checkbox value is 'true' when checked

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

    // Si no se deben incluir deshabilitados, se filtra por habilitado: true
    // Si se deben incluir deshabilitados, no se añade el filtro de habilitado, trayendo todos.
    if (!incluirDeshabilitados) {
        query.habilitado = true;
    }

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

// Función para cambiar el estado de habilitado de un usuario
async function toggleUsuarioHabilitado(formData) {

    const id = formData.get('id');

    console.log('Intentando cambiar el estado de habilitado del usuario con id:', id);

    if (!id) {
        console.error('Error: ID de usuario no proporcionado para cambiar el estado.');

        return { error: 'ID de usuario no proporcionado.' };
    }

    try {

        await connectDB();

        const usuario = await Usuario.findById(id);

        if (!usuario) {

            console.error(`Error: No se encontró ningún usuario con el ID ${id}.`);

            return { error: `No se encontró ningún usuario con el ID ${id}.` };

        }

        const nuevoEstadoHabilitado = !usuario.habilitado; // Toggle the current state

        const usuarioActualizado = await Usuario.findByIdAndUpdate(

            id,

            { habilitado: nuevoEstadoHabilitado },

            { new: true } // Devuelve el documento modificado

        );

        console.log(`Usuario ${nuevoEstadoHabilitado ? 'habilitado' : 'deshabilitado'} exitosamente:`, usuarioActualizado);

        revalidatePath('/admin/usuarios'); // Revalida la página de usuarios para reflejar el cambio

        return { success: true, message: `Usuario ${nuevoEstadoHabilitado ? 'habilitado' : 'deshabilitado'} exitosamente.`, data: JSON.parse(JSON.stringify(usuarioActualizado)) };

    } catch (error) {
        console.error(`Error al cambiar el estado de habilitado del usuario con ID ${id}:`, error.message);
        return { error: `Error al procesar la solicitud: ${error.message}` };
    }
}

// Función para editar un usuario
async function EditarUsuario(id, formData) {
    console.log('DEBUG: Entering EditarUsuario with ID:', id);
    try {
        await connectDB(); // Ensure DB connection is awaited
        console.log('DEBUG: Database connected for EditarUsuario.');

        const updateData = {
            tipoDocumento: formData.get('tipoDocumento'),
            numeroDocumento: formData.get('numeroDocumento'),
            primerNombre: formData.get('primerNombre'),
            segundoNombre: formData.get('segundoNombre'),
            primerApellido: formData.get('primerApellido'),
            segundoApellido: formData.get('segundoApellido'),
            fechaNacimiento: formData.get('fechaNacimiento'),
            genero: formData.get('genero'),
            numeroTelefono: formData.get('telefono'), // Note: name is 'telefono' in the form
            direccion: formData.get('direccion'),
            correo: formData.get('correo'),
            rol: formData.get('rol'), // Include rol update
            // Password update would need separate handling if included
        };

        console.log('DEBUG: Update data for user:', id, updateData);

        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true } // Return the modified document and run schema validators
        ).lean(); // Use lean() to get a plain object

        console.log('DEBUG: Usuario actualizado en la base de datos:', usuarioActualizado);

        if (!usuarioActualizado) {
            console.error(`Error: No se encontró ningún usuario con el ID ${id}.`);
            return { error: `No se encontró ningún usuario con el ID ${id}.` };
        }

        // Manually convert to plain object with string ID and dates
        const plainUser = {
            ...usuarioActualizado,
            _id: usuarioActualizado._id.toString(),
            fechaNacimiento: usuarioActualizado.fechaNacimiento ?
                new Date(usuarioActualizado.fechaNacimiento).toISOString().split('T')[0] : null,
            createdAt: usuarioActualizado.createdAt ?
                new Date(usuarioActualizado.createdAt).toISOString() : null,
            updatedAt: usuarioActualizado.updatedAt ?
                new Date(usuarioActualizado.updatedAt).toISOString() : null
        };

        console.log('DEBUG: Exiting EditarUsuario with plain user:', plainUser);
        return { success: true, message: 'Usuario actualizado exitosamente.', data: plainUser };

    } catch (error) {
        console.error(`ERROR al editar el usuario con ID ${id}:`, error.message);
        return { error: `Error al procesar la solicitud: ${error.message}` };
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
    toggleUsuarioHabilitado,
    EditarUsuario, // Export the updated function
    obtenerUsuariosHabilitados,
};

// Server Action para manejar el registro de usuario
export async function registerAction(prevState, formData) {
  const password = formData.get('password');
  const confirmPassword = formData.get('confirmPassword');

  // Password confirmation validation
  if (!password || password !== confirmPassword) {
    return { message: 'Las contraseñas no coinciden', success: false };
  }

  // Call the existing RegistrarUsuario function
  const result = await RegistrarUsuario(formData);

  // RegistrarUsuario already returns { success: true, data: ... } or { error: ... }
  // Map the result to the state structure expected by useActionState
  if (result.success) {
    return { message: result.message || '¡Registro exitoso!', success: true, data: result.data };
  } else {
    return { message: result.error || 'Error en el registro. Inténtalo de nuevo.', success: false };
  }
}

// Server Action para manejar la actualización de usuario
export async function updateUserAction(userId, prevState, formData) {
    console.log('Server Action Update User: Iniciado para ID:', userId);

    if (!userId) {
        return { message: 'ID de usuario no proporcionado para actualizar.', success: false };
    }

    // Call the updated EditarUsuario function
    const result = await EditarUsuario(userId, formData);

    // EditarUsuario now returns { success: true, data: ... } or { error: ... }
    // Map the result to the state structure expected by useActionState
    if (result.success) {
        // Revalidate path for admin user list if needed
        revalidatePath('/admin/usuarios');
        // Revalidate path for the specific user profile page if needed
        revalidatePath(`/perfil/editar`); // Assuming the profile page path is /perfil/editar
        revalidatePath(`/admin/usuarios/editar/${userId}`); // Revalidate admin edit page

        return { message: result.message || 'Usuario actualizado exitosamente.', success: true, data: result.data };
    } else {
        return { message: result.error || 'Error al actualizar el usuario.', success: false };
    }
}

// Server Action para manejar la carga masiva de usuarios
export async function bulkUploadUsersAction(prevState, formData) {
    console.log('Server Action Bulk Upload Users: Iniciado.');

    // RegistroMasivoUsuario requires userId, but Server Actions don't directly receive session.
    // We need to get the session here to pass the userId to RegistroMasivoUsuario.
    const { getServerSession } = await import("next-auth");
    const { authOptions } = await import("@/app/api/auth/[...nextauth]/route"); // Adjust path if necessary

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        console.log('Server Action Bulk Upload Users: Usuario no autenticado.');
        return { message: 'Usuario no autenticado. Por favor, inicia sesión.', success: false };
    }

    const userId = session.user.id;

    // Call the existing RegistroMasivoUsuario function
    const result = await RegistroMasivoUsuario(formData, userId);

    // RegistroMasivoUsuario already returns { success: true, ... } or { error: ... }
    // Map the result to the state structure expected by useActionState
    if (result.success) {
        // Revalidate path for admin user list after bulk upload
        revalidatePath('/admin/usuarios');
        return { message: result.message || 'Carga masiva completada exitosamente.', success: true };
    } else {
        return { message: result.error || 'Error durante la carga masiva.', success: false };
    }
}
