"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { InputTextoGeneral } from '@/components/common/inputs';
import TdGeneral from '@/components/common/tablas/TdGeneral';
import { BotonEditar, BotonGeneral } from '@/components/common/botones';
import SeccionLista from '@/components/layout/admin/secciones/lista/SeccionLista';
import { obtenerProveedores, CambiarDisponibilidadProveedor } from '@/app/acciones/ProveedorActions';
import { Disponibilidad, Especialidad } from '@/models/enums/proveedor';
import Alert from '@/components/common/Alert';

const THProveedores = () => (
    <thead>
        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Nombre</th>
            <th className="py-3 px-6 text-left">NIT</th>
            <th className="py-3 px-6 text-left">Usuario Asociado</th>
            <th className="py-3 px-6 text-left">Especialidad</th>
            <th className="py-3 px-6 text-left">Disponibilidad</th>
            <th className="py-3 px-6 text-left">Comisión (%)</th>
            <th className="py-3 px-6 text-center">Acciones</th>
        </tr>
    </thead>
);

export default function FormFiltrarProveedores({ initialProveedoresFromPage = [] }) {
    const [proveedoresToDisplay, setProveedoresToDisplay] = useState(initialProveedoresFromPage);
    const [isLoading, setIsLoading] = useState(false);
    const [formKey, setFormKey] = useState(Date.now());
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });
    const [filters, setFilters] = useState({
        textoBusqueda: '', // Para buscar por nombre, NIT
        especialidad: '',
        disponibilidad: '', // Para filtrar por todos, disponibles, no disponibles
    });

    useEffect(() => {
        // Cargar todos los proveedores al inicio si no se pasan initiales, o si se quiere recargar
        // Por ahora, usamos initialProveedoresFromPage que ya trae los habilitados por defecto
        // Si se quiere mostrar todos, se debe llamar a obtenerProveedores()
        setProveedoresToDisplay(initialProveedoresFromPage);
    }, [initialProveedoresFromPage]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };
    
    const fetchAllOrFilteredProveedores = async () => {
        setIsLoading(true);
        setAlert({ show: false, type: '', message: '' });
        
        const result = await obtenerProveedores(); // Obtiene todos para filtrar en cliente

        if (result && result.proveedores) {
            let filtered = result.proveedores;
            if (filters.textoBusqueda) {
                const searchTerm = filters.textoBusqueda.toLowerCase();
                filtered = filtered.filter(p => 
                    p.nombreProveedor.toLowerCase().includes(searchTerm) ||
                    p.nit.toLowerCase().includes(searchTerm) ||
                    (p.usuarioId?.nombreUsuario && p.usuarioId.nombreUsuario.toLowerCase().includes(searchTerm)) ||
                    (p.usuarioId?.correo && p.usuarioId.correo.toLowerCase().includes(searchTerm))
                );
            }
            if (filters.especialidad) {
                filtered = filtered.filter(p => p.especialidad === filters.especialidad);
            }
            if (filters.disponibilidad) {
                filtered = filtered.filter(p => p.disponibilidad === filters.disponibilidad);
            }
            setProveedoresToDisplay(filtered);
        } else {
            setAlert({ show: true, type: 'error', message: result.error || 'Error al cargar proveedores.' });
            setProveedoresToDisplay([]);
        }
        setIsLoading(false);
    };

    const handleSearchSubmit = async (event) => {
        event.preventDefault();
        await fetchAllOrFilteredProveedores();
    };

    const handleResetFilters = async () => {
        setFormKey(Date.now());
        setFilters({ textoBusqueda: '', especialidad: '', disponibilidad: '' });
        setIsLoading(true);
        // Volver a cargar los habilitados por defecto o todos según se decida
        const result = await obtenerProveedores(); 
        if (result && result.proveedores) {
            setProveedoresToDisplay(result.proveedores);
        } else {
            setAlert({ show: true, type: 'error', message: result.error || 'Error al cargar proveedores.' });
            setProveedoresToDisplay(initialProveedoresFromPage); // Fallback a los iniciales
        }
        setIsLoading(false);
    };

    const toggleDisponibilidad = async (proveedorId, currentDisponibilidad) => {
        setIsLoading(true);
        setAlert({ show: false, type: '', message: '' });
        const nuevaDisponibilidad = currentDisponibilidad === Disponibilidad.DISPONIBLE ? Disponibilidad.NO_DISPONIBLE : Disponibilidad.DISPONIBLE;
        const result = await CambiarDisponibilidadProveedor(proveedorId, nuevaDisponibilidad);
        if (result.success) {
            setAlert({ show: true, type: 'success', message: result.message });
            // Recargar la lista para reflejar el cambio
            await fetchAllOrFilteredProveedores(); 
        } else {
            setAlert({ show: true, type: 'error', message: result.error || 'Error al cambiar disponibilidad.' });
        }
        setIsLoading(false);
    };

    return (
        <>
            <form onSubmit={handleSearchSubmit} key={formKey}>
                <section className="flex flex-col gap-2 bg-black rounded-lg justify-center items-top p-4 w-full text-white mb-4">
                    <header className='flex flex-wrap gap-4 items-end'>
                        <div>
                            <label htmlFor="textoBusqueda" className="block text-sm font-medium mb-1">Buscar (Nombre, NIT, Usuario):</label>
                            <InputTextoGeneral id="textoBusqueda" name="textoBusqueda" value={filters.textoBusqueda} onChange={handleFilterChange} placeholder="Nombre, NIT, Usuario..." />
                        </div>
                        <div>
                            <label htmlFor="especialidad" className="block text-sm font-medium mb-1">Especialidad:</label>
                            <select name="especialidad" id="especialidad" value={filters.especialidad} onChange={handleFilterChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black">
                                <option value="">Todas</option>
                                {Object.values(Especialidad).map(esp => (<option key={esp} value={esp}>{esp.replace(/_/g, ' ')}</option>))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="disponibilidad" className="block text-sm font-medium mb-1">Disponibilidad:</label>
                            <select name="disponibilidad" id="disponibilidad" value={filters.disponibilidad} onChange={handleFilterChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black">
                                <option value="">Todas</option>
                                {Object.values(Disponibilidad).map(disp => (<option key={disp} value={disp}>{disp.replace(/_/g, ' ')}</option>))}
                            </select>
                        </div>
                    </header>
                    <footer className='flex flex-wrap gap-4 items-center mt-2'>
                        <button type="submit" disabled={isLoading} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 disabled:opacity-60">
                            {isLoading ? 'Buscando...' : 'Buscar Proveedores'}
                        </button>
                        <button type="button" onClick={handleResetFilters} disabled={isLoading} className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 disabled:opacity-60">
                            Limpiar Filtros
                        </button>
                    </footer>
                </section>
            </form>

            {alert.show && <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ show: false })} />}

            <SeccionLista>
                <THProveedores />
                <tbody className='bg-gray-300'>
                    {isLoading && proveedoresToDisplay.length === 0 ? (
                        <tr><TdGeneral colSpan="7" className="text-center py-4">Cargando...</TdGeneral></tr>
                    ) : !isLoading && proveedoresToDisplay.length === 0 ? (
                        <tr><TdGeneral colSpan="7" className="text-center py-4">No se encontraron proveedores.</TdGeneral></tr>
                    ) : (
                        proveedoresToDisplay.map((prov) => (
                            <tr key={prov._id} className="border-b border-gray-200 hover:bg-gray-100">
                                <TdGeneral>{prov.nombreProveedor}</TdGeneral>
                                <TdGeneral>{prov.nit}</TdGeneral>
                                <TdGeneral>{prov.usuarioId?.nombreUsuario || prov.usuarioId?.correo || 'N/A'}</TdGeneral>
                                <TdGeneral>{prov.especialidad.replace(/_/g, ' ')}</TdGeneral>
                                <TdGeneral>{prov.disponibilidad.replace(/_/g, ' ')}</TdGeneral>
                                <TdGeneral>{prov.comision}</TdGeneral>
                                <td className="border border-gray-400 px-4 py-2 flex flex-col gap-1 md:flex-row md:gap-2 items-center justify-center">
                                    <Link href={`/admin/proveedores/editar/${prov._id.toString()}`} passHref>
                                        <BotonEditar className="w-full md:w-auto text-sm">Editar</BotonEditar>
                                    </Link>
                                    <BotonGeneral 
                                        onClick={() => toggleDisponibilidad(prov._id, prov.disponibilidad)}
                                        className={`w-full md:w-auto text-sm ${prov.disponibilidad === Disponibilidad.DISPONIBLE ? 'bg-red-500 hover:bg-red-700' : 'bg-green-500 hover:bg-green-700'}`}
                                        disabled={isLoading}
                                    >
                                        {prov.disponibilidad === Disponibilidad.DISPONIBLE ? 'Deshabilitar' : 'Habilitar'}
                                    </BotonGeneral>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </SeccionLista>
        </>
    );
}
