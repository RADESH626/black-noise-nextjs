'use client';
import React, { useState, useEffect } from 'react';

const DevolucionesProveedor = () => {
  const [cancelaciones, setCancelaciones] = useState([]);
  const [devoluciones, setDevoluciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCancelacionesDevoluciones = async () => {
      setLoading(true);
      setError(null);
      try {
        const cancelacionesResponse = await fetch('/api/proveedor/cancellations');
        if (!cancelacionesResponse.ok) {
          throw new Error(`HTTP error! status: ${cancelacionesResponse.status}`);
        }
        const cancelacionesData = await cancelacionesResponse.json();
        setCancelaciones(cancelacionesData);

        const devolucionesResponse = await fetch('/api/proveedor/returns');
        if (!devolucionesResponse.ok) {
          throw new Error(`HTTP error! status: ${devolucionesResponse.status}`);
        }
        const devolucionesData = await devolucionesResponse.json();
        setDevoluciones(devolucionesData);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchCancelacionesDevoluciones();
  }, []);

  if (loading) {
    return <div>Cargando cancelaciones y devoluciones...</div>;
  }

  if (error) {
    return <div>Error al cargar cancelaciones y devoluciones: {error.message}</div>;
  }

  return (
    <div>
      <h1>Cancelaciones y Devoluciones</h1>

      <h2>Cancelaciones</h2>
      {cancelaciones.length === 0 ? (
        <p>No hay cancelaciones.</p>
      ) : (
        <ul>
          {cancelaciones.map((cancelacion) => (
            <li key={cancelacion._id}>
              <p>Pedido ID: {cancelacion._id}</p>
              <p>Cliente: {cancelacion.userId?.nombre}</p>
              {/* Add more details here */}
            </li>
          ))}
        </ul>
      )}

      <h2>Devoluciones</h2>
      {devoluciones.length === 0 ? (
        <p>No hay devoluciones.</p>
      ) : (
        <ul>
          {devoluciones.map((devolucion) => (
            <li key={devolucion._id}>
              <p>Pedido ID: {devolucion._id}</p>
              <p>Cliente: {devolucion.userId?.nombre}</p>
              <p>Razón: {devolucion.motivo_devolucion}</p>
              {/* Add more details here */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DevolucionesProveedor;
