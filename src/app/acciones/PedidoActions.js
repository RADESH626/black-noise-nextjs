"use server";

import Pedido from '@/models/Pedido';
import dbConnect from '@/utils/DBconection';
import { revalidatePath } from 'next/cache';
import { sendEmail } from '@/utils/nodemailer';
import { EstadoPedido } from '@/models/enums/PedidoEnums';
import { ObtenerUsuarioPorId } from '@/app/acciones/UsuariosActions';
import { getModel } from '@/utils/modelLoader';
import Proveedor from '@/models/Proveedor';
import { toPlainObject } from '@/utils/dbUtils';
import { Disponibilidad } from '@/models/enums/proveedor/Disponibilidad';

async function obtenerPedidos() {
  try {
    await dbConnect();
    const PedidoModel = await getModel("Pedido");
    const pedidos = await PedidoModel.find({}).lean();

    const pedidosConUsuario = await Promise.all(
      pedidos.map(async (pedido) => {
        if (pedido.userId) {
          const userResult = await ObtenerUsuarioPorId(pedido.userId);
          if (userResult && userResult.Nombre && userResult.correo) {
            return {
              ...pedido,
              userName: userResult.Nombre,
              userEmail: userResult.correo,
            };
          } else {
            console.error(`Error fetching user data for userId: ${pedido.userId}`);
            return { ...pedido, userName: 'N/A', userEmail: 'N/A' };
          }
        } else {
          return { ...pedido, userName: 'N/A', userEmail: 'N/A' };
        }
      })
    );

    return { pedidos: pedidosConUsuario.map(p => toPlainObject(p)) };
  } catch (error) {
    console.error('Error al obtener todos los pedidos:', error);
    return { error: error.message };
  }
}

async function guardarPedido(data) {
  try {
    await dbConnect();
    const ProveedorModel = await getModel('Proveedor');
    const PedidoModel = await getModel('Pedido'); // Obtener el modelo Pedido

    console.log('PedidoActions: Data recibida en guardarPedido:', data);
    console.log('PedidoActions: Total en data recibida:', data.total);

    // Definir el lรญmite mรกximo de pedidos activos por proveedor
    const MAX_ACTIVE_ORDERS = 5;

    // Buscar un proveedor disponible y habilitado con menos pedidos activos y que no haya alcanzado el lรญmite
    const proveedorDisponible = await ProveedorModel.findOne({
      disponibilidad: Disponibilidad.DISPONIBLE,
      habilitado: true,
      activeOrders: { $lt: MAX_ACTIVE_ORDERS } // Solo proveedores con menos de MAX_ACTIVE_ORDERS pedidos
    }).sort({ activeOrders: 1, lastAssignedAt: 1 });

    if (!proveedorDisponible) {
      return { success: false, message: 'No hay proveedores disponibles en este momento para tomar tu pedido. Por favor, intรฉntalo de nuevo mรกs tarde.' };
    }

    const nuevoPedido = new PedidoModel({ // Usar PedidoModel como constructor
      ...data,
      proveedorId: proveedorDisponible._id,
      estadoPedido: EstadoPedido.PENDIENTE,
    });

    proveedorDisponible.activeOrders += 1;
    proveedorDisponible.lastAssignedAt = new Date();
    await proveedorDisponible.save();

    const pedidoGuardado = await nuevoPedido.save();
    revalidatePath('/admin/pedidos');
    revalidatePath('/perfil');
    revalidatePath('/proveedor/pedidos');
    return { success: true, data: toPlainObject(pedidoGuardado) };
  } catch (error) {
    console.error('Error al guardar el pedido:', error);
    return { success: false, error: error.message };
  }
}

