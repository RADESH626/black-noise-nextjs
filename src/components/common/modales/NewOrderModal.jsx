import React, { useState, useEffect } from 'react';
import { obtenerDesignsPorUsuarioId } from '../../../../src/app/acciones/DesignActions';
import { guardarPedido } from '../../../../src/app/acciones/PedidoActions';
import { useUser } from '../../../../src/context/UserContext';

const NewOrderModal = ({ onClose }) => {
  const { user, loading: userLoading } = useUser();
  const [designs, setDesigns] = useState([]);
  const [selectedDesigns, setSelectedDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userLoading) return;

    const fetchDesigns = async () => {
      if (!user || !user._id) {
        setError('Usuario no autenticado. No se pueden cargar los diseños.');
        setLoading(false);
        return;
      }
      try {
        const { designs: userDesigns, error: fetchError } = await obtenerDesignsPorUsuarioId(user._id);
        if (fetchError) {
          setError(fetchError);
        } else {
          setDesigns(userDesigns);
        }
      } catch (err) {
        setError('Error al cargar los diseños.');
        console.error('Error fetching designs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDesigns();
  }, [user, userLoading]);

  const handleDesignSelect = (designId) => {
    setSelectedDesigns((prevSelected) =>
      prevSelected.includes(designId)
        ? prevSelected.filter((id) => id !== designId)
        : [...prevSelected, designId]
    );
  };

  const sendOrderConfirmationEmail = async (email, orderDetails) => {
    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          subject: 'Confirmación de Pedido Black Noise',
          body: `
            Hola ${user.name || 'usuario'},
            
            Tu pedido ha sido registrado exitosamente con los siguientes detalles:
            
            ID de Pedido: ${orderDetails._id || 'N/A'}
            Fecha del Pedido: ${new Date(orderDetails.fechaPedido).toLocaleDateString()}
            Estado: ${orderDetails.estado}
            Total: $${orderDetails.total}
            
            Diseños seleccionados:
            ${orderDetails.detallesPedido.map(detail => `- ${detail}`).join('\n')}
            
            Fecha estimada de entrega: ${new Date(orderDetails.fechaEstimadaEntrega).toLocaleDateString()}
            
            Gracias por tu compra en Black Noise!
            
            Saludos,
            El equipo de Black Noise
          `,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error('Error sending email:', data.message);
      } else {
        console.log('Email sent successfully (simulated):', data.message);
      }
    } catch (emailError) {
      console.error('Error sending order confirmation email:', emailError);
    }
  };

  const handleSaveOrder = async () => {
    if (selectedDesigns.length === 0 || saving) return;

    setSaving(true);
    setError(null);

    try {
      const selectedDesignObjects = designs.filter(d => selectedDesigns.includes(d._id));
      const total = selectedDesignObjects.reduce((sum, design) => sum + (design.price || 0), 0);
      const detallesPedido = selectedDesignObjects.map(design => design.name);

      // Placeholder for proveedorId and fechaEstimadaEntrega
      // In a real application, you might fetch a default supplier or allow selection.
      const now = new Date();
      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(now.getDate() + 7); // 7 days from now

      const newOrderData = {
        usuarioId: user._id,
        fechaPedido: now.toISOString(),
        estado: 'Pendiente',
        total: total,
        detallesPedido: detallesPedido,
        designIds: selectedDesigns, // Corrected from diseñosSeleccionados
        proveedorId: '60d5ec49f8c7b7001c8e4d5a', // Placeholder: Replace with actual supplier ID or logic
        fechaEstimadaEntrega: estimatedDelivery.toISOString(),
      };

      const { success, data: savedOrder, error: saveError } = await guardarPedido(newOrderData);

      if (success) {
        alert('Pedido guardado exitosamente!');
        if (user.email) {
          await sendOrderConfirmationEmail(user.email, savedOrder);
        }
        onClose();
      } else {
        setError(saveError || 'Error al guardar el pedido.');
      }
    } catch (err) {
      setError('Error al procesar el pedido.');
      console.error('Error saving order:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || userLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-900 p-8 rounded-lg shadow-xl text-white">
          Cargando datos...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-900 p-8 rounded-lg shadow-xl text-white">
          <p>{error}</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-red-600 rounded hover:bg-red-700">Cerrar</button>
        </div>
      </div>
    );
  }

  if (!user || !user._id) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-900 p-8 rounded-lg shadow-xl text-white">
          <p>No se pudo cargar la información del usuario. Por favor, inicie sesión.</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-red-600 rounded hover:bg-red-700">Cerrar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-8 rounded-lg shadow-xl w-11/12 md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-6">Crear Nuevo Pedido</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {designs.length === 0 ? (
            <p className="col-span-full text-center text-gray-400">No tienes diseños disponibles.</p>
          ) : (
            designs.map((design) => (
              <div
                key={design._id}
                className={`relative border-2 rounded-lg overflow-hidden cursor-pointer 
                            ${selectedDesigns.includes(design._id) ? 'border-purple-500' : 'border-gray-700'}`}
                onClick={() => handleDesignSelect(design._id)}
              >
                <img 
                  src={design.imageUrl || '/path/to/default-design-image.jpg'} // Placeholder for image
                  alt={design.name} 
                  className="w-full h-32 object-cover" 
                />
                <div className="p-2 bg-gray-800 text-white text-sm">
                  <p className="font-semibold truncate">{design.name}</p>
                  <p className="text-gray-400 text-xs">{design.category}</p>
                </div>
                {selectedDesigns.includes(design._id) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-purple-500 bg-opacity-50 text-white text-3xl">
                    &#10003;
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition duration-300"
          >
            Cancelar
          </button>
          <button
            onClick={handleSaveOrder}
            disabled={selectedDesigns.length === 0 || saving}
            className={`px-6 py-2 rounded-lg text-white font-semibold 
                        ${selectedDesigns.length === 0 || saving ? 'bg-gray-600 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 transition duration-300'}`}
          >
            {saving ? 'Guardando...' : 'Guardar Pedido'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewOrderModal;
