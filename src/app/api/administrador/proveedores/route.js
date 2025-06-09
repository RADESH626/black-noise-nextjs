import Proveedor from '@/models/Proveedor';
import { NextResponse } from 'next/server';
import connectDB from '@/utils/DBconection';
import { createHandler, getAllHandler } from '@/utils/crudHandler';
import { handleError, ValidationError } from '@/utils/errorHandler';
import { validateRequiredFields, validateEmail } from '@/utils/validation';
import { withAuthorization } from '@/utils/authMiddleware';

export const GET = withAuthorization(getAllHandler(Proveedor), 'ADMINISTRADOR');

export const POST = withAuthorization(async (request) => {
    try {
        await connectDB();
        const data = await request.json();

        // Specific validations for Proveedor model
        validateRequiredFields(data, ['nombreEmpresa', 'correo']);
        validateEmail(data.correo);

        const proveedorExistente = await Proveedor.findOne({ correo: data.correo });
        if (proveedorExistente) {
            throw new ValidationError('El correo electrónico ya está registrado para otro proveedor');
        }

        // Use the generic createHandler
        const response = await createHandler(Proveedor)(request);
        const responseBody = await response.json();

        return NextResponse.json(responseBody, { status: response.status });

    } catch (error) {
        const errorResponse = handleError(error, 'Error al crear el proveedor');
        return NextResponse.json(errorResponse, { status: errorResponse.statusCode });
    }
}, 'ADMINISTRADOR');
