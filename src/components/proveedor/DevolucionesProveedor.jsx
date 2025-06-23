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
        console.log('cancelacionesData:', cancelacionesData);
        setCancelaciones(cancelacionesData);

        const devolucionesResponse = await fetch('/api/proveedor/returns');
        if (!devolucionesResponse.ok) {
          throw new Error(`HTTP error! status: ${devolucionesResponse.status}`);
        }
        const devolucionesData = await devolucionesResponse.json();
        setDevoluciones(devolucionesData);
        console.log('devolucionesData:', devolucionesData);
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
              <p>Cliente: {cancelacion.userId ? cancelacion.userId.nombre : 'N/A'}</p>
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
              <p>Estado del Pedido: {devolucion.estadoPedido}</p>
              <p>Fecha de Solicitud: {devolucion.createdAt}</p>
              <button onClick={() => handleAprobarDevolucion(devolucion._id)}>Aprobar Devolución</button>
              <button onClick={() => handleRechazarDevolucion(devolucion._id)}>Rechazar Devolución</button>
              <button onClick={() => handleRehacerPedido(devolucion._id)}>Rehacer Pedido</button>
              {/* Add more details here */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const handleAprobarDevolucion = async (pedidoId) => {
  console.log('Aprobar Devolución', pedidoId);
  try {
    const result = await updateEstadoPedido(pedidoId, 'DEVOLUCION_APROBADA');
    if (result.success) {
      alert('Devolución aprobada correctamente.');
      // Refresh the page
      window.location.reload();
    } else {
      alert('Error al aprobar la devolución: ' + result.message);
    }
  } catch (error) {
    console.error('Error al aprobar la devolución:', error);
    alert('Error al aprobar la devolución: ' + error.message);
  }
};

import { useDialog } from '@/context/DialogContext';

const handleRechazarDevolucion = (pedidoId) => {
  console.log('Rechazar Devolución', pedidoId);
  const { openModal } = useDialog();

  openModal(
    'Rechazar Devolución',
    <div>
      <p>Por favor, ingrese el motivo del rechazo:</p>
      <textarea id="motivoRechazo" />
    </div>,
    'default',
    async () => {
      const motivoRechazo = document.getElementById('motivoRechazo').value;
      if (motivoRechazo) {
        try {
          const response = await fetch(`/api/proveedor/returns/${pedidoId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              estadoPedido: 'DEVOLUCION_RECHAZADA',
              motivoRechazo: motivoRechazo,
            }),
          });

          if (response.ok) {
            alert('Devolución rechazada correctamente.');
            window.location.reload();
          } else {
            const errorData = await response.json();
            alert('Error al rechazar la devolución: ' + errorData.message);
          }
        } catch (error) {
          console.error('Error al rechazar la devolución:', error);
          alert('Error al rechazar la devolución: ' + error.message);
        }
      } else {
        alert('Por favor, ingrese el motivo del rechazo.');
      }
    },
    () => { },
    true,
    'Rechazar',
    'Cancelar'
  );
};

import { useRouter } from 'next/navigation';

const handleRehacerPedido = (pedidoId) => {
  console.log('Rehacer Pedido', pedidoId);
  const router = useRouter();
  router.push(`/proveedor/rehacer-pedido/${pedidoId}`);
};

export default DevolucionesProveedor;
