// src/app/acciones/assignOrderToProvider.js

import Pedido from '@/models/Pedido';
import Proveedor from '@/models/Proveedor';
import Usuario from '@/models/Usuario';
import { transporter } from '@/utils/nodemailer'; // Assuming nodemailer transporter is here
import { connectDB } from '@/utils/DBconection'; // Assuming DB connection utility

export async function assignOrderToProvider(order) {
  await connectDB(); // Ensure DB connection is established

  try {
    const { specialty, _id: orderId } = order;

    // 1. Buscar Candidatos (Lógica Híbrida)
    const candidates = await Proveedor.find({
      status: 'active',
      specialties: specialty,
      activeOrders: { $lt: 5 },
    }).sort({ lastAssignedAt: 1 });

    let bestProvider = null;

    if (candidates.length === 0) {
      console.warn(`No active providers found for specialty: ${specialty}. Order ID: ${orderId}`);
      // Actualizar el estado del pedido a 'ASIGNACION_FALLIDA'
      await Pedido.findByIdAndUpdate(orderId, { estadoPedido: 'ASIGNACION_FALLIDA' });
      return { success: false, message: 'No suitable providers found.' };
    } else {
      bestProvider = candidates[0];
    }

    // 2. Ejecutar la Asignación (Transacción)
    // a. Actualizar el Pedido
    await Pedido.findByIdAndUpdate(orderId, {
      proveedorId: bestProvider._id,
      estadoPedido: 'ASIGNADO',
    });

    // b. Actualizar al Proveedor
    await Proveedor.findByIdAndUpdate(bestProvider._id, {
      $inc: { activeOrders: 1 },
      lastAssignedAt: new Date(),
    });

    // c. Obtener Email para Notificación
    const providerUser = await Usuario.findById(bestProvider.userId);
    if (!providerUser || !providerUser.correo) {
      console.error(`Could not find user email for provider ID: ${bestProvider.userId}`);
      return { success: false, message: 'Provider user email not found.' };
    }
    const providerEmail = providerUser.correo;

    // d. Enviar Correo de Notificación
    const mailOptions = {
      from: process.env.EMAIL_USER, // Asegúrate de que esto esté configurado en .env.local
      to: providerEmail,
      subject: `¡Nuevo Pedido Asignado! - Pedido #${orderId}`,
      html: `
        <p>Hola ${providerUser.name || 'Proveedor'},</p>
        <p>Se te ha asignado un nuevo pedido. Por favor, revisa los detalles en tu dashboard.</p>
        <p><strong>ID del Pedido:</strong> ${orderId}</p>
        <p>Puedes ver el pedido directamente aquí: <a href="${process.env.NEXT_PUBLIC_BASE_URL}/proveedor/pedidos/${orderId}">Ver Pedido</a></p>
        <p>Gracias,</p>
        <p>El equipo de Black Noise</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Notification email sent to ${providerEmail} for order ${orderId}`);

    return { success: true, message: 'Order assigned and provider notified successfully.' };

  } catch (error) {
    console.error('Error assigning order to provider:', error);
    // Considerar actualizar el estado del pedido a 'ERROR_ASIGNACION' en caso de fallo
    // await Pedido.findByIdAndUpdate(order._id, { estadoPedido: 'ERROR_ASIGNACION' });
    return { success: false, message: 'Failed to assign order to provider.', error: error.message };
  }
}
