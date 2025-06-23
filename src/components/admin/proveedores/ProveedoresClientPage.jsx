"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Tabla from '@/components/common/tablas/Tabla';
import TablaHeader from '@/components/common/tablas/TablaHeader';
import TdGeneral from '@/components/common/tablas/TdGeneral';
import Thgeneral from '@/components/common/tablas/Thgeneral';
import Loader from '@/components/Loader';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import { Rol } from '@/models/enums/usuario/Rol';
import { obtenerProveedores } from '@/app/acciones/ProveedorActions';
import { useDialog } from '@/context/DialogContext';
import AddSupplierModal from '@/components/admin/proveedores/AddSupplierModal';
import BotonGeneral from '@/components/common/botones/BotonGeneral';
import ProveedorFilters from '@/components/admin/filters/ProveedorFilters'; // Importar el componente de filtros

const ProveedoresClientPage = ({ initialProveedores, initialSearchParams }) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const clientSearchParams = useSearchParams(); // Usar un nombre diferente para evitar confusión
    const { openModal, closeModal } = useDialog();
    const [proveedores, setProveedores] = useState(initialProveedores);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Usar initialSearchParams para la primera renderización, luego clientSearchParams
    const currentSearchParams = initialSearchParams || clientSearchParams;

    const memoizedCurrentFilters = useMemo(() => {
        const params = new URLSearchParams(currentSearchParams);
        return {
            disponibilidad: params.get('disponibilidad') || '',
            especialidad: params.get('especialidad') || '', // Ahora es un solo valor
            metodosPagoAceptados: params.get('metodosPagoAceptados') || '', // Ahora es un solo valor
            habilitado: params.get('habilitado') === 'true' ? true : (params.get('habilitado') === 'false' ? false : undefined),
            ordenesActivasMin: params.get('ordenesActivasMin') || '',
            ordenesActivasMax: params.get('ordenesActivasMax') || '',
            fechaUltimaAsignacionStart: params.get('fechaUltimaAsignacionStart') || '',
            fechaUltimaAsignacionEnd: params.get('fechaUltimaAsignacionEnd') || '',
        };
    }, [currentSearchParams]);

    useEffect(() => {
        if (status === 'loading') return;
        if (!session || session.user.rol !== Rol.ADMINISTRADOR) {
            router.push('/login');
            return;
        }
    }, [session, status, router]);

    useEffect(() => {
        setProveedores(initialProveedores);
    }, [initialProveedores]);

    const handleApplyFilters = useCallback((filters) => {
        const params = new URLSearchParams(); // Crear un nuevo URLSearchParams
        Object.keys(filters).forEach(key => {
            if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '' && filters[key] !== 'Todos') {
                params.set(key, filters[key]);
            } else {
                params.delete(key);
            }
        });
        router.push(`/admin/proveedores?${params.toString()}`);
    }, [router]);

    const handleClearFilters = useCallback(() => {
        router.push('/admin/proveedores');
        // router.refresh(); // Eliminar esta línea
    }, [router]);

    const fetchProveedores = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await obtenerProveedores(memoizedCurrentFilters); // Usar memoizedCurrentFilters
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
            <AddSupplierModal onSuccess={handleSupplierAdded} onModalClose={closeModal} />
        );
    };

    const handleSupplierAdded = () => {
        fetchProveedores();
        closeModal();
    };

    if (loading) {
        return <Loader />;
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
                <BotonGeneral
                    onClick={handleOpenModal}
                    variant="primary"
                >
                    Agregar Proveedor
                </BotonGeneral>
            </div>

            <div className="mb-6">
                <ProveedorFilters onApplyFilters={handleApplyFilters} onClearFilters={handleClearFilters} initialFilters={memoizedCurrentFilters} />
            </div>

            {proveedores.length === 0 ? (
                <p className="text-gray-600">No hay proveedores registrados que coincidan con los filtros.</p>
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
                                        <BotonGeneral variant="info" className="mr-2" onClick={() => { /* TODO: Implement edit modal for provider */ }}>
                                            Editar
                                        </BotonGeneral>
                                        <BotonGeneral variant="danger" onClick={() => { /* TODO: Implement delete action for provider */ }}>
                                            Eliminar
                                        </BotonGeneral>
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
