import React from 'react';
import BotonGeneral from './BotonGeneral'; // Import BotonGeneral

function BotonEliminar({ children, onClick, type = 'button', disabled = false, className = '' }) {
  return (
    <BotonGeneral
      onClick={onClick}
      type={type}
      disabled={disabled}
      variant="danger"
      className={`px-2 py-1 ml-2 ${className}`}
    >
      {children || "Eliminar"}
    </BotonGeneral>
  );
}

export default BotonEliminar
