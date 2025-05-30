// src/app/admin/proveedores/agregar/page.jsx
import AdminFormPage from '@/components/admin/AdminFormPage';
import FormAgregarProveedor from '@/components/admin/proveedores/forms/FormAgregarProveedor';

export default function AgregarProveedorPage() {
    return (
        <AdminFormPage
            title="Registrar Nuevo Proveedor"
            breadcrumbs={[
                { name: 'Admin', href: '/admin' },
                { name: 'Proveedores', href: '/admin/proveedores' },
                { name: 'Registrar Proveedor', href: '/admin/proveedores/agregar' }
            ]}
        >
            <FormAgregarProveedor />
        </AdminFormPage>
    );
}
