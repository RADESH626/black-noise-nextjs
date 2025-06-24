"use server"

import connectDB from '@/utils/DBconection';
import getVentaModel from '@/models/Venta';
import Pago from '@/models/Pago';     // Necesario para popular
import Pedido from '@/models/Pedido'; // Necesario para popular
import { revalidatePath } from 'next/cache';
import logger from '@/utils/logger';
import Papa from 'papaparse'; // Import papaparse

// Function to export sales to CSV
async function exportarVentasCSV(filters = {}) {
    logger.debug('Entering exportarVentasCSV with filters:', filters);
    try {
        await connectDB();
        logger.debug('Database connected for exportarVentasCSV.');
        const Venta = await getVentaModel();
        let query = {};

        if (filters.estadoVenta) {
            query.estadoVenta = filters.estadoVenta;
        }
        if (filters.pedidoAsociadoId) {
            query.pedidoId = filters.pedidoAsociadoId;
        }
        if (filters.valorVentaMin) {
            query.valorVenta = { ...query.valorVenta, $gte: parseFloat(filters.valorVentaMin) };
        }
        if (filters.valorVentaMax) {
            query.valorVenta = { ...query.valorVenta, $lte: parseFloat(filters.valorVentaMax) };
        }
        if (filters.fechaVentaStart) {
            query.fechaVenta = { ...query.fechaVenta, $gte: new Date(filters.fechaVentaStart) };
        }
        if (filters.fechaVentaEnd) {
            query.fechaVenta = { ...query.fechaVenta, $lte: new Date(filters.fechaVentaEnd) };
        }

        const ventas = await Venta.find(query)
            .populate('pagoIds', 'valorPago metodoPago estadoPago')
            .populate({
                path: 'pedidoId',
                select: 'valorPedido estadoPedido proveedorId',
                populate: { path: 'proveedorId', select: 'nombreEmpresa' }
            })
            .lean();

        const csvData = ventas.map(venta => ({
            'ID Venta': venta._id.toString(),
            'Valor Venta': venta.valorVenta,
            'Estado Venta': venta.estadoVenta,
            'Fecha Venta': venta.createdAt ? new Date(venta.createdAt).toLocaleDateString() : 'N/A',
            'ID Pedido Asociado': venta.pedidoId ? venta.pedidoId._id.toString() : 'N/A',
            'Valor Pedido': venta.pedidoId ? venta.pedidoId.valorPedido : 'N/A',
            'Estado Pedido': venta.pedidoId ? venta.pedidoId.estadoPedido : 'N/A',
            'Proveedor Pedido': venta.pedidoId && venta.pedidoId.proveedorId ? venta.pedidoId.proveedorId.nombreEmpresa : 'N/A',
            'Pagos Asociados IDs': venta.pagoIds && venta.pagoIds.length > 0 ? venta.pagoIds.map(p => p._id.toString()).join(', ') : 'N/A',
            'Pagos Asociados Valores': venta.pagoIds && venta.pagoIds.length > 0 ? venta.pagoIds.map(p => p.valorPago).join(', ') : 'N/A',
            'Pagos Asociados Métodos': venta.pagoIds && venta.pagoIds.length > 0 ? venta.pagoIds.map(p => p.metodoPago).join(', ') : 'N/A',
            'Pagos Asociados Estados': venta.pagoIds && venta.pagoIds.length > 0 ? venta.pagoIds.map(p => p.estadoPago).join(', ') : 'N/A',
        }));

        const csv = Papa.unparse(csvData);
        return { success: true, csv, message: 'CSV de ventas generado exitosamente.' };
    } catch (error) {
        logger.error('ERROR in exportarVentasCSV:', error);
        return { success: false, error: 'Error al generar el CSV de ventas: ' + error.message };
    }
}

// Crear una nueva venta
async function guardarVenta(data) {
    logger.debug('Entering guardarVenta with data:', data);
    try {
        await connectDB();
        logger.debug('Database connected for guardarVenta.');
        // Convertir pagoIds y detallesVenta a arrays si vienen como strings
        if (data.pagoIds && typeof data.pagoIds === 'string') {
            data.pagoIds = data.pagoIds.split(',').map(id => id.trim()).filter(id => id);
            logger.debug('Converted pagoIds to array:', data.pagoIds);
        } else if (!data.pagoIds) {
            data.pagoIds = [];
            logger.debug('pagoIds was empty, initialized as empty array.');
        }
        if (data.detallesVenta && typeof data.detallesVenta === 'string') {
            data.detallesVenta = data.detallesVenta.split(',').map(detalle => detalle.trim()).filter(detalle => detalle);
            logger.debug('Converted detallesVenta to array:', data.detallesVenta);
        } else if (!data.detallesVenta) {
            data.detallesVenta = [];
            logger.debug('detallesVenta was empty, initialized as empty array.');
        }

        const Venta = await getVentaModel();
        const nuevaVenta = new Venta(data);
        logger.debug('New Venta instance created:', nuevaVenta);
        const ventaGuardada = await nuevaVenta.save();
        logger.debug('Venta saved to DB:', ventaGuardada);
        revalidatePath('/admin/ventas');
        logger.debug('Revalidated path /admin/ventas.');
        return { success: true, data: JSON.parse(JSON.stringify(ventaGuardada)) };
    } catch (error) {
        logger.error('ERROR in guardarVenta:', error);
        return { error: 'Error al guardar la venta: ' + error.message };
    }
}

