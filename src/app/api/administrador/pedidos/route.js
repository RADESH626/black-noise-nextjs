import Pedido from '@/models/Pedido';
import { NextResponse } from 'next/server';
import connectDB from '@/utils/DBconection';
import { createHandler, getAllHandler } from '@/utils/crudHandler';
import { handleError, ValidationError } from '@/utils/errorHandler';
import { validateRequiredFields } from '@/utils/validation';
import { withAuthorization } from '@/utils/authMiddleware';
<<<<<<< HEAD
import { NextRequest } from 'next/server';

export const GET = withAuthorization(async (request) => {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let filter = {};
    if (status === 'CANCELLED') {
        filter = { estadoPedido: 'CANCELADO' };
    } else if (status === 'ACTIVE') {
        filter = { estadoPedido: { $ne: 'CANCELADO' } };
    }

    return getAllHandler(Pedido, ['userId', 'proveedorId', 'items.designId'], filter)();
}, 'ADMINISTRADOR');
=======

export const GET = withAuthorization(getAllHandler(Pedido), 'ADMINISTRADOR');
>>>>>>> f416d78 (pantalla de carga)

export const POST = withAuthorization(async (request) => {
    try {
        await connectDB();
        const data = await request.json();

        // Specific validations for Pedido model
        validateRequiredFields(data, ['usuarioId', 'productos', 'total', 'estado', 'fechaPedido']);

        // Use the generic createHandler
        const response = await createHandler(Pedido)(request);
        const responseBody = await response.json();

        return NextResponse.json(responseBody, { status: response.status });

    } catch (error) {
        const errorResponse = handleError(error, 'Error al crear el pedido');
        return NextResponse.json(errorResponse, { status: errorResponse.statusCode });
    }
}, 'ADMINISTRADOR');
