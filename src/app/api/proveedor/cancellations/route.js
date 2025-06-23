import { NextResponse } from 'next/server';
import connectDB from '@/utils/DBconection';
import getPedidoModel from '@/models/Pedido';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    await connectDB();
    const Pedido = await getPedidoModel();

    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const providerId = session.user.id;
    console.log('providerId:', providerId);

    const cancelledOrders = await Pedido.find({
      proveedorId: session.user.id,
      estadoPedido: 'CANCELADO'
    }).populate('userId').populate('items.designId').lean().exec();

    console.log('cancelledOrders:', cancelledOrders);

    return NextResponse.json(cancelledOrders);
  } catch (error) {
    console.error('Error fetching cancellations:', error);
    return NextResponse.json({ message: 'Error fetching cancellations' }, { status: 500 });
  }
}
