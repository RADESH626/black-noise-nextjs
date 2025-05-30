// src/app/admin/ventas/editar/[id]/page.jsx
"use client"

import AdminFormPage from '@/components/admin/AdminFormPage';
import FormEditarVenta from '@/components/admin/ventas/forms/FormEditarVenta';

export default function EditarVentaPage({ params }) {
    const ventaId = params.id;

    return (
        <AdminFormPage
            title="Editar Venta"
            breadcrumbs={[
                { name: 'Admin', href: '/admin' },
                { name: 'Ventas', href: '/admin/ventas' },
                { name: 'Editar Venta', href: `/admin/ventas/editar/${ventaId}` }
            ]}
        >
            {ventaId ? (
                <FormEditarVenta ventaId={ventaId} />
            ) : (
                <p className="text-center text-red-500">ID de venta no encontrado.</p>
            )}
        </AdminFormPage>
    );
}
