"use client";

import React, { useState, useEffect, useRef } from 'react'; // Import useRef
import BotonGeneral from '@/components/common/botones/BotonGeneral';

export default function CardDataModal({ isOpen, onClose, onCardDataSubmit }) {
  const [tarjeta, setTarjeta] = useState('');
  const [mes, setMes] = useState('');
  const [anio, setAnio] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');

  const dialogRef = useRef(null); // Ref for the dialog element

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
      // Reset form when modal closes
      setTarjeta('');
      setMes('');
      setAnio('');
      setCvv('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tarjeta || !mes || !anio || !cvv) {
      setError("Por favor completa todos los campos de la tarjeta.");
      return;
    }

    const monthInt = parseInt(mes, 10);
    if (isNaN(monthInt) || monthInt < 1 || monthInt > 12) {
      setError("El mes debe ser un número entre 01 y 12.");
      return;
    }

    setError('');
    onCardDataSubmit({ tarjeta, mes, anio, cvv });
    // onClose(); // onClose will be called by useEffect when isOpen becomes false
  };

  // if (!isOpen) return null; // No longer needed with dialog element

  return (
    <dialog ref={dialogRef} className="relative p-8 rounded-lg shadow-lg max-w-md w-11/12 max-h-[90vh] overflow-y-auto" style={{ backgroundColor: "#F7F1F1FF", color: "#000000FF", margin: "auto" }}>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-black text-2xl font-bold"
        aria-label="Cerrar"
      >
        &times;
      </button>
      <h2 className="text-2xl font-bold mb-4" style={{ color: "#111010FF" }}>Datos de la Tarjeta</h2>

      <form onSubmit={handleSubmit}>
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
              type="number"
              value={mes}
              onChange={(e) => {
                let value = e.target.value;
                // Remove non-digit characters
                value = value.replace(/\D/g, "");
                // Ensure value is within 1-12 range
                if (value !== "") {
                  let numValue = parseInt(value, 10);
                  if (numValue > 12) {
                    value = "12";
                  } else if (numValue < 1 && value !== "") {
                    value = "1";
                  }
                }
                setMes(value);
              }}
              maxLength={2}
              min={1}
              max={12}
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

        <div className="flex justify-end gap-4">
          <BotonGeneral
            type="button"
            onClick={onClose}
            variant="secondary"
          >
            Cancelar
          </BotonGeneral>
          <BotonGeneral
            type="submit"
            variant="secondary"
            className="text-black"
          >
            Guardar Tarjeta
          </BotonGeneral>
        </div>
      </form>
    </dialog>
  );
}
