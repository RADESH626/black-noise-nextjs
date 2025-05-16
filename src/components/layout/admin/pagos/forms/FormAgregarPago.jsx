"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { guardarPago } from '@/app/acciones/PagoActions';
import { MetodoPago } from '@/models/enums/pago/MetodoPago';
// EstadoPago se maneja por defecto en el backend al crear
import { BotonGeneral, BotonCancelar } from '@/components/common/botones';
import Alert from '@/components/common/Alert';

export default function FormAgregarPago() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        usuarioId: '',
        ventaId: '',
        valorPago: '',
        metodoPago: '',
        // estadoPago se establece por defecto en el backend
    });
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAlert({ show: false, type: '', message: '' });

        const dataToSave = {
            ...formData,
            valorPago: parseFloat(formData.valorPago) || 0,
        };

        if (!dataToSave.usuarioId || !dataToSave.ventaId || !dataToSave.valorPago || !dataToSave.metodoPago) {
            setAlert({ show: true, type: 'error', message: 'Por favor, completa todos los campos obligatorios.' });
            return;
        }
        
        const result = await guardarPago(dataToSave);

        if (result.error) {
            setAlert({ show: true, type: 'error', message: `Error al guardar el pago: ${result.error}` });
        } else {
            setAlert({ show: true, type: 'success', message: 'Pago guardado exitosamente.' });
            setTimeout(() => {
                router.push('/admin/pagos');
            }, 2000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-4 bg-white shadow-md rounded-lg">
            {alert.show && <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ show: false })} />}
            
            <div>
                <label htmlFor="usuarioId" className="block text-sm font-medium text-gray-700">ID de Usuario</label>
                <input
                    type="text"
                    name="usuarioId"
                    id="usuarioId"
                    value={formData.usuarioId}
                    onChange={handleChange}
                    required
                    placeholder="ID del usuario que realiza el pago"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor="ventaId" className="block text-sm font-medium text-gray-700">ID de Venta</label>
                <input
                    type="text"
                    name="ventaId"
                    id="ventaId"
                    value={formData.ventaId}
                    onChange={handleChange}
                    required
                    placeholder="ID de la venta asociada"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor="valorPago" className="block text-sm font-medium text-gray-700">Valor del Pago</label>
                <input
                    type="number"
                    name="valorPago"
                    id="valorPago"
                    value={formData.valorPago}
                    onChange={handleChange}
                    required
                    step="0.01"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor="metodoPago" className="block text-sm font-medium text-gray-700">Método de Pago</label>
                <select
                    name="metodoPago"
                    id="metodoPago"
                    value={formData.metodoPago}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                    <option value="">Selecciona un método</option>
                    {Object.values(MetodoPago).map(metodo => (
                        <option key={metodo} value={metodo}>{metodo.replace(/_/g, ' ')}</option>
                    ))}
                </select>
            </div>

            <div className="flex justify-end space-x-4">
                <BotonCancelar type="button" onClick={() => router.push('/admin/pagos')}>
                    Cancelar
                </BotonCancelar>
                <BotonGeneral type="submit">
                    Guardar Pago
                </BotonGeneral>
            </div>
        </form>
    );
}
