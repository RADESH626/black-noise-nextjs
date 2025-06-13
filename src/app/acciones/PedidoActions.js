"use server"

import connectDB from '@/utils/DBconection';
import Pedido from '@/models/Pedido';
import Design from '@/models/Design';     // Necesario para popular
import Proveedor from '@/models/Proveedor'; // Necesario para popular
import { revalidatePath } from 'next/cache';
import logger from '@/utils/logger';

// Crear un nuevo pedido
async function guardarPedido(userId, items, valorPedido, proveedorId = null, fechaEstimadaEntrega = null, detallesPedido = []) {
    logger.debug('Entering guardarPedido with data:', { userId, items, valorPedido, proveedorId, fechaEstimadaEntrega, detallesPedido });
    try {
        await connectDB();
        logger.debug('Database connected for guardarPedido.');

        const nuevoPedido = new Pedido({
            userId,
            items,
            valorPedido,
            proveedorId,
            fechaEstimadaEntrega,
            detallesPedido
        });
        logger.debug('New Pedido instance created:', nuevoPedido);
        const pedidoGuardado = await nuevoPedido.save();
        console.log(`Nuevo pedido agregado a la base de datos con ID: ${pedidoGuardado._id}`);
        logger.debug('Pedido saved to DB:', pedidoGuardado);
        revalidatePath('/admin/pedidos'); // Revalidate admin orders page
        revalidatePath('/perfil'); // Revalidate user profile page
        logger.debug('Revalidated paths /admin/pedidos and /perfil.');
        return { success: true, data: JSON.parse(JSON.stringify(pedidoGuardado)) };
    } catch (error) {
        logger.error('ERROR in guardarPedido:', error);
        return { error: 'Error al guardar el pedido: ' + error.message };
    }
}

// Obtener todos los pedidos
async function obtenerPedidos() {
    logger.debug('Entering obtenerPedidos.');
    try {
        await connectDB();
        logger.debug('Database connected for obtenerPedidos.');
        const pedidos = await Pedido.find({})
            .populate('userId', 'nombre email') // Popula el usuario
            .populate('items.designId', 'nombreDesing imagenDesing') // Popula nombre e imagen de los diseños dentro de items
            .populate('proveedorId', 'nombreProveedor contactoPrincipal') // Popula algunos campos de Proveedor
            .lean();
        logger.debug('Orders retrieved from DB:', pedidos.length, 'orders found.');
        return { pedidos: JSON.parse(JSON.stringify(pedidos)) };
    } catch (error) {
        logger.error('ERROR in obtenerPedidos:', error);
        return { error: 'Error al obtener los pedidos: ' + error.message };
    }
}

<<<<<<< HEAD
// Obtener pedidos por usuario ID (todos los estados)
=======
// Obtener pedidos por usuario ID
>>>>>>> 23672fd20f631b662f6c2b26b31a77a6288784c6
async function obtenerPedidosPorUsuarioId(usuarioId) {
    logger.debug('Entering obtenerPedidosPorUsuarioId with usuarioId:', usuarioId);
    try {
        await connectDB();
        logger.debug('Database connected for obtenerPedidosPorUsuarioId.');
        const pedidos = await Pedido.find({ userId: usuarioId }) // Changed from usuarioId to userId to match schema
            .populate('items.designId', 'nombreDesing imagenDesing') // Popula nombre e imagen de los diseños dentro de items
            .populate('proveedorId', 'nombreProveedor contactoPrincipal')
            .lean();
        logger.debug('Orders retrieved for user ID:', usuarioId, 'count:', pedidos.length);
        return { pedidos: JSON.parse(JSON.stringify(pedidos)) };
    } catch (error) {
        logger.error('ERROR in obtenerPedidosPorUsuarioId:', error);
        return { success: false, message: 'Error al obtener los pedidos del usuario: ' + error.message };
    }
}

<<<<<<< HEAD
// Obtener pedidos pagados por usuario ID (Historial de compras)
async function obtenerPedidosPagadosPorUsuarioId(usuarioId) {
    logger.debug('Entering obtenerPedidosPagadosPorUsuarioId with usuarioId:', usuarioId);
    try {
        await connectDB();
        logger.debug('Database connected for obtenerPedidosPagadosPorUsuarioId.');
        const pedidos = await Pedido.find({ userId: usuarioId, estadoPago: 'PAGADO' }) // Filter by PAGADO status
            .populate('items.designId', 'nombreDesing imagenDesing') // Popula nombre e imagen de los diseños dentro de items
            .populate('proveedorId', 'nombreProveedor contactoPrincipal')
            .lean();
        logger.debug('Paid orders retrieved for user ID:', usuarioId, 'count:', pedidos.length);
        return { pedidos: JSON.parse(JSON.stringify(pedidos)) };
    } catch (error) {
        logger.error('ERROR in obtenerPedidosPagadosPorUsuarioId:', error);
        return { success: false, message: 'Error al obtener los pedidos pagados del usuario: ' + error.message };
    }
}

