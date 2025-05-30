"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { InputTextoGeneral } from '@/components/common/inputs';
import { TdGeneral } from '@/components/common/tablas';
import { BotonEditar } from '@/components/common/botones';
import SeccionLista from '@/components/layout/admin/secciones/lista/SeccionLista';
import { obtenerPedidos /*, FiltrarPedidos */ } from '@/app/acciones/PedidoActions';
import { EstadoPedido } from '@/models/enums/PedidoEnums';

const THPedidos = () => (
    <thead>
        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">ID Pedido</th>
            <th className="py-3 px-6 text-left">Proveedor</th>
            <th className="py-3 px-6 text-left">Diseños (Cant.)</th>
            <th className="py-3 px-6 text-left">Valor</th>
            <th className="py-3 px-6 text-left">Estado</th>
            <th className="py-3 px-6 text-left">Fecha Pedido</th>
            <th className="py-3 px-6 text-left">Fecha Est. Entrega</th>
            <th className="py-3 px-6 text-center">Acciones</th>
        </tr>
    </thead>
);

export default function FormFiltrarPedidos({ initialPedidosFromPage = [] }) {
    const [pedidosToDisplay, setPedidosToDisplay] = useState(initialPedidosFromPage);
    const [isLoading, setIsLoading] = useState(false);
    const [formKey, setFormKey] = useState(Date.now());
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });
    const [filters, setFilters] = useState({
        textoBusqueda: '', // Para buscar por ID de pedido o nombre de proveedor
        estadoPedido: '',
    });

    useEffect(() => {
        setPedidosToDisplay(initialPedidosFromPage);
    }, [initialPedidosFromPage]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };
    
    const fetchAllOrFilteredPedidos = async () => {
        setIsLoading(true);
        setAlert({ show: false, type: '', message: '' });
        
        const result = await obtenerPedidos(); 

        if (result && result.pedidos) {
            let filtered = result.pedidos;
            if (filters.textoBusqueda) {
                const searchTerm = filters.textoBusqueda.toLowerCase();
                filtered = filtered.filter(p => 
                    p._id.toLowerCase().includes(searchTerm) ||
                    (p.proveedorId?.nombreProveedor && p.proveedorId.nombreProveedor.toLowerCase().includes(searchTerm))
                );
            }
            if (filters.estadoPedido) {
                filtered = filtered.filter(p => p.estadoPedido === filters.estadoPedido);
            }
            setPedidosToDisplay(filtered);
        } else {
            setAlert({ show: true, type: 'error', message: result.error || 'Error al cargar pedidos.' });
            setTimeout(() => {
                setAlert({ show: false, type: '', message: '' });
            }, 2000);
            setPedidosToDisplay([]);
        }
        setIsLoading(false);
    };

    const handleSearchSubmit = async (event) => {
        event.preventDefault();
        await fetchAllOrFilteredPedidos();
    };

    const handleResetFilters = async () => {
        setFormKey(Date.now());
        setFilters({ textoBusqueda: '', estadoPedido: '' });
        setIsLoading(true);
        const result = await obtenerPedidos();
        if (result && result.pedidos) {
            setPedidosToDisplay(result.pedidos);
        } else {
            setAlert({ show: true, type: 'error', message: result.error || 'Error al cargar pedidos.' });
            setTimeout(() => {
                setAlert({ show: false, type: '', message: '' });
            }, 2000);
            setPedidosToDisplay(initialPedidosFromPage);
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
                            <label htmlFor="textoBusqueda" className="block text-sm font-medium mb-1">Buscar (ID Pedido, Proveedor):</label>
                            <InputTextoGeneral id="textoBusqueda" name="textoBusqueda" value={filters.textoBusqueda} onChange={handleFilterChange} placeholder="ID Pedido, Nombre Proveedor..." />
                        </div>
                        <div>
                            <label htmlFor="estadoPedido" className="block text-sm font-medium mb-1">Estado del Pedido:</label>
                            <select name="estadoPedido" id="estadoPedido" value={filters.estadoPedido} onChange={handleFilterChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black">
                                <option value="">Todos</option>
                                {Object.values(EstadoPedido).map(est => (<option key={est} value={est}>{est.replace(/_/g, ' ')}</option>))}
                            </select>
                        </div>
                    </header>
                    <footer className='flex flex-wrap gap-4 items-center mt-2'>
                        <button type="submit" disabled={isLoading} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 disabled:opacity-60">
                            {isLoading ? 'Buscando...' : 'Buscar Pedidos'}
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
                <THPedidos />
                <tbody className='bg-gray-300'>
                    {isLoading && pedidosToDisplay.length === 0 ? (
                        <tr><TdGeneral colSpan="8" className="text-center py-4">Cargando...</TdGeneral></tr>
                    ) : !isLoading && pedidosToDisplay.length === 0 ? (
                        <tr><TdGeneral colSpan="8" className="text-center py-4">No se encontraron pedidos.</TdGeneral></tr>
                    ) : (
                        pedidosToDisplay.map((pedido) => (
                            <tr key={pedido._id} className="border-b border-gray-200 hover:bg-gray-100">
                                <TdGeneral>{pedido._id}</TdGeneral>
                                <TdGeneral>{pedido.proveedorId?.nombreProveedor || 'N/A'}</TdGeneral>
                                <TdGeneral>{pedido.desingIds?.length || 0}</TdGeneral>
                                <TdGeneral>{pedido.valorPedido}</TdGeneral>
                                <TdGeneral>{pedido.estadoPedido.replace(/_/g, ' ')}</TdGeneral>
                                <TdGeneral>{formatDate(pedido.fechaRealizacion) || formatDate(pedido.createdAt)}</TdGeneral>
                                <TdGeneral>{formatDate(pedido.fechaEstimadaEntrega)}</TdGeneral>
                                <td className="border border-gray-400 px-4 py-2 flex flex-col gap-1 md:flex-row md:gap-2 items-center justify-center">
                                    <Link href={`/admin/pedidos/editar/${pedido._id.toString()}`} passHref>
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
