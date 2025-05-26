"use client";

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import BotonGeneral from '@/components/common/botones/BotonGeneral';
import InputGeneral from '@/components/common/inputs/InputGeneral';
import { CategoriaProducto } from '@/models/enums/CategoriaProducto';
import { MetodoPago } from '@/models/enums/pago/MetodoPago';

function FormSolicitudProveedor() {
    const { data: session } = useSession();
    const [formData, setFormData] = useState({
        nombreEmpresa: '',
        nit: '',
        direccionEmpresa: '',
        especialidad: '',
        metodosPagoAceptados: [],
        comisionPropuesta: '',
        mensajeAdicional: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData((prevData) => ({
                ...prevData,
                metodosPagoAceptados: checked
                    ? [...prevData.metodosPagoAceptados, value]
                    : prevData.metodosPagoAceptados.filter((method) => method !== value),
            }));
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

        console.log('Frontend: handleSubmit iniciado.');

        if (!session?.user?.id) {
            console.log('Frontend: Usuario no autenticado. Redirigiendo o mostrando error.');
            setError('Usuario no autenticado. Por favor, inicia sesión.');
            setLoading(false);
            return;
        }

        console.log('Frontend: Usuario autenticado. Enviando solicitud...');
        try {
            const response = await fetch('/api/solicitud-proveedor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    usuarioId: session.user.id,
                    comisionPropuesta: parseFloat(formData.comisionPropuesta), // Convertir a número
                }),
            });

            console.log('Frontend: Respuesta de la API recibida. Status:', response.status);

            // Check if response is OK before trying to parse JSON
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Error desconocido del servidor.' }));
                console.log('Frontend: Error en la respuesta de la API:', errorData.message);
                throw new Error(errorData.message || 'Error al enviar la solicitud.');
            }

            const data = await response.json();
            console.log('Frontend: Datos de respuesta de la API:', data);

            setSuccess(true);
            setFormData({ // Reset form
                nombreEmpresa: '',
                nit: '',
                direccionEmpresa: '',
                especialidad: '',
                metodosPagoAceptados: [],
                comisionPropuesta: '',
                mensajeAdicional: '',
            });
            console.log('Frontend: Solicitud enviada con éxito. Formulario reseteado.');
        } catch (err) {
            console.log('Frontend: Error en handleSubmit:', err.message);
            setError(err.message);
        } finally {
            setLoading(false);
            console.log('Frontend: handleSubmit finalizado. Loading a false.');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-8 bg-gray-900 text-white rounded-xl shadow-2xl border border-purple-700">

            <h2 className="text-4xl font-extrabold text-center mb-8 text-purple-400">Solicitud para ser Proveedor</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <InputGeneral
                    label="Nombre de la Empresa"
                    name="nombreEmpresa"
                    type="text"
                    value={formData.nombreEmpresa}
                    onChange={handleChange}
                    required
                    className="mb-4"
                />
                <InputGeneral
                    label="NIT"
                    name="nit"
                    type="text"
                    value={formData.nit}
                    onChange={handleChange}
                    required
                    className="mb-4"
                />
                <InputGeneral
                    label="Dirección de la Empresa"
                    name="direccionEmpresa"
                    type="text"
                    value={formData.direccionEmpresa}
                    onChange={handleChange}
                    required
                    className="mb-4"
                />

                <div className="mb-4">
                    <label htmlFor="especialidad" className="block text-sm font-medium text-gray-300 mb-2">
                        Especialidad
                    </label>
                    <select
                        id="especialidad"
                        name="especialidad"
                        value={formData.especialidad}
                        onChange={handleChange}
                        required
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-purple-500 focus:border-purple-500"
                    >
                        <option value="">Selecciona una especialidad</option>
                        {Object.values(CategoriaProducto).map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                        Métodos de Pago Aceptados
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {Object.values(MetodoPago).map((method) => (
                            <div key={method} className="flex items-center bg-gray-800 p-3 rounded-md border border-gray-700">
                                <input
                                    type="checkbox"
                                    id={method}
                                    name="metodosPagoAceptados"
                                    value={method}
                                    checked={formData.metodosPagoAceptados.includes(method)}
                                    onChange={handleChange}
                                    className="h-5 w-5 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 cursor-pointer"
                                />
                                <label htmlFor={method} className="ml-3 text-sm text-gray-300 cursor-pointer">
                                    {method.replace(/_/g, ' ')}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <InputGeneral
                    label="Comisión Propuesta (%)"
                    name="comisionPropuesta"
                    type="number"
                    value={formData.comisionPropuesta}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="mb-4"
                />
                <InputGeneral
                    label="Mensaje Adicional (Opcional)"
                    name="mensajeAdicional"
                    type="textarea"
                    value={formData.mensajeAdicional}
                    onChange={handleChange}
                    className="mb-6"
                />

                {error && <p className="text-red-500 text-center">{error}</p>}
                {success && <p className="text-green-500 text-center">¡Solicitud enviada con éxito! Te notificaremos pronto.</p>}

                <BotonGeneral type="submit" disabled={loading}>
                    {loading ? 'Enviando...' : 'Enviar Solicitud'}
                </BotonGeneral>
            </form>
        </div>
    );
}

export default FormSolicitudProveedor;
