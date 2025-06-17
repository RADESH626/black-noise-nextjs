"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import { Rol } from '@/models/enums/usuario/Rol';
import { eliminarDesign } from '@/app/acciones/DesignActions'; // Import delete action

const DesignsClientPage = ({ initialDesigns }) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [designs, setDesigns] = useState(initialDesigns);
    const [loading, setLoading] = useState(false); // Initial loading handled by Server Component
    const [error, setError] = useState(null);

    useEffect(() => {
        if (status === 'loading') return;

        if (!session || session.user.rol !== Rol.ADMINISTRADOR) {
            router.push('/login');
            return;
        }
        // No initial fetch here, as it's done by the Server Component
    }, [session, status, router]);

    const handleDeleteDesign = async (designId) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este diseño?')) {
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const result = await eliminarDesign(designId);
            if (result.success) {
                setDesigns(prevDesigns => prevDesigns.filter(design => design._id !== designId));
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
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Gestión de Diseños</h1>
            <div className="mb-4">
                {/* Add button for adding new designs if needed, or link to existing add page */}
                <button
                    onClick={() => router.push('/admin/designs/agregar')} // Assuming an add design page exists or will be created
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                    Agregar Nuevo Diseño
                </button>
            </div>
            {designs.length === 0 ? (
                <p className="text-gray-600">No hay diseños registrados.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {designs.map((design) => (
                        <div key={design._id} className="bg-white shadow-md rounded-lg overflow-hidden">
                            {design.imageData instanceof Buffer && design.imageMimeType && (
                                <Image
                                    src={`data:${design.imageMimeType};base64,${design.imageData.toString('base64')}`}
                                    alt={design.nombreDesing}
                                    width={300}
                                    height={200}
                                    layout="responsive"
                                    objectFit="cover"
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
                                    <button
                                        onClick={() => router.push(`/admin/designs/editar/${design._id}`)}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDeleteDesign(design._id)}
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DesignsClientPage;
