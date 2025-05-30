// src/app/admin/designs/editar/[id]/page.jsx
"use client" // Necesario si se usan hooks como useParams o si el componente FormEditarDesign es cliente

import AdminFormPage from '@/components/admin/AdminFormPage';
import FormEditarDesign from '@/components/admin/designs/forms/FormEditarDesign';
// import { useParams } from 'next/navigation'; // Alternativa para obtener el id en el cliente

export default function EditarDesignPage({ params }) {
    // const params = useParams(); // Si prefieres obtener el id del lado del cliente
    const designId = params.id;

    return (
        <AdminFormPage
            title="Editar Diseño"
            breadcrumbs={[
                { name: 'Admin', href: '/admin' },
                { name: 'Diseños', href: '/admin/designs' },
                { name: 'Editar Diseño', href: `/admin/designs/editar/${designId}` }
            ]}
        >
            {designId ? (
                <FormEditarDesign designId={designId} />
            ) : (
                <p className="text-center text-red-500">ID de diseño no encontrado.</p>
            )}
        </AdminFormPage>
    );
}
