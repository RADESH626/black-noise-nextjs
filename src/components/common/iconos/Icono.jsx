import React from 'react';

const iconMap = {
  'add-user': '/icons/icono-persona+.svg',
  'edit': '/icons/icono-editar.svg',
  'send-email': '/icons/icono-enviar-correo.svg',
  'person': '/icons/icono-persona.svg',
  // Add other icons as needed
};

function Icono({ name, alt, className, ...props }) {
  const src = iconMap[name];

  if (!src) {
    console.warn(`Icono: No se encontró el icono para el nombre: ${name}`);
    return null; // Or render a fallback icon
  }

  return (
    <img src={src} alt={alt || `icono ${name}`} className={className} {...props} />
  );
}

export default Icono;
