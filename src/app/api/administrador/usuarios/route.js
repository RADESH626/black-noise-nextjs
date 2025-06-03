import Usuario from '@/models/Usuario'
import { NextResponse } from 'next/server'
import connectDB from '@/utils/DBconection'
import bcrypt from 'bcryptjs'

export async function GET() {
    try {
        await connectDB();
        
        const usuarios = await Usuario.find({})
            .lean()
            .sort({ createdAt: -1 })
            .exec();
            
        console.log('Found usuarios:', usuarios ? usuarios.length : 0);
        
        const serializedUsers = usuarios.map(user => ({
            ...user,
            _id: user._id.toString(),
            fechaNacimiento: user.fechaNacimiento ? user.fechaNacimiento.toISOString().split('T')[0] : null,
            createdAt: user.createdAt ? user.createdAt.toISOString() : null,
            updatedAt: user.updatedAt ? user.updatedAt.toISOString() : null
        }));

        return NextResponse.json({ 
            usuarios: serializedUsers,
            count: serializedUsers.length 
        });
    } catch (error) {
        console.error('Error fetching usuarios:', error);
        return NextResponse.json(
            { error: 'Error fetching users', usuarios: [] }, 
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        await connectDB();

        // Get JSON data
        const data = await request.json();
        console.log('Received data:', data);
        
        // Add required fields
        data.nombreUsuario = `${data.primerNombre}${Math.floor(1000 + Math.random() * 9000)}`;
        data.rol = 'CLIENTE';
        data.habilitado = true;

        console.log('Datos recibidos:', data);
        
        // Verificar si el correo ya existe
        const usuarioExistente = await Usuario.findOne({ correo: data.correo });
        if (usuarioExistente) {
            return NextResponse.json(
                { error: 'El correo electrónico ya está registrado' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;

        const NuevoUsuario = new Usuario(data);
        const UsuarioGuardado = await NuevoUsuario.save();

        // Convert to plain object and remove password
        const usuarioResponse = UsuarioGuardado.toObject();
        delete usuarioResponse.password;

        return NextResponse.json({
            success: true,
            message: 'Usuario registrado exitosamente',
            usuario: usuarioResponse
        }, { status: 201 });
        
    } catch (error) {
        console.error('Error al guardar el usuario:', error);
        return NextResponse.json(
            { 
                error: 'Error al crear el usuario',
                details: error.message 
            },
            { status: 500 }
        );
    }
}