async function updateEstadoPedido(pedidoId, newEstado) {
  try {
    await dbConnect();
    const PedidoModel = await getModel('Pedido');
    const pedido = await PedidoModel.findById(pedidoId);
    if (!pedido) {
      return { success: false, message: 'Pedido no encontrado.' };
    }

    const oldEstado = pedido.estadoPedido;

    pedido.estadoPedido = newEstado;
    if (newEstado === EstadoPedido.CANCELADO) {
      pedido.proveedorId = null;
    }
    await pedido.save();

    // Definir los estados que marcan un pedido como "no activo" para el proveedor
    const finalStates = [EstadoPedido.ENTREGADO, EstadoPedido.CANCELADO, EstadoPedido.LISTO];

    // Si el pedido tenรญa un proveedor asignado y el estado cambia a uno de los estados finales
    // y el estado anterior NO estaba en los estados finales (para evitar doble decremento)
    if (pedido.proveedorId && finalStates.includes(newEstado) && !finalStates.includes(oldEstado)) {
      const ProveedorModel = await getModel('Proveedor');
      const proveedor = await ProveedorModel.findById(pedido.proveedorId);
      if (proveedor && proveedor.activeOrders > 0) {
        proveedor.activeOrders -= 1;
        await proveedor.save();
        console.log(`Decremented activeOrders for provider ${proveedor._id}. New count: ${proveedor.activeOrders}`);
      }
    }

    // Enviar notificaciรณn si el estado ha cambiado
    if (oldEstado !== newEstado) {
      await enviarNotificacionCambioEstadoPedido(pedido._id, newEstado, oldEstado, pedido.userId);
    }

    revalidatePath('/proveedor/pedidos');
    return { success: true, message: 'Estado del pedido actualizado correctamente.' };
  } catch (error) {
    console.error('Error al actualizar el estado del pedido:', error);
    return { success: false, message: 'Error al actualizar el estado del pedido.', error: error.message };
  }
}

async function obtenerPedidosPorUsuarioId(userId) {
  try {
    await dbConnect();
    const PedidoModel = await getModel('Pedido');
    const pedidos = await PedidoModel.find({ userId: userId })
      .populate('items.designId', 'nombreDesing imageData imageMimeType categoria valorDesing descripcion')
      .populate('proveedorId', 'nombreEmpresa emailContacto')
      .populate('userId', 'Nombre direccion')
      .lean();
    const processedPedidos = pedidos.map(p => {
      const tempPedido = { ...p };
      if (tempPedido.items && Array.isArray(tempPedido.items)) {
        tempPedido.items = tempPedido.items.map(item => {
          if (item.designId) {
            const imageUrl = item.designId.imageData && item.designId.buffer instanceof Buffer && item.designId.imageMimeType
              ? `data:${item.designId.imageMimeType};base64,${item.designId.imageData.buffer.toString('base64')}`
              : null;

            const newDesignId = {
              _id: item.designId._id,
              nombreDesing: item.designId.nombreDesing,
              valorDesing: item.designId.valorDesing,
              categoria: item.designId.categoria,
              descripcion: item.designId.descripcion,
              imagen: imageUrl,
            };

            return {
              ...item,
              designId: newDesignId
            };
          }
          return item;
        });
      }
      return toPlainObject(tempPedido);
    });
    return { success: true, pedidos: processedPedidos };
  } catch (error) {
    console.error('Error al obtener los pedidos del usuario:', error);
    return { success: false, error: error.message };
  }
}

async function obtenerPedidosPagadosPorUsuarioId(userId) {
  try {
    await dbConnect();
    const PedidoModel = await getModel('Pedido');
    const pedidos = await PedidoModel.find({ userId: userId, estadoPago: 'PAGADO' }) // Filtrar por estadoPago: 'PAGADO'
      .populate('items.designId', 'nombreDesing imageData imageMimeType categoria valorDesing descripcion')
      .populate('proveedorId', 'nombreEmpresa emailContacto')
      .populate('userId', 'Nombre direccion')
      .lean();
    const processedPedidos = pedidos.map(p => {
      const tempPedido = { ...p };
      if (tempPedido.items && Array.isArray(tempPedido.items)) {
        tempPedido.items = tempPedido.items.map(item => {
          if (item.designId) {
            const imageUrl = item.designId.imageData && item.designId.buffer instanceof Buffer && item.designId.imageMimeType
              ? `data:${item.designId.imageMimeType};base64,${item.designId.imageData.buffer.toString('base64')}`
              : null;

            const newDesignId = {
              _id: item.designId._id,
              nombreDesing: item.designId.nombreDesing,
              valorDesing: item.designId.valorDesing,
              categoria: item.designId.categoria,
              descripcion: item.designId.descripcion,
              imagen: imageUrl,
            };

            return {
              ...item,
              designId: newDesignId
            };
          }
          return item;
        });
      }
      return toPlainObject(tempPedido);
    });
    return { success: true, pedidos: processedPedidos };
  } catch (error) {
    console.error('Error al obtener los pedidos pagados del usuario:', error);
    return { success: false, error: error.message };
  }
}

export {
  guardarPedido,
  updateEstadoPedido,
  obtenerPedidosPorUsuarioId,
  obtenerPedidosPagadosPorUsuarioId,
  obtenerPedidos,
  getPedidoById,
  solicitarDevolucion
};

