import FormAgregarUsuarios from '@/components/layout/admin/usuarios/forms/FormAgregarUsuarios'
import React from 'react'


function ModalAgregarUsuario() {
    return (
        <dialog>

            <div className="flex flex-col justify-center items-center w-full h-full bg-white rounded-2xl p-4 gap-4">

                <div className=" rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] overflow-hidden text-white">

                    <div className="flex flex-row justify-center">

                        <div className="p-10 bg-black bg-gradient-to-l from-black to-gray-900">

                            <h2 className="text-3xl font-bold mb-8 text-bn-highlight text-center">Agregar Nuevo usuario</h2>

                            <FormAgregarUsuarios />

                            <button type="button" className="btn btn-info me-auto">
                                <i className='bx bx-upload'></i> Cargar archivo con datos
                            </button>

                        </div>

                    </div>
                    
                </div>

            </div>

        </dialog>

    );
}

export default ModalAgregarUsuario;

