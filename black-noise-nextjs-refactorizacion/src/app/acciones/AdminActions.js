"use server"

import connectDB from '@/utils/DBconection';
import Usuario from '@/models/Usuario'; // Import the Usuario model
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import logger from '@/utils/logger';
import { revalidatePath } from 'next/cache';

// Function to update a user's profile picture by an admin
export async function actualizarFotoPerfilUsuarioPorAdmin(prevState, formData) {
    await connectDB();
    logger.debug('Entering actualizarFotoPerfilUsuarioPorAdmin with formData:', formData);

    const session = await getServerSession(authOptions);

    // 1. Authorization Check: Ensure only admins can perform this action
    if (!session || !session.user || session.user.rol !== 'ADMIN') { // Assuming 'ADMIN' is the role for administrators
        return { success: false, message: 'Acceso denegado. Solo los administradores pueden realizar esta acción.' };
    }

    const userId = formData.get('userId');
    const imageFile = formData.get('profilePicture'); // Assuming the input file field name is 'profilePicture'

    if (!userId) {
        return { success: false, message: 'ID de usuario no proporcionado.' };
    }

    let mimeType = '';
    let imageData = null;

    const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB (Adjust as needed, 15MB from DesignActions might be too large for profile pictures)

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

        try {
            const bytes = await imageFile.arrayBuffer();
            imageData = Buffer.from(bytes);
            mimeType = imageFile.type;
        } catch (error) {
            logger.error('Error al procesar la imagen:', error);
            return { success: false, message: 'Error al procesar la imagen.' };
        }
    } else {
        return { success: false, message: 'No se proporcionó una imagen para actualizar el perfil.' };
    }

    try {
        const updatedUser = await Usuario.findByIdAndUpdate(
            userId,
            {
                imageData: imageData,
                imageMimeType: mimeType,
            },
            { new: true } // Return the updated document
        ).lean();

        if (!updatedUser) {
            return { success: false, message: 'Usuario no encontrado.' };
        }

        logger.debug('User profile picture updated successfully for user:', userId);

        // Revalidate paths that might display user profile pictures
        revalidatePath('/admin/users'); // Assuming an admin users listing page
        revalidatePath(`/perfil/${userId}`); // Assuming a specific user profile page
        revalidatePath('/perfil'); // Revalidate the current user's profile if they are the admin

        return { success: true, message: 'Foto de perfil actualizada exitosamente.', data: JSON.parse(JSON.stringify(updatedUser)) };
    } catch (error) {
        logger.error('ERROR in actualizarFotoPerfilUsuarioPorAdmin:', error);
        return { success: false, message: 'Error al actualizar la foto de perfil: ' + error.message };
    }
}
