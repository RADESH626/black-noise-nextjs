import React from 'react';
import AdminFormPage from '@/components/layout/admin/AdminFormPage';
import FormularioAgregarProveedor from '@/components/layout/admin/dashboards/proveedores/FormularioAgregarProveedor';

function AgregarProveedorPage() {
  return (
    <AdminFormPage
      title="Agregar Nuevo Proveedor"
      breadcrumbItems={[
        { name: "Inicio", href: "/admin" },
        { name: "Gestión de Proveedores", href: "/admin/proveedores" },
        { name: "Agregar Proveedor", href: "/admin/proveedores/agregar" },
      ]}
    >
      <FormularioAgregarProveedor />
    </AdminFormPage>
  );
}

export default AgregarProveedorPage;
