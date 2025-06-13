import Usuario from '@/models/Usuario';
import { NextResponse } from 'next/server';
import connectDB from '@/utils/DBconection';
import { validateRequiredFields, validateEmail, validatePassword } from '@/utils/validation';
import { handleError, ValidationError } from '@/utils/errorHandler';
import { createHandler, getAllHandler } from '@/utils/crudHandler';
import { withAuthorization } from '@/utils/authMiddleware';
import bcrypt from 'bcryptjs';

export const GET = withAuthorization(getAllHandler(Usuario), 'ADMINISTRADOR');

export const POST = withAuthorization(async (request) => {
    try {
        await connectDB();
        const data = await request.json();

        // Specific validations for Usuario model
        validateRequiredFields(data, ['primerNombre', 'primerApellido', 'correo', 'password']);
        validateEmail(data.correo);
        validatePassword(data.password);

        const usuarioExistente = await Usuario.findOne({ correo: data.correo });
        if (usuarioExistente) {
            throw new ValidationError('El correo electrónico ya está registrado');
        }

        // Hash password and set default values
        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;
        data.nombreUsuario = `${data.primerNombre}${Math.floor(1000 + Math.random() * 9000)}`;
        data.rol = data.rol || 'CLIENTE'; // Allow role to be set if provided, otherwise default to CLIENTE
        data.habilitado = true;

        // Use the generic createHandler
        const response = await createHandler(Usuario)(request);
        const responseBody = await response.json(); // Parse the response to get the actual body

        if (responseBody.success) {
            // Remove password from the response data for security
            if (responseBody.data && responseBody.data.password) {
                delete responseBody.data.password;
            }
            return NextResponse.json(responseBody, { status: response.status });
        } else {
            return NextResponse.json(responseBody, { status: response.status });
        }

    } catch (error) {
        // Use handleError from errorHandler.js
        const errorResponse = handleError(error, 'Error al crear el usuario');
        return NextResponse.json(errorResponse, { status: errorResponse.statusCode });
    }
}, 'ADMINISTRADOR');
