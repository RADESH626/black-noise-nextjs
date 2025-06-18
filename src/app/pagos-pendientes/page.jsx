"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link'; // Importar Link
import { useSession } from 'next-auth/react';
import { obtenerPagosPendientesPorUsuario, registrarPagoEnvioSimulado } from '@/app/acciones/PagoActions';
import { useDialog } from '@/context/DialogContext';
import BotonGeneral from '@/components/common/botones/BotonGeneral';
import { useRouter } from 'next/navigation';
import PendingPaymentModal from '@/components/pagos-pendientes/PendingPaymentModal'; // Importar el nuevo modal

function PagosPendientesPage() {
    const { data: session, status } = useSession();
    const { showPopUp } = useDialog();
    const router = useRouter();
    const userId = session?.user?.id;

    const [pedidosPendientes, setPedidosPendientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPedido, setSelectedPedido] = useState(null); // Para almacenar el pedido a pagar

    const fetchPedidosPendientes = async () => {
        if (!userId) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const { success, pedidos, message } = await obtenerPagosPendientesPorUsuario(userId);
            if (success) {
                setPedidosPendientes(pedidos);
            } else {
                setError(message || "Error al cargar los pagos pendientes.");
                showPopUp(message || "Error al cargar los pagos pendientes.", "error");
            }
        } catch (err) {
            setError(err.message || "Error de red al cargar los pagos pendientes.");
            showPopUp(err.message || "Error de red al cargar los pagos pendientes.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status === 'authenticated') {
            fetchPedidosPendientes();
        } else if (status === 'unauthenticated') {
            router.push('/login'); // Redirigir a login si no está autenticado
        }
    }, [userId, status, router]);

    const handleOpenPaymentModal = (pedido) => {
        setSelectedPedido(pedido);
        setShowPaymentModal(true);
    };

    const handleClosePaymentModal = () => {
        setShowPaymentModal(false);
        setSelectedPedido(null);
    };

    const handlePaymentSubmit = async (pedidoId, paymentData) => {
        showPopUp("Procesando pago...", "info", false); // Mostrar pop-up de carga
        try {
            const { success, message } = await registrarPagoEnvioSimulado(pedidoId, paymentData);
            if (success) {
                showPopUp("Pago realizado exitosamente.", "success");
                handleClosePaymentModal(); // Cerrar modal
                fetchPedidosPendientes(); // Refrescar la lista
            } else {
                showPopUp(message || "Error al procesar el pago.", "error");
            }
        } catch (err) {
            showPopUp(err.message || "Error de red al procesar el pago.", "error");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#000000] via-[#0A1828] to-[#000000] text-white">
                Cargando pagos pendientes...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#000000] via-[#0A1828] to-[#000000] text-red-500">
                Error: {error}
            </div>
        );
    }

    if (pedidosPendientes.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#000000] via-[#0A1828] to-[#000000] text-white p-4">
                <h2 className="text-3xl font-bold mb-6">Pagos Pendientes</h2>
                <p className="text-gray-400 text-center">No tienes pagos de envío pendientes en este momento.</p>
                <Link href="/catalogo" className="mt-4 text-blue-500 hover:underline">
                    Volver a la tienda
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#000000] via-[#0A1828] to-[#000000] text-white p-8 pt-24">
            <h2 className="text-3xl font-bold mb-8 text-center">Tus Pagos de Envío Pendientes</h2>
            <div className="max-w-4xl mx-auto space-y-6">
                {pedidosPendientes.map((pedido) => (
                    <div key={pedido._id} className="bg-gray-800 p-6 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="mb-4 md:mb-0">
                            <p className="text-lg font-semibold mb-1">Pedido #{pedido._id.slice(-6)}</p>
                            <p className="text-sm text-gray-400">Proveedor: {pedido.proveedorId?.nombreEmpresa || 'N/A'}</p>
                            <p className="text-sm text-gray-400">Estado del Pedido: {pedido.estadoPedido}</p>
                            <p className="text-sm text-gray-400">Total del Pedido: ${pedido.total.toFixed(2)}</p>
                            <p className="text-md font-bold text-yellow-400">Costo de Envío Pendiente: ${pedido.costoEnvio.toFixed(2)}</p>
                        </div>
                        <BotonGeneral onClick={() => handleOpenPaymentModal(pedido)}>
                            Pagar Ahora (${pedido.costoEnvio.toFixed(2)})
                        </BotonGeneral>
                    </div>
                ))}
            </div>

            {selectedPedido && (
                <PendingPaymentModal
                    isOpen={showPaymentModal}
                    onClose={handleClosePaymentModal}
                    onPaymentSubmit={handlePaymentSubmit}
                    pedidoId={selectedPedido._id}
                    costoEnvio={selectedPedido.costoEnvio}
                />
            )}
        </div>
    );
}

export default PagosPendientesPage;
