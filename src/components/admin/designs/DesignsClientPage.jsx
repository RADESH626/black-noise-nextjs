"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Loader from '@/components/Loader';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import { Rol } from '@/models/enums/usuario/Rol';
import { eliminarDesign } from '@/app/acciones/DesignActions';
import BotonGeneral from '@/components/common/botones/BotonGeneral';

const DesignsClientPage = ({ initialDesigns }) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [designs, setDesigns] = useState(initialDesigns);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const designsPerPage = 9;

    useEffect(() => {
        if (status === 'loading') return;
        if (!session || session.user.rol !== Rol.ADMINISTRADOR) {
            router.push('/login');
        }
    }, [session, status, router]);

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

    // Cálculo de índices de la página actual
    const indexOfLastDesign = currentPage * designsPerPage;
    const indexOfFirstDesign = indexOfLastDesign - designsPerPage;
    const currentDesigns = designs.slice(indexOfFirstDesign, indexOfLastDesign);
    const totalPages = Math.ceil(designs.length / designsPerPage);

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
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
            <div className="mb-4">
                <BotonGeneral
                    onClick={() => router.push('/admin/designs/agregar')}
                    variant="primary"
                >
                    Agregar Nuevo Diseño
                </BotonGeneral>
            </div>

            {designs.length === 0 ? (
                <p className="text-gray-600">No hay diseños registrados.</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentDesigns.map((design) => (
                            <div key={design._id} className="bg-white shadow-md rounded-lg overflow-hidden">
                                {design.imageBase64 && (
                                    <Image
                                        src={design.imageBase64}
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
                            disabled={currentPage === 1}
                            className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded disabled:opacity-50"
                        >
                            Anterior
                        </button>
                        <span className="text-gray-700 font-medium">
                            Página {currentPage} de {totalPages}
                        </span>
                        <button
                            onClick={nextPage}
                            disabled={currentPage === totalPages}
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
