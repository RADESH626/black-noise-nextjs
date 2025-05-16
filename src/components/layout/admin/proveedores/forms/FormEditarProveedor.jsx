"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ObtenerProveedorPorId, EditarProveedor } from '@/app/acciones/ProveedorActions';
import { Especialidad, Disponibilidad } from '@/models/enums/proveedor';
import { MetodoPago } from '@/models/enums/pago/MetodoPago';
import { BotonGeneral, BotonCancelar } from '@/components/common/botones';
import { InputCheckBox } from '@/components/common/inputs';
import Alert from '@/components/common/Alert';

export default function FormEditarProveedor({ proveedorId }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        nombreProveedor: '',
        nit: '', // No editable
        direccionEmpresa: '',
        rut: '',
        usuarioId: '', // No editable
        nombreUsuario: '', // Para mostrar
        especialidad: '',
        disponibilidad: '', // Editable aquí también, o solo desde el listado
        metodosPagoAceptados: [],
        comision: '',
        permisosDetallesCredito: false,
    });
    const [metodosPagoInput, setMetodosPagoInput] = useState('');
    const [originalData, setOriginalData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });

    useEffect(() => {
        async function fetchProveedor() {
            setIsLoading(true);
            setAlert({ show: false, type: '', message: '' });
            const provData = await ObtenerProveedorPorId(proveedorId);
            if (provData && !provData.error) {
                const data = {
                    nombreProveedor: provData.nombreProveedor || '',
                    nit: provData.nit || 'N/A',
                    direccionEmpresa: provData.direccionEmpresa || '',
                    rut: provData.rut || '',
                    usuarioId: provData.usuarioId?._id || provData.usuarioId || 'N/A',
                    nombreUsuario: provData.usuarioId?.nombreUsuario || provData.usuarioId?.correo || 'N/A',
                    especialidad: provData.especialidad || '',
                    disponibilidad: provData.disponibilidad || '',
                    metodosPagoAceptados: provData.metodosPagoAceptados || [],
                    comision: provData.comision?.toString() || '',
                    permisosDetallesCredito: provData.permisosDetallesCredito || false,
                };
                setFormData(data);
                setMetodosPagoInput(data.metodosPagoAceptados.join(','));
                setOriginalData(data);
            } else {
                setAlert({ show: true, type: 'error', message: provData.error || 'Error al cargar el proveedor.' });
            }
            setIsLoading(false);
        }
        if (proveedorId) {
            fetchProveedor();
        }
    }, [proveedorId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === "metodosPagoInput") {
            setMetodosPagoInput(value);
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAlert({ show: false, type: '', message: '' });
        setIsLoading(true);

        const dataToUpdate = {};
        const currentMetodosPago = metodosPagoInput.split(',').map(m => m.trim()).filter(m => m);

        if (formData.nombreProveedor !== originalData.nombreProveedor) dataToUpdate.nombreProveedor = formData.nombreProveedor;
        if (formData.direccionEmpresa !== originalData.direccionEmpresa) dataToUpdate.direccionEmpresa = formData.direccionEmpresa;
        if (formData.rut !== originalData.rut) dataToUpdate.rut = formData.rut;
        if (formData.especialidad !== originalData.especialidad) dataToUpdate.especialidad = formData.especialidad;
        if (formData.disponibilidad !== originalData.disponibilidad) dataToUpdate.disponibilidad = formData.disponibilidad;
        if (JSON.stringify(currentMetodosPago) !== JSON.stringify(originalData.metodosPagoAceptados)) dataToUpdate.metodosPagoAceptados = currentMetodosPago;
        if (formData.comision !== originalData.comision) dataToUpdate.comision = parseFloat(formData.comision) || 0;
        if (formData.permisosDetallesCredito !== originalData.permisosDetallesCredito) dataToUpdate.permisosDetallesCredito = formData.permisosDetallesCredito;
        // NIT y usuarioId no se envían para actualizar

        if (Object.keys(dataToUpdate).length === 0) {
            setAlert({ show: true, type: 'info', message: 'No se han realizado cambios.' });
            setIsLoading(false);
            return;
        }
        
        const result = await EditarProveedor(proveedorId, dataToUpdate);

        if (result.error) {
            setAlert({ show: true, type: 'error', message: `Error al editar el proveedor: ${result.error}` });
        } else {
            setAlert({ show: true, type: 'success', message: 'Proveedor actualizado exitosamente.' });
            setTimeout(() => {
                router.push('/admin/proveedores');
            }, 2000);
        }
        setIsLoading(false);
    };

    if (isLoading && !alert.show) {
        return <p className="text-center p-4">Cargando datos del proveedor...</p>;
    }
    
    if (alert.show && alert.type === 'error' && !originalData) {
        return <Alert type={alert.type} message={alert.message} onClose={() => router.push('/admin/proveedores')} />;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-4 bg-white shadow-md rounded-lg">
            {alert.show && <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ show: false })} />}
            
            <div><label className="block text-sm font-medium text-gray-700">ID Proveedor: </label><p className="mt-1 text-sm text-gray-500">{proveedorId}</p></div>
            <div><label className="block text-sm font-medium text-gray-700">NIT: </label><p className="mt-1 text-sm text-gray-500">{formData.nit}</p></div>
            <div><label className="block text-sm font-medium text-gray-700">Usuario Asociado: </label><p className="mt-1 text-sm text-gray-500">{formData.nombreUsuario} ({formData.usuarioId})</p></div>

            <div>
                <label htmlFor="nombreProveedor" className="block text-sm font-medium text-gray-700">Nombre del Proveedor</label>
                <input type="text" name="nombreProveedor" id="nombreProveedor" value={formData.nombreProveedor} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
                <label htmlFor="direccionEmpresa" className="block text-sm font-medium text-gray-700">Dirección de la Empresa</label>
                <input type="text" name="direccionEmpresa" id="direccionEmpresa" value={formData.direccionEmpresa} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
                <label htmlFor="rut" className="block text-sm font-medium text-gray-700">RUT</label>
                <input type="text" name="rut" id="rut" value={formData.rut} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
                <label htmlFor="especialidad" className="block text-sm font-medium text-gray-700">Especialidad</label>
                <select name="especialidad" id="especialidad" value={formData.especialidad} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    {Object.values(Especialidad).map(esp => (<option key={esp} value={esp}>{esp.replace(/_/g, ' ')}</option>))}
                </select>
            </div>
            <div>
                <label htmlFor="disponibilidad" className="block text-sm font-medium text-gray-700">Disponibilidad</label>
                <select name="disponibilidad" id="disponibilidad" value={formData.disponibilidad} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    {Object.values(Disponibilidad).map(disp => (<option key={disp} value={disp}>{disp.replace(/_/g, ' ')}</option>))}
                </select>
            </div>
            <div>
                <label htmlFor="metodosPagoInput" className="block text-sm font-medium text-gray-700">Métodos de Pago Aceptados (separados por coma)</label>
                <input type="text" name="metodosPagoInput" id="metodosPagoInput" value={metodosPagoInput} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                 <p className="text-xs text-gray-500 mt-1">Valores posibles: {Object.values(MetodoPago).join(', ')}</p>
            </div>
            <div>
                <label htmlFor="comision" className="block text-sm font-medium text-gray-700">Comisión (%)</label>
                <input type="number" name="comision" id="comision" value={formData.comision} onChange={handleChange} required step="0.01" min="0" max="100" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div className="flex items-center">
                <InputCheckBox id="permisosDetallesCredito" name="permisosDetallesCredito" checked={formData.permisosDetallesCredito} onChange={handleChange} />
                <label htmlFor="permisosDetallesCredito" className="ml-2 block text-sm text-gray-900">Permitir ver detalles de crédito</label>
            </div>

            <div className="flex justify-end space-x-4">
                <BotonCancelar type="button" onClick={() => router.push('/admin/proveedores')}>Cancelar</BotonCancelar>
                <BotonGeneral type="submit" disabled={isLoading}>Actualizar Proveedor</BotonGeneral>
            </div>
        </form>
    );
}