// Obtener todas las ventas
async function obtenerVentas(filters = {}) {
    logger.debug('Entering obtenerVentas with filters:', filters);
    try {
        await connectDB();
        logger.debug('Database connected for obtenerVentas.');
        const Venta = await getVentaModel();
        let query = {};

        logger.debug('Initial filters received:', filters);

        // Apply filters
        if (filters.estadoVenta) {
            query.estadoVenta = filters.estadoVenta;
        }
        if (filters.pedidoAsociadoId) {
            query.pedidoId = filters.pedidoAsociadoId;
        }
        if (filters.valorVentaMin) {
            query.valorVenta = { ...query.valorVenta, $gte: parseFloat(filters.valorVentaMin) };
        }
        if (filters.valorVentaMax) {
            query.valorVenta = { ...query.valorVenta, $lte: parseFloat(filters.valorVentaMax) };
        }
        if (filters.fechaVentaStart) {
            query.fechaVenta = { ...query.fechaVenta, $gte: new Date(filters.fechaVentaStart) };
        }
        if (filters.fechaVentaEnd) {
            query.fechaVenta = { ...query.fechaVenta, $lte: new Date(filters.fechaVentaEnd) };
        }

        logger.debug('MongoDB query being executed:', JSON.stringify(query));

        const ventas = await Venta.find(query)
            .populate('pagoIds', 'valorPago metodoPago estadoPago') 
            .populate({
                path: 'pedidoId',
                select: 'valorPedido estadoPedido proveedorId',
                populate: { path: 'proveedorId', select: 'nombreProveedor' } 
            })
            .lean();
        logger.debug('Sales retrieved from DB:', ventas.length, 'sales found.');
        logger.debug('First 5 sales (if any):', ventas.slice(0, 5).map(v => ({ _id: v._id, valorVenta: v.valorVenta, estadoVenta: v.estadoVenta, pedidoId: v.pedidoId?._id })));
        return { ventas: JSON.parse(JSON.stringify(ventas)) };
    } catch (error) {
        logger.error('ERROR in obtenerVentas:', error);
        return { error: 'Error al obtener las ventas: ' + error.message };
    }
}

// Obtener venta por ID
async function ObtenerVentaPorId(id) {
    logger.debug('Entering ObtenerVentaPorId with ID:', id);
    try {
        await connectDB();
        logger.debug('Database connected for ObtenerVentaPorId.');
        const Venta = await getVentaModel();
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
        logger.debug('Sale retrieved from DB:', venta);
        if (!venta) {
            logger.debug('Sale not found for ID:', id);
            return { error: 'Venta no encontrada' };
        }
        logger.debug('Exiting ObtenerVentaPorId with sale:', JSON.parse(JSON.stringify(venta)));
        return JSON.parse(JSON.stringify(venta));
    } catch (error) {
        logger.error('ERROR in ObtenerVentaPorId:', error);
        return { error: 'Error al obtener la venta: ' + error.message };
    }
}

// Editar venta (principalmente para cambiar estado, detalles, o asociar/desasociar pagos)
async function EditarVenta(id, data) {
    logger.debug('Entering EditarVenta with ID:', id, 'and data:', data);
    try {
        await connectDB();
        logger.debug('Database connected for EditarVenta.');
        
        const updateData = { ...data };
        if (updateData.pagoIds && typeof updateData.pagoIds === 'string') {
            updateData.pagoIds = updateData.pagoIds.split(',').map(id => id.trim()).filter(id => id);
            logger.debug('Converted updateData.pagoIds to array:', updateData.pagoIds);
        } else if (updateData.hasOwnProperty('pagoIds') && !updateData.pagoIds) {
            updateData.pagoIds = [];
            logger.debug('updateData.pagoIds was empty, initialized as empty array.');
        }

        if (updateData.detallesVenta && typeof updateData.detallesVenta === 'string') {
            updateData.detallesVenta = updateData.detallesVenta.split(',').map(detalle => detalle.trim()).filter(detalle => detalle);
            logger.debug('Converted updateData.detallesVenta to array:', updateData.detallesVenta);
        } else if (updateData.hasOwnProperty('detallesVenta') && !updateData.detallesVenta) {
            updateData.detallesVenta = [];
            logger.debug('updateData.detallesVenta was empty, initialized as empty array.');
        }
        
        // Campos como pedidoId, comisionAplicacion, valorVenta no deberían cambiar fácilmente desde una edición simple.
        // delete updateData.pedidoId;
        // delete updateData.comisionAplicacion;
        // delete updateData.valorVenta;
        logger.debug('Update data prepared:', updateData);
        const Venta = await getVentaModel();
        const ventaActualizada = await Venta.findByIdAndUpdate(id, updateData, { new: true }).lean();
        logger.debug('Sale updated in DB:', ventaActualizada);
        if (!ventaActualizada) {
            logger.debug('Sale not found for update with ID:', id);
            return { error: 'Venta no encontrada para actualizar' };
        }
        revalidatePath('/admin/ventas');
        revalidatePath(`/admin/ventas/editar/${id}`);
        logger.debug('Revalidated paths /admin/ventas and /admin/ventas/editar/${id}.');
        return { success: true, data: JSON.parse(JSON.stringify(ventaActualizada)) };
    } catch (error) {
        logger.error('ERROR in EditarVenta:', error);
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
