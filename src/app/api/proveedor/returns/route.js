import { NextResponse } from 'next/server';
import connectDB from '@/utils/DBconection';
import Pedido from '@/models/Pedido';

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/utils/authUtils";

export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const providerId = session.user.id;

    const returns = await Pedido.find({
      proveedorId: providerId,
      estadoPedido: { $in: [ 'CANCELADO', 'SOLICITUD_DEVOLUCION', 'DEVOLUCION_APROBADA', 'DEVUELTO' ] }
    }).sort({ cancellationDate: -1, _id: -1 }).lean().exec();

    return NextResponse.json(returns);
  } catch (error) {
    console.error('Error fetching returns:', error);
    return NextResponse.json({ message: 'Error fetching returns' }, { status: 500 });
  }
}
