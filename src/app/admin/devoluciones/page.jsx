'use client'
import React, { useState, useEffect } from 'react';

const DevolucionesAdminPage = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  useEffect(() => {
    const fetchPedidos = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/administrador/pedidos');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPedidos(data);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  if (loading) {
    return <div>Cargando devoluciones...</div>;
  }

  if (error) {
    return <div>Error al cargar devoluciones: {error.message}</div>;
  }

  return (
    <div>
      <h1>Panel de Administración de Pedidos</h1>

      <div>
        <label>Filtrar por estado:</label>
        <select value={filter} onChange={handleFilterChange}>
          <option value="all">Todos</option>
          <option value="cancelado">Cancelados</option>
          <option value="activo">Activos</option>
        </select>
      </div>

      {pedidos.length === 0 ? (
        <p>No hay pedidos.</p>
      ) : (
        <ul>
          {pedidos
            .filter((pedido) => {
              if (filter === 'all') return true;
              if (filter === 'cancelado') return pedido.estadoPedido === 'CANCELADO';
              if (filter === 'activo') return pedido.estadoPedido !== 'CANCELADO';
              return true;
            })
            .map((pedido) => (
              <li key={pedido._id}>
                <p>Pedido ID: {pedido._id}</p>
                <p>Cliente: {pedido.userId?.nombre}</p>
                <p>Proveedor: {pedido.proveedorId?.nombre}</p>
                <p>Estado: {pedido.estadoPedido}</p>
                <p>Fecha del Pedido: {new Date(pedido.fechaPedido).toLocaleDateString()}</p>
                {/* Add more details here */}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default DevolucionesAdminPage;
