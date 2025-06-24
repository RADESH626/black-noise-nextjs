"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import InputSelectGeneral from "@/components/common/inputs/InputSelectGeneral";
import InputGeneral from "@/components/common/inputs/InputGeneral";
import BotonGeneral from "@/components/common/botones/BotonGeneral";
import InputCheckBox from "@/components/common/inputs/InputCheckBox";

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
                <label htmlFor="fechaPedidoStart">Fecha del Pedido (Desde)</label>
                <InputGeneral type="date" id="fechaPedidoStart" {...register('fechaPedidoStart')} />
            </div>
            <div>
                <label htmlFor="fechaPedidoEnd">Fecha del Pedido (Hasta)</label>
                <InputGeneral type="date" id="fechaPedidoEnd" {...register('fechaPedidoEnd')} />
            </div>
            <div>
                <label htmlFor="estadoPedido">Estado del Pedido</label>
                <InputSelectGeneral
                    options={[
                        "Todos", "PENDIENTE", "EN_FABRICACION", "LISTO", "ENVIADO", "ENTREGADO",
                        "CANCELADO", "SOLICITUD_CANCELACION", "SOLICITUD_DEVOLUCION",
                        "DEVOLUCION_APROBADA", "DEVOLUCION_RECHAZADA", "DEVOLUCION_COMPLETADA"
                    ]}
                    placeholder="Selecciona un estado"
                    defaultValue={selectedEstadoPedido}
                    onChange={(e) => setSelectedEstadoPedido(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="estadoPago">Estado del Pago</label>
                <InputSelectGeneral
                    options={["Todos", "PAGADO", "PENDIENTE", "FALLIDO", "REEMBOLSADO"]}
                    placeholder="Selecciona un estado de pago"
                    defaultValue={selectedEstadoPago}
                    onChange={(e) => setSelectedEstadoPago(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="metodoEntrega">Método de Entrega</label>
                <InputSelectGeneral
                    options={["Todos", "ENVIO_A_DOMICILIO", "RECOGIDA_EN_TIENDA"]}
                    placeholder="Selecciona un método"
                    defaultValue={selectedMetodoEntrega}
                    onChange={(e) => setSelectedMetodoEntrega(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="proveedorId">Proveedor Asignado ID</label>
                <InputGeneral type="text" id="proveedorId" {...register('proveedorId')} placeholder="ID del Proveedor" />
            </div>
            <div>
                <label htmlFor="usuarioCompradorId">Usuario Comprador ID</label>
                <InputGeneral type="text" id="usuarioCompradorId" {...register('usuarioCompradorId')} placeholder="ID del Usuario" />
            </div>
            <div>
                <label htmlFor="valorTotalMin">Valor Total Mínimo</label>
                <InputGeneral type="number" id="valorTotalMin" {...register('valorTotalMin')} placeholder="Mínimo" step="0.01" />
            </div>
            <div>
                <label htmlFor="valorTotalMax">Valor Total Máximo</label>
                <InputGeneral type="number" id="valorTotalMax" {...register('valorTotalMax')} placeholder="Máximo" step="0.01" />
            </div>
            <div className="flex items-center space-x-2">
                <InputCheckBox
                    id="pedidoCancelado"
                    checked={pedidoCancelado}
                    onCheckedChange={setPedidoCancelado}
                />
                <label htmlFor="pedidoCancelado">Pedido Cancelado</label>
            </div>
            <div className="flex items-center space-x-2">
                <InputCheckBox
                    id="pedidoRefabricado"
                    checked={pedidoRefabricado}
                    onCheckedChange={setPedidoRefabricado}
                />
                <label htmlFor="pedidoRefabricado">Pedido Refabricado</label>
            </div>
            <div className="col-span-full flex justify-end gap-2">
                <BotonGeneral type="button" variant="outline" onClick={handleClear}>Limpiar Filtros</BotonGeneral>
                <BotonGeneral type="submit">Aplicar Filtros</BotonGeneral>
            </div>
        </form>
    );
};

export default PedidoFilters;
