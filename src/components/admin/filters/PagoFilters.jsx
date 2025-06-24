"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import InputSelectGeneral from "@/components/common/inputs/InputSelectGeneral";
import InputGeneral from "@/components/common/inputs/InputGeneral";
import BotonGeneral from "@/components/common/botones/BotonGeneral";

const PagoFilters = ({ onApplyFilters, onClearFilters }) => {
    const { register, handleSubmit, reset, setValue, watch } = useForm();
    const [selectedMetodoPago, setSelectedMetodoPago] = useState('');
    const [selectedEstadoTransaccion, setSelectedEstadoTransaccion] = useState('');

    useEffect(() => {
        setValue('metodoPago', selectedMetodoPago);
    }, [selectedMetodoPago, setValue]);

    useEffect(() => {
        setValue('estadoTransaccion', selectedEstadoTransaccion);
    }, [selectedEstadoTransaccion, setValue]);

    const onSubmit = (data) => {
        const filters = {
            ...data,
            metodoPago: selectedMetodoPago,
            estadoTransaccion: selectedEstadoTransaccion,
            fechaPagoStart: data.fechaPagoStart || undefined,
            fechaPagoEnd: data.fechaPagoEnd || undefined,
            valorPagoMin: data.valorPagoMin || undefined,
            valorPagoMax: data.valorPagoMax || undefined,
        };
        onApplyFilters(filters);
    };

    const handleClear = () => {
        reset();
        setSelectedMetodoPago('');
        setSelectedEstadoTransaccion('');
        onClearFilters();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg shadow-sm">
            <div>
                <label htmlFor="fechaPagoStart">Fecha del Pago (Desde)</label>
                <InputGeneral type="date" id="fechaPagoStart" {...register('fechaPagoStart')} />
            </div>
            <div>
                <label htmlFor="fechaPagoEnd">Fecha del Pago (Hasta)</label>
                <InputGeneral type="date" id="fechaPagoEnd" {...register('fechaPagoEnd')} />
            </div>
            <div>
                <label htmlFor="metodoPago">Método de Pago</label>
                <InputSelectGeneral
                    id="metodoPago"
                    defaultValue={selectedMetodoPago}
                    onChange={(e) => setSelectedMetodoPago(e.target.value)}
                    options={[
                        { value: "", label: "Todos" },
                        { value: "TARJETA_CREDITO", label: "Tarjeta de Crédito" },
                        { value: "TARJETA_DEBITO", label: "Tarjeta de Débito" },
                        { value: "PAYPAL", label: "PayPal" },
                        { value: "TRANSFERENCIA_BANCARIA", label: "Transferencia Bancaria" },
                        { value: "NEQUI", label: "Nequi" },
                        { value: "DAVIPLATA", label: "DaviPlata" },
                        { value: "EFECTIVO", label: "Efectivo" },
                    ]}
                />
            </div>
            <div>
                <label htmlFor="estadoTransaccion">Estado de Transacción</label>
                <InputSelectGeneral
                    id="estadoTransaccion"
                    defaultValue={selectedEstadoTransaccion}
                    onChange={(e) => setSelectedEstadoTransaccion(e.target.value)}
                    options={[
                        { value: "", label: "Todos" },
                        { value: "PAGADO", label: "Pagado" },
                        { value: "PENDIENTE", label: "Pendiente" },
                        { value: "FALLIDO", label: "Fallido" },
                        { value: "REEMBOLSADO", label: "Reembolsado" },
                    ]}
                />
            </div>
            <div>
                <label htmlFor="usuarioId">Usuario que Realizó el Pago ID</label>
                <InputGeneral type="text" id="usuarioId" {...register('usuarioId')} placeholder="ID del Usuario" />
            </div>
            <div>
                <label htmlFor="pedidoId">Pedido Asociado ID</label>
                <InputGeneral type="text" id="pedidoId" {...register('pedidoId')} placeholder="ID del Pedido" />
            </div>
            <div>
                <label htmlFor="ventaId">Venta Asociada ID</label>
                <InputGeneral type="text" id="ventaId" {...register('ventaId')} placeholder="ID de la Venta" />
            </div>
            <div>
                <label htmlFor="valorPagoMin">Valor de Pago Mínimo</label>
                <InputGeneral type="number" id="valorPagoMin" {...register('valorPagoMin')} placeholder="Mínimo" step="0.01" />
            </div>
            <div>
                <label htmlFor="valorPagoMax">Valor de Pago Máximo</label>
                <InputGeneral type="number" id="valorPagoMax" {...register('valorPagoMax')} placeholder="Máximo" step="0.01" />
            </div>
            <div className="col-span-full flex justify-end gap-2">
                <BotonGeneral type="button" variant="outline" onClick={handleClear}>Limpiar Filtros</BotonGeneral>
                <BotonGeneral type="submit">Aplicar Filtros</BotonGeneral>
            </div>
        </form>
    );
};

export default PagoFilters;
