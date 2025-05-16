"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { guardarProveedor } from '@/app/acciones/ProveedorActions';
import { Especialidad } from '@/models/enums/proveedor/Especialidad';
import { MetodoPago } from '@/models/enums/pago/MetodoPago'; 
// Disponibilidad se maneja por defecto en el backend al crear
import { BotonGeneral, BotonCancelar } from '@/components/common/botones';
import { InputCheckBox } from '@/components/common/inputs';
import Alert from '@/components/common/Alert';

export default function FormAgregarProveedor() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        nombreProveedor: '',
        nit: '',
        direccionEmpresa: '',
        rut: '',
        usuarioId: '',
        especialidad: '',
        metodosPagoAceptados: [], // Se manejará como string en el input, luego se convierte
        comision: '',
        permisosDetallesCredito: false,
        // disponibilidad se establece por defecto en el backend
    });
    const [metodosPagoInput, setMetodosPagoInput] = useState(''); // Para el input de texto
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });

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

        const dataToSave = {
            ...formData,
            comision: parseFloat(formData.comision) || 0,
            metodosPagoAceptados: metodosPagoInput.split(',').map(m => m.trim()).filter(m => m),
        };

        if (!dataToSave.nombreProveedor || !dataToSave.nit || !dataToSave.direccionEmpresa || !dataToSave.rut || !dataToSave.usuarioId || !dataToSave.especialidad || !dataToSave.comision) {
            setAlert({ show: true, type: 'error', message: 'Por favor, completa todos los campos obligatorios.' });
            return;
        }
        
        const result = await guardarProveedor(dataToSave);

        if (result.error) {
            setAlert({ show: true, type: 'error', message: `Error al guardar el proveedor: ${result.error}` });
        } else {
            setAlert({ show: true, type: 'success', message: 'Proveedor guardado exitosamente.' });
            setTimeout(() => {
                router.push('/admin/proveedores');
            }, 2000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-4 bg-white shadow-md rounded-lg">
            {alert.show && <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ show: false })} />}
            
            <div>
                <label htmlFor="nombreProveedor" className="block text-sm font-medium text-gray-700">Nombre del Proveedor</label>
                <input type="text" name="nombreProveedor" id="nombreProveedor" value={formData.nombreProveedor} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>

            <div>
                <label htmlFor="nit" className="block text-sm font-medium text-gray-700">NIT</label>
                <input type="text" name="nit" id="nit" value={formData.nit} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>

            <div>
                <label htmlFor="direccionEmpresa" className="block text-sm font-medium text-gray-700">Dirección de la Empresa</label>
                <input type="text" name="direccionEmpresa" id="direccionEmpresa" value={formData.direccionEmpresa} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>

            <div>
                <label htmlFor="rut" className="block text-sm font-medium text-gray-700">RUT (URL o identificador)</label>
                <input type="text" name="rut" id="rut" value={formData.rut} onChange={handleChange} required placeholder="Ej: URL del documento o número" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>

            <div>
                <label htmlFor="usuarioId" className="block text-sm font-medium text-gray-700">ID de Usuario (Asociado)</label>
                <input type="text" name="usuarioId" id="usuarioId" value={formData.usuarioId} onChange={handleChange} required placeholder="ID del usuario que representa al proveedor" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>

            <div>
                <label htmlFor="especialidad" className="block text-sm font-medium text-gray-700">Especialidad</label>
                <select name="especialidad" id="especialidad" value={formData.especialidad} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option value="">Selecciona una especialidad</option>
                    {Object.values(Especialidad).map(esp => (<option key={esp} value={esp}>{esp.replace(/_/g, ' ')}</option>))}
                </select>
            </div>

            <div>
                <label htmlFor="metodosPagoInput" className="block text-sm font-medium text-gray-700">Métodos de Pago Aceptados (separados por coma)</label>
                <input type="text" name="metodosPagoInput" id="metodosPagoInput" value={metodosPagoInput} onChange={handleChange} placeholder="Ej: TARJETA_CREDITO,PSE" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
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
                <BotonGeneral type="submit">Guardar Proveedor</BotonGeneral>
            </div>
        </form>
    );
}
