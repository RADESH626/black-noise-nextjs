"use client";

import { useEffect, useState, useActionState, useRef } from 'react'; // Import useEffect, useState, useActionState, and useRef
import Link from 'next/link';
import Image from 'next/image';
import { useFormStatus } from 'react-dom'; // Import useFormStatus from react-dom
import { usePopUp } from '@/context/PopUpContext'; // Import PopUpContext
import { InputTextoGeneral } from '@/components/common/inputs';
import { TdGeneral } from '@/components/common/tablas';
import SeccionLista from '@/components/layout/admin/secciones/lista/SeccionLista';
import PopUpMessage from '@/components/common/modales/PopUpMessage'; // Keep PopUpMessage component if needed for non-action feedback
import { FiltrarUsuarios, toggleUsuarioHabilitado } from '@/app/acciones/UsuariosActions'; // Import Server Actions
import THUsuarios from '@/components/layout/admin/usuarios/THUsuarios';
import BotonEditar from '@/components/common/botones/BotonEditar';
import BotonExportarPDF from '@/components/common/botones/BotonExportarPDF'; // Importar BotonExportarPDF
import { Rol } from '@/models/enums/usuario/Rol'; // Importar el enum Rol
import { Genero } from '@/models/enums/usuario/Genero'; // Importar el enum Genero
import { TipoDocumentoIdentidad } from '@/models/enums/usuario/TipoDocumentoIdentidad'; // Importar el enum TipoDocumentoIdentidad

// Component for the submit button with pending state
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 disabled:opacity-60"
    >
      {pending ? 'Buscando...' : 'Buscar Usuarios'}
    </button>
  );
}

// Initial state for useActionState
const initialState = {
  data: [],
  message: null,
  error: null,
};

