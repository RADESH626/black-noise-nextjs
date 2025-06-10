"use server"

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Papa from 'papaparse';
import nodemailer from 'nodemailer';
import connectDB from '@/utils/DBconection';
import Usuario from '@/models/Usuario';
import { signIn } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { toPlainObject } from '@/utils/dbUtils'; // Import toPlainObject
import { hashPassword, comparePassword } from '@/utils/authUtils'; // Import password utilities
import { handleError, ValidationError, NotFoundError, UnauthorizedError } from '@/utils/errorHandler'; // Import error handling utilities
import { validateRequiredFields, validateEmail, validatePassword } from '@/utils/validation'; // Import validation utilities
import Proveedor from '@/models/Proveedor'; // Import Proveedor model

const DEFAULT_PROFILE_PICTURE_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAKwAAACUCAMAAAA5xjIqAAAAMFBMVEXk5ueutLenrrHn6eqrsbTq7O3Lz9Hh4+S4vcDGyszT1tjP0VbTe4OKyuLvCx8nW2dvDGAcOAAAECUlEQVR4nO2c23LjIAxAbcTVBvP/f7vQZLNJ47SAsGTPcp4605czqpC4yJ2mwWAwGAwGg8FgMBgMBq+AUmDisizR5x+5dT4Dk4kuiAfSOm+mUworv25ByPkZKcK2mNPpqsmF+dX07jvbByfTdWLP9O4r9XmSAaY1fFbNiLCcxBYm+7PqV3DdKVIX4i9hvesGz28LukQ124p4Gdesu/LGtsY12ypWV1HhmqoCY2xhrYnrV2wjly3EStVEMEyy5vf6+h5ay+MKW71rSlvHkQgQW1xTbDmaAzSp8iQCuLbA5mpLLutDoytHaKta1ytiIXY1zYHN0HZdWOr67LfQ0vYxZTGBlRtpaA0msKnpekLXup3hDpRHMkBlQcoDR+eKKLJ3WUu3+UpnRJxs2iDQyWJTdqY8PDbvCx6R1WQrzDTtZF9k6SqtQRaDRKCTxa6vmXB74PGukk4Wm7KpHJAtsCE7ZKeLLbBLla5rNYWGS65XpKU72FxpI3OpLSIsSFfKzTf6WDNbQln0gXGnc73WUfxSlxyTwiUtYZWd8qPShS7mLnXliWpi7O+MiFIbiFVRDyCaXHaaWmUJL+UewNL4aMfy1tz2HEp8Rf+gZY1xPTQ3JQLfWI+q3s9Ixvmu3rQVdKeZPapsJcuswQOosSU8JX7SLe5kgv7p/t22bARJcq6tf4AvuPOQ2ykGJ3Piut053yfVoM8z8AvG/jDsO4uzhPWO8jbI3TFqGTbDOYK4B4B3dv4+oC5nq08wN/tOysqvgXohZCLP/odt9eY8yfoGpAjHVWu9Rn9izRtJFtSN/CO3zgeynfFxyVF1Ce30usTov37BLfcMgInOhqd19VQYgt3WU2QE5M9pVmfzovqhJaTVNm86si42NUW9vZWrj8bSbi7y+ILyLsy/tNn3BhHsQq2bKqqTZRF9Qwgb6T68SjFd7W5rLQ2wsC7SxFeZbf9jqirf2R5/1wF584p/Zr75xkOTASBunVQzwq7HbR3BbOi//wupmh2WDLqv6g17RHAhBtwLzQek0L11cwYcRcqFricJ8EdkwMO25+0HYEbnixC219mn6oqoERn6lAXAz22U2M493psgHpmuz7r4K0Yy1w4fX+FnNipAxrb1+ajVdkPYtnykiEK0vzsd2wp2aW4PNDXrO61Xzsf3gj2aeln7szcKGRpkATmz027rGhZZh7HTRuq3CZrNtf4rIfQAH8a28sFM8VSCO6LKFTzT6rpRN0ChONrBMxVnSOgwLo+iZv/VNv3Sk4r52g7T8khk+RfatLvYXdnynS17FiTb4sgyNoS/FI/bc21hnikttfivELpQJov7wr4Xsmw3o7g9bxQmLbfmjbKjY+P/h+lNWcddxCmwRbLmJJS4Dv5D/gBmFDnwIIZzJgAAAABJRU5ErkJggg==';

