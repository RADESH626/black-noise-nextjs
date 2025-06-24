"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SeccionHeader from '../secciones/acciones/SeccionHeader';
import { obtenerProveedoresHabilitados, habilitarTodosLosProveedores } from '@/app/acciones/ProveedorActions.js';
import FormFiltrarProveedores from './proveedores/FormFiltrarProveedores'; // Keep for now, but will be replaced or integrated
import ListaProveedores from './proveedores/ListaProveedores';
import BotonAgregarProveedores from '@/components/common/botones/BotonAgregarProveedores';
import FormularioAgregarProveedor from '@/components/layout/admin/dashboards/proveedores/FormularioAgregarProveedor';
import Loader from '@/components/Loader';
import BotonExportarPDF from '@/components/common/botones/BotonExportarPDF'; // Importar BotonExportarPDF

function GestionProveedoresDashboard() {
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { openModal, closeModal } = useModal();

    const fetchProveedores = async () => {
        try {
            setLoading(true);
            const initialProveedoresResult = await obtenerProveedoresHabilitados();
            if (initialProveedoresResult && initialProveedoresResult.proveedores && Array.isArray(initialProveedoresResult.proveedores)) {
                setProveedores(initialProveedoresResult.proveedores);
            } else {
                setError(initialProveedoresResult?.error || "No se recibió un array de proveedores.");
                console.error("Error al cargar proveedores en ProveedoresDashboard.jsx:", initialProveedoresResult?.error || "No se recibió un array de proveedores.");
            }
        } catch (err) {
            setError(err.message);
            console.error("Error fetching proveedores:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProveedores();
    }, []);

    const handleOpenAddProveedorModal = () => {
        openModal(
            // "Agregar Nuevo Proveedor",
            <FormularioAgregarProveedor onSuccess={() => {
                closeModal();
                fetchProveedores(); // Refresh the list after successful addition
            }} />,
            // "large" // You can adjust the size as needed: 'small', 'default', 'large', or 'full'
        );
    };

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <p>Error al cargar proveedores: {error}</p>;
    }

    return (
        <>
            <SeccionHeader>
                <div className="flex justify-between items-center w-full">
                    <h4 className='font-bold text-2xl text-black'>Gestión de Proveedores</h4>
                    <div className="flex gap-2">
                        <BotonAgregarProveedores
                            onClick={handleOpenAddProveedorModal}
                            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                        />
                        <BotonExportarPDF
                            data={proveedores}
                            reportTitle="Reporte de Proveedores"
                            tableHeaders={[
                                'ID', 'Nombre Empresa', 'NIT', 'Dirección Empresa', 'Especialidad',
                                'Comisión', 'Teléfono Contacto', 'Email Contacto', 'Métodos Pago Aceptados',
                                'Habilitado', 'Órdenes Activas', 'Fecha Última Asignación', 'Fecha Creación'
                            ]}
                            tableBodyMapper={(proveedor) => [
                                proveedor._id,
                                proveedor.nombreEmpresa,
                                proveedor.nit,
                                proveedor.direccionEmpresa,
                                proveedor.especialidad.join(', '),
                                proveedor.comision,
                                proveedor.telefonoContacto,
                                proveedor.emailContacto,
                                proveedor.metodosPagoAceptados.join(', '),
                                proveedor.habilitado ? 'Sí' : 'No',
                                proveedor.activeOrders || 0,
                                proveedor.lastAssignedAt ? new Date(proveedor.lastAssignedAt).toLocaleDateString() : 'N/A',
                                proveedor.createdAt ? new Date(proveedor.createdAt).toLocaleDateString() : 'N/A',
                            ]}
                            className="py-2 px-4"
                        />
                    </div>
                </div>
            </SeccionHeader>

            {/* <FormFiltrarProveedores initialProveedoresFromPage={proveedores} /> */}
            <ListaProveedores initialProviders={proveedores} />
        </>
    );
}

export default GestionProveedoresDashboard;