=======
>>>>>>> 23672fd20f631b662f6c2b26b31a77a6288784c6
// Obtener pedidos por ID de Proveedor (puede ser un pedido específico o todos los de un proveedor)
export async function obtenerPedidosPorProveedorId(pedidoId = null, proveedorId) {
    logger.debug('Entering obtenerPedidosPorProveedorId with pedidoId:', pedidoId, 'proveedorId:', proveedorId);
    try {
        await connectDB();
        logger.debug('Database connected for obtenerPedidosPorProveedorId.');

        if (!proveedorId) {
            return { success: false, message: "ID de proveedor es requerido." };
        }

        let query = { proveedorId: proveedorId };
        if (pedidoId) {
            query._id = pedidoId;
        }

        const pedidos = await Pedido.find(query)
            .populate('items.designId', 'nombreDesing imagenDesing') // Popula nombre e imagen de los diseños dentro de items
            .populate('proveedorId', 'nombreEmpresa emailContacto') // Popula algunos campos de Proveedor
            .lean();

        if (pedidoId && pedidos.length === 0) {
            logger.debug('Specific order not found for supplier or does not belong to supplier.');
            return { success: false, message: 'Pedido no encontrado o no pertenece a este proveedor.' };
        }

        logger.debug('Orders retrieved for supplier ID:', proveedorId, 'count:', pedidos.length);
        
        // If a specific pedidoId was requested, return the single pedido object
        if (pedidoId) {
            return { success: true, pedido: JSON.parse(JSON.stringify(pedidos[0])) };
        } else {
            // Otherwise, return the array of all orders for the supplier
            return { success: true, pedidos: JSON.parse(JSON.stringify(pedidos)) };
        }
    } catch (error) {
        logger.error('ERROR in obtenerPedidosPorProveedorId:', error);
        return { success: false, message: 'Error al obtener los pedidos del proveedor: ' + error.message };
    }
}

// Obtener pedido por ID (para uso general/admin)
async function ObtenerPedidoPorId(id) {
    logger.debug('Entering ObtenerPedidoPorId with ID:', id);
    try {
        await connectDB();
        logger.debug('Database connected for ObtenerPedidoPorId.');
        const pedido = await Pedido.findById(id)
            .populate('userId', 'nombre email') // Popula el usuario
            .populate('items.designId', 'nombreDesing imagenDesing') // Popula nombre e imagen de los diseños dentro de items
            .populate('proveedorId', 'nombreEmpresa emailContacto')
            .lean();
        logger.debug('Order retrieved from DB:', pedido);
        if (!pedido) {
            logger.debug('Order not found for ID:', id);
            return { success: false, message: 'Pedido no encontrado' };
        }
        logger.debug('Exiting ObtenerPedidoPorId with order:', JSON.parse(JSON.stringify(pedido)));
        return { success: true, pedido: JSON.parse(JSON.stringify(pedido)) };
    } catch (error) {
        logger.error('ERROR in ObtenerPedidoPorId:', error);
        return { success: false, message: 'Error al obtener el pedido: ' + error.message };
    }
}

// Editar pedido (principalmente para cambiar estado, fecha estimada, detalles)
async function EditarPedido(id, data) {
    logger.debug('Entering EditarPedido with ID:', id, 'and data:', data);
    try {
        await connectDB();
        logger.debug('Database connected for EditarPedido.');
        
        const updateData = { ...data };
        // Assuming 'items' will be passed as an array of objects directly
        // No need for string splitting for desingIds or items
        if (updateData.detallesPedido && typeof updateData.detallesPedido === 'string') {
            updateData.detallesPedido = updateData.detallesPedido.split(',').map(detalle => detalle.trim()).filter(detalle => detalle);
            logger.debug('Converted updateData.detallesPedido to array:', updateData.detallesPedido);
        }
        logger.debug('Update data prepared:', updateData);

        const pedidoActualizado = await Pedido.findByIdAndUpdate(id, updateData, { new: true }).lean();
        logger.debug('Order updated in DB:', pedidoActualizado);
        if (!pedidoActualizado) {
            logger.debug('Order not found for update with ID:', id);
            return { error: 'Pedido no encontrado para actualizar' };
        }
        revalidatePath('/admin/pedidos');
        revalidatePath(`/admin/pedidos/editar/${id}`);
        logger.debug('Revalidated paths /admin/pedidos and /admin/pedidos/editar/${id}.');
        return { success: true, data: JSON.parse(JSON.stringify(pedidoActualizado)) };
    } catch (error) {
        logger.error('ERROR in EditarPedido:', error);
        return { error: 'Error al editar el pedido: ' + error.message };
    }
}

// No se implementa EliminarPedido directamente, los pedidos suelen cambiar de estado (ej. CANCELADO)

export {
    guardarPedido,
    obtenerPedidos,
    obtenerPedidosPorUsuarioId, // This function is now deprecated for supplier use, but kept for user-specific orders
    ObtenerPedidoPorId,
    EditarPedido,
<<<<<<< HEAD
    obtenerPedidosPagadosPorUsuarioId, // Export the new function
=======
>>>>>>> 23672fd20f631b662f6c2b26b31a77a6288784c6
};
