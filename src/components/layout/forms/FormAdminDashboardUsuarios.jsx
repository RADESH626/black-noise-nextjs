import React from 'react'
import InputRol from '../../common/inputs/InputRol'
import InputGenero from '../../common/inputs/InputGenero'
import InputTipoDocumentoIdentidad from '../../common/inputs/InputTipoDocumentoIdentidad'
import InputNumerosGeneral from '../../common/inputs/InputNumerosGeneral'
import InputCheckBox from '../../common/inputs/InputCheckBox'
import InputTextoGeneral from '../../common/inputs/InputTextoGeneral'

function FormAdminDashboardUsuarios() {
    return (
        <form >

            <section className="flex flex-col gap-2  bg-gray-500 rounded-lg justify-center items-top p-4 w-full h-full">

                <header className='flex gap-4'  >
                    <div>

                        <label htmlFor="textoBusqueda">Nombre/Correo:</label>
                        <InputTextoGeneral id="textoBusqueda" name="textoBusqueda"  />

                    </div>

                    <div >

                        <label htmlFor="rol" >Rol:</label>
                        <InputRol id="rol" name="rol" />

                    </div>

                    <div >
                        <label htmlFor="generoFiltro" >Género:</label>
                        <InputGenero id="generoFiltro" />
                    </div>

                    <div >
                        <label htmlFor="tipoDocumentoFiltro">Tipo Documento:</label>
                        <InputTipoDocumentoIdentidad id="tipoDocumentoFiltro" name="tipoDocumentoFiltro" />
                    </div>

                    <div >
                        <label htmlFor="edadFiltro" >Edad:</label>
                        <InputNumerosGeneral id="edadFiltro" name="edadFiltro" />
                    </div>

                </header>

                <footer className='flex gap-4' >

                    <div className='flex gap-2 items-center' >
                        <label htmlFor="incluirDeshabilitados">
                            Mostrar Deshabilitados.
                        </label>

                        <InputCheckBox id="incluirDeshabilitados" name="incluirDeshabilitados" />
                    </div>

                    <button type="submit">Buscar</button>

                </footer>

            </section>



        </form >

    )
}

export default FormAdminDashboardUsuarios