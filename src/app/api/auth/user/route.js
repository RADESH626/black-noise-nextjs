import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const authCookie = request.cookies.get('auth_user');
    
    if (!authCookie) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const userData = JSON.parse(authCookie.value);

    return NextResponse.json({ user: userData });

  } catch (error) {
    console.error('Error getting user data:', error);
    return NextResponse.json(
      { message: 'Error al obtener datos del usuario' },
      { status: 500 }
    );
  }
}
