"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import InputGeneral from "@/components/common/inputs/InputGeneral";
import BotonGeneral from "@/components/common/botones/BotonGeneral";
import InputCheckBox from "@/components/common/inputs/InputCheckBox";
import InputSelectGeneral from "@/components/common/inputs/InputSelectGeneral";

const ProveedorFilters = ({ onApplyFilters, onClearFilters }) => {
    const { register, handleSubmit, reset, setValue, watch } = useForm();
    const [selectedDisponibilidad, setSelectedDisponibilidad] = useState('');
    const [selectedEspecialidad, setSelectedEspecialidad] = useState('');
    const [selectedMetodoPago, setSelectedMetodoPago] = useState('');
    const [habilitado, setHabilitado] = useState(false);

    const especialidadOptions = ['Todos', 'Ropa', 'Accesorios', 'Calzado', 'Joyeria']; // Example specialties
    const metodoPagoOptions = ['Todos', 'TARJETA_CREDITO', 'TARJETA_DEBITO', 'PAYPAL', 'TRANSFERENCIA_BANCARIA', 'NEQUI', 'DAVIPLATA', 'EFECTIVO']; // Example payment methods

    useEffect(() => {
        setValue('disponibilidad', selectedDisponibilidad);
    }, [selectedDisponibilidad, setValue]);

    useEffect(() => {
        setValue('especialidad', selectedEspecialidad);
    }, [selectedEspecialidad, setValue]);

    useEffect(() => {
        setValue('metodosPagoAceptados', selectedMetodoPago);
    }, [selectedMetodoPago, setValue]);

    useEffect(() => {
        setValue('habilitado', habilitado);
    }, [habilitado, setValue]);

    const onSubmit = (data) => {
        const filters = {
            ...data,
            disponibilidad: selectedDisponibilidad,
            especialidad: selectedEspecialidad === 'Todos' ? undefined : selectedEspecialidad,
            metodosPagoAceptados: selectedMetodoPago === 'Todos' ? undefined : selectedMetodoPago,
            habilitado: habilitado,
            ordenesActivasMin: data.ordenesActivasMin || undefined,
            ordenesActivasMax: data.ordenesActivasMax || undefined,
            fechaUltimaAsignacionStart: data.fechaUltimaAsignacionStart || undefined,
            fechaUltimaAsignacionEnd: data.fechaUltimaAsignacionEnd || undefined,
        };
        onApplyFilters(filters);
    };

    const handleClear = () => {
        reset();
        setSelectedDisponibilidad('');
        setSelectedEspecialidad('');
        setSelectedMetodoPago('');
        setHabilitado(false);
        onClearFilters();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg shadow-sm">
            <div>
                <label htmlFor="disponibilidad">Disponibilidad</label>
                <InputSelectGeneral
                    id="disponibilidad"
                    {...register('disponibilidad')}
                    defaultValue={selectedDisponibilidad}
                    onChange={(e) => setSelectedDisponibilidad(e.target.value)}
                    options={["", "DISPONIBLE", "NO_DISPONIBLE"]}
                    placeholder="Selecciona disponibilidad"
                />
            </div>
            <div>
                <label htmlFor="especialidad">Especialidad</label>
                <InputSelectGeneral
                    id="especialidad"
                    {...register('especialidad')}
                    defaultValue={selectedEspecialidad}
                    onChange={(e) => setSelectedEspecialidad(e.target.value)}
                    options={especialidadOptions}
                    placeholder="Selecciona una especialidad"
                />
            </div>
            <div>
                <label htmlFor="metodosPagoAceptados">Métodos de Pago Aceptados</label>
                <InputSelectGeneral
                    id="metodosPagoAceptados"
                    {...register('metodosPagoAceptados')}
                    defaultValue={selectedMetodoPago}
                    onChange={(e) => setSelectedMetodoPago(e.target.value)}
                    options={metodoPagoOptions.map(metodo => ({ value: metodo, label: metodo.replace(/_/g, ' ') }))}
                    placeholder="Selecciona un método de pago"
                />
            </div>
            <div className="flex items-center space-x-2">
                <InputCheckBox
                    id="habilitado"
                    checked={habilitado}
                    onChange={(e) => setHabilitado(e.target.checked)}
                />
                <label htmlFor="habilitado">Habilitado</label>
            </div>
            <div>
                <label htmlFor="ordenesActivasMin">Órdenes Activas Mínimo</label>
                <InputGeneral type="number" id="ordenesActivasMin" {...register('ordenesActivasMin')} placeholder="Mínimo" />
            </div>
            <div>
                <label htmlFor="ordenesActivasMax">Órdenes Activas Máximo</label>
                <InputGeneral type="number" id="ordenesActivasMax" {...register('ordenesActivasMax')} placeholder="Máximo" />
            </div>
            <div>
                <label htmlFor="fechaUltimaAsignacionStart">Fecha Última Asignación (Desde)</label>
                <InputGeneral type="date" id="fechaUltimaAsignacionStart" {...register('fechaUltimaAsignacionStart')} />
            </div>
            <div>
                <label htmlFor="fechaUltimaAsignacionEnd">Fecha Última Asignacion (Hasta)</label>
                <InputGeneral type="date" id="fechaUltimaAsignacionEnd" {...register('fechaUltimaAsignacionEnd')} />
            </div>
            <div className="col-span-full flex justify-end gap-2">
                <BotonGeneral type="button" variant="outline" onClick={handleClear}>Limpiar Filtros</BotonGeneral>
                <BotonGeneral type="submit">Aplicar Filtros</BotonGeneral>
            </div>
        </form>
    );
};

export default ProveedorFilters;
