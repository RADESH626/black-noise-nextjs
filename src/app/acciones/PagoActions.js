"use server"

import connectDB from '@/utils/DBconection';
import Usuario from '@/models/Usuario'; // Necesario para popular
import Venta from '@/models/Venta';   // Necesario para popular
import { revalidatePath } from 'next/cache';
import logger from '@/utils/logger';
import { guardarPedido } from '@/app/acciones/PedidoActions'; // Import guardarPedido
import { clearUserCart } from '@/app/acciones/CartActions'; // Import clearUserCart
import { getModel } from '@/utils/modelLoader';

// Crear un nuevo pago
async function guardarPago(data) {
    logger.debug('Entering guardarPago with data:', data);
    try {
        await connectDB();
        logger.debug('Database connected for guardarPago.');
        const Pago = await getModel('Pago');
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
        const Pago = await getModel('Pago');
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
        const Pago = await getModel('Pago');
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
        const Pago = await getModel('Pago');
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
        const Pago = await getModel('Pago');
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

// Procesar un pago y crear un pedido
async function procesarPagoYCrearPedido(cartItems, paymentDetails) {
    logger.debug('Entering procesarPagoYCrearPedido with cartItems:', cartItems, 'and paymentDetails:', paymentDetails);
    try {
        await connectDB();
        logger.debug('Database connected for procesarPagoYCrearPedido.');

        const Pedido = await getModel('Pedido');
        const Pago = await getModel('Pago');
        const { userId, nombre, correo, direccion, metodoPago, total, cardNumber, expiryDate, cvv } = paymentDetails;

        // 1. Simular procesamiento de pago (aquí iría la integración real con pasarela de pago)
        // Por ahora, asumimos que el pago siempre es exitoso.
        const paymentSuccessful = true;

        if (!paymentSuccessful) {
            logger.warn('Payment simulation failed.');
            return { success: false, message: 'El pago no pudo ser procesado.' };
        }

        // 2. Crear el Pedido
        const nuevoPedidoData = {
            usuarioId: userId,
            items: cartItems.map(item => ({
                designId: item.designId,
                quantity: item.quantity,
                price: item.price,
                // Otros campos relevantes del producto si es necesario
            })),
            fechaPedido: new Date(),
            estadoPedido: 'PENDIENTE', // Initial state, will be updated to PAGADO
            estadoPago: 'PAGADO', // Set directly to PAGADO as payment is successful
            total: total,
            metodoPago: metodoPago,
            direccionEnvio: direccion,
            // Otros campos del pedido como información del cliente
            cliente: { nombre, correo, direccion },
        };

        const { success: pedidoCreationSuccess, data: nuevoPedido, error: pedidoCreationError } = await guardarPedido(nuevoPedidoData);

        if (!pedidoCreationSuccess) {
            logger.error('Error creating pedido:', pedidoCreationError);
            return { success: false, message: pedidoCreationError || 'Error al crear el pedido después del pago.' };
        }
        logger.debug('Pedido created successfully:', nuevoPedido);

        // 3. Crear un nuevo registro de Pago
        const nuevoPago = new Pago({
            pedidoId: nuevoPedido._id, // Link to the newly created Pedido
            usuarioId: userId,
            valorPago: total,
            metodoPago,
            estadoTransaccion: 'PAGADO',
            detallesTarjeta: { cardNumber: cardNumber ? cardNumber.slice(-4) : 'N/A', expiryDate: expiryDate || 'N/A', cvv: '***' } // Store last 4 digits, mask CVV
        });
        const pagoGuardado = await nuevoPago.save();
        logger.debug('Pago record created and linked to Pedido:', pagoGuardado);

        // 4. Vaciar el carrito del usuario
        const { success: clearCartSuccess, message: clearCartMessage } = await clearUserCart(userId);
        if (!clearCartSuccess) {
             logger.warn('Failed to clear cart after successful payment and order creation:', clearCartMessage);
        } else {
             logger.debug('Cart cleared successfully after payment and order creation.');
        }

        revalidatePath('/perfil'); // Revalidate user profile/orders page
        revalidatePath('/admin/pedidos'); // Revalidate admin orders page
        revalidatePath('/admin/pagos'); // Revalidate admin payments page
        logger.debug('Revalidated paths /perfil, /admin/pedidos, and /admin/pagos.');

        return { success: true, message: 'Pago procesado y pedido creado exitosamente.', pedidoId: nuevoPedido._id };

    } catch (error) {
        logger.error('ERROR in procesarPagoYCrearPedido:', error);
        return { success: false, message: 'Error al procesar el pago y crear el pedido: ' + error.message };
    }
}

export {
    guardarPago,
    obtenerPagos,
    ObtenerPagoPorId,
    EditarPago,
    obtenerPagosPorUsuarioId,
    procesarPagoYCrearPedido // Export the new server action
};
