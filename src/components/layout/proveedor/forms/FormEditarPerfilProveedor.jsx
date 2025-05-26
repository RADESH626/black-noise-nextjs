"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import BotonGeneral from '@/components/common/botones/BotonGeneral';
import InputGeneral from '@/components/common/inputs/InputGeneral';
import { actualizarPerfilProveedor } from '@/app/acciones/ProveedorActions';
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
    const [success, setSuccess] = useState(false);

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
        setSuccess(false);

        try {
            const result = await actualizarPerfilProveedor(formData);
            
            if (result.error) {
                throw new Error(result.error);
            }

            setSuccess(true);
            router.refresh(); // Actualizar los datos en la página
            
            // Opcional: redirigir después de un tiempo
            setTimeout(() => {
                router.push('/proveedor');
            }, 2000);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-black text-white rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-center mb-6 text-purple-400">
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
                    <label className="block text-sm font-medium text-gray-300 mb-2">
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
                                    className="h-4 w-4 text-purple-600 bg-gray-800 border-gray-700 rounded focus:ring-purple-500"
                                />
                                <label htmlFor={method} className="ml-2 text-sm text-gray-300">
                                    {method.replace(/_/g, ' ')}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label htmlFor="disponibilidad" className="block text-sm font-medium text-gray-300 mb-1">
                        Disponibilidad
                    </label>
                    <select
                        id="disponibilidad"
                        name="disponibilidad"
                        value={formData.disponibilidad}
                        onChange={handleChange}
                        required
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-purple-500 focus:border-purple-500"
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
                        className="h-4 w-4 text-purple-600 bg-gray-800 border-gray-700 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="permisosDetallesCredito" className="ml-2 text-sm text-gray-300">
                        Permitir detalles de crédito
                    </label>
                </div>

                {error && <p className="text-red-500 text-center">{error}</p>}
                {success && (
                    <p className="text-green-500 text-center">
                        ¡Perfil actualizado con éxito! Redirigiendo...
                    </p>
                )}

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
