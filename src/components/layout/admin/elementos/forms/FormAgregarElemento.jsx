"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { guardarElemento } from '@/app/acciones/ElementoActions';
import { TipoElemento } from '@/models/enums/elemento/TipoElemento';
import { MaterialElemento } from '@/models/enums/elemento/MaterialElemento';
import { BotonGeneral, BotonCancelar } from '@/components/common/botones';
import Alert from '@/components/common/Alert';

export default function FormAgregarElemento() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        nombreElemento: '',
        tipoElemento: '',
        materialElemento: '',
        valorElemento: '',
        recurso: ''
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
            valorElemento: parseFloat(formData.valorElemento) || 0,
        };

        if (!dataToSave.nombreElemento || !dataToSave.tipoElemento || !dataToSave.materialElemento || !dataToSave.valorElemento || !dataToSave.recurso) {
            setAlert({ show: true, type: 'error', message: 'Por favor, completa todos los campos obligatorios.' });
            return;
        }
        
        const result = await guardarElemento(dataToSave);

        if (result.error) {
            setAlert({ show: true, type: 'error', message: `Error al guardar el elemento: ${result.error}` });
        } else {
            setAlert({ show: true, type: 'success', message: 'Elemento guardado exitosamente.' });
            setTimeout(() => {
                router.push('/admin/elementos');
            }, 2000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-4 bg-white shadow-md rounded-lg">
            {alert.show && <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ show: false })} />}
            
            <div>
                <label htmlFor="nombreElemento" className="block text-sm font-medium text-gray-700">Nombre del Elemento</label>
                <input
                    type="text"
                    name="nombreElemento"
                    id="nombreElemento"
                    value={formData.nombreElemento}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor="tipoElemento" className="block text-sm font-medium text-gray-700">Tipo de Elemento</label>
                <select
                    name="tipoElemento"
                    id="tipoElemento"
                    value={formData.tipoElemento}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                    <option value="">Selecciona un tipo</option>
                    {Object.values(TipoElemento).map(tipo => (
                        <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="materialElemento" className="block text-sm font-medium text-gray-700">Material del Elemento</label>
                <select
                    name="materialElemento"
                    id="materialElemento"
                    value={formData.materialElemento}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                    <option value="">Selecciona un material</option>
                    {Object.values(MaterialElemento).map(material => (
                        <option key={material} value={material}>{material}</option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="valorElemento" className="block text-sm font-medium text-gray-700">Valor del Elemento</label>
                <input
                    type="number"
                    name="valorElemento"
                    id="valorElemento"
                    value={formData.valorElemento}
                    onChange={handleChange}
                    required
                    step="0.01"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor="recurso" className="block text-sm font-medium text-gray-700">URL del Recurso (Imagen)</label>
                <input
                    type="url"
                    name="recurso"
                    id="recurso"
                    value={formData.recurso}
                    onChange={handleChange}
                    required
                    placeholder="https://ejemplo.com/imagen.jpg"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>

            <div className="flex justify-end space-x-4">
                <BotonCancelar type="button" onClick={() => router.push('/admin/elementos')}>
                    Cancelar
                </BotonCancelar>
                <BotonGeneral type="submit">
                    Guardar Elemento
                </BotonGeneral>
            </div>
        </form>
    );
}
