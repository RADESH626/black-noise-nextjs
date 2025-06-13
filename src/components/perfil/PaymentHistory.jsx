import React from 'react';

function PaymentHistory({ payments }) {
  if (!payments || payments.length === 0) {
    return <p className="text-center text-gray-600">No hay historial de pagos disponible.</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Historial de Pagos</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Fecha
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Valor
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Método
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Estado
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Pedido ID
              </th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700">
                  {new Date(payment.fechaRealizacion).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700">
                  ${payment.valorPago.toFixed(2)}
                </td>
                <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700">
                  {payment.metodoPago}
                </td>
                <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700">
                  {payment.estadoTransaccion}
                </td>
                <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700">
                  {payment.pedidoId}
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
