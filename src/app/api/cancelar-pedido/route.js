import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authUtils';
import { sendEmail } from '@/utils/nodemailer';
import connectDB from '@/utils/DBconection';
import getPedidoModel from '@/models/Pedido';
import Usuario from '@/models/Usuario';
export async function POST(request) {
  try {
    const { pedidoId } = await request.json();
    console.log('pedidoId:', pedidoId);

    const session = await getServerSession(authOptions);
    console.log('session:', session);

    if (!session || !session.user) {
      console.log('No session or user');
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    await connectDB();
    const Pedido = await getPedidoModel();

    const pedido = await Pedido.findById(pedidoId).populate('userId');
    console.log('pedido:', pedido);

    if (!pedido) {
      console.log('Pedido no encontrado');
      return NextResponse.json({ message: 'Pedido no encontrado' }, { status: 404 });
    }

    // Check if the user is authorized to cancel the order
    if (pedido.userId._id.toString() !== session.user.id) {
      console.log('User not authorized', {
        pedidoUserId: pedido.userId._id.toString(),
        sessionId: session.user.id,
      });
      return NextResponse.json({ message: 'No autorizado' }, { status: 403 });
    }

    const userEmail = pedido.userId.correo;
    console.log('userEmail:', userEmail);

    try {
      await sendEmail({
        to: userEmail,
        subject: 'Confirmación de Cancelación de Pedido',
        html: `<p>Su pedido ${pedidoId} ha sido cancelado correctamente.</p>`,
      });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
    }

    pedido.estadoPedido = 'CANCELADO';
    pedido.fue_cancelado = true;
    pedido.fecha_cancelacion = new Date();
    pedido.cancellationDate = new Date();

    await pedido.save();

    return NextResponse.json({ message: 'Pedido cancelado correctamente' }, { status: 200 });
  } catch (error) {
    console.error('Error al cancelar el pedido:', error);
    return NextResponse.json({ message: 'Error al cancelar el pedido' }, { status: 500 });
  }
}
