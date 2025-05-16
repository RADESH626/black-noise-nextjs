// src/app/admin/elementos/editar/[id]/page.jsx
"use client"

import AdminFormPage from '@/components/layout/admin/AdminFormPage';
import FormEditarElemento from '@/components/layout/admin/elementos/forms/FormEditarElemento';

export default function EditarElementoPage({ params }) {
    const elementoId = params.id;

    return (
        <AdminFormPage
            title="Editar Elemento"
            breadcrumbs={[
                { name: 'Admin', href: '/admin' },
                { name: 'Elementos', href: '/admin/elementos' },
                { name: 'Editar Elemento', href: `/admin/elementos/editar/${elementoId}` }
            ]}
        >
            {elementoId ? (
                <FormEditarElemento elementoId={elementoId} />
            ) : (
                <p className="text-center text-red-500">ID de elemento no encontrado.</p>
            )}
        </AdminFormPage>
    );
}
