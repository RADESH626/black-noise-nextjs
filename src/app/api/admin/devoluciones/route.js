import { NextResponse } from 'next/server';
import { DBconection } from '@/utils/DBconection';
import Pedido from '@/models/Pedido';

export async function GET(request) {
  try {
    await DBconection();

    const devoluciones = await Pedido.find({ estadoPedido: 'SOLICITUD_DE_DEVOLUCION' }).lean();

    return NextResponse.json(devoluciones);
  } catch (error) {
    console.error('Error al obtener las devoluciones:', error);
    return NextResponse.json({ message: 'Error al obtener las devoluciones' }, { status: 500 });
  }
}
