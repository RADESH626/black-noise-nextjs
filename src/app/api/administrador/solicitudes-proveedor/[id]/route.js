import { NextResponse } from 'next/server';
import dbConnect from '@/utils/DBconection';
import SolicitudProveedor from '@/models/SolicitudProveedor';
import Proveedor from '@/models/Proveedor';
import Usuario from '@/models/Usuario';
import { EstadoSolicitudProveedor } from '@/models/enums/SolicitudProveedorEnums';
import { Rol } from '@/models/enums/usuario/Rol';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route'; // Asegúrate de que esta ruta sea correcta

export async function PUT(request, { params }) {
    await dbConnect();
<<<<<<< HEAD
    const session = await getServerSession(authOptions);

    // Solo administradores pueden aprobar/rechazar solicitudes
    if (!session || session.user.rol !== Rol.ADMINISTRADOR) {
        return NextResponse.json({ message: 'Acceso denegado. Se requiere rol de administrador.' }, { status: 403 });
    }
=======
    // Temporarily disable session and role validation for development
    // const session = await getServerSession(authOptions);

    // // Solo administradores pueden aprobar/rechazar solicitudes
    // if (!session || session.user.rol !== Rol.ADMINISTRADOR) {
    //     return NextResponse.json({ message: 'Acceso denegado. Se requiere rol de administrador.' }, { status: 403 });
    // }
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d

    const { id } = params;
    const { action, adminNotas } = await request.json(); // 'action' puede ser 'aprobar' o 'rechazar'

    try {
        const solicitud = await SolicitudProveedor.findById(id);

        if (!solicitud) {
            return NextResponse.json({ message: 'Solicitud no encontrada.' }, { status: 404 });
        }

        if (solicitud.estadoSolicitud !== EstadoSolicitudProveedor.PENDIENTE) {
            return NextResponse.json({ message: 'La solicitud ya ha sido procesada.' }, { status: 400 });
        }

        solicitud.fechaRevision = new Date();
        solicitud.adminNotas = adminNotas;

        if (action === 'aprobar') {
            solicitud.estadoSolicitud = EstadoSolicitudProveedor.APROBADA;

            // Crear el nuevo proveedor
            const newProveedor = new Proveedor({
                usuarioId: solicitud.usuarioId,
                nombreProveedor: solicitud.nombreEmpresa, // Usar nombreEmpresa como nombreProveedor
                nit: solicitud.nit,
                direccionEmpresa: solicitud.direccionEmpresa,
                especialidad: solicitud.especialidad,
                disponibilidad: 'DISPONIBLE', // Por defecto disponible
                metodosPagoAceptados: solicitud.metodosPagoAceptados,
                comision: solicitud.comisionPropuesta,
                permisosDetallesCredito: false, // Por defecto false, se puede cambiar después
                rut: 'N/A' // Se decidió no incluir RUT por ahora, pero el schema lo requiere.
                          // Se puede eliminar del schema o poner un valor por defecto.
                          // Por ahora, lo pongo como 'N/A' para evitar errores de validación.
            });
            await newProveedor.save();

            // Actualizar el rol del usuario
            await Usuario.findByIdAndUpdate(solicitud.usuarioId, { rol: Rol.PROVEEDOR });

            // TODO: Enviar correo de aprobación
            return NextResponse.json({ message: 'Solicitud aprobada y proveedor creado.', proveedor: newProveedor }, { status: 200 });

        } else if (action === 'rechazar') {
            solicitud.estadoSolicitud = EstadoSolicitudProveedor.RECHAZADA;
            // TODO: Enviar correo de rechazo
            return NextResponse.json({ message: 'Solicitud rechazada.' }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'Acción no válida.' }, { status: 400 });
        }

        await solicitud.save();

    } catch (error) {
        console.error('Error al procesar solicitud de proveedor:', error);
        if (error.code === 11000) { // Duplicado de NIT en Proveedor si se intenta crear uno ya existente
            return NextResponse.json({ message: 'Error: Ya existe un proveedor con este NIT.' }, { status: 409 });
        }
        return NextResponse.json({ message: 'Error interno del servidor', error: error.message }, { status: 500 });
    }
}
