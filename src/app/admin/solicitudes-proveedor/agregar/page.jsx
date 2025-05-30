import React from 'react';
import AdminFormPage from '@/components/admin/AdminFormPage';
import FormAgregarSolicitudProveedor from '@/components/admin/solicitudes-proveedor/forms/FormAgregarSolicitudProveedor';

const AgregarSolicitudProveedorPage = () => {
  return (
    <AdminFormPage title="Agregar Solicitud de Proveedor">
      <FormAgregarSolicitudProveedor />
    </AdminFormPage>
  );
};

export default AgregarSolicitudProveedorPage;
