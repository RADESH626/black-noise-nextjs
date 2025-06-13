"use server"

import connectDB from '@/utils/DBconection';
import Pago from '@/models/Pago';
import Pedido from '@/models/Pedido'; // Import Pedido model
import Usuario from '@/models/Usuario'; // Necesario para popular
import Venta from '@/models/Venta';   // Necesario para popular
import { revalidatePath } from 'next/cache';
import logger from '@/utils/logger';
import { EditarPedido } from '@/app/acciones/PedidoActions'; // Import EditarPedido
import { clearUserCart } from '@/app/acciones/CartActions'; // Import clearUserCart

// Crear un nuevo pago
async function guardarPago(data) {
    logger.debug('Entering guardarPago with data:', data);
    try {
        await connectDB();
        logger.debug('Database connected for guardarPago.');
        const nuevoPago = new Pago(data);
        logger.debug('New Pago instance created:', nuevoPago);
        const pagoGuardado = await nuevoPago.save();
        logger.debug('Pago saved to DB:', pagoGuardado);
        revalidatePath('/admin/pagos');
        logger.debug('Revalidated path /admin/pagos.');
        return { success: true, data: JSON.parse(JSON.stringify(pagoGuardado)) };
    } catch (error) {
        logger.error('ERROR in guardarPago:', error);
        return { error: 'Error al guardar el pago: ' + error.message };
    }
}

// Obtener todos los pagos
async function obtenerPagos() {
    logger.debug('Entering obtenerPagos.');
    try {
        await connectDB();
        logger.debug('Database connected for obtenerPagos.');
        const pagos = await Pago.find({})
            .populate('usuarioId', 'nombreUsuario correo') // Popula algunos campos de Usuario
            .populate('ventaId', '_id') // Popula el ID de Venta
            .lean();
        logger.debug('Payments retrieved from DB:', pagos.length, 'payments found.');
        return { pagos: JSON.parse(JSON.stringify(pagos)) };
    } catch (error) {
        logger.error('ERROR in obtenerPagos:', error);
        return { error: 'Error al obtener los pagos: ' + error.message };
    }
}

// Obtener pago por ID
async function ObtenerPagoPorId(id) {
    logger.debug('Entering ObtenerPagoPorId with ID:', id);
    try {
        await connectDB();
        logger.debug('Database connected for ObtenerPagoPorId.');
        const pago = await Pago.findById(id)
            .populate('usuarioId', 'nombreUsuario correo')
            .populate('ventaId', '_id')
            .lean();
        logger.debug('Payment retrieved from DB:', pago);
        if (!pago) {
            logger.debug('Payment not found for ID:', id);
            return { error: 'Pago no encontrado' };
        }
        logger.debug('Exiting ObtenerPagoPorId with payment:', JSON.parse(JSON.stringify(pago)));
        return JSON.parse(JSON.stringify(pago));
    } catch (error) {
        logger.error('ERROR in ObtenerPagoPorId:', error);
        return { error: 'Error al obtener el pago: ' + error.message };
    }
}

// Editar pago (principalmente para cambiar estado)
async function EditarPago(id, data) {
    logger.debug('Entering EditarPago with ID:', id, 'and data:', data);
    try {
        await connectDB();
        logger.debug('Database connected for EditarPago.');
        // Asegurarse de que solo se actualicen campos permitidos, ej. estadoPago
        const updateData = {
            estadoPago: data.estadoPago,
            // Se podrían añadir otros campos si fuera necesario, como metodoPago o valorPago si se permite editar.
            // Por ahora, solo estadoPago.
        };
        if (data.metodoPago) updateData.metodoPago = data.metodoPago;
        if (data.valorPago) updateData.valorPago = parseFloat(data.valorPago);
        logger.debug('Update data prepared:', updateData);


        const pagoActualizado = await Pago.findByIdAndUpdate(id, updateData, { new: true }).lean();
        logger.debug('Payment updated in DB:', pagoActualizado);
        if (!pagoActualizado) {
            logger.debug('Payment not found for update with ID:', id);
            return { error: 'Pago no encontrado para actualizar' };
        }
        revalidatePath('/admin/pagos');
        revalidatePath(`/admin/pagos/editar/${id}`);
        logger.debug('Revalidated paths /admin/pagos and /admin/pagos/editar/${id}.');
        return { success: true, data: JSON.parse(JSON.stringify(pagoActualizado)) };
    } catch (error) {
        logger.error('ERROR in EditarPago:', error);
        return { error: 'Error al editar el pago: ' + error.message };
    }
}

