'use client';
import React, { useEffect, useState } from "react";
import SeccionHeader from '../secciones/acciones/SeccionHeader';
import { obtenerPedidos } from '@/app/acciones/PedidoActions'; // Import the action to get all orders

export default function PedidosDashboard() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredPedidos, setFilteredPedidos] = useState([]);

  useEffect(() => {
    const fetchPedidos = async () => {
      setLoading(true);
      setError(null);
      const { pedidos: fetchedPedidos, error: fetchError } = await obtenerPedidos();
      if (fetchError) {
        setError({ message: fetchError });
        setPedidos([]);
      } else {
        setPedidos(fetchedPedidos || []);
      }
      setLoading(false);
    };

    fetchPedidos();
  }, []);

  useEffect(() => {
    const filterPedidos = () => {
      const filtered = pedidos.filter(pedido => {
        const matchesSearchTerm = pedido.userId?.email.toLowerCase().includes(searchTerm.toLowerCase()) || pedido._id.toLowerCase().includes(searchTerm.toLowerCase());

        const pedidoDate = new Date(pedido.createdAt);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        const matchesDateRange = (!start || pedidoDate >= start) && (!end || pedidoDate <= end);

        return matchesSearchTerm && matchesDateRange;
      });
      setFilteredPedidos(filtered);
    };

    filterPedidos();
  }, [pedidos, searchTerm, startDate, endDate]);

  if (loading) {
    return (
      <>
        <SeccionHeader>
          <h4 className='font-bold text-2xl text-black'>Gestión de Pedidos</h4>
        </SeccionHeader>
        <div className="min-h-full flex justify-center items-center text-gray-400">
          Cargando pedidos...
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <SeccionHeader>
          <h4 className='font-bold text-2xl text-black'>Gestión de Pedidos</h4>
        </SeccionHeader>
        <div className="min-h-full flex justify-center items-center text-red-500">
          Error al cargar pedidos: {error.message}
        </div>
      </>
    );
  }

  if (pedidos.length === 0) {
    return (
      <>
        <SeccionHeader>
          <h4 className='font-bold text-2xl text-black'>Gestión de Pedidos</h4>
        </SeccionHeader>
        <div className="min-h-full flex justify-center items-center text-gray-400">
          No hay pedidos para mostrar.
        </div>
      </>
    );
  }

  return (
    <>
      <SeccionHeader>
        <h4 className='font-bold text-2xl text-black'>Gestión de Pedidos</h4>
      </SeccionHeader>
      <div className="mt-4 p-4 bg-white rounded-lg shadow-md flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Buscar por usuario o ID de pedido"
          className="p-2 border border-gray-300 rounded-md flex-grow"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="date"
          className="p-2 border border-gray-300 rounded-md"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <span className="self-center text-gray-500">-</span>
        <input
          type="date"
          className="p-2 border border-gray-300 rounded-md"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow-md mt-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID Pedido
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor Total
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado Pedido
              </th>
              {/* Add more headers for other relevant fields */}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPedidos.map((pedido) => (
              <tr key={pedido._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {pedido._id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {pedido.userId ? pedido.userId.email : 'N/A'} {/* Display user email */}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${typeof pedido.valorPedido === 'number' ? pedido.valorPedido.toFixed(2) : '0.00'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {pedido.estadoPago}
                </td>
                {/* Add more cells for other relevant fields */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
