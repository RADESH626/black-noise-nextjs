"use server"

import connectDB from '@/utils/DBconection';
import Usuario from '@/models/Usuario'; // Necesario para popular
import Venta from '@/models/Venta';   // Necesario para popular
import { revalidatePath } from 'next/cache';
import logger from '@/utils/logger';
import { guardarPedido } from '@/app/acciones/PedidoActions'; // Import guardarPedido
import { clearUserCart } from '@/app/acciones/CartActions'; // Import clearUserCart
import { guardarVenta } from '@/app/acciones/VentaActions'; // Import guardarVenta
import { getModel } from '@/utils/modelLoader';
import { MetodoPago } from '@/models/enums/pago/MetodoPago'; // Import MetodoPago enum
import { assignOrderToProvider } from '@/app/acciones/assignOrderToProvider'; // Import the new server action
import { sendEmail } from '@/utils/nodemailer'; // Import sendEmail
import Proveedor from '@/models/Proveedor'; // Importar el modelo Proveedor
import Papa from 'papaparse'; // Import papaparse

// Function to export payments to CSV
async function exportarPagosCSV(filters = {}) {
    logger.debug('Entering exportarPagosCSV with filters:', filters);
    try {
        await connectDB();
        logger.debug('Database connected for exportarPagosCSV.');
        const Pago = await getModel('Pago');

        let query = {};

        if (filters.metodoPago) {
            query.metodoPago = filters.metodoPago;
        }
        if (filters.estadoTransaccion) {
            query.estadoTransaccion = filters.estadoTransaccion;
        }
        if (filters.usuarioId) {
            query.usuarioId = filters.usuarioId;
        }
        if (filters.pedidoId) {
            query.pedidoId = filters.pedidoId;
        }
        if (filters.ventaId) {
            query.ventaId = filters.ventaId;
        }
        if (filters.valorPagoMin) {
            query.valorPago = { ...query.valorPago, $gte: parseFloat(filters.valorPagoMin) };
        }
        if (filters.valorPagoMax) {
            query.valorPago = { ...query.valorPago, $lte: parseFloat(filters.valorPagoMax) };
        }
        if (filters.fechaPagoStart) {
            query.createdAt = { ...query.createdAt, $gte: new Date(filters.fechaPagoStart) };
        }
        if (filters.fechaPagoEnd) {
            query.createdAt = { ...query.createdAt, $lte: new Date(filters.fechaPagoEnd) };
        }

        const pagos = await Pago.find(query)
            .populate('usuarioId', 'Nombre primerApellido correo')
            .populate('ventaId', '_id valorVenta estadoVenta')
            .populate({
                path: 'pedidoId',
                select: 'metodoEntrega estadoPedido total',
            })
            .lean();

        const csvData = pagos.map(pago => ({
            'ID Pago': pago._id.toString(),
            'Valor Pago': pago.valorPago,
            'Método Pago': pago.metodoPago,
            'Estado Transacción': pago.estadoTransaccion,
            'Motivo': pago.motivo || 'N/A',
            'Fecha Pago': pago.createdAt ? new Date(pago.createdAt).toLocaleDateString() : 'N/A',
            'Nombre Usuario': pago.usuarioId ? `${pago.usuarioId.Nombre} ${pago.usuarioId.primerApellido}` : 'N/A',
            'Email Usuario': pago.usuarioId ? pago.usuarioId.correo : 'N/A',
            'ID Venta Asociada': pago.ventaId ? pago.ventaId._id.toString() : 'N/A',
            'Valor Venta Asociada': pago.ventaId ? pago.ventaId.valorVenta : 'N/A',
            'Estado Venta Asociada': pago.ventaId ? pago.ventaId.estadoVenta : 'N/A',
            'ID Pedido Asociado': pago.pedidoId ? pago.pedidoId._id.toString() : 'N/A',
            'Método Entrega Pedido': pago.pedidoId ? pago.pedidoId.metodoEntrega : 'N/A',
            'Estado Pedido': pago.pedidoId ? pago.pedidoId.estadoPedido : 'N/A',
            'Total Pedido': pago.pedidoId ? pago.pedidoId.total : 'N/A',
        }));

        const csv = Papa.unparse(csvData);
        return { success: true, csv, message: 'CSV de pagos generado exitosamente.' };
    } catch (error) {
        logger.error('ERROR in exportarPagosCSV:', error);
        return { success: false, error: 'Error al generar el CSV de pagos: ' + error.message };
    }
}

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
        return {
            success: true,
            data: {
                ...JSON.parse(JSON.stringify(pagoGuardado)),
                _id: pagoGuardado._id.toString(),
                ventaId: pagoGuardado.ventaId ? pagoGuardado.ventaId.toString() : null,
                usuarioId: pagoGuardado.usuarioId ? pagoGuardado.usuarioId.toString() : null,
            }
        };
    } catch (error) {
        logger.error('ERROR in guardarPago:', error);
        return { error: 'Error al guardar el pago: ' + error.message };
    }
}

