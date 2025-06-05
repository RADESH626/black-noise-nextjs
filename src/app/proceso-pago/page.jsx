"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProcesoPago() {
  const router = useRouter();
  const [tarjeta, setTarjeta] = useState("");
  const [mes, setMes] = useState("");
  const [anio, setAnio] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");

  const handleConfirmarPago = (e) => {
    e.preventDefault();

    if (!tarjeta || !mes || !anio || !cvv) {
      setError("Por favor completa todos los campos del pago.");
      return;
    }
    setError("");

    const productos = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const total = productos.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

    const cliente = {
      nombre: "Daniel Santiago",
      correo: "daniel@email.com",
      direccion: "Calle Ficticia 123",
    };

    const pedidoCompleto = {
      cliente,
      productos,
      fecha: new Date().toLocaleString(),
      proveedor: "Diseñador encargado",
      metodoPago: "tarjeta",
      total,
      tarjeta,
    };

    localStorage.setItem("pedidoCompleto", JSON.stringify(pedidoCompleto));

    setTimeout(() => {
      localStorage.removeItem("cartItems");
      router.push("/pedido");
    }, 3000);
  };

  return (
    <div style={{ backgroundColor: "#FDF9F9FF" }} className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 style={{ color: "#111010FF" }} className="text-3xl font-bold mb-6">Proceso de Pago</h1>
      <form
        onSubmit={handleConfirmarPago}
        style={{ backgroundColor: "#F7F1F1FF" }}
        className="p-6 rounded shadow-md max-w-md w-full"
      >
        <label className="block mb-4">
          <span style={{ color: "#000000FF" }}>Número de Tarjeta:</span>
          <input
            type="text"
            value={tarjeta}
            onChange={(e) => setTarjeta(e.target.value.replace(/\D/g, ""))}
            maxLength={16}
            placeholder="1234567812345678"
            style={{ borderColor: "#000000FF", color: "#000000FF" }}
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </label>
        <div className="flex gap-4 mb-4">
          <label className="flex-1">
            <span style={{ color: "#000000FF" }}>Mes:</span>
            <input
              type="text"
              value={mes}
              onChange={(e) => setMes(e.target.value.replace(/\D/g, ""))}
              maxLength={2}
              placeholder="MM"
              style={{ borderColor: "#000000FF", color: "#000000FF" }}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </label>
          <label className="flex-1">
            <span style={{ color: "#000000FF" }}>Año:</span>
            <input
              type="text"
              value={anio}
              onChange={(e) => setAnio(e.target.value.replace(/\D/g, ""))}
              maxLength={2}
              placeholder="AA"
              style={{ borderColor: "#000000FF", color: "#111827" }}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </label>
          <label className="flex-1">
            <span style={{ color: "#000000FF" }}>CVV:</span>
            <input
              type="password"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
              maxLength={3}
              placeholder="123"
              style={{ borderColor: "#000000FF", color: "#000000FF" }}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </label>
        </div>

        {error && <p style={{ color: "#FF0000FF" }} className="mb-4">{error}</p>}

        <button
          type="submit"
          style={{ backgroundColor: "#154780FF", color: "#ffffff" }}
          className="w-full font-semibold py-3 rounded hover:bg-blue-700 transition"
        >
          Confirmar Pago
        </button>
      </form>
    </div>
  );
}

