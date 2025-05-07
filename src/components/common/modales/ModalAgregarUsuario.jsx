import FormAgregarUsuarios from '@/components/layout/forms/FormAgregarUsuarios'
import React from 'react'

function ModalAgregarUsuario() {
    return (
        <div className="modal fade" id="agregarUsuarioModal" tabindex="-1" aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Agregar Nuevo usuario</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <FormAgregarUsuarios />
                    </div>

                    <div className="modal-footer">
                        
                        <button type="button" className="btn btn-info me-auto" data-bs-toggle="modal"
                            data-bs-target="#cargarMasivoModal" data-bs-dismiss="modal">
                            <i className='bx bx-upload'></i> Cargar archivo con datos
                        </button>

                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="submit" className="btn btn-primary" form="formAgregarUsuario">Agregar Usuario</button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ModalAgregarUsuario