// Server Action para manejar el login
export async function loginAction(prevState, formData) {
    
  const email = formData.get('correo');
  const password = formData.get('password');

  console.log('Server Action Login: Iniciado.');
  console.log('Server Action Login: Datos recibidos.');

  // Perform basic server-side validation if needed
  if (!email || !password) {
    return handleError(new ValidationError('Por favor, ingresa correo y contraseña.'), 'Validation Error', 400);
  }

  try {
    // Attempt to authenticate as a regular user first
    const user = await ObtenerUsuarioPorCorreo(email);
    
    if (user) {
      // Verify password for regular user
      const isValid = await comparePassword(password, user.password);
      
      if (isValid) {
        console.log('Server Action Login: Usuario autenticado, rol:', user.rol);
        return { 
          message: 'Inicio de sesión exitoso.', 
          success: true, 
          data: { 
            email, 
            password, 
            userRole: user.rol, 
            readyForSignIn: true 
          } 
        };
      }
    }

    // If not a regular user or password invalid, attempt to authenticate as a supplier
    const proveedor = await Proveedor.findOne({ emailContacto: { $regex: new RegExp(`^${email.trim()}$`, 'i') } }).lean();

    if (proveedor) {
      const isValidAccessKey = await comparePassword(password, proveedor.accessKey);
      if (isValidAccessKey) {
        console.log('Server Action Login: Proveedor autenticado, ID:', proveedor._id);
        return {
          message: 'Inicio de sesión exitoso.',
          success: true,
          data: {
            email: proveedor.emailContacto,
            password: password, // NextAuth needs the raw password for CredentialsProvider
            isSupplier: true,
            proveedorId: proveedor._id.toString(),
            readyForSignIn: true
          }
        };
      }
    }

    // If neither user nor supplier found/authenticated
    return handleError(new ValidationError('Credenciales incorrectas.'), 'Invalid credentials', 401);

  } catch (error) {
    return handleError(error, 'Error del servidor durante el login.');
  }
}

// Server Action para manejar la adición de un solo usuario (Admin)
export async function addSingleUserAction(prevState, formData) {
    console.log('Server Action Add Single User: Iniciado.');

    try {
        // RegistrarUsuario expects formData with password field named 'password'
        // Ensure the password field from the form (named 'contrasena') is correctly mapped
        const password = formData.get('contrasena');
        if (password) {
            formData.set('password', password); // Set the correct name for RegistrarUsuario
            formData.delete('contrasena'); // Remove the old name
        } else {
            throw new ValidationError('La contraseña es requerida.');
        }

        // Call the existing RegistrarUsuario function
        const result = await RegistrarUsuario(formData);

        if (result.success) {
            revalidatePath('/admin/usuarios');
            return { message: result.message || 'Usuario agregado exitosamente.', success: true, data: result.data };
        } else {
            // RegistrarUsuario already returns an error object, so we can use its message
            throw new ValidationError(result.error); // Re-throw as ValidationError
        }
    } catch (error) {
        if (error instanceof ValidationError) {
            return handleError(error, error.message, error.statusCode);
        }
        return handleError(error, 'Error al agregar el usuario.');
    }
}


// Función para guardar usuarios en la base de datos
async function guardarUsuarios(data, enviarCorreo = false) {
    try {
        // Si no se proporciona fotoPerfil o está vacía, usa la imagen por defecto
        if (!data.fotoPerfil) {
            data.fotoPerfil = `data:image/webp;base64,${DEFAULT_PROFILE_PICTURE_BASE64}`;
        } 

        console.log('datos de usuario obtenidos:', data);

        await connectDB();

        const NuevoUsuario = new Usuario(data);

        console.log('usuario para guardar en la base de datos:', NuevoUsuario);

        const UsuarioGuardado = await NuevoUsuario.save();

        console.log('Usuario guardado en la base de datos:', UsuarioGuardado);

        if (enviarCorreo && UsuarioGuardado && UsuarioGuardado.correo) {
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
            const resultadoEnvioCorreo = await enviarCorreoElectronico(UsuarioGuardado.correo, asunto, contenidoHtml);
            if (resultadoEnvioCorreo.error) {
                console.error("Error al enviar correo de bienvenida:", resultadoEnvioCorreo.error);
            }
        }
        
        return { success: true, data: toPlainObject(UsuarioGuardado) };
        
    } catch (error) {
        if (error.code === 11000) {
            throw new ValidationError('Ya existe un usuario con este número de documento o correo electrónico.');
        }
        throw handleError(error, 'Error al registrar el usuario'); // Re-throw as handled error
    }
}