// Obtener todos los pagos con paginación
async function obtenerPagos(page = 1, limit = 10, filters = {}) {
    logger.debug(`Entering obtenerPagos with page: ${page}, limit: ${limit}, filters:`, filters);
    try {
        await connectDB();
        logger.debug('Database connected for obtenerPagos.');
        const Pago = await getModel('Pago');

        let query = {};

        // Apply filters
        if (filters.metodoPago) {
            query.metodoPago = filters.metodoPago;
        }
        if (filters.estadoTransaccion) {
            query.estadoTransaccion = filters.estadoTransaccion;
        }
        if (filters.usuarioId) {
            query.usuarioId = filters.usuarioId;
        }
        if (filters.pedidoId) {
            query.pedidoId = filters.pedidoId;
        }
        if (filters.ventaId) {
            query.ventaId = filters.ventaId;
        }
        if (filters.valorPagoMin) {
            query.valorPago = { ...query.valorPago, $gte: parseFloat(filters.valorPagoMin) };
        }
        if (filters.valorPagoMax) {
            query.valorPago = { ...query.valorPago, $lte: parseFloat(filters.valorPagoMax) };
        }
        if (filters.fechaPagoStart) {
            query.createdAt = { ...query.createdAt, $gte: new Date(filters.fechaPagoStart) };
        }
        if (filters.fechaPagoEnd) {
            query.createdAt = { ...query.createdAt, $lte: new Date(filters.fechaPagoEnd) };
        }

        const skip = (page - 1) * limit;
        const totalPagos = await Pago.countDocuments(query);

        const pagos = await Pago.find(query)
            .populate('usuarioId', 'Nombre primerApellido correo')
            .populate('ventaId', '_id')
            .populate({
                path: 'pedidoId',
                select: 'metodoEntrega',
            })
            .skip(skip)
            .limit(limit)
            .lean();

        const formattedPagos = pagos.map(pago => ({
            ...pago,
            _id: pago._id.toString(),
            ventaId: pago.ventaId ? pago.ventaId.toString() : null,
            usuarioId: pago.usuarioId ? {
                ...pago.usuarioId,
                _id: pago.usuarioId._id.toString()
            } : null,
            pedidoId: pago.pedidoId ? {
                ...pago.pedidoId,
                _id: pago.pedidoId._id.toString()
            } : null,
        }));

        logger.debug('Payments retrieved from DB and formatted:', formattedPagos.length, 'payments found.');
        return {
            pagos: JSON.parse(JSON.stringify(formattedPagos)),
            totalPagos,
            currentPage: page,
            totalPages: Math.ceil(totalPagos / limit)
        };
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
            .populate('usuarioId', 'Nombre primerApellido correo')
            .populate('ventaId', '_id')
            .lean();
        logger.debug('Payment retrieved from DB:', pago);
        if (!pago) {
            logger.debug('Payment not found for ID:', id);
            return { error: 'Pago no encontrado' };
        }
        const formattedPago = {
            ...pago,
            _id: pago._id.toString(),
            ventaId: pago.ventaId ? pago.ventaId.toString() : null,
            usuarioId: pago.usuarioId ? {
                ...pago.usuarioId,
                _id: pago.usuarioId._id.toString()
            } : null,
        };
        logger.debug('Exiting ObtenerPagoPorId with formatted payment:', formattedPago);
        return JSON.parse(JSON.stringify(formattedPago));
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
        return {
            success: true,
            data: {
                ...JSON.parse(JSON.stringify(pagoActualizado)),
                _id: pagoActualizado._id.toString(),
                ventaId: pagoActualizado.ventaId ? pagoActualizado.ventaId.toString() : null,
                usuarioId: pagoActualizado.usuarioId ? pagoActualizado.usuarioId.toString() : null,
            }
        };
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
        // logger.debug('Database connected for obtenerPagosPorUsuarioId.');
        const Pago = await getModel('Pago');
        const pagos = await Pago.find({ usuarioId })
            .populate('usuarioId', 'Nombre primerApellido correo') // Popula algunos campos de Usuario
            .populate('ventaId', '_id') // Popula el ID de Venta
            .lean();

        const formattedPagos = pagos.map(pago => ({
            ...pago,
            _id: pago._id.toString(),
            ventaId: pago.ventaId ? pago.ventaId.toString() : null, // Convert ventaId to string if populated
            usuarioId: pago.usuarioId ? {
                ...pago.usuarioId,
                _id: pago.usuarioId._id.toString() // Convert userId to string
            } : null,
        }));

        // logger.debug('Payments retrieved for user ID and formatted:', usuarioId, 'count:', formattedPagos.length);
        return { success: true, pagos: JSON.parse(JSON.stringify(formattedPagos)) };
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
        const Venta = await getModel('Venta'); // Asegurarse de que el modelo Venta esté disponible
        const { userId, nombre, correo, direccion, metodoPago: rawMetodoPago, metodoEntrega, total, tarjeta, mes, anio, cvv, numeroTelefono, costoEnvio: paymentDetailsCostEnvio } = paymentDetails;
        console.log('PagoActions: Total recibido en procesarPagoYCrearPedido:', total);

        // Map rawMetodoPago to a valid enum value
        let metodoPago = rawMetodoPago;
        if (rawMetodoPago === 'tarjeta') {
            metodoPago = MetodoPago.TARJETA_CREDITO; // Default to credit card if 'tarjeta' is passed
        } else if (!Object.values(MetodoPago).includes(rawMetodoPago)) {
            logger.warn(`Invalid metodoPago received: ${rawMetodoPago}. Defaulting to EFECTIVO.`);
            metodoPago = MetodoPago.EFECTIVO; // Fallback for unexpected values
        }

        // 1. Simular procesamiento de pago (aquí iría la integración real con pasarela de pago)
        // Por ahora, asumimos que el pago siempre es exitoso.
        const paymentSuccessful = true; // Simulación de pago

        if (!paymentSuccessful) {
            logger.warn('Payment simulation failed.');
            return { success: false, message: 'El pago no pudo ser procesado.' };
        }

        const costoEnvioInicial = 0;

        // 1. Crear el Pedido (inicialmente con estadoPago PENDIENTE)
        const nuevoPedidoData = {
            userId: userId,
            items: cartItems.map(item => ({
                designId: item.designId,
                quantity: item.quantity,
                price: item.price,
            })),
            metodoEntrega: metodoEntrega,
            estadoPedido: 'PENDIENTE',
            total: total,
            costoEnvio: costoEnvioInicial,
            direccionEnvio: direccion,
            destinatario: { nombre, correo, direccion },
            fechaEstimadaEntrega: new Date(new Date().setDate(new Date().getDate() + 7)),
            estadoPago: 'PENDIENTE', // Asegurar que el estado inicial sea PENDIENTE
        };

        console.log('PagoActions: nuevoPedidoData.total antes de guardarPedido:', nuevoPedidoData.total);
        logger.debug('Value of nuevoPedidoData:', nuevoPedidoData);
        logger.debug('Type of nuevoPedidoData:', typeof nuevoPedidoData);

        const { success: pedidoCreationSuccess, data: nuevoPedido, error: pedidoCreationError } = await guardarPedido(nuevoPedidoData);

        if (!pedidoCreationSuccess) {
            logger.error('Error creating pedido:', pedidoCreationError);
            return { success: false, message: pedidoCreationError || 'Error al crear el pedido.' };
        }
        logger.debug('Pedido created successfully (instance from guardarPedido):', nuevoPedido._id);

        // 2. Crear un nuevo registro de Venta
        const nuevaVentaData = {
            usuarioId: userId,
            pedidoId: nuevoPedido._id, // Link to the newly created Pedido
            valorVenta: total,
            comisionAplicacion: total * 0.1, // Example: 10% commission
            fechaVenta: new Date(),
            estadoVenta: 'COMPLETADA', // Assuming sale is completed upon successful order and payment
        };
        const { success: ventaCreationSuccess, data: nuevaVenta, error: ventaCreationError } = await guardarVenta(nuevaVentaData);

        if (!ventaCreationSuccess) {
            logger.error('Error creating venta:', ventaCreationError);
            // Si la venta falla, cancelar el pedido
            await Pedido.findByIdAndUpdate(nuevoPedido._id, { estadoPago: 'FALLIDO', estadoPedido: 'CANCELADO', fue_cancelado: true, cancellationDate: new Date() });
            return { success: false, message: ventaCreationError || 'Error al crear el registro de venta. Pedido marcado como fallido.' };
        }
        logger.debug('Venta created successfully:', nuevaVenta);

        // 3. Crear un nuevo registro de Pago
        const nuevoPagoData = {
            usuarioId: userId,
            pedidoId: nuevoPedido._id,
            ventaId: nuevaVenta._id, // Ahora ventaId está disponible
            valorPago: total,
            metodoPago,
            estadoTransaccion: 'PAGADO', // Asumimos que el pago es exitoso aquí
            detallesTarjeta: (metodoPago === MetodoPago.TARJETA_CREDITO || metodoPago === MetodoPago.TARJETA_DEBITO) ? { cardNumber: tarjeta ? tarjeta.slice(-4) : 'N/A', expiryDate: mes && anio ? `${mes}/${anio}` : 'N/A', cvv: '***' } : undefined,
            numeroTelefono: (metodoPago === MetodoPago.NEQUI || metodoPago === MetodoPago.DAVIPLATA) ? numeroTelefono : undefined,
            motivo: 'Pago de Pedido', // Añadir el motivo del pago
        };
        let pagoGuardado;
        try {
            const nuevoPago = new Pago(nuevoPagoData);
            pagoGuardado = await nuevoPago.save();
            logger.debug('Pago record created and linked to Pedido and Venta. Pago ID:', pagoGuardado._id);
        } catch (pagoError) {
            logger.error('Error creating pago:', pagoError);
            // Si el pago falla, cancelar el pedido y la venta
            await Pedido.findByIdAndUpdate(nuevoPedido._id, { estadoPago: 'CANCELADO', estadoPedido: 'CANCELADO', fue_cancelado: true, cancellationDate: new Date() });
            await Venta.findByIdAndDelete(nuevaVenta._id); // Eliminar la venta si el pago falla
            return { success: false, message: 'Error al registrar el pago. Pedido y venta cancelados.' };
        }

        // 4. Actualizar el Pedido con el paymentId y estadoPago a PAGADO
        const updatedPedidoWithPaymentId = await Pedido.findByIdAndUpdate(
            nuevoPedido._id,
            { paymentId: pagoGuardado._id, estadoPago: 'PAGADO', ventaId: nuevaVenta._id }, // Añadir ventaId aquí
            { new: true }
        );
        logger.debug('Pedido updated with paymentId, ventaId and estadoPago PAGADO. Final Updated Pedido:', updatedPedidoWithPaymentId);

        // 5. Actualizar la Venta con el pagoId recién creado
        const updatedVentaWithPagoId = await Venta.findByIdAndUpdate(
            nuevaVenta._id,
            { $push: { pagoIds: pagoGuardado._id } },
            { new: true }
        );
        logger.debug('Venta updated with pagoId successfully. Final Updated Venta:', updatedVentaWithPagoId);

        // Fetch the newly created order and populate design details for supplier assignment
        const PedidoModel = await getModel('Pedido');
        const populatedPedido = await PedidoModel.findById(updatedPedidoWithPaymentId._id) // Usar updatedPedidoWithPaymentId
            .populate('items.designId') // Populate the designId to get category
            .lean();

        logger.debug('Populated Pedido for assignment:', populatedPedido);

        if (populatedPedido) {
            logger.debug('Attempting to assign order to provider for order ID:', populatedPedido._id);
            const { success: assignSuccess, message: assignMessage } = await assignOrderToProvider(populatedPedido);
            if (!assignSuccess) {
                logger.warn(`Failed to assign provider for order ${populatedPedido._id}: ${assignMessage}`);
            } else {
                logger.debug(`Order ${populatedPedido._id} successfully assigned to provider.`);
            }
        } else {
            logger.error(`Could not find newly created order ${updatedPedidoWithPaymentId._id} for provider assignment.`);
        }

        // 6. Vaciar el carrito del usuario
        const { success: clearCartSuccess, message: clearCartMessage } = await clearUserCart(userId);
        if (!clearCartSuccess) {
             logger.warn('Failed to clear cart after successful payment and order creation:', clearCartMessage);
        } else {
             logger.debug('Cart cleared successfully after payment and order creation.');
        }

        // 7. Enviar correo de confirmación al usuario
        const emailSubject = 'Confirmación de Pedido BlackNoise';
        const emailBody = `
            <h1>¡Gracias por tu compra, ${nombre}!</h1>
            <p>Tu pedido ha sido registrado correctamente.</p>
            <p><strong>Número de Pedido:</strong> ${nuevoPedido._id.toString()}</p>
            <p>Puedes ver los detalles de tu pedido en tu perfil de BlackNoise.</p>
            <p>¡Esperamos que disfrutes tus diseños!</p>
            <br/>
            <p>Atentamente,</p>
            <p>El equipo de BlackNoise</p>
        `;
        try {
            await sendEmail({ to: correo, subject: emailSubject, html: emailBody });
            logger.debug(`Confirmation email sent to ${correo} for order ${nuevoPedido._id}.`);
        } catch (emailError) {
            logger.error(`Failed to send confirmation email to ${correo} for order ${nuevoPedido._id}:`, emailError);
        }

        revalidatePath('/perfil'); // Revalidate user profile/orders page
        revalidatePath('/admin/pedidos'); // Revalidate admin orders page
        revalidatePath('/admin/pagos'); // Revalidate admin payments page
        revalidatePath('/admin/ventas'); // Revalidate admin sales page
        logger.debug('Revalidated paths /perfil, /admin/pedidos, /admin/pagos, and /admin/ventas.');

        return { success: true, message: 'Pago procesado y pedido creado exitosamente.', pedidoId: nuevoPedido._id.toString() };

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
    procesarPagoYCrearPedido,
    obtenerPagosPendientesPorUsuario,
    registrarPagoEnvioSimulado, // Exportar la nueva acción de servidor
    exportarPagosCSV // Exportar la función exportarPagosCSV
};

// Registrar un pago de envío simulado
async function registrarPagoEnvioSimulado(pedidoId, paymentData) {
    logger.debug('Entering registrarPagoEnvioSimulado with pedidoId:', pedidoId, 'and paymentData:', paymentData);
    try {
        await connectDB();
        logger.debug('Database connected for registrarPagoEnvioSimulado.');

        const PedidoModel = await getModel('Pedido');
        const PagoModel = await getModel('Pago');
        const VentaModel = await getModel('Venta'); // Obtener el modelo Venta

        const pedido = await PedidoModel.findById(pedidoId).lean();

        if (!pedido) {
            logger.warn('Pedido not found for registrarPagoEnvioSimulado with ID:', pedidoId);
            return { success: false, message: 'Pedido no encontrado.' };
        }

        if (pedido.costoEnvio <= 0 || pedido.estadoPago !== 'PENDIENTE') {
            logger.warn('Pedido does not have a pending shipping cost or is already paid:', pedidoId);
            return { success: false, message: 'El pedido no tiene un costo de envío pendiente o ya ha sido pagado.' };
        }

        // 1. Actualizar el estado de pago del Pedido
        const updatedPedido = await PedidoModel.findByIdAndUpdate(
            pedidoId,
            { estadoPago: 'PAGADO' },
            { new: true }
        ).lean();
        logger.debug('Pedido updated to PAGADO:', updatedPedido);

        // **NUEVO: Crear una nueva Venta para este pago de envío**
        const nuevaVentaEnvioData = {
            usuarioId: pedido.userId,
            pedidoId: pedido._id,
            valorVenta: pedido.costoEnvio, // La venta es por el costo de envío
            comisionAplicacion: 0, // No hay comisión para el envío, o se define aquí
            fechaVenta: new Date(),
            estadoVenta: 'COMPLETADA', // La venta de envío se completa al pagar
            // Podrías añadir un campo 'tipoVenta: 'ENVIO'' si es necesario diferenciar
        };
        const { success: ventaEnvioSuccess, data: nuevaVentaEnvio, error: ventaEnvioError } = await guardarVenta(nuevaVentaEnvioData);

        if (!ventaEnvioSuccess) {
            logger.error('Error creating Venta for shipping payment:', ventaEnvioError);
            return { success: false, message: ventaEnvioError || 'Error al crear la venta para el pago de envío.' };
        }
        logger.debug('New Venta created for shipping payment:', nuevaVentaEnvio);

        // 2. Crear un nuevo registro de Pago
        const nuevoPagoEnvio = new PagoModel({
            usuarioId: pedido.userId,
            pedidoId: pedido._id,
            ventaId: nuevaVentaEnvio._id, // Usar el ID de la Venta de envío recién creada
            valorPago: pedido.costoEnvio,
            metodoPago: MetodoPago.TARJETA_CREDITO,
            estadoTransaccion: 'PAGADO',
            detallesTarjeta: {
                cardNumber: paymentData.cardNumber ? paymentData.cardNumber.slice(-4) : 'N/A',
                expiryDate: paymentData.expiryDate || 'N/A',
                cvv: paymentData.cvv ? '***' : 'N/A'
            },
            motivo: 'Pago de Envío' // Añadir el motivo del pago
        });
        const pagoEnvioGuardado = await nuevoPagoEnvio.save();
        logger.debug('Nuevo registro de Pago de envío creado:', pagoEnvioGuardado);

        revalidatePath('/pagos-pendientes');
        revalidatePath('/perfil');
        revalidatePath('/admin/pedidos'); // Por si acaso
        revalidatePath('/admin/pagos'); // Por si acaso
        logger.debug('Revalidated paths for pending payments.');

        return { success: true, message: 'Pago de envío registrado exitosamente.' };

    } catch (error) {
        logger.error('ERROR in registrarPagoEnvioSimulado:', error);
        return { success: false, message: 'Error al registrar el pago de envío simulado: ' + error.message };
    }
}

// Obtener pagos pendientes por usuario ID
async function obtenerPagosPendientesPorUsuario(userId) {
    // logger.debug('Entering obtenerPagosPendientesPorUsuario with userId:', userId);
    try {
        await connectDB();
        // logger.debug('Database connected for obtenerPagosPendientesPorUsuario.');
        const Pedido = await getModel('Pedido');
        
        const query = {
            userId: userId,
            costoEnvio: { $gt: 0 }, // Costo de envío mayor que 0
            estadoPago: 'PENDIENTE' // Estado de pago pendiente
        };
        // logger.debug('Query for pending payments:', query);

        const pedidosPendientes = await Pedido.find(query)
            .populate('proveedorId', 'nombreEmpresa correo telefono') // Popula información del proveedor
            .lean();

        logger.debug('Raw pending payments retrieved:', pedidosPendientes);

        const formattedPedidos = pedidosPendientes.map(pedido => ({
            ...pedido,
            _id: pedido._id.toString(),
            userId: pedido.userId.toString(),
            proveedorId: pedido.proveedorId ? {
                ...pedido.proveedorId,
                _id: pedido.proveedorId._id.toString()
            } : null,
            items: pedido.items.map(item => ({
                ...item,
                designId: item.designId.toString()
            })),
            paymentId: pedido.paymentId ? pedido.paymentId.toString() : null,
        }));

        // logger.debug('Pending payments retrieved for user ID and formatted:', userId, 'count:', formattedPedidos.length, 'Formatted data:', formattedPedidos);
        return { success: true, pedidos: JSON.parse(JSON.stringify(formattedPedidos)) };
    } catch (error) {
        logger.error('ERROR in obtenerPagosPendientesPorUsuario:', error);
        return { success: false, message: 'Error al obtener los pagos pendientes del usuario: ' + error.message };
    }
}
