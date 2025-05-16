"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { InputTextoGeneral } from '@/components/common/inputs';
import TdGeneral from '@/components/common/tablas/TdGeneral';
import { BotonEditar, BotonEliminar } from '@/components/common/botones'; // Import BotonEliminar
import SeccionLista from '@/components/layout/admin/secciones/lista/SeccionLista';
import { obtenerSolicitudesProveedor, eliminarSolicitudProveedor } from '@/app/acciones/SolicitudProveedorActions'; // Import eliminarSolicitudProveedor
import { EstadoSolicitud } from '@/models/enums/SolicitudProveedorEnums';
import { Especialidad } from '@/models/enums/proveedor';
import Alert from '@/components/common/Alert';

const THSolicitudes = () => (
    <thead>
        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">ID Solicitud</th>
            <th className="py-3 px-6 text-left">Solicitante</th>
            <th className="py-3 px-6 text-left">Nombre Proveedor Propuesto</th>
            <th className="py-3 px-6 text-left">NIT</th>
            <th className="py-3 px-6 text-left">Especialidad</th>
            <th className="py-3 px-6 text-left">Estado</th>
            <th className="py-3 px-6 text-left">Fecha Solicitud</th>
            <th className="py-3 px-6 text-center">Acciones</th>
        </tr>
    </thead>
);

