"use server"

import connectDB from '@/utils/DBconection';
import SolicitudProveedor from '@/models/SolicitudProveedor';
import Usuario from '@/models/Usuario'; // Necesario para popular
import Proveedor from '@/models/Proveedor'; // Necesario para crear proveedor si se aprueba
import { revalidatePath } from 'next/cache';
import { EstadoSolicitud } from '@/models/enums/SolicitudProveedorEnums';
import { Disponibilidad } from '@/models/enums/proveedor'; // Para el nuevo proveedor

// Crear una nueva solicitud de proveedor (generalmente por un usuario no admin)
async function crearSolicitudProveedor(data) {
    console.log('Iniciando la función crearSolicitudProveedor');
    try {
        await connectDB();
        const nuevaSolicitud = new SolicitudProveedor(data);
        const solicitudGuardada = await nuevaSolicitud.save();
        // Podría revalidar una página de "mis solicitudes" para el usuario
        return { success: true, data: JSON.parse(JSON.stringify(solicitudGuardada)) };
    } catch (error) {
        console.error('Error al crear la solicitud de proveedor:', error);
        if (error.code === 11000) { // Error de duplicado (ej. NIT si se hiciera unique en solicitud)
            return { error: 'Error al crear la solicitud: Ya existe una solicitud con datos similares.' };
        }
        return { error: 'Error al crear la solicitud de proveedor: ' + error.message };
    }
}

// Obtener todas las solicitudes de proveedor
async function obtenerSolicitudesProveedor() {
    console.log('Iniciando la función obtenerSolicitudesProveedor');
    try {
        await connectDB();
        const solicitudes = await SolicitudProveedor.find({})
            .populate('solicitanteId', 'nombreUsuario correo')
            .populate('revisorId', 'nombreUsuario correo')
            .sort({ fechaSolicitud: -1 }) // Más recientes primero
            .lean();
        return { solicitudes: JSON.parse(JSON.stringify(solicitudes)) };
    } catch (error) {
        console.error('Error al obtener las solicitudes de proveedor:', error);
        return { error: 'Error al obtener las solicitudes de proveedor: ' + error.message };
    }
}

// Obtener solicitud de proveedor por ID
async function ObtenerSolicitudProveedorPorId(id) {
    console.log('Iniciando la función ObtenerSolicitudProveedorPorId');
    try {
        await connectDB();
        const solicitud = await SolicitudProveedor.findById(id)
            .populate('solicitanteId', 'nombreUsuario correo telefono')
            .populate('revisorId', 'nombreUsuario correo')
            .lean();
        if (!solicitud) {
            return { error: 'Solicitud de proveedor no encontrada' };
        }
        return JSON.parse(JSON.stringify(solicitud));
    } catch (error) {
        console.error('Error al obtener la solicitud de proveedor:', error);
        return { error: 'Error al obtener la solicitud de proveedor: ' + error.message };
    }
}

// Revisar/Actualizar estado de una solicitud de proveedor (Aprobar/Rechazar)
async function revisarSolicitudProveedor(id, revisorId, nuevoEstado, comentariosAdmin, datosProveedorAdicionales = {}) {
    console.log('Iniciando la función revisarSolicitudProveedor');
    try {
        await connectDB();
        if (!Object.values(EstadoSolicitud).includes(nuevoEstado)) {
            return { error: 'Estado de solicitud no válido.' };
        }

        const updateData = {
            estadoSolicitud: nuevoEstado,
            revisorId: revisorId,
            fechaRevision: new Date(),
            comentariosAdmin: comentariosAdmin || ''
        };

        const solicitudActualizada = await SolicitudProveedor.findByIdAndUpdate(id, updateData, { new: true }).lean();

        if (!solicitudActualizada) {
            return { error: 'Solicitud no encontrada para actualizar.' };
        }

        // Si se aprueba, crear el Proveedor
        if (nuevoEstado === EstadoSolicitud.ACEPTADA) {
            const { solicitanteId, nombreProveedor, nit, direccionEmpresa, rut, especialidad } = solicitudActualizada;
            
            // Usar datos de la solicitud y los adicionales si se proporcionan
            const datosProveedor = {
                nombreProveedor,
                nit,
                direccionEmpresa,
                rut,
                usuarioId: solicitanteId, // El solicitante se convierte en el usuario asociado al proveedor
                especialidad,
                disponibilidad: Disponibilidad.DISPONIBLE, // Por defecto
                metodosPagoAceptados: datosProveedorAdicionales.metodosPagoAceptados || [],
                comision: datosProveedorAdicionales.comision || 0, // Se debe definir una comisión base o pedirla
                permisosDetallesCredito: datosProveedorAdicionales.permisosDetallesCredito || false,
            };
            
            const nuevoProveedor = new Proveedor(datosProveedor);
            await nuevoProveedor.save();
            revalidatePath('/admin/proveedores'); // Revalidar lista de proveedores
        }

        revalidatePath('/admin/solicitudes-proveedor');
        revalidatePath(`/admin/solicitudes-proveedor/editar/${id}`);
        return { success: true, data: JSON.parse(JSON.stringify(solicitudActualizada)) };
    } catch (error) {
        console.error('Error al revisar la solicitud de proveedor:', error);
        if (error.code === 11000 && nuevoEstado === EstadoSolicitud.ACEPTADA) {
             return { error: 'Error al crear el proveedor: Ya existe un proveedor con ese NIT.' };
        }
        return { error: 'Error al revisar la solicitud: ' + error.message };
    }
}


export {
    crearSolicitudProveedor, // Para que los usuarios puedan crearla
    obtenerSolicitudesProveedor,
    ObtenerSolicitudProveedorPorId,
    revisarSolicitudProveedor,
    eliminarSolicitudProveedor // Export the new action
};

// Eliminar una solicitud de proveedor por ID
async function eliminarSolicitudProveedor(id) {
    console.log('Iniciando la función eliminarSolicitudProveedor');
    try {
        await connectDB();
        const deletedSolicitud = await SolicitudProveedor.findByIdAndDelete(id);
        if (!deletedSolicitud) {
            return { error: 'Solicitud de proveedor no encontrada para eliminar.' };
        }
        revalidatePath('/admin/solicitudes-proveedor'); // Revalidate the list page
        return { success: true, message: 'Solicitud de Proveedor eliminada exitosamente.' };
    } catch (error) {
        console.error('Error al eliminar la solicitud de proveedor:', error);
        return { error: 'Error al eliminar la solicitud de proveedor: ' + error.message };
    }
}
