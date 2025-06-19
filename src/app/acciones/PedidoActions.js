"use server"

import Pedido from '@/models/Pedido';
import dbConnect from '@/utils/DBconection';
import { revalidatePath } from 'next/cache';
import { sendEmail } from '@/utils/nodemailer';
import { EstadoPedido } from '@/models/enums/PedidoEnums';
import { ObtenerUsuarioPorId } from '@/app/acciones/UsuariosActions';
import { getModel } from '@/utils/modelLoader'; // Importar getModel
import Proveedor from '@/models/Proveedor'; // Importar el modelo Proveedor
import { toPlainObject } from '@/utils/dbUtils'; // Importar toPlainObject
import { Disponibilidad } from '@/models/enums/proveedor/Disponibilidad';

async function obtenerPedidos() {
    try {
        await dbConnect();
        const PedidoModel = await getModel('Pedido');
        const pedidos = await PedidoModel.find({})
            .populate('userId', 'nombre email') // Populate user name and email
            .lean();
        return { pedidos: pedidos.map(p => toPlainObject(p)) };
    } catch (error) {
        console.error('Error al obtener todos los pedidos:', error);
        return { error: error.message };
    }
}

async function guardarPedido(data) {
    try {
        await dbConnect();
        const ProveedorModel = await getModel('Proveedor');

        // Buscar un proveedor disponible y habilitado con menos pedidos activos
        const proveedorDisponible = await ProveedorModel.findOne({
            disponibilidad: Disponibilidad.DISPONIBLE,
            habilitado: true,
        }).sort({ activeOrders: 1, lastAssignedAt: 1 });

        if (!proveedorDisponible) {
            return { success: false, message: 'No hay proveedores disponibles en este momento para tomar tu pedido.' };
        }

        // Crear una nueva instancia de Pedido usando el modelo importado directamente
        const nuevoPedido = new Pedido({
            ...data, // Desestructurar los datos para asegurar que sea un objeto plano
            // estadoPago se establecerá a 'PENDIENTE' por defecto desde el esquema del modelo Pedido.js
            proveedorId: proveedorDisponible._id, // Asignar el proveedor al pedido
            estadoPedido: EstadoPedido.PENDIENTE, // Asegurar que el estado inicial sea PENDIENTE
        });

        // Incrementar activeOrders del proveedor
        proveedorDisponible.activeOrders += 1;
        proveedorDisponible.lastAssignedAt = new Date(); // Actualizar la fecha de última asignación
        await proveedorDisponible.save();

        const pedidoGuardado = await nuevoPedido.save(); // Llamar a save en la instancia del documento
        revalidatePath('/admin/pedidos');
        revalidatePath('/perfil');
        revalidatePath('/proveedor/pedidos'); // Revalidar también la página de pedidos del proveedor
        return { success: true, data: toPlainObject(pedidoGuardado) };
    } catch (error) {
        console.error('Error al guardar el pedido:', error);
        return { success: false, error: error.message };
    }
}

async function updateEstadoPedido(pedidoId, newEstado) {
    try {
        await dbConnect();
        const pedido = await Pedido.findById(pedidoId);

        if (!pedido) {
            return { success: false, message: 'Pedido no encontrado.' };
        }

        const oldEstado = pedido.estadoPedido; // Obtener el estado antiguo antes de actualizar

        pedido.estadoPedido = newEstado;
        await pedido.save();

        // Enviar notificación si el estado ha cambiado y no es 'ENTREGADO'
        // Definir los estados que marcan un pedido como "no activo" para el proveedor
        const finalStates = [EstadoPedido.ENTREGADO, EstadoPedido.CANCELADO, EstadoPedido.LISTO];

        // Si el pedido tenía un proveedor asignado y el estado cambia a uno de los estados finales
        // y el estado anterior NO estaba en los estados finales (para evitar doble decremento)
        if (pedido.proveedorId && finalStates.includes(newEstado) && !finalStates.includes(oldEstado)) {
            const proveedor = await Proveedor.findById(pedido.proveedorId);
            if (proveedor && proveedor.activeOrders > 0) {
                proveedor.activeOrders -= 1;
                await proveedor.save();
                console.log(`Decremented activeOrders for provider ${proveedor._id}. New count: ${proveedor.activeOrders}`);
            }
        }

        // Enviar notificación si el estado ha cambiado
        if (oldEstado !== newEstado) {
            await enviarNotificacionCambioEstadoPedido(pedido._id, newEstado, oldEstado, pedido.userId);
        }

        revalidatePath('/proveedor/pedidos'); // Revalidar la página para mostrar el cambio
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
            .populate('items.designId', 'nombreDesing imageData imageMimeType')
            .populate('proveedorId', 'nombreEmpresa emailContacto')
            .populate('userId', 'Nombre direccion')
            .lean();
        return { success: true, pedidos: pedidos.map(p => toPlainObject(p)) };
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
            .populate('items.designId', 'nombreDesing imageData imageMimeType')
            .populate('proveedorId', 'nombreEmpresa emailContacto')
            .populate('userId', 'Nombre direccion')
            .lean();
        return { success: true, pedidos: pedidos.map(p => toPlainObject(p)) };
    } catch (error) {
        console.error('Error al obtener los pedidos pagados del usuario:', error);
        return { success: false, error: error.message };
    }
}

