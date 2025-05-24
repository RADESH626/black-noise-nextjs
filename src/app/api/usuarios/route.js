import Usuario from '@/models/Usuario'
import { NextResponse }  from 'next/server'
import connectDB from '@/utils/DBconection'

export async function GET() {
    try {
        await connectDB();
        
        // Ensure we're using the model after connection
        const usuarios = await Usuario.find({})
            .lean()
            .sort({ createdAt: -1 }) // Sort by most recent first
            .exec();
            
        console.log('Found usuarios:', usuarios ? usuarios.length : 0);
        
        // Transform the data to ensure proper serialization
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
        connectDB()
        const data = await request.json()
        const NuevoUsuario = new Usuario(data)
        console.log('Nuevo usuario:', NuevoUsuario)
        const UsuarioGuardado = await NuevoUsuario.save()

        console.log('Usuario guardado:', UsuarioGuardado)
        return NextResponse.json(UsuarioGuardado)
        
    } catch (error) {
        console.log('Error al guardar el usuario:', error.message)
        return NextResponse.json({ message: 'error al guardar el usuario', error: error.message })
    }
    
}
