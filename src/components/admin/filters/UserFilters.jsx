"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import InputGeneral from "@/components/common/inputs/InputGeneral";
import BotonGeneral from "@/components/common/botones/BotonGeneral";
import InputCheckBox from "@/components/common/inputs/InputCheckBox";
import InputSelectGeneral from "@/components/common/inputs/InputSelectGeneral";

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
                <label htmlFor="searchText">Buscar (Nombre, Correo, Documento)</label>
                <InputGeneral type="text" id="searchText" {...register('searchText')} placeholder="Buscar..." />
            </div>
            <div>
                <label htmlFor="rol">Rol</label>
                <InputSelectGeneral
                    id="rol"
                    {...register('rol')}
                    defaultValue={selectedRol}
                    onChange={(e) => setSelectedRol(e.target.value)}
                    options={["", "ADMINISTRADOR", "CLIENTE", "DISEÑADOR", "PROVEEDOR"]}
                    placeholder="Selecciona un rol"
                />
            </div>
            <div>
                <label htmlFor="tipoDocumento">Tipo de Documento</label>
                <InputSelectGeneral
                    id="tipoDocumento"
                    {...register('tipoDocumento')}
                    defaultValue={selectedTipoDocumento}
                    onChange={(e) => setSelectedTipoDocumento(e.target.value)}
                    options={["", "CC", "TI", "CE", "PASAPORTE"]}
                    placeholder="Selecciona tipo de documento"
                />
            </div>
            <div>
                <label htmlFor="genero">Género</label>
                <InputSelectGeneral
                    id="genero"
                    {...register('genero')}
                    defaultValue={selectedGenero}
                    onChange={(e) => setSelectedGenero(e.target.value)}
                    options={["", "MASCULINO", "FEMENINO", "OTRO"]}
                    placeholder="Selecciona género"
                />
            </div>
            <div className="flex items-center space-x-2">
                <InputCheckBox
                    id="habilitado"
                    checked={habilitado}
                    onChange={(e) => setHabilitado(e.target.checked)}
                    {...register('habilitado')}
                />
                <label htmlFor="habilitado">Habilitado</label>
            </div>
            <div>
                <label htmlFor="fechaNacimientoStart">Fecha de Nacimiento (Desde)</label>
                <InputGeneral type="date" id="fechaNacimientoStart" {...register('fechaNacimientoStart')} />
            </div>
            <div>
                <label htmlFor="fechaNacimientoEnd">Fecha de Nacimiento (Hasta)</label>
                <InputGeneral type="date" id="fechaNacimientoEnd" {...register('fechaNacimientoEnd')} />
            </div>
            <div>
                <label htmlFor="fechaRegistroStart">Fecha de Registro (Desde)</label>
                <InputGeneral type="date" id="fechaRegistroStart" {...register('fechaRegistroStart')} />
            </div>
            <div>
                <label htmlFor="fechaRegistroEnd">Fecha de Registro (Hasta)</label>
                <InputGeneral type="date" id="fechaRegistroEnd" {...register('fechaRegistroEnd')} />
            </div>
            <div className="col-span-full flex justify-end gap-2">
                <BotonGeneral type="button" variant="outline" onClick={handleClear}>Limpiar Filtros</BotonGeneral>
                <BotonGeneral type="submit">Aplicar Filtros</BotonGeneral>
            </div>
        </form>
    );
};

export default UserFilters;
