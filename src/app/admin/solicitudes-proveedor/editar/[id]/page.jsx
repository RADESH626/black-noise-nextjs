// src/app/admin/solicitudes-proveedor/editar/[id]/page.jsx
"use client"

import AdminFormPage from '@/components/admin/AdminFormPage';
import FormEditarSolicitudProveedor from '@/components/admin/solicitudes-proveedor/forms/FormEditarSolicitudProveedor';

export default function EditarSolicitudProveedorPage({ params }) {
    const solicitudId = params.id;

    return (
        <AdminFormPage
            title="Revisar Solicitud de Proveedor"
            breadcrumbs={[
                { name: 'Admin', href: '/admin' },
                { name: 'Solicitudes de Proveedor', href: '/admin/solicitudes-proveedor' },
                { name: 'Revisar Solicitud', href: `/admin/solicitudes-proveedor/editar/${solicitudId}` }
            ]}
        >
            {solicitudId ? (
                <FormEditarSolicitudProveedor solicitudId={solicitudId} />
            ) : (
                <p className="text-center text-red-500">ID de solicitud no encontrado.</p>
            )}
        </AdminFormPage>
    );
}
