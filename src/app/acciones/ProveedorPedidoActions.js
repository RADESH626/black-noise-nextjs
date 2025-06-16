"use server"

import connectDB from '@/utils/DBconection';
import logger from '@/utils/logger';
import { getModel } from '@/utils/modelLoader';
import { toPlainObject } from '@/utils/dbUtils';

export async function obtenerPedidosPorProveedorId(pedidoId = null, proveedorId) {
    logger.debug('Entering obtenerPedidosPorProveedorId with pedidoId:', pedidoId, 'proveedorId:', proveedorId);
    try {
        await connectDB();
        logger.debug('Database connected for obtenerPedidosPorProveedorId.');

        if (!proveedorId) {
            return { success: false, message: "ID de proveedor es requerido." };
        }
        const Pedido = await getModel('Pedido');
        let query = { proveedorId: proveedorId };
        if (pedidoId) {
            query._id = pedidoId;
        }

        const pedidos = await Pedido.find(query)
            .populate('items.designId', 'nombreDesing imageData imageMimeType') // Popula nombre, datos binarios y tipo MIME de los diseños dentro de items
            .populate('proveedorId', 'nombreEmpresa emailContacto') // Popula algunos campos de Proveedor
            .lean();

        if (pedidoId && pedidos.length === 0) {
            logger.debug('Specific order not found for supplier or does not belong to supplier.');
            return { success: false, message: 'Pedido no encontrado o no pertenece a este proveedor.' };
        }

        logger.debug('Orders retrieved for supplier ID:', proveedorId, 'count:', pedidos.length);
        
        // Convert to plain JavaScript objects, ensuring ObjectIds are strings
        const plainPedidos = pedidos.map(p => toPlainObject(p));

        // If a specific pedidoId was requested, return the single pedido object
        if (pedidoId) {
            return { success: true, pedido: plainPedidos[0] };
        } else {
            // Otherwise, return the array of all orders for the supplier
            return { success: true, pedidos: plainPedidos };
        }
    } catch (error) {
        logger.error('ERROR in obtenerPedidosPorProveedorId:', error);
        return { success: false, message: 'Error al obtener los pedidos del proveedor: ' + error.message };
    }
}
