"use server";

import connectDB from '@/utils/DBconection';
import Proveedor from '@/models/Proveedor';
import { revalidatePath } from 'next/cache';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Assuming this path is correct for session

export async function obtenerProveedores() {
    console.log('DEBUG: Entering obtenerProveedores.');
    try {
        await connectDB();
        const proveedores = await Proveedor.find();
        console.log('DEBUG: Providers retrieved:', proveedores);
        return { proveedores: JSON.parse(JSON.stringify(proveedores)) }; // Serialize for Next.js Server Actions
    } catch (error) {
        console.error("ERROR in obtenerProveedores:", error);
        return { error: error.message };
    }
}

export async function obtenerMiPerfilProveedor() {
    console.log('DEBUG: Entering obtenerMiPerfilProveedor.');
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.id) {
            return { error: 'No autenticado o ID de usuario no disponible.' };
        }

        await connectDB();
        const proveedor = await Proveedor.findOne({ usuarioId: session.user.id });
        if (!proveedor) {
            return { error: 'Perfil de proveedor no encontrado.' };
        }
        console.log('DEBUG: Provider profile retrieved:', proveedor);
        return { proveedor: JSON.parse(JSON.stringify(proveedor)) }; // Serialize
    } catch (error) {
        console.error("ERROR in obtenerMiPerfilProveedor:", error);
        return { error: error.message };
    }
}

export async function actualizarPerfilProveedor(data) {
    console.log('DEBUG: Entering actualizarPerfilProveedor with data:', data);
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.id) {
            return { error: 'No autenticado o ID de usuario no disponible para actualizar.' };
        }

        await connectDB();
        const updatedProveedor = await Proveedor.findOneAndUpdate(
            { usuarioId: session.user.id },
            data,
            { new: true, runValidators: true }
        );

        if (!updatedProveedor) {
            return { error: 'Perfil de proveedor no encontrado para actualizar.' };
        }
        console.log('DEBUG: Profile update result:', updatedProveedor);
        revalidatePath('/proveedor/editar-perfil'); // Revalidate path for UI consistency
        revalidatePath('/admin/proveedores'); // Revalidate admin list as well
        return { success: true, proveedor: JSON.parse(JSON.stringify(updatedProveedor)) }; // Serialize
    } catch (error) {
        console.error("ERROR in actualizarPerfilProveedor:", error);
        return { error: error.message };
    }
}

export async function crearProveedor(data) {
    console.log('DEBUG: Entering crearProveedor with data:', data);
    try {
        await connectDB();
        const nuevoProveedor = new Proveedor(data);
        const proveedorGuardado = await nuevoProveedor.save();
        console.log('DEBUG: New provider created:', proveedorGuardado);
        revalidatePath('/admin/proveedores'); // Revalidate path for UI consistency
        return { success: true, proveedor: JSON.parse(JSON.stringify(proveedorGuardado)) }; // Serialize
    } catch (error) {
        console.error("ERROR in crearProveedor:", error);
        // Check for duplicate key error (e.g., unique nit)
        if (error.code === 11000) {
            return { error: 'Ya existe un proveedor con este NIT.' };
        }
        return { error: error.message };
    }
}

export async function eliminarProveedor(id) {
    console.log('DEBUG: Entering eliminarProveedor with ID:', id);
    try {
        await connectDB();
        const result = await Proveedor.findByIdAndDelete(id);
        if (!result) {
            return { error: 'Proveedor no encontrado para eliminar.' };
        }
        console.log('DEBUG: Provider deleted:', result);
        revalidatePath('/admin/proveedores'); // Revalidate path for UI consistency
        return { success: true, message: 'Proveedor eliminado exitosamente.' };
    } catch (error) {
        console.error("ERROR in eliminarProveedor:", error);
        return { error: error.message };
    }
}

export async function obtenerProveedorPorId(id) {
    console.log('DEBUG: Entering obtenerProveedorPorId with ID:', id);
    try {
        await connectDB();
        const proveedor = await Proveedor.findById(id);
        if (!proveedor) {
            return { error: 'Proveedor no encontrado.' };
        }
        console.log('DEBUG: Provider found by ID:', proveedor);
        return { proveedor: JSON.parse(JSON.stringify(proveedor)) }; // Serialize
    } catch (error) {
        console.error("ERROR in obtenerProveedorPorId:", error);
        return { error: error.message };
    }
}

export async function actualizarProveedor(id, data) {
    console.log('DEBUG: Entering actualizarProveedor with ID:', id, 'and data:', data);
    try {
        await connectDB();
        const updatedProveedor = await Proveedor.findByIdAndUpdate(
            id,
            data,
            { new: true, runValidators: true }
        );
        if (!updatedProveedor) {
            return { error: 'Proveedor no encontrado para actualizar.' };
        }
        console.log('DEBUG: Provider updated:', updatedProveedor);
        revalidatePath('/admin/proveedores'); // Revalidate path for UI consistency
        return { success: true, proveedor: JSON.parse(JSON.stringify(updatedProveedor)) }; // Serialize
    } catch (error) {
        console.error("ERROR in actualizarProveedor:", error);
        if (error.code === 11000) {
            return { error: 'Ya existe un proveedor con este NIT.' };
        }
        return { error: error.message };
    }
}
