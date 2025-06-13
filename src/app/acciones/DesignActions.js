"use server"

import connectDB from '@/utils/DBconection';
import Design from '@/models/Design';
import Papa from 'papaparse';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Assuming this path for authOptions
import logger from '@/utils/logger';
import { Rol } from '@/models/enums/usuario/Rol';

// Function to save a single design
export async function guardarDesigns(prevState, formData) {
    await connectDB();
    logger.debug('Entering guardarDesigns with formData:', formData);

    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
        return { success: false, message: 'Usuario no autenticado.' };
    }

    // Only allow CLIENTE role to upload designs
    if (session.user.rol !== Rol.CLIENTE) {
        return { success: false, message: 'Solo los usuarios con rol CLIENTE pueden subir diseños.' };
    }

    try {
        const imageFile = formData.get('imagenDesing');
        let mimeType = '';
        let imageData = null;

        const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
        const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 MB

        if (imageFile) {
            if (!(imageFile instanceof File)) {
                return { success: false, message: 'El archivo de imagen proporcionado no es válido.' };
            }

            if (!ALLOWED_MIME_TYPES.includes(imageFile.type)) {
                return { success: false, message: `Tipo de archivo no soportado: ${imageFile.type}. Solo se permiten JPG, PNG y WEBP.` };
            }

            if (imageFile.size > MAX_FILE_SIZE) {
                return { success: false, message: `El tamaño del archivo excede el límite de ${MAX_FILE_SIZE / (1024 * 1024)} MB.` };
            }

            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            mimeType = imageFile.type;
            imageData = buffer;
        } else {
            return { success: false, message: 'No se proporcionó una imagen para el diseño.' };
        }

        const data = {
            usuarioId: session.user.id,
            nombreDesing: formData.get('nombreDesing'),
            descripcion: formData.get('descripcion'),
            valorDesing: parseFloat(formData.get('valorDesing')),
            categoria: formData.get('categoria'),
            imageData: imageData,
            imageMimeType: mimeType,
            estadoDesing: 'PRIVADO',
            coloresDisponibles: formData.get('coloresDisponibles') ? formData.get('coloresDisponibles').split(',') : [],
            tallasDisponibles: formData.get('tallasDisponibles') ? formData.get('tallasDisponibles').split(',') : []
        };

        const newDesign = await Design.create(data);
        logger.debug('Design saved successfully:', newDesign);

        revalidatePath('/admin/designs');
        revalidatePath('/catalogo');
        revalidatePath('/perfil'); // Revalidate path for user profile page

        return { success: true, message: 'Diseño registrado exitosamente', data: JSON.parse(JSON.stringify(newDesign)) };
    } catch (error) {
        logger.error('ERROR in guardarDesigns:', error);
        return { success: false, message: 'Error al registrar el diseño: ' + error.message };
    }
}

// Function to get all designs
export async function obtenerDesigns() {
    await connectDB();
    logger.debug('Entering obtenerDesigns.');
    try {
        const designs = await Design.find({})
            .populate({
                path: 'usuarioId',
                select: 'nombreUsuario imageData imageMimeType' // Select only necessary fields
            })
            .lean();

        const formattedDesigns = designs.map(design => {
            const userAvatar = design.usuarioId && design.usuarioId.imageData && design.usuarioId.imageMimeType
                ? `/api/images/usuario/${design.usuarioId._id}`
                : '/img/perfil/FotoPerfil.webp'; // Default avatar if no image data

            const designImageUrl = design.imageData && design.imageMimeType
                ? `/api/images/design/${design._id}`
                : null; // Or a default image path if no image data

            return {
                ...design,
                id: design._id.toString(), // Ensure a string ID for frontend key
                prenda: design.nombreDesing, // Map nombreDesing to prenda
                price: design.valorDesing,   // Map valorDesing to price
                usuario: design.usuarioId ? design.usuarioId.nombreUsuario : 'Usuario Desconocido', // Map user name
                userAvatar: userAvatar, // Add user avatar URL
                imagen: designImageUrl, // Provide the image URL
                // Remove original imageData and imageMimeType as they are now processed into 'imagen'
                imageData: undefined,
                imageMimeType: undefined,
            };
        });

        logger.debug('Designs obtained and formatted successfully:', formattedDesigns);
        return { data: JSON.parse(JSON.stringify(formattedDesigns)) };
    } catch (error) {
        logger.error('ERROR in obtenerDesigns:', error);
        return { error: 'Error al obtener los diseños: ' + error.message };
    }
}

