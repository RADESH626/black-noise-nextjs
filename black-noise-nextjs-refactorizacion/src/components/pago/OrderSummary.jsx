'use client'
import React from 'react';

function OrderSummary({ cartItems, getTotal }) {
  return (
    <section
      style={{ backgroundColor: "#FFFFFFFF", padding: "1.5rem", borderRadius: "0.5rem", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
      className="mb-8"
    >
      <h2 style={{ fontWeight: "600", fontSize: "1.25rem", marginBottom: "1rem" }}>
        Resumen del Pedido
      </h2>
      {cartItems.map((item) => (
        <div
          key={item.id}
          style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}
        >
          <span>{item.nombre} x {item.quantity}</span>
          <span>${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      ))}
      <hr style={{ margin: "0.5rem 0" }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
        <span>Total:</span>
        <span>${getTotal().toFixed(2)}</span>
      </div>
    </section>
  );
}

export default OrderSummary;
