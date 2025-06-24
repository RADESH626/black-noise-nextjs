"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import InputGeneral from "@/components/common/inputs/InputGeneral";
import BotonGeneral from "@/components/common/botones/BotonGeneral";
import InputSelectGeneral from "@/components/common/inputs/InputSelectGeneral";

const DesignFilters = ({ onApplyFilters, onClearFilters }) => {
    const { register, handleSubmit, reset, setValue, watch } = useForm();
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedEstado, setSelectedEstado] = useState('');
    const [selectedTallas, setSelectedTallas] = useState([]);

    const tallasDisponiblesOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL']; // Example sizes

    useEffect(() => {
        setValue('categoria', selectedCategory);
    }, [selectedCategory, setValue]);

    useEffect(() => {
        setValue('estadoDesing', selectedEstado);
    }, [selectedEstado, setValue]);

    useEffect(() => {
        setValue('tallasDisponibles', selectedTallas.join(','));
    }, [selectedTallas, setValue]);

    const onSubmit = (data) => {
        const filters = {
            ...data,
            categoria: selectedCategory,
            estadoDesing: selectedEstado,
            tallasDisponibles: selectedTallas,
            fechaCreacionStart: data.fechaCreacionStart || undefined,
            fechaCreacionEnd: data.fechaCreacionEnd || undefined,
            precioMin: data.precioMin || undefined,
            precioMax: data.precioMax || undefined,
        };
        onApplyFilters(filters);
    };

    const handleClear = () => {
        reset();
        setSelectedCategory('');
        setSelectedEstado('');
        setSelectedTallas([]);
        onClearFilters();
    };

    const handleTallaChange = (talla) => {
        setSelectedTallas(prev =>
            prev.includes(talla) ? prev.filter(t => t !== talla) : [...prev, talla]
        );
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg shadow-sm">
            <div>
                <label htmlFor="fechaCreacionStart">Fecha de Creación (Desde)</label>
                <InputGeneral type="date" id="fechaCreacionStart" {...register('fechaCreacionStart')} />
            </div>
            <div>
                <label htmlFor="fechaCreacionEnd">Fecha de Creación (Hasta)</label>
                <InputGeneral type="date" id="fechaCreacionEnd" {...register('fechaCreacionEnd')} />
            </div>
            <div>
                <label htmlFor="categoria">Categoría de Producto</label>
                <InputSelectGeneral
                    id="categoria"
                    {...register('categoria')}
                    options={["", "Camisetas", "Camisas", "Chaquetas", "Pantalones", "Faldas", "Gorras", "Sweaters", "Hoddies"]}
                    placeholder="Selecciona una categoría"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="estadoDesing">Estado del Diseño</label>
                <InputSelectGeneral
                    id="estadoDesing"
                    {...register('estadoDesing')}
                    options={["", "PUBLICO", "PRIVADO", "PENDIENTE", "RECHAZADO"]}
                    placeholder="Selecciona un estado"
                    value={selectedEstado}
                    onChange={(e) => setSelectedEstado(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="disenadorUsuarioId">Diseñador/Usuario ID</label>
                <InputGeneral type="text" id="disenadorUsuarioId" {...register('disenadorUsuarioId')} placeholder="ID del Diseñador" />
            </div>
            <div>
                <label htmlFor="precioMin">Precio Mínimo</label>
                <InputGeneral type="number" id="precioMin" {...register('precioMin')} placeholder="Mínimo" step="0.01" />
            </div>
            <div>
                <label htmlFor="precioMax">Precio Máximo</label>
                <InputGeneral type="number" id="precioMax" {...register('precioMax')} placeholder="Máximo" step="0.01" />
            </div>
            <div className="col-span-full">
                <label>Tallas Disponibles</label>
                <div className="flex flex-wrap gap-2 mt-2">
                    {tallasDisponiblesOptions.map(talla => (
                        <BotonGeneral
                            key={talla}
                            type="button"
                            variant={selectedTallas.includes(talla) ? 'default' : 'outline'}
                            onClick={() => handleTallaChange(talla)}
                        >
                            {talla}
                        </BotonGeneral>
                    ))}
                </div>
            </div>
            <div className="col-span-full flex justify-end gap-2">
                <BotonGeneral type="button" variant="outline" onClick={handleClear}>Limpiar Filtros</BotonGeneral>
                <BotonGeneral type="submit">Aplicar Filtros</BotonGeneral>
            </div>
        </form>
    );
};

export default DesignFilters;
