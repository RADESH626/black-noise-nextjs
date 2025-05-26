"use server";

export async function obtenerSolicitudesProveedor() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/solicitudes-proveedor`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            // No cachear esta petición para que siempre obtenga los datos más recientes
            cache: 'no-store', 
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener las solicitudes de proveedor.');
        }

        const solicitudes = await response.json();
        return { solicitudes };
    } catch (error) {
        console.error("Error en obtenerSolicitudesProveedor:", error);
        return { error: error.message };
    }
}

export async function procesarSolicitudProveedor(solicitudId, action, adminNotas) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/solicitudes-proveedor/${solicitudId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action, adminNotas }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error al ${action} la solicitud.`);
        }

        const data = await response.json();
        return { success: true, message: data.message };
    } catch (error) {
        console.error(`Error en procesarSolicitudProveedor (${action}):`, error);
        return { error: error.message };
    }
}
