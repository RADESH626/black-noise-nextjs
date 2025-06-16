import React from 'react';

function PaymentHistory({ payments }) {
  if (!payments || payments.length === 0) {
    return <p className="text-center text-gray-300">No hay historial de pagos disponible.</p>;
  }

  return (
    <div className="bg-black p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-white">Historial de Pagos</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-black">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-700 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Fecha
              </th>
              <th className="py-2 px-4 border-b border-gray-700 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Valor
              </th>
              <th className="py-2 px-4 border-b border-gray-700 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Método
              </th>
              <th className="py-2 px-4 border-b border-gray-700 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Estado
              </th>
              <th className="py-2 px-4 border-b border-gray-700 bg-gray-900 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Pedido ID
              </th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id} className="hover:bg-gray-800">
                <td className="py-2 px-4 border-b border-gray-700 text-sm text-gray-200">
                  {new Date(payment.fechaRealizacion).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border-b border-gray-700 text-sm text-gray-200">
                  ${payment.valorPago.toFixed(2)}
                </td>
                <td className="py-2 px-4 border-b border-gray-700 text-sm text-gray-200">
                  {payment.metodoPago}
                </td>
                <td className="py-2 px-4 border-b border-gray-700 text-sm text-gray-200">
                  {payment.estadoTransaccion}
                </td>
                <td className="py-2 px-4 border-b border-gray-700 text-sm text-gray-200">
                  {payment.pedidoId ? payment.pedidoId._id : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PaymentHistory;
