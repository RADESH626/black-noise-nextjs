import React from 'react';
import BotonGeneral from './BotonGeneral'; // Import BotonGeneral

function BotonAgregarProveedores({ children, onClick, type = 'button', disabled = false, className = '' }) {
  return (
    <BotonGeneral
      onClick={onClick}
      type={type}
      disabled={disabled}
      variant="primary"
      className={className}
    >
      {children || "Agregar Proveedor"}
    </BotonGeneral>
  );
}

export default BotonAgregarProveedores;
