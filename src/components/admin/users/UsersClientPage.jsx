"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useFormState } from 'react-dom';
import { actualizarFotoPerfilUsuarioPorAdmin } from '@/app/acciones/AdminActions';
import Image from 'next/image';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import BotonGeneral from '@/components/common/botones/BotonGeneral';
import { Rol } from '@/models/enums/usuario/Rol';

const initialState = {
    success: false,
    message: '',
    data: null,
};

export default function UsersClientPage({ initialUsers }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [state, formAction] = useFormState(actualizarFotoPerfilUsuarioPorAdmin, initialState);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [currentProfilePicture, setCurrentProfilePicture] = useState(null);
    const [optimisticProfilePicture, setOptimisticProfilePicture] = useState(null);
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const previousProfilePictureRef = useRef(null);
    const [users, setUsers] = useState(initialUsers); // State for users list

    useEffect(() => {
        if (status === 'loading') return;

        if (!session || session.user.rol !== Rol.ADMINISTRADOR) {
            router.push('/login');
            return;
        }
        // No initial fetch here, as it's done by the Server Component
        // You might want to fetch users here if you need to re-fetch after a mutation
        // For now, assuming initialUsers is sufficient.
    }, [session, status, router]);

    useEffect(() => {
        if (state.success) {
            alert(state.message);
            setCurrentProfilePicture(state.data); // Update with the actual new picture from the server
            setOptimisticProfilePicture(null); // Clear optimistic state
            setFile(null);
            // Potentially re-fetch users here if the photo update affects the list display
        } else if (state.message) {
            alert(`Error: ${state.message}`);
            // Rollback: revert to the previous picture if the update failed
            setCurrentProfilePicture(previousProfilePictureRef.current);
            setOptimisticProfilePicture(null); // Clear optimistic state
        }
        setIsLoading(false); // End loading regardless of success or failure
    }, [state]);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            // Store current picture for potential rollback
            previousProfilePictureRef.current = currentProfilePicture;

            // Optimistically update the UI with the new image
            const reader = new FileReader();
            reader.onloadend = () => {
                setOptimisticProfilePicture({
                    imageMimeType: selectedFile.type,
                    imageData: reader.result.split(',')[1], // Get base64 part
                });
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setOptimisticProfilePicture(null);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file || isLoading) return;

        setIsLoading(true);

        const formData = new FormData();
        formData.append('userId', selectedUserId);
        formData.append('profilePicture', file);

        // Call the form action directly with the FormData
        formAction(formData);
    };

    const displayPicture = optimisticProfilePicture || currentProfilePicture;

    // Placeholder for user selection logic
    const handleUserSelect = (e) => {
        const userId = e.target.value;
        setSelectedUserId(userId);
        const user = users.find(u => u._id === userId);
        if (user && user.imageData && user.imageMimeType) {
            setCurrentProfilePicture({
                imageMimeType: user.imageMimeType,
                imageData: user.imageData,
            });
        } else {
            setCurrentProfilePicture(null);
        }
        setOptimisticProfilePicture(null); // Clear optimistic state on user change
        setFile(null); // Clear selected file on user change
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios - Foto de Perfil</h1>

            <div className="mb-6 p-4 border rounded-lg bg-gray-100">
                <h2 className="text-xl font-semibold mb-2">Seleccionar Usuario</h2>
                <select
                    onChange={handleUserSelect}
                    value={selectedUserId}
                    className="block w-full mt-1 p-2 border rounded-md"
                >
                    <option value="">Selecciona un usuario</option>
                    {users.map(user => (
                        <option key={user._id} value={user._id}>
                            {user.Nombre} {user.primerApellido} ({user.correo})
                        </option>
                    ))}
                </select>
                <p className="mt-2">Usuario seleccionado: <strong>{selectedUserId ? users.find(u => u._id === selectedUserId)?.Nombre : 'Ninguno'}</strong></p>
            </div>

            {selectedUserId && (
                <div className="p-6 border rounded-lg shadow-md bg-white">
                    <h2 className="text-xl font-semibold mb-4">Actualizar Foto de Perfil para Usuario: {selectedUserId}</h2>

                    {displayPicture && (
                        <div className="mb-4">
                            <h3 className="text-lg font-medium">Foto de Perfil Actual:</h3>
                            <Image
                                src={`data:${displayPicture.imageMimeType};base64,${Buffer.from(displayPicture.imageData, 'base64').toString('base64')}`}
                                alt="Current Profile"
                                width={150}
                                height={150}
                                className="rounded-full object-cover"
                            />
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="hidden" name="userId" value={selectedUserId} />

                        <div>
                            <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">
                                Subir Nueva Foto de Perfil:
                            </label>
                            <input
                                type="file"
                                id="profilePicture"
                                name="profilePicture"
                                accept="image/jpeg, image/png, image/webp"
                                onChange={handleFileChange}
                                className="mt-1 block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100"
                                required
                            />
                            {file && <p className="mt-2 text-sm text-gray-500">Archivo seleccionado: {file.name}</p>}
                        </div>

                        <BotonGeneral
                            type="submit"
                            variant="primary"
                            disabled={!file || isLoading}
                        >
                            {isLoading ? 'Actualizando...' : 'Actualizar Foto de Perfil'}
                        </BotonGeneral>
                    </form>
                </div>
            )}
        </div>
    );
}
