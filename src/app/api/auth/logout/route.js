import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Sesión cerrada exitosamente'
    });

    // Clear the authentication cookie
    response.cookies.delete('auth_user');

    return response;

  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.json(
      { message: 'Error al cerrar sesión' },
      { status: 500 }
    );
  }
}
