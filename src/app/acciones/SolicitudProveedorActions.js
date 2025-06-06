"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust path if necessary
import connectDB from '@/utils/DBconection';
import SolicitudProveedor from '@/models/SolicitudProveedor';
import { revalidatePath } from 'next/cache';

export async function obtenerSolicitudesProveedor() {
    console.log('DEBUG: Entering obtenerSolicitudesProveedor.');
    try {
        await connectDB();
        const solicitudes = await SolicitudProveedor.find({}).lean();
        console.log('DEBUG: Provider requests retrieved:', solicitudes);
        return { solicitudes: JSON.parse(JSON.stringify(solicitudes)) };
    } catch (error) {
        console.error("ERROR in obtenerSolicitudesProveedor:", error);
        return { error: error.message };
    }
}

// Server Action para manejar la solicitud de proveedor (desde el frontend del usuario)
export async function submitSupplierApplicationAction(prevState, formData) {
  console.log('Server Action Supplier Application: Iniciado.');

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    console.log('Server Action Supplier Application: Usuario no autenticado.');
    return { message: 'Usuario no autenticado. Por favor, inicia sesión.', success: false };
  }

  const data = {
    nombreEmpresa: formData.get('nombreEmpresa'),
    nit: formData.get('nit'),
    direccionEmpresa: formData.get('direccionEmpresa'),
    especialidad: formData.get('especialidad'),
    metodosPagoAceptados: formData.getAll('metodosPagoAceptados'), // Use getAll for multiple checkboxes
    comisionPropuesta: parseFloat(formData.get('comisionPropuesta')),
    mensajeAdicional: formData.get('mensajeAdicional'),
    usuarioId: session.user.id,
  };

  console.log('Server Action Supplier Application: Datos recibidos:', data);

  try {
    await connectDB();
    const nuevaSolicitud = new SolicitudProveedor({
        ...data,
        estado: 'PENDIENTE', // Estado inicial
    });
    const solicitudGuardada = await nuevaSolicitud.save();
    revalidatePath('/solicitud-proveedor'); // Revalidate path for UI consistency
    revalidatePath('/admin/solicitudes-proveedor'); // Revalidate admin view
    return { message: '¡Solicitud enviada con éxito!', success: true, solicitud: JSON.parse(JSON.stringify(solicitudGuardada)) };

  } catch (error) {
    console.error("ERROR in submitSupplierApplicationAction:", error);
    if (error.code === 11000) { // Duplicate key error
        return { message: 'Ya existe una solicitud con este NIT o este usuario ya ha enviado una solicitud.', success: false };
    }
    return { message: error.message || 'Error al enviar la solicitud.', success: false };
  }
}


// Server Action para crear una solicitud de proveedor (desde el admin, si aplica)
export async function CrearSolicitudProveedor(data) {
    console.log('DEBUG: Entering CrearSolicitudProveedor with data:', data);
    try {
        await connectDB();
        const nuevaSolicitud = new SolicitudProveedor({
            ...data,
            estado: data.estado || 'PENDIENTE', // Permitir al admin establecer el estado inicial
        });
        const solicitudGuardada = await nuevaSolicitud.save();
        revalidatePath('/admin/solicitudes-proveedor');
        return { success: true, message: "Solicitud de proveedor creada exitosamente.", solicitud: JSON.parse(JSON.stringify(solicitudGuardada)) };
    } catch (error) {
        console.error("ERROR in CrearSolicitudProveedor:", error);
        if (error.code === 11000) {
            return { error: 'Ya existe una solicitud con este NIT o este usuario ya ha enviado una solicitud.' };
        }
        return { error: error.message };
    }
}

// Server Action para procesar (aprobar/rechazar) una solicitud de proveedor
export async function procesarSolicitudProveedor(solicitudId, action, adminNotas) {
    console.log('DEBUG: Entering procesarSolicitudProveedor with ID:', solicitudId, 'action:', action, 'adminNotas:', adminNotas);
    try {
        await connectDB();
        let updateData = { adminNotas };
        if (action === 'aprobar') {
            updateData.estado = 'APROBADO';
        } else if (action === 'rechazar') {
            updateData.estado = 'RECHAZADO';
        } else {
            return { error: 'Acción no válida.', success: false };
        }

        const solicitudActualizada = await SolicitudProveedor.findByIdAndUpdate(solicitudId, updateData, { new: true }).lean();

        if (!solicitudActualizada) {
            return { error: 'Solicitud de proveedor no encontrada.', success: false };
        }

        revalidatePath('/admin/solicitudes-proveedor');
        return { success: true, message: `Solicitud ${updateData.estado.toLowerCase()} exitosamente.`, solicitud: JSON.parse(JSON.stringify(solicitudActualizada)) };
    } catch (error) {
        console.error(`ERROR in procesarSolicitudProveedor (${action}):`, error);
        return { error: error.message };
    }
}

// Obtener solicitud por ID
export async function obtenerSolicitudProveedorPorId(id) {
    console.log('DEBUG: Entering obtenerSolicitudProveedorPorId with ID:', id);
    try {
        await connectDB();
        const solicitud = await SolicitudProveedor.findById(id).lean();
        if (!solicitud) {
            return { error: 'Solicitud no encontrada' };
        }
        return JSON.parse(JSON.stringify(solicitud));
    } catch (error) {
        console.error('ERROR in obtenerSolicitudProveedorPorId:', error);
        return { error: 'Error al obtener la solicitud: ' + error.message };
    }
}

// Eliminar solicitud de proveedor
export async function eliminarSolicitudProveedor(id) {
    console.log('DEBUG: Entering eliminarSolicitudProveedor with ID:', id);
    try {
        await connectDB();
        const solicitudEliminada = await SolicitudProveedor.findByIdAndDelete(id).lean();
        if (!solicitudEliminada) {
            return { error: 'Solicitud de proveedor no encontrada para eliminar' };
        }
        revalidatePath('/admin/solicitudes-proveedor');
        return { success: true, message: 'Solicitud de proveedor eliminada exitosamente.', solicitud: JSON.parse(JSON.stringify(solicitudEliminada)) };
    } catch (error) {
        console.error('ERROR in eliminarSolicitudProveedor:', error);
        return { error: 'Error al eliminar la solicitud: ' + error.message };
    }
}
