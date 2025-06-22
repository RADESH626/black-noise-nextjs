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
        backgroundColor: "#f5f5f5",
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
          color: "#000000FF",
        }}
      >
        Historial de Pagos
      </h2>
      <div style={{ overflowX: "auto" }}>
        <table style={{ minWidth: "100%", backgroundColor: "#000000FF" }}>
          <thead>
            <tr style={{ backgroundColor: "#FFFFFFFF" }}>
              {["Fecha", "Valor", "Método", "Estado", "Pedido ID", "Motivo"].map((text) => (
                <th
                  key={text}
                  style={{
                    padding: "0.5rem 1rem",
                    borderBottom: "1px solid #000000FF",
                    textAlign: "left",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    color: "#000000FF",  //NOMBRES 
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
                style={{ backgroundColor: "#FFFFFFFF" }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#FFFFFFFF";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#FFFFFFFF";
                }}
              >
                <td
                  style={{
                    padding: "0.5rem 1rem",
                    borderBottom: "1px solid #030303FF",
                    fontSize: "0.875rem",
                    color: "#000000FF",
                  }}
                >
                  {new Date(payment.createdAt).toLocaleDateString()}
                </td>
                <td
                  style={{
                    padding: "0.5rem 1rem",
                    borderBottom: "1px solid #000000FF",
                    fontSize: "0.875rem",
                    color: "#000000FF",
                  }}
                >
                  ${payment.valorPago.toFixed(2)}
                </td>
                <td
                  style={{
                    padding: "0.5rem 1rem",
                    borderBottom: "1px solid #000000FF",
                    fontSize: "0.875rem",
                    color: "#000000FF",
                  }}
                >
                  {payment.metodoPago}
                </td>
                <td
                  style={{
                    padding: "0.5rem 1rem",
                    borderBottom: "1px solid #000000FF",
                    fontSize: "0.875rem",
                    color: "#000000FF",
                  }}
                >
                  {payment.estadoTransaccion}
                </td>
                <td
                  style={{
                    padding: "0.5rem 1rem",
                    borderBottom: "1px solid #000000FF",
                    fontSize: "0.875rem",
                    color: "#000000FF",
                  }}
                >
                  {payment.pedidoId}
                </td>
                <td
                  style={{
                    padding: "0.5rem 1rem",
                    borderBottom: "1px solid #000000FF",
                    fontSize: "0.875rem",
                    color: "#000000FF",
                  }}
                >
                  {payment.motivo || 'N/A'}
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
