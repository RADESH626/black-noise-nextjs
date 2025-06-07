"use server"

import connectDB from '@/utils/DBconection';
import Design from '@/models/Design'; // Assuming you have a Design model
import Papa from 'papaparse'; // Keep papaparse for CSV parsing for now
import { revalidatePath } from 'next/cache';

// Function to save a single design
export async function guardarDesigns(prevState, formData) {
    await connectDB();
    console.log('DEBUG: Entering guardarDesigns with formData:', formData);

    try {
        const data = {
            nombre: formData.get('nombre'),
            descripcion: formData.get('descripcion'),
            precio: parseFloat(formData.get('precio')),
            categoria: formData.get('categoria'),
            tallasDisponibles: formData.getAll('tallasDisponibles'), // Assuming multiple checkboxes/select
            coloresDisponibles: formData.getAll('coloresDisponibles'), // Assuming multiple checkboxes/select
            imagen: formData.get('imagen'), // Assuming base64 string or URL
            // Add other design-specific fields as per your Design model
        };

        const newDesign = await Design.create(data);
        console.log('DEBUG: Design saved successfully:', newDesign);

        revalidatePath('/admin/designs'); // Revalidate path for admin designs list
        revalidatePath('/catalogo'); // Revalidate path for public catalog

        return { success: true, message: 'Diseño registrado exitosamente', data: JSON.parse(JSON.stringify(newDesign)) };
    } catch (error) {
        console.error('ERROR in guardarDesigns:', error);
        return { success: false, message: 'Error al registrar el diseño: ' + error.message };
    }
}

// Function to get all designs
export async function obtenerDesigns() {
    await connectDB();
    console.log('DEBUG: Entering obtenerDesigns.');
    try {
        const designs = await Design.find({}).lean();
        console.log('DEBUG: Designs obtained successfully:', designs);
        return { data: JSON.parse(JSON.stringify(designs)) };
    } catch (error) {
        console.error('ERROR in obtenerDesigns:', error);
        return { error: 'Error al obtener los diseños: ' + error.message };
    }
}

// Function to register a single design (from a form)
// This function was previously named RegistrarDesing and had user-related fields.
// It's now corrected to handle design registration.
export async function RegistrarDesign(prevState, formData) {
    console.log('DEBUG: Entering RegistrarDesign with formData:', formData);
    // Call guardarDesigns directly
    return await guardarDesigns(prevState, formData);
}

// Function for mass registration of designs from a file
export async function RegistroMasivoDesigns(prevState, formData) {
    await connectDB();
    console.log('DEBUG: Entering RegistroMasivoDesigns with formData:', formData);

    const file = formData.get('file');
    if (!file) {
        console.log('DEBUG: No file uploaded.');
        return { success: false, message: 'No se ha subido ningún archivo' };
    }

    const buffer = await file.arrayBuffer();
    const text = new TextDecoder().decode(buffer);

    try {
        const resultadoParseo = Papa.parse(text, {
            header: true,
            skipEmptyLines: true,
            transformHeader: header => header.trim(),
            transform: value => typeof value === 'string' ? value.trim() : value,
        });

        if (resultadoParseo.errors.length > 0) {
            console.error("ERROR in RegistroMasivoDesigns (CSV parsing errors):", resultadoParseo.errors);
            return { success: false, message: 'Errores al parsear el archivo CSV: ' + resultadoParseo.errors.map(e => e.message).join(', ') };
        }

        const designsToSave = resultadoParseo.data.map(designData => ({
            nombre: designData.nombre,
            descripcion: designData.descripcion,
            precio: parseFloat(designData.precio),
            categoria: designData.categoria,
            tallasDisponibles: designData.tallasDisponibles ? designData.tallasDisponibles.split(',').map(s => s.trim()) : [],
            coloresDisponibles: designData.coloresDisponibles ? designData.coloresDisponibles.split(',').map(c => c.trim()) : [],
            imagen: designData.imagen,
            // Map other fields as per your Design model
        }));

        const savedDesigns = await Design.insertMany(designsToSave);
        console.log('DEBUG: All designs processed for mass registration:', savedDesigns);

        revalidatePath('/admin/designs');
        revalidatePath('/catalogo');

        return { success: true, message: `Se registraron ${savedDesigns.length} diseños masivamente.`, data: JSON.parse(JSON.stringify(savedDesigns)) };
    } catch (error) {
        console.error("ERROR in RegistroMasivoDesigns:", error);
        return { success: false, message: 'Error en el registro masivo de diseños: ' + error.message };
    }
}

// Function to find a design by ID
export async function encontrarDesignsPorId(id) {
    await connectDB();
    console.log('DEBUG: Entering encontrarDesignsPorId with ID:', id);
    try {
        const design = await Design.findById(id).lean();
        console.log('DEBUG: Design found by ID:', design);
        if (!design) {
            return { error: 'Diseño no encontrado.' };
        }
        return { data: JSON.parse(JSON.stringify(design)) };
    } catch (error) {
        console.error('ERROR in encontrarDesignsPorId:', error);
        return { error: 'Error al encontrar el diseño por ID: ' + error.message };
    }
}

// Function to update a design
export async function actualizarDesign(prevState, formData) {
    await connectDB();
    console.log('DEBUG: Entering actualizarDesign with formData:', formData);

    const id = formData.get('id'); // Assuming ID is passed in formData for updates
    if (!id) {
        return { success: false, message: 'ID del diseño no proporcionado para la actualización.' };
    }

    try {
        const data = {
            nombre: formData.get('nombre'),
            descripcion: formData.get('descripcion'),
            precio: parseFloat(formData.get('precio')),
            categoria: formData.get('categoria'),
            tallasDisponibles: formData.getAll('tallasDisponibles'),
            coloresDisponibles: formData.getAll('coloresDisponibles'),
            imagen: formData.get('imagen'),
            // Add other design-specific fields for update
        };

        const updatedDesign = await Design.findByIdAndUpdate(id, data, { new: true }).lean();
        console.log('DEBUG: Design updated successfully:', updatedDesign);

        revalidatePath('/admin/designs');
        revalidatePath('/catalogo');
        revalidatePath(`/admin/designs/editar/${id}`); // Revalidate specific edit page

        return { success: true, message: 'Diseño actualizado exitosamente', data: JSON.parse(JSON.stringify(updatedDesign)) };
    } catch (error) {
        console.error('ERROR in actualizarDesign:', error);
        return { success: false, message: 'Error al actualizar el diseño: ' + error.message };
    }
}

// Function to delete a design
export async function eliminarDesign(id) {
    await connectDB();
    console.log('DEBUG: Entering eliminarDesign with ID:', id);
    try {
        const deletedDesign = await Design.findByIdAndDelete(id).lean();
        console.log('DEBUG: Design deleted successfully:', deletedDesign);

        revalidatePath('/admin/designs');
        revalidatePath('/catalogo');

        return { success: true, message: 'Diseño eliminado exitosamente' };
    } catch (error) {
        console.error('ERROR in eliminarDesign:', error);
        return { success: false, message: 'Error al eliminar el diseño: ' + error.message };
    }
}
