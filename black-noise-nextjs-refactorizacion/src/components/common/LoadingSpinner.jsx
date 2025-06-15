import React from 'react';

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      <p className="ml-4 text-lg">Cargando...</p>
    </div>
  );
}

export default LoadingSpinner;
