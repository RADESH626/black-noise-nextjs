import { NextResponse } from 'next/server';
import { sendEmail } from '@/utils/nodemailer';
import connectDB from '@/utils/DBconection';
<<<<<<< HEAD
import getPedidoModel from '@/models/Pedido';
import getProveedorModel from '@/models/Proveedor';
import { EstadoPedido } from '@/models/enums/PedidoEnums'; // Importar la enumeración
=======
import Pedido from '@/models/Pedido';
>>>>>>> 9b206edc1019577cf88f8f9814469c41ec3c04ce

export async function POST(request) {
  try {
    const { pedidoId, returnReason } = await request.json();

    await connectDB();
<<<<<<< HEAD
    const Pedido = await getPedidoModel();
    const Proveedor = await getProveedorModel(); // Obtener el modelo Proveedor

    const pedido = await Pedido.findById(pedidoId).populate({
      path: 'proveedorId',
      model: Proveedor // Especificar el modelo a usar para poblar
    });
=======

    const pedido = await Pedido.findById(pedidoId).populate('proveedorId');
>>>>>>> 9b206edc1019577cf88f8f9814469c41ec3c04ce

    if (!pedido) {
      return NextResponse.json({ message: 'Pedido no encontrado' }, { status: 404 });
    }

<<<<<<< HEAD
    const supplierEmail = pedido.proveedorId.emailContacto; // Cambiar a emailContacto

    if (!supplierEmail) {
      console.error('Error: No se encontró el correo electrónico del proveedor para el pedido:', pedidoId);
      return NextResponse.json({ message: 'Error: No se encontró el correo electrónico del proveedor' }, { status: 500 });
    }
=======
    const supplierEmail = pedido.proveedorId.correo;
>>>>>>> 9b206edc1019577cf88f8f9814469c41ec3c04ce

    await sendEmail({
      to: supplierEmail,
      subject: 'Solicitud de Devolución',
      html: `<p>Se ha solicitado una devolución para el pedido ${pedidoId} con la siguiente razón: ${returnReason}</p>`,
    });

<<<<<<< HEAD
    pedido.estadoPedido = EstadoPedido.SOLICITUD_DEVOLUCION; // Usar el valor de la enumeración
=======
    pedido.estadoPedido = 'SOLICITUD_DE_DEVOLUCION';
>>>>>>> 9b206edc1019577cf88f8f9814469c41ec3c04ce
    pedido.motivo_devolucion = returnReason;

    await pedido.save();

    return NextResponse.json({ message: 'Solicitud de devolución enviada correctamente' }, { status: 200 });
  } catch (error) {
    console.error('Error al enviar la solicitud de devolución:', error);
    return NextResponse.json({ message: 'Error al enviar la solicitud de devolución' }, { status: 500 });
  }
}
