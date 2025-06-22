import { NextResponse } from 'next/server';
import connectDB from '@/utils/DBconection';
import Pedido from '@/models/Pedido';

<<<<<<< HEAD
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/utils/authUtils";

=======
>>>>>>> f416d78 (pantalla de carga)
export async function GET() {
  try {
    await connectDB();

<<<<<<< HEAD
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const providerId = session.user.id;

    const cancelledOrders = await Pedido.find({
      proveedorId: providerId,
      estadoPedido: 'CANCELADO'
    }).populate('userId').populate('items.designId').lean().exec();

    return NextResponse.json(cancelledOrders);
=======
    // Fetch cancellations data from the database
    return NextResponse.json([]);
>>>>>>> f416d78 (pantalla de carga)
  } catch (error) {
    console.error('Error fetching cancellations:', error);
    return NextResponse.json({ message: 'Error fetching cancellations' }, { status: 500 });
  }
}
