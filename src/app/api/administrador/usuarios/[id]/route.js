import Usuario from '@/models/Usuario';
import { NextResponse } from 'next/server';
import connectDB from '@/utils/DBconection';
import { validateRequiredFields, validateEmail, validatePassword } from '@/utils/validation';
import { handleError, ValidationError, NotFoundError } from '@/utils/errorHandler';
import { getByIdHandler, updateHandler, deleteHandler } from '@/utils/crudHandler';
import { withAuthorization } from '@/utils/authMiddleware';
import bcrypt from 'bcryptjs';

export const GET = withAuthorization(getByIdHandler(Usuario), 'ADMINISTRADOR');

export const PUT = withAuthorization(async (request, { params }) => {
    try {
        await connectDB();
        const { id } = params;
        const data = await request.json();

        // Specific validations for Usuario model update
        if (data.correo) {
            validateEmail(data.correo);
            const usuarioExistente = await Usuario.findOne({ correo: data.correo, _id: { $ne: id } });
            if (usuarioExistente) {
                throw new ValidationError('El correo electrónico ya está registrado por otro usuario');
            }
        }

        if (data.password) {
            validatePassword(data.password);
            data.password = await bcrypt.hash(data.password, 10);
        }

        // Use the generic updateHandler
        const response = await updateHandler(Usuario)(request, { params });
        const responseBody = await response.json();

        if (responseBody.success) {
            if (responseBody.data && responseBody.data.password) {
                delete responseBody.data.password;
            }
            return NextResponse.json(responseBody, { status: response.status });
        } else {
            return NextResponse.json(responseBody, { status: response.status });
        }

    } catch (error) {
        const errorResponse = handleError(error, 'Error al actualizar el usuario');
        return NextResponse.json(errorResponse, { status: errorResponse.statusCode });
    }
}, 'ADMINISTRADOR');

export const DELETE = withAuthorization(deleteHandler(Usuario), 'ADMINISTRADOR');
