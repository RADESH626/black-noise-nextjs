"use server"

import connectDB from '@/utils/DBconection';
import Proveedor from '@/models/Proveedor';
import Usuario from '@/models/Usuario'; // Necesario para popular
import { revalidatePath } from 'next/cache';
import { Disponibilidad } from '@/models/enums/proveedor'; // Para cambiar disponibilidad

// Crear un nuevo proveedor
async function guardarProveedor(data) {
    try {
        await connectDB();
        // Convertir metodosPagoAceptados a array si viene como string
        if (data.metodosPagoAceptados && typeof data.metodosPagoAceptados === 'string') {
            data.metodosPagoAceptados = data.metodosPagoAceptados.split(',').map(metodo => metodo.trim()).filter(metodo => metodo);
        } else if (!data.metodosPagoAceptados) {
            data.metodosPagoAceptados = []; // Asegurar que sea un array
        }

        const nuevoProveedor = new Proveedor(data);
        const proveedorGuardado = await nuevoProveedor.save();
        revalidatePath('/admin/proveedores');
        return { success: true, data: JSON.parse(JSON.stringify(proveedorGuardado)) };
    } catch (error) {
        console.error('Error al guardar el proveedor:', error);
        if (error.code === 11000) { // Error de duplicado (ej. NIT)
            return { error: 'Error al guardar el proveedor: Ya existe un proveedor con ese NIT.' };
        }
        return { error: 'Error al guardar el proveedor: ' + error.message };
    }
}

// Obtener todos los proveedores
async function obtenerProveedores() {
    try {
        await connectDB();
        const proveedores = await Proveedor.find({})
            .populate('usuarioId', 'nombreUsuario correo') // Popula algunos campos de Usuario
            .lean();
        return { proveedores: JSON.parse(JSON.stringify(proveedores)) };
    } catch (error) {
        console.error('Error al obtener los proveedores:', error);
        return { error: 'Error al obtener los proveedores: ' + error.message };
    }
}

// Obtener todos los proveedores habilitados (disponibilidad = DISPONIBLE)
async function obtenerProveedoresHabilitados() {
    try {
        await connectDB();
        const proveedores = await Proveedor.find({ disponibilidad: Disponibilidad.DISPONIBLE })
            .populate('usuarioId', 'nombreUsuario correo')
            .lean();
        return { proveedores: JSON.parse(JSON.stringify(proveedores)) };
    } catch (error) {
        console.error('Error al obtener proveedores habilitados:', error);
        return { error: 'Error al obtener proveedores habilitados: ' + error.message };
    }
}


// Obtener proveedor por ID
async function ObtenerProveedorPorId(id) {
    try {
        await connectDB();
        const proveedor = await Proveedor.findById(id)
            .populate('usuarioId', 'nombreUsuario correo')
            .lean();
        if (!proveedor) {
            return { error: 'Proveedor no encontrado' };
        }
        return JSON.parse(JSON.stringify(proveedor));
    } catch (error) {
        console.error('Error al obtener el proveedor:', error);
        return { error: 'Error al obtener el proveedor: ' + error.message };
    }
}

// Editar proveedor
async function EditarProveedor(id, data) {
    try {
        await connectDB();
        
        const updateData = { ...data };
        if (updateData.metodosPagoAceptados && typeof updateData.metodosPagoAceptados === 'string') {
            updateData.metodosPagoAceptados = updateData.metodosPagoAceptados.split(',').map(metodo => metodo.trim()).filter(metodo => metodo);
        } else if (updateData.hasOwnProperty('metodosPagoAceptados') && !updateData.metodosPagoAceptados) {
             updateData.metodosPagoAceptados = [];
        }


        // NIT y usuarioId no deberían ser editables fácilmente.
        // delete updateData.nit;
        // delete updateData.usuarioId;

        const proveedorActualizado = await Proveedor.findByIdAndUpdate(id, updateData, { new: true }).lean();
        if (!proveedorActualizado) {
            return { error: 'Proveedor no encontrado para actualizar' };
        }
        revalidatePath('/admin/proveedores');
        revalidatePath(`/admin/proveedores/editar/${id}`);
        return { success: true, data: JSON.parse(JSON.stringify(proveedorActualizado)) };
    } catch (error) {
        console.error('Error al editar el proveedor:', error);
         if (error.code === 11000) { 
            return { error: 'Error al editar el proveedor: Ya existe un proveedor con ese NIT.' };
        }
        return { error: 'Error al editar el proveedor: ' + error.message };
    }
}

// Cambiar disponibilidad de un proveedor (Habilitar/Deshabilitar)
async function CambiarDisponibilidadProveedor(id, nuevaDisponibilidad) {
    try {
        await connectDB();
        if (!Object.values(Disponibilidad).includes(nuevaDisponibilidad)) {
            return { error: 'Estado de disponibilidad no válido.' };
        }
        const proveedor = await Proveedor.findByIdAndUpdate(id, { disponibilidad: nuevaDisponibilidad }, { new: true }).lean();
        if (!proveedor) {
            return { error: 'Proveedor no encontrado.' };
        }
        revalidatePath('/admin/proveedores');
        return { success: true, message: `Proveedor ${nuevaDisponibilidad === Disponibilidad.DISPONIBLE ? 'habilitado' : 'deshabilitado'} correctamente.` };
    } catch (error) {
        console.error(`Error al cambiar disponibilidad del proveedor: ${error.message}`);
        return { error: `Error al cambiar disponibilidad del proveedor: ${error.message}` };
    }
}


export {
    guardarProveedor,
    obtenerProveedores,
    obtenerProveedoresHabilitados,
    ObtenerProveedorPorId,
    EditarProveedor,
    CambiarDisponibilidadProveedor
};
