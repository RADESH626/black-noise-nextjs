"use server"

import connectDB from '@/utils/DBconection';
import getDesignModel from '@/models/Design';
import Papa from 'papaparse';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Assuming this path for authOptions
import logger from '@/utils/logger';
import { Rol } from '@/models/enums/usuario/Rol';

// Function to export designs to CSV
export async function exportarDesignsCSV(searchParams = {}) {
    await connectDB();
    try {
        const Design = getDesignModel();
        let query = {};

        const fechaCreacionStart = searchParams.hasOwnProperty('fechaCreacionStart') ? searchParams.fechaCreacionStart : undefined;
        const fechaCreacionEnd = searchParams.hasOwnProperty('fechaCreacionEnd') ? searchParams.fechaCreacionEnd : undefined;
        const categoria = searchParams.hasOwnProperty('categoria') ? searchParams.categoria : undefined;
        const estadoDesing = searchParams.hasOwnProperty('estadoDesing') ? searchParams.estadoDesing : undefined;
        const disenadorUsuarioId = searchParams.hasOwnProperty('disenadorUsuarioId') ? searchParams.disenadorUsuarioId : undefined;
        const precioMin = searchParams.hasOwnProperty('precioMin') ? searchParams.precioMin : undefined;
        const precioMax = searchParams.hasOwnProperty('precioMax') ? searchParams.precioMax : undefined;
        const tallasDisponibles = searchParams.hasOwnProperty('tallasDisponibles') && searchParams.tallasDisponibles ? searchParams.tallasDisponibles.split(',') : [];

        if (fechaCreacionStart) {
            query.createdAt = { ...query.createdAt, $gte: new Date(fechaCreacionStart) };
        }
        if (fechaCreacionEnd) {
            query.createdAt = { ...query.createdAt, $lte: new Date(fechaCreacionEnd) };
        }
        if (categoria) {
            query.categoria = categoria;
        }
        if (estadoDesing) {
            query.estadoDesing = estadoDesing;
        }
        if (disenadorUsuarioId) {
            query.usuarioId = disenadorUsuarioId;
        }
        if (precioMin) {
            query.valorDesing = { ...query.valorDesing, $gte: parseFloat(precioMin) };
        }
        if (precioMax) {
            query.valorDesing = { ...query.valorDesing, $lte: parseFloat(precioMax) };
        }
        if (tallasDisponibles && tallasDisponibles.length > 0) {
            query.tallasDisponibles = { $in: tallasDisponibles };
        }

        const designs = await Design.find(query)
            .populate({
                path: 'usuarioId',
                select: 'Nombre primerApellido'
            })
            .lean();

        const csvData = designs.map(design => ({
            ID: design._id.toString(),
            'Nombre Diseño': design.nombreDesing,
            Descripción: design.descripcion,
            'Valor Diseño': design.valorDesing,
            Categoría: design.categoria,
            Estado: design.estadoDesing,
            'Colores Disponibles': design.coloresDisponibles.join(', '),
            'Tallas Disponibles': design.tallasDisponibles.join(', '),
            'Diseñador Nombre': design.usuarioId ? `${design.usuarioId.Nombre} ${design.usuarioId.primerApellido}` : 'N/A',
            'Fecha Creación': design.createdAt ? new Date(design.createdAt).toLocaleDateString() : 'N/A',
        }));

        const csv = Papa.unparse(csvData);
        return { success: true, csv, message: 'CSV de diseños generado exitosamente.' };
    } catch (error) {
        logger.error('ERROR in exportarDesignsCSV:', error);
        return { success: false, error: 'Error al generar el CSV de diseños: ' + error.message };
    }
}

// Function to save a single design
export async function guardarDesigns(prevState, formData) {
    await connectDB();
    console.log('Entering guardarDesigns with formData:', formData);

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
            console.log(`[guardarDesigns] Buffer length: ${buffer.length}, Hex snippet: ${buffer.toString('hex').substring(0, 60)}...`);
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

        const Design = getDesignModel();
        const newDesign = await Design.create(data);
        console.log('Design saved successfully:', newDesign);

        revalidatePath('/admin/designs');
        revalidatePath('/catalogo');
        revalidatePath('/perfil'); // Revalidate path for user profile page

        return {
            success: true,
            message: 'Diseño registrado exitosamente',
            data: {
                ...JSON.parse(JSON.stringify(newDesign)),
                _id: newDesign._id.toString(),
                // imageData: undefined, // Remove imageData
                // imageMimeType: undefined, // Remove imageMimeType
            }
        };
    } catch (error) {
        console.error('ERROR in guardarDesigns:', error);
        return { success: false, message: 'Error al registrar el diseño: ' + error.message };
    }
}

