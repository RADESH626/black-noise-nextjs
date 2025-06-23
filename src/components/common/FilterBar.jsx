"use client";

import React, { useState, useEffect } from 'react';
import { BotonAccion } from '@/components/common/botones/BotonAccion';

function FilterBar({ onFilterChange, initialFilters = {} }) {
    const [filters, setFilters] = useState(initialFilters);

    useEffect(() => {
        setFilters(initialFilters);
    }, [initialFilters]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const handleDateChange = (name, date) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: date
        }));
    };

    const handleApplyFilters = () => {
        onFilterChange(filters);
    };

    const handleClearFilters = () => {
        const clearedFilters = Object.keys(filters).reduce((acc, key) => {
            acc[key] = ''; // Clear all filter values
            return acc;
        }, {});
        setFilters(clearedFilters);
        onFilterChange(clearedFilters);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-4">Filtros de Búsqueda</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="searchText" className="block text-sm font-medium text-gray-700">Buscar por texto:</label>
                    <input
                        type="text"
                        id="searchText"
                        name="searchText"
                        value={filters.searchText || ''}
                        onChange={handleChange}
                        placeholder="Nombre, ID, etc."
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Fecha Inicio:</label>
                    <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={filters.startDate || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Fecha Fin:</label>
                    <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={filters.endDate || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                {/* Ejemplo de filtro de estado, se puede hacer dinámico si es necesario */}
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Estado:</label>
                    <select
                        id="status"
                        name="status"
                        value={filters.status || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="">Todos</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="completado">Completado</option>
                        <option value="cancelado">Cancelado</option>
                        {/* Añadir más opciones según sea necesario */}
                    </select>
                </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
                <BotonAccion
                    texto="Limpiar Filtros"
                    tipo="secundario"
                    onClick={handleClearFilters}
                />
                <BotonAccion
                    texto="Aplicar Filtros"
                    tipo="primario"
                    onClick={handleApplyFilters}
                />
            </div>
        </div>
    );
}

export default FilterBar;