// Obtener pagos por usuario ID
async function obtenerPagosPorUsuarioId(usuarioId) {
    logger.debug('Entering obtenerPagosPorUsuarioId with usuarioId:', usuarioId);
    try {
        await connectDB();
        logger.debug('Database connected for obtenerPagosPorUsuarioId.');
        const pagos = await Pago.find({ usuarioId })
            .populate('usuarioId', 'nombreUsuario correo') // Popula algunos campos de Usuario
            .populate('ventaId', '_id') // Popula el ID de Venta
            .lean();
        logger.debug('Payments retrieved for user ID:', usuarioId, 'count:', pagos.length);
        return { success: true, pagos: JSON.parse(JSON.stringify(pagos)) };
    } catch (error) {
        logger.error('ERROR in obtenerPagosPorUsuarioId:', error);
        return { success: false, message: 'Error al obtener los pagos del usuario: ' + error.message };
    }
}

// No se implementa EliminarPago directamente, los pagos suelen cambiar de estado (ej. ANULADO)

// Procesar un pago para un pedido existente
async function procesarPagoDePedido(paymentData) {
    logger.debug('Entering procesarPagoDePedido with data:', paymentData);
    try {
        await connectDB();
        logger.debug('Database connected for procesarPagoDePedido.');

        const { pedidoId, valorPedido, cardNumber, expiryDate, cvv, metodoPago } = paymentData;

        // 1. Crear un nuevo registro de Pago
        const nuevoPago = new Pago({
            pedidoId,
            usuarioId: paymentData.userId, // Assuming userId is passed in paymentData
            valorPago: valorPedido,
            metodoPago,
            estadoTransaccion: 'PAGADO', // Consistent with EstadoPago enum
            detallesTarjeta: { cardNumber: cardNumber.slice(-4), expiryDate, cvv: '***' } // Store last 4 digits, mask CVV
        });
        const pagoGuardado = await nuevoPago.save();
        logger.debug('Pago record created:', pagoGuardado);

        // 2. Actualizar el estadoPago del Pedido correspondiente a PAGADO
        const { success: pedidoUpdateSuccess, error: pedidoUpdateError } = await EditarPedido(pedidoId, { estadoPago: 'PAGADO' });

        if (!pedidoUpdateSuccess) {
            logger.error('Error updating pedido status:', pedidoUpdateError);
            // Optionally, revert the payment record or mark it as failed
            return { success: false, message: pedidoUpdateError || 'Error al actualizar el estado del pedido.' };
        }

        // 3. Clear the user's cart after successful payment
        const { success: clearCartSuccess, message: clearCartMessage } = await clearUserCart(paymentData.userId);
        if (!clearCartSuccess) {
             logger.warn('Failed to clear cart after successful payment:', clearCartMessage);
             // Decide how to handle this: log, alert admin, but don't fail the payment process
        } else {
             logger.debug('Cart cleared successfully after payment.');
        }


        revalidatePath('/perfil'); // Revalidate user profile/orders page
        revalidatePath('/admin/pedidos'); // Revalidate admin orders page
        logger.debug('Revalidated paths /perfil and /admin/pedidos.');

        return { success: true, message: 'Pago procesado y pedido actualizado exitosamente.' };

    } catch (error) {
        logger.error('ERROR in procesarPagoDePedido:', error);
        return { success: false, message: 'Error al procesar el pago: ' + error.message };
    }
}

export {
    guardarPago,
    obtenerPagos,
    ObtenerPagoPorId,
    EditarPago,
    obtenerPagosPorUsuarioId,
    procesarPagoDePedido // Export the new server action
};
