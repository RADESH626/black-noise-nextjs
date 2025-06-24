"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Loader from '@/components/Loader';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import { Rol } from '@/models/enums/usuario/Rol';
import { eliminarDesign } from '@/app/acciones/DesignActions';
import BotonGeneral from '@/components/common/botones/BotonGeneral';
import DesignFilters from '@/components/admin/filters/DesignFilters'; // Importar el componente de filtros
import BotonExportarPDF from '@/components/common/botones/BotonExportarPDF'; // Importar BotonExportarPDF

const DesignsClientPage = ({ initialDesigns, initialSearchParams }) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [designs, setDesigns] = useState(initialDesigns);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const page = parseInt(searchParams.get('page')) || 1;
    const limit = 9;

    useEffect(() => {
        if (status === 'loading') return;
        if (!session || session.user.rol !== Rol.ADMINISTRADOR) {
            router.push('/login');
        }
    }, [session, status, router]);

    useEffect(() => {
        setDesigns(initialDesigns);
    }, [initialDesigns]);

    const handleApplyFilters = useCallback((filters) => {
        const params = new URLSearchParams(searchParams);
        Object.keys(filters).forEach(key => {
            if (filters[key]) {
                params.set(key, filters[key]);
            } else {
                params.delete(key);
            }
        });
        params.set('page', 1); // Reset to first page when applying filters
        router.push(`/admin/designs?${params.toString()}`);
        router.refresh(); // Forzar la revalidación de datos del servidor
    }, [router, searchParams]);

    const handleClearFilters = useCallback(() => {
        router.push('/admin/designs');
        router.refresh(); // Forzar la revalidación de datos del servidor
    }, [router]);

    const handleDeleteDesign = async (designId) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este diseño?')) return;
        setLoading(true);
        setError(null);
        try {
            const result = await eliminarDesign(designId);
            if (result.success) {
                setDesigns(prev => prev.filter(design => design._id !== designId));
            } else {
                setError(result.message || 'Error al eliminar el diseño.');
            }
        } catch (err) {
            console.error("Error deleting design:", err);
            setError('Error de red o del servidor al eliminar el diseño.');
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(initialDesigns.length / limit);
    const currentDesigns = initialDesigns.slice((page - 1) * limit, page * limit);

    const createPageURL = (newPage) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage);
        return `/admin/designs?${params.toString()}`;
    };

    const nextPage = () => {
        if (page < totalPages) {
            router.push(createPageURL(page + 1));
        }
    };

    const prevPage = () => {
        if (page > 1) {
            router.push(createPageURL(page - 1));
        }
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
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Gestión de Diseños</h1>

            <div className="mb-4 flex justify-end">
                <BotonExportarPDF
                    data={designs}
                    reportTitle="Reporte de Diseños"
                    tableHeaders={[
                        'ID Diseño', 'Nombre Diseño', 'Descripción', 'Valor Diseño', 'Categoría',
                        'Estado', 'Diseñador', 'Fecha Creación'
                    ]}
                    tableBodyMapper={(design) => [
                        design._id,
                        design.nombreDesing,
                        design.descripcion,
                        `$${typeof design.valorDesing === 'number' ? design.valorDesing.toFixed(2) : '0.00'}`,
                        design.categoria,
                        design.estadoDesing,
                        design.usuarioId ? `${design.usuarioId.Nombre} ${design.usuarioId.primerApellido}` : 'N/A',
                        design.createdAt ? new Date(design.createdAt).toLocaleDateString() : 'N/A',
                    ]}
                    className="py-2 px-4"
                />
            </div>

            <div className="mb-6">
                <DesignFilters onApplyFilters={handleApplyFilters} onClearFilters={handleClearFilters} initialFilters={initialSearchParams} />
            </div>

            {designs.length === 0 ? (
                <p className="text-gray-600">No hay diseños registrados que coincidan con los filtros.</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentDesigns.map((design) => (
                            <div key={design._id} className="bg-white shadow-md rounded-lg overflow-hidden">
                                {design.imagen && (
                                    <Image
                                        src={design.imagen}
                                        alt={design.nombreDesing}
                                        width={300}
                                        height={200}
                                        style={{ objectFit: 'cover' }}
                                        className="w-full h-48"
                                    />
                                )}
                                <div className="p-4">
                                    <h2 className="text-xl font-semibold text-gray-800">{design.nombreDesing}</h2>
                                    <p className="text-gray-600 text-sm mb-2">{design.descripcion}</p>
                                    <p className="text-gray-700 font-bold">Valor: ${design.valorDesing}</p>
                                    <p className="text-gray-500 text-xs">Categoría: {design.categoria}</p>
                                    <p className="text-gray-500 text-xs">Estado: {design.estadoDesing}</p>
                                    <p className="text-gray-500 text-xs">Fecha de Creación: {new Date(design.createdAt).toLocaleDateString()}</p>
                                    <div className="mt-4 flex justify-end space-x-2">
                                        <BotonGeneral
                                            onClick={() => router.push(`/admin/designs/editar/${design._id}`)}
                                            variant="info"
                                            className="py-1 px-3 text-sm"
                                        >
                                            Editar
                                        </BotonGeneral>
                                        <BotonGeneral
                                            onClick={() => handleDeleteDesign(design._id)}
                                            variant="danger"
                                            className="py-1 px-3 text-sm"
                                        >
                                            Eliminar
                                        </BotonGeneral>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Botones de paginación */}
                    <div className="flex justify-center items-center mt-6 space-x-4">
                        <button
                            onClick={prevPage}
                            disabled={page === 1}
                            className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded disabled:opacity-50"
                        >
                            Anterior
                        </button>
                        <span className="text-gray-700 font-medium">
                            Página {page} de {totalPages}
                        </span>
                        <button
                            onClick={nextPage}
                            disabled={page === totalPages}
                            className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded disabled:opacity-50"
                        >
                            Siguiente
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default DesignsClientPage;
