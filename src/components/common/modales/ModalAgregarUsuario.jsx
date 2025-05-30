import FormAgregarUsuarios from '@/components/admin/usuarios/forms/FormAgregarUsuarios'
import React, { useEffect, useRef } from 'react'
import BotonGeneral from '@/components/common/botones/BotonGeneral'

function ModalAgregarUsuario({ isOpen, onClose }) {
    const dialogRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            dialogRef.current?.showModal();
        } else {
            dialogRef.current?.close();
        }
    }, [isOpen]);

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const formData = new FormData();
            formData.append('file', file);
            
            // TODO: Implement bulk user upload API call
            const response = await fetch('/api/usuarios/bulk-upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Error al cargar usuarios');
            }

            onClose();
        } catch (error) {
            console.error('Error uploading users:', error);
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
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                        accept=".csv,.xlsx,.xls"
                                        className="hidden"
                                    />
                                    <BotonGeneral 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Carga Masiva
                                    </BotonGeneral>
                                </div>
                            </div>
                            <FormAgregarUsuarios onSuccess={onClose} />
                        </div>
                    </div>
                </div>
            </div>
        </dialog>
    );
}

export default ModalAgregarUsuario;
