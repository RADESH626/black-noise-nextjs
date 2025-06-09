"use server"

import connectDB from '@/utils/DBconection';
import Pago from '@/models/Pago';
import Usuario from '@/models/Usuario'; // Necesario para popular
import Venta from '@/models/Venta';   // Necesario para popular
import { revalidatePath } from 'next/cache';

// Crear un nuevo pago
async function guardarPago(data) {
    console.log('DEBUG: Entering guardarPago with data:', data);
    try {
        await connectDB();
        console.log('DEBUG: Database connected for guardarPago.');
        const nuevoPago = new Pago(data);
        console.log('DEBUG: New Pago instance created:', nuevoPago);
        const pagoGuardado = await nuevoPago.save();
        console.log('DEBUG: Pago saved to DB:', pagoGuardado);
        revalidatePath('/admin/pagos');
        console.log('DEBUG: Revalidated path /admin/pagos.');
        return { success: true, data: JSON.parse(JSON.stringify(pagoGuardado)) };
    } catch (error) {
        console.error('ERROR in guardarPago:', error);
        return { error: 'Error al guardar el pago: ' + error.message };
    }
}

// Obtener todos los pagos
async function obtenerPagos() {
    console.log('DEBUG: Entering obtenerPagos.');
    try {
        await connectDB();
        console.log('DEBUG: Database connected for obtenerPagos.');
        const pagos = await Pago.find({})
            .populate('usuarioId', 'nombreUsuario correo') // Popula algunos campos de Usuario
            .populate('ventaId', '_id') // Popula el ID de Venta
            .lean();
        console.log('DEBUG: Payments retrieved from DB:', pagos.length, 'payments found.');
        return { pagos: JSON.parse(JSON.stringify(pagos)) };
    } catch (error) {
        console.error('ERROR in obtenerPagos:', error);
        return { error: 'Error al obtener los pagos: ' + error.message };
    }
}

// Obtener pago por ID
async function ObtenerPagoPorId(id) {
    console.log('DEBUG: Entering ObtenerPagoPorId with ID:', id);
    try {
        await connectDB();
        console.log('DEBUG: Database connected for ObtenerPagoPorId.');
        const pago = await Pago.findById(id)
            .populate('usuarioId', 'nombreUsuario correo')
            .populate('ventaId', '_id')
            .lean();
        console.log('DEBUG: Payment retrieved from DB:', pago);
        if (!pago) {
            console.log('DEBUG: Payment not found for ID:', id);
            return { error: 'Pago no encontrado' };
        }
        console.log('DEBUG: Exiting ObtenerPagoPorId with payment:', JSON.parse(JSON.stringify(pago)));
        return JSON.parse(JSON.stringify(pago));
    } catch (error) {
        console.error('ERROR in ObtenerPagoPorId:', error);
        return { error: 'Error al obtener el pago: ' + error.message };
    }
}

// Editar pago (principalmente para cambiar estado)
async function EditarPago(id, data) {
    console.log('DEBUG: Entering EditarPago with ID:', id, 'and data:', data);
    try {
        await connectDB();
        console.log('DEBUG: Database connected for EditarPago.');
        // Asegurarse de que solo se actualicen campos permitidos, ej. estadoPago
        const updateData = {
            estadoPago: data.estadoPago,
            // Se podrían añadir otros campos si fuera necesario, como metodoPago o valorPago si se permite editar.
            // Por ahora, solo estadoPago.
        };
        if (data.metodoPago) updateData.metodoPago = data.metodoPago;
        if (data.valorPago) updateData.valorPago = parseFloat(data.valorPago);
        console.log('DEBUG: Update data prepared:', updateData);


        const pagoActualizado = await Pago.findByIdAndUpdate(id, updateData, { new: true }).lean();
        console.log('DEBUG: Payment updated in DB:', pagoActualizado);
        if (!pagoActualizado) {
            console.log('DEBUG: Payment not found for update with ID:', id);
            return { error: 'Pago no encontrado para actualizar' };
        }
        revalidatePath('/admin/pagos');
        revalidatePath(`/admin/pagos/editar/${id}`);
        console.log('DEBUG: Revalidated paths /admin/pagos and /admin/pagos/editar/${id}.');
        return { success: true, data: JSON.parse(JSON.stringify(pagoActualizado)) };
    } catch (error) {
        console.error('ERROR in EditarPago:', error);
        return { error: 'Error al editar el pago: ' + error.message };
    }
}

// Obtener pagos por usuario ID
async function obtenerPagosPorUsuarioId(usuarioId) {
    console.log('DEBUG: Entering obtenerPagosPorUsuarioId with usuarioId:', usuarioId);
    try {
        await connectDB();
        console.log('DEBUG: Database connected for obtenerPagosPorUsuarioId.');
        const pagos = await Pago.find({ usuarioId })
            .populate('usuarioId', 'nombreUsuario correo') // Popula algunos campos de Usuario
            .populate('ventaId', '_id') // Popula el ID de Venta
            .lean();
        console.log('DEBUG: Payments retrieved for user ID:', usuarioId, 'count:', pagos.length);
        return { success: true, pagos: JSON.parse(JSON.stringify(pagos)) };
    } catch (error) {
        console.error('ERROR in obtenerPagosPorUsuarioId:', error);
        return { success: false, message: 'Error al obtener los pagos del usuario: ' + error.message };
    }
}

// No se implementa EliminarPago directamente, los pagos suelen cambiar de estado (ej. ANULADO)

export {
    guardarPago,
    obtenerPagos,
    ObtenerPagoPorId,
    EditarPago,
    obtenerPagosPorUsuarioId
};
