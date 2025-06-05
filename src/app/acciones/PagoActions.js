"use server"

import connectDB from '@/utils/DBconection';
import Pago from '@/models/Pago';
import Usuario from '@/models/Usuario'; // Necesario para popular
import Venta from '@/models/Venta';   // Necesario para popular
import { revalidatePath } from 'next/cache';
<<<<<<< HEAD
=======
import { mockPagos, getMockPagoById } from '@/data/mock/pagos'; // Import mock data for pagos
import { mockUsuarios } from '@/data/mock/usuarios'; // Import mock data for users to simulate populate
import { mockVentas } from '@/data/mock/ventas';     // Import mock data for ventas to simulate populate

const isMockModeEnabled = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

// Helper para generar IDs únicos (simulado)
const generateUniqueId = (prefix = 'mock') => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d

// Crear un nuevo pago
async function guardarPago(data) {
    console.log('DEBUG: Entering guardarPago with data:', data);
<<<<<<< HEAD
=======
    if (isMockModeEnabled) {
        console.log('🎭 Mock Mode: Simulando guardarPago.');
        const newPago = {
            ...data,
            id: generateUniqueId('payment'), // Use 'id' as per mock data structure
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        revalidatePath('/admin/pagos');
        return { success: true, message: "Pago creado exitosamente (simulado)", data: newPago };
    }
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d
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

<<<<<<< HEAD
// Obtener todos los pagos
async function obtenerPagos() {
    console.log('DEBUG: Entering obtenerPagos.');
=======
// Helper para simular populate
const simulatePopulate = (item, field, mockDataArray, selectFields) => {
    if (!item || !item[field]) return item;
    const populatedItem = mockDataArray.find(mock => mock._id === item[field] || mock.id === item[field]);
    if (populatedItem) {
        const selected = {};
        if (selectFields) {
            selectFields.split(' ').forEach(f => {
                if (populatedItem[f]) selected[f] = populatedItem[f];
            });
        } else {
            // If no specific fields, return a simplified object with ID and a representative field
            selected._id = populatedItem._id || populatedItem.id;
            if (populatedItem.nombreUsuario) selected.nombreUsuario = populatedItem.nombreUsuario;
            if (populatedItem.correo) selected.correo = populatedItem.correo;
        }
        return { ...item, [field]: selected };
    }
    return item;
};

// Obtener todos los pagos
async function obtenerPagos() {
    console.log('DEBUG: Entering obtenerPagos.');
    if (isMockModeEnabled) {
        console.log('🎭 Mock Mode: Obteniendo todos los pagos mock.');
        let pagosSimulados = mockPagos.map(pago => ({ ...pago })); // Deep copy to avoid modifying original mock data

        // Simulate populate for usuarioId
        pagosSimulados = pagosSimulados.map(pago => simulatePopulate(pago, 'usuarioId', mockUsuarios, 'nombreUsuario correo'));
        // Simulate populate for ventaId
        pagosSimulados = pagosSimulados.map(pago => simulatePopulate(pago, 'ventaId', mockVentas, '_id'));

        return { pagos: pagosSimulados };
    }
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d
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
<<<<<<< HEAD
=======
    if (isMockModeEnabled) {
        console.log('🎭 Mock Mode: Obteniendo pago mock por ID:', id);
        let pago = getMockPagoById(id);
        if (pago) {
            pago = simulatePopulate(pago, 'usuarioId', mockUsuarios, 'nombreUsuario correo');
            pago = simulatePopulate(pago, 'ventaId', mockVentas, '_id');
            return pago;
        }
        return { error: 'Pago no encontrado (simulado)' };
    }
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d
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
<<<<<<< HEAD
=======
    if (isMockModeEnabled) {
        console.log('🎭 Mock Mode: Simulando edición de pago ID:', id);
        const existingPago = getMockPagoById(id);
        if (existingPago) {
            const updatedPago = {
                ...existingPago,
                ...data,
                updatedAt: new Date().toISOString()
            };
            revalidatePath('/admin/pagos');
            revalidatePath(`/admin/pagos/editar/${id}`);
            return { success: true, message: "Pago actualizado exitosamente (simulado)", data: updatedPago };
        } else {
            return { error: 'Pago no encontrado para actualizar (simulado)' };
        }
    }
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d
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

// No se implementa EliminarPago directamente, los pagos suelen cambiar de estado (ej. ANULADO)

export {
    guardarPago,
    obtenerPagos,
    ObtenerPagoPorId,
    EditarPago
};
