"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import InputGeneral from "@/components/common/inputs/InputGeneral";
import BotonGeneral from "@/components/common/botones/BotonGeneral";
import InputSelectGeneral from "@/components/common/inputs/InputSelectGeneral";

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
                <label htmlFor="fechaVentaStart">Fecha de Venta (Desde)</label>
                <InputGeneral type="date" id="fechaVentaStart" {...register('fechaVentaStart')} />
            </div>
            <div>
                <label htmlFor="fechaVentaEnd">Fecha de Venta (Hasta)</label>
                <InputGeneral type="date" id="fechaVentaEnd" {...register('fechaVentaEnd')} />
            </div>
            <div>
                <label htmlFor="estadoVenta">Estado de Venta</label>
                <InputSelectGeneral
                    id="estadoVenta"
                    {...register('estadoVenta')}
                    defaultValue={selectedEstadoVenta}
                    onChange={(e) => setSelectedEstadoVenta(e.target.value)}
                    options={["", "COMPLETADA", "PENDIENTE", "CANCELADA"]}
                    placeholder="Selecciona un estado"
                />
            </div>
            <div>
                <label htmlFor="pedidoAsociadoId">Pedido Asociado ID</label>
                <InputGeneral type="text" id="pedidoAsociadoId" {...register('pedidoAsociadoId')} placeholder="ID del Pedido" />
            </div>
            <div>
                <label htmlFor="valorVentaMin">Valor de Venta Mínimo</label>
                <InputGeneral type="number" id="valorVentaMin" {...register('valorVentaMin')} placeholder="Mínimo" step="0.01" />
            </div>
            <div>
                <label htmlFor="valorVentaMax">Valor de Venta Máximo</label>
                <InputGeneral type="number" id="valorVentaMax" {...register('valorVentaMax')} placeholder="Máximo" step="0.01" />
            </div>
            <div className="col-span-full flex justify-end gap-2">
                <BotonGeneral type="button" variant="outline" onClick={handleClear}>Limpiar Filtros</BotonGeneral>
                <BotonGeneral type="submit">Aplicar Filtros</BotonGeneral>
            </div>
        </form>
    );
};

export default VentaFilters;
