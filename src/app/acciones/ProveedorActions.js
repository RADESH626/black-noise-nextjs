"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/utils/DBconection";
import Proveedor from "@/models/Proveedor";
import { revalidatePath } from "next/cache";
import { Rol } from "@/models/enums/usuario/Rol";

export async function crearProveedor(prevState, formData) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.rol !== Rol.ADMINISTRADOR) {
    return { message: "Acceso denegado. Solo los administradores pueden crear proveedores.", success: false };
  }

  await connectDB();

  try {
    const nombreProveedor = formData.get("nombreProveedor");
    const nit = formData.get("nit");
    const direccionEmpresa = formData.get("direccionEmpresa");
    const especialidad = formData.get("especialidad");
    const comision = formData.get("comision");
    const contacto = formData.get("contacto"); // Assuming these are still needed for contact info
    const telefono = formData.get("telefono");
    const email = formData.get("email");
    const direccion = formData.get("direccion"); // This seems to be a general contact address, not the company address

    if (!nombreProveedor || !nit || !direccionEmpresa || !especialidad || !comision || !contacto || !telefono || !email || !direccion) {
      return { message: "Todos los campos son obligatorios.", success: false };
    }

    const nuevoProveedor = new Proveedor({
      nombreProveedor,
      nit,
      direccionEmpresa,
      especialidad,
      comision: parseFloat(comision), // Ensure commission is a number
      contacto,
      telefono,
      email,
      direccion,
      habilitado: true, // New providers are enabled by default
    });

    await nuevoProveedor.save();

    revalidatePath("/admin/proveedores");
    return { message: "Proveedor creado exitosamente.", success: true };
  } catch (error) {
    console.error("Error al crear proveedor:", error);
    return { message: `Error al crear proveedor: ${error.message}`, success: false };
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
