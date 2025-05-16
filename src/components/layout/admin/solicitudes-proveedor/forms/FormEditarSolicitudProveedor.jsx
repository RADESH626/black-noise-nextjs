"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ObtenerSolicitudProveedorPorId, revisarSolicitudProveedor } from '@/app/acciones/SolicitudProveedorActions';
import { EstadoSolicitud } from '@/models/enums/SolicitudProveedorEnums';
import { Especialidad } from '@/models/enums/proveedor';
import { MetodoPago } from '@/models/enums/pago/MetodoPago';
import { BotonGeneral, BotonCancelar } from '@/components/common/botones';
import { InputCheckBox } from '@/components/common/inputs';
import Alert from '@/components/common/Alert';
// Asumimos que el ID del admin se obtiene de la sesión o un contexto, por ahora lo hardcodeamos o lo pedimos
// import { useSession } from 'next-auth/react'; // Ejemplo si se usa next-auth

export default function FormEditarSolicitudProveedor({ solicitudId }) {
    const router = useRouter();
    // const { data: session } = useSession(); // Para obtener revisorId
    const [revisorIdActual, setRevisorIdActual] = useState("ID_ADMIN_HARDCODEADO"); // Reemplazar con ID de sesión

    const [solicitudData, setSolicitudData] = useState(null);
    const [formData, setFormData] = useState({
        estadoSolicitud: '',
        comentariosAdmin: '',
        // Campos para el nuevo proveedor si se aprueba
        metodosPagoAceptadosProveedor: '', // string separado por comas
        comisionProveedor: '',
        permisosDetallesCreditoProveedor: false,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });

    useEffect(() => {
        async function fetchSolicitud() {
            setIsLoading(true);
            setAlert({ show: false, type: '', message: '' });
            const data = await ObtenerSolicitudProveedorPorId(solicitudId);
            if (data && !data.error) {
                setSolicitudData(data);
                setFormData(prev => ({
                    ...prev,
                    estadoSolicitud: data.estadoSolicitud || EstadoSolicitud.PENDIENTE,
                    comentariosAdmin: data.comentariosAdmin || '',
                    // Si ya fue aprobada y se está re-editando, podríamos cargar estos datos si existen en `datosProveedorSolicitados`
                    // o si se guardaron en el modelo Proveedor y se traen aquí.
                    // Por ahora, se asume que estos campos son para la primera aprobación.
                }));
            } else {
                setAlert({ show: true, type: 'error', message: data.error || 'Error al cargar la solicitud.' });
            }
            setIsLoading(false);
        }
        if (solicitudId) {
            fetchSolicitud();
        }
        // if (session?.user?.id) setRevisorIdActual(session.user.id); // Si se usa next-auth
    }, [solicitudId /*, session*/]);

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

        if (!revisorIdActual) {
            setAlert({ show: true, type: 'error', message: 'No se pudo identificar al revisor. Inicia sesión nuevamente.' });
            setIsLoading(false);
            return;
        }

        const datosProveedorAdicionales = {
            metodosPagoAceptados: formData.metodosPagoAceptadosProveedor.split(',').map(m => m.trim()).filter(m => m),
            comision: parseFloat(formData.comisionProveedor) || 0,
            permisosDetallesCredito: formData.permisosDetallesCreditoProveedor,
        };
        
        const result = await revisarSolicitudProveedor(
            solicitudId, 
            revisorIdActual, 
            formData.estadoSolicitud, 
            formData.comentariosAdmin,
            datosProveedorAdicionales // Solo se usarán si el estado es ACEPTADA
        );

        if (result.error) {
            setAlert({ show: true, type: 'error', message: `Error al revisar la solicitud: ${result.error}` });
        } else {
            setAlert({ show: true, type: 'success', message: 'Solicitud revisada exitosamente.' });
            setTimeout(() => {
                router.push('/admin/solicitudes-proveedor');
            }, 2000);
        }
        setIsLoading(false);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString();
    };

    if (isLoading && !alert.show) {
        return <p className="text-center p-4">Cargando datos de la solicitud...</p>;
    }
    
    if (alert.show && alert.type === 'error' && !solicitudData) {
        return <Alert type={alert.type} message={alert.message} onClose={() => router.push('/admin/solicitudes-proveedor')} />;
    }
    
    if (!solicitudData) {
         return <p className="text-center p-4">No se encontraron datos de la solicitud.</p>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-4 bg-white shadow-md rounded-lg">
            {alert.show && <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ show: false })} />}
            
            <h3 className="text-xl font-semibold text-gray-800">Detalles de la Solicitud</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <p><strong className="font-medium text-gray-700">ID Solicitud:</strong> {solicitudData._id}</p>
                <p><strong className="font-medium text-gray-700">Fecha Solicitud:</strong> {formatDate(solicitudData.fechaSolicitud)}</p>
                <p><strong className="font-medium text-gray-700">Solicitante:</strong> {solicitudData.solicitanteId?.nombreUsuario || 'N/A'} ({solicitudData.solicitanteId?.correo || 'N/A'})</p>
                <p><strong className="font-medium text-gray-700">Teléfono Solicitante:</strong> {solicitudData.solicitanteId?.telefono || 'N/A'}</p>
                <p><strong className="font-medium text-gray-700">Nombre Proveedor Propuesto:</strong> {solicitudData.nombreProveedor}</p>
                <p><strong className="font-medium text-gray-700">NIT:</strong> {solicitudData.nit}</p>
                <p><strong className="font-medium text-gray-700">Dirección Empresa:</strong> {solicitudData.direccionEmpresa}</p>
                <p><strong className="font-medium text-gray-700">RUT:</strong> {solicitudData.rut}</p>
                <p><strong className="font-medium text-gray-700">Especialidad:</strong> {solicitudData.especialidad.replace(/_/g, ' ')}</p>
                {solicitudData.fechaRevision && <p><strong className="font-medium text-gray-700">Fecha Revisión:</strong> {formatDate(solicitudData.fechaRevision)}</p>}
                {solicitudData.revisorId && <p><strong className="font-medium text-gray-700">Revisado por:</strong> {solicitudData.revisorId?.nombreUsuario || 'N/A'}</p>}
            </div>

            <hr className="my-6" />
            <h3 className="text-xl font-semibold text-gray-800">Revisión de la Solicitud</h3>

            <div>
                <label htmlFor="estadoSolicitud" className="block text-sm font-medium text-gray-700">Estado de la Solicitud</label>
                <select name="estadoSolicitud" id="estadoSolicitud" value={formData.estadoSolicitud} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    {Object.values(EstadoSolicitud).map(est => (<option key={est} value={est}>{est.replace(/_/g, ' ')}</option>))}
                </select>
            </div>
            
            <div>
                <label htmlFor="comentariosAdmin" className="block text-sm font-medium text-gray-700">Comentarios del Administrador</label>
                <textarea name="comentariosAdmin" id="comentariosAdmin" value={formData.comentariosAdmin} onChange={handleChange} rows="3" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>

            {formData.estadoSolicitud === EstadoSolicitud.ACEPTADA && (
                <>
                    <hr className="my-6" />
                    <h3 className="text-xl font-semibold text-gray-800">Datos para Nuevo Proveedor (si se aprueba)</h3>
                    <div>
                        <label htmlFor="metodosPagoAceptadosProveedor" className="block text-sm font-medium text-gray-700">Métodos de Pago Aceptados (separados por coma)</label>
                        <input type="text" name="metodosPagoAceptadosProveedor" id="metodosPagoAceptadosProveedor" value={formData.metodosPagoAceptadosProveedor} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        <p className="text-xs text-gray-500 mt-1">Valores posibles: {Object.values(MetodoPago).join(', ')}</p>
                    </div>
                    <div>
                        <label htmlFor="comisionProveedor" className="block text-sm font-medium text-gray-700">Comisión (%) para el Proveedor</label>
                        <input type="number" name="comisionProveedor" id="comisionProveedor" value={formData.comisionProveedor} onChange={handleChange} step="0.01" min="0" max="100" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div className="flex items-center">
                        <InputCheckBox id="permisosDetallesCreditoProveedor" name="permisosDetallesCreditoProveedor" checked={formData.permisosDetallesCreditoProveedor} onChange={handleChange} />
                        <label htmlFor="permisosDetallesCreditoProveedor" className="ml-2 block text-sm text-gray-900">Permitir ver detalles de crédito al proveedor</label>
                    </div>
                </>
            )}


            <div className="flex justify-end space-x-4">
                <BotonCancelar type="button" onClick={() => router.push('/admin/solicitudes-proveedor')}>Cancelar</BotonCancelar>
                <BotonGeneral type="submit" disabled={isLoading || formData.estadoSolicitud === solicitudData?.estadoSolicitud && formData.comentariosAdmin === solicitudData?.comentariosAdmin}>
                    {isLoading ? 'Guardando...' : 'Guardar Revisión'}
                </BotonGeneral>
            </div>
        </form>
    );
}
