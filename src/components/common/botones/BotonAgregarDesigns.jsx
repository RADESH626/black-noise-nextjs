import React from 'react';
<<<<<<< HEAD
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
=======

function BotonAgregarDesigns() {
  return (
    <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
      Agregar Diseño
    </button>
>>>>>>> db35ad5 (diseños login y registro)
  );
}

export default BotonAgregarDesigns;
