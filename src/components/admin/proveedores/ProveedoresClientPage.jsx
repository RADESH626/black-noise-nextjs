"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Tabla from '@/components/common/tablas/Tabla';
import TablaHeader from '@/components/common/tablas/TablaHeader';
import TdGeneral from '@/components/common/tablas/TdGeneral';
import Thgeneral from '@/components/common/tablas/Thgeneral';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import { Rol } from '@/models/enums/usuario/Rol';
import { obtenerProveedores } from '@/app/acciones/ProveedorActions'; // Import the new action
import { useDialog } from '@/context/DialogContext'; // Import useDialog
import AddSupplierModal from '@/components/admin/proveedores/AddSupplierModal'; // Import AddSupplierModal

const ProveedoresClientPage = ({ initialProveedores }) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { openModal, closeModal } = useDialog(); // Use dialog context
    const [proveedores, setProveedores] = useState(initialProveedores);
    const [loading, setLoading] = useState(false); // Initial loading handled by Server Component
    const [error, setError] = useState(null);

    useEffect(() => {
        // This useEffect is primarily for session management and re-fetching after mutations
        if (status === 'loading') return;

        if (!session || session.user.rol !== Rol.ADMINISTRADOR) {
            router.push('/login');
            return;
        }
        // No initial fetch here, as it's done by the Server Component
    }, [session, status, router]);

    const fetchProveedores = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await obtenerProveedores(); // Call the server action
            if (result.success) {
                setProveedores(result.proveedores);
            } else {
                setError(result.message || 'Error al cargar la lista de proveedores.');
            }
        } catch (err) {
            console.error("Error fetching suppliers:", err);
            setError('Error al cargar la lista de proveedores. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = () => {
        openModal(
            // "Agregar Nuevo Proveedor",
            <AddSupplierModal onSuccess={handleSupplierAdded} onModalClose={closeModal} />
        );
    };

    const handleSupplierAdded = () => {
        fetchProveedores(); // Re-fetch suppliers after a new one is added
        closeModal(); // Close the modal after successful addition
    };

    // If initialProveedores is empty and not loading, display no data message
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <ErrorMessage message={error} />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Gestión de Proveedores</h1>
            <div className="mb-4">
                <button
                    onClick={handleOpenModal}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Agregar Proveedor
                </button>
            </div>
            {proveedores.length === 0 ? (
                <p className="text-gray-600">No hay proveedores registrados.</p>
            ) : (
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <Tabla>
                        <thead>
                            <tr>
                                <Thgeneral>Nombre de la Empresa</Thgeneral>
                                <Thgeneral>Correo de Contacto</Thgeneral>
                                <Thgeneral>Teléfono</Thgeneral>
                                <Thgeneral>Dirección</Thgeneral>
                                <Thgeneral>Estado</Thgeneral>
                                <Thgeneral>Acciones</Thgeneral>
                            </tr>
                        </thead>
                        <tbody>
                            {proveedores.map((proveedor) => (
                                <tr key={proveedor._id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <TdGeneral>{proveedor.nombreEmpresa}</TdGeneral>
                                    <TdGeneral>{proveedor.emailContacto}</TdGeneral>
                                    <TdGeneral>{proveedor.telefonoContacto || 'N/A'}</TdGeneral>
                                    <TdGeneral>{proveedor.direccionEmpresa || 'N/A'}</TdGeneral>
                                    <TdGeneral>{proveedor.habilitado ? 'Habilitado' : 'Deshabilitado'}</TdGeneral>
                                    <TdGeneral>
                                        {/* Add action buttons here, e.g., Edit, Delete */}
                                        <button className="text-blue-600 hover:underline mr-2">Editar</button>
                                        <button className="text-red-600 hover:underline">Eliminar</button>
                                    </TdGeneral>
                                </tr>
                            ))}
                        </tbody>
                    </Tabla>
                </div>
            )}
        </div>
    );
};

export default ProveedoresClientPage;
