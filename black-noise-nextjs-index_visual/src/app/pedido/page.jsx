'use client';
import React, { useEffect, useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { motion } from "framer-motion";

const Pedidos = () => {
  const [pedidoCompleto, setPedidoCompleto] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const datos = localStorage.getItem("pedidoCompleto");
    if (datos) {
      const parsed = JSON.parse(datos);
      setPedidoCompleto(parsed);

      // Suma precio * cantidad
      const totalPedido = parsed.productos.reduce(
        (acc, p) => acc + (p.precio * (p.cantidad || 1)), 0
      );
      setTotal(totalPedido + 50); // + envío
    }
  }, []);

  if (!pedidoCompleto) {
    return (
      <PageLayout>
        <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", color: "#ffffff", backgroundColor: "#000000" }}>
          No hay pedidos aún.
        </div>
      </PageLayout>
    );
  }

  const { cliente, productos, fecha, proveedor, metodoPago } = pedidoCompleto;

  return (
    <PageLayout>
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(to right, #000000, #0A1828, #000000)",
          color: "#ffffff",
          fontFamily: "Poppins, sans-serif",
          padding: "1rem",
        }}
      >
        <h2 style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: "bold", marginTop: "1rem" }}>Tus Pedidos</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1rem",
            marginTop: "2rem",
          }}
        >
          {productos.map((pedido, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{
                backgroundColor: "#ffffff",
                color: "#000000",
                padding: "1rem",
                borderRadius: "1rem",
              }}
            >
              {pedido.img && (
                <img
                  src={pedido.img}
                  alt={pedido.nombre}
                  style={{
                    width: "100%",
                    height: "160px",
                    objectFit: "cover",
                    borderRadius: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                />
              )}

              <h4 style={{ fontWeight: "600", fontSize: "1.125rem" }}>{pedido.nombre}</h4>
              <p style={{ fontSize: "0.875rem" }}>Precio: ${pedido.precio.toFixed(2)}</p>
              <p style={{ fontSize: "0.875rem" }}>Cantidad: {pedido.cantidad}</p>
              <p style={{ fontSize: "0.875rem" }}>Categoría: camisa</p>
              <p style={{ fontSize: "0.875rem" }}>❤️ 2mil</p>
            </motion.div>
          ))}
        </div>

        <hr style={{ borderColor: "#ffffff", margin: "1.5rem 0" }} />
        <div style={{ fontSize: "0.875rem", backgroundColor: "#131212FF", padding: "1rem", borderRadius: "0.5rem" }}>
          <p style={{ fontWeight: "600", marginBottom: "0.5rem" }}>DETALLES DEL PEDIDO:</p>
          <p><span style={{ fontWeight: "700" }}>Prenda(s):</span> {productos.length}</p>
          <p><span style={{ fontWeight: "700" }}>Correo:</span> {cliente.correo}</p>
          <p><span style={{ fontWeight: "700" }}>Dirección:</span> {cliente.direccion}</p>
          <p><span style={{ fontWeight: "700" }}>Fecha del pedido:</span> {fecha}</p>
          <p><span style={{ fontWeight: "700" }}>Proveedor a cargo:</span> {proveedor}</p>
          <p><span style={{ fontWeight: "700" }}>Método de pago:</span> {metodoPago}</p>
          <p><span style={{ fontWeight: "700" }}>Total con envío:</span> ${total.toFixed(2)}</p>
        </div>
      </div>
    </PageLayout>
  );
};

export default Pedidos;
