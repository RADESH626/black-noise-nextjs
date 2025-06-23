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

const VentaFilters = ({ onApplyFilters, onClearFilters }) => {
    const { register, handleSubmit, reset, setValue, watch } = useForm();
    const [selectedEstadoVenta, setSelectedEstadoVenta] = useState('');

    useEffect(() => {
        setValue('estadoVenta', selectedEstadoVenta);
    }, [selectedEstadoVenta, setValue]);

    const onSubmit = (data) => {
        const filters = {
            ...data,
            estadoVenta: selectedEstadoVenta,
            fechaVentaStart: data.fechaVentaStart || undefined,
            fechaVentaEnd: data.fechaVentaEnd || undefined,
            valorVentaMin: data.valorVentaMin || undefined,
            valorVentaMax: data.valorVentaMax || undefined,
        };
        onApplyFilters(filters);
    };

    const handleClear = () => {
        reset();
        setSelectedEstadoVenta('');
        onClearFilters();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg shadow-sm">
            <div>
                <Label htmlFor="fechaVentaStart">Fecha de Venta (Desde)</Label>
                <Input type="date" id="fechaVentaStart" {...register('fechaVentaStart')} />
            </div>
            <div>
                <Label htmlFor="fechaVentaEnd">Fecha de Venta (Hasta)</Label>
                <Input type="date" id="fechaVentaEnd" {...register('fechaVentaEnd')} />
            </div>
            <div>
                <Label htmlFor="estadoVenta">Estado de Venta</Label>
                <Select onValueChange={setSelectedEstadoVenta} value={selectedEstadoVenta}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">Todos</SelectItem>
                        <SelectItem value="COMPLETADA">Completada</SelectItem>
                        <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                        <SelectItem value="CANCELADA">Cancelada</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="pedidoAsociadoId">Pedido Asociado ID</Label>
                <Input type="text" id="pedidoAsociadoId" {...register('pedidoAsociadoId')} placeholder="ID del Pedido" />
            </div>
            <div>
                <Label htmlFor="valorVentaMin">Valor de Venta Mínimo</Label>
                <Input type="number" id="valorVentaMin" {...register('valorVentaMin')} placeholder="Mínimo" step="0.01" />
            </div>
            <div>
                <Label htmlFor="valorVentaMax">Valor de Venta Máximo</Label>
                <Input type="number" id="valorVentaMax" {...register('valorVentaMax')} placeholder="Máximo" step="0.01" />
            </div>
            <div className="col-span-full flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleClear}>Limpiar Filtros</Button>
                <Button type="submit">Aplicar Filtros</Button>
            </div>
        </form>
    );
};

export default VentaFilters;
