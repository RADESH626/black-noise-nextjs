"use client";

import { useState } from 'react';

export default function FormFiltrarPagos({ initialPagosFromPage }) {
  const [pagos, setPagos] = useState(initialPagosFromPage || []);

  return (
    <div className="p-4 bg-gray-500 rounded-lg shadow-md">
      <h5 className="text-black font-semibold mb-4">Filtrar Pagos (Placeholder)</h5>
      <p>Este es un componente de filtro de pagos de marcador de posición.</p>
      {/* Display initial pagos for now */}
      {pagos.length > 0 ? (
        <ul>
          {pagos.map((pago, index) => (
            <li key={pago.id || index}>{pago.amount} - {pago.date}</li>
          ))}
        </ul>
      ) : (
        <p>No hay pagos para mostrar.</p>
      )}
    </div>
  );
}
