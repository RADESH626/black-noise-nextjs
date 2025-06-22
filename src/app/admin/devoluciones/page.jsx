'use client'
import React, { useState, useEffect } from 'react';

const DevolucionesAdminPage = () => {
  const [devoluciones, setDevoluciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDevoluciones = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/admin/devoluciones');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDevoluciones(data);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchDevoluciones();
  }, []);

  if (loading) {
    return <div>Cargando devoluciones...</div>;
  }

  if (error) {
    return <div>Error al cargar devoluciones: {error.message}</div>;
  }

  return (
    <div>
      <h1>Solicitudes de Devolución</h1>
      {devoluciones.length === 0 ? (
        <p>No hay solicitudes de devolución.</p>
      ) : (
        <ul>
          {devoluciones.map((devolucion) => (
            <li key={devolucion._id}>
              <p>Pedido ID: {devolucion.pedidoId}</p>
              <p>Razón: {devolucion.motivo_devolucion}</p>
              {/* Add more details here */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DevolucionesAdminPage;
