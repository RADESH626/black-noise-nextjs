import { NextResponse } from 'next/server';
import dbConnect from '@/utils/DBconection';
import Proveedor from '@/models/Proveedor';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { Rol } from '@/models/enums/usuario/Rol';

export async function GET(request) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
    }

    if (session.user.rol !== Rol.PROVEEDOR) {
        return NextResponse.json({ message: 'Acceso denegado. Se requiere rol de proveedor.' }, { status: 403 });
    }

    try {
        const proveedor = await Proveedor.findOne({ usuarioId: session.user.id });

        if (!proveedor) {
            return NextResponse.json({ message: 'Perfil de proveedor no encontrado.' }, { status: 404 });
        }

        return NextResponse.json(proveedor);
    } catch (error) {
        console.error('Error al obtener perfil de proveedor:', error);
        return NextResponse.json(
            { message: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
    }

    if (session.user.rol !== Rol.PROVEEDOR) {
        return NextResponse.json({ message: 'Acceso denegado. Se requiere rol de proveedor.' }, { status: 403 });
    }

    try {
        const body = await request.json();
        const {
            nombreProveedor,
            direccionEmpresa,
            metodosPagoAceptados,
            disponibilidad,
            permisosDetallesCredito
        } = body;

        // Buscar el proveedor actual
        const proveedor = await Proveedor.findOne({ usuarioId: session.user.id });

        if (!proveedor) {
            return NextResponse.json({ message: 'Perfil de proveedor no encontrado.' }, { status: 404 });
        }

        // Actualizar solo los campos permitidos
        // No permitimos actualizar campos críticos como nit, especialidad, comision
        const updateData = {
            ...(nombreProveedor && { nombreProveedor }),
            ...(direccionEmpresa && { direccionEmpresa }),
            ...(metodosPagoAceptados && { metodosPagoAceptados }),
            ...(disponibilidad && { disponibilidad }),
            ...(typeof permisosDetallesCredito === 'boolean' && { permisosDetallesCredito })
        };

        const updatedProveedor = await Proveedor.findByIdAndUpdate(
            proveedor._id,
            updateData,
            { new: true }
        );

        return NextResponse.json(updatedProveedor);
    } catch (error) {
        console.error('Error al actualizar perfil de proveedor:', error);
        return NextResponse.json(
            { message: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