async function getPedidoById(id) {
  try {
    await dbConnect();
    const PedidoModel = await getModel('Pedido');
    const pedido = await PedidoModel.findById(id)
      .populate('items.designId', 'nombreDesing imageData imageMimeType categoria valorDesing descripcion')
      .populate('proveedorId', 'nombreEmpresa emailContacto')
      .populate('userId', 'Nombre direccion')
      .lean();
    return toPlainObject(pedido);
  } catch (error) {
    console.error('Error al obtener el pedido:', error);
    return { error: error.message };
  }
}

async function solicitarDevolucion(pedidoId, userId, razonDevolucion) {
  try {
    await dbConnect();
    const PedidoModel = await getModel('Pedido');
    const ProveedorModel = await getModel('Proveedor');

    const pedido = await PedidoModel.findById(pedidoId);
    if (!pedido) {
      return { success: false, message: 'Pedido no encontrado.' };
    }

    // Verificar si el pedido ya estรก en un estado de devoluciรณn o final
    const estadosNoPermitidosParaDevolucion = [
      EstadoPedido.SOLICITUD_DEVOLUCION,
      EstadoPedido.DEVOLUCION_APROBADA,
      EstadoPedido.DEVOLUCION_RECHAZADA,
      EstadoPedido.DEVOLUCION_COMPLETADA,
      EstadoPedido.CANCELADO,
      EstadoPedido.ENTREGADO // Solo se permite solicitar devoluciรณn si ya fue entregado o listo
    ];

    if (![EstadoPedido.LISTO, EstadoPedido.ENTREGADO].includes(pedido.estadoPedido)) {
      return { success: false, message: 'La devoluciรณn solo puede solicitarse para pedidos LISTOS o ENTREGADOS.' };
    }

    pedido.estadoPedido = EstadoPedido.SOLICITUD_DEVOLUCION;
    pedido.motivo_devolucion = razonDevolucion;
    await pedido.save();

    // Notificar al proveedor asignado
    if (pedido.proveedorId) {
      const proveedor = await ProveedorModel.findById(pedido.proveedorId);
      if (proveedor && proveedor.emailContacto) {
        const subject = `Nueva Solicitud de Devoluciรณn para Pedido #${pedido._id.toString().slice(-6)}`;
        const htmlContent = `
          <p>ยกHola ${proveedor.nombreEmpresa}!</p>
          <p>Se ha recibido una nueva solicitud de devoluciรณn para el pedido <strong>#${pedido._id.toString().slice(-6)}</strong>.</p>
          <p>Motivo de la devoluciรณn: ${razonDevolucion}</p>
          <p>Por favor, revisa los detalles del pedido en tu panel y contacta al cliente para coordinar la devoluciรณn.</p>
        `;
        await sendEmail({ to: proveedor.emailContacto, subject, html: htmlContent });
        console.log(`Notificaciรณn de solicitud de devoluciรณn enviada a proveedor ${proveedor.emailContacto}`);
      }
    }

    // Enviar notificaciรณn al usuario
    await enviarNotificacionCambioEstadoPedido(pedido._id, EstadoPedido.SOLICITUD_DEVOLUCION, pedido.estadoPedido, userId);

    revalidatePath('/perfil'); // Revalidar la pรกgina del perfil del usuario
    revalidatePath('/proveedor/pedidos'); // Revalidar la pรกgina de pedidos del proveedor
    return { success: true, message: 'Solicitud de devoluciรณn enviada correctamente.' };
  } catch (error) {
    console.error('Error al solicitar devoluciรณn:', error);
    return { success: false, message: 'Error al procesar la solicitud de devoluciรณn.', error: error.message };
  }
}

