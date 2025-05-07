import HeaderAdminDashboard from '@/components/layout/headers/HeaderAdminDashBoard'
import {BotonAgregarUsuarios,BotonEnviarCorreo,BotonExportarPDF} from '@/components/common/botones'


import FormAdminDashboardUsuarios from '@/components/layout/forms/FormAdminDashboardUsuarios'
import connectDB from '@/utils/DBconection'
import Usuario from '@/models/Usuario'
import Thgeneral from '@/components/common/tablas/Thgeneral'
import TdGeneral from '@/components/common/tablas/TdGeneral'
import THeader from '@/components/layout/tablas/AdminDashboard/THeader'

async function obtenerUsuarios() {
    connectDB()
    const usuarios = await Usuario.find()
    return usuarios.map((usuario) => usuario.toObject());
}


async function usuarios() {

    const usuarios = await obtenerUsuarios()

    return (

        <div className='flex flex-col justify-center w-screen  bg-gray-200 '>

            <HeaderAdminDashboard />

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
                            <THeader className="bg-gray-300"/>
                            <tbody>
                                {usuarios.map((usuario) => (
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
                                        <TdGeneral>{usuario.habilitado}</TdGeneral>

                                        <td className=" border border-gray-400 px-4 py-2 justify-center items-center gap-4">
                                            <div className='flex flex-row justify-center items-center gap-4'>
                                            <button className="bg-blue-500 text-white px-2 py-1 rounded">Editar</button>
                                            <button className="bg-red-500 text-white px-2 py-1 rounded ml-2">Eliminar</button>

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

{/* TODO:mostrar la foto del los usuarios */}
{/* TODO:crear un form para los botones de editar y eliminar 
    (este form tendra el id del usuario a eliminar para enviarlo al backend) */}
{/* TODO:hacer funcionar el form de busqueda  */}
{/* TODO:hacer el pop-up para navegabilidad */}



