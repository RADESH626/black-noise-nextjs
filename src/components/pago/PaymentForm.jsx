'use client'
import React, { useState } from 'react';
import { MetodoPago } from '../../models/enums/pago/MetodoPago';

function PaymentForm({ handlePago }) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [metodoPago, setMetodoPago] = useState(MetodoPago.TARJETA_CREDITO); // Default to 'TARJETA_CREDITO'
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !correo || !direccion || !metodoPago) {
      setError("Por favor completa todos los campos.");
      return;
    }

    if (metodoPago === MetodoPago.TARJETA_CREDITO || metodoPago === MetodoPago.TARJETA_DEBITO) {
      if (!cardNumber || !expiryDate || !cvv) {
        setError("Por favor completa todos los campos de la tarjeta.");
        return;
      }
      if (!/^\d{16}$/.test(cardNumber)) {
        setError("Número de tarjeta inválido (16 dígitos).");
        return;
      }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
        setError("Fecha de vencimiento inválida (MM/AA).");
        return;
      }
      if (!/^\d{3,4}$/.test(cvv)) {
        setError("CVV inválido (3 o 4 dígitos).");
        return;
      }
    }

    setError("");
    handlePago({ nombre, correo, direccion, metodoPago, cardNumber, expiryDate, cvv });
  };

  return (
    
    <form
      onSubmit={handleSubmit}
      style={{ backgroundColor: "#FFFFFFFF", padding: "1.5rem", borderRadius: "0.5rem", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", margin: "0 auto" }}
    >
      <h1 style={{ fontWeight: "600", fontSize: "1.25rem", marginBottom: "1rem" }}>
        Metodo de pago
      </h1>
      <h2 style={{ fontWeight: "600", fontSize: "1.25rem", marginBottom: "1rem" }}>
        Datos del Cliente
      </h2>

      <label style={{ display: "block", marginBottom: "0.5rem" }}>
        Nombre Completo:
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{
            width: "100%",
            borderRadius: "0.25rem",
            border: "1px solid #2B2C2EFF",
            padding: "0.5rem 0.75rem",
            marginTop: "0.25rem",
          }}
        />
      </label>

      <label style={{ display: "block", marginBottom: "0.5rem" }}>
        Correo Electrónico:
        <input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          style={{
            width: "100%",
            borderRadius: "0.25rem",
            border: "1px solid #2B2C2EFF",
            padding: "0.5rem 0.75rem",
            marginTop: "0.25rem",
          }}
        />
      </label>

      <label style={{ display: "block", marginBottom: "0.5rem" }}>
        Dirección de Envío:
        <input
          type="text"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          style={{
            width: "100%",
            borderRadius: "0.25rem",
            border: "1px solid #2B2C2EFF",
            padding: "0.5rem 0.75rem",
            marginTop: "0.25rem",
          }}
        />
      </label>

      <label style={{ display: "block", marginBottom: "1rem" }}>
        Método de Pago:
        <select
          value={metodoPago}
          onChange={(e) => setMetodoPago(e.target.value)}
          style={{
            width: "100%",
            borderRadius: "0.25rem",
            border: "1px solid #2B2C2EFF",
            padding: "0.5rem 0.75rem",
            marginTop: "0.25rem",
          }}
        >
          {Object.values(MetodoPago).map((method) => (
            <option key={method} value={method}>
              {method.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </label>

      {(metodoPago === MetodoPago.TARJETA_CREDITO || metodoPago === MetodoPago.TARJETA_DEBITO) && (
        <>
          <h2 style={{ fontWeight: "600", fontSize: "1.25rem", marginBottom: "1rem", marginTop: "1rem" }}>
            Datos de la Tarjeta
          </h2>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Número de Tarjeta:
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="XXXX XXXX XXXX XXXX"
              maxLength="16"
              style={{
                width: "100%",
                borderRadius: "0.25rem",
                border: "1px solid #2B2C2EFF",
                padding: "0.5rem 0.75rem",
                marginTop: "0.25rem",
              }}
            />
          </label>

          <div style={{ display: "flex", gap: "1rem", marginBottom: "0.5rem" }}>
            <label style={{ flex: 1, display: "block" }}>
              Fecha de Vencimiento (MM/AA):
              <input
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="MM/AA"
                maxLength="5"
                style={{
                  width: "100%",
                  borderRadius: "0.25rem",
                  border: "1px solid #2B2C2EFF",
                  padding: "0.5rem 0.75rem",
                  marginTop: "0.25rem",
                }}
              />
            </label>
            <label style={{ flex: 1, display: "block" }}>
              CVV:
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="XXX"
                maxLength="4"
                style={{
                  width: "100%",
                  borderRadius: "0.25rem",
                  border: "1px solid #2B2C2EFF",
                  padding: "0.5rem 0.75rem",
                  marginTop: "0.25rem",
                }}
              />
            </label>
          </div>
        </>
      )}

      {error && (
        <p style={{ color: "#252424FF", marginBottom: "1rem" }}>{error}</p>
      )}

      <button
        type="submit"
        style={{
          width: "100%",
          backgroundColor: "#FFFFFFFF",
          color: "#FFFFFF",
          fontWeight: "600",
          padding: "0.75rem",
          borderRadius: "0.375rem",
          cursor: "pointer",
          transition: "background-color 0.3s",
        }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#154780FF")}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#154780FF")}
      >
        Pagar Ahora
      </button>
    </form>
  );
}

export default PaymentForm;
