"use server"

import connectDB from '@/utils/DBconection';
import Design from '@/models/Design';
import { revalidatePath } from 'next/cache';
import { 
    mockDesigns, 
    getMockDesignsByUsuario, 
    getMockDesignById 
} from '@/data/mock/designs'; // Import mock data for designs

const isMockModeEnabled = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

// Helper para generar IDs únicos (simulado)
const generateUniqueId = (prefix = 'mock') => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Crear un nuevo diseño
async function guardarDesign(data) {
    console.log('DEBUG: Entering guardarDesign with data:', data);
    if (isMockModeEnabled) {
        console.log('🎭 Mock Mode: Simulando guardarDesign.');
        const newDesign = {
            ...data,
            id: generateUniqueId('design'), // Use 'id' as per mock data structure
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        revalidatePath('/admin/designs');
        return { success: true, message: "Diseño creado exitosamente (simulado)", data: newDesign };
    }
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
    if (isMockModeEnabled) {
        console.log('🎭 Mock Mode: Obteniendo todos los diseños mock.');
        return { designs: mockDesigns };
    }
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
async function obtenerDesignsPorUsuarioId(usuarioId, mockDataEnabledClient = false) {
    console.log('DEBUG: Entering obtenerDesignsPorUsuarioId with usuarioId:', usuarioId, 'mockDataEnabledClient:', mockDataEnabledClient);
    // Prioritize client-side mock data toggle over environment variable
    if (mockDataEnabledClient) {
        console.log('🎭 Mock Mode (Client-side): Obteniendo diseños mock por usuario ID:', usuarioId);
        // Return mock designs for the simulated user ID
        // If the user has no designs, return an empty array
        const mockDesignsForUser = getMockDesignsByUsuario(usuarioId);
        if (usuarioId === "mockUserId123") { // Check for the specific mock user ID
            // If the goal is to toggle "has designs" or "no designs"
            // We can return an empty array or a populated array based on some internal logic
            // For now, let's return a fixed set of mock designs for the mock user
            // Or, if the user wants to toggle "has designs" or "no designs", we need a way to control that.
            // The user's goal is "que este boton cambie si el usuario "tiene" o no diseños registrados"
            // This implies the mock data button should control whether the mock user has designs.
            // Let's assume if mockDataEnabledClient is true, the mock user has designs.
            // If mockDataEnabledClient is false, the mock user has no designs.
            if (mockDataEnabledClient) {
                return { designs: mockDesignsForUser.length > 0 ? mockDesignsForUser : [{
                    _id: "mockDesign1",
                    nombreDesing: "Mock Design 1",
                    valorDesing: 25.00,
                    categoria: "Camiseta",
                    likes: 5,
                    imagenDesing: "/img/Camisetas/Camiseta 1.jpg",
                    usuarioId: "mockUserId123"
                },
                {
                    _id: "mockDesign2",
                    nombreDesing: "Mock Design 2",
                    valorDesing: 30.00,
                    categoria: "Chaqueta",
                    likes: 10,
                    imagenDesing: "/img/Chaquetas/Chaqueta 1.jpg",
                    usuarioId: "mockUserId123"
                }] };
            } else {
                return { designs: [] }; // No designs when mock data is disabled
            }
        }
        return { designs: mockDesignsForUser }; // For other mock users if any
    }
    // Fallback to environment variable if client-side toggle is not active
    if (isMockModeEnabled) {
        console.log('🎭 Mock Mode (Environment): Obteniendo diseños mock por usuario ID:', usuarioId);
        return { designs: getMockDesignsByUsuario(usuarioId) };
    }
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
    if (isMockModeEnabled) {
        console.log('🎭 Mock Mode: Obteniendo diseño mock por ID:', id);
        const design = getMockDesignById(id);
        if (design) {
            return design;
        }
        return { error: 'Diseño no encontrado (simulado)' };
    }
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
    if (isMockModeEnabled) {
        console.log('🎭 Mock Mode: Simulando edición de diseño ID:', id);
        const existingDesign = getMockDesignById(id);
        if (existingDesign) {
            const updatedDesign = {
                ...existingDesign,
                ...data,
                updatedAt: new Date().toISOString()
            };
            revalidatePath('/admin/designs');
            revalidatePath(`/admin/designs/editar/${id}`);
            return { success: true, message: "Diseño actualizado exitosamente (simulado)", data: updatedDesign };
        } else {
            return { error: 'Diseño no encontrado para actualizar (simulado)' };
        }
    }
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
    if (isMockModeEnabled) {
        console.log('🎭 Mock Mode: Simulando eliminación de diseño ID:', id);
        const existingDesign = getMockDesignById(id);
        if (existingDesign) {
            revalidatePath('/admin/designs');
            return { success: true, message: "Diseño eliminado exitosamente (simulado)", data: existingDesign };
        } else {
            return { error: 'Diseño no encontrado para eliminar (simulado)' };
        }
    }
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
