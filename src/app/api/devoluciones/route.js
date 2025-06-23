import { NextResponse } from 'next/server';
import { sendEmail } from '@/utils/nodemailer';
import connectDB from '@/utils/DBconection';
import getPedidoModel from '@/models/Pedido';
import getProveedorModel from '@/models/Proveedor';
import { EstadoPedido } from '@/models/enums/PedidoEnums'; // Importar la enumeración

export async function POST(request) {
  try {
    const { pedidoId, returnReason } = await request.json();

    await connectDB();
    const Pedido = await getPedidoModel();
    const Proveedor = await getProveedorModel(); // Obtener el modelo Proveedor

    const pedido = await Pedido.findById(pedidoId).populate({
      path: 'proveedorId',
      model: Proveedor // Especificar el modelo a usar para poblar
    });

    if (!pedido) {
      return NextResponse.json({ message: 'Pedido no encontrado' }, { status: 404 });
    }

    const supplierEmail = pedido.proveedorId.emailContacto; // Cambiar a emailContacto

    if (!supplierEmail) {
      console.error('Error: No se encontró el correo electrónico del proveedor para el pedido:', pedidoId);
      return NextResponse.json({ message: 'Error: No se encontró el correo electrónico del proveedor' }, { status: 500 });
    }

    await sendEmail({
      to: supplierEmail,
      subject: 'Solicitud de Devolución',
      html: `<p>Se ha solicitado una devolución para el pedido ${pedidoId} con la siguiente razón: ${returnReason}</p>`,
    });

    pedido.estadoPedido = EstadoPedido.SOLICITUD_DEVOLUCION; // Usar el valor de la enumeración
    pedido.motivo_devolucion = returnReason;

    await pedido.save();

    return NextResponse.json({ message: 'Solicitud de devolución enviada correctamente' }, { status: 200 });
  } catch (error) {
    console.error('Error al enviar la solicitud de devolución:', error);
    return NextResponse.json({ message: 'Error al enviar la solicitud de devolución' }, { status: 500 });
  }
}
