import { NextResponse } from 'next/server';
import dbConnect from '@/utils/DBconection';
import SolicitudProveedor from '@/models/SolicitudProveedor';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route'; // Ensure this path is correct

export async function POST(request) {
    console.log('Backend: POST /api/solicitud-proveedor iniciado.');
    await dbConnect();
    console.log('Backend: Conexión a DB establecida.');
    // Temporarily disable session validation for development
    // const session = await getServerSession(authOptions);

    // if (!session) {
    //     console.log('Backend: Solicitud no autenticada. Retornando 401.');
    //     return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
    // }
    // console.log('Backend: Sesión de usuario encontrada:', session.user.id);

    try {
        const body = await request.json();
        console.log('Backend: Body de la solicitud recibido:', body);
        const { usuarioId, nombreEmpresa, nit, direccionEmpresa, especialidad, metodosPagoAceptados, comisionPropuesta, mensajeAdicional } = body;

        // Temporarily disable session user ID validation for development
        // if (session.user.id !== usuarioId) {
        //     console.log('Backend: User ID does not match session. Returning 403.');
        //     return NextResponse.json({ message: 'User ID does not match session' }, { status: 403 });
        // }

        // Optional: Validate if a pending request already exists for this user
        const existingPendingRequest = await SolicitudProveedor.findOne({ usuarioId, estadoSolicitud: 'PENDIENTE' });
        if (existingPendingRequest) {
            console.log('Backend: A pending request already exists for this user. Returning 409.');
            return NextResponse.json({ message: 'You already have a pending request.' }, { status: 409 });
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
            // estadoSolicitud defaults to PENDIENTE in the model
        });

        console.log('Backend: Creating new request:', newSolicitud);
        await newSolicitud.save();
        console.log('Backend: Request saved successfully.');

        return NextResponse.json({ message: 'Request sent successfully', solicitud: newSolicitud }, { status: 201 });
    } catch (error) {
        console.error('Backend: Error creating supplier request:', error);
        if (error.code === 11000) { // MongoDB duplicate key error code
            console.log('Backend: Duplicate error (NIT). Returning 409.');
            return NextResponse.json({ message: 'A request with this NIT already exists.' }, { status: 409 });
        }
        console.log('Backend: Internal server error. Returning 500.');
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
}
