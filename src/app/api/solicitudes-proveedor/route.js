import { NextResponse } from 'next/server';
import dbConnect from '@/utils/DBconection';
import SolicitudProveedor from '@/models/SolicitudProveedor';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route'; // Asegúrate de que esta ruta sea correcta

export async function POST(request) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { usuarioId, nombreEmpresa, nit, direccionEmpresa, especialidad, metodosPagoAceptados, comisionPropuesta, mensajeAdicional } = body;

        // Validar que el usuarioId de la sesión coincida con el enviado en el body
        if (session.user.id !== usuarioId) {
            return NextResponse.json({ message: 'ID de usuario no coincide con la sesión' }, { status: 403 });
        }

        // Opcional: Validar si ya existe una solicitud pendiente para este usuario
        const existingPendingRequest = await SolicitudProveedor.findOne({ usuarioId, estadoSolicitud: 'PENDIENTE' });
        if (existingPendingRequest) {
            return NextResponse.json({ message: 'Ya tienes una solicitud pendiente.' }, { status: 409 });
        }

        const newSolicitud = new SolicitudProveedor({
            usuarioId,
            nombreEmpresa,
            nit,
            direccionEmpresa,
            especialidad,
            metodosPagoAceptados,
            comisionPropuesta,
            mensajeAdicional,
            // estadoSolicitud se establece por defecto a PENDIENTE en el modelo
        });

        await newSolicitud.save();

        return NextResponse.json({ message: 'Solicitud enviada con éxito', solicitud: newSolicitud }, { status: 201 });
    } catch (error) {
        console.error('Error al crear solicitud de proveedor:', error);
        if (error.code === 11000) { // Código de error de duplicado de MongoDB
            return NextResponse.json({ message: 'Ya existe una solicitud con este NIT.' }, { status: 409 });
        }
        return NextResponse.json({ message: 'Error interno del servidor', error: error.message }, { status: 500 });
    }
}

export async function GET(request) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    // Solo administradores pueden ver las solicitudes
    if (!session || session.user.rol !== 'ADMINISTRADOR') { // Asumiendo que el rol de admin es 'ADMINISTRADOR'
        return NextResponse.json({ message: 'Acceso denegado. Se requiere rol de administrador.' }, { status: 403 });
    }

    try {
        const solicitudes = await SolicitudProveedor.find({}).populate('usuarioId', 'primerNombre primerApellido correo'); // Popula info básica del usuario
        return NextResponse.json(solicitudes, { status: 200 });
    } catch (error) {
        console.error('Error al obtener solicitudes de proveedor:', error);
        return NextResponse.json({ message: 'Error interno del servidor', error: error.message }, { status: 500 });
    }
}
