"use server"

import connectDB from '@/utils/DBconection';
import Pedido from '@/models/Pedido';
import Design from '@/models/Design';     // Necesario para popular
import Proveedor from '@/models/Proveedor'; // Necesario para popular
import { revalidatePath } from 'next/cache';

// Crear un nuevo pedido
async function guardarPedido(data) {
    console.log('DEBUG: Entering guardarPedido with data:', data);
    try {
        await connectDB();
        console.log('DEBUG: Database connected for guardarPedido.');
        // Convertir desingIds y detallesPedido a arrays si vienen como strings separados por comas
        if (data.desingIds && typeof data.desingIds === 'string') {
            data.desingIds = data.desingIds.split(',').map(id => id.trim()).filter(id => id);
            console.log('DEBUG: Converted desingIds to array:', data.desingIds);
        }
        if (data.detallesPedido && typeof data.detallesPedido === 'string') {
            data.detallesPedido = data.detallesPedido.split(',').map(detalle => detalle.trim()).filter(detalle => detalle);
            console.log('DEBUG: Converted detallesPedido to array:', data.detallesPedido);
        }

        const nuevoPedido = new Pedido(data);
        console.log('DEBUG: New Pedido instance created:', nuevoPedido);
        const pedidoGuardado = await nuevoPedido.save();
        console.log('DEBUG: Pedido saved to DB:', pedidoGuardado);
        revalidatePath('/admin/pedidos');
        console.log('DEBUG: Revalidated path /admin/pedidos.');
        return { success: true, data: JSON.parse(JSON.stringify(pedidoGuardado)) };
    } catch (error) {
        console.error('ERROR in guardarPedido:', error);
        return { error: 'Error al guardar el pedido: ' + error.message };
    }
}

// Obtener todos los pedidos
async function obtenerPedidos() {
    console.log('DEBUG: Entering obtenerPedidos.');
    try {
        await connectDB();
        console.log('DEBUG: Database connected for obtenerPedidos.');
        const pedidos = await Pedido.find({})
            .populate('desingIds', 'nombreDesing') // Popula nombre de los diseños
            .populate('proveedorId', 'nombreProveedor contactoPrincipal') // Popula algunos campos de Proveedor
            .lean();
        console.log('DEBUG: Orders retrieved from DB:', pedidos.length, 'orders found.');
        return { pedidos: JSON.parse(JSON.stringify(pedidos)) };
    } catch (error) {
        console.error('ERROR in obtenerPedidos:', error);
        return { error: 'Error al obtener los pedidos: ' + error.message };
    }
}

// Obtener pedido por ID
async function ObtenerPedidoPorId(id) {
    console.log('DEBUG: Entering ObtenerPedidoPorId with ID:', id);
    try {
        await connectDB();
        console.log('DEBUG: Database connected for ObtenerPedidoPorId.');
        const pedido = await Pedido.findById(id)
            .populate('desingIds', 'nombreDesing imagenDesing')
            .populate('proveedorId', 'nombreProveedor contactoPrincipal')
            .lean();
        console.log('DEBUG: Order retrieved from DB:', pedido);
        if (!pedido) {
            console.log('DEBUG: Order not found for ID:', id);
            return { error: 'Pedido no encontrado' };
        }
        console.log('DEBUG: Exiting ObtenerPedidoPorId with order:', JSON.parse(JSON.stringify(pedido)));
        return JSON.parse(JSON.stringify(pedido));
    } catch (error) {
        console.error('ERROR in ObtenerPedidoPorId:', error);
        return { error: 'Error al obtener el pedido: ' + error.message };
    }
}

// Editar pedido (principalmente para cambiar estado, fecha estimada, detalles)
async function EditarPedido(id, data) {
    console.log('DEBUG: Entering EditarPedido with ID:', id, 'and data:', data);
    try {
        await connectDB();
        console.log('DEBUG: Database connected for EditarPedido.');
        
        const updateData = { ...data };
        if (updateData.desingIds && typeof updateData.desingIds === 'string') {
            updateData.desingIds = updateData.desingIds.split(',').map(id => id.trim()).filter(id => id);
            console.log('DEBUG: Converted updateData.desingIds to array:', updateData.desingIds);
        }
        if (updateData.detallesPedido && typeof updateData.detallesPedido === 'string') {
            updateData.detallesPedido = updateData.detallesPedido.split(',').map(detalle => detalle.trim()).filter(detalle => detalle);
            console.log('DEBUG: Converted updateData.detallesPedido to array:', updateData.detallesPedido);
        }
        // No permitir cambiar proveedorId o valorPedido fácilmente desde aquí, podría requerir lógica de negocio más compleja.
        // delete updateData.proveedorId; 
        // delete updateData.valorPedido;
        console.log('DEBUG: Update data prepared:', updateData);

        const pedidoActualizado = await Pedido.findByIdAndUpdate(id, updateData, { new: true }).lean();
        console.log('DEBUG: Order updated in DB:', pedidoActualizado);
        if (!pedidoActualizado) {
            console.log('DEBUG: Order not found for update with ID:', id);
            return { error: 'Pedido no encontrado para actualizar' };
        }
        revalidatePath('/admin/pedidos');
        revalidatePath(`/admin/pedidos/editar/${id}`);
        console.log('DEBUG: Revalidated paths /admin/pedidos and /admin/pedidos/editar/${id}.');
        return { success: true, data: JSON.parse(JSON.stringify(pedidoActualizado)) };
    } catch (error) {
        console.error('ERROR in EditarPedido:', error);
        return { error: 'Error al editar el pedido: ' + error.message };
    }
}

// No se implementa EliminarPedido directamente, los pedidos suelen cambiar de estado (ej. CANCELADO)

export {
    guardarPedido,
    obtenerPedidos,
    ObtenerPedidoPorId,
    EditarPedido
};
