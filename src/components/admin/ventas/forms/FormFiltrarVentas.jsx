"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { InputTextoGeneral } from '@/components/common/inputs';
import TdGeneral from '@/components/common/tablas/TdGeneral';
import { BotonEditar } from '@/components/common/botones';
import SeccionLista from '@/components/admin/secciones/lista/SeccionLista';
import { obtenerVentas } from '@/app/acciones/VentaActions';
import { EstadoVenta } from '@/models/enums/VentaEnums';

const THVentas = () => (
    <thead>
        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">ID Venta</th>
            <th className="py-3 px-6 text-left">ID Pedido</th>
            <th className="py-3 px-6 text-left">Proveedor</th>
            <th className="py-3 px-6 text-left">Valor Venta</th>
            <th className="py-3 px-6 text-left">Comisión</th>
            <th className="py-3 px-6 text-left">Estado Venta</th>
            <th className="py-3 px-6 text-left">Fecha</th>
            <th className="py-3 px-6 text-center">Acciones</th>
        </tr>
    </thead>
);

export default function FormFiltrarVentas({ initialVentasFromPage = [] }) {
    const [ventasToDisplay, setVentasToDisplay] = useState(initialVentasFromPage);
    const [isLoading, setIsLoading] = useState(false);
    const [formKey, setFormKey] = useState(Date.now());
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });
    const [filters, setFilters] = useState({
        textoBusqueda: '', // Para buscar por ID Venta, ID Pedido, Nombre Proveedor
        estadoVenta: '',
    });

    useEffect(() => {
        setVentasToDisplay(initialVentasFromPage);
    }, [initialVentasFromPage]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };
    
    const fetchAllOrFilteredVentas = async () => {
        setIsLoading(true);
        setAlert({ show: false, type: '', message: '' });
        
        const result = await obtenerVentas(); 

        if (result && result.ventas) {
            let filtered = result.ventas;
            if (filters.textoBusqueda) {
                const searchTerm = filters.textoBusqueda.toLowerCase();
                filtered = filtered.filter(v => 
                    v._id.toLowerCase().includes(searchTerm) ||
                    v.pedidoId?._id?.toLowerCase().includes(searchTerm) ||
                    (v.pedidoId?.proveedorId?.nombreProveedor && v.pedidoId.proveedorId.nombreProveedor.toLowerCase().includes(searchTerm))
                );
            }
            if (filters.estadoVenta) {
                filtered = filtered.filter(v => v.estadoVenta === filters.estadoVenta);
            }
            setVentasToDisplay(filtered);
        } else {
            setAlert({ show: true, type: 'error', message: result.error || 'Error al cargar ventas.' });
            setTimeout(() => {
                setAlert({ show: false, type: '', message: '' });
            }, 2000);
            setVentasToDisplay([]);
        }
        setIsLoading(false);
    };

    const handleSearchSubmit = async (event) => {
        event.preventDefault();
        await fetchAllOrFilteredVentas();
    };

    const handleResetFilters = async () => {
        setFormKey(Date.now());
        setFilters({ textoBusqueda: '', estadoVenta: '' });
        setIsLoading(true);
        const result = await obtenerVentas();
        if (result && result.ventas) {
            setVentasToDisplay(result.ventas);
        } else {
            setAlert({ show: true, type: 'error', message: result.error || 'Error al cargar ventas.' });
            setTimeout(() => {
                setAlert({ show: false, type: '', message: '' });
            }, 2000);
            setVentasToDisplay(initialVentasFromPage);
        }
        setIsLoading(false);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <>
            <form onSubmit={handleSearchSubmit} key={formKey}>
                <section className="flex flex-col gap-2 bg-black rounded-lg justify-center items-top p-4 w-full text-white mb-4">
                    <header className='flex flex-wrap gap-4 items-end'>
                        <div>
                            <label htmlFor="textoBusqueda" className="block text-sm font-medium mb-1">Buscar (ID Venta, ID Pedido, Proveedor):</label>
                            <InputTextoGeneral id="textoBusqueda" name="textoBusqueda" value={filters.textoBusqueda} onChange={handleFilterChange} placeholder="ID Venta, ID Pedido, Proveedor..." />
                        </div>
                        <div>
                            <label htmlFor="estadoVenta" className="block text-sm font-medium mb-1">Estado de la Venta:</label>
                            <select name="estadoVenta" id="estadoVenta" value={filters.estadoVenta} onChange={handleFilterChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black">
                                <option value="">Todos</option>
                                {Object.values(EstadoVenta).map(est => (<option key={est} value={est}>{est.replace(/_/g, ' ')}</option>))}
                            </select>
                        </div>
                    </header>
                    <footer className='flex flex-wrap gap-4 items-center mt-2'>
                        <button type="submit" disabled={isLoading} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 disabled:opacity-60">
                            {isLoading ? 'Buscando...' : 'Buscar Ventas'}
                        </button>
                        <button type="button" onClick={handleResetFilters} disabled={isLoading} className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 disabled:opacity-60">
                            Limpiar Filtros
                        </button>
                    </footer>
                </section>
            </form>

            {/* Alert component removed, consider alternative for displaying messages */}
            {alert.show && (
                <div className={`p-4 mb-4 text-sm rounded-lg ${alert.type === 'error' ? 'bg-red-100 text-red-700' : alert.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`} role="alert">
                    {alert.message}
                    <button onClick={() => setAlert({ show: false })} className="ml-4 float-right font-bold">X</button>
                </div>
            )}

            <SeccionLista>
                <THVentas />
                <tbody className='bg-gray-300'>
                    {isLoading && ventasToDisplay.length === 0 ? (
                        <tr><TdGeneral colSpan="8" className="text-center py-4">Cargando...</TdGeneral></tr>
                    ) : !isLoading && ventasToDisplay.length === 0 ? (
                        <tr><TdGeneral colSpan="8" className="text-center py-4">No se encontraron ventas.</TdGeneral></tr>
                    ) : (
                        ventasToDisplay.map((venta) => (
                            <tr key={venta._id} className="border-b border-gray-200 hover:bg-gray-100">
                                <TdGeneral>{venta._id}</TdGeneral>
                                <TdGeneral>{venta.pedidoId?._id || 'N/A'}</TdGeneral>
                                <TdGeneral>{venta.pedidoId?.proveedorId?.nombreProveedor || 'N/A'}</TdGeneral>
                                <TdGeneral>{venta.valorVenta}</TdGeneral>
                                <TdGeneral>{venta.comisionAplicacion}</TdGeneral>
                                <TdGeneral>{venta.estadoVenta.replace(/_/g, ' ')}</TdGeneral>
                                <TdGeneral>{formatDate(venta.fechaRealizacion) || formatDate(venta.createdAt)}</TdGeneral>
                                <td className="border border-gray-400 px-4 py-2 flex flex-col gap-1 md:flex-row md:gap-2 items-center justify-center">
                                    <Link href={`/admin/ventas/editar/${venta._id.toString()}`} passHref>
                                        <BotonEditar className="w-full md:w-auto text-sm">Editar</BotonEditar>
                                    </Link>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </SeccionLista>
        </>
    );
}
