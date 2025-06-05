"use server";

<<<<<<< HEAD
export async function obtenerProveedores() {
    console.log('DEBUG: Entering obtenerProveedores.');
=======
import { mockProveedores, getMockProveedorByUsuarioId } from '@/data/mock/proveedores'; // Import mock data for providers
import { revalidatePath } from 'next/cache';
import { getServerSession } from "next-auth"; // To get user session for obtenerMiPerfilProveedor
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust path if necessary

const isMockModeEnabled = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

// Helper para generar IDs únicos (simulado)
const generateUniqueId = (prefix = 'mock') => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export async function obtenerProveedores() {
    console.log('DEBUG: Entering obtenerProveedores.');
    if (isMockModeEnabled) {
        console.log('🎭 Mock Mode: Obteniendo todos los proveedores mock.');
        return { proveedores: mockProveedores };
    }
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d
    try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/proveedores`;
        console.log('DEBUG: Making GET request to:', apiUrl);
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store', // No cachear esta petición
        });
        console.log('DEBUG: Fetch response received (ok:', response.ok, 'status:', response.status, ').');

        if (!response.ok) {
            const errorData = await response.json();
            console.error('DEBUG: API response not OK. Error data:', errorData);
            throw new Error(errorData.message || 'Error al obtener los proveedores.');
        }

        const proveedores = await response.json();
        console.log('DEBUG: Providers retrieved:', proveedores);
        return { proveedores };
    } catch (error) {
        console.error("ERROR in obtenerProveedores:", error);
        return { error: error.message };
    }
}

export async function obtenerMiPerfilProveedor() {
    console.log('DEBUG: Entering obtenerMiPerfilProveedor.');
<<<<<<< HEAD
=======
    if (isMockModeEnabled) {
        console.log('🎭 Mock Mode: Obteniendo perfil de proveedor mock. Saltando validación de sesión.');
        // In mock mode, we can return a default mock provider or the first one
        // For simplicity, let's return the first mock provider if available.
        const proveedor = mockProveedores[0]; 
        if (proveedor) {
            return { proveedor };
        }
        return { error: 'Perfil de proveedor no encontrado (simulado).' };
    }
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d
    try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/proveedores/mi-perfil`;
        console.log('DEBUG: Making GET request to:', apiUrl);
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });
        console.log('DEBUG: Fetch response received (ok:', response.ok, 'status:', response.status, ').');

        if (!response.ok) {
            const errorData = await response.json();
            console.error('DEBUG: API response not OK. Error data:', errorData);
            throw new Error(errorData.message || 'Error al obtener el perfil del proveedor.');
        }

        const proveedor = await response.json();
        console.log('DEBUG: Provider profile retrieved:', proveedor);
        return { proveedor };
    } catch (error) {
        console.error("ERROR in obtenerMiPerfilProveedor:", error);
        return { error: error.message };
    }
}

export async function actualizarPerfilProveedor(data) {
    console.log('DEBUG: Entering actualizarPerfilProveedor with data:', data);
<<<<<<< HEAD
=======
    if (isMockModeEnabled) {
        console.log('🎭 Mock Mode: Simulando actualización de perfil de proveedor. Saltando validación de sesión.');
        // In mock mode, we can simulate the update on a default mock provider
        const existingProveedor = mockProveedores[0]; // Assume we are updating the first mock provider
        if (existingProveedor) {
            const updatedProveedor = {
                ...existingProveedor,
                ...data,
                updatedAt: new Date().toISOString()
            };
            revalidatePath('/proveedor/editar-perfil'); // Revalidate path for UI consistency
            return { success: true, message: "Perfil de proveedor actualizado exitosamente (simulado).", proveedor: updatedProveedor };
        } else {
            return { error: 'Perfil de proveedor no encontrado para actualizar (simulado).' };
        }
    }
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d
    try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/proveedores/mi-perfil`;
        console.log('DEBUG: Making PUT request to:', apiUrl, 'with body:', data);
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        console.log('DEBUG: Fetch response received (ok:', response.ok, 'status:', response.status, ').');

        if (!response.ok) {
            const errorData = await response.json();
            console.error('DEBUG: API response not OK. Error data:', errorData);
            throw new Error(errorData.message || 'Error al actualizar el perfil del proveedor.');
        }

        const result = await response.json();
        console.log('DEBUG: Profile update result:', result);
        return { success: true, proveedor: result.proveedor };
    } catch (error) {
        console.error("ERROR in actualizarPerfilProveedor:", error);
        return { error: error.message };
    }
}
