"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { InputTextoGeneral, InputCheckBox } from '@/components/common/inputs';
import TdGeneral from '@/components/common/tablas/TdGeneral';
import { BotonEditar, BotonGeneral as BotonAccion } from '@/components/common/botones';
import SeccionLista from '@/components/layout/admin/secciones/lista/SeccionLista';
import { obtenerElementos, obtenerElementosHabilitados, EliminarElemento, HabilitarElemento /*, FiltrarElementos */ } from '@/app/acciones/ElementoActions';
import { TipoElemento } from '@/models/enums/elemento/TipoElemento';
import { MaterialElemento } from '@/models/enums/elemento/MaterialElemento';
import Alert from '@/components/common/Alert';

// Placeholder para THElementos
const THElementos = () => (
    <thead>
        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Nombre</th>
            <th className="py-3 px-6 text-left">Tipo</th>
            <th className="py-3 px-6 text-left">Material</th>
            <th className="py-3 px-6 text-left">Valor</th>
            <th className="py-3 px-6 text-left">Recurso (URL)</th>
            <th className="py-3 px-6 text-left">Estado</th>
            <th className="py-3 px-6 text-center">Acciones</th>
        </tr>
    </thead>
);

export default function FormFiltrarElementos({ initialElementosFromPage = [] }) {
    const [elementosToDisplay, setElementosToDisplay] = useState(initialElementosFromPage);
    const [isLoading, setIsLoading] = useState(false);
    const [formKey, setFormKey] = useState(Date.now());
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });
    const [filters, setFilters] = useState({
        textoBusqueda: '',
        tipoElemento: '',
        materialElemento: '',
        incluirDeshabilitados: false,
    });

    useEffect(() => {
        setElementosToDisplay(initialElementosFromPage);
    }, [initialElementosFromPage]);

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    
    const fetchAllOrFilteredElementos = async () => {
        setIsLoading(true);
        setAlert({ show: false, type: '', message: '' });
        let result;
        if (filters.incluirDeshabilitados) {
            result = await obtenerElementos(); // Obtiene todos, habilitados y deshabilitados
        } else {
            result = await obtenerElementosHabilitados(); // Obtiene solo habilitados
        }

        if (result && result.elementos) {
            // Aplicar filtros de texto, tipo y material del lado del cliente por ahora
            let filtered = result.elementos;
            if (filters.textoBusqueda) {
                filtered = filtered.filter(el => el.nombreElemento.toLowerCase().includes(filters.textoBusqueda.toLowerCase()));
            }
            if (filters.tipoElemento) {
                filtered = filtered.filter(el => el.tipoElemento === filters.tipoElemento);
            }
            if (filters.materialElemento) {
                filtered = filtered.filter(el => el.materialElemento === filters.materialElemento);
            }
            setElementosToDisplay(filtered);
        } else {
            setAlert({ show: true, type: 'error', message: result.error || 'Error al cargar elementos.' });
            setElementosToDisplay(filters.incluirDeshabilitados ? [] : initialElementosFromPage);
        }
        setIsLoading(false);
    };

    const handleSearchSubmit = async (event) => {
        event.preventDefault();
        await fetchAllOrFilteredElementos();
    };

    const handleResetFilters = async () => {
        setFormKey(Date.now());
        setFilters({ textoBusqueda: '', tipoElemento: '', materialElemento: '', incluirDeshabilitados: false });
        // Recargar con filtros reseteados (mostrará solo habilitados por defecto)
        setIsLoading(true);
        const result = await obtenerElementosHabilitados();
        if (result && result.elementos) {
            setElementosToDisplay(result.elementos);
        } else {
            setAlert({ show: true, type: 'error', message: result.error || 'Error al cargar elementos.' });
            setElementosToDisplay(initialElementosFromPage);
        }
        setIsLoading(false);
    };

    const handleToggleHabilitado = async (id, actualmenteHabilitado) => {
        setIsLoading(true);
        setAlert({ show: false, type: '', message: '' });
        const action = actualmenteHabilitado ? EliminarElemento : HabilitarElemento;
        const result = await action(id);
        if (result.success) {
            setAlert({ show: true, type: 'success', message: result.message });
            await fetchAllOrFilteredElementos(); // Recargar lista con filtros actuales
        } else {
            setAlert({ show: true, type: 'error', message: result.error || 'Error al cambiar estado del elemento.' });
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
                            <InputTextoGeneral id="textoBusqueda" name="textoBusqueda" value={filters.textoBusqueda} onChange={handleFilterChange} placeholder="Nombre del elemento..." />
                        </div>
                        <div>
                            <label htmlFor="tipoElemento" className="block text-sm font-medium mb-1">Tipo:</label>
                            <select name="tipoElemento" id="tipoElemento" value={filters.tipoElemento} onChange={handleFilterChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black">
                                <option value="">Todos</option>
                                {Object.values(TipoElemento).map(tipo => (<option key={tipo} value={tipo}>{tipo}</option>))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="materialElemento" className="block text-sm font-medium mb-1">Material:</label>
                            <select name="materialElemento" id="materialElemento" value={filters.materialElemento} onChange={handleFilterChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black">
                                <option value="">Todos</option>
                                {Object.values(MaterialElemento).map(mat => (<option key={mat} value={mat}>{mat}</option>))}
                            </select>
                        </div>
                    </header>
                    <footer className='flex flex-wrap gap-4 items-center mt-2'>
                        <div className='flex gap-2 items-center'>
                            <InputCheckBox id="incluirDeshabilitados" name="incluirDeshabilitados" checked={filters.incluirDeshabilitados} onChange={handleFilterChange} />
                            <label htmlFor="incluirDeshabilitados" className="text-sm">Incluir Deshabilitados</label>
                        </div>
                        <button type="submit" disabled={isLoading} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 disabled:opacity-60">
                            {isLoading ? 'Buscando...' : 'Buscar Elementos'}
                        </button>
                        <button type="button" onClick={handleResetFilters} disabled={isLoading} className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 disabled:opacity-60">
                            Limpiar Filtros
                        </button>
                    </footer>
                </section>
            </form>

            {alert.show && <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ show: false })} />}

            <SeccionLista>
                <THElementos />
                <tbody className='bg-gray-300'>
                    {isLoading && elementosToDisplay.length === 0 ? (
                        <tr><TdGeneral colSpan="7" className="text-center py-4">Cargando...</TdGeneral></tr>
                    ) : !isLoading && elementosToDisplay.length === 0 ? (
                        <tr><TdGeneral colSpan="7" className="text-center py-4">No se encontraron elementos.</TdGeneral></tr>
                    ) : (
                        elementosToDisplay.map((elemento) => (
                            <tr key={elemento._id} className="border-b border-gray-200 hover:bg-gray-100">
                                <TdGeneral>{elemento.nombreElemento}</TdGeneral>
                                <TdGeneral>{elemento.tipoElemento}</TdGeneral>
                                <TdGeneral>{elemento.materialElemento}</TdGeneral>
                                <TdGeneral>{elemento.valorElemento}</TdGeneral>
                                <TdGeneral><a href={elemento.recurso} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Ver Recurso</a></TdGeneral>
                                <TdGeneral>{elemento.habilitado ? "Habilitado" : "Deshabilitado"}</TdGeneral>
                                <td className="border border-gray-400 px-4 py-2 flex flex-col gap-1 md:flex-row md:gap-2 items-center justify-center">
                                    <Link href={`/admin/elementos/editar/${elemento._id.toString()}`} passHref>
                                        <BotonEditar className="w-full md:w-auto text-sm">Editar</BotonEditar>
                                    </Link>
                                    <BotonAccion
                                        onClick={() => handleToggleHabilitado(elemento._id.toString(), elemento.habilitado)}
                                        className={`w-full md:w-auto text-sm ${elemento.habilitado ? 'bg-red-500 hover:bg-red-700' : 'bg-green-500 hover:bg-green-700'}`}
                                    >
                                        {elemento.habilitado ? 'Deshabilitar' : 'Habilitar'}
                                    </BotonAccion>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </SeccionLista>
        </>
    );
}
