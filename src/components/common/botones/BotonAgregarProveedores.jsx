import React from 'react';
<<<<<<< HEAD
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
=======

function BotonAgregarProveedores({ children, ...props }) {
  return (
    <button {...props}>
      {children || "Agregar Proveedor"}
    </button>
>>>>>>> db35ad5 (diseños login y registro)
  );
}

export default BotonAgregarProveedores;
