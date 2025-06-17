"use server"

import Pedido from '@/models/Pedido';
import dbConnect from '@/utils/DBconection';
import { revalidatePath } from 'next/cache';
import { sendEmail } from '@/utils/nodemailer';
import { EstadoPedido } from '@/models/enums/PedidoEnums';
import { ObtenerUsuarioPorId } from '@/app/acciones/UsuariosActions';
import { getModel } from '@/utils/modelLoader'; // Importar getModel

async function guardarPedido(data) {
    try {
        await dbConnect();
        const PedidoModel = await getModel('Pedido');
        const nuevoPedido = new PedidoModel(data);

        // Si el costo de envío es mayor que 0, el estado de pago inicial es PENDIENTE
        if (nuevoPedido.costoEnvio > 0) {
            nuevoPedido.estadoPago = 'PENDIENTE';
        } else {
            // Si no hay costo de envío, o es 0, el pago se considera PAGADO
            nuevoPedido.estadoPago = 'PAGADO';
        }

        const pedidoGuardado = await nuevoPedido.save();
        revalidatePath('/admin/pedidos');
        revalidatePath('/perfil'); // Revalidar el perfil del usuario para ver nuevos pedidos
        return { success: true, data: pedidoGuardado }; // Devolver la instancia de Mongoose directamente
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
        if (oldEstado !== newEstado && newEstado !== EstadoPedido.ENTREGADO) {
            await enviarNotificacionCambioEstadoPedido(pedido._id, newEstado, oldEstado, pedido.userId);
        }

        revalidatePath('/proveedor/pedidos'); // Revalidar la página para mostrar el cambio
        return { success: true, message: 'Estado del pedido actualizado correctamente.' };
    } catch (error) {
        console.error('Error al actualizar el estado del pedido:', error);
        return { success: false, message: 'Error al actualizar el estado del pedido.', error: error.message };
    }
}

export {
    guardarPedido,
    enviarNotificacionCambioEstadoPedido,
    updateEstadoPedido
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
