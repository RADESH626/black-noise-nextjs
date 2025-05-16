"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ObtenerElementoPorId, EditarElemento } from '@/app/acciones/ElementoActions';
import { TipoElemento } from '@/models/enums/elemento/TipoElemento';
import { MaterialElemento } from '@/models/enums/elemento/MaterialElemento';
import { BotonGeneral, BotonCancelar } from '@/components/common/botones';
import { InputCheckBox } from '@/components/common/inputs';
import Alert from '@/components/common/Alert';

export default function FormEditarElemento({ elementoId }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        nombreElemento: '',
        tipoElemento: '',
        materialElemento: '',
        valorElemento: '',
        recurso: '',
        habilitado: true,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });

    useEffect(() => {
        async function fetchElemento() {
            setIsLoading(true);
            setAlert({ show: false, type: '', message: '' });
            const elementoData = await ObtenerElementoPorId(elementoId);
            if (elementoData && !elementoData.error) {
                setFormData({
                    nombreElemento: elementoData.nombreElemento || '',
                    tipoElemento: elementoData.tipoElemento || '',
                    materialElemento: elementoData.materialElemento || '',
                    valorElemento: elementoData.valorElemento?.toString() || '',
                    recurso: elementoData.recurso || '',
                    habilitado: elementoData.habilitado === undefined ? true : elementoData.habilitado,
                });
            } else {
                setAlert({ show: true, type: 'error', message: elementoData.error || 'Error al cargar el elemento.' });
            }
            setIsLoading(false);
        }
        if (elementoId) {
            fetchElemento();
        }
    }, [elementoId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAlert({ show: false, type: '', message: '' });
        setIsLoading(true);

        const dataToUpdate = {
            ...formData,
            valorElemento: parseFloat(formData.valorElemento) || 0,
        };
        
        const result = await EditarElemento(elementoId, dataToUpdate);

        if (result.error) {
            setAlert({ show: true, type: 'error', message: `Error al editar el elemento: ${result.error}` });
        } else {
            setAlert({ show: true, type: 'success', message: 'Elemento actualizado exitosamente.' });
            setTimeout(() => {
                router.push('/admin/elementos');
            }, 2000);
        }
        setIsLoading(false);
    };

    if (isLoading && !alert.show) {
        return <p className="text-center p-4">Cargando datos del elemento...</p>;
    }
    
    if (alert.show && alert.type === 'error' && formData.nombreElemento === '') {
        return <Alert type={alert.type} message={alert.message} onClose={() => router.push('/admin/elementos')} />;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-4 bg-white shadow-md rounded-lg">
            {alert.show && <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ show: false })} />}
            
            <div>
                <label htmlFor="nombreElemento" className="block text-sm font-medium text-gray-700">Nombre del Elemento</label>
                <input type="text" name="nombreElemento" id="nombreElemento" value={formData.nombreElemento} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>

            <div>
                <label htmlFor="tipoElemento" className="block text-sm font-medium text-gray-700">Tipo de Elemento</label>
                <select name="tipoElemento" id="tipoElemento" value={formData.tipoElemento} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option value="">Selecciona un tipo</option>
                    {Object.values(TipoElemento).map(tipo => (<option key={tipo} value={tipo}>{tipo}</option>))}
                </select>
            </div>

            <div>
                <label htmlFor="materialElemento" className="block text-sm font-medium text-gray-700">Material del Elemento</label>
                <select name="materialElemento" id="materialElemento" value={formData.materialElemento} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option value="">Selecciona un material</option>
                    {Object.values(MaterialElemento).map(material => (<option key={material} value={material}>{material}</option>))}
                </select>
            </div>

            <div>
                <label htmlFor="valorElemento" className="block text-sm font-medium text-gray-700">Valor del Elemento</label>
                <input type="number" name="valorElemento" id="valorElemento" value={formData.valorElemento} onChange={handleChange} required step="0.01" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>

            <div>
                <label htmlFor="recurso" className="block text-sm font-medium text-gray-700">URL del Recurso (Imagen)</label>
                <input type="url" name="recurso" id="recurso" value={formData.recurso} onChange={handleChange} required placeholder="https://ejemplo.com/imagen.jpg" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>

            <div className="flex items-center">
                <InputCheckBox id="habilitado" name="habilitado" checked={formData.habilitado} onChange={handleChange} />
                <label htmlFor="habilitado" className="ml-2 block text-sm text-gray-900">Habilitado</label>
            </div>

            <div className="flex justify-end space-x-4">
                <BotonCancelar type="button" onClick={() => router.push('/admin/elementos')}>Cancelar</BotonCancelar>
                <BotonGeneral type="submit" disabled={isLoading}>Actualizar Elemento</BotonGeneral>
            </div>
        </form>
    );
}
