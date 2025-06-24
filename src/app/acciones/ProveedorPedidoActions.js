"use server"

import connectDB from '@/utils/DBconection';
import logger from '@/utils/logger';
import { getModel } from '@/utils/modelLoader';
import { toPlainObject } from '@/utils/dbUtils';
import { revalidatePath } from 'next/cache'; // Importar revalidatePath
import mongoose from 'mongoose'; // Importar mongoose

export async function obtenerPedidosPorProveedorId(filters) {
    filters = filters || {};
    logger.debug('Entering obtenerPedidosPorProveedorId with filters:', filters);
    console.log("Proveedor ID received in obtenerPedidosPorProveedorId:", filters.proveedorId); // Added for debugging
    try {
        await connectDB();
        logger.debug('Database connected for obtenerPedidosPorProveedorId.');

        const { 
            pedidoId, 
            proveedorId, 
            searchText, 
            startDate, 
            endDate, 
            estadoPedido, 
            estadoPago, 
            metodoEntrega, 
            usuarioComprador, 
            minValorTotal, 
            maxValorTotal, 
            fechaPedidoStart, 
            fechaPedidoEnd, 
            pedidoCancelado, 
            pedidoRefabricado 
        } = filters;

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
            const searchConditions = [];

            // Intenta buscar por ID de pedido si es un ObjectId válido
            if (mongoose.Types.ObjectId.isValid(searchText)) {
                searchConditions.push({ _id: new mongoose.Types.ObjectId(searchText) });
            }

            // Buscar por nombre/email de usuario
            const matchingUsers = await UsuarioModel.find({
                $or: [
                    { Nombre: { $regex: searchText, $options: 'i' } },
                    { primerApellido: { $regex: searchText, $options: 'i' } },
                    { correo: { $regex: searchText, $options: 'i' } },
                ]
            }).select('_id').lean();
            const matchingUserIds = matchingUsers.map(user => user._id);

            if (matchingUserIds.length > 0) {
                searchConditions.push({ userId: { $in: matchingUserIds } });
            }

            if (searchConditions.length > 0) {
                query.$or = searchConditions;
            } else {
                // Si no hay condiciones de búsqueda válidas, no se encontrarán pedidos
                query._id = null; 
            }
        }

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                const endOfDay = new Date(endDate);
                endOfDay.setHours(23, 59, 59, 999);
                query.createdAt.$lte = endOfDay;
            }
        }

        if (estadoPedido) {
            query.estadoPedido = estadoPedido;
        }

        if (estadoPago) {
            query.estadoPago = estadoPago;
        }

        if (metodoEntrega) {
            query.metodoEntrega = metodoEntrega;
        }

        if (usuarioComprador) {
            const user = await UsuarioModel.findOne({ correo: usuarioComprador }).select('_id').lean();
            if (user) {
                query.userId = user._id;
            } else {
                query.userId = null; // No user found, so no orders will match
            }
        }

        if (minValorTotal || maxValorTotal) {
            query.total = {};
            if (minValorTotal) {
                query.total.$gte = parseFloat(minValorTotal);
            }
            if (maxValorTotal) {
                query.total.$lte = parseFloat(maxValorTotal);
            }
        }

        if (fechaPedidoStart || fechaPedidoEnd) {
            query.createdAt = query.createdAt || {};
            if (fechaPedidoStart) {
                query.createdAt.$gte = new Date(fechaPedidoStart);
            }
            if (fechaPedidoEnd) {
                const endOfDay = new Date(fechaPedidoEnd);
                endOfDay.setHours(23, 59, 59, 999);
                query.createdAt.$lte = endOfDay;
            }
        }

        if (pedidoCancelado !== undefined) {
            query.pedidoCancelado = pedidoCancelado === 'true';
        }

        if (pedidoRefabricado !== undefined) {
            query.pedidoRefabricado = pedidoRefabricado === 'true';
        }

        const pedidos = await Pedido.find(query)
            .populate('items.designId', 'nombreDesing imageData imageMimeType categoria valorDesing descripcion')
            .populate('proveedorId', 'nombreEmpresa emailContacto')
            .populate('userId', 'Nombre primerApellido correo direccion') // Populate more user fields for display
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
            // Add user details directly to the pedido object for easier access in frontend
            if (tempPedido.userId) {
                tempPedido.userName = `${tempPedido.userId.Nombre} ${tempPedido.userId.primerApellido}`;
                tempPedido.userEmail = tempPedido.userId.correo;
                tempPedido.userAddress = tempPedido.userId.direccion;
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
            logger.debug(`Costo de envío recibido: ${updateData.costoEnvio}, Nuevo total calculado: ${newTotal}, Estado de pago establecido: ${allowedUpdates.estadoPago}`);
        }
        // Add other fields a supplier is allowed to update here

        if (Object.keys(allowedUpdates).length === 0) {
            return { success: false, message: "No hay campos válidos para actualizar." };
        }

        logger.debug('Allowed updates before findByIdAndUpdate:', allowedUpdates);
        const pedidoActualizado = await Pedido.findByIdAndUpdate(pedidoId, allowedUpdates, { new: true }).lean();

        if (!pedidoActualizado) {
            logger.debug('Order not found for update with ID:', pedidoId);
            return { success: false, message: 'Pedido no encontrado para actualizar.' };
        }

        // Revalidar rutas relevantes
        revalidatePath('/perfil'); // Para que el usuario vea el total actualizado
        revalidatePath('/pagos-pendientes'); // Para que el usuario vea el total actualizado en pagos pendientes
        revalidatePath('/proveedor/pedidos'); // Para que la lista de pedidos del proveedor se actualice
        revalidatePath(`/proveedor/pedidos/${pedidoId}`); // Para que el proveedor vea el total actualizado en la página de detalle

        logger.debug('Order updated by supplier in DB:', pedidoActualizado);
        return { success: true, pedido: toPlainObject(pedidoActualizado) };
    } catch (error) {
        logger.error('ERROR in actualizarPedidoPorProveedor:', error);
        return { success: false, message: 'Error al actualizar el pedido: ' + error.message };
    }
}
