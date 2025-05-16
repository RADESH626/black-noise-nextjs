// src/app/admin/elementos/agregar/page.jsx
import AdminFormPage from '@/components/layout/admin/AdminFormPage';
import FormAgregarElemento from '@/components/layout/admin/elementos/forms/FormAgregarElemento';

export default function AgregarElementoPage() {
    return (
        <AdminFormPage
            title="Agregar Nuevo Elemento"
            breadcrumbs={[
                { name: 'Admin', href: '/admin' },
                { name: 'Elementos', href: '/admin/elementos' },
                { name: 'Agregar Elemento', href: '/admin/elementos/agregar' }
            ]}
        >
            <FormAgregarElemento />
        </AdminFormPage>
    );
}
