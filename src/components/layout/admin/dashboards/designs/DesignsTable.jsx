import React from 'react';
import Link from 'next/link';

function DesignsTable({ designs }) {
  if (!designs || designs.length === 0) {
    return <p>No hay diseños para mostrar.</p>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Imagen
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Categoría
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Precio
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {designs.map((design) => (
            <tr key={design._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {design.imagen ? (
                  <img src={design.imagen} alt={design.nombre} className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                    No Img
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {design.nombre}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {design.categoria}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${typeof design.precio === 'number' ? design.precio.toFixed(2) : '0.00'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link href={`/admin/designs/editar/${design._id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                  Editar
                </Link>
                <button
                  onClick={() => console.log('Eliminar diseño:', design._id)} // Placeholder for delete action
                  className="text-red-600 hover:text-red-900"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DesignsTable;
