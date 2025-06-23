import { NextResponse } from 'next/server';
import { getPedidoById } from '@/app/acciones/PedidoActions';
import { guardarPedido, updateEstadoPedido } from '@/app/acciones/PedidoActions';
import { EstadoPedido } from '@/models/enums/PedidoEnums';

export async function POST(req) {
  try {
    const { pedidoId, manufacturingCost, shippingCost, discount } = await req.json();

    // Get the original order details from the database
    const originalPedido = await getPedidoById(pedidoId);

    if (!originalPedido) {
      return NextResponse.json({ message: 'Pedido no encontrado' }, { status: 404 });
    }

    // Create a new order with the adjusted costs
    const nuevoPedidoData = {
      ...originalPedido,
      manufacturingCost: manufacturingCost,
      shippingCost: shippingCost,
      discount: discount,
      estadoPedido: EstadoPedido.PENDIENTE, // Set the status to "Pendiente"
    };

    delete nuevoPedidoData._id; // Remove the _id property to create a new order

    const { success, data, error } = await guardarPedido(nuevoPedidoData);

    if (!success) {
      return NextResponse.json({ message: error }, { status: 500 });
    }

    // Update the status of the original order to "Rehacer Pedido"
    const updateResult = await updateEstadoPedido(pedidoId, EstadoPedido.REHACER_PEDIDO);

    if (!updateResult.success) {
      return NextResponse.json({ message: updateResult.message }, { status: 500 });
    }

    // Send a notification to the customer with the new order details and the adjusted costs
    // TODO: Implement the logic to send the notification to the customer

    return NextResponse.json({ message: 'Pedido creado correctamente' });
  } catch (error) {
    console.error('Error al crear el pedido:', error);
    return NextResponse.json({ message: 'Error al crear el pedido' }, { status: 500 });
  }
}
