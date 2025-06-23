"use server"

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Papa from 'papaparse';
import { transporter } from '@/utils/nodemailer';
import connectDB from '@/utils/DBconection';


import { signIn } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { toPlainObject } from '@/utils/dbUtils'; // Import toPlainObject
import { hashPassword, comparePassword } from '@/utils/authUtils'; // Import password utilities
import { handleError, ValidationError, NotFoundError, UnauthorizedError } from '@/utils/errorHandler'; // Import error handling utilities
import { validateRequiredFields, validateEmail, validatePassword } from '@/utils/validation'; // Import validation utilities
import Proveedor from '@/models/Proveedor'; // Import Proveedor model
import logger from '@/utils/logger';
import { createEmptyCartForUser } from './CartActions'; // Import the cart creation function

// Server Action para manejar el login
export async function loginAction(prevState, formData) {
    
  const email = formData.get('correo');
  const password = formData.get('password');

  logger.info('Server Action Login: Iniciado.');
  logger.info('Server Action Login: Datos recibidos.');

  // Perform basic server-side validation if needed
  if (!email || !password) {
    return handleError('Por favor, ingresa correo y contraseña.', 'Validation Error', 400);
  }

  try {
    // Attempt to authenticate as a regular user first
    const user = await ObtenerUsuarioPorCorreo(email);
    
    if (user) {
      // Verify password for regular user
      if (!user.password) {
        logger.warn('Server Action Login: Usuario encontrado pero sin contraseña almacenada:', user.correo);
        return handleError('La contraseña es incorrecta.', 'Invalid credentials', 401);
      }
      
      const isValid = await comparePassword(password, user.password);
      
      if (isValid) {
        logger.info('Server Action Login: Usuario autenticado, rol:', user.rol);
        return { 
          message: 'Inicio de sesión exitoso.', 
          success: true, 
          data: { 
            email, 
            password, 
            userRole: user.rol, 
            readyForSignIn: true,
            profileImageUrl: user.profileImageUrl // Pass the new image URL
          } 
        };
      } else {
        // Password incorrect for existing user
        return { success: false, message: 'La contraseña es incorrecta.' };
      }
    }

    // If not a regular user, attempt to authenticate as a supplier
    const proveedor = await Proveedor.findOne({ emailContacto: { $regex: new RegExp(`^${email.trim()}$`, 'i') } }).lean();

    if (proveedor) {
      const isValidAccessKey = await comparePassword(password, proveedor.accessKey);
      if (isValidAccessKey) {
        logger.info('Server Action Login: Proveedor autenticado, ID:', proveedor._id);
        return {
          message: 'Inicio de sesión exitoso.',
          success: true,
          data: {
            email: proveedor.emailContacto,
            password: password, // NextAuth needs the raw password for CredentialsProvider
            isSupplier: true,
            userRole: 'PROVEEDOR', // Explicitly set userRole for supplier
            proveedorId: proveedor._id.toString(),
            readyForSignIn: true,
            profileImageUrl: "/img/proveedores/IMAGEN-SOLICITUD-PROVEEDOR.jpg" // Default image for suppliers
          }
        };
      } else {
        // Password incorrect for existing supplier
        return { success: false, message: 'La contraseña es incorrecta.' };
      }
    }

    // If neither user nor supplier found
    return { success: false, message: 'El correo electrónico no está registrado.' };

  } catch (error) {
    // Ensure that the error message from handleError is correctly propagated
    if (error.message && error.statusCode) {
      return { success: false, message: error.message };
    }
    return { success: false, message: 'Error del servidor durante el login.' };
  }
}

