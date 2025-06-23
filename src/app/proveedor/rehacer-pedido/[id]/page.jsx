'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const RehacerPedidoPage = ({ params }) => {
  const router = useRouter();
  const { id } = React.use(params).id;
  const [pedido, setPedido] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [manufacturingCost, setManufacturingCost] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const fetchPedido = async (pedidoId) => {
      const { getPedidoById } = await import('@/app/acciones/PedidoActions');
      const pedidoData = await getPedidoById(pedidoId);
      setPedido(pedidoData);
      setManufacturingCost(pedidoData?.manufacturingCost || 0);
      setShippingCost(pedidoData?.shippingCost || 0);
      setDiscount(pedidoData?.discount || 0);
    };

    const fetchPedidos = async () => {
      const response = await fetch('/api/pedidos');
      const data = await response.json();
      setPedidos(data.pedidos);
      if (data.pedidos && data.pedidos.length > 0) {
        fetchPedido(data.pedidos[0]._id);
      }
    };

    fetchPedidos();
  }, []);

  if (!pedido) {
    return <div>Cargando...</div>;
  }

  const handleSave = async () => {
    try {
      const response = await fetch('/api/rehacer-pedido', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pedidoId: pedido._id,
          manufacturingCost: manufacturingCost,
          shippingCost: shippingCost,
          discount: discount,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Pedido creado correctamente:', data);
        // TODO: Redirect the user to the supplier's orders page or display a success message
      } else {
        console.error('Error al crear el pedido:', data);
        // TODO: Display an error message to the user
      }
    } catch (error) {
      console.error('Error al crear el pedido:', error);
      // TODO: Display an error message to the user
    }
  };

  const handleCancel = () => {
    router.push('/proveedor/pedidos');
  };

  return (
    <div>
      <h1>Rehacer Pedido</h1>
      <p>Pedido ID: {id}</p>

      <h2>Detalles del Pedido Original</h2>
      <p>Cliente: {pedido.clienteId}</p>
      {/* Display other order details here */}

      <h2>Costos del Nuevo Pedido</h2>
      <div>
        <label>Costo de Fabricación:</label>
        <input
          type="number"
          value={manufacturingCost}
          onChange={(e) => setManufacturingCost(parseFloat(e.target.value))}
        />
      </div>
      <div>
        <label>Costo de Envío:</label>
        <input
          type="number"
          value={shippingCost}
          onChange={(e) => setShippingCost(parseFloat(e.target.value))}
        />
      </div>
      <div>
        <label>Descuento:</label>
        <input
          type="number"
          value={discount}
          onChange={(e) => setDiscount(parseFloat(e.target.value))}
        />
      </div>

      <button onClick={handleSave}>Guardar Cambios</button>
      <button onClick={handleCancel}>Cancelar</button>
    </div>
  );
};

export default RehacerPedidoPage;
