"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SeccionHeader from '../secciones/acciones/SeccionHeader';
import { obtenerProveedoresHabilitados, habilitarTodosLosProveedores } from '@/app/acciones/ProveedorActions.js';
import FormFiltrarProveedores from './proveedores/FormFiltrarProveedores'; // Keep for now, but will be replaced or integrated
import ListaProveedores from './proveedores/ListaProveedores';
import BotonAgregarProveedores from '@/components/common/botones/BotonAgregarProveedores';
import FormularioAgregarProveedor from '@/components/layout/admin/dashboards/proveedores/FormularioAgregarProveedor';

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
            "Agregar Nuevo Proveedor",
            <FormularioAgregarProveedor onSuccess={() => {
                closeModal();
                fetchProveedores(); // Refresh the list after successful addition
            }} />,
            "large" // You can adjust the size as needed: 'small', 'default', 'large', or 'full'
        );
    };

    if (loading) {
        return <p>Cargando proveedores...</p>;
    }

    if (error) {
        return <p>Error al cargar proveedores: {error}</p>;
    }

    return (
        <>
            <SeccionHeader>
                <h4 className='font-bold text-2xl text-black'>Gestión de Proveedores</h4>
                <BotonAgregarProveedores
                    onClick={handleOpenAddProveedorModal}
                    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                />
            </SeccionHeader>

            {/* <FormFiltrarProveedores initialProveedoresFromPage={proveedores} /> */}
            <ListaProveedores initialProviders={proveedores} />
        </>
    );
}

export default GestionProveedoresDashboard;
