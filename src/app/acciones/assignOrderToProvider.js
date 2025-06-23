"use server"

import Pedido from '@/models/Pedido';
import Usuario from '@/models/Usuario';
import { transporter } from '@/utils/nodemailer';
import connectDB from '@/utils/DBconection';
import logger from '@/utils/logger'; // Import the logger utility
import { EstadoPedido } from '@/models/enums/PedidoEnums'; // Import EstadoPedido enum
import { getModel } from '@/utils/modelLoader'; // Import getModel

/**
 * Asigna automáticamente un nuevo pedido al proveedor más adecuado y envía un correo de notificación.
 * Implementa una lógica de negocio híbrida para la selección del proveedor.
 *
 * @param {object} order - El objeto del pedido, que debe incluir `_id` y `items` con `designId` populado para extraer la categoría.
 * @returns {Promise<{success: boolean, message: string, error?: string}>} Resultado de la operación.
 */
export async function assignOrderToProvider(order) {
  await connectDB(); // Asegura que la conexión a la DB esté establecida
  logger.debug(`Entering assignOrderToProvider for order ID: ${order._id}`);

  try {
    const ProveedorModel = await getModel('Proveedor'); // Obtener el modelo Proveedor
    const orderId = order._id;

    // 1. Identificar Requisito: Extraer la especialidad (categoría) del primer item del pedido.
    // Se asume que el 'designId' en 'order.items' ya está populado con los detalles del diseño,
    // incluyendo la 'categoria'. Si no lo está, esta lógica necesitará una consulta adicional.
    if (!order.items || order.items.length === 0 || !order.items[0].designId || !order.items[0].designId.categoria) {
      logger.warn(`Order ${orderId} is missing design category information. Cannot assign provider.`);
      await Pedido.findByIdAndUpdate(orderId, { estadoPedido: EstadoPedido.ASIGNACION_PENDIENTE });
      return { success: false, message: 'Order is missing design category information. Cannot assign provider.' };
    }
    const specialty = order.items[0].designId.categoria;
    logger.debug(`Extracted specialty for order ${orderId}: ${specialty}`);

    // 2. Filtrar por Capacidad: Buscar proveedores activos, con la especialidad requerida y con menos de 5 pedidos activos.
    const candidates = await ProveedorModel.find({
      habilitado: true, // Usar 'habilitado' en lugar de 'status'
      especialidad: specialty, // Usar 'especialidad' en lugar de 'specialties'
      activeOrders: { $lt: 5 }, // Umbral de capacidad
    }).sort({ lastAssignedAt: 1 }).lean(); // Ordenar por el que fue asignado hace más tiempo

    let bestProvider = null;

    if (candidates.length === 0) {
      logger.warn(`No suitable active providers found for specialty: ${specialty}. Order ID: ${orderId}`);
      // Actualizar el estado del pedido a 'ASIGNACION_PENDIENTE' para revisión manual
      await Pedido.findByIdAndUpdate(orderId, { estadoPedido: EstadoPedido.ASIGNACION_PENDIENTE });
      return { success: false, message: 'No suitable providers found. Order set to ASIGNACION_PENDIENTE.' };
    } else {
      bestProvider = candidates[0];
      logger.debug(`Best provider found for order ${orderId}: ${bestProvider._id}`);
    }

    // 3. Ejecutar la Asignación (Transacción)
    // a. Actualizar el Pedido
    await Pedido.findByIdAndUpdate(orderId, {
      proveedorId: bestProvider._id,
      estadoPedido: EstadoPedido.ASIGNADO, // Usar el enum para el estado
    });
    logger.debug(`Order ${orderId} updated with provider ${bestProvider._id} and status ASIGNADO.`);

    // b. Actualizar al Proveedor
    await ProveedorModel.findByIdAndUpdate(bestProvider._id, {
      $inc: { activeOrders: 1 }, // Incrementar pedidos activos
      lastAssignedAt: new Date(), // Actualizar fecha de última asignación
    });
    logger.debug(`Provider ${bestProvider._id} activeOrders incremented and lastAssignedAt updated.`);

    // c. Obtener Email para Notificación
    const providerUser = await Usuario.findById(bestProvider.userId);
    if (!providerUser || !providerUser.correo) {
      logger.error(`Could not find user email for provider ID: ${bestProvider.userId}. Cannot send notification.`);
      return { success: false, message: 'Provider user email not found. Order assigned but notification failed.' };
    }
    const providerEmail = providerUser.correo;
    logger.debug(`Provider email for notification: ${providerEmail}`);

    // d. Enviar Correo de Notificación
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: providerEmail,
      subject: `¡Nuevo Pedido Asignado! - Pedido #${orderId}`,
      html: `
        <p>Hola ${providerUser.nombre || 'Proveedor'},</p>
        <p>Se te ha asignado un nuevo pedido. Por favor, revisa los detalles en tu dashboard.</p>
        <p><strong>ID del Pedido:</strong> ${orderId}</p>
        <p>Puedes ver el pedido directamente aquí: <a href="${process.env.NEXT_PUBLIC_BASE_URL}/proveedor/pedidos/${orderId}">Ver Pedido</a></p>
        <p>Gracias,</p>
        <p>El equipo de Black Noise</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Notification email sent to ${providerEmail} for order ${orderId}`);

    return { success: true, message: 'Order assigned and provider notified successfully.' };

  } catch (error) {
    logger.error(`ERROR in assignOrderToProvider for order ID ${order._id}:`, error);
    // En caso de fallo, se podría considerar actualizar el estado del pedido a 'ERROR_ASIGNACION'
    // o dejarlo en su estado original si el fallo ocurre antes de la asignación.
    // Por simplicidad, si falla la asignación, el pedido se queda en PENDIENTE o ASIGNACION_PENDIENTE
    // si no se encontró proveedor.
    return { success: false, message: 'Failed to assign order to provider.', error: error.message };
  }
}
