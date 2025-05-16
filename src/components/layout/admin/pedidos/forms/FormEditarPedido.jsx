"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ObtenerPedidoPorId, EditarPedido } from '@/app/acciones/PedidoActions';
import { EstadoPedido } from '@/models/enums/PedidoEnums';
import { BotonGeneral, BotonCancelar } from '@/components/common/botones';
import Alert from '@/components/common/Alert';

export default function FormEditarPedido({ pedidoId }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        desingIds: '', // String separado por comas
        proveedorId: '', // No editable, solo para mostrar
        nombreProveedor: '', // No editable, solo para mostrar
        estadoPedido: '',
        valorPedido: '',
        fechaEstimadaEntrega: '',
        detallesPedido: '' // String separado por comas
    });
    const [originalData, setOriginalData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });

    useEffect(() => {
        async function fetchPedido() {
            setIsLoading(true);
            setAlert({ show: false, type: '', message: '' });
            const pedidoData = await ObtenerPedidoPorId(pedidoId);
            if (pedidoData && !pedidoData.error) {
                const data = {
                    desingIds: pedidoData.desingIds?.map(d => d._id).join(',') || '',
                    proveedorId: pedidoData.proveedorId?._id || pedidoData.proveedorId || 'N/A',
                    nombreProveedor: pedidoData.proveedorId?.nombreProveedor || 'N/A',
                    estadoPedido: pedidoData.estadoPedido || '',
                    valorPedido: pedidoData.valorPedido?.toString() || '',
                    fechaEstimadaEntrega: pedidoData.fechaEstimadaEntrega ? new Date(pedidoData.fechaEstimadaEntrega).toISOString().split('T')[0] : '',
                    detallesPedido: pedidoData.detallesPedido?.join(',') || ''
                };
                setFormData(data);
                setOriginalData(data);
            } else {
                setAlert({ show: true, type: 'error', message: pedidoData.error || 'Error al cargar el pedido.' });
            }
            setIsLoading(false);
        }
        if (pedidoId) {
            fetchPedido();
        }
    }, [pedidoId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAlert({ show: false, type: '', message: '' });
        setIsLoading(true);

        const dataToUpdate = {};
        // Comparar con originalData para enviar solo lo que cambió
        if (formData.desingIds !== originalData.desingIds) dataToUpdate.desingIds = formData.desingIds;
        if (formData.estadoPedido !== originalData.estadoPedido) dataToUpdate.estadoPedido = formData.estadoPedido;
        if (formData.valorPedido !== originalData.valorPedido) dataToUpdate.valorPedido = parseFloat(formData.valorPedido) || 0;
        if (formData.fechaEstimadaEntrega !== originalData.fechaEstimadaEntrega) dataToUpdate.fechaEstimadaEntrega = formData.fechaEstimadaEntrega;
        if (formData.detallesPedido !== originalData.detallesPedido) dataToUpdate.detallesPedido = formData.detallesPedido;
        // proveedorId no se edita desde aquí

        if (Object.keys(dataToUpdate).length === 0) {
            setAlert({ show: true, type: 'info', message: 'No se han realizado cambios.' });
            setIsLoading(false);
            return;
        }
        
        const result = await EditarPedido(pedidoId, dataToUpdate);

        if (result.error) {
            setAlert({ show: true, type: 'error', message: `Error al editar el pedido: ${result.error}` });
        } else {
            setAlert({ show: true, type: 'success', message: 'Pedido actualizado exitosamente.' });
            setTimeout(() => {
                router.push('/admin/pedidos');
            }, 2000);
        }
        setIsLoading(false);
    };

    if (isLoading && !alert.show) {
        return <p className="text-center p-4">Cargando datos del pedido...</p>;
    }
    
    if (alert.show && alert.type === 'error' && !originalData) {
        return <Alert type={alert.type} message={alert.message} onClose={() => router.push('/admin/pedidos')} />;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-4 bg-white shadow-md rounded-lg">
            {alert.show && <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ show: false })} />}
            
            <div>
                <label className="block text-sm font-medium text-gray-700">ID de Pedido</label>
                <p className="mt-1 text-sm text-gray-500">{pedidoId}</p>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Proveedor</label>
                <p className="mt-1 text-sm text-gray-500">{formData.nombreProveedor} ({formData.proveedorId})</p>
            </div>

            <div>
                <label htmlFor="desingIds" className="block text-sm font-medium text-gray-700">IDs de Diseño (separados por coma)</label>
                <input type="text" name="desingIds" id="desingIds" value={formData.desingIds} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>

            <div>
                <label htmlFor="estadoPedido" className="block text-sm font-medium text-gray-700">Estado del Pedido</label>
                <select name="estadoPedido" id="estadoPedido" value={formData.estadoPedido} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    {Object.values(EstadoPedido).map(est => (<option key={est} value={est}>{est.replace(/_/g, ' ')}</option>))}
                </select>
            </div>
            
            <div>
                <label htmlFor="valorPedido" className="block text-sm font-medium text-gray-700">Valor del Pedido</label>
                <input type="number" name="valorPedido" id="valorPedido" value={formData.valorPedido} onChange={handleChange} step="0.01" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>

            <div>
                <label htmlFor="fechaEstimadaEntrega" className="block text-sm font-medium text-gray-700">Fecha Estimada de Entrega</label>
                <input type="date" name="fechaEstimadaEntrega" id="fechaEstimadaEntrega" value={formData.fechaEstimadaEntrega} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>

            <div>
                <label htmlFor="detallesPedido" className="block text-sm font-medium text-gray-700">Detalles del Pedido (separados por coma)</label>
                <textarea name="detallesPedido" id="detallesPedido" value={formData.detallesPedido} onChange={handleChange} rows="3" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>

            <div className="flex justify-end space-x-4">
                <BotonCancelar type="button" onClick={() => router.push('/admin/pedidos')}>Cancelar</BotonCancelar>
                <BotonGeneral type="submit" disabled={isLoading}>Actualizar Pedido</BotonGeneral>
            </div>
        </form>
    );
}
