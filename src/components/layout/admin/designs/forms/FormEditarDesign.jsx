"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ObtenerDesignPorId, EditarDesign } from '@/app/acciones/DesignActions';
import { CategoriaDesing } from '@/models/enums/design/CategoriaDesing';
import { EstadoDesing } from '@/models/enums/design/EstadoDesing';
import { BotonGeneral, BotonCancelar } from '@/components/common/botones';
import Alert from '@/components/common/Alert';

export default function FormEditarDesign({ designId }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        usuarioId: '',
        nombreDesing: '',
        categoria: '',
        palabrasClave: '',
        valorDesing: '',
        estadoDesing: '',
        elementoIds: '',
        imagenDesing: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });

    useEffect(() => {
        async function fetchDesign() {
            setIsLoading(true);
            setAlert({ show: false, type: '', message: '' });
            const designData = await ObtenerDesignPorId(designId);
            if (designData && !designData.error) {
                setFormData({
                    usuarioId: designData.usuarioId?._id || designData.usuarioId || '', // Manejar si es objeto o string
                    nombreDesing: designData.nombreDesing || '',
                    categoria: designData.categoria || '',
                    palabrasClave: Array.isArray(designData.palabrasClave) ? designData.palabrasClave.join(', ') : '',
                    valorDesing: designData.valorDesing?.toString() || '',
                    estadoDesing: designData.estadoDesing || '',
                    elementoIds: Array.isArray(designData.elementoIds) ? designData.elementoIds.join(', ') : '',
                    imagenDesing: designData.imagenDesing || ''
                });
            } else {
                setAlert({ show: true, type: 'error', message: designData.error || 'Error al cargar el diseño.' });
            }
            setIsLoading(false);
        }
        if (designId) {
            fetchDesign();
        }
    }, [designId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAlert({ show: false, type: '', message: '' });
        setIsLoading(true);

        const dataToUpdate = {
            ...formData,
            valorDesing: parseFloat(formData.valorDesing) || 0,
            palabrasClave: formData.palabrasClave.split(',').map(kw => kw.trim()).filter(kw => kw),
            elementoIds: formData.elementoIds.split(',').map(id => id.trim()).filter(id => id),
        };
        
        // Remover campos que no deben enviarse si están vacíos o son el ID
        // delete dataToUpdate._id; // Asegurarse de no enviar _id si está en formData

        const result = await EditarDesign(designId, dataToUpdate);

        if (result.error) {
            setAlert({ show: true, type: 'error', message: `Error al editar el diseño: ${result.error}` });
        } else {
            setAlert({ show: true, type: 'success', message: 'Diseño actualizado exitosamente.' });
            setTimeout(() => {
                router.push('/admin/designs');
            }, 2000);
        }
        setIsLoading(false);
    };

    if (isLoading && !alert.show) { // Muestra cargando solo si no hay una alerta de error de carga inicial
        return <p className="text-center p-4">Cargando datos del diseño...</p>;
    }
    
    if (alert.show && alert.type === 'error' && formData.nombreDesing === '') { // Si hubo error cargando y no hay datos
        return <Alert type={alert.type} message={alert.message} onClose={() => router.push('/admin/designs')} />;
    }


    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-4 bg-white shadow-md rounded-lg">
            {alert.show && <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ show: false })} />}
            
            <div>
                <label htmlFor="nombreDesing" className="block text-sm font-medium text-gray-700">Nombre del Diseño</label>
                <input type="text" name="nombreDesing" id="nombreDesing" value={formData.nombreDesing} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>

            <div>
                <label htmlFor="usuarioId" className="block text-sm font-medium text-gray-700">ID de Usuario (Creador)</label>
                <input type="text" name="usuarioId" id="usuarioId" value={formData.usuarioId} onChange={handleChange} required placeholder="ID del usuario creador" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>

            <div>
                <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">Categoría</label>
                <select name="categoria" id="categoria" value={formData.categoria} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option value="">Selecciona una categoría</option>
                    {Object.values(CategoriaDesing).map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                </select>
            </div>

            <div>
                <label htmlFor="palabrasClave" className="block text-sm font-medium text-gray-700">Palabras Clave (separadas por coma)</label>
                <input type="text" name="palabrasClave" id="palabrasClave" value={formData.palabrasClave} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>

            <div>
                <label htmlFor="valorDesing" className="block text-sm font-medium text-gray-700">Valor del Diseño</label>
                <input type="number" name="valorDesing" id="valorDesing" value={formData.valorDesing} onChange={handleChange} required step="0.01" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>

            <div>
                <label htmlFor="estadoDesing" className="block text-sm font-medium text-gray-700">Estado del Diseño</label>
                <select name="estadoDesing" id="estadoDesing" value={formData.estadoDesing} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option value="">Selecciona un estado</option>
                    {Object.values(EstadoDesing).map(est => (<option key={est} value={est}>{est}</option>))}
                </select>
            </div>
            
            <div>
                <label htmlFor="elementoIds" className="block text-sm font-medium text-gray-700">IDs de Elementos (separados por coma)</label>
                <input type="text" name="elementoIds" id="elementoIds" value={formData.elementoIds} onChange={handleChange} placeholder="Ej: id1,id2,id3" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>

            <div>
                <label htmlFor="imagenDesing" className="block text-sm font-medium text-gray-700">URL de la Imagen del Diseño</label>
                <input type="url" name="imagenDesing" id="imagenDesing" value={formData.imagenDesing} onChange={handleChange} required placeholder="https://ejemplo.com/imagen.jpg" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>

            <div className="flex justify-end space-x-4">
                <BotonCancelar type="button" onClick={() => router.push('/admin/designs')}>Cancelar</BotonCancelar>
                <BotonGeneral type="submit" disabled={isLoading}>Actualizar Diseño</BotonGeneral>
            </div>
        </form>
    );
}
