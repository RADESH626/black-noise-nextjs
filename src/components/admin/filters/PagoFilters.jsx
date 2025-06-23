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
                <Label htmlFor="fechaPagoStart">Fecha del Pago (Desde)</Label>
                <Input type="date" id="fechaPagoStart" {...register('fechaPagoStart')} />
            </div>
            <div>
                <Label htmlFor="fechaPagoEnd">Fecha del Pago (Hasta)</Label>
                <Input type="date" id="fechaPagoEnd" {...register('fechaPagoEnd')} />
            </div>
            <div>
                <Label htmlFor="metodoPago">Método de Pago</Label>
                <Select onValueChange={setSelectedMetodoPago} value={selectedMetodoPago}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona un método" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">Todos</SelectItem>
                        <SelectItem value="TARJETA_CREDITO">Tarjeta de Crédito</SelectItem>
                        <SelectItem value="TARJETA_DEBITO">Tarjeta de Débito</SelectItem>
                        <SelectItem value="PAYPAL">PayPal</SelectItem>
                        <SelectItem value="TRANSFERENCIA_BANCARIA">Transferencia Bancaria</SelectItem>
                        <SelectItem value="NEQUI">Nequi</SelectItem>
                        <SelectItem value="DAVIPLATA">DaviPlata</SelectItem>
                        <SelectItem value="EFECTIVO">Efectivo</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="estadoTransaccion">Estado de Transacción</Label>
                <Select onValueChange={setSelectedEstadoTransaccion} value={selectedEstadoTransaccion}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">Todos</SelectItem>
                        <SelectItem value="PAGADO">Pagado</SelectItem>
                        <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                        <SelectItem value="FALLIDO">Fallido</SelectItem>
                        <SelectItem value="REEMBOLSADO">Reembolsado</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="usuarioId">Usuario que Realizó el Pago ID</Label>
                <Input type="text" id="usuarioId" {...register('usuarioId')} placeholder="ID del Usuario" />
            </div>
            <div>
                <Label htmlFor="pedidoId">Pedido Asociado ID</Label>
                <Input type="text" id="pedidoId" {...register('pedidoId')} placeholder="ID del Pedido" />
            </div>
            <div>
                <Label htmlFor="ventaId">Venta Asociada ID</Label>
                <Input type="text" id="ventaId" {...register('ventaId')} placeholder="ID de la Venta" />
            </div>
            <div>
                <Label htmlFor="valorPagoMin">Valor de Pago Mínimo</Label>
                <Input type="number" id="valorPagoMin" {...register('valorPagoMin')} placeholder="Mínimo" step="0.01" />
            </div>
            <div>
                <Label htmlFor="valorPagoMax">Valor de Pago Máximo</Label>
                <Input type="number" id="valorPagoMax" {...register('valorPagoMax')} placeholder="Máximo" step="0.01" />
            </div>
            <div className="col-span-full flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleClear}>Limpiar Filtros</Button>
                <Button type="submit">Aplicar Filtros</Button>
            </div>
        </form>
    );
};

export default PagoFilters;
