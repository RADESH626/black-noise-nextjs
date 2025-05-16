"use server"

import connectDB from '@/utils/DBconection';
import Elemento from '@/models/Elemento';
import { revalidatePath } from 'next/cache';

// Crear un nuevo elemento
async function guardarElemento(data) {
    try {
        await connectDB();
        const nuevoElemento = new Elemento(data);
        const elementoGuardado = await nuevoElemento.save();
        revalidatePath('/admin/elementos'); // Asumiendo que esta será la ruta
        return { success: true, data: JSON.parse(JSON.stringify(elementoGuardado)) };
    } catch (error) {
        console.error('Error al guardar el elemento:', error);
        return { error: 'Error al guardar el elemento: ' + error.message };
    }
}

// Obtener todos los elementos
async function obtenerElementos() {
    try {
        await connectDB();
        const elementos = await Elemento.find({}).lean();
        return { elementos: JSON.parse(JSON.stringify(elementos)) };
    } catch (error) {
        console.error('Error al obtener los elementos:', error);
        return { error: 'Error al obtener los elementos: ' + error.message };
    }
}

// Obtener todos los elementos habilitados
async function obtenerElementosHabilitados() {
    try {
        await connectDB();
        const elementos = await Elemento.find({ habilitado: true }).lean();
        return { elementos: JSON.parse(JSON.stringify(elementos)) };
    } catch (error) {
        console.error('Error al obtener los elementos habilitados:', error);
        return { error: 'Error al obtener los elementos habilitados: ' + error.message };
    }
}


// Obtener elemento por ID
async function ObtenerElementoPorId(id) {
    try {
        await connectDB();
        const elemento = await Elemento.findById(id).lean();
        if (!elemento) {
            return { error: 'Elemento no encontrado' };
        }
        return JSON.parse(JSON.stringify(elemento));
    } catch (error) {
        console.error('Error al obtener el elemento:', error);
        return { error: 'Error al obtener el elemento: ' + error.message };
    }
}

// Editar elemento
async function EditarElemento(id, data) {
    try {
        await connectDB();
        const elementoActualizado = await Elemento.findByIdAndUpdate(id, data, { new: true }).lean();
        if (!elementoActualizado) {
            return { error: 'Elemento no encontrado para actualizar' };
        }
        revalidatePath('/admin/elementos');
        revalidatePath(`/admin/elementos/editar/${id}`);
        return { success: true, data: JSON.parse(JSON.stringify(elementoActualizado)) };
    } catch (error) {
        console.error('Error al editar el elemento:', error);
        return { error: 'Error al editar el elemento: ' + error.message };
    }
}

// Eliminar elemento (lógica de deshabilitar)
async function EliminarElemento(id) {
    try {
        await connectDB();
        // En lugar de eliminar, se deshabilita
        const elementoDeshabilitado = await Elemento.findByIdAndUpdate(id, { habilitado: false }, { new: true }).lean();
        if (!elementoDeshabilitado) {
            return { error: 'Elemento no encontrado para deshabilitar' };
        }
        revalidatePath('/admin/elementos');
        return { success: true, data: JSON.parse(JSON.stringify(elementoDeshabilitado)), message: "Elemento deshabilitado exitosamente." };
    } catch (error) {
        console.error('Error al deshabilitar el elemento:', error);
        return { error: 'Error al deshabilitar el elemento: ' + error.message };
    }
}

// Habilitar elemento
async function HabilitarElemento(id) {
    try {
        await connectDB();
        const elementoHabilitado = await Elemento.findByIdAndUpdate(id, { habilitado: true }, { new: true }).lean();
        if (!elementoHabilitado) {
            return { error: 'Elemento no encontrado para habilitar' };
        }
        revalidatePath('/admin/elementos');
        return { success: true, data: JSON.parse(JSON.stringify(elementoHabilitado)), message: "Elemento habilitado exitosamente." };
    } catch (error) {
        console.error('Error al habilitar el elemento:', error);
        return { error: 'Error al habilitar el elemento: ' + error.message };
    }
}


export {
    guardarElemento,
    obtenerElementos,
    obtenerElementosHabilitados,
    ObtenerElementoPorId,
    EditarElemento,
    EliminarElemento, // Realmente deshabilita
    HabilitarElemento
};
