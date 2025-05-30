// src/app/admin/proveedores/editar/[id]/page.jsx
"use client"

import AdminFormPage from '@/components/layout/admin/AdminFormPage';
import FormEditarProveedor from '@/components/layout/admin/proveedores/forms/FormEditarProveedor';

export default function EditarProveedorPage({ params }) {
    const proveedorId = params.id;

    return (
        <AdminFormPage
            title="Editar Proveedor"
            breadcrumbs={[
                { name: 'Admin', href: '/admin' },
                { name: 'Proveedores', href: '/admin/proveedores' },
                { name: 'Editar Proveedor', href: `/admin/proveedores/editar/${proveedorId}` }
            ]}
        >
            {proveedorId ? (
                <FormEditarProveedor proveedorId={proveedorId} />
            ) : (
                <p className="text-center text-red-500">ID de proveedor no encontrado.</p>
            )}
        </AdminFormPage>
    );
}
