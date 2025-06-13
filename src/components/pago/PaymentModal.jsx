'use client';

import React, { useState } from 'react';
import BotonGeneral from '@/components/common/botones/BotonGeneral';
import { procesarPagoDePedido } from '@/app/acciones/PagoActions'; // Import the new server action

const PaymentModal = ({ pedidoId, valorPedido, onClose, onPaymentSuccess }) => { // Accept onPaymentSuccess prop
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Basic validation (can be expanded)
    if (!cardNumber || !expiryDate || !cvv) {
      setError("Por favor, completa todos los campos de pago.");
      setLoading(false);
      return;
    }

    const paymentData = {
      pedidoId,
      valorPedido,
      cardNumber,
      expiryDate,
      cvv,
      metodoPago: 'Tarjeta de Crédito/Débito', // Hardcoded for now
    };

    const { success, message, error: paymentError } = await procesarPagoDePedido(paymentData);

    if (success) {
      setSuccessMessage("¡Pago procesado exitosamente! El estado de tu pedido ha sido actualizado.");
      // Call the success callback to refresh data in the parent component
      if (onPaymentSuccess) {
        onPaymentSuccess();
      }

      // Close the modal after a delay
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      setError(paymentError || message || "Error al procesar el pago. Inténtalo de nuevo.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 p-6 rounded-lg shadow-xl w-full max-w-md border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">Realizar Pago</h2>
        <p className="text-gray-300 text-center mb-4">Pedido ID: <span className="font-semibold">{pedidoId}</span></p>
        <p className="text-gray-300 text-center mb-6">Valor a Pagar: <span className="font-bold text-green-400 text-xl">${valorPedido ? valorPedido.toFixed(2) : '0.00'}</span></p>

        {error && (
          <div className="bg-red-600 text-white p-3 rounded-md mb-4 text-center">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="bg-green-600 text-white p-3 rounded-md mb-4 text-center">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="cardNumber" className="block text-gray-300 text-sm font-bold mb-2">Número de Tarjeta</label>
            <input
              type="text"
              id="cardNumber"
              className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline bg-gray-800"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="XXXX XXXX XXXX XXXX"
              disabled={loading || successMessage}
            />
          </div>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label htmlFor="expiryDate" className="block text-gray-300 text-sm font-bold mb-2">Fecha de Vencimiento (MM/AA)</label>
              <input
                type="text"
                id="expiryDate"
                className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline bg-gray-800"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="MM/AA"
                disabled={loading || successMessage}
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="cvv" className="block text-gray-300 text-sm font-bold mb-2">CVV</label>
              <input
                type="text"
                id="cvv"
                className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline bg-gray-800"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="XXX"
                disabled={loading || successMessage}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <BotonGeneral
              type="button"
              onClick={onClose}
              disabled={loading}
              className="bg-gray-600 hover:bg-gray-700 text-white"
            >
              Cancelar
            </BotonGeneral>
            <BotonGeneral
              type="submit"
              disabled={loading || successMessage}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Procesando...' : 'Pagar Ahora'}
            </BotonGeneral>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
