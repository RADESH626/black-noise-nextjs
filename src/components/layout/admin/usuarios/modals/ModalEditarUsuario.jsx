"use client";
import React, { useEffect, useRef } from 'react';
import { useDialog } from '@/context/DialogContext';
import FormEditarUsuario from '@/components/layout/admin/usuarios/forms/FormEditarUsuario'; // Will create this next

function ModalEditarUsuario({ isOpen, onClose, onUserUpdated, userData }) {
    const dialogRef = useRef(null);
    const { showPopUp } = useDialog();

    useEffect(() => {
        if (isOpen) {
            dialogRef.current?.showModal();
        } else {
            dialogRef.current?.close();
        }
    }, [isOpen]);

    const handleSuccess = () => {
        onUserUpdated(); // Notify parent to refresh user list
        onClose(); // Close modal on success
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
                                    Editar Usuario
                                </h2>
                            </div>
                            {userData ? (
                                <FormEditarUsuario initialData={userData} onSuccess={handleSuccess} />
                            ) : (
                                <p className="text-white">Cargando datos del usuario...</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </dialog>
    );
}

export default ModalEditarUsuario;
