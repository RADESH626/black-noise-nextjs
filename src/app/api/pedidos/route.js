import { NextResponse } from 'next/server';
import { obtenerPedidos } from '@/app/acciones/PedidoActions';

export async function GET() {
  try {
    const { pedidos, error } = await obtenerPedidos();

    if (error) {
      return NextResponse.json({ message: error }, { status: 500 });
    }

    return NextResponse.json({ pedidos });
  } catch (error) {
    console.error('Error al obtener los pedidos:', error);
    return NextResponse.json({ message: 'Error al obtener los pedidos' }, { status: 500 });
  }
}