export default function FormFiltrarSolicitudesProveedor({ initialSolicitudesFromPage = [] }) {
    const [solicitudesToDisplay, setSolicitudesToDisplay] = useState(initialSolicitudesFromPage);
    const [isLoading, setIsLoading] = useState(false);
    const [formKey, setFormKey] = useState(Date.now());
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });
    const [filters, setFilters] = useState({
        textoBusqueda: '', // Para buscar por ID Solicitud, Nombre Solicitante, Nombre Proveedor, NIT
        estadoSolicitud: '',
        especialidad: '',
    });

    useEffect(() => {
        setSolicitudesToDisplay(initialSolicitudesFromPage);
    }, [initialSolicitudesFromPage]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };
    
    const fetchAllOrFilteredSolicitudes = async () => {
        setIsLoading(true);
        setAlert({ show: false, type: '', message: '' });
        
        const result = await obtenerSolicitudesProveedor(); 

        if (result && result.solicitudes) {
            let filtered = result.solicitudes;
            if (filters.textoBusqueda) {
                const searchTerm = filters.textoBusqueda.toLowerCase();
                filtered = filtered.filter(s => 
                    s._id.toLowerCase().includes(searchTerm) ||
                    (s.solicitanteId?.nombreUsuario && s.solicitanteId.nombreUsuario.toLowerCase().includes(searchTerm)) ||
                    (s.solicitanteId?.correo && s.solicitanteId.correo.toLowerCase().includes(searchTerm)) ||
                    s.nombreProveedor.toLowerCase().includes(searchTerm) ||
                    s.nit.toLowerCase().includes(searchTerm)
                );
            }
            if (filters.estadoSolicitud) {
                filtered = filtered.filter(s => s.estadoSolicitud === filters.estadoSolicitud);
            }
            if (filters.especialidad) {
                filtered = filtered.filter(s => s.especialidad === filters.especialidad);
            }
            setSolicitudesToDisplay(filtered);
        } else {
            setAlert({ show: true, type: 'error', message: result.error || 'Error al cargar solicitudes.' });
            setSolicitudesToDisplay([]);
        }
        setIsLoading(false);
    };

    const handleSearchSubmit = async (event) => {
        event.preventDefault();
        await fetchAllOrFilteredSolicitudes();
    };

    const handleResetFilters = async () => {
        setFormKey(Date.now());
        setFilters({ textoBusqueda: '', estadoSolicitud: '', especialidad: '' });
        setIsLoading(true);
        const result = await obtenerSolicitudesProveedor();
        if (result && result.solicitudes) {
            setSolicitudesToDisplay(result.solicitudes);
        } else {
            setAlert({ show: true, type: 'error', message: result.error || 'Error al cargar solicitudes.' });
            setSolicitudesToDisplay(initialSolicitudesFromPage);
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
                            <label htmlFor="textoBusqueda" className="block text-sm font-medium mb-1">Buscar (ID, Solicitante, Proveedor, NIT):</label>
                            <InputTextoGeneral id="textoBusqueda" name="textoBusqueda" value={filters.textoBusqueda} onChange={handleFilterChange} placeholder="ID, Solicitante, Proveedor, NIT..." />
                        </div>
                        <div>
                            <label htmlFor="estadoSolicitud" className="block text-sm font-medium mb-1">Estado:</label>
                            <select name="estadoSolicitud" id="estadoSolicitud" value={filters.estadoSolicitud} onChange={handleFilterChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black">
                                <option value="">Todos</option>
                                {Object.values(EstadoSolicitud).map(est => (<option key={est} value={est}>{est.replace(/_/g, ' ')}</option>))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="especialidad" className="block text-sm font-medium mb-1">Especialidad:</label>
                            <select name="especialidad" id="especialidad" value={filters.especialidad} onChange={handleFilterChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black">
                                <option value="">Todas</option>
                                {Object.values(Especialidad).map(esp => (<option key={esp} value={esp}>{esp.replace(/_/g, ' ')}</option>))}
                            </select>
                        </div>
                    </header>
                    <footer className='flex flex-wrap gap-4 items-center mt-2'>
                        <button type="submit" disabled={isLoading} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 disabled:opacity-60">
                            {isLoading ? 'Buscando...' : 'Buscar Solicitudes'}
                        </button>
                        <button type="button" onClick={handleResetFilters} disabled={isLoading} className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 disabled:opacity-60">
                            Limpiar Filtros
                        </button>
                    </footer>
                </section>
            </form>

            {alert.show && <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ show: false })} />}

            <SeccionLista>
                <THSolicitudes />
                <tbody className='bg-gray-300'>
                    {isLoading && solicitudesToDisplay.length === 0 ? (
                        <tr><TdGeneral colSpan="8" className="text-center py-4">Cargando...</TdGeneral></tr>
                    ) : !isLoading && solicitudesToDisplay.length === 0 ? (
                        <tr><TdGeneral colSpan="8" className="text-center py-4">No se encontraron solicitudes.</TdGeneral></tr>
                    ) : (
                        solicitudesToDisplay.map((sol) => (
                            <tr key={sol._id} className="border-b border-gray-200 hover:bg-gray-100">
                                <TdGeneral>{sol._id}</TdGeneral>
                                <TdGeneral>{sol.solicitanteId?.nombreUsuario || sol.solicitanteId?.correo || 'N/A'}</TdGeneral>
                                <TdGeneral>{sol.nombreProveedor}</TdGeneral>
                                <TdGeneral>{sol.nit}</TdGeneral>
                                <TdGeneral>{sol.especialidad.replace(/_/g, ' ')}</TdGeneral>
                                <TdGeneral>{sol.estadoSolicitud.replace(/_/g, ' ')}</TdGeneral>
                                <TdGeneral>{formatDate(sol.fechaSolicitud)}</TdGeneral>
                                <td className="border border-gray-400 px-4 py-2 flex flex-col gap-1 md:flex-row md:gap-2 items-center justify-center">
                                    <Link href={`/admin/solicitudes-proveedor/editar/${sol._id.toString()}`} passHref>
                                        <BotonEditar className="w-full md:w-auto text-sm">Revisar</BotonEditar>
                                    </Link>
                                    <BotonEliminar className="w-full md:w-auto text-sm" onClick={() => handleDelete(sol._id)}>Eliminar</BotonEliminar> {/* Add Delete Button */}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </SeccionLista>
        </>
    );

    async function handleDelete(solicitudId) {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta solicitud?')) {
            setIsLoading(true);
            setAlert({ show: false, type: '', message: '' });
            const result = await eliminarSolicitudProveedor(solicitudId);
            if (result.error) {
                setAlert({ show: true, type: 'error', message: `Error al eliminar solicitud: ${result.error}` });
            } else {
                setAlert({ show: true, type: 'success', message: result.message });
                // Update the displayed list by refetching or filtering
                await fetchAllOrFilteredSolicitudes(); // Refetch to update the list
            }
            setIsLoading(false);
        }
    }
}
