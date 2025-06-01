// This is a placeholder for your new authentication implementation
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { ObtenerUsuarioPorCorreo } from '@/app/acciones/UsuariosActions';

export async function POST(request) {
  try {
    const { correo, password } = await request.json();

    if (!correo || !password) {
      return NextResponse.json(
        { message: 'Correo y contraseña son requeridos' },
        { status: 400 }
      );
    }

    const user = await ObtenerUsuarioPorCorreo(correo);

    if (!user) {
      return NextResponse.json(
        { message: 'Usuario no encontrado' },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { message: 'Credenciales incorrectas' },
        { status: 401 }
      );
    }

    // Here you would implement your own session/token management
    // For example, you could:
    // 1. Generate a JWT token
    // 2. Set it in a HTTP-only cookie
    // 3. Return user data (excluding sensitive information)

    const userData = {
      id: user.id,
      name: user.primerNombre,
      email: user.correo,
      rol: user.rol,
      image: user.image
    };

    // Store user data in a cookie for subsequent requests
    const response = NextResponse.json({
      user: userData,
      message: 'Login exitoso'
    });

    // Set an HTTP-only cookie with user data
    response.cookies.set('auth_user', JSON.stringify(userData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { message: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
