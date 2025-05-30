// src/app/admin/pedidos/editar/[id]/page.jsx
"use client"

import AdminFormPage from '@/components/admin/AdminFormPage';
import FormEditarPedido from '@/components/admin/pedidos/forms/FormEditarPedido';

export default function EditarPedidoPage({ params }) {
    const pedidoId = params.id;

    return (
        <AdminFormPage
            title="Editar Pedido"
            breadcrumbs={[
                { name: 'Admin', href: '/admin' },
                { name: 'Pedidos', href: '/admin/pedidos' },
                { name: 'Editar Pedido', href: `/admin/pedidos/editar/${pedidoId}` }
            ]}
        >
            {pedidoId ? (
                <FormEditarPedido pedidoId={pedidoId} />
            ) : (
                <p className="text-center text-red-500">ID de pedido no encontrado.</p>
            )}
        </AdminFormPage>
    );
}
