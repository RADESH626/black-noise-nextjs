import Proveedor from '@/models/Proveedor';
import { NextResponse } from 'next/server';
import connectDB from '@/utils/DBconection';
import { validateRequiredFields, validateEmail } from '@/utils/validation';
import { handleError, ValidationError, NotFoundError } from '@/utils/errorHandler';
import { getByIdHandler, updateHandler, deleteHandler } from '@/utils/crudHandler';
import { withAuthorization } from '@/utils/authMiddleware';

export const GET = withAuthorization(getByIdHandler(Proveedor), 'ADMINISTRADOR');

export const PUT = withAuthorization(async (request, { params }) => {
    try {
        await connectDB();
        const { id } = params;
        const data = await request.json();

        // Specific validations for Proveedor model update
        if (data.correo) {
            validateEmail(data.correo);
            const proveedorExistente = await Proveedor.findOne({ correo: data.correo, _id: { $ne: id } });
            if (proveedorExistente) {
                throw new ValidationError('El correo electrónico ya está registrado por otro proveedor');
            }
        }

        // Use the generic updateHandler
        const response = await updateHandler(Proveedor)(request, { params });
        const responseBody = await response.json();

        return NextResponse.json(responseBody, { status: response.status });

    } catch (error) {
        const errorResponse = handleError(error, 'Error al actualizar el proveedor');
        return NextResponse.json(errorResponse, { status: errorResponse.statusCode });
    }
}, 'ADMINISTRADOR');

export const DELETE = withAuthorization(deleteHandler(Proveedor), 'ADMINISTRADOR');
