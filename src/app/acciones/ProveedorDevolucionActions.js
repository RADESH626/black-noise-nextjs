"use server";

import Pedido from '@/models/Pedido';
import Proveedor from '@/models/Proveedor';
import dbConnect from '@/utils/DBconection';
import { revalidatePath } from 'next/cache';
import { sendEmail } from '@/utils/nodemailer';
import { EstadoPedido } from '@/models/enums/PedidoEnums';
import { ObtenerUsuarioPorId } from '@/app/acciones/UsuariosActions';
import { getModel } from '@/utils/modelLoader';
import { toPlainObject } from '@/utils/dbUtils';

async function gestionarDevolucionProveedor(pedidoId, accion, motivoRechazo = null, costosNegociados = null) {
  try {
    await dbConnect();
    const PedidoModel = await getModel('Pedido');
    const ProveedorModel = await getModel('Proveedor');

    const pedido = await PedidoModel.findById(pedidoId);
    if (!pedido) {
      return { success: false, message: 'Pedido no encontrado.' };
    }

    const oldEstado = pedido.estadoPedido;
    let newEstado;
    let subject = '';
    let htmlContent = '';
    let userEmail = '';
    let userName = '';

    const userResult = await ObtenerUsuarioPorId(pedido.userId);
    if (userResult && !userResult.error && userResult.correo) {
      userEmail = userResult.correo;
      userName = userResult.Nombre || 'Usuario';
    } else {
      console.error(`Error: Usuario o email no encontrado para userId: ${pedido.userId}. No se pudo enviar notificación al usuario.`);
    }

    switch (accion) {
      case 'APROBAR':
        newEstado = EstadoPedido.DEVOLUCION_APROBADA;
        pedido.estadoPedido = newEstado;
        subject = `Devolución Aprobada - Black Noise`;
        htmlContent = `
          <p>¡Hola ${userName}!</p>
          <p>Tu solicitud de devolución para el pedido <strong>#${pedido._id.toString().slice(-6)}</strong> ha sido aprobada.</p>
          <p>Por favor, sigue las instrucciones del proveedor para completar el proceso de devolución.</p>
        `;
        break;
      case 'RECHAZAR':
        if (!motivoRechazo) {
          return { success: false, message: 'El motivo de rechazo es obligatorio.' };
        }
        newEstado = EstadoPedido.DEVOLUCION_RECHAZADA;
        pedido.estadoPedido = newEstado;
        pedido.motivo_rechazo_devolucion = motivoRechazo;
        subject = `Devolución Rechazada - Black Noise`;
        htmlContent = `
          <p>¡Hola ${userName}!</p>
          <p>Tu solicitud de devolución para el pedido <strong>#${pedido._id.toString().slice(-6)}</strong> ha sido rechazada.</p>
          <p>Motivo: ${motivoRechazo}</p>
          <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
        `;
        break;
      case 'REHACER_PEDIDO':
        if (costosNegociados === null || costosNegociados < 0) {
          return { success: false, message: 'Los costos negociados son obligatorios y deben ser un número positivo.' };
        }
        newEstado = EstadoPedido.PEDIDO_A_REHACER;
        pedido.estadoPedido = newEstado;
        pedido.es_pedido_refabricado = true;
        pedido.costos_negociados = costosNegociados;
        // Aquí se podría crear un nuevo pedido o actualizar el existente con los nuevos costos
        // Por simplicidad, solo actualizamos el estado y los costos negociados en el pedido original
        subject = `Propuesta para Rehacer Pedido - Black Noise`;
        htmlContent = `
          <p>¡Hola ${userName}!</p>
          <p>Hemos recibido tu solicitud de devolución para el pedido <strong>#${pedido._id.toString().slice(-6)}</strong>.</p>
          <p>El proveedor ha propuesto rehacer el pedido con un costo negociado de: $${costosNegociados}.</p>
          <p>Por favor, revisa esta propuesta y confírmanos si estás de acuerdo.</p>
        `;
        break;
      case 'COMPLETAR_DEVOLUCION':
        newEstado = EstadoPedido.DEVOLUCION_COMPLETADA;
        pedido.estadoPedido = newEstado;
        subject = `Devolución Completada - Black Noise`;
        htmlContent = `
          <p>¡Hola ${userName}!</p>
          <p>La devolución de tu pedido <strong>#${pedido._id.toString().slice(-6)}</strong> ha sido completada.</p>
          <p>Gracias por tu comprensión.</p>
        `;
        break;
      default:
        return { success: false, message: 'Acción de devolución no válida.' };
    }

    await pedido.save();

    // Enviar notificación al usuario si el email está disponible
    if (userEmail && subject && htmlContent) {
      await sendEmail(userEmail, subject, htmlContent);
      console.log(`Notificación de devolución enviada a ${userEmail} para pedido ${pedidoId}`);
    }

    revalidatePath('/perfil'); // Revalidar la página del perfil del usuario
    revalidatePath('/proveedor/pedidos'); // Revalidar la página de pedidos del proveedor
    return { success: true, message: `Devolución ${accion.toLowerCase()} correctamente.` };
  } catch (error) {
    console.error(`Error al gestionar devolución por proveedor (${accion}):`, error);
    return { success: false, message: `Error al gestionar devolución por proveedor (${accion}).`, error: error.message };
  }
}

export {
  gestionarDevolucionProveedor
};