// Function to get all designs
export async function obtenerDesigns(searchParams = {}) {
    await connectDB();
    try {
        const Design = getDesignModel();
        let query = {};

        // Convertir searchParams a un objeto plano para asegurar acceso síncrono
        const params = {};
        for (const [key, value] of Object.entries(searchParams)) {
            params[key] = value;
        }

        // Extraer y normalizar filtros de searchParams de forma explícita
        const fechaCreacionStart = params.hasOwnProperty('fechaCreacionStart') ? params.fechaCreacionStart : undefined;
        const fechaCreacionEnd = params.hasOwnProperty('fechaCreacionEnd') ? params.fechaCreacionEnd : undefined;
        const categoria = params.hasOwnProperty('categoria') ? params.categoria : undefined;
        const estadoDesing = params.hasOwnProperty('estadoDesing') ? params.estadoDesing : undefined;
        const disenadorUsuarioId = params.hasOwnProperty('disenadorUsuarioId') ? params.disenadorUsuarioId : undefined;
        const precioMin = params.hasOwnProperty('precioMin') ? params.precioMin : undefined;
        const precioMax = params.hasOwnProperty('precioMax') ? params.precioMax : undefined;
        const tallasDisponibles = params.hasOwnProperty('tallasDisponibles') && params.tallasDisponibles ? params.tallasDisponibles.split(',') : [];

        // Aplicar filtros
        if (fechaCreacionStart) {
            query.createdAt = { ...query.createdAt, $gte: new Date(fechaCreacionStart) };
        }
        if (fechaCreacionEnd) {
            query.createdAt = { ...query.createdAt, $lte: new Date(fechaCreacionEnd) };
        }
        if (categoria) {
            query.categoria = categoria;
        }
        if (estadoDesing) {
            query.estadoDesing = estadoDesing;
        }
        if (disenadorUsuarioId) {
            query.usuarioId = disenadorUsuarioId;
        }
        if (precioMin) {
            query.valorDesing = { ...query.valorDesing, $gte: parseFloat(precioMin) };
        }
        if (precioMax) {
            query.valorDesing = { ...query.valorDesing, $lte: parseFloat(precioMax) };
        }
        if (tallasDisponibles && tallasDisponibles.length > 0) {
            query.tallasDisponibles = { $in: tallasDisponibles };
        }

        const designs = await Design.find(query)
            .populate({
                path: 'usuarioId',
                select: 'Nombre primerApellido imageData imageMimeType'
            })
            .lean();

        const formattedDesigns = designs.map(design => {
            const processedDesign = { ...design, _id: design._id.toString() };

            delete processedDesign.imageData;
            delete processedDesign.imageMimeType;

            const designImageUrl = design.imageData && design.imageData.buffer instanceof Buffer && design.imageMimeType
                ? `data:${design.imageMimeType};base64,${design.imageData.buffer.toString('base64')}`
                : null;

            const processedUsuario = design.usuarioId ? {
                _id: design.usuarioId._id.toString(),
                Nombre: design.usuarioId.Nombre,
                primerApellido: design.usuarioId.primerApellido,
            } : null;

            const userAvatar = design.usuarioId && design.usuarioId.imageData && design.usuarioId.imageData.buffer instanceof Buffer && design.usuarioId.imageMimeType
                ? `data:${design.usuarioId.imageMimeType};base64,${design.usuarioId.imageData.buffer.toString('base64')}`
                : null;

            return {
                ...processedDesign,
                prenda: processedDesign.nombreDesing,
                price: processedDesign.valorDesing,
                usuario: processedUsuario ? `${processedUsuario.Nombre} ${processedUsuario.primerApellido}` : 'Usuario Desconocido',
                userAvatar: userAvatar,
                imagen: designImageUrl,
                usuarioId: processedUsuario,
            };
        });

        return { data: formattedDesigns };
    } catch (error) {
        console.error('ERROR in obtenerDesigns:', error);
        return { error: 'Error al obtener los diseños: ' + error.message };
    }
}

