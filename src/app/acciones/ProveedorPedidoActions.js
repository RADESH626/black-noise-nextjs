"use server"

import connectDB from '@/utils/DBconection';
import logger from '@/utils/logger';
import { getModel } from '@/utils/modelLoader';
import { toPlainObject } from '@/utils/dbUtils';
import { revalidatePath } from 'next/cache'; // Importar revalidatePath
import mongoose from 'mongoose'; // Importar mongoose

export async function obtenerPedidosPorProveedorId(pedidoId = null, proveedorId) {
    logger.debug('Entering obtenerPedidosPorProveedorId with pedidoId:', pedidoId, 'proveedorId:', proveedorId);
    try {
        await connectDB();
        logger.debug('Database connected for obtenerPedidosPorProveedorId.');

        if (!proveedorId) {
            return { success: false, message: "ID de proveedor es requerido." };
        }
        const Pedido = await getModel('Pedido');
        // Convertir proveedorId a ObjectId de Mongoose
        const objectIdProveedorId = new mongoose.Types.ObjectId(proveedorId);
        let query = { proveedorId: objectIdProveedorId };
        if (pedidoId) {
            query._id = pedidoId;
        }

        const pedidos = await Pedido.find(query)
            .populate('items.designId', 'nombreDesing imageData imageMimeType categoria valorDesing descripcion') // Popula nombre, datos binarios, tipo MIME, categoría, valor y descripción de los diseños dentro de items
            .populate('proveedorId', 'nombreEmpresa emailContacto') // Popula algunos campos de Proveedor
            .populate('userId', 'Nombre direccion') // Popula el nombre y la dirección del usuario
            .lean();

        if (pedidoId && pedidos.length === 0) {
            logger.debug('Specific order not found for supplier or does not belong to supplier.');
            return { success: false, message: 'Pedido no encontrado o no pertenece a este proveedor.' };
        }

        logger.debug('Orders retrieved for supplier ID:', proveedorId, 'count:', pedidos.length);
        
        // Convert to plain JavaScript objects, ensuring ObjectIds are strings
        const processedPedidos = pedidos.map(p => {
            const tempPedido = { ...p }; // Crear una copia mutable
            if (tempPedido.items && Array.isArray(tempPedido.items)) {
                tempPedido.items = tempPedido.items.map(item => {
                    if (item.designId) {
                        const imageUrl = item.designId.imageData && item.designId.imageData.buffer instanceof Buffer && item.designId.imageMimeType
                            ? `data:${item.designId.imageMimeType};base64,${item.designId.imageData.buffer.toString('base64')}`
                            : null;
                        
                        // Crear un nuevo objeto designId con la propiedad 'imagen' y sin imageData/imageMimeType
                        const newDesignId = {
                            _id: item.designId._id,
                            nombreDesing: item.designId.nombreDesing,
                            valorDesing: item.designId.valorDesing,
                            categoria: item.designId.categoria,
                            descripcion: item.designId.descripcion,
                            imagen: imageUrl, // La imagen como base64
                        };

                        return { 
                            ...item, 
                            designId: newDesignId 
                        };
                    }
                    return item;
                });
            }
            return toPlainObject(tempPedido); // Convertir a objeto plano al final
        });

        // If a specific pedidoId was requested, return the single pedido object
        if (pedidoId) {
            return { success: true, pedido: processedPedidos[0] };
        } else {
            // Otherwise, return the array of all orders for the supplier
            return { success: true, pedidos: processedPedidos };
        }
    } catch (error) {
        logger.error('ERROR in obtenerPedidosPorProveedorId:', error);
        if (error.message.includes('ECONNRESET')) {
            logger.warn('ECONNRESET error detected, attempting to reconnect...');
            try {
                await connectDB(); // Attempt to reconnect
                logger.info('Database reconnected successfully.');
                // Retry the query
                return obtenerPedidosPorProveedorId(pedidoId, proveedorId);
            } catch (reconnectError) {
                logger.error('Failed to reconnect to database:', reconnectError);
                return { success: false, message: 'Error al obtener los pedidos del proveedor tras intentar reconectar: ' + reconnectError.message };
            }
        }
        return { success: false, message: 'Error al obtener los pedidos del proveedor: ' + error.message };
    }
}

export async function actualizarPedidoPorProveedor(pedidoId, proveedorId, updateData) {
    logger.debug('Entering actualizarPedidoPorProveedor with pedidoId:', pedidoId, 'proveedorId:', proveedorId, 'updateData:', updateData);
    try {
        await connectDB();
        logger.debug('Database connected for actualizarPedidoPorProveedor.');

        if (!pedidoId || !proveedorId) {
            return { success: false, message: "ID de pedido y proveedor son requeridos." };
        }

        const Pedido = await getModel('Pedido');

        // Verificar que el pedido pertenece al proveedor y obtenerlo para su total original
        const pedidoExistente = await Pedido.findOne({ _id: pedidoId, proveedorId: proveedorId });
        if (!pedidoExistente) {
            logger.debug('Pedido not found for supplier or does not belong to supplier.');
            return { success: false, message: 'Pedido no encontrado o no pertenece a este proveedor.' };
        }

        const allowedUpdates = {};
        let newTotal = pedidoExistente.total; // Inicializar con el total existente (solo ítems)

        if (updateData.estadoPedido) {
            allowedUpdates.estadoPedido = updateData.estadoPedido;
        }

        if (updateData.costoEnvio !== undefined) { // Allow 0 as a valid cost
            allowedUpdates.costoEnvio = updateData.costoEnvio;
            // Recalcular el total del pedido para incluir el costo de envío
            // El total original del pedido (pedidoExistente.total) es el total de los ítems pagados inicialmente.
            newTotal = pedidoExistente.total + updateData.costoEnvio;
            allowedUpdates.total = newTotal;

            // Si se establece un costo de envío > 0, el estado de pago debe ser PENDIENTE
            if (updateData.costoEnvio > 0) {
                allowedUpdates.estadoPago = 'PENDIENTE';
            } else { // Si el costo de envío es 0, el estado de pago debe ser PAGADO
                allowedUpdates.estadoPago = 'PAGADO';
            }
        }
        // Add other fields a supplier is allowed to update here

        if (Object.keys(allowedUpdates).length === 0) {
            return { success: false, message: "No hay campos válidos para actualizar." };
        }

        const pedidoActualizado = await Pedido.findByIdAndUpdate(pedidoId, allowedUpdates, { new: true }).lean();

        if (!pedidoActualizado) {
            logger.debug('Order not found for update with ID:', pedidoId);
            return { success: false, message: 'Pedido no encontrado para actualizar.' };
        }

        // Revalidar rutas relevantes
        revalidatePath('/perfil'); // Para que el usuario vea el total actualizado
        revalidatePath('/pagos-pendientes'); // Para que el usuario vea el total actualizado en pagos pendientes
        revalidatePath(`/proveedor/pedidos/${pedidoId}`); // Para que el proveedor vea el total actualizado

        logger.debug('Order updated by supplier in DB:', pedidoActualizado);
        return { success: true, pedido: toPlainObject(pedidoActualizado) };
    } catch (error) {
        logger.error('ERROR in actualizarPedidoPorProveedor:', error);
        return { success: false, message: 'Error al actualizar el pedido: ' + error.message };
    }
}
