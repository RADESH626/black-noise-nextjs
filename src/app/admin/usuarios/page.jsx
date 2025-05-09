import HeaderAdminDashboard from '@/components/layout/headers/HeaderAdminDashBoard'
import { BotonAgregarUsuarios, BotonEnviarCorreo, BotonExportarPDF } from '@/components/common/botones'
import FormAdminDashboardUsuarios from '@/components/layout/forms/FormAdminDashboardUsuarios'
import TdGeneral from '@/components/common/tablas/TdGeneral'
import THeader from '@/components/layout/tablas/AdminDashboard/THeader'
import FormEditarEliminarUsuario from '@/components/layout/forms/FormEditarEliminarUsuario'
import { IconoPersona } from '@/components/common/iconos'
import {obtenerUsuarios} from '@/app/acciones/UsuariosActions'


async function usuarios() {

    const data = await obtenerUsuarios();

    if(data.error){ 
        alert(data.error)
    }

    const usuarios = data || [];

    return (

        <div className='flex flex-col justify-center w-screen  bg-gray-200 '>
            
            <HeaderAdminDashboard >
                hola
                <IconoPersona className="text-white" />

            </HeaderAdminDashboard>

            <div className="flex flex-col items-center justify-center  h-full   p-4 ">

                <h1 className='font-bold text-3xl text-black' >Bienvenido Administrador</h1>


                <section className="flex flex-col items-center justify-center w-full h-full bg-white rounded-2xl  ">

                    <header className='bg-gray-300 w-full flex flex-col justify-center items-center p-4 gap-4 rounded-t-2xl ' >

                        <h4 className='font-bold text-2xl text-black' >Buscar Usuarios</h4>

                        <FormAdminDashboardUsuarios className="w-full" />

                    </header>

                    <footer className="flex flex-row  justify-r w-full h-full bg-gray-600  p-4 gap-4">

                        <BotonAgregarUsuarios />
                        <BotonExportarPDF />
                        <BotonEnviarCorreo />

                    </footer>

                </section>

                <section className="flex flex-col items-center justify-center w-full h-full bg-white rounded-2xl">
                    <div className="overflow-auto max-h-[400px] w-full">
                        <table className="table-auto text-left w-full border-gray-400">
                            <THeader className="bg-gray-300" />
                            <tbody>
                                {usuarios.data.map((usuario) => (
                                    <tr key={usuario._id}>
                                        <TdGeneral>{usuario.nombreUsuario}</TdGeneral>
                                        <TdGeneral>{usuario.primerNombre}</TdGeneral>
                                        <TdGeneral>{usuario.primerApellido}</TdGeneral>
                                        <TdGeneral>{usuario.segundoApellido}</TdGeneral>
                                        <TdGeneral>{usuario.tipoDocumento}</TdGeneral>
                                        <TdGeneral>{usuario.numeroDocumento}</TdGeneral>
                                        <TdGeneral>{usuario.genero}</TdGeneral>
                                        <TdGeneral>{new Date(usuario.fechaNacimiento).toLocaleDateString()}</TdGeneral>
                                        <TdGeneral>{usuario.numeroTelefono}</TdGeneral>
                                        <TdGeneral>{usuario.direccion}</TdGeneral>
                                        <TdGeneral>{usuario.correo}</TdGeneral>
                                        <TdGeneral>{usuario.rol}</TdGeneral>
                                        <TdGeneral>{new Date(usuario.createdAt).toLocaleDateString()}</TdGeneral>
                                        <TdGeneral>{usuario.foto}</TdGeneral>
                                        <TdGeneral>{usuario.habilitado}</TdGeneral>

                                        <td className=" border border-gray-400 px-4 py-2 justify-center items-center gap-4">
                                            <div className='flex flex-row justify-center items-center gap-4'>
                                                <FormEditarEliminarUsuario >
                                                    <input type="hidden" name="usuarioId" value={usuario._id} />
                                                </FormEditarEliminarUsuario>
                                            </div>

                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

            </div >
        </div >
    )
}

export default usuarios





{/* TODO:navbar
    hacer el pop-up para navegabilidad 
*/}

{/* TODO:form busqueda
    agregar funcionalidad para el form de busqueda
*/}

{/* TODO:form botones agregar,exportar, enviar correo
    agregar modal para agregar usuario
    agregar funcionalidad para exportar a pdf
    agregar funcionalidad para enviar correo
*/}

{/* TODO:lista de usuarios
    agregar nombre del usuario
    agregar foto de los usuarios
    arreglar boton de editar

*/}