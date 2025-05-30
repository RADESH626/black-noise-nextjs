"use client";

import React, { useState, useEffect } from 'react';
import { obtenerSolicitudesProveedor, procesarSolicitudProveedor } from '@/app/acciones/SolicitudProveedorActions';
import { EstadoSolicitudProveedor } from '@/models/enums/SolicitudProveedorEnums';
import BotonGeneral from '@/components/common/botones/BotonGeneral';
import InputGeneral from '@/components/common/inputs/InputGeneral';
import { useModal } from '@/context/ModalContext'; // Asumo que tienes un ModalContext

function FormFiltrarSolicitudesProveedor({ initialSolicitudesFromPage }) {
    const [solicitudes, setSolicitudes] = useState(initialSolicitudesFromPage);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('PENDIENTE'); // Filtro por defecto
    const { openModal, closeModal } = useModal(); // Para el modal de confirmación/notas

    useEffect(() => {
        setSolicitudes(initialSolicitudesFromPage);
    }, [initialSolicitudesFromPage]);

    const fetchSolicitudes = async () => {
        setLoading(true);
        setError(null);
        const result = await obtenerSolicitudesProveedor();
        if (result.solicitudes) {
            setSolicitudes(result.solicitudes);
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    const handleProcessSolicitud = async (solicitudId, action, adminNotas = '') => {
        setLoading(true);
        setError(null);
        const result = await procesarSolicitudProveedor(solicitudId, action, adminNotas);
        if (result.success) {
            await fetchSolicitudes(); // Refrescar la lista
            closeModal(); // Cerrar el modal si se usó
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    const openProcessModal = (solicitudId, action) => {
        let title = action === 'aprobar' ? 'Aprobar Solicitud' : 'Rechazar Solicitud';
        let buttonText = action === 'aprobar' ? 'Aprobar' : 'Rechazar';
        let inputLabel = 'Notas del Administrador (Opcional)';
        let adminNotes = '';

        openModal(
            title,
            <div className="p-4 bg-neutral-800 text-secondary">
                <p className="mb-4">¿Estás seguro de que quieres {action} esta solicitud?</p>
                <InputGeneral
                    label={inputLabel}
                    type="textarea"
                    value={adminNotes}
                    onChange={(e) => adminNotes = e.target.value} // Actualiza la variable local
                    placeholder="Escribe tus notas aquí..."
                />
                <div className="flex justify-end space-x-4 mt-6">
                    <BotonGeneral onClick={() => closeModal()} className="bg-gray-600 hover:bg-gray-700">
                        Cancelar
                    </BotonGeneral>
                    <BotonGeneral onClick={() => handleProcessSolicitud(solicitudId, action, adminNotes)} disabled={loading}>
                        {loading ? 'Procesando...' : buttonText}
                    </BotonGeneral>
                </div>
            </div>,
            'small'
        );
    };

    const filteredSolicitudes = solicitudes.filter(sol => {
        if (filterStatus === 'TODOS') return true;
        return sol.estadoSolicitud === filterStatus;
    });

    return (
        <div className="p-6 bg-neutral-800 text-secondary rounded-lg shadow-lg border border-accent1">
            <div className="mb-6 flex justify-between items-center">
                <h3 className="text-xl font-semibold">Solicitudes de Proveedor</h3>
                <div className="flex space-x-2">
                    <label htmlFor="filterStatus" className="sr-only">Filtrar por estado</label>
                    <select
                        id="filterStatus"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="p-2 bg-neutral-700 border border-neutral-600 rounded-md text-secondary focus:ring-accent1 focus:border-accent1"
                    >
                        {Object.values(EstadoSolicitudProveedor).map(status => (
                            <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
                        ))}
                        <option value="TODOS">TODOS</option>
                    </select>
                    <BotonGeneral onClick={fetchSolicitudes} disabled={loading}>
                        {loading ? 'Cargando...' : 'Actualizar'}
                    </BotonGeneral>
                </div>
            </div>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            {filteredSolicitudes.length === 0 && !loading ? (
                <p className="text-center text-neutral-400">No hay solicitudes {filterStatus === 'TODOS' ? '' : filterStatus.toLowerCase().replace(/_/g, ' ')}.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full rounded-lg overflow-hidden">
                        <thead className="bg-neutral-600">
                            <tr>
                                <th className="py-3 px-4 text-left text-sm font-medium text-neutral-300">Empresa</th>
                                <th className="py-3 px-4 text-left text-sm font-medium text-neutral-300">NIT</th>
                                <th className="py-3 px-4 text-left text-sm font-medium text-neutral-300">Especialidad</th>
                                <th className="py-3 px-4 text-left text-sm font-medium text-neutral-300">Comisión (%)</th>
                                <th className="py-3 px-4 text-left text-sm font-medium text-neutral-300">Estado</th>
                                <th className="py-3 px-4 text-left text-sm font-medium text-neutral-300">Solicitante</th>
                                <th className="py-3 px-4 text-left text-sm font-medium text-neutral-300">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSolicitudes.map((solicitud) => (
                                <tr key={solicitud._id} className="border-b border-neutral-600 last:border-b-0">
                                    <td className="py-3 px-4 text-sm text-neutral-300">{solicitud.nombreEmpresa}</td>
                                    <td className="py-3 px-4 text-sm text-neutral-300">{solicitud.nit}</td>
                                    <td className="py-3 px-4 text-sm text-neutral-300">{solicitud.especialidad}</td>
                                    <td className="py-3 px-4 text-sm text-neutral-300">{solicitud.comisionPropuesta}%</td>
                                    <td className="py-3 px-4 text-sm text-neutral-300">
                                        <span className={`
                                            px-2 py-1 rounded-full text-xs font-semibold
                                            ${solicitud.estadoSolicitud === EstadoSolicitudProveedor.PENDIENTE ? 'bg-yellow-500 text-yellow-900' : ''}
                                            ${solicitud.estadoSolicitud === EstadoSolicitudProveedor.APROBADA ? 'bg-green-500 text-green-900' : ''}
                                            ${solicitud.estadoSolicitud === EstadoSolicitudProveedor.RECHAZADA ? 'bg-red-500 text-red-900' : ''}
                                        `}>
                                            {solicitud.estadoSolicitud.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-neutral-300">
                                        {solicitud.usuarioId ? `${solicitud.usuarioId.primerNombre} ${solicitud.usuarioId.primerApellido} (${solicitud.usuarioId.correo})` : 'N/A'}
                                    </td>
                                    <td className="py-3 px-4 text-sm">
                                        {solicitud.estadoSolicitud === EstadoSolicitudProveedor.PENDIENTE && (
                                            <div className="flex space-x-2">
                                                <BotonGeneral onClick={() => openProcessModal(solicitud._id, 'aprobar')} className="bg-green-500 hover:bg-green-600">
                                                    Aprobar
                                                </BotonGeneral>
                                                <BotonGeneral onClick={() => openProcessModal(solicitud._id, 'rechazar')} className="bg-red-500 hover:bg-red-600">
                                                    Rechazar
                                                </BotonGeneral>
                                            </div>
                                        )}
                                        {solicitud.estadoSolicitud !== EstadoSolicitudProveedor.PENDIENTE && (
                                            <span className="text-neutral-500">Procesada</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default FormFiltrarSolicitudesProveedor;
