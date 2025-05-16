"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { guardarVenta } from '@/app/acciones/VentaActions';
// EstadoVenta se establece por defecto en el backend
import { BotonGeneral, BotonCancelar } from '@/components/common/botones';
import Alert from '@/components/common/Alert';

export default function FormAgregarVenta() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        pagoIds: '', // String separado por comas
        pedidoId: '',
        comisionAplicacion: '',
        valorVenta: '',
        detallesVenta: '' // String separado por comas
        // estadoVenta se establece por defecto en el backend
        // fechaRealizacion se establece por defecto en el backend
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
            comisionAplicacion: parseFloat(formData.comisionAplicacion) || 0,
            valorVenta: parseFloat(formData.valorVenta) || 0,
            // Las actions se encargarán de convertir los strings a arrays
        };

        if (!dataToSave.pedidoId || !dataToSave.comisionAplicacion || !dataToSave.valorVenta) {
            setAlert({ show: true, type: 'error', message: 'Por favor, completa todos los campos obligatorios (ID Pedido, Comisión, Valor Venta).' });
            return;
        }
        
        const result = await guardarVenta(dataToSave);

        if (result.error) {
            setAlert({ show: true, type: 'error', message: `Error al guardar la venta: ${result.error}` });
        } else {
            setAlert({ show: true, type: 'success', message: 'Venta guardada exitosamente.' });
            setTimeout(() => {
                router.push('/admin/ventas');
            }, 2000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-4 bg-white shadow-md rounded-lg">
            {alert.show && <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ show: false })} />}
            
            <div>
                <label htmlFor="pedidoId" className="block text-sm font-medium text-gray-700">ID de Pedido</label>
                <input type="text" name="pedidoId" id="pedidoId" value={formData.pedidoId} onChange={handleChange} required placeholder="ID del pedido asociado" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>

            <div>
                <label htmlFor="pagoIds" className="block text-sm font-medium text-gray-700">IDs de Pago (opcional, separados por coma)</label>
                <input type="text" name="pagoIds" id="pagoIds" value={formData.pagoIds} onChange={handleChange} placeholder="Ej: idpago1,idpago2" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            
            <div>
                <label htmlFor="comisionAplicacion" className="block text-sm font-medium text-gray-700">Comisión de Aplicación</label>
                <input type="number" name="comisionAplicacion" id="comisionAplicacion" value={formData.comisionAplicacion} onChange={handleChange} required step="0.01" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>

            <div>
                <label htmlFor="valorVenta" className="block text-sm font-medium text-gray-700">Valor Total de la Venta</label>
                <input type="number" name="valorVenta" id="valorVenta" value={formData.valorVenta} onChange={handleChange} required step="0.01" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>

            <div>
                <label htmlFor="detallesVenta" className="block text-sm font-medium text-gray-700">Detalles de la Venta (opcional, separados por coma)</label>
                <textarea name="detallesVenta" id="detallesVenta" value={formData.detallesVenta} onChange={handleChange} rows="3" placeholder="Ej: Descuento aplicado, Nota especial, ..." className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>

            <div className="flex justify-end space-x-4">
                <BotonCancelar type="button" onClick={() => router.push('/admin/ventas')}>Cancelar</BotonCancelar>
                <BotonGeneral type="submit">Guardar Venta</BotonGeneral>
            </div>
        </form>
    );
}
