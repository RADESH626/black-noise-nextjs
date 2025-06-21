"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/utils/DBconection";
import Proveedor from "@/models/Proveedor";
import Usuario from "@/models/Usuario"; // Import the Usuario model
import { revalidatePath } from "next/cache";
import { Rol } from "@/models/enums/usuario/Rol";
import bcrypt from "bcryptjs";
import logger from '@/utils/logger';
import { transporter } from '@/utils/nodemailer'; // Import the centralized transporter

export async function crearProveedor(prevState, formData) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.rol !== Rol.ADMINISTRADOR) {
    return { message: "Acceso denegado. Solo los administradores pueden crear proveedores.", success: false };
  }

  await connectDB();

  try {
    // Extract user-related fields
    const nombre = formData.get("nombre");
    const primerApellido = formData.get("primerApellido");
    const numeroDocumento = formData.get("numeroDocumento");
    const numeroTelefonoUsuario = formData.get("numeroTelefono"); // Renamed to avoid conflict
    const emailContacto = formData.get("emailContacto"); // This will be used for both User and Proveedor

    // Extract supplier-related fields
    const nombreEmpresa = formData.get("nombreEmpresa");
    const nit = formData.get("nit");
    const direccionEmpresa = formData.get("direccionEmpresa");
    const especialidad = formData.get("especialidad").split(',').map(s => s.trim()); // Split by comma and trim whitespace
    const comision = formData.get("comision");
    const telefonoContactoProveedor = formData.get("telefonoContacto"); // Renamed to avoid conflict
    const metodosPagoAceptados = formData.getAll("metodosPagoAceptados").flatMap(item => item.split(',').map(s => s.trim())); // Split each item by comma and flatten

    // Basic validation for required fields for both User and Proveedor
    if (!nombre || !primerApellido || !numeroDocumento || !numeroTelefonoUsuario || !emailContacto ||
        !nombreEmpresa || !nit || !direccionEmpresa || !especialidad || !comision || !telefonoContactoProveedor || metodosPagoAceptados.length === 0) {
      return { message: "Todos los campos obligatorios deben ser completados.", success: false };
    }

    // Check if a user with this email already exists
    const existingUser = await Usuario.findOne({ correo: emailContacto });
    if (existingUser) {
      return { message: "Ya existe un usuario registrado con este correo electrónico.", success: false };
    }

    // Generate a random access key for the new supplier (and user password)
    const generatedAccessKey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const hashedAccessKey = await bcrypt.hash(generatedAccessKey, 10);

    // Create a new Usuario entry
    const nuevoUsuario = new Usuario({
      Nombre: nombre,
      primerApellido: primerApellido,
      numeroDocumento: numeroDocumento,
      numeroTelefono: numeroTelefonoUsuario,
      correo: emailContacto,
      password: hashedAccessKey,
      rol: Rol.PROVEEDOR,
      habilitado: true,
    });
    await nuevoUsuario.save();

    // Create the new Proveedor entry, linking it to the newly created Usuario
    const nuevoProveedor = new Proveedor({
      userId: nuevoUsuario._id, // Link to the new user
      nombreEmpresa,
      nit,
      direccionEmpresa,
      especialidad,
      comision: parseFloat(comision),
      telefonoContacto: telefonoContactoProveedor,
      emailContacto,
      metodosPagoAceptados,
      habilitado: true,
    });

    logger.info("Attempting to save new Proveedor with data:", nuevoProveedor.toObject());
    await nuevoProveedor.save();
    logger.info("Proveedor saved successfully with ID:", nuevoProveedor._id);

    // Send the access key to the provider's email
    const emailSubject = "Tu clave de acceso para el Portal de Proveedores Black Noise";
    const emailBody = `Hola ${nombre},\n\nTu empresa ${nombreEmpresa} ha sido registrada como proveedor en Black Noise.\n\nTu clave de acceso para iniciar sesión en el portal de proveedores es: ${generatedAccessKey}\n\nPor favor, guarda esta clave en un lugar seguro. Puedes acceder al portal de proveedores en [URL del portal de proveedores].\n\nSaludos,\nEl equipo de Black Noise`;

    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: emailContacto,
        subject: emailSubject,
        html: emailBody,
      };
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      logger.error("Error al intentar enviar el correo electrónico de la clave de acceso:", emailError);
      // Decide if you want to return an error here or just log a warning
    }

    revalidatePath("/admin/proveedores");
    return {
      message: "Proveedor creado exitosamente. La clave de acceso ha sido enviada al correo electrónico del proveedor.",
      success: true,
      data: {
        ...nuevoProveedor.toObject(),
        _id: nuevoProveedor._id.toString(),
        userId: nuevoProveedor.userId ? nuevoProveedor.userId.toString() : null,
      },
      // Do NOT return accessKey here as per user's request
    };
  } catch (error) {
    logger.error("Error al crear proveedor:", error);
    return { message: `Error al crear proveedor: ${error.message}`, success: false };
  }
}

export async function generarYGuardarAccessKey(proveedorId, newAccessKey) {
  await connectDB();
  try {
    const hashedPassword = await bcrypt.hash(newAccessKey, 10);
    const proveedor = await Proveedor.findByIdAndUpdate(
      proveedorId,
      { accessKey: hashedPassword },
      { new: true }
    );

    if (!proveedor) {
      return { message: "Proveedor no encontrado.", success: false };
    }

    revalidatePath("/admin/proveedores");
    return { message: "Clave de acceso actualizada exitosamente.", success: true };
  } catch (error) {
    logger.error("Error al generar y guardar clave de acceso:", error);
    return { message: `Error al generar y guardar clave de acceso: ${error.message}`, success: false };
  }
}

