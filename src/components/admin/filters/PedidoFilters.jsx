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
import { Checkbox } from "@/components/ui/checkbox";

const PedidoFilters = ({ onApplyFilters, onClearFilters }) => {
    const { register, handleSubmit, reset, setValue, watch } = useForm();
    const [selectedEstadoPedido, setSelectedEstadoPedido] = useState('');
    const [selectedEstadoPago, setSelectedEstadoPago] = useState('');
    const [selectedMetodoEntrega, setSelectedMetodoEntrega] = useState('');
    const [pedidoCancelado, setPedidoCancelado] = useState(false);
    const [pedidoRefabricado, setPedidoRefabricado] = useState(false);

    useEffect(() => {
        setValue('estadoPedido', selectedEstadoPedido);
    }, [selectedEstadoPedido, setValue]);

    useEffect(() => {
        setValue('estadoPago', selectedEstadoPago);
    }, [selectedEstadoPago, setValue]);

    useEffect(() => {
        setValue('metodoEntrega', selectedMetodoEntrega);
    }, [selectedMetodoEntrega, setValue]);

    useEffect(() => {
        setValue('pedidoCancelado', pedidoCancelado);
    }, [pedidoCancelado, setValue]);

    useEffect(() => {
        setValue('pedidoRefabricado', pedidoRefabricado);
    }, [pedidoRefabricado, setValue]);

    const onSubmit = (data) => {
        const filters = {
            ...data,
            estadoPedido: selectedEstadoPedido,
            estadoPago: selectedEstadoPago,
            metodoEntrega: selectedMetodoEntrega,
            pedidoCancelado: pedidoCancelado,
            pedidoRefabricado: pedidoRefabricado,
            fechaPedidoStart: data.fechaPedidoStart || undefined,
            fechaPedidoEnd: data.fechaPedidoEnd || undefined,
            valorTotalMin: data.valorTotalMin || undefined,
            valorTotalMax: data.valorTotalMax || undefined,
        };
        onApplyFilters(filters);
    };

    const handleClear = () => {
        reset();
        setSelectedEstadoPedido('');
        setSelectedEstadoPago('');
        setSelectedMetodoEntrega('');
        setPedidoCancelado(false);
        setPedidoRefabricado(false);
        onClearFilters();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg shadow-sm">
            <div>
                <Label htmlFor="fechaPedidoStart">Fecha del Pedido (Desde)</Label>
                <Input type="date" id="fechaPedidoStart" {...register('fechaPedidoStart')} />
            </div>
            <div>
                <Label htmlFor="fechaPedidoEnd">Fecha del Pedido (Hasta)</Label>
                <Input type="date" id="fechaPedidoEnd" {...register('fechaPedidoEnd')} />
            </div>
            <div>
                <Label htmlFor="estadoPedido">Estado del Pedido</Label>
                <Select onValueChange={setSelectedEstadoPedido} value={selectedEstadoPedido}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">Todos</SelectItem>
                        <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                        <SelectItem value="EN_FABRICACION">En Fabricación</SelectItem>
                        <SelectItem value="LISTO">Listo</SelectItem>
                        <SelectItem value="ENVIADO">Enviado</SelectItem>
                        <SelectItem value="ENTREGADO">Entregado</SelectItem>
                        <SelectItem value="CANCELADO">Cancelado</SelectItem>
                        <SelectItem value="SOLICITUD_CANCELACION">Solicitud Cancelación</SelectItem>
                        <SelectItem value="SOLICITUD_DEVOLUCION">Solicitud Devolución</SelectItem>
                        <SelectItem value="DEVOLUCION_APROBADA">Devolución Aprobada</SelectItem>
                        <SelectItem value="DEVOLUCION_RECHAZADA">Devolución Rechazada</SelectItem>
                        <SelectItem value="DEVOLUCION_COMPLETADA">Devolución Completada</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="estadoPago">Estado del Pago</Label>
                <Select onValueChange={setSelectedEstadoPago} value={selectedEstadoPago}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona un estado de pago" />
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
                <Label htmlFor="metodoEntrega">Método de Entrega</Label>
                <Select onValueChange={setSelectedMetodoEntrega} value={selectedMetodoEntrega}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona un método" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">Todos</SelectItem>
                        <SelectItem value="ENVIO_A_DOMICILIO">Envío a Domicilio</SelectItem>
                        <SelectItem value="RECOGIDA_EN_TIENDA">Recogida en Tienda</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="proveedorId">Proveedor Asignado ID</Label>
                <Input type="text" id="proveedorId" {...register('proveedorId')} placeholder="ID del Proveedor" />
            </div>
            <div>
                <Label htmlFor="usuarioCompradorId">Usuario Comprador ID</Label>
                <Input type="text" id="usuarioCompradorId" {...register('usuarioCompradorId')} placeholder="ID del Usuario" />
            </div>
            <div>
                <Label htmlFor="valorTotalMin">Valor Total Mínimo</Label>
                <Input type="number" id="valorTotalMin" {...register('valorTotalMin')} placeholder="Mínimo" step="0.01" />
            </div>
            <div>
                <Label htmlFor="valorTotalMax">Valor Total Máximo</Label>
                <Input type="number" id="valorTotalMax" {...register('valorTotalMax')} placeholder="Máximo" step="0.01" />
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox
                    id="pedidoCancelado"
                    checked={pedidoCancelado}
                    onCheckedChange={setPedidoCancelado}
                />
                <Label htmlFor="pedidoCancelado">Pedido Cancelado</Label>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox
                    id="pedidoRefabricado"
                    checked={pedidoRefabricado}
                    onCheckedChange={setPedidoRefabricado}
                />
                <Label htmlFor="pedidoRefabricado">Pedido Refabricado</Label>
            </div>
            <div className="col-span-full flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleClear}>Limpiar Filtros</Button>
                <Button type="submit">Aplicar Filtros</Button>
            </div>
        </form>
    );
};

export default PedidoFilters;
