"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ObtenerVentaPorId, EditarVenta } from '@/app/acciones/VentaActions';
import { EstadoVenta } from '@/models/enums/VentaEnums';
import { BotonGeneral, BotonCancelar } from '@/components/common/botones';
import Alert from '@/components/common/Alert';

export default function FormEditarVenta({ ventaId }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        pagoIds: '', // String separado por comas
        pedidoId: '', // No editable
        nombreProveedorPedido: '', // Para mostrar
        comisionAplicacion: '', // No editable
        valorVenta: '', // No editable
        estadoVenta: '',
        detallesVenta: '', // String separado por comas
        fechaRealizacion: '' // No editable
    });
    const [originalData, setOriginalData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });

    useEffect(() => {
        async function fetchVenta() {
            setIsLoading(true);
            setAlert({ show: false, type: '', message: '' });
            const ventaData = await ObtenerVentaPorId(ventaId);
            if (ventaData && !ventaData.error) {
                const data = {
                    pagoIds: ventaData.pagoIds?.map(p => p._id || p).join(',') || '',
                    pedidoId: ventaData.pedidoId?._id || ventaData.pedidoId || 'N/A',
                    nombreProveedorPedido: ventaData.pedidoId?.proveedorId?.nombreProveedor || 'N/A',
                    comisionAplicacion: ventaData.comisionAplicacion?.toString() || '0',
                    valorVenta: ventaData.valorVenta?.toString() || '0',
                    estadoVenta: ventaData.estadoVenta || '',
                    detallesVenta: ventaData.detallesVenta?.join(',') || '',
                    fechaRealizacion: ventaData.fechaRealizacion ? new Date(ventaData.fechaRealizacion).toLocaleDateString() : (ventaData.createdAt ? new Date(ventaData.createdAt).toLocaleDateString() : 'N/A')
                };
                setFormData(data);
                setOriginalData(data);
            } else {
                setAlert({ show: true, type: 'error', message: ventaData.error || 'Error al cargar la venta.' });
            }
            setIsLoading(false);
        }
        if (ventaId) {
            fetchVenta();
        }
    }, [ventaId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAlert({ show: false, type: '', message: '' });
        setIsLoading(true);

        const dataToUpdate = {};
        if (formData.pagoIds !== originalData.pagoIds) dataToUpdate.pagoIds = formData.pagoIds; // Se envía como string, la action lo convierte
        if (formData.estadoVenta !== originalData.estadoVenta) dataToUpdate.estadoVenta = formData.estadoVenta;
        if (formData.detallesVenta !== originalData.detallesVenta) dataToUpdate.detallesVenta = formData.detallesVenta; // Se envía como string, la action lo convierte
        
        // Campos no editables no se envían
        // pedidoId, comisionAplicacion, valorVenta, fechaRealizacion

        if (Object.keys(dataToUpdate).length === 0) {
            setAlert({ show: true, type: 'info', message: 'No se han realizado cambios.' });
            setIsLoading(false);
            return;
        }
        
        const result = await EditarVenta(ventaId, dataToUpdate);

        if (result.error) {
            setAlert({ show: true, type: 'error', message: `Error al editar la venta: ${result.error}` });
        } else {
            setAlert({ show: true, type: 'success', message: 'Venta actualizada exitosamente.' });
            setTimeout(() => {
                router.push('/admin/ventas');
            }, 2000);
        }
        setIsLoading(false);
    };

    if (isLoading && !alert.show) {
        return <p className="text-center p-4">Cargando datos de la venta...</p>;
    }
    
    if (alert.show && alert.type === 'error' && !originalData) {
        return <Alert type={alert.type} message={alert.message} onClose={() => router.push('/admin/ventas')} />;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-4 bg-white shadow-md rounded-lg">
            {alert.show && <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ show: false })} />}
            
            <div><label className="block text-sm font-medium text-gray-700">ID Venta:</label><p className="mt-1 text-sm text-gray-500">{ventaId}</p></div>
            <div><label className="block text-sm font-medium text-gray-700">ID Pedido:</label><p className="mt-1 text-sm text-gray-500">{formData.pedidoId} (Proveedor: {formData.nombreProveedorPedido})</p></div>
            <div><label className="block text-sm font-medium text-gray-700">Comisión Aplicación:</label><p className="mt-1 text-sm text-gray-500">{formData.comisionAplicacion}</p></div>
            <div><label className="block text-sm font-medium text-gray-700">Valor Venta:</label><p className="mt-1 text-sm text-gray-500">{formData.valorVenta}</p></div>
            <div><label className="block text-sm font-medium text-gray-700">Fecha Realización:</label><p className="mt-1 text-sm text-gray-500">{formData.fechaRealizacion}</p></div>

            <div>
                <label htmlFor="pagoIds" className="block text-sm font-medium text-gray-700">IDs de Pago (separados por coma)</label>
                <input type="text" name="pagoIds" id="pagoIds" value={formData.pagoIds} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>

            <div>
                <label htmlFor="estadoVenta" className="block text-sm font-medium text-gray-700">Estado de la Venta</label>
                <select name="estadoVenta" id="estadoVenta" value={formData.estadoVenta} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    {Object.values(EstadoVenta).map(est => (<option key={est} value={est}>{est.replace(/_/g, ' ')}</option>))}
                </select>
            </div>
            
            <div>
                <label htmlFor="detallesVenta" className="block text-sm font-medium text-gray-700">Detalles de la Venta (separados por coma)</label>
                <textarea name="detallesVenta" id="detallesVenta" value={formData.detallesVenta} onChange={handleChange} rows="3" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>

            <div className="flex justify-end space-x-4">
                <BotonCancelar type="button" onClick={() => router.push('/admin/ventas')}>Cancelar</BotonCancelar>
                <BotonGeneral type="submit" disabled={isLoading}>Actualizar Venta</BotonGeneral>
            </div>
        </form>
    );
}