// Server Action para manejar la adición de un solo usuario (Admin)
export async function addSingleUserAction(prevState, formData) {
    logger.info('Server Action Add Single User: Iniciado.');

    try {
        // RegistrarUsuario expects formData with password field named 'password'
        // Ensure the password field from the form (named 'contrasena') is correctly mapped
        const password = formData.get('contrasena');
        if (password) {
            formData.set('password', password); // Set the correct name for RegistrarUsuario
            formData.delete('contrasena'); // Remove the old name
        } else {
            // Throw a plain error message instead of ValidationError instance
            return handleError('La contraseña es requerida.', 'Validation Error', 400);
        }

        // Call the existing RegistrarUsuario function
        const result = await RegistrarUsuario(formData);

        if (result.success) {
            revalidatePath('/admin/usuarios');
            return { message: result.message || 'Usuario agregado exitosamente.', success: true, data: result.data };
        } else {
            // RegistrarUsuario already returns an error object with a message.
            // Pass the error message directly to handleError.
            return handleError(result.error, 'Validation Error', 400, formData);
        }
    } catch (error) {
        // This catch block now primarily handles unexpected errors.
        return handleError(error, 'Error al agregar el usuario.');
    }
}


// Función para guardar usuarios en la base de datos
async function guardarUsuarios(data, enviarCorreo = false) {
    try {
        // Si no se proporciona fotoPerfil o está vacía, usa la imagen por defecto
        if (!data.fotoPerfil) {
            data.fotoPerfil = '/img/perfil/FotoPerfil.webp'; // Use static path
        } 

        logger.debug('datos de usuario obtenidos:', data);

        await connectDB();

        const UsuarioModel = await getModel('Usuario');
        const NuevoUsuario = new UsuarioModel(data);

        logger.debug('usuario para guardar en la base de datos:', NuevoUsuario);

        const UsuarioGuardado = await NuevoUsuario.save();

        logger.info('Usuario guardado en la base de datos:', UsuarioGuardado);

        // Create an empty cart for the new user
        const cartCreationResult = await createEmptyCartForUser(UsuarioGuardado._id.toString());
        if (!cartCreationResult.success) {
            logger.error('ERROR: Failed to create empty cart for new user:', cartCreationResult.message);
            // Decide how to handle this error:
            // - Rollback user creation (complex)
            // - Log and proceed (cart will be created on first add to cart)
            // For now, we'll log and proceed, as the cart will be created if it doesn't exist on first add.
        } else {
            logger.debug('Empty cart created for new user:', UsuarioGuardado._id);
        }

        if (enviarCorreo && UsuarioGuardado && UsuarioGuardado.correo) {
            const asunto = 'Bienvenido/a a Black Noise';
            const contenidoHtml = `
                <h1>¡Hola ${UsuarioGuardado.Nombre}!</h1>
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
                logger.error("Error al enviar correo de bienvenida:", resultadoEnvioCorreo.error);
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
        const mailOptions = {
            from: `"Black Noise" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            html: html,
        };

        await transporter.sendMail(mailOptions);
        logger.info(`Correo enviado exitosamente a: ${to} en usuarioActions.enviarCorreoElectronico`);
        return { success: true, message: 'Correo enviado exitosamente' };
    } catch (error) {
        return handleError(error, `Error al enviar el correo: ${error.message}`);
    }
}

//obtener usuarios de la base de datos
async function obtenerUsuarios() {
    try {
        await connectDB();

const UsuarioModel = await getModel('Usuario');
        const usuarios = await UsuarioModel.find({}).lean();
        const plainUsers = usuarios.map(user => {
            const plainUser = toPlainObject(user);
            if (plainUser.imageData && plainUser.imageMimeType) {
                plainUser.profileImageUrl = `/api/images/usuario/${plainUser._id}`;
            } else {
                plainUser.profileImageUrl = '/img/perfil/FotoPerfil.webp';
            }
            return plainUser;
        });
        
        return { usuarios: plainUsers };

    } catch (error) {
        return handleError(error, 'Error al obtener usuarios');
    }
}

//obtener usuarios habilitados de la base de datos
async function obtenerUsuariosHabilitados() {
    try {
        await connectDB();
const UsuarioModel = await getModel('Usuario');
        const usuarios = await UsuarioModel.find({ habilitado: true }).lean();
        const plainUsers = usuarios.map(user => {
            const plainUser = toPlainObject(user);
            if (plainUser.imageData && plainUser.imageMimeType) {
                plainUser.profileImageUrl = `/api/images/usuario/${plainUser._id}`;
            } else {
                plainUser.profileImageUrl = '/img/perfil/FotoPerfil.webp';
            }
            return plainUser;
        });
        
        return { users: plainUsers };

    } catch (error) {
        return handleError(error, 'Error al obtener usuarios habilitados');
    }
}

