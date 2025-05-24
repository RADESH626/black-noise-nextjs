"use server"

import connectDB from '@/utils/DBconection';
import Pedido from '@/models/Pedido';
import Design from '@/models/Design';     // Necesario para popular
import Proveedor from '@/models/Proveedor'; // Necesario para popular
import { revalidatePath } from 'next/cache';

// Crear un nuevo pedido
async function guardarPedido(data) {
    console.log('Iniciando la función guardarPedido');
    try {
        await connectDB();
        // Convertir desingIds y detallesPedido a arrays si vienen como strings separados por comas
        if (data.desingIds && typeof data.desingIds === 'string') {
            data.desingIds = data.desingIds.split(',').map(id => id.trim()).filter(id => id);
        }
        if (data.detallesPedido && typeof data.detallesPedido === 'string') {
            data.detallesPedido = data.detallesPedido.split(',').map(detalle => detalle.trim()).filter(detalle => detalle);
        }

        const nuevoPedido = new Pedido(data);
        const pedidoGuardado = await nuevoPedido.save();
        revalidatePath('/admin/pedidos');
        return { success: true, data: JSON.parse(JSON.stringify(pedidoGuardado)) };
    } catch (error) {
        console.error('Error al guardar el pedido:', error);
        return { error: 'Error al guardar el pedido: ' + error.message };
    }
}

// Obtener todos los pedidos
async function obtenerPedidos() {
    console.log('Iniciando la función obtenerPedidos');
    try {
        await connectDB();
        const pedidos = await Pedido.find({})
            .populate('desingIds', 'nombreDesing') // Popula nombre de los diseños
            .populate('proveedorId', 'nombreProveedor contactoPrincipal') // Popula algunos campos de Proveedor
            .lean();
        return { pedidos: JSON.parse(JSON.stringify(pedidos)) };
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
        return { error: 'Error al obtener los pedidos: ' + error.message };
    }
}

// Obtener pedido por ID
async function ObtenerPedidoPorId(id) {
    console.log('Iniciando la función ObtenerPedidoPorId');
    try {
        await connectDB();
        const pedido = await Pedido.findById(id)
            .populate('desingIds', 'nombreDesing imagenDesing')
            .populate('proveedorId', 'nombreProveedor contactoPrincipal')
            .lean();
        if (!pedido) {
            return { error: 'Pedido no encontrado' };
        }
        return JSON.parse(JSON.stringify(pedido));
    } catch (error) {
        console.error('Error al obtener el pedido:', error);
        return { error: 'Error al obtener el pedido: ' + error.message };
    }
}

// Editar pedido (principalmente para cambiar estado, fecha estimada, detalles)
async function EditarPedido(id, data) {
    console.log('Iniciando la función EditarPedido');
    try {
        await connectDB();
        
        const updateData = { ...data };
        if (updateData.desingIds && typeof updateData.desingIds === 'string') {
            updateData.desingIds = updateData.desingIds.split(',').map(id => id.trim()).filter(id => id);
        }
        if (updateData.detallesPedido && typeof updateData.detallesPedido === 'string') {
            updateData.detallesPedido = updateData.detallesPedido.split(',').map(detalle => detalle.trim()).filter(detalle => detalle);
        }
        // No permitir cambiar proveedorId o valorPedido fácilmente desde aquí, podría requerir lógica de negocio más compleja.
        // delete updateData.proveedorId; 
        // delete updateData.valorPedido;

        const pedidoActualizado = await Pedido.findByIdAndUpdate(id, updateData, { new: true }).lean();
        if (!pedidoActualizado) {
            return { error: 'Pedido no encontrado para actualizar' };
        }
        revalidatePath('/admin/pedidos');
        revalidatePath(`/admin/pedidos/editar/${id}`);
        return { success: true, data: JSON.parse(JSON.stringify(pedidoActualizado)) };
    } catch (error) {
        console.error('Error al editar el pedido:', error);
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
