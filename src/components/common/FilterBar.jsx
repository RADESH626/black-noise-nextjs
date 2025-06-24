"use client";

import React, { useState, useEffect } from 'react';
import { BotonAccion } from '@/components/common/botones/BotonAccion';

function FilterBar({ onFilterChange, initialFilters = {}, additionalFilters = [] }) {
    const [filters, setFilters] = useState(initialFilters);

    useEffect(() => {
        setFilters(initialFilters);
    }, [initialFilters]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleApplyFilters = () => {
        onFilterChange(filters);
    };

    const handleClearFilters = () => {
        const clearedFilters = {};
        // Clear all filter values based on additionalFilters structure
        additionalFilters.forEach(filter => {
            if (filter.type === 'checkbox') {
                clearedFilters[filter.name] = false;
            } else {
                clearedFilters[filter.name] = '';
            }
        });
        setFilters(clearedFilters);
        onFilterChange(clearedFilters);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-4">Filtros de Búsqueda</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {additionalFilters.map((filter, index) => (
                    <div key={filter.name || index}>
                        <label htmlFor={filter.name} className="block text-sm font-medium text-gray-700">
                            {filter.label}
                        </label>
                        {filter.type === 'text' || filter.type === 'number' || filter.type === 'date' ? (
                            <input
                                type={filter.type}
                                id={filter.name}
                                name={filter.name}
                                value={filters[filter.name] || ''}
                                onChange={handleChange}
                                placeholder={filter.placeholder}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        ) : filter.type === 'select' ? (
                            <select
                                id={filter.name}
                                name={filter.name}
                                value={filters[filter.name] || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                {filter.options.map((option, idx) => (
                                    <option key={option.value || idx} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        ) : filter.type === 'checkbox' ? (
                            <input
                                type="checkbox"
                                id={filter.name}
                                name={filter.name}
                                checked={filters[filter.name] || false}
                                onChange={handleChange}
                                className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                        ) : null}
                    </div>
                ))}
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
