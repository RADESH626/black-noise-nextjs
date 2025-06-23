'use client';
import React, { useEffect, useState } from "react";
import SeccionHeader from '../secciones/acciones/SeccionHeader';
import { obtenerPedidos } from '@/app/acciones/PedidoActions';
import Loader from '@/components/Loader';

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
        const userEmail = pedido.userId?.email ? pedido.userId.email.toLowerCase() : '';
        const pedidoId = pedido._id.toLowerCase();
        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        const matchesSearchTerm = userEmail.includes(lowerCaseSearchTerm) || pedidoId.includes(lowerCaseSearchTerm);

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
    return <Loader />;
  }

  if (error) {
    return (
      <>
        <SeccionHeader>
          <h4 className='font-bold text-2xl' style={{ color: '#000000' }}>Gestión de Pedidos</h4>
        </SeccionHeader>
        <div className="min-h-full flex justify-center items-center" style={{ color: '#EF4444' }}>
          Error al cargar pedidos: {error.message}
        </div>
      </>
    );
  }

  if (pedidos.length === 0) {
    return (
      <>
        <SeccionHeader>
          <h4 className='font-bold text-2xl' style={{ color: '#000000' }}>Gestión de Pedidos</h4>
        </SeccionHeader>
        <div className="min-h-full flex justify-center items-center" style={{ color: '#9CA3AF' }}>
          No hay pedidos para mostrar.
        </div>
      </>
    );
  }

  return (
    <>
      <SeccionHeader>
        <h4 className='font-bold text-2xl' style={{ color: '#000000' }}>Gestión de Pedidos</h4>
      </SeccionHeader>

      <div className="mt-4 p-4 rounded-lg shadow-md flex flex-wrap gap-4" style={{ backgroundColor: '#FFFFFF' }}>
        <input
          type="text"
          placeholder="Buscar por usuario o ID de pedido"
          className="p-2 border rounded-md flex-grow"
          style={{
            borderColor: '#FFFFFFFF',
            backgroundColor: '#272525FF',
            color: '#FFFFFFFF'
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="date"
          className="p-2 border rounded-md"
          style={{
            borderColor: '#000000FF',
            backgroundColor: '#FFFFFFFF',
            color: '#000000FF'
          }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <span className="self-center" style={{ color: '#000000FF' }}>-</span>
        <input
          type="date"
          className="p-2 border rounded-md"
          style={{
            borderColor: '#000000FF',
            backgroundColor: '#FFFFFF',
            color: '#000000'
          }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-lg shadow-md mt-4" style={{ backgroundColor: '#FFFFFF' }}>
        <table className="min-w-full divide-y" style={{ borderColor: '#FFFFFFFF' }}>
          <thead style={{ backgroundColor: '#F9FAFB' }}>
            <tr>
              {['ID Pedido', 'Nombre Usuario', 'Email Usuario', 'Valor Total', 'Estado Pedido', 'Fecha Pedido'].map((title) => (
                <th
                  key={title}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: '#030303FF' }}
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody style={{ backgroundColor: '#FFFFFFFF', borderColor: '#E5E7EBFF' }}>
            {filteredPedidos.map((pedido) => (
              <tr key={pedido._id} style={{ borderBottom: '1px solid #000000FF' }}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: '#111827' }}>
                  {pedido._id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#6B7280' }}>
                  {pedido.userId ? pedido.userId.nombre : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#6B7280' }}>
                  {pedido.userId ? pedido.userId.email : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#50545CFF' }}>
                  ${typeof pedido.valorPedido === 'number' ? pedido.valorPedido.toFixed(2) : '0.00'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#50545CFF' }}>
                  {pedido.estadoPago}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#50545CFF' }}>
                  {pedido.createdAt ? new Date(pedido.createdAt).toLocaleDateString() : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