//obtener usuario por id
async function ObtenerUsuarioPorId(id) {
    // logger.debug('Entering ObtenerUsuarioPorId with ID:', id);
    try {
        await connectDB();
        // logger.debug('Database connected for ObtenerUsuarioPorId.');
        
const UsuarioModel = await getModel('Usuario');
        const response = await UsuarioModel.findById(id).lean();
        // logger.debug('Raw response from DB for ObtenerUsuarioPorId:', response);

        if (!response) {
            throw new NotFoundError(`User not found with ID: ${id}`);
        }
        const plainUser = toPlainObject(response);
        
        // Ensure _id is a string
        plainUser._id = plainUser._id.toString();

        // Construct profileImageUrl and remove raw image data
        if (plainUser.imageData && plainUser.imageMimeType) {
            plainUser.profileImageUrl = `/api/images/usuario/${plainUser._id}`;
            delete plainUser.imageData; // Remove raw buffer data
            delete plainUser.imageMimeType; // Remove raw mime type
        } else {
            plainUser.profileImageUrl = '/img/perfil/FotoPerfil.webp';
        }
        // logger.debug('Exiting ObtenerUsuarioPorId with plain user:', plainUser);
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
        logger.info('Iniciando la función ObtenerUsuarioPorCorreo para el correo:', email);
        await connectDB();
const UsuarioModel = await getModel('Usuario');
        const user = await UsuarioModel.findOne({ correo: { $regex: new RegExp(`^${email.trim()}$`, 'i') } }).lean();

        if (!user) {
            return null; // Return null if user not found, handled by loginAction
        }
        const plainUser = toPlainObject(user);
        
        // Ensure _id is a string
        plainUser._id = plainUser._id.toString();

        // Construct profileImageUrl and remove raw image data
        if (plainUser.imageData && plainUser.imageMimeType) {
            plainUser.profileImageUrl = `/api/images/usuario/${plainUser._id}`;
            delete plainUser.imageData; // Remove raw buffer data
            delete plainUser.imageMimeType; // Remove raw mime type
        } else {
            plainUser.profileImageUrl = '/img/perfil/FotoPerfil.webp';
        }
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

        // Concatenate names to form the 'Nombre' field for the Usuario model
        const primerNombre = formData.get('primerNombre');
        const segundoNombre = formData.get('segundoNombre');
        const primerApellido = formData.get('primerApellido');
        const segundoApellido = formData.get('segundoApellido');

        data.Nombre = primerNombre; // Add only the first name to data

        validateRequiredFields(data, ['tipoDocumento', 'numeroDocumento', 'Nombre', 'primerApellido', 'fechaNacimiento', 'genero', 'numeroTelefono', 'direccion', 'correo', 'password']);
        validateEmail(data.correo);
        validatePassword(data.password);

        // Validate fechaNacimiento: year must be less than 2007
        const birthDate = new Date(data.fechaNacimiento);
        if (isNaN(birthDate.getTime())) {
            throw new ValidationError('Fecha de nacimiento inválida.');
        }
        if (birthDate.getFullYear() >= 2007) {
            throw new ValidationError('La fecha de nacimiento debe ser anterior al año 2007.');
        }

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
            logger.error("Errores al parsear CSV:", resultadoParseo.errors);
            return { success: false, error: 'Errores al parsear el archivo CSV.' };
        } else {
            const usuarios = resultadoParseo.data;
            logger.debug("usuarios a procesar:", usuarios);

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
                        usuarioData.fotoPerfil = '/img/perfil/FotoPerfil.webp'; // Use static path
                    }

                    if (!usuarioData.rol) {
                        usuarioData.rol = 'CLIENTE';
                    }

                    usuarioData.habilitado = usuarioData.habilitado === 'true' || usuarioData.habilitado === true;

                    const nuevoUsuario = new Usuario(usuarioData);
                    const usuarioGuardado = await nuevoUsuario.save();
                    results.push({ success: true, data: toPlainObject(usuarioGuardado) });
                } catch (error) {
                    logger.error(`Error al guardar usuario ${usuarioData.correo || usuarioData.numeroDocumento}:`, error.message);
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

const UsuarioModel = await getModel('Usuario');
        const usuariosEncontradosRaw = await UsuarioModel.find(query).lean();
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

const UsuarioModel = await getModel('Usuario');
        const usuario = await UsuarioModel.findById(id);

        if (!usuario) {
            throw new NotFoundError(`No se encontró ningún usuario con el ID ${id}.`);
        }

        const nuevoEstadoHabilitado = !usuario.habilitado;

        const usuarioActualizado = await UsuarioModel.findByIdAndUpdate(
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
            primerApellido: formData.get('primerApellido'),
            segundoApellido: formData.get('segundoApellido'),
            fechaNacimiento: formData.get('fechaNacimiento'),
            genero: formData.get('genero'),
            numeroTelefono: formData.get('numeroTelefono'),
            direccion: formData.get('direccion'),
            correo: formData.get('correo'),
            rol: formData.get('rol'),
        };

        // Concatenate names to form the 'Nombre' field for the Usuario model
        const primerNombre = formData.get('primerNombre');
        const segundoNombre = formData.get('segundoNombre');
        const primerApellido = formData.get('primerApellido');
        const segundoApellido = formData.get('segundoApellido');

        updateData.Nombre = primerNombre; // Add only the first name to updateData

        validateRequiredFields(updateData, ['tipoDocumento', 'numeroDocumento', 'Nombre', 'primerApellido', 'fechaNacimiento', 'genero', 'numeroTelefono', 'direccion', 'correo', 'rol']);
        validateEmail(updateData.correo);

        const UsuarioModel = await getModel('Usuario');
        const usuarioActualizado = await UsuarioModel.findByIdAndUpdate(
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
const UsuarioModel = await getModel('Usuario');
        const usuarios = await UsuarioModel.find({}).lean();

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
      // RegistrarUsuario already returns an error object with a message.
      // Pass the error message directly to handleError.
      return handleError(result.error, 'Validation Error', 400);
    }
  } catch (error) {
    // This catch block now primarily handles errors thrown directly within registerAction
    // (e.g., password mismatch) or unexpected errors.
    if (error instanceof ValidationError) {
        return handleError(error.message, 'Validation Error', error.statusCode, formData);
    }
    return handleError(error, 'Error en el registro. Inténtalo de nuevo.', 500, formData);
  }
}

