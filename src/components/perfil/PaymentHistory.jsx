import React from 'react';

function PaymentHistory({ payments }) {
  if (!payments || payments.length === 0) {
    return (
      <p style={{ textAlign: "center", color: "#D1D5DB" }}>
        No hay historial de pagos disponible.
      </p>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#000000",
        padding: "1.5rem",
        borderRadius: "0.5rem",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      }}
    >
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          marginBottom: "1rem",
          color: "#FFFFFF",
        }}
      >
        Historial de Pagos
      </h2>
      <div style={{ overflowX: "auto" }}>
        <table style={{ minWidth: "100%", backgroundColor: "#000000" }}>
          <thead>
            <tr style={{ backgroundColor: "#111827" }}>
              {["Fecha", "Valor", "Método", "Estado", "Pedido ID"].map((text) => (
                <th
                  key={text}
                  style={{
                    padding: "0.5rem 1rem",
                    borderBottom: "1px solid #374151",
                    textAlign: "left",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    color: "#D1D5DB",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {text}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr
                key={payment._id}
                style={{ backgroundColor: "#000000" }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#1F2937";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#000000";
                }}
              >
                <td
                  style={{
                    padding: "0.5rem 1rem",
                    borderBottom: "1px solid #374151",
                    fontSize: "0.875rem",
                    color: "#E5E7EB",
                  }}
                >
                  {new Date(payment.createdAt).toLocaleDateString()}
                </td>
                <td
                  style={{
                    padding: "0.5rem 1rem",
                    borderBottom: "1px solid #374151",
                    fontSize: "0.875rem",
                    color: "#E5E7EB",
                  }}
                >
                  ${payment.valorPago.toFixed(2)}
                </td>
                <td
                  style={{
                    padding: "0.5rem 1rem",
                    borderBottom: "1px solid #374151",
                    fontSize: "0.875rem",
                    color: "#E5E7EB",
                  }}
                >
                  {payment.metodoPago}
                </td>
                <td
                  style={{
                    padding: "0.5rem 1rem",
                    borderBottom: "1px solid #374151",
                    fontSize: "0.875rem",
                    color: "#E5E7EB",
                  }}
                >
                  {payment.estadoTransaccion}
                </td>
                <td
                  style={{
                    padding: "0.5rem 1rem",
                    borderBottom: "1px solid #374151",
                    fontSize: "0.875rem",
                    color: "#E5E7EB",
                  }}
                >
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