export {
    guardarPedido,
    enviarNotificacionCambioEstadoPedido,
    updateEstadoPedido,
    obtenerPedidosPorUsuarioId,
    obtenerPedidosPagadosPorUsuarioId,
    obtenerPedidos // Export the new function
};

async function enviarNotificacionCambioEstadoPedido(pedidoId, newEstado, oldEstado, userId) {
    try {
        await dbConnect(); // Asegurarse de que la conexión a la DB está activa

        const userResult = await ObtenerUsuarioPorId(userId);

        if (!userResult || userResult.error || !userResult.correo) {
            console.error(`Error: Usuario o email no encontrado para userId: ${userId}. No se pudo enviar notificación. Detalle: ${userResult ? userResult.error : 'Resultado nulo'}`);
            return;
        }
        const user = userResult; // El resultado de ObtenerUsuarioPorId es el objeto de usuario directamente

        let subject = '';
        let htmlContent = '';
        const userName = user.Nombre || 'Usuario'; // Asumiendo que el modelo Usuario tiene un campo Nombre

        switch (newEstado) {
            case EstadoPedido.EN_FABRICACION:
                subject = `Tu pedido está en fabricación - Black Noise`;
                htmlContent = `
                    <p>¡Hola ${userName}!</p>
                    <p>Queremos informarte que tu pedido <strong>#${pedidoId.toString().slice(-6)}</strong> esta en FABRICACION.</p>
                    <p>Estamos trabajando en ello y pronto lo tendrás contigo.</p>
                    <p>Gracias por tu paciencia y confianza en Black Noise.</p>
                `;
                break;
            case EstadoPedido.LISTO:
                subject = `Tu pedido está listo para ser enviado/recogido - Black Noise`;
                htmlContent = `
                    <p>¡Hola ${userName}!</p>
                    <p>¡Buenas noticias! Tu pedido <strong>#${pedidoId.toString().slice(-6)}</strong> ya fue terminado y está listo.</p>
                    <p>Gracias por tu paciencia y confianza en Black Noise.</p>
                `;
                break;
            case EstadoPedido.ENVIADO:
                subject = `Tu pedido ha sido enviado - Black Noise`;
                htmlContent = `
                    <p>¡Hola ${userName}!</p>
                    <p>Tu pedido <strong>#${pedidoId.toString().slice(-6)}</strong> ha sido enviado y está en camino.</p>
                    <p>¡Pronto lo recibirás!</p>
                    <p>Gracias por tu paciencia y confianza en Black Noise.</p>
                `;
                break;
            case EstadoPedido.CANCELADO:
                subject = `Tu pedido ha sido cancelado - Black Noise`;
                htmlContent = `
                    <p>¡Hola ${userName}!</p>
                    <p>Queremos confirmarte que tu pedido <strong>#${pedidoId.toString().slice(-6)}</strong> ha sido cancelado.</p>
                    <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
                    <p>Gracias por tu comprensión.</p>
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
            default:
                // No hacer nada para otros estados o si no se especifica
                return;
        }

        if (subject && htmlContent) {
            await sendEmail(user.correo, subject, htmlContent); // Corregido de user.email a user.correo
            console.log(`Notificación de estado de pedido enviada a ${user.correo} para pedido ${pedidoId}`); // Corregido
        }

    } catch (error) {
        console.error(`Error al enviar notificación de cambio de estado para pedido ${pedidoId}:`, error);
    }
}
