import Pago from '@/models/Pago';
import { NextResponse } from 'next/server';
import connectDB from '@/utils/DBconection';
import { validateRequiredFields } from '@/utils/validation';
import { handleError, ValidationError, NotFoundError } from '@/utils/errorHandler';
import { getByIdHandler, updateHandler, deleteHandler } from '@/utils/crudHandler';
import { withAuthorization } from '@/utils/authMiddleware';

export const GET = withAuthorization(getByIdHandler(Pago), 'ADMINISTRADOR');

export const PUT = withAuthorization(async (request, { params }) => {
    try {
        await connectDB();
        const { id } = params;
        const data = await request.json();

        // Specific validations for Pago model update (if any)
        if (data.monto) {
            validateRequiredFields(data, ['monto']); // Ensure monto is not empty if provided
        }
        // Add more specific validation if needed

        // Use the generic updateHandler
        const response = await updateHandler(Pago)(request, { params });
        const responseBody = await response.json();

        return NextResponse.json(responseBody, { status: response.status });

    } catch (error) {
        const errorResponse = handleError(error, 'Error al actualizar el pago');
        return NextResponse.json(errorResponse, { status: errorResponse.statusCode });
    }
}, 'ADMINISTRADOR');

export const DELETE = withAuthorization(deleteHandler(Pago), 'ADMINISTRADOR');
