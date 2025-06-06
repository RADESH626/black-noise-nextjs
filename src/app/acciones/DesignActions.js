"use server"

import connectDB from '@/utils/DBconection';
import Design from '@/models/Design';
import { revalidatePath } from 'next/cache';

// Crear un nuevo diseño
async function guardarDesign(data) {
    console.log('DEBUG: Entering guardarDesign with data:', data);
    try {
        await connectDB();
        console.log('DEBUG: Database connected for guardarDesign.');
        const nuevoDesign = new Design(data);
        console.log('DEBUG: New Design instance created:', nuevoDesign);
        const designGuardado = await nuevoDesign.save();
        console.log('DEBUG: Design saved to DB:', designGuardado);
        revalidatePath('/admin/designs'); // Asumiendo que esta será la ruta
        console.log('DEBUG: Revalidated path /admin/designs.');
        return { success: true, data: JSON.parse(JSON.stringify(designGuardado)) };
    } catch (error) {
        console.error('ERROR in guardarDesign:', error);
        return { error: 'Error al guardar el diseño: ' + error.message };
    }
}

// Obtener todos los diseños
async function obtenerDesigns() {
    console.log('DEBUG: Entering obtenerDesigns.');
    try {
        await connectDB();
        console.log('DEBUG: Database connected for obtenerDesigns.');
        const designs = await Design.find({}).lean();
        console.log('DEBUG: Designs retrieved from DB:', designs.length, 'designs found.');
        return { designs: JSON.parse(JSON.stringify(designs)) };
    } catch (error) {
        console.error('ERROR in obtenerDesigns:', error);
        return { error: 'Error al obtener los diseños: ' + error.message };
    }
}

// Obtener diseños por usuario ID
async function obtenerDesignsPorUsuarioId(usuarioId) {
    console.log('DEBUG: Entering obtenerDesignsPorUsuarioId with usuarioId:', usuarioId);
    try {
        await connectDB();
        console.log('DEBUG: Database connected for obtenerDesignsPorUsuarioId.');
        const designs = await Design.find({ usuarioId }).lean();
        console.log('DEBUG: Designs retrieved for user ID:', usuarioId, 'count:', designs.length);
        return { designs: JSON.parse(JSON.stringify(designs)) };
    } catch (error) {
        console.error('ERROR in obtenerDesignsPorUsuarioId:', error);
        return { error: 'Error al obtener los diseños del usuario: ' + error.message };
    }
}

// Obtener diseño por ID
async function ObtenerDesignPorId(id) {
    console.log('DEBUG: Entering ObtenerDesignPorId with ID:', id);
    try {
        await connectDB();
        console.log('DEBUG: Database connected for ObtenerDesignPorId.');
        const design = await Design.findById(id).lean();
        console.log('DEBUG: Design retrieved from DB:', design);
        if (!design) {
            console.log('DEBUG: Design not found for ID:', id);
            return { error: 'Diseño no encontrado' };
        }
        console.log('DEBUG: Exiting ObtenerDesignPorId with design:', JSON.parse(JSON.stringify(design)));
        return JSON.parse(JSON.stringify(design));
    } catch (error) {
        console.error('ERROR in ObtenerDesignPorId:', error);
        return { error: 'Error al obtener el diseño: ' + error.message };
    }
}

// Editar diseño
async function EditarDesign(id, data) {
    console.log('DEBUG: Entering EditarDesign with ID:', id, 'and data:', data);
    try {
        await connectDB();
        console.log('DEBUG: Database connected for EditarDesign.');
        const designActualizado = await Design.findByIdAndUpdate(id, data, { new: true }).lean();
        console.log('DEBUG: Design updated in DB:', designActualizado);
        if (!designActualizado) {
            console.log('DEBUG: Design not found for update with ID:', id);
            return { error: 'Diseño no encontrado para actualizar' };
        }
        revalidatePath('/admin/designs');
        revalidatePath(`/admin/designs/editar/${id}`);
        console.log('DEBUG: Revalidated paths /admin/designs and /admin/designs/editar/${id}.');
        return { success: true, data: JSON.parse(JSON.stringify(designActualizado)) };
    } catch (error) {
        console.error('ERROR in EditarDesign:', error);
        return { error: 'Error al editar el diseño: ' + error.message };
    }
}

// Eliminar diseño
async function EliminarDesign(id) {
    console.log('DEBUG: Entering EliminarDesign with ID:', id);
    try {
        await connectDB();
        console.log('DEBUG: Database connected for EliminarDesign.');
        const designEliminado = await Design.findByIdAndDelete(id).lean();
        console.log('DEBUG: Design deleted from DB:', designEliminado);
        if (!designEliminado) {
            console.log('DEBUG: Design not found for deletion with ID:', id);
            return { error: 'Diseño no encontrado para eliminar' };
        }
        revalidatePath('/admin/designs');
        console.log('DEBUG: Revalidated path /admin/designs.');
        return { success: true, data: JSON.parse(JSON.stringify(designEliminado)) };
    } catch (error) {
        console.error('ERROR in EliminarDesign:', error);
        return { error: 'Error al eliminar el diseño: ' + error.message };
    }
}

export {
    guardarDesign,
    obtenerDesigns,
    obtenerDesignsPorUsuarioId,
    ObtenerDesignPorId,
    EditarDesign,
    EliminarDesign
};