// Server Action para manejar la actualización de usuario
export async function updateUserAction(userId, prevState, formData) {
    try {
        if (!userId) {
            return handleError('ID de usuario no proporcionado para actualizar.', 'Validation Error', 400);
        }

        const result = await EditarUsuario(userId, formData);

        if (result.success) {
            revalidatePath('/admin/usuarios');
            revalidatePath(`/perfil/editar`);
            revalidatePath(`/admin/usuarios/editar/${userId}`);

            return { message: result.message || 'Usuario actualizado exitosamente.', success: true, data: result.data };
        } else {
            // EditarUsuario returns an error object with a message.
            return handleError(result.error, 'Validation Error', 400);
        }
    } catch (error) {
        if (error instanceof ValidationError) {
            return handleError(error.message, 'Validation Error', error.statusCode);
        }
        return handleError(error, 'Error al actualizar el usuario.');
    }
}

// Server Action para manejar la carga masiva de usuarios
export async function bulkUploadUsersAction(prevState, formData) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return handleError('Usuario no autenticado. Por favor, inicia sesión.', 'Unauthorized', 401);
        }

        const result = await RegistroMasivoUsuario(formData);

        if (result.success) {
            revalidatePath('/admin/usuarios');
            return { message: result.message || 'Carga masiva completada exitosamente.', success: true };
        } else {
            // RegistroMasivoUsuario returns an error object with a message.
            return handleError(result.error, 'Validation Error', 400);
        }
    } catch (error) {
        if (error instanceof ValidationError || error instanceof UnauthorizedError) {
            return handleError(error.message, error.message, error.statusCode);
        }
        return handleError(error, 'Error durante la carga masiva.');
    }
}
