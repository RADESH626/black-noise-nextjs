"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/utils/DBconection";
import Proveedor from "@/models/Proveedor";
import { revalidatePath } from "next/cache";
import { Rol } from "@/models/enums/usuario/Rol";
import bcrypt from "bcryptjs";

export async function crearProveedor(prevState, formData) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.rol !== Rol.ADMINISTRADOR) {
    return { message: "Acceso denegado. Solo los administradores pueden crear proveedores.", success: false };
  }

    await connectDB();

    try {
      const nombreEmpresa = formData.get("nombreEmpresa");
      const nit = formData.get("nit");
      const direccionEmpresa = formData.get("direccionEmpresa");
      const especialidad = formData.get("especialidad");
      const comision = formData.get("comision");
      const nombreDueño = formData.get("nombreDueño");
      const telefonoContacto = formData.get("telefonoContacto");
      const emailContacto = formData.get("emailContacto");
      const metodosPagoAceptados = formData.getAll("metodosPagoAceptados"); // Get all selected payment methods

      if (!nombreEmpresa || !nit || !direccionEmpresa || !especialidad || !comision || !nombreDueño || !telefonoContacto || !emailContacto || metodosPagoAceptados.length === 0) {
        return { message: "Todos los campos son obligatorios, incluyendo al menos un método de pago.", success: false };
      }

      // Generate a random access key for the new supplier
      const generatedAccessKey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const hashedAccessKey = await bcrypt.hash(generatedAccessKey, 10);

      const nuevoProveedor = new Proveedor({
        nombreEmpresa,
        nit,
        direccionEmpresa,
        especialidad,
        comision: parseFloat(comision), // Ensure commission is a number
        nombreDueño,
        telefonoContacto,
        emailContacto,
        metodosPagoAceptados, // Include the new field
        habilitado: true, // New providers are enabled by default
        accessKey: hashedAccessKey, // Store the hashed access key
      });

      await nuevoProveedor.save();

      // Send the access key to the provider's email
      const emailSubject = "Tu clave de acceso para el Portal de Proveedores Black Noise";
      const emailBody = `Hola ${nombreDueño},\n\nTu empresa ${nombreEmpresa} ha sido registrada como proveedor en Black Noise.\n\nTu clave de acceso para iniciar sesión en el portal de proveedores es: ${generatedAccessKey}\n\nPor favor, guarda esta clave en un lugar seguro. Puedes acceder al portal de proveedores en [URL del portal de proveedores].\n\nSaludos,\nEl equipo de Black Noise`;

      try {
        const emailApiUrl = `${process.env.NEXTAUTH_URL}/api/email`;
        const emailResponse = await fetch(emailApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: emailContacto,
            subject: emailSubject,
            body: emailBody,
          }),
        });

        const emailResult = await emailResponse.json();
        if (!emailResult.success) {
          console.warn("Advertencia: No se pudo enviar el correo electrónico al proveedor. Detalles:", emailResult.message);
          // Decide if you want to return an error here or just log a warning
        }
      } catch (emailError) {
        console.error("Error al intentar enviar el correo electrónico de la clave de acceso:", emailError);
        // Decide if you want to return an error here or just log a warning
      }

      revalidatePath("/admin/proveedores");
      return { message: "Proveedor creado exitosamente. La clave de acceso ha sido enviada al correo electrónico del proveedor.", success: true };
    } catch (error) {
      console.error("Error al crear proveedor:", error);
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
    console.error("Error al generar y guardar clave de acceso:", error);
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
    return { message: "Proveedor actualizado exitosamente.", success: true };
  } catch (error) {
    console.error("Error al actualizar proveedor:", error);
    return { message: `Error al actualizar proveedor: ${error.message}`, success: false };
  }
}

export async function obtenerProveedoresHabilitados() {
  await connectDB();
  try {
    const proveedores = await Proveedor.find({ habilitado: true }).lean();
    return {
      proveedores: proveedores.map(p => ({
        ...p,
        _id: p._id.toString(),
        createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : null,
        updatedAt: p.updatedAt ? new Date(p.updatedAt).toISOString() : null,
      })),
      success: true
    };
  } catch (error) {
    console.error("Error al obtener proveedores habilitados:", error);
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
        createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : null,
        updatedAt: p.updatedAt ? new Date(p.updatedAt).toISOString() : null,
      })),
      success: true
    };
  } catch (error) {
    console.error("Error al obtener todos los proveedores:", error);
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
    console.error("Error al obtener proveedor por ID:", error);
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
    console.error("Error al eliminar proveedor:", error);
    return { message: `Error al eliminar proveedor: ${error.message}`, success: false };
  }
}
