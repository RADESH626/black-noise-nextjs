"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function Pago() {
  const router = useRouter();
  const { cartItems, clearCart, getTotal } = useCart();

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [metodoPago, setMetodoPago] = useState("tarjeta");
  const [error, setError] = useState("");

  useEffect(() => {
    if (cartItems.length === 0) {
      router.push("/proceso-pago");
    }
  }, [cartItems, router]);

  const handlePago = (e) => {
    e.preventDefault();

    if (!nombre || !correo || !direccion) {
      setError("Por favor completa todos los campos.");
      return;
    }

    const pedidoCompleto = {
      cliente: { nombre, correo, direccion },
      productos: cartItems,
      fecha: new Date().toLocaleString(),
      proveedor: "Diseñador encargado",
      metodoPago,
      total: getTotal(),
    };

    localStorage.setItem("pedidoCompleto", JSON.stringify(pedidoCompleto));

    clearCart();

    router.push("/confirmacion");
  };

  return (
    <div
     style={{ background: "linear-gradient(to right, #000000, #0A1828, #000000)", // gradiente negro-blanco-negro
      color: "#FFFFFFFF"}} // texto negro opaco 
      className="min-h-screen p-8" >

      <section                     // Fondo de resumen pedido
        style={{ backgroundColor: "#131212FF", padding: "1.5rem", borderRadius: "0.5rem", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
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

      <form
        onSubmit={handlePago}      // Fondo del formulario metodo de pago
        style={{ backgroundColor: "#131212FF", padding: "1.5rem", borderRadius: "0.5rem", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", maxWidth: "28rem", margin: "0 auto" }}
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
              border: "1px solid #FFFFFFFF", //Color del borde
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
              border: "1px solid #FFFFFFFF", //Color del borde
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
              border: "1px solid #FFFFFFFF", //Color del borde
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
              border: "1px solid #FFFFFFFF", //Color del borde
              padding: "0.5rem 0.75rem",
              marginTop: "0.25rem",
              color: "#FFFFFFFF", // Color del texto
              backgroundColor: "#131212FF", // Color de fondo del select
            }}
          >
            <option value="tarjeta">Aexpress</option>
            <option value="paypal">PayPal</option>
            <option value="efectivo">MasterCard</option>
            <option value="efectivo">Visa</option>
          </select>
        </label>

        {error && (          // Mostrar mensaje de error
          <p style={{ color: "#252424FF", marginBottom: "1rem" }}>{error}</p>
        )}

        <button
          type="submit"
          style={{
            width: "100%",
            backgroundColor: "#0A1828", // Color del botón
            color: "#FFFFFFFF", // Color del texto del botón
            fontWeight: "600",
            padding: "0.75rem",
            borderRadius: "0.375rem",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#201F1FFF")} // Cambia el color al pasar el mouse
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#0A1828")} // Vuelve al color original al quitar el mouse
        >
          Pagar Ahora
        </button>
      </form>
    </div>
  );
}