// Function to get designs by user ID
export async function obtenerDesignsPorUsuarioId(usuarioId) {
    await connectDB();
    logger.debug('Entering obtenerDesignsPorUsuarioId with usuarioId:', usuarioId);
    try {
        const designs = await Design.find({ usuarioId: usuarioId }).lean();

        const formattedDesigns = designs.map(design => {
            const designImageUrl = design.imageData && design.imageMimeType
                ? `/api/images/design/${design._id}`
                : null; // Or a default image path if no image data

            return {
                ...design,
                imagen: designImageUrl, // Provide the image URL
                imageData: undefined, // Remove original imageData
                imageMimeType: undefined, // Remove mime type
            };
        });

        logger.debug('Designs obtained by usuarioId successfully and formatted:', formattedDesigns);
        return { designs: JSON.parse(JSON.stringify(formattedDesigns)), error: null };
    } catch (error) {
        logger.error('ERROR in obtenerDesignsPorUsuarioId:', error);
        return { designs: null, error: 'Error al obtener los diseños por usuario: ' + error.message };
    }
}


// Function to find a design by ID
export async function encontrarDesignsPorId(id) {
    await connectDB();
    logger.debug('Entering encontrarDesignsPorId with ID:', id);
    try {
        const design = await Design.findById(id).lean();
        logger.debug('Design found by ID:', design);
        if (!design) {
            return { error: 'Diseño no encontrado.' };
        }
        return { data: JSON.parse(JSON.stringify(design)) };
    } catch (error) {
        logger.error('ERROR in encontrarDesignsPorId:', error);
        return { error: 'Error al encontrar el diseño por ID: ' + error.message };
    }
}

// Function to update a design
export async function actualizarDesign(prevState, formData) {
    await connectDB();
    logger.debug('Entering actualizarDesign with formData:', formData);

    const id = formData.get('id');
    if (!id) {
        return { success: false, message: 'ID del diseño no proporcionado para la actualización.' };
    }

    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
        return { success: false, message: 'Usuario no autenticado.' };
    }

    try {
        const imageFile = formData.get('imagenDesing');
        let updateImageData = {};
        const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
        const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 MB

        if (imageFile) {
            if (!(imageFile instanceof File)) {
                return { success: false, message: 'El archivo de imagen proporcionado no es válido para la actualización.' };
            }

            if (!ALLOWED_MIME_TYPES.includes(imageFile.type)) {
                return { success: false, message: `Tipo de archivo no soportado para la actualización: ${imageFile.type}. Solo se permiten JPG, PNG y WEBP.` };
            }

            if (imageFile.size > MAX_FILE_SIZE) {
                return { success: false, message: `El tamaño del archivo excede el límite de ${MAX_FILE_SIZE / (1024 * 1024)} MB para la actualización.` };
            }

            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const mimeType = imageFile.type;
            updateImageData = {
                imageData: buffer,
                imageMimeType: mimeType,
            };
        }

        const data = {
            nombreDesing: formData.get('nombreDesing'),
            descripcion: formData.get('descripcion'),
            valorDesing: parseFloat(formData.get('valorDesing')),
            categoria: formData.get('categoria'),
            coloresDisponibles: formData.get('coloresDisponibles') ? formData.get('coloresDisponibles').split(',') : [],
            tallasDisponibles: formData.get('tallasDisponibles') ? formData.get('tallasDisponibles').split(',') : [],
            ...updateImageData, // Spread the image data if available
            // Do not update usuarioId or estadoDesing here unless explicitly required for updates
        };

        const updatedDesign = await Design.findByIdAndUpdate(id, data, { new: true }).lean();
        logger.debug('Design updated successfully:', updatedDesign);

        revalidatePath('/admin/designs');
        revalidatePath('/catalogo');
        revalidatePath(`/admin/designs/editar/${id}`); // Revalidate specific edit page

        return { success: true, message: 'Diseño actualizado exitosamente', data: JSON.parse(JSON.stringify(updatedDesign)) };
    } catch (error) {
        logger.error('ERROR in actualizarDesign:', error);
        return { success: false, message: 'Error al actualizar el diseño: ' + error.message };
    }
}

// Function to delete a design
export async function eliminarDesign(id) {
    await connectDB();
    logger.debug('Entering eliminarDesign with ID:', id);
    try {
        const deletedDesign = await Design.findByIdAndDelete(id).lean();
        logger.debug('Design deleted successfully:', deletedDesign);

        revalidatePath('/admin/designs');
        revalidatePath('/catalogo');

        return { success: true, message: 'Diseño eliminado exitosamente' };
    } catch (error) {
        logger.error('ERROR in eliminarDesign:', error);
        return { success: false, message: 'Error al eliminar el diseño: ' + error.message };
    }
}
