import React from 'react';
import Link from 'next/link';
import BotonGeneral from '@/components/common/botones/BotonGeneral';

function DesignsTable({ designs }) {
  if (!designs || designs.length === 0) {
    return <p>No hay diseños para mostrar.</p>;
  }

  return (
    <div
      className="overflow-x-auto rounded-lg shadow-md"
      style={{ backgroundColor: '#FFFFFF' }} // bg-white
    >
      <table className="min-w-full divide-y" style={{ borderColor: '#E5E7EB' /* divide-gray-200 */ }}>
        <thead style={{ backgroundColor: '#F9FAFB' /* bg-gray-50 */ }}>
          <tr>
            {['Imagen', 'Nombre', 'Categoría', 'Precio', 'Acciones'].map((title) => (
              <th
                key={title}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: '#000000FF' /* text-gray-500 */ }}
              >
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody style={{ backgroundColor: '#FFFFFF' /* bg-white */, borderColor: '#E5E7EB' }}>
          {designs.map((design) => (
            <tr key={design._id} style={{ borderBottom: '1px solid #000000FF' /* divide-gray-200 */ }}>
              <td className="px-6 py-4 whitespace-nowrap">
                {design.imagen ? (
                  <img
                    src={design.imagen}
                    alt={design.nombre}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: '#E5E7EB', // bg-gray-200
                      color: '#6B7280', // text-gray-500
                    }}
                  >
                    No Img
                  </div>
                )}
              </td>
              <td
                className="px-6 py-4 whitespace-nowrap text-sm font-medium"
                style={{ color: '#000000FF' /* text-gray-900 */ }}
              >
                {design.nombre}
              </td>
              <td
                className="px-6 py-4 whitespace-nowrap text-sm"
                style={{ color: '#000000FF' /* text-gray-500 */ }}
              >
                {design.categoria}
              </td>
              <td
                className="px-6 py-4 whitespace-nowrap text-sm"
                style={{ color: '#000000FF' /* text-gray-500 */ }}
              >
                ${typeof design.precio === 'number' ? design.precio.toFixed(2) : '0.00'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <BotonGeneral
                  onClick={() => console.log('Editar diseño:', design._id)} // Assuming this will navigate or open a modal
                  variant="info"
                  className="mr-4"
                >
                  Editar
                </BotonGeneral>
                <BotonGeneral
                  onClick={() => console.log('Eliminar diseño:', design._id)}
                  variant="danger"
                >
                  Eliminar
                </BotonGeneral>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DesignsTable;
