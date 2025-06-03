import React from 'react'

function ModalOpcionesAdmin() {
    return (
        <div>
            
            <button type="button" className="btn" >
                <img className="hover:scale-140 transition-transform duration-300" src="/icons/icono-persona.svg" alt="icono usuario" /> Mi Perfil
            </button>

            <form action="/auth/logout" method="post">
                <button type="submit" className="btn">Cerrar Sesión</button>
            </form>


            <button type="button" className="btn" >
                Menú de Vistas
            </button>

        </div>
    )
}

export default ModalOpcionesAdmin
