"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { guardarDesign } from '@/app/acciones/DesignActions';
import { CategoriaDesing } from '@/models/enums/design/CategoriaDesing';
import { EstadoDesing } from '@/models/enums/design/EstadoDesing';
import { BotonGeneral, BotonCancelar } from '@/components/common/botones';
import Alert from '@/components/common/Alert'; // Asumiendo que tienes un componente de alerta

export default function FormAgregarDesign() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        usuarioId: '',
        nombreDesing: '',
        categoria: '',
        palabrasClave: '', // Se guardará como string, se procesará en la action si es necesario
        valorDesing: '',
        estadoDesing: '',
        elementoIds: '', // Se guardará como string, se procesará en la action si es necesario
        imagenDesing: ''
    });
    const [usuarios, setUsuarios] = useState([]); // Para un futuro selector de usuarios
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });

    // Aquí podrías cargar usuarios para el selector de usuarioId si fuera necesario
    // useEffect(() => {
    // async function loadUsuarios() {
    // const usersData = await obtenerUsuariosHabilitados(); // Asumiendo que tienes esta action
    // if (usersData && !usersData.error) {
    // setUsuarios(usersData);
    // }
    // }
    // loadUsuarios();
    // }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAlert({ show: false, type: '', message: '' });

        const dataToSave = {
            ...formData,
            valorDesing: parseFloat(formData.valorDesing) || 0,
            // Procesar palabrasClave y elementoIds si es necesario (ej. convertir a array)
            palabrasClave: formData.palabrasClave.split(',').map(kw => kw.trim()).filter(kw => kw),
            elementoIds: formData.elementoIds.split(',').map(id => id.trim()).filter(id => id), // Asumiendo IDs separados por coma
        };

        if (!dataToSave.usuarioId || !dataToSave.nombreDesing || !dataToSave.categoria || !dataToSave.valorDesing || !dataToSave.estadoDesing || !dataToSave.imagenDesing) {
            setAlert({ show: true, type: 'error', message: 'Por favor, completa todos los campos obligatorios.' });
            return;
        }
        
        const result = await guardarDesign(dataToSave);

        if (result.error) {
            setAlert({ show: true, type: 'error', message: `Error al guardar el diseño: ${result.error}` });
        } else {
            setAlert({ show: true, type: 'success', message: 'Diseño guardado exitosamente.' });
            // Opcional: Redirigir después de un tiempo o dejar que el usuario cierre la alerta
            setTimeout(() => {
                router.push('/admin/designs'); // Redirige a la página de listado de diseños
            }, 2000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-4 bg-white shadow-md rounded-lg">
            {alert.show && <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ show: false })} />}
            
            <div>
                <label htmlFor="nombreDesing" className="block text-sm font-medium text-gray-700">Nombre del Diseño</label>
                <input
                    type="text"
                    name="nombreDesing"
                    id="nombreDesing"
                    value={formData.nombreDesing}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor="usuarioId" className="block text-sm font-medium text-gray-700">ID de Usuario (Creador)</label>
                <input
                    type="text"
                    name="usuarioId"
                    id="usuarioId"
                    value={formData.usuarioId}
                    onChange={handleChange}
                    required
                    placeholder="ID del usuario creador"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {/* Futuro: Reemplazar con un selector de usuarios */}
            </div>

            <div>
                <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">Categoría</label>
                <select
                    name="categoria"
                    id="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                    <option value="">Selecciona una categoría</option>
                    {Object.values(CategoriaDesing).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="palabrasClave" className="block text-sm font-medium text-gray-700">Palabras Clave (separadas por coma)</label>
                <input
                    type="text"
                    name="palabrasClave"
                    id="palabrasClave"
                    value={formData.palabrasClave}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor="valorDesing" className="block text-sm font-medium text-gray-700">Valor del Diseño</label>
                <input
                    type="number"
                    name="valorDesing"
                    id="valorDesing"
                    value={formData.valorDesing}
                    onChange={handleChange}
                    required
                    step="0.01"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor="estadoDesing" className="block text-sm font-medium text-gray-700">Estado del Diseño</label>
                <select
                    name="estadoDesing"
                    id="estadoDesing"
                    value={formData.estadoDesing}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                    <option value="">Selecciona un estado</option>
                    {Object.values(EstadoDesing).map(est => (
                        <option key={est} value={est}>{est}</option>
                    ))}
                </select>
            </div>
            
            <div>
                <label htmlFor="elementoIds" className="block text-sm font-medium text-gray-700">IDs de Elementos (separados por coma)</label>
                <input
                    type="text"
                    name="elementoIds"
                    id="elementoIds"
                    value={formData.elementoIds}
                    onChange={handleChange}
                    placeholder="Ej: id1,id2,id3"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor="imagenDesing" className="block text-sm font-medium text-gray-700">URL de la Imagen del Diseño</label>
                <input
                    type="url"
                    name="imagenDesing"
                    id="imagenDesing"
                    value={formData.imagenDesing}
                    onChange={handleChange}
                    required
                    placeholder="https://ejemplo.com/imagen.jpg"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>

            <div className="flex justify-end space-x-4">
                <BotonCancelar type="button" onClick={() => router.push('/admin/designs')}>
                    Cancelar
                </BotonCancelar>
                <BotonGeneral type="submit">
                    Guardar Diseño
                </BotonGeneral>
            </div>
        </form>
    );
}
