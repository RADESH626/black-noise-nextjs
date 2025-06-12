import React from 'react';
import { Boton } from './Boton';

function BotonAgregarProveedores({ children, ...props }) {
  return (
    <Boton {...props}>
      {children || "Agregar Proveedor"}
    </Boton>
  );
}

export default BotonAgregarProveedores;
