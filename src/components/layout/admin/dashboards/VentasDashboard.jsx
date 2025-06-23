"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import SeccionHeader from '../secciones/acciones/SeccionHeader';
import { obtenerVentas } from '@/app/acciones/VentaActions.js';
import BotonAgregarVentas from '../../../common/botones/BotonAgregarVentas';
import Loader from '@/components/Loader';
import VentaFilters from '@/components/admin/filters/VentaFilters'; // Importar el componente de filtros
import { useRouter, useSearchParams } from 'next/navigation';

function VentasDashboard() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const currentFilters = useMemo(() => ({ // Envolver en useMemo
        estadoVenta: searchParams.get('estadoVenta') || '',
        pedidoAsociadoId: searchParams.get('pedidoAsociadoId') || '',
        valorVentaMin: searchParams.get('valorVentaMin') || '',
        valorVentaMax: searchParams.get('valorVentaMax') || '',
        fechaVentaStart: searchParams.get('fechaVentaStart') || '',
        fechaVentaEnd: searchParams.get('fechaVentaEnd') || '',
    }), [searchParams]); // Dependencia de searchParams

    const fetchVentas = useCallback(async () => {
        try {
            setLoading(true);
            const result = await obtenerVentas(currentFilters);
            if (result && result.ventas && Array.isArray(result.ventas)) {
                setVentas(result.ventas);
            } else {
                setError(result?.error || "No se recibió un array de ventas.");
                console.error("Error al cargar ventas en VentasDashboard.jsx:", result?.error || "No se recibió un array de ventas.");
            }
        } catch (err) {
            setError(err.message);
            console.error("Error fetching ventas:", err);
        } finally {
            setLoading(false);
        }
    }, [currentFilters]);

    useEffect(() => {
        fetchVentas();
    }, [fetchVentas]);

    const handleApplyFilters = useCallback((filters) => {
        const params = new URLSearchParams(searchParams);
        Object.keys(filters).forEach(key => {
            if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
                params.set(key, filters[key]);
            } else {
                params.delete(key);
            }
        });
        router.push(`/admin/ventas?${params.toString()}`);
        // router.refresh(); // Eliminar esta línea
    }, [router, searchParams]);

    const handleClearFilters = useCallback(() => {
        router.push('/admin/ventas');
        // router.refresh(); // Eliminar esta línea
    }, [router]);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <p>Error al cargar ventas: {error}</p>;
    }

    return (
        <>
            <SeccionHeader>
                <h4 className='font-bold text-2xl text-black'>Gestión de Ventas</h4>
                <Link href="/admin/ventas/agregar" className="flex flex-row justify-center items-center gap-4">
                    <BotonAgregarVentas />
                </Link>
            </SeccionHeader>

            <div className="mb-6">
                <VentaFilters onApplyFilters={handleApplyFilters} onClearFilters={handleClearFilters} initialFilters={currentFilters} />
            </div>

            {ventas.length === 0 ? (
                <p className="text-gray-600">No hay ventas registradas que coincidan con los filtros.</p>
            ) : (
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID Venta
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Valor Venta
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Comisión Aplicación
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado Venta
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fecha Venta
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Pedido Asociado
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Pagos Asociados
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {ventas.map((venta) => (
                                <tr key={venta._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {venta._id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        ${typeof venta.valorVenta === 'number' ? venta.valorVenta.toFixed(2) : '0.00'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        ${typeof venta.comisionAplicacion === 'number' ? venta.comisionAplicacion.toFixed(2) : '0.00'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {venta.estadoVenta}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {venta.fechaVenta ? new Date(venta.fechaVenta).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {venta.pedidoId ? venta.pedidoId.toString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {venta.pagoIds && venta.pagoIds.length > 0 ? venta.pagoIds.map(p => p.toString()).join(', ') : 'N/A'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}

export default VentasDashboard;
