// src/app/admin/designs/agregar/page.jsx
import AdminFormPage from '@/components/layout/admin/AdminFormPage';
import FormAgregarDesign from '@/components/layout/admin/designs/forms/FormAgregarDesign';

export default function AgregarDesignPage() {
    return (
        <AdminFormPage
            title="Agregar Nuevo Diseño"
            breadcrumbs={[
                { name: 'Admin', href: '/admin' },
                { name: 'Diseños', href: '/admin/designs' },
                { name: 'Agregar Diseño', href: '/admin/designs/agregar' }
            ]}
        >
            <FormAgregarDesign />
        </AdminFormPage>
    );
}
