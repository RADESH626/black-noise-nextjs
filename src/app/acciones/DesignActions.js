"use server"

import connectDB from '@/utils/DBconection';
import Design from '@/models/Design';
import Papa from 'papaparse';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Assuming this path for authOptions

// Function to save a single design
export async function guardarDesigns(prevState, formData) {
    await connectDB();
    console.log('DEBUG: Entering guardarDesigns with formData:', formData);

    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
        return { success: false, message: 'Usuario no autenticado.' };
    }

    try {
        const data = {
            usuarioId: session.user.id,
            nombreDesing: formData.get('nombreDesing'), // Changed to nombreDesing to match model
            descripcion: formData.get('descripcion'),
            valorDesing: parseFloat(formData.get('valorDesing')), // Changed to valorDesing to match model
            categoria: formData.get('categoria'),
            imagenDesing: formData.get('imagenDesing'), // Changed to imagenDesing to match model
            tallasDisponibles: formData.get('tallasDisponibles'), // Changed to get single string
            coloresDisponibles: formData.get('coloresDisponibles'), // Changed to get single string
            estadoDesing: 'PRIVADO' // Explicitly set to PRIVADO as per requirements
        };

        const newDesign = await Design.create(data);
        console.log('DEBUG: Design saved successfully:', newDesign);

        revalidatePath('/admin/designs');
        revalidatePath('/catalogo');
        revalidatePath('/perfil'); // Revalidate path for user profile page

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

// Function to get designs by user ID
export async function obtenerDesignsPorUsuarioId(userId) {
    await connectDB();
    console.log('DEBUG: Entering obtenerDesignsPorUsuarioId with userId:', userId);
    try {
        const designs = await Design.find({ userId: userId }).lean(); // Assuming 'userId' field in Design model
        console.log('DEBUG: Designs obtained by userId successfully:', designs);
        return { designs: JSON.parse(JSON.stringify(designs)), error: null };
    } catch (error) {
        console.error('ERROR in obtenerDesignsPorUsuarioId:', error);
        return { designs: null, error: 'Error al obtener los diseños por usuario: ' + error.message };
    }
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
            usuarioId: session.user.id, // Assuming mass upload is also by a logged-in user
            nombreDesing: designData.nombreDesing,
            descripcion: designData.descripcion,
            valorDesing: parseFloat(designData.valorDesing),
            categoria: designData.categoria,
            imagenDesing: designData.imagenDesing,
            tallasDisponibles: designData.tallasDisponibles,
            coloresDisponibles: designData.coloresDisponibles,
            estadoDesing: 'PRIVADO'
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

    const id = formData.get('id');
    if (!id) {
        return { success: false, message: 'ID del diseño no proporcionado para la actualización.' };
    }

    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
        return { success: false, message: 'Usuario no autenticado.' };
    }

    try {
        const data = {
            nombreDesing: formData.get('nombreDesing'),
            descripcion: formData.get('descripcion'),
            valorDesing: parseFloat(formData.get('valorDesing')),
            categoria: formData.get('categoria'),
            imagenDesing: formData.get('imagenDesing'),
            tallasDisponibles: formData.get('tallasDisponibles'),
            coloresDisponibles: formData.get('coloresDisponibles'),
            // Do not update usuarioId or estadoDesing here unless explicitly required for updates
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
