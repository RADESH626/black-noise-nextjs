// src/app/admin/pagos/editar/[id]/page.jsx
"use client"

import AdminFormPage from '@/components/layout/admin/AdminFormPage';
import FormEditarPago from '@/components/layout/admin/pagos/forms/FormEditarPago';

export default function EditarPagoPage({ params }) {
    const pagoId = params.id;

    return (
        <AdminFormPage
            title="Editar Pago"
            breadcrumbs={[
                { name: 'Admin', href: '/admin' },
                { name: 'Pagos', href: '/admin/pagos' },
                { name: 'Editar Pago', href: `/admin/pagos/editar/${pagoId}` }
            ]}
        >
            {pagoId ? (
                <FormEditarPago pagoId={pagoId} />
            ) : (
                <p className="text-center text-red-500">ID de pago no encontrado.</p>
            )}
        </AdminFormPage>
    );
}
