"use server";

export async function obtenerSolicitudesProveedor() {
    console.log('DEBUG: Entering obtenerSolicitudesProveedor.');
    try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/solicitudes-proveedor`;
        console.log('DEBUG: Making GET request to:', apiUrl);
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            // No cachear esta petición para que siempre obtenga los datos más recientes
            cache: 'no-store', 
        });
        console.log('DEBUG: Fetch response received (ok:', response.ok, 'status:', response.status, ').');

        if (!response.ok) {
            const errorData = await response.json();
            console.error('DEBUG: API response not OK. Error data:', errorData);
            throw new Error(errorData.message || 'Error al obtener las solicitudes de proveedor.');
        }

        const solicitudes = await response.json();
        console.log('DEBUG: Provider requests retrieved:', solicitudes);
        return { solicitudes };
    } catch (error) {
        console.error("ERROR in obtenerSolicitudesProveedor:", error);
        return { error: error.message };
    }
}

export async function procesarSolicitudProveedor(solicitudId, action, adminNotas) {
    console.log('DEBUG: Entering procesarSolicitudProveedor with ID:', solicitudId, 'action:', action, 'adminNotas:', adminNotas);
    try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/solicitudes-proveedor/${solicitudId}`;
        console.log('DEBUG: Making PUT request to:', apiUrl, 'with body:', { action, adminNotas });
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action, adminNotas }),
        });
        console.log('DEBUG: Fetch response received (ok:', response.ok, 'status:', response.status, ').');

        if (!response.ok) {
            const errorData = await response.json();
            console.error('DEBUG: API response not OK. Error data:', errorData);
            throw new Error(errorData.message || `Error al ${action} la solicitud.`);
        }

        const data = await response.json();
        console.log('DEBUG: Process request result:', data);
        return { success: true, message: data.message };
    } catch (error) {
        console.error(`ERROR in procesarSolicitudProveedor (${action}):`, error);
        return { error: error.message };
    }
}
