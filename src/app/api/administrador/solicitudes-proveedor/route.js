import { NextResponse } from 'next/server';
import dbConnect from '@/utils/DBconection';
import SolicitudProveedor from '@/models/SolicitudProveedor';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route'; // Asegúrate de que esta ruta sea correcta

export async function POST(request) {
    console.log('Backend: POST /api/solicitudes-proveedor iniciado.');
    await dbConnect();
    console.log('Backend: Conexión a DB establecida.');
<<<<<<< HEAD
    const session = await getServerSession(authOptions);

    if (!session) {
        console.log('Backend: Solicitud no autenticada. Retornando 401.');
        return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
    }
    console.log('Backend: Sesión de usuario encontrada:', session.user.id);
=======
    // Temporarily disable session validation for development
    // const session = await getServerSession(authOptions);

    // if (!session) {
    //     console.log('Backend: Solicitud no autenticada. Retornando 401.');
    //     return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
    // }
    // console.log('Backend: Sesión de usuario encontrada:', session.user.id);
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d

    try {
        const body = await request.json();
        console.log('Backend: Body de la solicitud recibido:', body);
        const { usuarioId, nombreEmpresa, nit, direccionEmpresa, especialidad, metodosPagoAceptados, comisionPropuesta, mensajeAdicional } = body;

<<<<<<< HEAD
        // Validar que el usuarioId de la sesión coincida con el enviado en el body
        if (session.user.id !== usuarioId) {
            console.log('Backend: ID de usuario no coincide con la sesión. Retornando 403.');
            return NextResponse.json({ message: 'ID de usuario no coincide con la sesión' }, { status: 403 });
        }
=======
        // Temporarily disable session user ID validation for development
        // if (session.user.id !== usuarioId) {
        //     console.log('Backend: ID de usuario no coincide con la sesión. Retornando 403.');
        //     return NextResponse.json({ message: 'ID de usuario no coincide con la sesión' }, { status: 403 });
        // }
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d

        // Opcional: Validar si ya existe una solicitud pendiente para este usuario
        const existingPendingRequest = await SolicitudProveedor.findOne({ usuarioId, estadoSolicitud: 'PENDIENTE' });
        if (existingPendingRequest) {
            console.log('Backend: Ya existe una solicitud pendiente para este usuario. Retornando 409.');
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

        console.log('Backend: Creando nueva solicitud:', newSolicitud);
        await newSolicitud.save();
        console.log('Backend: Solicitud guardada con éxito.');

        return NextResponse.json({ message: 'Solicitud enviada con éxito', solicitud: newSolicitud }, { status: 201 });
    } catch (error) {
        console.error('Backend: Error al crear solicitud de proveedor:', error);
        if (error.code === 11000) { // Código de error de duplicado de MongoDB
            console.log('Backend: Error de duplicado (NIT). Retornando 409.');
            return NextResponse.json({ message: 'Ya existe una solicitud con este NIT.' }, { status: 409 });
        }
        console.log('Backend: Error interno del servidor. Retornando 500.');
        return NextResponse.json({ message: 'Error interno del servidor', error: error.message }, { status: 500 });
    }
}

export async function GET(request) {
    await dbConnect();
<<<<<<< HEAD
    const session = await getServerSession(authOptions);

    // Solo administradores pueden ver las solicitudes
    if (!session || session.user.rol !== 'ADMINISTRADOR') { // Asumiendo que el rol de admin es 'ADMINISTRADOR'
        return NextResponse.json({ message: 'Acceso denegado. Se requiere rol de administrador.' }, { status: 403 });
    }
=======
    // Temporarily disable session and role validation for development
    // const session = await getServerSession(authOptions);

    // // Solo administradores pueden ver las solicitudes
    // if (!session || session.user.rol !== 'ADMINISTRADOR') { // Asumiendo que el rol de admin es 'ADMINISTRADOR'
    //     return NextResponse.json({ message: 'Acceso denegado. Se requiere rol de administrador.' }, { status: 403 });
    // }
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d

    try {
        const solicitudes = await SolicitudProveedor.find({}).populate('usuarioId', 'primerNombre primerApellido correo'); // Popula info básica del usuario
        return NextResponse.json(solicitudes, { status: 200 });
    } catch (error) {
        console.error('Error al obtener solicitudes de proveedor:', error);
        return NextResponse.json({ message: 'Error interno del servidor', error: error.message }, { status: 500 });
    }
}
