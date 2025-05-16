"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ObtenerPagoPorId, EditarPago } from '@/app/acciones/PagoActions';
import { MetodoPago } from '@/models/enums/pago/MetodoPago';
import { EstadoPago } from '@/models/enums/pago/EstadoPago';
import { BotonGeneral, BotonCancelar } from '@/components/common/botones';
import Alert from '@/components/common/Alert';

export default function FormEditarPago({ pagoId }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        usuarioId: '', // No editable, solo para mostrar
        ventaId: '',   // No editable, solo para mostrar
        valorPago: '', // Opcionalmente editable
        metodoPago: '', // Opcionalmente editable
        estadoPago: '', // Principalmente editable
    });
    const [originalData, setOriginalData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });

    useEffect(() => {
        async function fetchPago() {
            setIsLoading(true);
            setAlert({ show: false, type: '', message: '' });
            const pagoData = await ObtenerPagoPorId(pagoId);
            if (pagoData && !pagoData.error) {
                const data = {
                    usuarioId: pagoData.usuarioId?._id || pagoData.usuarioId || 'N/A',
                    nombreUsuario: pagoData.usuarioId?.nombreUsuario || pagoData.usuarioId?.correo || 'N/A',
                    ventaId: pagoData.ventaId?._id || pagoData.ventaId || 'N/A',
                    valorPago: pagoData.valorPago?.toString() || '',
                    metodoPago: pagoData.metodoPago || '',
                    estadoPago: pagoData.estadoPago || '',
                };
                setFormData(data);
                setOriginalData(data); // Guardar datos originales para comparación
            } else {
                setAlert({ show: true, type: 'error', message: pagoData.error || 'Error al cargar el pago.' });
            }
            setIsLoading(false);
        }
        if (pagoId) {
            fetchPago();
        }
    }, [pagoId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAlert({ show: false, type: '', message: '' });
        setIsLoading(true);

        const dataToUpdate = {};
        // Solo enviar campos que han cambiado y son editables
        if (formData.estadoPago !== originalData.estadoPago) {
            dataToUpdate.estadoPago = formData.estadoPago;
        }
        if (formData.metodoPago !== originalData.metodoPago) {
            dataToUpdate.metodoPago = formData.metodoPago;
        }
        if (formData.valorPago !== originalData.valorPago) {
            dataToUpdate.valorPago = parseFloat(formData.valorPago) || 0;
        }

        if (Object.keys(dataToUpdate).length === 0) {
            setAlert({ show: true, type: 'info', message: 'No se han realizado cambios.' });
            setIsLoading(false);
            return;
        }
        
        const result = await EditarPago(pagoId, dataToUpdate);

        if (result.error) {
            setAlert({ show: true, type: 'error', message: `Error al editar el pago: ${result.error}` });
        } else {
            setAlert({ show: true, type: 'success', message: 'Pago actualizado exitosamente.' });
            setTimeout(() => {
                router.push('/admin/pagos');
            }, 2000);
        }
        setIsLoading(false);
    };

    if (isLoading && !alert.show) {
        return <p className="text-center p-4">Cargando datos del pago...</p>;
    }
    
    if (alert.show && alert.type === 'error' && !originalData) { // Si hubo error cargando y no hay datos
        return <Alert type={alert.type} message={alert.message} onClose={() => router.push('/admin/pagos')} />;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-4 bg-white shadow-md rounded-lg">
            {alert.show && <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ show: false })} />}
            
            <div>
                <label className="block text-sm font-medium text-gray-700">ID de Pago</label>
                <p className="mt-1 text-sm text-gray-500">{pagoId}</p>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Usuario</label>
                <p className="mt-1 text-sm text-gray-500">{formData.nombreUsuario} ({formData.usuarioId})</p>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">ID de Venta</label>
                <p className="mt-1 text-sm text-gray-500">{formData.ventaId}</p>
            </div>

            <div>
                <label htmlFor="valorPago" className="block text-sm font-medium text-gray-700">Valor del Pago</label>
                <input
                    type="number"
                    name="valorPago"
                    id="valorPago"
                    value={formData.valorPago}
                    onChange={handleChange}
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
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                    <option value="">Selecciona un método</option>
                    {Object.values(MetodoPago).map(metodo => (
                        <option key={metodo} value={metodo}>{metodo.replace(/_/g, ' ')}</option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="estadoPago" className="block text-sm font-medium text-gray-700">Estado del Pago</label>
                <select
                    name="estadoPago"
                    id="estadoPago"
                    value={formData.estadoPago}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                    <option value="">Selecciona un estado</option>
                    {Object.values(EstadoPago).map(est => (
                        <option key={est} value={est}>{est.replace(/_/g, ' ')}</option>
                    ))}
                </select>
            </div>

            <div className="flex justify-end space-x-4">
                <BotonCancelar type="button" onClick={() => router.push('/admin/pagos')}>Cancelar</BotonCancelar>
                <BotonGeneral type="submit" disabled={isLoading}>Actualizar Pago</BotonGeneral>
            </div>
        </form>
    );
}
