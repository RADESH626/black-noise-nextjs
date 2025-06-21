"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { ObtenerUsuarioPorCorreo } from '@/app/acciones/UsuariosActions';
import BotonGeneral from '@/components/common/botones/BotonGeneral';

export default function PendingPaymentModal({ isOpen, onClose, onPaymentSubmit, pedidoId, costoEnvio }) {
    const { data: session, status } = useSession();
    const dialogRef = useRef(null);

    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [tarjeta, setTarjeta] = useState('');
    const [mes, setMes] = useState('');
    const [anio, setAnio] = useState('');
    const [cvv, setCvv] = useState('');
    const [error, setError] = useState('');
    const [useMyData, setUseMyData] = useState(false);

    useEffect(() => {
        if (isOpen) {
            dialogRef.current?.showModal();
            // Pre-llenar con datos de sesión si están disponibles
            if (session?.user?.name) setNombre(session.user.name);
            if (session?.user?.email) setCorreo(session.user.email);
            setUseMyData(true); // Marcar como usado mis datos por defecto
        } else {
            dialogRef.current?.close();
            // Reset form when modal closes
            setNombre('');
            setCorreo('');
            setTarjeta('');
            setMes('');
            setAnio('');
            setCvv('');
            setError('');
            setUseMyData(false);
        }
    }, [isOpen, session]);

    const handleUseMyDataToggle = async (e) => {
        const checked = e.target.checked;
        setUseMyData(checked);
        if (checked && status === 'authenticated' && session?.user?.email) {
            const fetchedUser = await ObtenerUsuarioPorCorreo(session.user.email);
            if (fetchedUser) {
                setNombre(fetchedUser.Nombre || '');
                setCorreo(fetchedUser.correo || '');
            }
        } else {
            setNombre('');
            setCorreo('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!nombre || !correo || !tarjeta || !mes || !anio || !cvv) {
            setError("Por favor completa todos los campos requeridos.");
            return;
        }

        const monthInt = parseInt(mes, 10);
        if (isNaN(monthInt) || monthInt < 1 || monthInt > 12) {
            setError("El mes debe ser un número entre 01 y 12.");
            return;
        }

        setError('');
        onPaymentSubmit(pedidoId, {
            nombre,
            correo,
            tarjeta,
            mes,
            anio,
            cvv,
            costoEnvio // Pasar el costo de envío para el registro del pago
        });
    };

    return (
        <dialog ref={dialogRef} className="relative p-8 rounded-lg shadow-lg max-w-md w-11/12 max-h-[90vh] overflow-y-auto" style={{ backgroundColor: "#F7F1F1FF", color: "#000000FF", margin: "auto" }}>
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-black text-2xl font-bold"
                aria-label="Cerrar"
            >
                &times;
            </button>
            <h2 className="text-2xl font-bold mb-4" style={{ color: "#111010FF" }}>Pagar Costo de Envío</h2>
            <p className="text-lg font-semibold mb-4" style={{ color: "#000000FF" }}>
                Pedido #{pedidoId ? pedidoId.slice(-6) : 'N/A'} - Monto: ${costoEnvio ? costoEnvio.toFixed(2) : '0.00'}
            </p>

            <form onSubmit={handleSubmit}>
                <div className="mb-4 flex items-center">
                    <input
                        type="checkbox"
                        id="useMyDataPayment"
                        checked={useMyData}
                        onChange={handleUseMyDataToggle}
                        className="mr-2"
                    />
                    <label htmlFor="useMyDataPayment" style={{ color: "#000000FF" }}>Rellenar automáticamente con mis datos</label>
                </div>

                <label className="block mb-4">
                    <span style={{ color: "#000000FF" }}>Nombre Completo:</span>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        style={{ borderColor: "#000000FF", color: "#000000FF" }}
                        className="w-full border rounded px-3 py-2 mt-1"
                        placeholder="Tu nombre completo"
                    />
                </label>
                <label className="block mb-4">
                    <span style={{ color: "#000000FF" }}>Correo Electrónico:</span>
                    <input
                        type="email"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        style={{ borderColor: "#000000FF", color: "#000000FF" }}
                        className="w-full border rounded px-3 py-2 mt-1"
                        placeholder="tu.correo@example.com"
                    />
                </label>

                <h3 className="text-xl font-bold mb-4" style={{ color: "#111010FF" }}>Datos de la Tarjeta (Simulados)</h3>
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
                                value = value.replace(/\D/g, "");
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
                        variant="primary"
                    >
                        Pagar Ahora
                    </BotonGeneral>
                </div>
            </form>
        </dialog>
    );
}
