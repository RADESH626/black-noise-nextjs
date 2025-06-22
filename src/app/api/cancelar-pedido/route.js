import { NextResponse } from 'next/server';
import { sendEmail } from '@/utils/nodemailer';
import { DBconection } from '@/utils/DBconection';
import Pedido from '@/models/Pedido';
import Usuario from '@/models/Usuario';

export async function POST(request) {
  try {
    const { pedidoId } = await request.json();

    await DBconection();

    const pedido = await Pedido.findById(pedidoId).populate('userId');

    if (!pedido) {
      return NextResponse.json({ message: 'Pedido no encontrado' }, { status: 404 });
    }

    const userEmail = pedido.userId.correo;

    await sendEmail({
      to: userEmail,
      subject: 'Confirmación de Cancelación de Pedido',
      html: `<p>Su pedido ${pedidoId} ha sido cancelado correctamente.</p>`,
    });

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
