import { NextResponse } from 'next/server';
import { sendEmail } from '@/utils/nodemailer';
import { DBconection } from '@/utils/DBconection';
import Pedido from '@/models/Pedido';

export async function POST(request) {
  try {
    const { pedidoId, returnReason } = await request.json();

    try {
      await DBconection();
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return NextResponse.json({ message: 'Error connecting to database' }, { status: 500 });
    }

    const pedido = await Pedido.findById(pedidoId).populate('proveedorId');

    if (!pedido) {
      return NextResponse.json({ message: 'Pedido no encontrado' }, { status: 404 });
    }

    let supplierEmail = 'test@example.com'; // Default email
    if (pedido.proveedorId && pedido.proveedorId.correo) {
      supplierEmail = pedido.proveedorId.correo;
    } else {
      console.error('Proveedor email not found for pedido:', pedidoId);
      // Optionally, you could return an error here if supplier email is essential
    }

    await sendEmail({
      to: supplierEmail,
      subject: 'Solicitud de Devolución',
      html: `<p>Se ha solicitado una devolución para el pedido ${pedidoId} con la siguiente razón: ${returnReason}</p>`,
    });

    pedido.estadoPedido = 'SOLICITUD_DE_DEVOLUCION';
    pedido.motivo_devolucion = returnReason;

    await pedido.save();

    return NextResponse.json({ message: 'Solicitud de devolución enviada correctamente' }, { status: 200 });
  } catch (error) {
    console.error('Error al enviar la solicitud de devolución:', error);
    return NextResponse.json({ message: 'Error al enviar la solicitud de devolución' }, { status: 500 });
  }
}
