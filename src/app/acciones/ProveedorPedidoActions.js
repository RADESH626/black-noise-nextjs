"use server"

import connectDB from '@/utils/DBconection';
import logger from '@/utils/logger';
import { getModel } from '@/utils/modelLoader';
import { toPlainObject } from '@/utils/dbUtils';
import { revalidatePath } from 'next/cache'; // Importar revalidatePath
import mongoose from 'mongoose'; // Importar mongoose

export async function obtenerPedidosPorProveedorId(filters = {}) {
    logger.debug('Entering obtenerPedidosPorProveedorId with filters:', filters);
    try {
        await connectDB();
        logger.debug('Database connected for obtenerPedidosPorProveedorId.');

        const { pedidoId, proveedorId, searchText, startDate, endDate, estadoPedido } = filters;

        if (!proveedorId) {
            return { success: false, message: "ID de proveedor es requerido." };
        }

        const Pedido = await getModel('Pedido');
        const UsuarioModel = await getModel('Usuario');

        const objectIdProveedorId = new mongoose.Types.ObjectId(proveedorId);
        let query = { proveedorId: objectIdProveedorId };

        if (pedidoId) {
            query._id = pedidoId;
        }

        if (searchText) {
            // Buscar por ID de pedido, o por nombre/email de usuario (requiere populate)
            const matchingUsers = await UsuarioModel.find({
                $or: [
                    { Nombre: { $regex: searchText, $options: 'i' } },
                    { primerApellido: { $regex: searchText, $options: 'i' } },
                    { correo: { $regex: searchText, $options: 'i' } },
                ]
            }).select('_id').lean();
            const matchingUserIds = matchingUsers.map(user => user._id);

            query.$or = [
                { _id: { $regex: searchText, $options: 'i' } }, // Buscar por ID de pedido
                { userId: { $in: matchingUserIds } } // Buscar por IDs de usuario coincidentes
            ];
        }

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                const endOfDay = new Date(endDate);
                endOfDay.setHours(23, 59, 59, 999); // Set to end of the day
                query.createdAt.$lte = endOfDay;
            }
        }

        if (estadoPedido) {
            query.estadoPedido = estadoPedido;
        }

        const pedidos = await Pedido.find(query)
            .populate('items.designId', 'nombreDesing imageData imageMimeType categoria valorDesing descripcion')
            .populate('proveedorId', 'nombreEmpresa emailContacto')
            .populate('userId', 'Nombre direccion')
            .lean();

        if (pedidoId && pedidos.length === 0) {
            logger.debug('Specific order not found for supplier or does not belong to supplier.');
            return { success: false, message: 'Pedido no encontrado o no pertenece a este proveedor.' };
        }
        
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

        if (pedidoId) {
            return { success: true, pedido: processedPedidos[0] };
        } else {
            return { success: true, pedidos: processedPedidos };
        }
    } catch (error) {
        logger.error('ERROR in obtenerPedidosPorProveedorId:', error);
        if (error.message.includes('ECONNRESET')) {
            logger.warn('ECONNRESET error detected, attempting to reconnect...');
            try {
                await connectDB();
                logger.info('Database reconnected successfully.');
                return obtenerPedidosPorProveedorId(filters);
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
