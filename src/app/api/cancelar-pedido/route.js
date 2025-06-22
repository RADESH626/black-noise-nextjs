import { NextResponse } from 'next/server';
import { sendEmail } from '@/utils/nodemailer';
import { DBconection } from '@/utils/DBconection';
import Pedido from '@/models/Pedido';
import Usuario from '@/models/Usuario';
<<<<<<< HEAD
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
=======
>>>>>>> f416d78 (pantalla de carga)

export async function POST(request) {
  try {
    const { pedidoId } = await request.json();

<<<<<<< HEAD
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

=======
>>>>>>> f416d78 (pantalla de carga)
    await DBconection();

    const pedido = await Pedido.findById(pedidoId).populate('userId');

    if (!pedido) {
      return NextResponse.json({ message: 'Pedido no encontrado' }, { status: 404 });
    }

<<<<<<< HEAD
    // Check if the user is authorized to cancel the order
    if (pedido.userId._id.toString() !== session.user.id) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 403 });
    }

=======
>>>>>>> f416d78 (pantalla de carga)
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
