import { NextResponse } from 'next/server';
import connectDB from '@/utils/DBconection';
import getPedidoModel from '@/models/Pedido';

export async function GET() {
  try {
    await connectDB();
    const Pedido = await getPedidoModel();

    // Fetch returns data from the database
    const returns = await Pedido.find({ estadoPedido: { $in: [ 'CANCELADO', 'SOLICITUD_DEVOLUCION', 'DEVOLUCION_APROBADA', 'DEVUELTO' ] } }).sort({ cancellationDate: -1, _id: -1 });

    return NextResponse.json(returns);
  } catch (error) {
    console.error('Error fetching returns:', error);
    return NextResponse.json({ message: 'Error fetching returns' }, { status: 500 });
  }
}
