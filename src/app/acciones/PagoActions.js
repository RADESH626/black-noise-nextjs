"use server"

import connectDB from '@/utils/DBconection';
import Pago from '@/models/Pago';
import Usuario from '@/models/Usuario'; // Necesario para popular
import Venta from '@/models/Venta';   // Necesario para popular
import { revalidatePath } from 'next/cache';

// Crear un nuevo pago
async function guardarPago(data) {
    console.log('Iniciando la función guardarPago');
    try {
        await connectDB();
        const nuevoPago = new Pago(data);
        const pagoGuardado = await nuevoPago.save();
        revalidatePath('/admin/pagos');
        return { success: true, data: JSON.parse(JSON.stringify(pagoGuardado)) };
    } catch (error) {
        console.error('Error al guardar el pago:', error);
        return { error: 'Error al guardar el pago: ' + error.message };
    }
}

// Obtener todos los pagos
async function obtenerPagos() {
    console.log('Iniciando la función obtenerPagos');
    try {
        await connectDB();
        const pagos = await Pago.find({})
            .populate('usuarioId', 'nombreUsuario correo') // Popula algunos campos de Usuario
            .populate('ventaId', '_id') // Popula el ID de Venta
            .lean();
        return { pagos: JSON.parse(JSON.stringify(pagos)) };
    } catch (error) {
        console.error('Error al obtener los pagos:', error);
        return { error: 'Error al obtener los pagos: ' + error.message };
    }
}

// Obtener pago por ID
async function ObtenerPagoPorId(id) {
    console.log('Iniciando la función ObtenerPagoPorId');
    try {
        await connectDB();
        const pago = await Pago.findById(id)
            .populate('usuarioId', 'nombreUsuario correo')
            .populate('ventaId', '_id')
            .lean();
        if (!pago) {
            return { error: 'Pago no encontrado' };
        }
        return JSON.parse(JSON.stringify(pago));
    } catch (error) {
        console.error('Error al obtener el pago:', error);
        return { error: 'Error al obtener el pago: ' + error.message };
    }
}

// Editar pago (principalmente para cambiar estado)
async function EditarPago(id, data) {
    console.log('Iniciando la función EditarPago');
    try {
        await connectDB();
        // Asegurarse de que solo se actualicen campos permitidos, ej. estadoPago
        const updateData = {
            estadoPago: data.estadoPago,
            // Se podrían añadir otros campos si fuera necesario, como metodoPago o valorPago si se permite editar.
            // Por ahora, solo estadoPago.
        };
        if (data.metodoPago) updateData.metodoPago = data.metodoPago;
        if (data.valorPago) updateData.valorPago = parseFloat(data.valorPago);


        const pagoActualizado = await Pago.findByIdAndUpdate(id, updateData, { new: true }).lean();
        if (!pagoActualizado) {
            return { error: 'Pago no encontrado para actualizar' };
        }
        revalidatePath('/admin/pagos');
        revalidatePath(`/admin/pagos/editar/${id}`);
        return { success: true, data: JSON.parse(JSON.stringify(pagoActualizado)) };
    } catch (error) {
        console.error('Error al editar el pago:', error);
        return { error: 'Error al editar el pago: ' + error.message };
    }
}

// No se implementa EliminarPago directamente, los pagos suelen cambiar de estado (ej. ANULADO)

export {
    guardarPago,
    obtenerPagos,
    ObtenerPagoPorId,
    EditarPago
};