async function enviarNotificacionCambioEstadoPedido(pedidoId, newEstado, oldEstado, userId) {
  try {
    await dbConnect();

    const userResult = await ObtenerUsuarioPorId(userId);

    if (!userResult || userResult.error || !userResult.correo) {
      console.error(`Error al obtener usuario o email para userId: ${userId}. No se pudo enviar notificaciรณn. Detalle: ${userResult ? (userResult.error || 'Usuario no encontrado o correo vacรญo') : 'Resultado nulo'}`);
      return;
    }
    const user = userResult;

    let subject = '';
    let htmlContent = '';
    const userName = user.Nombre || 'Usuario';

    switch (newEstado) {
      case EstadoPedido.EN_FABRICACION:
        subject = `Tu pedido estรก en fabricaciรณn - Black Noise`;
        htmlContent = `
                    <p>ยกHola ${userName}!</p>
                    <p>Queremos informarte que tu pedido <strong>#${pedidoId.toString().slice(-6)}</strong> esta en FABRICACION.</p>
                    <p>Estamos trabajando en ello y pronto lo tendrรกs contigo.</p>
                `;
        break;
      case EstadoPedido.LISTO:
        subject = `Tu pedido estรก listo para ser enviado/recogido - Black Noise`;
        htmlContent = `
                    <p>ยกHola ${userName}!</p>
                    <p>ยกBuenas noticias! Tu pedido <strong>#${pedidoId.toString().slice(-6)}</strong> ya fue terminado y estรก listo.</p>
                    <p>Gracias por tu paciencia y confianza en Black Noise.</p>
                `;
        break;
      case EstadoPedido.ENVIADO:
        subject = `Tu pedido ha sido enviado - Black Noise`;
        htmlContent = `
                    <p>ยกHola ${userName}!</p>
                    <p>Tu pedido <strong>#${pedidoId.toString().slice(-6)}</strong> ha sido enviado y estรก en camino.</p>
                    <p>ยกPronto lo recibirรกs!</p>
                    <p>Gracias por tu paciencia y confianza en Black Noise.</p>
                `;
        break;
            case EstadoPedido.CANCELADO:
                subject = `Tu pedido ha sido cancelado - Black Noise`;
                htmlContent = `
                    <p>ยกHola ${userName}!</p>
                    <p>Queremos confirmarte que tu pedido <strong>#${pedidoId.toString().slice(-6)}</strong> ha sido cancelado.</p>
                    <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
                    <p>Gracias por tu comprensiรณn.</p>
                `;
                break;
            case EstadoPedido.SOLICITUD_CANCELACION:
                subject = `Solicitud de Cancelaciรณn Recibida - Black Noise`;
                htmlContent = `
                    <p>ยกHola ${userName}!</p>
                    <p>Hemos recibido tu solicitud de cancelaciรณn para el pedido <strong>#${pedidoId.toString().slice(-6)}</strong>.</p>
                    <p>Un proveedor se pondrรก en contacto contigo pronto para coordinar los detalles.</p>
                    <p>Gracias por tu paciencia.</p>
                `;
                break;
            case EstadoPedido.ENTREGADO:
                subject = `ยกTu pedido ha sido entregado! - Black Noise`;
                htmlContent = `
                    <p>ยกHola ${userName}!</p>
                    <p>ยกExcelentes noticias! Tu pedido <strong>#${pedidoId.toString().slice(-6)}</strong> ha sido marcado como ENTREGADO.</p>
                    <p>Esperamos que disfrutes de tu compra. ยกGracias por elegir Black Noise!</p>
                `;
                break;
            case EstadoPedido.SOLICITUD_DEVOLUCION:
                subject = `Solicitud de Devoluciรณn Recibida - Black Noise`;
                htmlContent = `
                    <p>ยกHola ${userName}!</p>
                    <p>Hemos recibido tu solicitud de devoluciรณn para el pedido <strong>#${pedidoId.toString().slice(-6)}</strong>.</p>
                    <p>Un proveedor se pondrรก en contacto contigo pronto para coordinar los detalles.</p>
                    <p>Gracias por tu paciencia.</p>
                `;
                break;
            case EstadoPedido.DEVOLUCION_APROBADA:
                subject = `Devoluciรณn Aprobada - Black Noise`;
                htmlContent = `
                    <p>ยกHola ${userName}!</p>
                    <p>Tu solicitud de devoluciรณn para el pedido <strong>#${pedidoId.toString().slice(-6)}</strong> ha sido aprobada.</p>
                    <p>Por favor, sigue las instrucciones del proveedor para completar el proceso de devoluciรณn.</p>
                `;
                break;
            case EstadoPedido.DEVOLUCION_RECHAZADA:
                subject = `Devoluciรณn Rechazada - Black Noise`;
                htmlContent = `
                    <p>ยกHola ${userName}!</p>
                    <p>Tu solicitud de devoluciรณn para el pedido <strong>#${pedidoId.toString().slice(-6)}</strong> ha sido rechazada.</p>
                    <p>Motivo: [Aquรญ irรก el motivo del rechazo].</p>
                    <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
                `;
                break;
      default:
        // No hacer nada para otros estados o si no se especifica
        return;
    }

    if (subject && htmlContent) {
      await sendEmail({ to: user.correo, subject, html: htmlContent });
      console.log(`Notificaciรณn de estado de pedido enviada a ${user.correo} para pedido ${pedidoId}`);
    }
  } catch (error) {
    console.error(`Error al enviar notificaciรณn de cambio de estado para pedido ${pedidoId}: ${error}`);
  }
}
