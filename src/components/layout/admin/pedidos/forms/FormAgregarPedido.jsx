"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { guardarPedido } from '@/app/acciones/PedidoActions';
import { EstadoPedido } from '@/models/enums/PedidoEnums';
import { BotonGeneral, BotonCancelar } from '@/components/common/botones';
import Alert from '@/components/common/Alert';

export default function FormAgregarPedido() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        desingIds: '', // String separado por comas
        proveedorId: '',
        // estadoPedido se establece por defecto en el backend
        valorPedido: '',
        fechaEstimadaEntrega: '',
        detallesPedido: '' // String separado por comas
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
            valorPedido: parseFloat(formData.valorPedido) || 0,
            // Las actions se encargarán de convertir los strings a arrays
        };

        if (!dataToSave.desingIds || !dataToSave.proveedorId || !dataToSave.valorPedido || !dataToSave.fechaEstimadaEntrega) {
            setAlert({ show: true, type: 'error', message: 'Por favor, completa todos los campos obligatorios (IDs de Diseño, ID Proveedor, Valor, Fecha Estimada).' });
            return;
        }
        
        const result = await guardarPedido(dataToSave);

        if (result.error) {
            setAlert({ show: true, type: 'error', message: `Error al guardar el pedido: ${result.error}` });
        } else {
            setAlert({ show: true, type: 'success', message: 'Pedido guardado exitosamente.' });
            setTimeout(() => {
                router.push('/admin/pedidos');
            }, 2000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-4 bg-white shadow-md rounded-lg">
            {alert.show && <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ show: false })} />}
            
            <div>
                <label htmlFor="desingIds" className="block text-sm font-medium text-gray-700">IDs de Diseño (separados por coma)</label>
                <input
                    type="text"
                    name="desingIds"
                    id="desingIds"
                    value={formData.desingIds}
                    onChange={handleChange}
                    required
                    placeholder="Ej: id1,id2,id3"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor="proveedorId" className="block text-sm font-medium text-gray-700">ID de Proveedor</label>
                <input
                    type="text"
                    name="proveedorId"
                    id="proveedorId"
                    value={formData.proveedorId}
                    onChange={handleChange}
                    required
                    placeholder="ID del proveedor"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
            
            <div>
                <label htmlFor="valorPedido" className="block text-sm font-medium text-gray-700">Valor del Pedido</label>
                <input
                    type="number"
                    name="valorPedido"
                    id="valorPedido"
                    value={formData.valorPedido}
                    onChange={handleChange}
                    required
                    step="0.01"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor="fechaEstimadaEntrega" className="block text-sm font-medium text-gray-700">Fecha Estimada de Entrega</label>
                <input
                    type="date"
                    name="fechaEstimadaEntrega"
                    id="fechaEstimadaEntrega"
                    value={formData.fechaEstimadaEntrega}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor="detallesPedido" className="block text-sm font-medium text-gray-700">Detalles del Pedido (opcional, separados por coma)</label>
                <textarea
                    name="detallesPedido"
                    id="detallesPedido"
                    value={formData.detallesPedido}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Ej: Color especial, Talla única, ..."
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>


            <div className="flex justify-end space-x-4">
                <BotonCancelar type="button" onClick={() => router.push('/admin/pedidos')}>
                    Cancelar
                </BotonCancelar>
                <BotonGeneral type="submit">
                    Guardar Pedido
                </BotonGeneral>
            </div>
        </form>
    );
}
