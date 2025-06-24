import { NextResponse } from 'next/server';
import connectDB from '@/utils/DBconection';
import Pedido from '@/models/Pedido';

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/utils/authUtils";

export async function POST(req, { params }) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const providerId = session.user.id;
    const { id } = params;
    const { estadoPedido, motivoRechazo } = await req.json();

    const pedido = await Pedido.findById(id);

    if (!pedido) {
      return NextResponse.json({ message: 'Pedido no encontrado' }, { status: 404 });
    }

    if (pedido.proveedorId.toString() !== providerId) {
      return NextResponse.json({ message: 'No autorizado para modificar este pedido' }, { status: 403 });
    }

    pedido.estadoPedido = estadoPedido;
    if (motivoRechazo) {
      pedido.motivoRechazo = motivoRechazo;
    }

    await pedido.save();

    return NextResponse.json({ message: 'Pedido actualizado correctamente' });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ message: 'Error updating order' }, { status: 500 });
  }
}
