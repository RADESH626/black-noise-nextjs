"use server";

export async function obtenerProveedores() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/proveedores`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store', // No cachear esta petición
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener los proveedores.');
        }

        const proveedores = await response.json();
        return { proveedores };
    } catch (error) {
        console.error("Error en obtenerProveedores:", error);
        return { error: error.message };
    }
}

export async function obtenerMiPerfilProveedor() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/proveedores/mi-perfil`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener el perfil del proveedor.');
        }

        const proveedor = await response.json();
        return { proveedor };
    } catch (error) {
        console.error("Error en obtenerMiPerfilProveedor:", error);
        return { error: error.message };
    }
}

export async function actualizarPerfilProveedor(data) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/proveedores/mi-perfil`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al actualizar el perfil del proveedor.');
        }

        const result = await response.json();
        return { success: true, proveedor: result.proveedor };
    } catch (error) {
        console.error("Error en actualizarPerfilProveedor:", error);
        return { error: error.message };
    }
}
