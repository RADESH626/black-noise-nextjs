import { NextResponse } from 'next/server';
import dbConnect from '@/utils/DBconection';
import Proveedor from '@/models/Proveedor';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(request) {
    await dbConnect();
    // No necesitamos sesión para ver la lista pública de proveedores
    
    try {
        // Solo traer proveedores activos (con disponibilidad DISPONIBLE)
        const proveedores = await Proveedor.find({ disponibilidad: 'DISPONIBLE' })
            .select('nombreProveedor especialidad') // Solo campos públicos
            .lean(); // Convertir a JSON plano para mejor rendimiento

        return NextResponse.json(proveedores);
    } catch (error) {
        console.error('Error al obtener proveedores:', error);
        return NextResponse.json(
            { message: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}

// Para crear nuevos proveedores, se hace a través del proceso de solicitud
// No exponemos un endpoint POST aquí
