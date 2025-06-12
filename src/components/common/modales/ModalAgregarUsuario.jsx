"use client";
import FormAgregarUsuarios from '@/components/layout/admin/usuarios/forms/FormAgregarUsuarios';
import React, { useEffect, useRef } from 'react';
import Boton from '@/components/common/botones/Boton';
import Modal from './Modal';
import { useActionState } from 'react'; // For React 19
import { useFormStatus } from 'react-dom'; // For React 19
import { usePopUp } from '@/context/PopUpContext';
import { bulkUploadUsersAction } from '@/app/acciones/UsuariosActions'; // Import the Server Action

// Submit button component for bulk upload with pending state
function BulkUploadSubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Boton 
            type="submit" 
            disabled={pending}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            {pending ? "Cargando..." : "Carga Masiva"}
        </Boton>
    );
}

// Initial state for useActionState
const initialState = {
    message: null,
    success: false,
};

function ModalAgregarUsuario({ isOpen, onClose, onUserAdded }) {
    const fileInputRef = useRef(null);
    const { showPopUp } = usePopUp();

    const [state, formAction] = useActionState(bulkUploadUsersAction, initialState);

    useEffect(() => {
        if (state.message) {
            showPopUp(state.message, state.success ? "success" : "error");
            if (state.success && onUserAdded) {
                onUserAdded(); // Notify parent to refresh user list
                onClose(); // Close modal on success
            }
        }
    }, [state, showPopUp, onUserAdded, onClose]);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInputRef.current.files = dataTransfer.files;
            // Programmatically submit the form
            const form = fileInputRef.current.closest('form');
            if (form) {
                formAction(new FormData(form));
            }
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title="Agregar Nuevo Usuario" 
            size="large" // Adjust size as needed
        >
            <div className="rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] overflow-hidden">
                <div className="p-8 bg-black bg-gradient-to-l from-black to-gray-900">
                    <div className="flex justify-between items-center sticky top-0 bg-gradient-to-l from-black to-gray-900 py-2 mb-8">
                        <h2 className="text-3xl font-bold text-bn-highlight text-white">
                            Agregar Nuevo Usuario
                        </h2>
                        <div className="flex items-center gap-4">
                            <form action={formAction} className="flex items-center gap-4">
                                <input
                                    type="file"
                                    name="file" // Important for formData.get('file') in Server Action
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept=".csv,.xlsx,.xls"
                                    className="hidden"
                                />
                                <Boton 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
                                    type="button" // Prevent form submission on click
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Carga Masiva
                                </Boton>
                            </form>
                        </div>
                    </div>
                    <FormAgregarUsuarios onSuccess={() => { onUserAdded(); onClose(); }} />
                </div>
            </div>
        </Modal>
    );
}

export default ModalAgregarUsuario;
