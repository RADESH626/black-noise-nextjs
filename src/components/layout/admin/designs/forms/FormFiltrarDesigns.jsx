"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { InputTextoGeneral, InputCheckBox } from '@/components/common/inputs'; // Asumiendo inputs genéricos
import TdGeneral from '@/components/common/tablas/TdGeneral';
// import THDesigns from '@/components/layout/admin/designs/THDesigns'; // Crear este componente
import { BotonEditar, BotonEliminar } from '@/components/common/botones'; // Asumiendo botones genéricos o crear específicos
// import BotonExportarPDFDesigns from '@/components/common/botones/BotonExportarPDFDesigns'; // Crear si es necesario
import SeccionLista from '@/components/layout/admin/secciones/lista/SeccionLista';
import { obtenerDesigns, EliminarDesign /*, FiltrarDesigns */ } from '@/app/acciones/DesignActions'; // Asumiendo FiltrarDesigns
import { CategoriaDesing } from '@/models/enums/design/CategoriaDesing';
import { EstadoDesing } from '@/models/enums/design/EstadoDesing';
import Alert from '@/components/common/Alert';

// Placeholder para THDesigns hasta que se cree
const THDesigns = () => (
    <thead>
        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Nombre</th>
            <th className="py-3 px-6 text-left">Categoría</th>
            <th className="py-3 px-6 text-left">Valor</th>
            <th className="py-3 px-6 text-left">Estado</th>
            <th className="py-3 px-6 text-left">Fecha Creación</th>
            <th className="py-3 px-6 text-center">Acciones</th>
        </tr>
    </thead>
);


