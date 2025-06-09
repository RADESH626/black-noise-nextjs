import React from 'react';

function BotonAgregarProveedores({ children, ...props }) {
  return (
    <button {...props}>
      {children || "Agregar Proveedor"}
    </button>
  );
}

export default BotonAgregarProveedores;
