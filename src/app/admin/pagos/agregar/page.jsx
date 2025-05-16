// src/app/admin/pagos/agregar/page.jsx
import AdminFormPage from '@/components/layout/admin/AdminFormPage';
import FormAgregarPago from '@/components/layout/admin/pagos/forms/FormAgregarPago';

export default function AgregarPagoPage() {
    return (
        <AdminFormPage
            title="Registrar Nuevo Pago"
            breadcrumbs={[
                { name: 'Admin', href: '/admin' },
                { name: 'Pagos', href: '/admin/pagos' },
                { name: 'Registrar Pago', href: '/admin/pagos/agregar' }
            ]}
        >
            <FormAgregarPago />
        </AdminFormPage>
    );
}
