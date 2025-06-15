"use client";
import FormAgregarUsuarios from '@/components/layout/admin/usuarios/forms/FormAgregarUsuarios';
import React, { useEffect, useRef } from 'react';
import BotonGeneral from '@/components/common/botones/BotonGeneral';
import { useActionState } from 'react'; // For React 19
import { useFormStatus } from 'react-dom'; // For React 19
import { usePopUp } from '@/context/PopUpContext';
import { bulkUploadUsersAction } from '@/app/acciones/UsuariosActions'; // Import the Server Action

// Submit button component for bulk upload with pending state
function BulkUploadSubmitButton() {
    const { pending } = useFormStatus();
    return (
        <BotonGeneral 
            type="submit" 
            disabled={pending}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            {pending ? "Cargando..." : "Carga Masiva"}
        </BotonGeneral>
    );
}

// Initial state for useActionState
const initialState = {
    message: null,
    success: false,
};

function ModalAgregarUsuario({ isOpen, onClose, onUserAdded }) {
    const dialogRef = useRef(null);
    const fileInputRef = useRef(null);
    const { showPopUp } = usePopUp();

    const [state, formAction] = useActionState(bulkUploadUsersAction, initialState);

    useEffect(() => {
        if (isOpen) {
            dialogRef.current?.showModal();
        } else {
            dialogRef.current?.close();
        }
    }, [isOpen]);

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
        <dialog 
            ref={dialogRef}
            className="modal"
            onClick={(e) => {
                const dialogDimensions = e.currentTarget.getBoundingClientRect();
                if (
                    e.clientX < dialogDimensions.left ||
                    e.clientX > dialogDimensions.right ||
                    e.clientY < dialogDimensions.top ||
                    e.clientY > dialogDimensions.bottom
                ) {
                    onClose();
                }
            }}
        >
            <div 
                className="min-w-[800px] max-h-[85vh] flex flex-col bg-white rounded-2xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="relative w-full p-6 overflow-y-auto">
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

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
                                        <BotonGeneral 
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
                                            type="button" // Prevent form submission on click
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Carga Masiva
                                        </BotonGeneral>
                                    </form>
                                </div>
                            </div>
                            <FormAgregarUsuarios onSuccess={() => { onUserAdded(); onClose(); }} />
                        </div>
                    </div>
                </div>
            </div>
        </dialog>
    );
}

export default ModalAgregarUsuario;
