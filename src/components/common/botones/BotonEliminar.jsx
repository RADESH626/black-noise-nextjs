<<<<<<< HEAD
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
=======
import React from 'react'

function BotonEliminar() {
  return (
    <button className="bg-red-500 text-white px-2 py-1 rounded ml-2">Deshabilitar</button>
  )
}

export default BotonEliminar
>>>>>>> db35ad5 (diseños login y registro)
