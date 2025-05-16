// src/app/admin/usuarios/page.jsx
import { BotonAgregarUsuarios } from '@/components/common/botones';
import FormFiltrarUsuarios from '@/components/layout/admin/usuarios/forms/FormFiltrarUsuarios'; // O FormBuscarUsuarios
import Link from 'next/link';
import AdminPage from '@/components/layout/admin/AdminPage';
import SeccionAcciones from '@/components/layout/admin/secciones/acciones/SeccionAcciones';
import SeccionFooter from '@/components/layout/admin/secciones/acciones/SeccionFooter';
import SeccionHeader from '@/components/layout/admin/secciones/acciones/SeccionHeader';
import { obtenerUsuariosHabilitados } from '@/app/acciones/UsuariosActions'; // Para la carga inicial

async function UsuariosAdminPage() {
    // Carga inicial de usuarios cuando la página se renderiza por primera vez en el servidor
    const initialUsersArray = await obtenerUsuariosHabilitados();

    // console.log("Resultado de la carga inicial de usuarios:", initialUsersArray);
    let serverLoadedUsers = [];

    // initialUsersArray is expected to be an array of users directly
    // or undefined/null if an error occurred within obtenerUsuariosHabilitados
    if (initialUsersArray && Array.isArray(initialUsersArray)) {
        serverLoadedUsers = initialUsersArray.map(user => JSON.parse(JSON.stringify(user)));
    } else {
        // This covers cases where initialUsersArray is undefined, null, or not an array.
        // Errors during the fetch in obtenerUsuariosHabilitados are logged there.
        // We log here if the expected array wasn't received.
        console.error("Error al cargar usuarios iniciales en page.jsx: No se recibió un array de usuarios o está vacío.");
        // serverLoadedUsers remains []
    }

    return (
        <AdminPage>
            <SeccionAcciones>
                <SeccionHeader>
                    <h4 className='font-bold text-2xl text-black'>Gestión de Usuarios</h4>
                </SeccionHeader>
                <SeccionFooter>
                    <Link href="/admin/usuarios/agregar" className="flex flex-row justify-center items-center gap-4">
                        <BotonAgregarUsuarios />
                    </Link>
                    {/* Otros botones globales */}
                </SeccionFooter>
            </SeccionAcciones>

            {/*
              FormFiltrarUsuarios ahora será responsable de:
              1. Mostrar los inputs de filtro.
              2. Tener un b otón "Buscar".
              3. Al buscar, llamar a la server action buscarUsuarios.
              4. Mantener su propio estado para la lista de usuarios a mostrar.
              5. Renderizar la lista de usuarios.
              6. Usar serverLoadedUsers para su estado inicial.
            */}
            <FormFiltrarUsuarios initialUsersFromPage={serverLoadedUsers} />
        </AdminPage>
    );
}

export default UsuariosAdminPage;
