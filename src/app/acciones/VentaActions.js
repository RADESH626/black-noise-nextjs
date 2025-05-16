"use server"

import connectDB from '@/utils/DBconection';
import Venta from '@/models/Venta';
import Pago from '@/models/Pago';     // Necesario para popular
import Pedido from '@/models/Pedido'; // Necesario para popular
import { revalidatePath } from 'next/cache';

// Crear una nueva venta
async function guardarVenta(data) {
    try {
        await connectDB();
        // Convertir pagoIds y detallesVenta a arrays si vienen como strings
        if (data.pagoIds && typeof data.pagoIds === 'string') {
            data.pagoIds = data.pagoIds.split(',').map(id => id.trim()).filter(id => id);
        } else if (!data.pagoIds) {
            data.pagoIds = [];
        }
        if (data.detallesVenta && typeof data.detallesVenta === 'string') {
            data.detallesVenta = data.detallesVenta.split(',').map(detalle => detalle.trim()).filter(detalle => detalle);
        } else if (!data.detallesVenta) {
            data.detallesVenta = [];
        }

        const nuevaVenta = new Venta(data);
        const ventaGuardada = await nuevaVenta.save();
        revalidatePath('/admin/ventas');
        return { success: true, data: JSON.parse(JSON.stringify(ventaGuardada)) };
    } catch (error) {
        console.error('Error al guardar la venta:', error);
        return { error: 'Error al guardar la venta: ' + error.message };
    }
}

// Obtener todas las ventas
async function obtenerVentas() {
    try {
        await connectDB();
        const ventas = await Venta.find({})
            .populate('pagoIds', 'valorPago metodoPago estadoPago') 
            .populate({
                path: 'pedidoId',
                select: 'valorPedido estadoPedido proveedorId',
                populate: { path: 'proveedorId', select: 'nombreProveedor' } 
            })
            .lean();
        return { ventas: JSON.parse(JSON.stringify(ventas)) };
    } catch (error) {
        console.error('Error al obtener las ventas:', error);
        return { error: 'Error al obtener las ventas: ' + error.message };
    }
}

// Obtener venta por ID
async function ObtenerVentaPorId(id) {
    try {
        await connectDB();
        const venta = await Venta.findById(id)
            .populate('pagoIds', 'valorPago metodoPago estadoPago createdAt')
            .populate({
                path: 'pedidoId',
                select: 'valorPedido estadoPedido proveedorId fechaEstimadaEntrega desingIds',
                populate: [
                    { path: 'proveedorId', select: 'nombreProveedor' },
                    { path: 'desingIds', select: 'nombreDesing' }
                ]
            })
            .lean();
        if (!venta) {
            return { error: 'Venta no encontrada' };
        }
        return JSON.parse(JSON.stringify(venta));
    } catch (error) {
        console.error('Error al obtener la venta:', error);
        return { error: 'Error al obtener la venta: ' + error.message };
    }
}

// Editar venta (principalmente para cambiar estado, detalles, o asociar/desasociar pagos)
async function EditarVenta(id, data) {
    try {
        await connectDB();
        
        const updateData = { ...data };
        if (updateData.pagoIds && typeof updateData.pagoIds === 'string') {
            updateData.pagoIds = updateData.pagoIds.split(',').map(id => id.trim()).filter(id => id);
        } else if (updateData.hasOwnProperty('pagoIds') && !updateData.pagoIds) {
            updateData.pagoIds = [];
        }

        if (updateData.detallesVenta && typeof updateData.detallesVenta === 'string') {
            updateData.detallesVenta = updateData.detallesVenta.split(',').map(detalle => detalle.trim()).filter(detalle => detalle);
        } else if (updateData.hasOwnProperty('detallesVenta') && !updateData.detallesVenta) {
            updateData.detallesVenta = [];
        }
        
        // Campos como pedidoId, comisionAplicacion, valorVenta no deberían cambiar fácilmente desde una edición simple.
        // delete updateData.pedidoId;
        // delete updateData.comisionAplicacion;
        // delete updateData.valorVenta;

        const ventaActualizada = await Venta.findByIdAndUpdate(id, updateData, { new: true }).lean();
        if (!ventaActualizada) {
            return { error: 'Venta no encontrada para actualizar' };
        }
        revalidatePath('/admin/ventas');
        revalidatePath(`/admin/ventas/editar/${id}`);
        return { success: true, data: JSON.parse(JSON.stringify(ventaActualizada)) };
    } catch (error) {
        console.error('Error al editar la venta:', error);
        return { error: 'Error al editar la venta: ' + error.message };
    }
}

// No se implementa EliminarVenta directamente.

export {
    guardarVenta,
    obtenerVentas,
    ObtenerVentaPorId,
    EditarVenta
};
