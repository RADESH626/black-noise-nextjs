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

    const returns = await Pedido.find({
      proveedorId: providerId,
      estadoPedido: { $in: [ 'SOLICITUD_DEVOLUCION', 'DEVOLUCION_APROBADA', 'DEVUELTO' ] }
    }).populate('userId').populate('items.designId').sort({ cancellationDate: -1, _id: -1 }).lean().exec();
=======
    // Fetch returns data from the database
    const returns = await Pedido.find({ estadoPedido: { $in: [ 'CANCELADO', 'SOLICITUD_DEVOLUCION', 'DEVOLUCION_APROBADA', 'DEVUELTO' ] } }).sort({ cancellationDate: -1, _id: -1 });
>>>>>>> f416d78 (pantalla de carga)

    return NextResponse.json(returns);
  } catch (error) {
    console.error('Error fetching returns:', error);
    return NextResponse.json({ message: 'Error fetching returns' }, { status: 500 });
  }
}