export async function actualizarProveedor(prevState, formData) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.rol !== Rol.ADMINISTRADOR) {
    return { message: "Acceso denegado. Solo los administradores pueden actualizar proveedores.", success: false };
  }

  await connectDB();

  try {
    const id = formData.get("id");
    const nombreEmpresa = formData.get("nombreEmpresa");
    const nit = formData.get("nit");
    const direccionEmpresa = formData.get("direccionEmpresa");
    const especialidad = formData.get("especialidad");
    const comision = formData.get("comision");
    const nombreDueño = formData.get("nombreDueño");
    const telefonoContacto = formData.get("telefonoContacto");
    const emailContacto = formData.get("emailContacto");
    const metodosPagoAceptados = formData.getAll("metodosPagoAceptados");
    const habilitado = formData.get("habilitado") === "true"; // Convert string to boolean
    const newAccessKey = formData.get("accessKey"); // New access key if provided

    if (!nombreEmpresa || !nit || !direccionEmpresa || !especialidad || !comision || !nombreDueño || !telefonoContacto || !emailContacto || metodosPagoAceptados.length === 0) {
      return { message: "Todos los campos son obligatorios, incluyendo al menos un método de pago.", success: false };
    }

    const updateData = {
      nombreEmpresa,
      nit,
      direccionEmpresa,
      especialidad,
      comision: parseFloat(comision),
      nombreDueño,
      telefonoContacto,
      emailContacto,
      metodosPagoAceptados,
      habilitado,
    };

    if (newAccessKey) {
      updateData.accessKey = await bcrypt.hash(newAccessKey, 10);
    }

    const updatedProveedor = await Proveedor.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedProveedor) {
      return { message: "Proveedor no encontrado para actualizar.", success: false };
    }

    revalidatePath("/admin/proveedores");
    return {
      message: "Proveedor actualizado exitosamente.",
      success: true,
      data: {
        ...updatedProveedor.toObject(),
        _id: updatedProveedor._id.toString(),
        userId: updatedProveedor.userId ? updatedProveedor.userId.toString() : null,
      },
    };
  } catch (error) {
    logger.error("Error al actualizar proveedor:", error);
    return { message: `Error al actualizar proveedor: ${error.message}`, success: false };
  }
}

export async function obtenerProveedoresHabilitados() {
  await connectDB();
  try {
    const proveedores = await Proveedor.find({ habilitado: true }).lean();
    // Deep clone and serialize to ensure all fields are plain objects/primitives
    const serializedProveedores = JSON.parse(JSON.stringify(proveedores));
    return {
      proveedores: serializedProveedores,
      success: true
    };
  } catch (error) {
    logger.error("Error al obtener proveedores habilitados:", error);
    return { proveedores: [], success: false, message: "Error al obtener proveedores habilitados." };
  }
}

export async function obtenerProveedores() {
  await connectDB();
  try {
    const proveedores = await Proveedor.find({}).lean();
    return {
      proveedores: proveedores.map(p => ({
        ...p,
        _id: p._id.toString(),
        userId: p.userId ? p.userId.toString() : null, // Convert userId to string
        createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : null,
        updatedAt: p.updatedAt ? new Date(p.updatedAt).toISOString() : null,
      })),
      success: true
    };
  } catch (error) {
    logger.error("Error al obtener todos los proveedores:", error);
    return { proveedores: [], success: false, message: "Error al obtener todos los proveedores." };
  }
}

export async function obtenerProveedorPorId(id) {
  await connectDB();
  try {
    const proveedor = await Proveedor.findById(id).lean();
    if (!proveedor) {
      return { proveedor: null, success: false, message: "Proveedor no encontrado." };
    }
    return {
      proveedor: {
        ...proveedor,
        _id: proveedor._id.toString(),
        createdAt: proveedor.createdAt ? new Date(proveedor.createdAt).toISOString() : null,
        updatedAt: proveedor.updatedAt ? new Date(proveedor.updatedAt).toISOString() : null,
      },
      success: true
    };
  } catch (error) {
    logger.error("Error al obtener proveedor por ID:", error);
    return { proveedor: null, success: false, message: "Error al obtener proveedor por ID." };
  }
}

export async function eliminarProveedor(prevState, formData) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.rol !== Rol.ADMINISTRADOR) {
    return { message: "Acceso denegado. Solo los administradores pueden eliminar proveedores.", success: false };
  }

  await connectDB();
  try {
    const id = formData.get("id");
    const result = await Proveedor.findByIdAndDelete(id);
    if (!result) {
      return { message: "Proveedor no encontrado para eliminar.", success: false };
    }
    revalidatePath("/admin/proveedores");
    return { message: "Proveedor eliminado exitosamente.", success: true };
  } catch (error) {
    logger.error("Error al eliminar proveedor:", error);
    return { message: `Error al eliminar proveedor: ${error.message}`, success: false };
  }
}

export async function obtenerMiPerfilProveedor() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return { proveedor: null, success: false, message: "No hay sesión de usuario o email disponible." };
  }

  await connectDB();
  try {
    // Assuming the provider's email is stored in the session user object
    const proveedor = await Proveedor.findOne({ emailContacto: session.user.email }).lean();

    if (!proveedor) {
      return { proveedor: null, success: false, message: "Perfil de proveedor no encontrado." };
    }

    return {
      proveedor: {
        ...proveedor,
        _id: proveedor._id.toString(),
        createdAt: proveedor.createdAt ? new Date(proveedor.createdAt).toISOString() : null,
        updatedAt: proveedor.updatedAt ? new Date(proveedor.updatedAt).toISOString() : null,
      },
      success: true
    };
  } catch (error) {
    logger.error("Error al obtener el perfil del proveedor:", error);
    return { proveedor: null, success: false, message: `Error al obtener el perfil del proveedor: ${error.message}` };
  }
}
