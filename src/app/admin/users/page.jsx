"use client";

import React, { useState, useEffect } from 'react';
import { useFormState } from 'react-dom';
import { actualizarFotoPerfilUsuarioPorAdmin } from '@/app/acciones/AdminActions'; // Import the server action
import Image from 'next/image'; // For displaying images

// Initial state for the form
const initialState = {
    success: false,
    message: '',
    data: null,
};

export default function AdminUserManagementPage() {
    const [state, formAction] = useFormState(actualizarFotoPerfilUsuarioPorAdmin, initialState);
    const [selectedUserId, setSelectedUserId] = useState(''); // State to hold the selected user ID
    const [currentProfilePicture, setCurrentProfilePicture] = useState(null); // State to hold the current profile picture data
    const [file, setFile] = useState(null); // State to hold the selected file

    // Placeholder for fetching user data and setting selectedUserId/currentProfilePicture
    // In a real application, you would fetch a list of users and allow selection.
    // For demonstration, let's assume a user ID for testing.
    useEffect(() => {
        // Example: Set a dummy user ID for testing the update functionality
        // Replace with actual user selection logic later
        setSelectedUserId('60d5ec49f8e9c70015f8e9c7'); // Replace with a valid user ID from your DB for testing
        // You would also fetch the current profile picture for this user here
        // For now, we'll assume no current picture or a default one.
    }, []);

    useEffect(() => {
        if (state.success) {
            alert(state.message);
            // Optionally, update the displayed profile picture if the update was successful
            // This would require fetching the updated user data or handling the image data returned by the action
            setFile(null); // Clear the file input
        } else if (state.message) {
            alert(`Error: ${state.message}`);
        }
    }, [state]);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios - Foto de Perfil</h1>

            {/* Placeholder for User Listing/Search */}
            <div className="mb-6 p-4 border rounded-lg bg-gray-100">
                <h2 className="text-xl font-semibold mb-2">Seleccionar Usuario</h2>
                <p>Aquí iría la lógica para listar o buscar usuarios y seleccionar uno.</p>
                <p>Usuario seleccionado (para prueba): <strong>{selectedUserId || 'Ninguno'}</strong></p>
                {/* In a real app, this would be a dropdown or search input */}
            </div>

            {selectedUserId && (
                <div className="p-6 border rounded-lg shadow-md bg-white">
                    <h2 className="text-xl font-semibold mb-4">Actualizar Foto de Perfil para Usuario: {selectedUserId}</h2>

                    {currentProfilePicture && (
                        <div className="mb-4">
                            <h3 className="text-lg font-medium">Foto de Perfil Actual:</h3>
                            <Image
                                src={`data:${currentProfilePicture.imageMimeType};base64,${Buffer.from(currentProfilePicture.imageData).toString('base64')}`}
                                alt="Current Profile"
                                width={150}
                                height={150}
                                className="rounded-full object-cover"
                            />
                        </div>
                    )}

                    <form action={formAction} className="space-y-4">
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
                            disabled={!file} // Disable button if no file is selected
                        >
                            Actualizar Foto de Perfil
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
