// src/app/admin/pedidos/agregar/page.jsx
import AdminFormPage from '@/components/layout/admin/AdminFormPage';
import FormAgregarPedido from '@/components/layout/admin/pedidos/forms/FormAgregarPedido';

export default function AgregarPedidoPage() {
    return (
        <AdminFormPage
            title="Crear Nuevo Pedido"
            breadcrumbs={[
                { name: 'Admin', href: '/admin' },
                { name: 'Pedidos', href: '/admin/pedidos' },
                { name: 'Crear Pedido', href: '/admin/pedidos/agregar' }
            ]}
        >
            <FormAgregarPedido />
        </AdminFormPage>
    );
}
