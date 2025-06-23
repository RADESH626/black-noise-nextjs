"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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
                <Label htmlFor="fechaCreacionStart">Fecha de Creación (Desde)</Label>
                <Input type="date" id="fechaCreacionStart" {...register('fechaCreacionStart')} />
            </div>
            <div>
                <Label htmlFor="fechaCreacionEnd">Fecha de Creación (Hasta)</Label>
                <Input type="date" id="fechaCreacionEnd" {...register('fechaCreacionEnd')} />
            </div>
            <div>
                <Label htmlFor="categoria">Categoría de Producto</Label>
                <Select onValueChange={setSelectedCategory} value={selectedCategory}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">Todas</SelectItem>
                        <SelectItem value="Camisetas">Camisetas</SelectItem>
                        <SelectItem value="Camisas">Camisas</SelectItem>
                        <SelectItem value="Chaquetas">Chaquetas</SelectItem>
                        <SelectItem value="Pantalones">Pantalones</SelectItem>
                        <SelectItem value="Faldas">Faldas</SelectItem>
                        <SelectItem value="Gorras">Gorras</SelectItem>
                        <SelectItem value="Sweaters">Sweaters</SelectItem>
                        <SelectItem value="Hoddies">Hoddies</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="estadoDesing">Estado del Diseño</Label>
                <Select onValueChange={setSelectedEstado} value={selectedEstado}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">Todos</SelectItem>
                        <SelectItem value="PUBLICO">Público</SelectItem>
                        <SelectItem value="PRIVADO">Privado</SelectItem>
                        <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                        <SelectItem value="RECHAZADO">Rechazado</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="disenadorUsuarioId">Diseñador/Usuario ID</Label>
                <Input type="text" id="disenadorUsuarioId" {...register('disenadorUsuarioId')} placeholder="ID del Diseñador" />
            </div>
            <div>
                <Label htmlFor="precioMin">Precio Mínimo</Label>
                <Input type="number" id="precioMin" {...register('precioMin')} placeholder="Mínimo" step="0.01" />
            </div>
            <div>
                <Label htmlFor="precioMax">Precio Máximo</Label>
                <Input type="number" id="precioMax" {...register('precioMax')} placeholder="Máximo" step="0.01" />
            </div>
            <div className="col-span-full">
                <Label>Tallas Disponibles</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                    {tallasDisponiblesOptions.map(talla => (
                        <Button
                            key={talla}
                            type="button"
                            variant={selectedTallas.includes(talla) ? 'default' : 'outline'}
                            onClick={() => handleTallaChange(talla)}
                        >
                            {talla}
                        </Button>
                    ))}
                </div>
            </div>
            <div className="col-span-full flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleClear}>Limpiar Filtros</Button>
                <Button type="submit">Aplicar Filtros</Button>
            </div>
        </form>
    );
};

export default DesignFilters;
