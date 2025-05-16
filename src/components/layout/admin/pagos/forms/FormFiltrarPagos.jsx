"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { InputTextoGeneral } from '@/components/common/inputs';
import TdGeneral from '@/components/common/tablas/TdGeneral';
import { BotonEditar } from '@/components/common/botones';
import SeccionLista from '@/components/layout/admin/secciones/lista/SeccionLista';
import { obtenerPagos /*, FiltrarPagos */ } from '@/app/acciones/PagoActions';
import { MetodoPago } from '@/models/enums/pago/MetodoPago';
import { EstadoPago } from '@/models/enums/pago/EstadoPago';
import Alert from '@/components/common/Alert';

// Placeholder para THPagos
const THPagos = () => (
    <thead>
        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">ID Pago</th>
            <th className="py-3 px-6 text-left">Usuario</th>
            <th className="py-3 px-6 text-left">Venta ID</th>
            <th className="py-3 px-6 text-left">Valor</th>
            <th className="py-3 px-6 text-left">Método</th>
            <th className="py-3 px-6 text-left">Estado</th>
            <th className="py-3 px-6 text-left">Fecha</th>
            <th className="py-3 px-6 text-center">Acciones</th>
        </tr>
    </thead>
);

export default function FormFiltrarPagos({ initialPagosFromPage = [] }) {
    const [pagosToDisplay, setPagosToDisplay] = useState(initialPagosFromPage);
    const [isLoading, setIsLoading] = useState(false);
    const [formKey, setFormKey] = useState(Date.now());
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });
    const [filters, setFilters] = useState({
        textoBusqueda: '', // Para buscar por ID de pago, usuarioId o ventaId
        metodoPago: '',
        estadoPago: '',
    });

    useEffect(() => {
        setPagosToDisplay(initialPagosFromPage);
    }, [initialPagosFromPage]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };
    
    const fetchAllOrFilteredPagos = async () => {
        setIsLoading(true);
        setAlert({ show: false, type: '', message: '' });
        
        // Por ahora, la lógica de filtrado se hará en el cliente después de obtener todos los pagos.
        // En una implementación más robusta, FiltrarPagos se haría en el backend.
        const result = await obtenerPagos(); 

        if (result && result.pagos) {
            let filtered = result.pagos;
            if (filters.textoBusqueda) {
                const searchTerm = filters.textoBusqueda.toLowerCase();
                filtered = filtered.filter(p => 
                    p._id.toLowerCase().includes(searchTerm) ||
                    (p.usuarioId?.nombreUsuario && p.usuarioId.nombreUsuario.toLowerCase().includes(searchTerm)) ||
                    (p.usuarioId?.correo && p.usuarioId.correo.toLowerCase().includes(searchTerm)) ||
                    p.ventaId._id.toLowerCase().includes(searchTerm)
                );
            }
            if (filters.metodoPago) {
                filtered = filtered.filter(p => p.metodoPago === filters.metodoPago);
            }
            if (filters.estadoPago) {
                filtered = filtered.filter(p => p.estadoPago === filters.estadoPago);
            }
            setPagosToDisplay(filtered);
        } else {
            setAlert({ show: true, type: 'error', message: result.error || 'Error al cargar pagos.' });
            setPagosToDisplay([]);
        }
        setIsLoading(false);
    };

    const handleSearchSubmit = async (event) => {
        event.preventDefault();
        await fetchAllOrFilteredPagos();
    };

    const handleResetFilters = async () => {
        setFormKey(Date.now());
        setFilters({ textoBusqueda: '', metodoPago: '', estadoPago: '' });
        setIsLoading(true);
        const result = await obtenerPagos(); // Cargar todos los pagos
        if (result && result.pagos) {
            setPagosToDisplay(result.pagos);
        } else {
            setAlert({ show: true, type: 'error', message: result.error || 'Error al cargar pagos.' });
            setPagosToDisplay(initialPagosFromPage);
        }
        setIsLoading(false);
    };

    return (
        <>
            <form onSubmit={handleSearchSubmit} key={formKey}>
                <section className="flex flex-col gap-2 bg-black rounded-lg justify-center items-top p-4 w-full text-white mb-4">
                    <header className='flex flex-wrap gap-4 items-end'>
                        <div>
                            <label htmlFor="textoBusqueda" className="block text-sm font-medium mb-1">Buscar (ID Pago, Usuario, Venta ID):</label>
                            <InputTextoGeneral id="textoBusqueda" name="textoBusqueda" value={filters.textoBusqueda} onChange={handleFilterChange} placeholder="ID, nombre usuario, correo..." />
                        </div>
                        <div>
                            <label htmlFor="metodoPago" className="block text-sm font-medium mb-1">Método de Pago:</label>
                            <select name="metodoPago" id="metodoPago" value={filters.metodoPago} onChange={handleFilterChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black">
                                <option value="">Todos</option>
                                {Object.values(MetodoPago).map(met => (<option key={met} value={met}>{met.replace(/_/g, ' ')}</option>))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="estadoPago" className="block text-sm font-medium mb-1">Estado del Pago:</label>
                            <select name="estadoPago" id="estadoPago" value={filters.estadoPago} onChange={handleFilterChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black">
                                <option value="">Todos</option>
                                {Object.values(EstadoPago).map(est => (<option key={est} value={est}>{est.replace(/_/g, ' ')}</option>))}
                            </select>
                        </div>
                    </header>
                    <footer className='flex flex-wrap gap-4 items-center mt-2'>
                        <button type="submit" disabled={isLoading} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 disabled:opacity-60">
                            {isLoading ? 'Buscando...' : 'Buscar Pagos'}
                        </button>
                        <button type="button" onClick={handleResetFilters} disabled={isLoading} className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 disabled:opacity-60">
                            Limpiar Filtros
                        </button>
                    </footer>
                </section>
            </form>

            {alert.show && <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ show: false })} />}

            <SeccionLista>
                <THPagos />
                <tbody className='bg-gray-300'>
                    {isLoading && pagosToDisplay.length === 0 ? (
                        <tr><TdGeneral colSpan="8" className="text-center py-4">Cargando...</TdGeneral></tr>
                    ) : !isLoading && pagosToDisplay.length === 0 ? (
                        <tr><TdGeneral colSpan="8" className="text-center py-4">No se encontraron pagos.</TdGeneral></tr>
                    ) : (
                        pagosToDisplay.map((pago) => (
                            <tr key={pago._id} className="border-b border-gray-200 hover:bg-gray-100">
                                <TdGeneral>{pago._id}</TdGeneral>
                                <TdGeneral>{pago.usuarioId?.nombreUsuario || pago.usuarioId?.correo || 'N/A'}</TdGeneral>
                                <TdGeneral>{pago.ventaId?._id || 'N/A'}</TdGeneral>
                                <TdGeneral>{pago.valorPago}</TdGeneral>
                                <TdGeneral>{pago.metodoPago.replace(/_/g, ' ')}</TdGeneral>
                                <TdGeneral>{pago.estadoPago.replace(/_/g, ' ')}</TdGeneral>
                                <TdGeneral>{pago.fechaRealizacion ? new Date(pago.fechaRealizacion).toLocaleDateString() : (pago.createdAt ? new Date(pago.createdAt).toLocaleDateString() : 'N/A')}</TdGeneral>
                                <td className="border border-gray-400 px-4 py-2 flex flex-col gap-1 md:flex-row md:gap-2 items-center justify-center">
                                    <Link href={`/admin/pagos/editar/${pago._id.toString()}`} passHref>
                                        <BotonEditar className="w-full md:w-auto text-sm">Editar Estado</BotonEditar>
                                    </Link>
                                    {/* No hay botón de eliminar para pagos */}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </SeccionLista>
        </>
    );
}
