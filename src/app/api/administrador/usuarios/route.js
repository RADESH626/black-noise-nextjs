import Usuario from '@/models/Usuario';
import { NextResponse } from 'next/server';
import connectDB from '@/utils/DBconection';
import { validateRequiredFields, validateEmail, validatePassword } from '@/utils/validation';
import { handleError, ValidationError } from '@/utils/errorHandler';
import { getAllHandler } from '@/utils/crudHandler'; // Only getAllHandler is used from crudHandler
import { withAuthorization } from '@/utils/authMiddleware';
import bcrypt from 'bcryptjs';

export const GET = withAuthorization(getAllHandler(Usuario), 'ADMINISTRADOR');

const postHandler = async (request) => {
    try {
        await connectDB();

        const data = await request.json();

        validateRequiredFields(data, ['primerNombre', 'apellido', 'correo', 'password']);
        validateEmail(data.correo);
        validatePassword(data.password);
        
        data.nombreUsuario = `${data.primerNombre}${Math.floor(1000 + Math.random() * 9000)}`;
        data.rol = 'CLIENTE';
        data.habilitado = true;

        const usuarioExistente = await Usuario.findOne({ correo: data.correo });
        if (usuarioExistente) {
            throw new ValidationError('El correo electrónico ya está registrado');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;

        const NuevoUsuario = new Usuario(data);
        const UsuarioGuardado = await NuevoUsuario.save();

        const usuarioResponse = UsuarioGuardado.toObject();
        delete usuarioResponse.password;

        return NextResponse.json({
            success: true,
            message: 'Usuario registrado exitosamente',
            usuario: usuarioResponse
        }, { status: 201 });
        
    } catch (error) {
        if (error instanceof ValidationError) {
            return handleError(error, error.message, error.statusCode);
        }
        return handleError(error, 'Error al crear el usuario');
    }
};

export const POST = withAuthorization(postHandler, 'ADMINISTRADOR');
