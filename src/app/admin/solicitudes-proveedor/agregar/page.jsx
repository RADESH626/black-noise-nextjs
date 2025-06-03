import React from 'react';
import AdminFormPage from '@/components/layout/admin/AdminFormPage';
import FormAgregarSolicitudProveedor from '@/components/layout/admin/solicitudes-proveedor/forms/FormAgregarSolicitudProveedor';

const AgregarSolicitudProveedorPage = () => {
  return (
    <AdminFormPage title="Agregar Solicitud de Proveedor">
      <FormAgregarSolicitudProveedor />
    </AdminFormPage>
  );
};

export default AgregarSolicitudProveedorPage;
