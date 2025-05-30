// src/app/admin/ventas/agregar/page.jsx
import AdminFormPage from '@/components/layout/admin/AdminFormPage';
import FormAgregarVenta from '@/components/layout/admin/ventas/forms/FormAgregarVenta';

export default function AgregarVentaPage() {
    return (
        <AdminFormPage
            title="Registrar Nueva Venta"
            breadcrumbs={[
                { name: 'Admin', href: '/admin' },
                { name: 'Ventas', href: '/admin/ventas' },
                { name: 'Registrar Venta', href: '/admin/ventas/agregar' }
            ]}
        >
            <FormAgregarVenta />
        </AdminFormPage>
    );
}
