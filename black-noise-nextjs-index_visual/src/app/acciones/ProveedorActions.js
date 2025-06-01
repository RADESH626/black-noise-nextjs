"use server";

export async function obtenerProveedores() {
    console.log('DEBUG: Entering obtenerProveedores.');
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
