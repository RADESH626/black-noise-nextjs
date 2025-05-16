"use server"

import connectDB from '@/utils/DBconection';
import Design from '@/models/Design';
import { revalidatePath } from 'next/cache';

// Crear un nuevo diseño
async function guardarDesign(data) {
    try {
        await connectDB();
        const nuevoDesign = new Design(data);
        const designGuardado = await nuevoDesign.save();
        revalidatePath('/admin/designs'); // Asumiendo que esta será la ruta
        return { success: true, data: JSON.parse(JSON.stringify(designGuardado)) };
    } catch (error) {
        console.error('Error al guardar el diseño:', error);
        return { error: 'Error al guardar el diseño: ' + error.message };
    }
}

// Obtener todos los diseños
async function obtenerDesigns() {
    try {
        await connectDB();
        const designs = await Design.find({}).lean();
        return { designs: JSON.parse(JSON.stringify(designs)) };
    } catch (error) {
        console.error('Error al obtener los diseños:', error);
        return { error: 'Error al obtener los diseños: ' + error.message };
    }
}

// Obtener diseño por ID
async function ObtenerDesignPorId(id) {
    try {
        await connectDB();
        const design = await Design.findById(id).lean();
        if (!design) {
            return { error: 'Diseño no encontrado' };
        }
        return JSON.parse(JSON.stringify(design));
    } catch (error) {
        console.error('Error al obtener el diseño:', error);
        return { error: 'Error al obtener el diseño: ' + error.message };
    }
}

// Editar diseño
async function EditarDesign(id, data) {
    try {
        await connectDB();
        const designActualizado = await Design.findByIdAndUpdate(id, data, { new: true }).lean();
        if (!designActualizado) {
            return { error: 'Diseño no encontrado para actualizar' };
        }
        revalidatePath('/admin/designs');
        revalidatePath(`/admin/designs/editar/${id}`);
        return { success: true, data: JSON.parse(JSON.stringify(designActualizado)) };
    } catch (error) {
        console.error('Error al editar el diseño:', error);
        return { error: 'Error al editar el diseño: ' + error.message };
    }
}

// Eliminar diseño
async function EliminarDesign(id) {
    try {
        await connectDB();
        const designEliminado = await Design.findByIdAndDelete(id).lean();
        if (!designEliminado) {
            return { error: 'Diseño no encontrado para eliminar' };
        }
        revalidatePath('/admin/designs');
        return { success: true, data: JSON.parse(JSON.stringify(designEliminado)) };
    } catch (error) {
        console.error('Error al eliminar el diseño:', error);
        return { error: 'Error al eliminar el diseño: ' + error.message };
    }
}

export {
    guardarDesign,
    obtenerDesigns,
    ObtenerDesignPorId,
    EditarDesign,
    EliminarDesign
};
