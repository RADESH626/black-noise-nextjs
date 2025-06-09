import Pedido from '@/models/Pedido';
import { NextResponse } from 'next/server';
import connectDB from '@/utils/DBconection';
import { validateRequiredFields } from '@/utils/validation';
import { handleError, ValidationError, NotFoundError } from '@/utils/errorHandler';
import { getByIdHandler, updateHandler, deleteHandler } from '@/utils/crudHandler';
import { withAuthorization } from '@/utils/authMiddleware';

export const GET = withAuthorization(getByIdHandler(Pedido), 'ADMINISTRADOR');

export const PUT = withAuthorization(async (request, { params }) => {
    try {
        await connectDB();
        const { id } = params;
        const data = await request.json();

        // Specific validations for Pedido model update (if any)
        if (data.estado) {
            validateRequiredFields(data, ['estado']); // Ensure estado is not empty if provided
        }
        // Add more specific validation if needed

        // Use the generic updateHandler
        const response = await updateHandler(Pedido)(request, { params });
        const responseBody = await response.json();

        return NextResponse.json(responseBody, { status: response.status });

    } catch (error) {
        const errorResponse = handleError(error, 'Error al actualizar el pedido');
        return NextResponse.json(errorResponse, { status: errorResponse.statusCode });
    }
}, 'ADMINISTRADOR');

export const DELETE = withAuthorization(deleteHandler(Pedido), 'ADMINISTRADOR');
