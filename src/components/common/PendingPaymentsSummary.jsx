"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from "next-auth/react";
import { obtenerPagosPendientesPorUsuario } from '@/app/acciones/PagoActions';
import { useDialog } from '@/context/DialogContext';
import BotonGeneral from '@/components/common/botones/BotonGeneral';

function PendingPaymentsSummary() {
    const { data: session, status } = useSession();
    const { showPopUp } = useDialog();
    const userId = session?.user?.id;

    const [pendingPayments, setPendingPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);

    const dropdownRef = useRef(null);
    const iconRef = useRef(null);

    const fetchPendingPayments = async () => {
        if (!userId) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const { success, pedidos, message } = await obtenerPagosPendientesPorUsuario(userId);
            if (success) {
                setPendingPayments(pedidos);
            } else {
                setError(message || "Error al cargar pagos pendientes.");
                showPopUp(message || "Error al cargar pagos pendientes.", "error");
            }
        } catch (err) {
            setError(err.message || "Error de red al cargar pagos pendientes.");
            showPopUp(err.message || "Error de red al cargar pagos pendientes.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingPayments();
        // Opcional: Refrescar pagos pendientes periódicamente o al cambiar de ruta
    }, [userId, status]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                iconRef.current && !iconRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const totalPendingAmount = pendingPayments.reduce((sum, pedido) => sum + pedido.costoEnvio, 0);

    if (loading) {
        return (
            <div className="relative">
                <Image
                    src="/icons/icono-dinero.svg"
                    alt="Pagos Pendientes"
                    width={24}
                    height={24}
                    className="cursor-pointer filter invert"
                    ref={iconRef}
                />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    ...
                </span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="relative">
                <Image
                    src="/icons/icono-dinero.svg"
                    alt="Pagos Pendientes"
                    width={24}
                    height={24}
                    className="cursor-pointer filter invert"
                    ref={iconRef}
                />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    !
                </span>
            </div>
        );
    }

    if (pendingPayments.length === 0) {
        return (
            <div className="relative">
                <Image
                    src="/icons/icono-dinero.svg"
                    alt="Pagos Pendientes"
                    width={24}
                    height={24}
                    className="cursor-pointer opacity-50 filter invert"
                    ref={iconRef}
                />
            </div>
        );
    }

    return (
        <div className="relative">
            <Image
                src="/icons/icono-dinero.svg"
                alt="Pagos Pendientes"
                width={24}
                height={24}
                className="cursor-pointer filter invert"
                onClick={() => setShowDropdown(!showDropdown)}
                ref={iconRef}
            />
            {pendingPayments.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {pendingPayments.length}
                </span>
            )}

            {showDropdown && (
                <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 w-80 bg-black border border-gray-700 rounded-md shadow-lg z-50 p-4"
                >
                    <h3 className="text-lg font-bold mb-3 text-white">Pagos Pendientes</h3>
                    <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                        {pendingPayments.map((pedido) => (
                            <div key={pedido._id} className="flex justify-between items-center text-gray-300 text-sm">
                                <span>Pedido #{pedido._id.slice(-6)}</span>
                                <span>Costo Envío: ${pedido.costoEnvio.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between items-center text-white text-md font-semibold mb-4 border-t border-gray-700 pt-3">
                        <span>Total Pendiente:</span>
                        <span>${totalPendingAmount.toFixed(2)}</span>
                    </div>
                    <Link href="/pagos-pendientes" passHref>
                        <BotonGeneral className="w-full">
                            Ver Detalles y Pagar
                        </BotonGeneral>
                    </Link>
                </div>
            )}
        </div>
    );
}

export default PendingPaymentsSummary;