export default function FormFiltrarUsuarios({ initialUsersFromPage = [] }) {
    const { showPopUp } = usePopUp(); // Use PopUpContext

    // State to hold the users currently being displayed (either initial or filtered)
    // Initialize using function initializer to ensure it only runs once on initial render
    const [displayedUsers, setDisplayedUsers] = useState(() => initialUsersFromPage);
    
    // Define usersToDisplay from displayedUsers
    const usersToDisplay = displayedUsers;

    // Use useActionState to manage the state of the filtering action
    const [state, formAction] = useActionState(FiltrarUsuarios, initialState);

    // Ref to access the form element for resetting it
    const formRef = useRef(null);

    // Effect to update displayedUsers when filter action returns data or show pop-up
    useEffect(() => {
        if (state.message) {
            showPopUp(state.message, state.error ? 'error' : 'success');
        }
        // Only update displayedUsers if the state is not the initial state and data is present
        if (state !== initialState && state.data && Array.isArray(state.data)) {
            setDisplayedUsers(state.data);
        }
    }, [state, showPopUp]); // initialState is a constant, no need to include it in dependencies

    // Function to handle reset filters
    const handleResetFilters = () => {
        // Reset the form fields
        if (formRef.current) {
            formRef.current.reset();
        }
        // Reset displayed users to the initial list
        setDisplayedUsers(initialUsersFromPage);
    };

    // Keep handleToggleUserStatus as it calls a separate Server Action
    const handleToggleUserStatus = async (userId, currentStatus) => {
        const formData = new FormData();
        formData.append('id', userId);

        const result = await toggleUsuarioHabilitado(formData);

        if (result.error) {
             showPopUp(result.error, 'error');
        } else {
             showPopUp(result.message || `Usuario ${currentStatus ? 'deshabilitado' : 'habilitado'} exitosamente.`, 'success');
             // RevalidatePath in the action should handle UI update
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'Fecha inválida';
        }
        return date.toLocaleDateString();
    };

    const isLoading = useFormStatus().pending;

    return (
        <>
            <form ref={formRef} action={formAction} className="flex flex-col gap-2 bg-black rounded-lg justify-center items-top p-4 w-full text-white mb-4">
                <header className='flex flex-wrap gap-4 items-end'>
                    <div>
                        <label htmlFor="textoBusqueda" className="block text-sm font-medium mb-1">Buscar (Nombre, Apellido, Correo):</label>
                        <InputTextoGeneral
                            id="textoBusqueda"
                            name="textoBusqueda"
                            placeholder="Buscar usuario..."
                        />
                    </div>
                    <div>
                        <label htmlFor="rol" className="block text-sm font-medium mb-1">Rol:</label>
                        <select
                            name="rol"
                            id="rol"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                        >
                            <option value="">Todos</option>
                            {Object.values(Rol).map((rolValue) => (
                                <option key={rolValue} value={rolValue}>
                                    {rolValue.charAt(0).toUpperCase() + rolValue.slice(1).toLowerCase()}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="generoFiltro" className="block text-sm font-medium mb-1">Género:</label>
                        <select
                            name="generoFiltro"
                            id="generoFiltro"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                        >
                            <option value="">Todos</option>
                            {Object.entries(Genero).map(([key, value]) => (
                                <option key={key} value={value}>
                                    {key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="tipoDocumentoFiltro" className="block text-sm font-medium mb-1">Tipo de Documento:</label>
                        <select
                            name="tipoDocumentoFiltro"
                            id="tipoDocumentoFiltro"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                        >
                            <option value="">Todos</option>
                            {Object.entries(TipoDocumentoIdentidad).map(([key, value]) => (
                                <option key={key} value={value}>
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center mt-4">
                        <input
                            type="checkbox"
                            id="incluirDeshabilitados"
                            name="incluirDeshabilitados"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="incluirDeshabilitados" className="ml-2 block text-sm">
                            Incluir usuarios deshabilitados
                        </label>
                    </div>
                </header>
                <footer className='flex flex-wrap gap-4 items-center mt-2'>
                    <SubmitButton />
                    <button
                        type="button"
                        onClick={handleResetFilters}
                        disabled={isLoading}
                        className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 disabled:opacity-60"
                    >
                        Limpiar Filtros
                    </button>
                    <BotonExportarPDF usuarios={usersToDisplay} />
                </footer>
            </form>

            <SeccionLista>
                <THUsuarios />
                <tbody className='bg-gray-300'>
                    {console.log('FormFiltrarUsuarios: Rendering table. usersToDisplay:', usersToDisplay?.length || 0, usersToDisplay)}
                    {isLoading ? (
                        <tr><TdGeneral colSpan="16" className="text-center py-4">Cargando...</TdGeneral></tr>
                    ) : usersToDisplay.length === 0 ? (
                        <tr><TdGeneral colSpan="16" className="text-center py-4">No se encontraron usuarios.</TdGeneral></tr>
                    ) : (
                        usersToDisplay.map((user) => (
                            <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-100">
                                <TdGeneral>{user.nombreUsuario}</TdGeneral>
                                <TdGeneral>{user.primerNombre}</TdGeneral>
                                <TdGeneral>{user.primerApellido}</TdGeneral>
                                <TdGeneral>{user.segundoApellido}</TdGeneral>
                                <TdGeneral>{user.tipoDocumento}</TdGeneral>
                                <TdGeneral>{user.numeroDocumento}</TdGeneral>
                                <TdGeneral>{user.genero}</TdGeneral>
                                <TdGeneral>{formatDate(user.fechaNacimiento)}</TdGeneral>
                                <TdGeneral>{user.numeroTelefono}</TdGeneral>
                                <TdGeneral>{user.direccion}</TdGeneral>
                                <TdGeneral>{user.correo}</TdGeneral>
                                <TdGeneral>{user.rol}</TdGeneral>
                                <TdGeneral>{formatDate(user.createdAt)}</TdGeneral>
                                <TdGeneral>
                                    {user.fotoPerfil ? (
                                        <Image
                                            src={user.fotoPerfil}
                                            alt={`Foto de perfil de ${user.nombreUsuario}`}
                                            width={50}
                                            height={50}
                                            className="rounded-full object-cover"
                                        />
                                    ) : (
                                        'N/A'
                                    )}
                                </TdGeneral>
                                <TdGeneral>{user.habilitado ? 'Activo' : 'Inactivo'}</TdGeneral>

                                <TdGeneral>

                                    <div className="flex flex-row gap-1  items-center justify-center">

                                        <Link href={`/admin/usuarios/editar/${user._id}`} passHref>
                                            <BotonEditar >Editar</BotonEditar>
                                        </Link>
                                        <button
                                            onClick={() => handleToggleUserStatus(user._id, user.habilitado)}
                                            disabled={isLoading}
                                            className={`px-4 py-2 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 text-sm ${user.habilitado
                                                ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
                                                : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
                                                }`}
                                        >
                                            {user.habilitado ? 'Deshabilitar' : 'Habilitar'}
                                        </button>

                                    </div>


                                </TdGeneral>
                            </tr>
                        ))
                    )}
                </tbody>
            </SeccionLista>
        </>
    );
}
