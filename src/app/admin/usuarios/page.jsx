import { BotonAgregarUsuarios, BotonEnviarCorreo, BotonExportarPDF } from '@/components/common/botones'
import FormBuscarUsuarios from '@/components/layout/admin/usuarios/forms/FormBuscarUsuarios'
import TdGeneral from '@/components/common/tablas/TdGeneral'
import THUsuarios from '@/components/layout/admin/usuarios/THUsuarios'
import { obtenerUsuarios } from '@/app/acciones/UsuariosActions'
import Link from 'next/link'
import AdminPage from '@/components/layout/admin/AdminPage'
import SeccionAcciones from '@/components/layout/admin/secciones/acciones/SeccionAcciones'
import SeccionFooter from '@/components/layout/admin/secciones/acciones/SeccionFooter'
import SeccionHeader from '@/components/layout/admin/secciones/acciones/SeccionHeader'
import FormEditarEliminarUsuario from '@/components/layout/admin/usuarios/forms/FormEditarEliminarUsuario'
import SeccionLista from '@/components/layout/admin/secciones/lista/SeccionLista'


async function usuarios() {

    const data = await obtenerUsuarios();

    if (data.error) {
        alert(data.error)
    }

    const usuarios = data || [];

    return (
        <AdminPage>

            <SeccionAcciones>

                <SeccionHeader>

                    <h4 className='font-bold text-2xl text-black' >Buscar Usuarios</h4>

                    <FormBuscarUsuarios className="w-full" />

                </SeccionHeader>

                <SeccionFooter>

                    <Link href="/admin/usuarios/agregar" className="flex flex-row justify-center items-center gap-4">
                        <BotonAgregarUsuarios />
                    </Link>

                    <Link href="/admin/usuarios/exportar" className="flex flex-row justify-center items-center gap-4">
                        <BotonExportarPDF />
                    </Link>

                    <Link href="/admin/usuarios/enviar" className="flex flex-row justify-center items-center gap-4">
                        <BotonEnviarCorreo />
                    </Link>

                </SeccionFooter>

            </SeccionAcciones>

            <SeccionLista>

                <THUsuarios />

                <tbody className='bg-gray-300 overflow-auto max-w-[400px] '>
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
            </SeccionLista>


        </AdminPage>

    )
}

export default usuarios



{/* TODO:form busqueda
    agregar funcionalidad para el form de busqueda
*/}

{/* TODO:form botones agregar,exportar, enviar correo
    agregar funcionalidad para exportar a pdf
    agregar funcionalidad para enviar correo
*/}

{/* TODO:lista de usuarios
    agregar foto de los usuarios
    arreglar boton de editar

*/}