// Función para enviar correos electrónicos
async function enviarCorreoElectronico(to, subject, html) {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.example.com',
            port: parseInt(process.env.SMTP_PORT) || 587,
            secure: (parseInt(process.env.SMTP_PORT) || 587) === 465,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"Black Noise" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            html: html,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Correo enviado exitosamente a: ${to} en usuarioActions.enviarCorreoElectronico`);
        return { success: true, message: 'Correo enviado exitosamente' };
    } catch (error) {
        return handleError(error, `Error al enviar el correo: ${error.message}`);
    }
}

//obtener usuarios de la base de datos
async function obtenerUsuarios() {
    try {
        await connectDB();

        const usuarios = await Usuario.find({}).lean();
        const plainUsers = usuarios.map(toPlainObject);
        
        return { usuarios: plainUsers };

    } catch (error) {
        return handleError(error, 'Error al obtener usuarios');
    }
}

//obtener usuarios habilitados de la base de datos
async function obtenerUsuariosHabilitados() {
    try {
        await connectDB();
        const usuarios = await Usuario.find({ habilitado: true }).lean();
        const plainUsers = usuarios.map(toPlainObject);
        
        return { users: plainUsers };

    } catch (error) {
        return handleError(error, 'Error al obtener usuarios habilitados');
    }
}

//obtener usuario por id
async function ObtenerUsuarioPorId(id) {
    console.log('DEBUG: Entering ObtenerUsuarioPorId with ID:', id);
    try {
        await connectDB();
        console.log('DEBUG: Database connected for ObtenerUsuarioPorId.');
        
        const response = await Usuario.findById(id).lean();
        console.log('DEBUG: Raw response from DB for ObtenerUsuarioPorId:', response);

        if (!response) {
            throw new NotFoundError(`User not found with ID: ${id}`);
        }
        const plainUser = toPlainObject(response);
        console.log('DEBUG: Exiting ObtenerUsuarioPorId with plain user:', plainUser);
        return plainUser;
    } catch (error) {
        if (error instanceof NotFoundError) {
            return handleError(error, error.message, error.statusCode);
        }
        return handleError(error, 'Error al obtener el usuario por ID');
    }
}

//obtener usuario por correo
async function ObtenerUsuarioPorCorreo(email) {
    try {
        console.log('Iniciando la función ObtenerUsuarioPorCorreo para el correo:', email);
        await connectDB();
        const user = await Usuario.findOne({ correo: { $regex: new RegExp(`^${email.trim()}$`, 'i') } }).lean();

        if (!user) {
            return null; // Return null if user not found, handled by loginAction
        }
        const plainUser = toPlainObject(user);
        return plainUser;
        
    } catch (error) {
        return handleError(error, 'Error al obtener el usuario por correo');
    }
}

// Función para registrar un nuevo usuario
async function RegistrarUsuario(formData) {
    try {
        const data = {
            tipoDocumento: formData.get('tipoDocumento'),
            numeroDocumento: formData.get('numeroDocumento'),
            primerNombre: formData.get('primerNombre'),
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
            rol: 'CLIENTE',
            habilitado: true
        };

        validateRequiredFields(data, ['tipoDocumento', 'numeroDocumento', 'primerNombre', 'primerApellido', 'fechaNacimiento', 'genero', 'numeroTelefono', 'direccion', 'correo', 'password']);
        validateEmail(data.correo);
        validatePassword(data.password);

        const hashedPassword = await hashPassword(data.password);
        data.password = hashedPassword;

        const resultado = await guardarUsuarios(data, true);
        return resultado;
    } catch (error) {
        if (error instanceof ValidationError) {
            return { success: false, error: error.message }; // Return as object for Server Action
        }
        return { success: false, error: 'Error al registrar el usuario' };
    }
}

// Función para registrar un usuario masivo
async function RegistroMasivoUsuario(formData) {
    const file = formData.get('file');

    if (!file) {
        return { success: false, error: 'No se ha subido ningún archivo' };
    }

    const buffer = await file.arrayBuffer();
    const text = new TextDecoder().decode(buffer);

    try {
        await connectDB();

        const resultadoParseo = Papa.parse(text, {
            header: true,
            skipEmptyLines: true,
            transformHeader: header => header.trim(),
            transform: value => typeof value === 'string' ? value.trim() : value,
        });

        if (resultadoParseo.errors.length > 0) {
            console.error("Errores al parsear CSV:", resultadoParseo.errors);
            return { success: false, error: 'Errores al parsear el archivo CSV.' };
        } else {
            const usuarios = resultadoParseo.data;
            console.log("usuarios a procesar:", usuarios);

            const results = [];
            for (const usuarioData of usuarios) {
                try {
                    validateRequiredFields(usuarioData, ['correo', 'password']); // Basic validation for bulk
                    validateEmail(usuarioData.correo);
                    validatePassword(usuarioData.password);

                    if (usuarioData.password) {
                        usuarioData.password = await hashPassword(usuarioData.password);
                    } else {
                        throw new ValidationError('Contraseña requerida para usuario en carga masiva.');
                    }
                    
                    if (!usuarioData.fotoPerfil) {
                        usuarioData.fotoPerfil = `data:image/webp;base64,${DEFAULT_PROFILE_PICTURE_BASE64}`;
                    }

                    if (!usuarioData.rol) {
                        usuarioData.rol = 'CLIENTE';
                    }

                    usuarioData.habilitado = usuarioData.habilitado === 'true' || usuarioData.habilitado === true;

                    const nuevoUsuario = new Usuario(usuarioData);
                    const usuarioGuardado = await nuevoUsuario.save();
                    results.push({ success: true, data: toPlainObject(usuarioGuardado) });
                } catch (error) {
                    console.error(`Error al guardar usuario ${usuarioData.correo || usuarioData.numeroDocumento}:`, error.message);
                    if (error.code === 11000) {
                        results.push({ success: false, error: `Usuario ${usuarioData.correo || usuarioData.numeroDocumento} ya existe.` });
                    } else if (error instanceof ValidationError) {
                        results.push({ success: false, error: `Error de validación para ${usuarioData.correo || usuarioData.numeroDocumento}: ${error.message}` });
                    } else {
                        results.push({ success: false, error: `Error al guardar usuario ${usuarioData.correo || usuarioData.numeroDocumento}: ${error.message}` });
                    }
                }
            }
            
            revalidatePath('/admin/usuarios');
            
            const allSuccess = results.every(r => r.success);
            if (allSuccess) {
                return { success: true, message: 'Carga masiva completada exitosamente.' };
            } else {
                const errorMessages = results.filter(r => r.error).map(r => r.error).join('; ');
                return { success: false, message: `Carga masiva completada con algunos errores: ${errorMessages}` };
            }
        }
    } catch (error) {
        return handleError(error, `Error durante la carga masiva: ${error.message}`);
    }
}

// Función para filtrar usuarios
async function FiltrarUsuarios(prevState, formData) {
    try {
        const textoBusqueda = formData.get('textoBusqueda');
        const rol = formData.get('rol');
        const genero = formData.get('generoFiltro');
        const tipoDocumento = formData.get('tipoDocumentoFiltro');
        const edad = formData.get('edadFiltro');
        const incluirDeshabilitados = formData.get('incluirDeshabilitados') === 'true';

        await connectDB();

        const query = {};

        if (textoBusqueda) {
            query.$or = [
                { primerNombre: { $regex: textoBusqueda, $options: 'i' } },
                { primerApellido: { $regex: textoBusqueda, $options: 'i' } },
                { correo: { $regex: textoBusqueda, $options: 'i' } },
                { numeroDocumento: { $regex: textoBusqueda, $options: 'i' } },
            ];
        }

        if (rol) query.rol = rol;
        if (genero) query.genero = genero;
        if (tipoDocumento) query.tipoDocumento = tipoDocumento;

        if (edad) { 
            const currentYear = new Date().getFullYear();
            let minBirthYear, maxBirthYear;

            if (edad.includes('-')) {
                const [minAge, maxAge] = edad.split('-').map(Number);
                maxBirthYear = currentYear - minAge;
                minBirthYear = currentYear - maxAge;
            } else if (edad.includes('+')) {
                const minAge = parseInt(edad.replace('+', ''));
                maxBirthYear = currentYear - minAge;
                minBirthYear = 0;
            } else {
                const exactAge = parseInt(edad);
                maxBirthYear = currentYear - exactAge;
                minBirthYear = currentYear - exactAge;
            }

            const startDate = new Date(minBirthYear, 0, 1);
            const endDate = new Date(maxBirthYear + 1, 0, 1);

            query.fechaNacimiento = { $gte: startDate, $lt: endDate };
        }

        if (!incluirDeshabilitados) {
            query.habilitado = true;
        }

        const usuariosEncontradosRaw = await Usuario.find(query).lean();
        const usuariosEncontrados = usuariosEncontradosRaw.map(toPlainObject);

        return { data: usuariosEncontrados, message: "Búsqueda completada.", success: true };
    } catch (error) {
        return handleError(error, 'Error al filtrar usuarios');
    }
}

// Función para cambiar el estado de habilitado de un usuario
async function toggleUsuarioHabilitado(formData) {
    try {
        const id = formData.get('id');

        if (!id) {
            throw new ValidationError('ID de usuario no proporcionado para cambiar el estado.');
        }

        await connectDB();

        const usuario = await Usuario.findById(id);

        if (!usuario) {
            throw new NotFoundError(`No se encontró ningún usuario con el ID ${id}.`);
        }

        const nuevoEstadoHabilitado = !usuario.habilitado;

        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            id,
            { habilitado: nuevoEstadoHabilitado },
            { new: true }
        ).lean();

        revalidatePath('/admin/usuarios');

        return { success: true, message: `Usuario ${nuevoEstadoHabilitado ? 'habilitado' : 'deshabilitado'} exitosamente.`, data: toPlainObject(usuarioActualizado) };

    } catch (error) {
        if (error instanceof ValidationError || error instanceof NotFoundError) {
            return handleError(error, error.message, error.statusCode);
        }
        return handleError(error, 'Error al cambiar el estado de habilitado del usuario.');
    }
}

// Función para editar un usuario
async function EditarUsuario(id, formData) {
    try {
        await connectDB();

        const updateData = {
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
            rol: formData.get('rol'),
        };

        validateRequiredFields(updateData, ['tipoDocumento', 'numeroDocumento', 'primerNombre', 'primerApellido', 'fechaNacimiento', 'genero', 'numeroTelefono', 'direccion', 'correo', 'rol']);
        validateEmail(updateData.correo);

        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).lean();

        if (!usuarioActualizado) {
            throw new NotFoundError(`No se encontró ningún usuario con el ID ${id}.`);
        }

        const plainUser = toPlainObject(usuarioActualizado);

        return { success: true, message: 'Usuario actualizado exitosamente.', data: plainUser };

    } catch (error) {
        if (error instanceof ValidationError || error instanceof NotFoundError) {
            return handleError(error, error.message, error.statusCode);
        }
        return handleError(error, 'Error al editar el usuario.');
    }
}

export async function ObtenerTodosLosUsuarios() {
    try {
        await connectDB();
        const usuarios = await Usuario.find({}).lean();

        const plainUsers = usuarios.map(toPlainObject);

        return { users: plainUsers, success: true };

    } catch (error) {
        return handleError(error, 'Error al obtener todos los usuarios');
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
    EditarUsuario,
    obtenerUsuariosHabilitados,
};

// Server Action para manejar el registro de usuario
export async function registerAction(prevState, formData) {
  try {
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (!password || password !== confirmPassword) {
      throw new ValidationError('Las contraseñas no coinciden');
    }

    const result = await RegistrarUsuario(formData);

    if (result.success) {
      revalidatePath('/'); // Add revalidatePath for general consistency
      return { message: result.message || '¡Registro exitoso!', success: true, data: result.data };
    } else {
      throw new ValidationError(result.error);
    }
  } catch (error) {
    if (error instanceof ValidationError) {
        return handleError(error, error.message, error.statusCode);
    }
    return handleError(error, 'Error en el registro. Inténtalo de nuevo.');
  }
}

// Server Action para manejar la actualización de usuario
export async function updateUserAction(userId, prevState, formData) {
    try {
        if (!userId) {
            throw new ValidationError('ID de usuario no proporcionado para actualizar.');
        }

        const result = await EditarUsuario(userId, formData);

        if (result.success) {
            revalidatePath('/admin/usuarios');
            revalidatePath(`/perfil/editar`);
            revalidatePath(`/admin/usuarios/editar/${userId}`);

            return { message: result.message || 'Usuario actualizado exitosamente.', success: true, data: result.data };
        } else {
            throw new ValidationError(result.error);
        }
    } catch (error) {
        if (error instanceof ValidationError) {
            return handleError(error, error.message, error.statusCode);
        }
        return handleError(error, 'Error al actualizar el usuario.');
    }
}

// Server Action para manejar la carga masiva de usuarios
export async function bulkUploadUsersAction(prevState, formData) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            throw new UnauthorizedError('Usuario no autenticado. Por favor, inicia sesión.');
        }

        const result = await RegistroMasivoUsuario(formData);

        if (result.success) {
            revalidatePath('/admin/usuarios');
            return { message: result.message || 'Carga masiva completada exitosamente.', success: true };
        } else {
            throw new ValidationError(result.error);
        }
    } catch (error) {
        if (error instanceof ValidationError || error instanceof UnauthorizedError) {
            return handleError(error, error.message, error.statusCode);
        }
        return handleError(error, 'Error durante la carga masiva.');
    }
}
