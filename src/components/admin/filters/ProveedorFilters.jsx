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

const ProveedorFilters = ({ onApplyFilters, onClearFilters }) => {
    const { register, handleSubmit, reset, setValue, watch } = useForm();
    const [selectedDisponibilidad, setSelectedDisponibilidad] = useState('');
    const [selectedEspecialidades, setSelectedEspecialidades] = useState([]);
    const [selectedMetodosPago, setSelectedMetodosPago] = useState([]);
    const [habilitado, setHabilitado] = useState(false);

    const especialidadOptions = ['Ropa', 'Accesorios', 'Calzado', 'Joyeria']; // Example specialties
    const metodoPagoOptions = ['TARJETA_CREDITO', 'TARJETA_DEBITO', 'PAYPAL', 'TRANSFERENCIA_BANCARIA', 'NEQUI', 'DAVIPLATA', 'EFECTIVO']; // Example payment methods

    useEffect(() => {
        setValue('disponibilidad', selectedDisponibilidad);
    }, [selectedDisponibilidad, setValue]);

    useEffect(() => {
        setValue('especialidad', selectedEspecialidades.join(','));
    }, [selectedEspecialidades, setValue]);

    useEffect(() => {
        setValue('metodosPagoAceptados', selectedMetodosPago.join(','));
    }, [selectedMetodosPago, setValue]);

    useEffect(() => {
        setValue('habilitado', habilitado);
    }, [habilitado, setValue]);

    const onSubmit = (data) => {
        const filters = {
            ...data,
            disponibilidad: selectedDisponibilidad,
            especialidad: selectedEspecialidades,
            metodosPagoAceptados: selectedMetodosPago,
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
        setSelectedEspecialidades([]);
        setSelectedMetodosPago([]);
        setHabilitado(false);
        onClearFilters();
    };

    const handleEspecialidadChange = (especialidad) => {
        setSelectedEspecialidades(prev =>
            prev.includes(especialidad) ? prev.filter(e => e !== especialidad) : [...prev, especialidad]
        );
    };

    const handleMetodoPagoChange = (metodo) => {
        setSelectedMetodosPago(prev =>
            prev.includes(metodo) ? prev.filter(m => m !== metodo) : [...prev, metodo]
        );
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg shadow-sm">
            <div>
                <Label htmlFor="disponibilidad">Disponibilidad</Label>
                <Select onValueChange={setSelectedDisponibilidad} value={selectedDisponibilidad}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona disponibilidad" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">Todas</SelectItem>
                        <SelectItem value="DISPONIBLE">Disponible</SelectItem>
                        <SelectItem value="NO_DISPONIBLE">No Disponible</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="col-span-full">
                <Label>Especialidad</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                    {especialidadOptions.map(esp => (
                        <Button
                            key={esp}
                            type="button"
                            variant={selectedEspecialidades.includes(esp) ? 'default' : 'outline'}
                            onClick={() => handleEspecialidadChange(esp)}
                        >
                            {esp}
                        </Button>
                    ))}
                </div>
            </div>
            <div className="col-span-full">
                <Label>Métodos de Pago Aceptados</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                    {metodoPagoOptions.map(metodo => (
                        <Button
                            key={metodo}
                            type="button"
                            variant={selectedMetodosPago.includes(metodo) ? 'default' : 'outline'}
                            onClick={() => handleMetodoPagoChange(metodo)}
                        >
                            {metodo.replace(/_/g, ' ')}
                        </Button>
                    ))}
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox
                    id="habilitado"
                    checked={habilitado}
                    onCheckedChange={setHabilitado}
                />
                <Label htmlFor="habilitado">Habilitado</Label>
            </div>
            <div>
                <Label htmlFor="ordenesActivasMin">Órdenes Activas Mínimo</Label>
                <Input type="number" id="ordenesActivasMin" {...register('ordenesActivasMin')} placeholder="Mínimo" />
            </div>
            <div>
                <Label htmlFor="ordenesActivasMax">Órdenes Activas Máximo</Label>
                <Input type="number" id="ordenesActivasMax" {...register('ordenesActivasMax')} placeholder="Máximo" />
            </div>
            <div>
                <Label htmlFor="fechaUltimaAsignacionStart">Fecha Última Asignación (Desde)</Label>
                <Input type="date" id="fechaUltimaAsignacionStart" {...register('fechaUltimaAsignacionStart')} />
            </div>
            <div>
                <Label htmlFor="fechaUltimaAsignacionEnd">Fecha Última Asignación (Hasta)</Label>
                <Input type="date" id="fechaUltimaAsignacionEnd" {...register('fechaUltimaAsignacionEnd')} />
            </div>
            <div className="col-span-full flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleClear}>Limpiar Filtros</Button>
                <Button type="submit">Aplicar Filtros</Button>
            </div>
        </form>
    );
};

export default ProveedorFilters;