// Function to get designs by user ID
export async function obtenerDesignsPorUsuarioId(usuarioId) {
    await connectDB();
    console.log('Entering obtenerDesignsPorUsuarioId with usuarioId:', usuarioId);
    try {
        const Design = getDesignModel();
        const designs = await Design.find({ usuarioId: usuarioId }).lean();

        const formattedDesigns = designs.map(design => {
            
            const designImageUrl = design.imageData && design.imageData.buffer instanceof Buffer && design.imageMimeType
                ? `data:${design.imageMimeType};base64,${design.imageData.buffer.toString('base64')}`
                : null;

            // Create a new plain object to ensure no Mongoose objects are passed
            const plainDesign = {
                _id: design._id.toString(),
                usuarioId: design.usuarioId.toString(), // Convert ObjectId to string
                nombreDesing: design.nombreDesing,
                descripcion: design.descripcion,
                valorDesing: design.valorDesing,
                categoria: design.categoria,
                estadoDesing: design.estadoDesing,
                coloresDisponibles: design.coloresDisponibles,
                tallasDisponibles: design.tallasDisponibles,
                createdAt: design.createdAt.toISOString(),
                updatedAt: design.updatedAt.toISOString(),
                // Exclude imageData and imageMimeType from the top level if they are Buffers
            };

            return {
                ...plainDesign,
                imagen: designImageUrl,
            };
        });

        // console.log('Designs obtained by usuarioId successfully and formatted:', formattedDesigns);

        return { designs: JSON.parse(JSON.stringify(formattedDesigns)), error: null };
    } catch (error) {
        console.error('ERROR in obtenerDesignsPorUsuarioId:', error);
        return { designs: null, error: 'Error al obtener los diseños por usuario: ' + error.message };
    }
}


// Function to find a design by ID
export async function encontrarDesignsPorId(id) {
    await connectDB();
    console.log('Entering encontrarDesignsPorId with ID:', id);
    try {
        const Design = getDesignModel();
        const design = await Design.findById(id).lean();
        console.log('Design found by ID:', design);
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
    console.log('Entering actualizarDesign with formData:', formData);

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
                return { success: false, message: 'El archivo de imagen proporcionado no es válido.' };
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

        if (updateImageData.imageData) {
            console.log(`[actualizarDesign] Buffer length: ${updateImageData.imageData.length}, Hex snippet: ${updateImageData.imageData.toString('hex').substring(0, 60)}...`);
        }
        const Design = getDesignModel();
        const updatedDesign = await Design.findByIdAndUpdate(id, data, { new: true }).lean();
        console.log('Design updated successfully:', updatedDesign);

        revalidatePath('/admin/designs');
        revalidatePath('/catalogo');
        revalidatePath(`/admin/designs/editar/${id}`); // Revalidate specific edit page

        return {
            success: true,
            message: 'Diseño actualizado exitosamente',
            data: {
                ...JSON.parse(JSON.stringify(updatedDesign)),
                _id: updatedDesign._id.toString(),
                imageData: undefined, // Remove imageData
                imageMimeType: undefined, // Remove imageMimeType
            }
        };
    } catch (error) {
        console.error('ERROR in actualizarDesign:', error);
        return { success: false, message: 'Error al actualizar el diseño: ' + error.message };
    }
}

// Function to delete a design
export async function eliminarDesign(id) {
    await connectDB();
    console.log('Entering eliminarDesign with ID:', id);
    try {
        const Design = getDesignModel();
        const deletedDesign = await Design.findByIdAndDelete(id).lean();
        console.log('Design deleted successfully:', deletedDesign);

        revalidatePath('/admin/designs');
        revalidatePath('/catalogo');

        return { success: true, message: 'Diseño eliminado exitosamente' };
    } catch (error) {
        console.error('ERROR in eliminarDesign:', error);
        return { success: false, message: 'Error al eliminar el diseño: ' + error.message };
    }
}
