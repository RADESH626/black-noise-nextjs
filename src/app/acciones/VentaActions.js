"use server"

import connectDB from '@/utils/DBconection';
import Venta from '@/models/Venta';
import Pago from '@/models/Pago';     // Necesario para popular
import Pedido from '@/models/Pedido'; // Necesario para popular
import { revalidatePath } from 'next/cache';

// Crear una nueva venta
async function guardarVenta(data) {
    console.log('DEBUG: Entering guardarVenta with data:', data);
    try {
        await connectDB();
        console.log('DEBUG: Database connected for guardarVenta.');
        // Convertir pagoIds y detallesVenta a arrays si vienen como strings
        if (data.pagoIds && typeof data.pagoIds === 'string') {
            data.pagoIds = data.pagoIds.split(',').map(id => id.trim()).filter(id => id);
            console.log('DEBUG: Converted pagoIds to array:', data.pagoIds);
        } else if (!data.pagoIds) {
            data.pagoIds = [];
            console.log('DEBUG: pagoIds was empty, initialized as empty array.');
        }
        if (data.detallesVenta && typeof data.detallesVenta === 'string') {
            data.detallesVenta = data.detallesVenta.split(',').map(detalle => detalle.trim()).filter(detalle => detalle);
            console.log('DEBUG: Converted detallesVenta to array:', data.detallesVenta);
        } else if (!data.detallesVenta) {
            data.detallesVenta = [];
            console.log('DEBUG: detallesVenta was empty, initialized as empty array.');
        }

        const nuevaVenta = new Venta(data);
        console.log('DEBUG: New Venta instance created:', nuevaVenta);
        const ventaGuardada = await nuevaVenta.save();
        console.log('DEBUG: Venta saved to DB:', ventaGuardada);
        revalidatePath('/admin/ventas');
        console.log('DEBUG: Revalidated path /admin/ventas.');
        return { success: true, data: JSON.parse(JSON.stringify(ventaGuardada)) };
    } catch (error) {
        console.error('ERROR in guardarVenta:', error);
        return { error: 'Error al guardar la venta: ' + error.message };
    }
}

// Obtener todas las ventas
async function obtenerVentas() {
    console.log('DEBUG: Entering obtenerVentas.');
    try {
        await connectDB();
        console.log('DEBUG: Database connected for obtenerVentas.');
        const ventas = await Venta.find({})
            .populate('pagoIds', 'valorPago metodoPago estadoPago') 
            .populate({
                path: 'pedidoId',
                select: 'valorPedido estadoPedido proveedorId',
                populate: { path: 'proveedorId', select: 'nombreProveedor' } 
            })
            .lean();
        console.log('DEBUG: Sales retrieved from DB:', ventas.length, 'sales found.');
        return { ventas: JSON.parse(JSON.stringify(ventas)) };
    } catch (error) {
        console.error('ERROR in obtenerVentas:', error);
        return { error: 'Error al obtener las ventas: ' + error.message };
    }
}

// Obtener venta por ID
async function ObtenerVentaPorId(id) {
    console.log('DEBUG: Entering ObtenerVentaPorId with ID:', id);
    try {
        await connectDB();
        console.log('DEBUG: Database connected for ObtenerVentaPorId.');
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
        console.log('DEBUG: Sale retrieved from DB:', venta);
        if (!venta) {
            console.log('DEBUG: Sale not found for ID:', id);
            return { error: 'Venta no encontrada' };
        }
        console.log('DEBUG: Exiting ObtenerVentaPorId with sale:', JSON.parse(JSON.stringify(venta)));
        return JSON.parse(JSON.stringify(venta));
    } catch (error) {
        console.error('ERROR in ObtenerVentaPorId:', error);
        return { error: 'Error al obtener la venta: ' + error.message };
    }
}

// Editar venta (principalmente para cambiar estado, detalles, o asociar/desasociar pagos)
async function EditarVenta(id, data) {
    console.log('DEBUG: Entering EditarVenta with ID:', id, 'and data:', data);
    try {
        await connectDB();
        console.log('DEBUG: Database connected for EditarVenta.');
        
        const updateData = { ...data };
        if (updateData.pagoIds && typeof updateData.pagoIds === 'string') {
            updateData.pagoIds = updateData.pagoIds.split(',').map(id => id.trim()).filter(id => id);
            console.log('DEBUG: Converted updateData.pagoIds to array:', updateData.pagoIds);
        } else if (updateData.hasOwnProperty('pagoIds') && !updateData.pagoIds) {
            updateData.pagoIds = [];
            console.log('DEBUG: updateData.pagoIds was empty, initialized as empty array.');
        }

        if (updateData.detallesVenta && typeof updateData.detallesVenta === 'string') {
            updateData.detallesVenta = updateData.detallesVenta.split(',').map(detalle => detalle.trim()).filter(detalle => detalle);
            console.log('DEBUG: Converted updateData.detallesVenta to array:', updateData.detallesVenta);
        } else if (updateData.hasOwnProperty('detallesVenta') && !updateData.detallesVenta) {
            updateData.detallesVenta = [];
            console.log('DEBUG: updateData.detallesVenta was empty, initialized as empty array.');
        }
        
        // Campos como pedidoId, comisionAplicacion, valorVenta no deberían cambiar fácilmente desde una edición simple.
        // delete updateData.pedidoId;
        // delete updateData.comisionAplicacion;
        // delete updateData.valorVenta;
        console.log('DEBUG: Update data prepared:', updateData);

        const ventaActualizada = await Venta.findByIdAndUpdate(id, updateData, { new: true }).lean();
        console.log('DEBUG: Sale updated in DB:', ventaActualizada);
        if (!ventaActualizada) {
            console.log('DEBUG: Sale not found for update with ID:', id);
            return { error: 'Venta no encontrada para actualizar' };
        }
        revalidatePath('/admin/ventas');
        revalidatePath(`/admin/ventas/editar/${id}`);
        console.log('DEBUG: Revalidated paths /admin/ventas and /admin/ventas/editar/${id}.');
        return { success: true, data: JSON.parse(JSON.stringify(ventaActualizada)) };
    } catch (error) {
        console.error('ERROR in EditarVenta:', error);
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
