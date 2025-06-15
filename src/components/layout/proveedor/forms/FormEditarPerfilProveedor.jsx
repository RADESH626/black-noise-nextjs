"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import BotonGeneral from '@/components/common/botones/BotonGeneral';
import InputGeneral from '@/components/common/inputs/InputGeneral';
import { actualizarProveedor } from '@/app/acciones/ProveedorActions';
import { Disponibilidad } from '@/models/enums/proveedor/Disponibilidad';
import { MetodoPago } from '@/models/enums/pago/MetodoPago';

function FormEditarPerfilProveedor({ perfilInicial }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        nombreProveedor: perfilInicial.nombreProveedor || '',
        direccionEmpresa: perfilInicial.direccionEmpresa || '',
        metodosPagoAceptados: perfilInicial.metodosPagoAceptados || [],
        disponibilidad: perfilInicial.disponibilidad || Disponibilidad.DISPONIBLE,
        permisosDetallesCredito: perfilInicial.permisosDetallesCredito || false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const previousFormDataRef = useRef(null); // Ref to store previous form data for rollback

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (type === 'checkbox') {
            if (name === 'metodosPagoAceptados') {
                setFormData((prevData) => ({
                    ...prevData,
                    metodosPagoAceptados: checked
                        ? [...prevData.metodosPagoAceptados, value]
                        : prevData.metodosPagoAceptados.filter((method) => method !== value),
                }));
            } else {
                setFormData((prevData) => ({
                    ...prevData,
                    [name]: checked,
                }));
            }
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Store current formData for potential rollback
        previousFormDataRef.current = formData;

        // Optimistically update UI (formData is already updated by handleChange)
        // No explicit optimistic update needed here as formData is already the new state

        try {
            const result = await actualizarProveedor(formData);
            
            if (result.error) {
                throw new Error(result.error);
            }

            // If successful, the UI is already updated. No need for router.refresh() or redirect.
            // showPopUp("Perfil actualizado con éxito", "success"); // Use PopUpContext if available
            console.log("Perfil actualizado con éxito"); // For now, log success

        } catch (err) {
            setError(err.message);
            // Rollback to previous state
            if (previousFormDataRef.current) {
                setFormData(previousFormDataRef.current);
            }
            // showPopUp(`Error: ${err.message}`, "error"); // Use PopUpContext if available
            console.error(`Error: ${err.message}`); // For now, log error
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-neutral-800 text-secondary rounded-lg shadow-lg border border-accent1">
            <h2 className="text-3xl font-bold text-center mb-6 text-accent1">
                Editar Perfil de Proveedor
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <InputGeneral
                    label="Nombre de la Empresa"
                    name="nombreProveedor"
                    type="text"
                    value={formData.nombreProveedor}
                    onChange={handleChange}
                    required
                />

                <InputGeneral
                    label="Dirección de la Empresa"
                    name="direccionEmpresa"
                    type="text"
                    value={formData.direccionEmpresa}
                    onChange={handleChange}
                    required
                />

                <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                        Métodos de Pago Aceptados
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {Object.values(MetodoPago).map((method) => (
                            <div key={method} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={method}
                                    name="metodosPagoAceptados"
                                    value={method}
                                    checked={formData.metodosPagoAceptados.includes(method)}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-accent1 bg-neutral-800 border-neutral-600 rounded focus:ring-accent1"
                                />
                                <label htmlFor={method} className="ml-2 text-sm text-neutral-300">
                                    {method.replace(/_/g, ' ')}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label htmlFor="disponibilidad" className="block text-sm font-medium text-neutral-300 mb-1">
                        Disponibilidad
                    </label>
                    <select
                        id="disponibilidad"
                        name="disponibilidad"
                        value={formData.disponibilidad}
                        onChange={handleChange}
                        required
                        className="w-full p-3 bg-neutral-800 border border-neutral-600 rounded-md text-secondary focus:ring-accent1 focus:border-accent1"
                    >
                        {Object.values(Disponibilidad).map((disp) => (
                            <option key={disp} value={disp}>
                                {disp.replace(/_/g, ' ')}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="permisosDetallesCredito"
                        name="permisosDetallesCredito"
                        checked={formData.permisosDetallesCredito}
                        onChange={handleChange}
                        className="h-4 w-4 text-accent1 bg-neutral-800 border-neutral-600 rounded focus:ring-accent1"
                    />
                    <label htmlFor="permisosDetallesCredito" className="ml-2 text-sm text-neutral-300">
                        Permitir detalles de crédito
                    </label>
                </div>

                {error && <p className="text-red-500 text-center">{error}</p>}
                {/* Removed success message as optimistic update handles immediate feedback */}

                <div className="flex justify-end space-x-4 mt-6">
                    <BotonGeneral
                        type="button"
                        onClick={() => router.push('/proveedor')}
                        className="bg-gray-600 hover:bg-gray-700"
                    >
                        Cancelar
                    </BotonGeneral>
                    <BotonGeneral type="submit" disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </BotonGeneral>
                </div>
            </form>
        </div>
    );
}

export default FormEditarPerfilProveedor;