export default function FormFiltrarDesigns({ initialDesignsFromPage = [] }) {
    const [designsToDisplay, setDesignsToDisplay] = useState(initialDesignsFromPage);
    const [isLoading, setIsLoading] = useState(false);
    const [formKey, setFormKey] = useState(Date.now());
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });
    const [filters, setFilters] = useState({
        textoBusqueda: '',
        categoria: '',
        estadoDesing: ''
    });

    useEffect(() => {
        setDesignsToDisplay(initialDesignsFromPage);
    }, [initialDesignsFromPage]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };
    
    const fetchAllDesigns = async () => {
        setIsLoading(true);
        const result = await obtenerDesigns();
        if (result && result.designs) {
            setDesignsToDisplay(result.designs);
        } else {
            setAlert({ show: true, type: 'error', message: result.error || 'Error al cargar diseños.' });
            setDesignsToDisplay(initialDesignsFromPage);
        }
        setIsLoading(false);
    };

    const handleSearchSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setAlert({ show: false, type: '', message: '' });

        // Lógica de filtrado (pendiente de implementar la action FiltrarDesigns)
        // Por ahora, si hay filtros, muestra un mensaje. Si no, carga todos.
        if (filters.textoBusqueda || filters.categoria || filters.estadoDesing) {
            // const result = await FiltrarDesigns(filters); // Descomentar cuando exista FiltrarDesigns
            // if (result && result.data) {
            //     setDesignsToDisplay(result.data);
            // } else {
            //     setAlert({ show: true, type: 'error', message: result.error || 'Error al filtrar diseños.' });
            //     setDesignsToDisplay([]);
            // }
            setAlert({ show: true, type: 'info', message: 'Funcionalidad de filtro pendiente. Mostrando todos los diseños.' });
            await fetchAllDesigns(); // Carga todos mientras el filtro no está
        } else {
            await fetchAllDesigns();
        }
        setIsLoading(false);
    };

    const handleResetFilters = async () => {
        setFormKey(Date.now());
        setFilters({ textoBusqueda: '', categoria: '', estadoDesing: '' });
        await fetchAllDesigns();
    };

    const handleDeleteDesign = async (id) => {
        setIsLoading(true);
        setAlert({ show: false, type: '', message: '' });
        const confirmation = window.confirm("¿Estás seguro de que quieres eliminar este diseño?");
        if (confirmation) {
            const result = await EliminarDesign(id);
            if (result.success) {
                setAlert({ show: true, type: 'success', message: 'Diseño eliminado exitosamente.' });
                await fetchAllDesigns(); // Recargar lista
            } else {
                setAlert({ show: true, type: 'error', message: result.error || 'Error al eliminar el diseño.' });
            }
        }
        setIsLoading(false);
    };

    return (
        <>
            <form onSubmit={handleSearchSubmit} key={formKey}>
                <section className="flex flex-col gap-2 bg-black rounded-lg justify-center items-top p-4 w-full text-white mb-4">
                    <header className='flex flex-wrap gap-4 items-end'>
                        <div>
                            <label htmlFor="textoBusqueda" className="block text-sm font-medium mb-1">Buscar por Nombre:</label>
                            <InputTextoGeneral id="textoBusqueda" name="textoBusqueda" value={filters.textoBusqueda} onChange={handleFilterChange} placeholder="Nombre del diseño..." />
                        </div>
                        <div>
                            <label htmlFor="categoria" className="block text-sm font-medium mb-1">Categoría:</label>
                            <select name="categoria" id="categoria" value={filters.categoria} onChange={handleFilterChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black">
                                <option value="">Todas</option>
                                {Object.values(CategoriaDesing).map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="estadoDesing" className="block text-sm font-medium mb-1">Estado:</label>
                            <select name="estadoDesing" id="estadoDesing" value={filters.estadoDesing} onChange={handleFilterChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black">
                                <option value="">Todos</option>
                                {Object.values(EstadoDesing).map(est => (<option key={est} value={est}>{est}</option>))}
                            </select>
                        </div>
                    </header>
                    <footer className='flex flex-wrap gap-4 items-center mt-2'>
                        <button type="submit" disabled={isLoading} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 disabled:opacity-60">
                            {isLoading ? 'Buscando...' : 'Buscar Diseños'}
                        </button>
                        <button type="button" onClick={handleResetFilters} disabled={isLoading} className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 disabled:opacity-60">
                            Limpiar Filtros
                        </button>
                        {/* <BotonExportarPDFDesigns designs={designsToDisplay} /> */}
                    </footer>
                </section>
            </form>

            {alert.show && <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ show: false })} />}

            <SeccionLista>
                <THDesigns />
                <tbody className='bg-gray-300'>
                    {isLoading && designsToDisplay.length === 0 ? (
                        <tr><TdGeneral colSpan="6" className="text-center py-4">Cargando...</TdGeneral></tr>
                    ) : !isLoading && designsToDisplay.length === 0 ? (
                        <tr><TdGeneral colSpan="6" className="text-center py-4">No se encontraron diseños.</TdGeneral></tr>
                    ) : (
                        designsToDisplay.map((design) => (
                            <tr key={design._id} className="border-b border-gray-200 hover:bg-gray-100">
                                <TdGeneral>{design.nombreDesing}</TdGeneral>
                                <TdGeneral>{design.categoria}</TdGeneral>
                                <TdGeneral>{design.valorDesing}</TdGeneral>
                                <TdGeneral>{design.estadoDesing}</TdGeneral>
                                <TdGeneral>{design.createdAt ? new Date(design.createdAt).toLocaleDateString() : 'N/A'}</TdGeneral>
                                <td className="border border-gray-400 px-4 py-2 flex flex-col gap-1 md:flex-row md:gap-2 items-center justify-center">
                                    <Link href={`/admin/designs/editar/${design._id.toString()}`} passHref>
                                        <BotonEditar className="w-full md:w-auto text-sm">Editar</BotonEditar>
                                    </Link>
                                    <BotonEliminar onClick={() => handleDeleteDesign(design._id.toString())} className="w-full md:w-auto text-sm bg-red-500 hover:bg-red-700">
                                        Eliminar
                                    </BotonEliminar>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </SeccionLista>
        </>
    );
}
