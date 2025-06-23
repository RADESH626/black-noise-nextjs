import React from 'react';
import BotonGeneral from './BotonGeneral'; // Import BotonGeneral

function BotonAgregarDesigns({ children, onClick, type = 'button', disabled = false, className = '' }) {
  return (
    <BotonGeneral
      onClick={onClick}
      type={type}
      disabled={disabled}
      variant="primary"
      className={`px-4 py-2 ${className}`}
    >
      {children || "Agregar Diseño"}
    </BotonGeneral>
  );
}

export default BotonAgregarDesigns;
