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
import logger from '@/utils/logger'; // Importar el logger

async function obtenerPedidos(filters = {}) {
  try {
    await dbConnect();
    const PedidoModel = await getModel("Pedido");
    const UsuarioModel = await getModel('Usuario');

    const query = {};

    // Filtros específicos para Pedido
    if (filters.estadoPedido) {
      query.estadoPedido = filters.estadoPedido;
    }
    if (filters.estadoPago) {
      query.estadoPago = filters.estadoPago;
    }
    if (filters.metodoEntrega) {
      query.metodoEntrega = filters.metodoEntrega;
    }
    if (filters.proveedorId) {
      query.proveedorId = filters.proveedorId;
    }
    if (filters.usuarioCompradorId) {
      query.userId = filters.usuarioCompradorId;
    }
    if (filters.valorTotalMin) {
      query.total = { ...query.total, $gte: parseFloat(filters.valorTotalMin) };
    }
    if (filters.valorTotalMax) {
      query.total = { ...query.total, $lte: parseFloat(filters.valorTotalMax) };
    }
    if (filters.fechaPedidoStart) {
      query.createdAt = { ...query.createdAt, $gte: new Date(filters.fechaPedidoStart) };
    }
    if (filters.fechaPedidoEnd) {
      query.createdAt = { ...query.createdAt, $lte: new Date(filters.fechaPedidoEnd) };
    }
    if (filters.pedidoCancelado === true || filters.pedidoCancelado === false) {
      query.fue_cancelado = filters.pedidoCancelado;
    }
    if (filters.pedidoRefabricado === true || filters.pedidoRefabricado === false) {
      query.fue_refabricado = filters.pedidoRefabricado;
    }

    // Si hay searchText y no se especificó un usuarioCompradorId directo, buscar por nombre/email de usuario
    if (filters.searchText && !filters.usuarioCompradorId) {
      const matchingUsers = await UsuarioModel.find({
        $or: [
          { Nombre: { $regex: filters.searchText, $options: 'i' } },
          { primerApellido: { $regex: filters.searchText, $options: 'i' } },
          { correo: { $regex: filters.searchText, $options: 'i' } },
        ]
      }).select('_id').lean();
      const matchingUserIds = matchingUsers.map(user => user._id);

      // Combinar con la query existente si ya hay un userId
      if (query.userId) {
        query.userId = { $in: [...(Array.isArray(query.userId.$in) ? query.userId.$in : [query.userId]), ...matchingUserIds] };
      } else {
        query.userId = { $in: matchingUserIds };
      }
    }

    logger.debug("PedidoActions: Query de la base de datos", query);
    const pedidos = await PedidoModel.find(query)
      .populate('items.designId', 'nombreDesing imageData imageMimeType categoria valorDesing descripcion')
      .populate('proveedorId', 'nombreEmpresa emailContacto')
      .populate('userId', 'Nombre correo direccion') // Añadir 'correo' y 'direccion'
      .lean();
    logger.debug("PedidoActions: Pedidos obtenidos de la base de datos", pedidos);

    const processedPedidos = pedidos.map(p => {
      const tempPedido = { ...p };
      if (tempPedido.items && Array.isArray(tempPedido.items)) {
          tempPedido.items = tempPedido.items.map(item => {
              if (item.designId) {
                  const imageUrl = item.designId.imageData && item.designId.imageData.buffer instanceof Buffer && item.designId.imageMimeType
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
      // Añadir userName y userEmail para compatibilidad con PedidosDashboard
      if (tempPedido.userId) {
        tempPedido.userName = tempPedido.userId.Nombre;
        tempPedido.userEmail = tempPedido.userId.correo;
      } else {
        tempPedido.userName = 'N/A';
        tempPedido.userEmail = 'N/A';
      }
      return toPlainObject(tempPedido);
    });

    logger.debug("PedidoActions: Pedidos procesados con información de usuario y proveedor", processedPedidos);
    return { pedidos: processedPedidos };
  } catch (error) {
    logger.error('Error al obtener todos los pedidos:', error);
    return { error: error.message };
  }
}

async function guardarPedido(data) {
  try {
    await dbConnect();
    const ProveedorModel = await getModel('Proveedor');
    const PedidoModel = await getModel('Pedido'); // Obtener el modelo Pedido

    logger.debug('PedidoActions: Data recibida en guardarPedido:', data);
    logger.debug('PedidoActions: Total en data recibida:', data.total);

    // Definir el lรญmite mรกximo de pedidos activos por proveedor
    const MAX_ACTIVE_ORDERS = 5;

    // Buscar un proveedor disponible y habilitado con menos pedidos activos y que no haya alcanzado el lรญmite
    const proveedorDisponible = await ProveedorModel.findOne({
      disponibilidad: Disponibilidad.DISPONIBLE,
      habilitado: true,
      activeOrders: { $lt: MAX_ACTIVE_ORDERS } // Solo proveedores con menos de MAX_ACTIVE_ORDERS pedidos
    }).sort({ activeOrders: 1, lastAssignedAt: 1 });

    if (!proveedorDisponible) {
      return { success: false, message: 'No se le pudo asignar un pedido a un proveedor.' };
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
      pedido.fecha_cancelacion = new Date(); // Establecer la fecha de cancelación
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
        logger.debug(`Decremented activeOrders for provider ${proveedor._id}. New count: ${proveedor.activeOrders}`);
      }
    }

    // Enviar notificaciรณn si el estado ha cambiado
    if (oldEstado !== newEstado) {
      await enviarNotificacionCambioEstadoPedido(pedido._id, newEstado, oldEstado, pedido.userId);
    }

    revalidatePath('/proveedor/pedidos');
    return { success: true, message: 'Estado del pedido actualizado correctamente.' };
  } catch (error) {
    logger.error('Error al actualizar el estado del pedido:', error);
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
      .populate('userId', 'Nombre correo direccion') // Añadir 'correo' y 'direccion'
      .lean();
    const processedPedidos = pedidos.map(p => {
      const tempPedido = { ...p };
      if (tempPedido.items && Array.isArray(tempPedido.items)) {
        tempPedido.items = tempPedido.items.map(item => {
          if (item.designId) {
            const imageUrl = item.designId.imageData && item.designId.imageData.buffer instanceof Buffer && item.designId.imageMimeType
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
    logger.error('Error al obtener los pedidos del usuario:', error);
    return { success: false, error: error.message };
  }
}

async function obtenerPedidosPagadosPorUsuarioId(userId) {
  logger.debug(`PedidoActions: Iniciando obtenerPedidosPagadosPorUsuarioId para userId: ${userId}`);
  try {
    await dbConnect();
    const PedidoModel = await getModel('Pedido');
    const pedidos = await PedidoModel.find({ userId: userId, estadoPago: 'PAGADO' }) // Filtrar por estadoPago: 'PAGADO'
      .populate('items.designId', 'nombreDesing imageData imageMimeType categoria valorDesing descripcion')
      .populate('proveedorId', 'nombreEmpresa emailContacto')
      .populate('userId', 'Nombre correo direccion') // Añadir 'correo' y 'direccion'
      .lean();
    logger.debug(`PedidoActions: Se encontraron ${pedidos.length} pedidos para el usuario ${userId}`);
    const processedPedidos = pedidos.map(p => {
      const tempPedido = { ...p };
      if (tempPedido.items && Array.isArray(tempPedido.items)) {
        tempPedido.items = tempPedido.items.map(item => {
          if (item.designId) {
            const imageUrl = item.designId.imageData && item.designId.imageData.buffer instanceof Buffer && item.designId.imageMimeType
              ? `data:${item.designId.imageMimeType};base64,${item.designId.imageData.buffer.toString('base64')}`
              : null;

            logger.debug(`PedidoActions: imageUrl para designId ${item.designId._id}:`, imageUrl ? 'GENERADA' : 'NULL/UNDEFINED');
            if (!imageUrl) {
                logger.debug(`PedidoActions: Detalles de designId sin imagen:`, {
                    _id: item.designId._id,
                    nombreDesing: item.designId.nombreDesing,
                    imageDataExists: !!item.designId.imageData,
                    isBuffer: item.designId.imageData && item.designId.imageData.buffer instanceof Buffer,
                    imageMimeType: item.designId.imageMimeType
                });
            }

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
    logger.debug("PedidoActions: Pedidos procesados para usuario (con imágenes):", processedPedidos);
    return { success: true, pedidos: processedPedidos };
  } catch (error) {
    logger.error('Error al obtener los pedidos pagados del usuario:', error);
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
  solicitarDevolucion,
  obtenerDevolucionesYCancelacionesProveedor,
  cancelarPedido
};

async function cancelarPedido(pedidoId, razonCancelacion) {
  try {
    await dbConnect();
    const PedidoModel = await getModel('Pedido');
    const ProveedorModel = await getModel('Proveedor');

    const pedido = await PedidoModel.findById(pedidoId);
    if (!pedido) {
      return { success: false, message: 'Pedido no encontrado.' };
    }

    // Verificar si el pedido ya está en un estado final o de cancelación
    const estadosNoPermitidosParaCancelacion = [
      EstadoPedido.CANCELADO,
      EstadoPedido.ENTREGADO,
      EstadoPedido.DEVOLUCION_APROBADA,
      EstadoPedido.DEVOLUCION_RECHAZADA,
      EstadoPedido.DEVOLUCION_COMPLETADA,
    ];

    if (estadosNoPermitidosParaCancelacion.includes(pedido.estadoPedido)) {
      return { success: false, message: `El pedido ya está en estado "${pedido.estadoPedido.replace(/_/g, ' ')}" y no puede ser cancelado.` };
    }

    const oldEstado = pedido.estadoPedido;

    pedido.estadoPedido = EstadoPedido.CANCELADO;
    pedido.fue_cancelado = true;
    pedido.fecha_cancelacion = new Date();
    pedido.razon_cancelacion = razonCancelacion;

    // Si el pedido tenía un proveedor asignado y no estaba ya en un estado final,
    // decrementar activeOrders del proveedor
    const finalStates = [EstadoPedido.ENTREGADO, EstadoPedido.CANCELADO, EstadoPedido.LISTO];
    if (pedido.proveedorId && !finalStates.includes(oldEstado)) {
      const proveedor = await getModel('Proveedor').findById(pedido.proveedorId); // Usar getModel
      if (proveedor && proveedor.activeOrders > 0) {
        proveedor.activeOrders -= 1;
        await proveedor.save();
        logger.debug(`Decremented activeOrders for provider ${proveedor._id} due to cancellation. New count: ${proveedor.activeOrders}`);
      }
      pedido.proveedorId = null; // Desvincular el proveedor del pedido cancelado
    }

    await pedido.save();

    // Enviar notificación al usuario
    await enviarNotificacionCambioEstadoPedido(pedido._id, EstadoPedido.CANCELADO, oldEstado, pedido.userId, razonCancelacion);

    revalidatePath('/perfil');
    revalidatePath('/proveedor/pedidos');
    revalidatePath('/admin/pedidos'); // Revalidar también para el admin

    return { success: true, message: 'Pedido cancelado exitosamente.' };
  } catch (error) {
    logger.error('Error al cancelar el pedido:', error);
    return { success: false, message: 'Error al cancelar el pedido.', error: error.message };
  }
}

async function obtenerDevolucionesYCancelacionesProveedor() {
  try {
    await dbConnect();
    const PedidoModel = await getModel("Pedido");

    const pedidos = await PedidoModel.find({
      estadoPedido: { $in: ['CANCELADO', 'SOLICITUD_DEVOLUCION', 'DEVOLUCION_APROBADA', 'DEVUELTO'] }
    })
      .populate('userId', 'correo') // Populate userId and select only the 'correo' field
      .lean();

    // Map to plain objects and add userEmail directly, and determine the correct "request date"
    const processedPedidos = pedidos.map(pedido => {
      const plainPedido = toPlainObject(pedido);
      if (pedido.userId && pedido.userId.correo) {
        plainPedido.userEmail = pedido.userId.correo;
      } else {
        plainPedido.userEmail = 'N/A'; // Fallback if email is not found
      }

      // Determinar la fecha de petición correcta
      if (pedido.estadoPedido === EstadoPedido.SOLICITUD_DEVOLUCION ||
          pedido.estadoPedido === EstadoPedido.DEVOLUCION_APROBADA ||
          pedido.estadoPedido === EstadoPedido.DEVOLUCION_RECHAZADA ||
          pedido.estadoPedido === EstadoPedido.DEVOLUCION_COMPLETADA) {
        plainPedido.fechaPeticion = pedido.fecha_solicitud_devolucion || pedido.createdAt;
      } else if (pedido.estadoPedido === EstadoPedido.CANCELADO) {
        plainPedido.fechaPeticion = pedido.fecha_cancelacion || pedido.createdAt;
      } else {
        plainPedido.fechaPeticion = pedido.createdAt; // Fallback general
      }
      return plainPedido;
    });

    // Ordenar los pedidos procesados por la fecha de petición en orden descendente
    processedPedidos.sort((a, b) => {
      const dateA = a.fechaPeticion ? new Date(a.fechaPeticion).getTime() : 0;
      const dateB = b.fechaPeticion ? new Date(b.fechaPeticion).getTime() : 0;
      return dateB - dateA;
    });

    return { success: true, data: processedPedidos };
  } catch (error) {
    logger.error('Error al obtener devoluciones y cancelaciones para proveedor:', error);
    return { success: false, error: error.message };
  }
}

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
    logger.error('Error al obtener el pedido:', error);
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
    pedido.fecha_solicitud_devolucion = new Date(); // Añadir la fecha de solicitud de devolución
    await pedido.save();

    // Notificar al proveedor asignado
    if (pedido.proveedorId) {
      const proveedor = await ProveedorModel.findById(pedido.proveedorId);
      if (proveedor && proveedor.emailContacto) {
        const subject = `Nueva Solicitud de Devolución para Pedido #${pedido._id.toString().slice(-6)}`;
        const htmlContent = `
          <p>Hola ${proveedor.nombreEmpresa}!</p>
          <p>Se ha recibido una nueva solicitud de devolución para el pedido <strong>#${pedido._id.toString().slice(-6)}</strong>.</p>
          <p>Motivo de la devolución: ${razonDevolucion}</p>
          <p>Por favor, revisa los detalles del pedido en tu panel y contacta al cliente para coordinar la devolución.</p>
        `;
        await sendEmail({ to: proveedor.emailContacto, subject, html: htmlContent });
        logger.debug(`Notificación de solicitud de devolución enviada a proveedor ${proveedor.emailContacto}`);
      }
    }

    // Enviar notificación al usuario
    await enviarNotificacionCambioEstadoPedido(pedido._id, EstadoPedido.SOLICITUD_DEVOLUCION, pedido.estadoPedido, userId);

    revalidatePath('/perfil'); // Revalidar la pรกgina del perfil del usuario
    revalidatePath('/proveedor/pedidos'); // Revalidar la pรกgina de pedidos del proveedor
    return { success: true, message: 'Solicitud de devolución enviada correctamente.' };
  } catch (error) {
    logger.error('Error al solicitar devolución:', error);
    return { success: false, message: 'Error al procesar la solicitud de devoluciรณn.', error: error.message };
  }
}

async function enviarNotificacionCambioEstadoPedido(pedidoId, newEstado, oldEstado, userId, razon = null) {
  try {
    await dbConnect();

    const userResult = await ObtenerUsuarioPorId(userId);

    if (!userResult || userResult.error || !userResult.correo) {
      logger.error(`Error al obtener usuario o email para userId: ${userId}. No se pudo enviar notificación. Detalle: ${userResult ? (userResult.error || 'Usuario no encontrado o correo vacío') : 'Resultado nulo'}`);
      return;
    }
    const user = userResult;

    let subject = '';
    let htmlContent = '';
    const userName = user.Nombre || 'Usuario';

    switch (newEstado) {
      case EstadoPedido.EN_FABRICACION:
        subject = `Tu pedido está en fabricación - Black Noise`;
        htmlContent = `
                    <p>Hola ${userName}!</p>
                    <p>Queremos informarte que tu pedido <strong>#${pedidoId.toString().slice(-6)}</strong> está en FABRICACIÓN.</p>
                    <p>Estamos trabajando en ello y pronto lo tendrás contigo.</p>
                `;
        break;
      case EstadoPedido.LISTO:
        subject = `Tu pedido está listo para ser enviado/recogido - Black Noise`;
        htmlContent = `
                    <p>Hola ${userName}!</p>
                    <p>Buenas noticias! Tu pedido <strong>#${pedidoId.toString().slice(-6)}</strong> ya fue terminado y está listo.</p>
                    <p>Gracias por tu paciencia y confianza en Black Noise.</p>
                `;
        break;
      case EstadoPedido.ENVIADO:
        subject = `Tu pedido ha sido enviado - Black Noise`;
        htmlContent = `
                    <p>Hola ${userName}!</p>
                    <p>Tu pedido <strong>#${pedidoId.toString().slice(-6)}</strong> ha sido enviado y está en camino.</p>
                    <p>Pronto lo recibirás!</p>
                    <p>Gracias por tu paciencia y confianza en Black Noise.</p>
                `;
        break;
            case EstadoPedido.CANCELADO:
                subject = `Tu pedido ha sido cancelado - Black Noise`;
                htmlContent = `
                    <p>Hola ${userName}!</p>
                    <p>Queremos confirmarte que tu pedido <strong>#${pedidoId.toString().slice(-6)}</strong> ha sido cancelado.</p>
                    ${razon ? `<p>Razón de la cancelación: ${razon}</p>` : ''}
                    <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
                `;
                break;
            case EstadoPedido.SOLICITUD_CANCELACION:
                subject = `Solicitud de Cancelación Recibida - Black Noise`;
                htmlContent = `
                    <p>¡Hola ${userName}!</p>
                    <p>Hemos recibido tu solicitud de cancelación para el pedido <strong>#${pedidoId.toString().slice(-6)}</strong>.</p>
                    <p>Un proveedor se pondrá en contacto contigo pronto para coordinar los detalles.</p>
                    <p>Gracias por tu paciencia.</p>
                `;
                break;
            case EstadoPedido.ENTREGADO:
                subject = `¡Tu pedido ha sido entregado! - Black Noise`;
                htmlContent = `
                    <p>¡Hola ${userName}!</p>
                    <p>¡Excelentes noticias! Tu pedido <strong>#${pedidoId.toString().slice(-6)}</strong> ha sido marcado como ENTREGADO.</p>
                    <p>Esperamos que disfrutes de tu compra. ¡Gracias por elegir Black Noise!</p>
                `;
                break;
            case EstadoPedido.SOLICITUD_DEVOLUCION:
                subject = `Solicitud de Devolución Recibida - Black Noise`;
                htmlContent = `
                    <p>¡Hola ${userName}!</p>
                    <p>Hemos recibido tu solicitud de devolución para el pedido <strong>#${pedidoId.toString().slice(-6)}</strong>.</p>
                    <p>Un proveedor se pondrá en contacto contigo pronto para coordinar los detalles.</p>
                    <p>Gracias por tu paciencia.</p>
                `;
                break;
            case EstadoPedido.DEVOLUCION_APROBADA:
                subject = `Devolución Aprobada - Black Noise`;
                htmlContent = `
                    <p>¡Hola ${userName}!</p>
                    <p>Tu solicitud de devolución para el pedido <strong>#${pedidoId.toString().slice(-6)}</strong> ha sido aprobada.</p>
                    <p>Por favor, sigue las instrucciones del proveedor para completar el proceso de devolución.</p>
                `;
                break;
            case EstadoPedido.DEVOLUCION_RECHAZADA:
                subject = `Devolución Rechazada - Black Noise`;
                htmlContent = `
                    <p>¡Hola ${userName}!</p>
                    <p>Tu solicitud de devolución para el pedido <strong>#${pedidoId.toString().slice(-6)}</strong> ha sido rechazada.</p>
                    <p>Motivo: [Aquí irá el motivo del rechazo].</p>
                    <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
                `;
                break;
      default:
        // No hacer nada para otros estados o si no se especifica
        return;
    }

    if (subject && htmlContent) {
      await sendEmail({ to: user.correo, subject, html: htmlContent });
      logger.debug(`Notificación de estado de pedido enviada a ${user.correo} para pedido ${pedidoId}`);
    }
  } catch (error) {
    logger.error(`Error al enviar notificación de cambio de estado para pedido ${pedidoId}: ${error}`);
  }
}
