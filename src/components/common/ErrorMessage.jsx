import React from 'react';

function ErrorMessage({ message }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-red-500">
      <p className="text-lg font-semibold">Error: {message || "Ha ocurrido un error inesperado."}</p>
    </div>
  );
}

export default ErrorMessage;
