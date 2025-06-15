"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useFormState } from 'react-dom';
import { actualizarFotoPerfilUsuarioPorAdmin } from '@/app/acciones/AdminActions';
import Image from 'next/image';

const initialState = {
    success: false,
    message: '',
    data: null,
};

export default function AdminUserManagementPage() {
    const [state, formAction] = useFormState(actualizarFotoPerfilUsuarioPorAdmin, initialState);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [currentProfilePicture, setCurrentProfilePicture] = useState(null);
    const [optimisticProfilePicture, setOptimisticProfilePicture] = useState(null);
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const previousProfilePictureRef = useRef(null);

    useEffect(() => {
        setSelectedUserId('60d5ec49f8e9c70015f8e9c7'); // Replace with a valid user ID from your DB for testing
        // In a real app, fetch the actual current profile picture here
        // For demonstration, let's set a dummy initial picture if needed
        // setCurrentProfilePicture({ imageMimeType: 'image/jpeg', imageData: '...' });
    }, []);

    useEffect(() => {
        if (state.success) {
            alert(state.message);
            setCurrentProfilePicture(state.data); // Update with the actual new picture from the server
            setOptimisticProfilePicture(null); // Clear optimistic state
            setFile(null);
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

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios - Foto de Perfil</h1>

            <div className="mb-6 p-4 border rounded-lg bg-gray-100">
                <h2 className="text-xl font-semibold mb-2">Seleccionar Usuario</h2>
                <p>Aquí iría la lógica para listar o buscar usuarios y seleccionar uno.</p>
                <p>Usuario seleccionado (para prueba): <strong>{selectedUserId || 'Ninguno'}</strong></p>
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

                        <button
                            type="submit"
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            disabled={!file || isLoading}
                        >
                            {isLoading ? 'Actualizando...' : 'Actualizar Foto de Perfil'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
