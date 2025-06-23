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

const UserFilters = ({ onApplyFilters, onClearFilters }) => {
    const { register, handleSubmit, reset, setValue, watch } = useForm();
    const [selectedRol, setSelectedRol] = useState('');
    const [selectedTipoDocumento, setSelectedTipoDocumento] = useState('');
    const [selectedGenero, setSelectedGenero] = useState('');
    const [habilitado, setHabilitado] = useState(false);

    useEffect(() => {
        setValue('rol', selectedRol);
    }, [selectedRol, setValue]);

    useEffect(() => {
        setValue('tipoDocumento', selectedTipoDocumento);
    }, [selectedTipoDocumento, setValue]);

    useEffect(() => {
        setValue('genero', selectedGenero);
    }, [selectedGenero, setValue]);

    useEffect(() => {
        setValue('habilitado', habilitado);
    }, [habilitado, setValue]);

    const onSubmit = (data) => {
        const filters = {
            ...data,
            rol: selectedRol,
            tipoDocumento: selectedTipoDocumento,
            genero: selectedGenero,
            habilitado: habilitado,
            fechaNacimientoStart: data.fechaNacimientoStart || undefined,
            fechaNacimientoEnd: data.fechaNacimientoEnd || undefined,
            fechaRegistroStart: data.fechaRegistroStart || undefined,
            fechaRegistroEnd: data.fechaRegistroEnd || undefined,
        };
        onApplyFilters(filters);
    };

    const handleClear = () => {
        reset();
        setSelectedRol('');
        setSelectedTipoDocumento('');
        setSelectedGenero('');
        setHabilitado(false);
        onClearFilters();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg shadow-sm">
            <div>
                <Label htmlFor="searchText">Buscar (Nombre, Correo, Documento)</Label>
                <Input type="text" id="searchText" {...register('searchText')} placeholder="Buscar..." />
            </div>
            <div>
                <Label htmlFor="rol">Rol</Label>
                <Select onValueChange={setSelectedRol} value={selectedRol}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">Todos</SelectItem>
                        <SelectItem value="ADMINISTRADOR">Administrador</SelectItem>
                        <SelectItem value="CLIENTE">Cliente</SelectItem>
                        <SelectItem value="DISEÑADOR">Diseñador</SelectItem>
                        <SelectItem value="PROVEEDOR">Proveedor</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="tipoDocumento">Tipo de Documento</Label>
                <Select onValueChange={setSelectedTipoDocumento} value={selectedTipoDocumento}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona tipo de documento" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">Todos</SelectItem>
                        <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                        <SelectItem value="TI">Tarjeta de Identidad</SelectItem>
                        <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                        <SelectItem value="PASAPORTE">Pasaporte</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="genero">Género</Label>
                <Select onValueChange={setSelectedGenero} value={selectedGenero}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona género" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">Todos</SelectItem>
                        <SelectItem value="MASCULINO">Masculino</SelectItem>
                        <SelectItem value="FEMENINO">Femenino</SelectItem>
                        <SelectItem value="OTRO">Otro</SelectItem>
                    </SelectContent>
                </Select>
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
                <Label htmlFor="fechaNacimientoStart">Fecha de Nacimiento (Desde)</Label>
                <Input type="date" id="fechaNacimientoStart" {...register('fechaNacimientoStart')} />
            </div>
            <div>
                <Label htmlFor="fechaNacimientoEnd">Fecha de Nacimiento (Hasta)</Label>
                <Input type="date" id="fechaNacimientoEnd" {...register('fechaNacimientoEnd')} />
            </div>
            <div>
                <Label htmlFor="fechaRegistroStart">Fecha de Registro (Desde)</Label>
                <Input type="date" id="fechaRegistroStart" {...register('fechaRegistroStart')} />
            </div>
            <div>
                <Label htmlFor="fechaRegistroEnd">Fecha de Registro (Hasta)</Label>
                <Input type="date" id="fechaRegistroEnd" {...register('fechaRegistroEnd')} />
            </div>
            <div className="col-span-full flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleClear}>Limpiar Filtros</Button>
                <Button type="submit">Aplicar Filtros</Button>
            </div>
        </form>
    );
};

export default UserFilters;
