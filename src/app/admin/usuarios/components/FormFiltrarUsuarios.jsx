"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { InputTextoGeneral } from '@/components/common/inputs';
import { TdGeneral } from '@/components/common/tablas';
import SeccionLista from '@/components/layout/admin/secciones/lista/SeccionLista';
import PopUpMessage from '@/components/common/modales/PopUpMessage';
import { FiltrarUsuarios, toggleUsuarioHabilitado } from '@/app/acciones/UsuariosActions';
import THUsuarios from '@/components/layout/admin/usuarios/THUsuarios';
import BotonEditar from '@/components/common/botones/BotonEditar';
import BotonExportarPDF from '@/components/common/botones/BotonExportarPDF'; // Importar BotonExportarPDF
import { Rol } from '@/models/enums/usuario/Rol'; // Importar el enum Rol
import { Genero } from '@/models/enums/usuario/Genero'; // Importar el enum Genero
import { TipoDocumentoIdentidad } from '@/models/enums/usuario/TipoDocumentoIdentidad'; // Importar el enum TipoDocumentoIdentidad

export default function FormFiltrarUsuarios({ initialUsersFromPage = [], isLoading: parentIsLoading = false }) {
    // Estado para almacenar los usuarios a mostrar
    const [usersToDisplay, setUsersToDisplay] = useState(initialUsersFromPage);

    // Estado para manejar el loading
    const [localIsLoading, setLocalIsLoading] = useState(false);
    const isLoading = localIsLoading || parentIsLoading;

    // Estado para manejar el formulario
    const [formKey, setFormKey] = useState(Date.now());

    // Estado para manejar el pop-up
    const [popUp, setPopUp] = useState(null);

    // Estado para manejar los filtros
    const [filters, setFilters] = useState({
        textoBusqueda: '', // Para buscar por nombre, apellido o correo
        rol: '',
        generoFiltro: '',
        tipoDocumentoFiltro: '',
        incluirDeshabilitados: false
    });

    // Efecto para inicializar los usuarios a mostrar cuando cambian los usuarios iniciales
    useEffect(() => {
        console.log('initialUsersFromPage:', initialUsersFromPage);
        if (!Array.isArray(initialUsersFromPage)) {
            console.warn('initialUsersFromPage is not an array:', initialUsersFromPage);
            setUsersToDisplay([]);
            return;
        }
        console.log('Setting usersToDisplay with length:', initialUsersFromPage.length);
        setUsersToDisplay(initialUsersFromPage);
    }, [initialUsersFromPage]);

    // Debug effect to monitor usersToDisplay changes
    useEffect(() => {
        console.log('usersToDisplay updated:', usersToDisplay);
    }, [usersToDisplay]);

    // Función para manejar el cambio en los filtros
    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Función para manejar el envío del formulario de búsqueda
    const handleSearchSubmit = async (event) => {

        // Evitar el comportamiento por defecto del formulario (recargar la pagina)
        event.preventDefault();

        // Mostrar loading y ocultar alertas
        setLocalIsLoading(true);

        // Limpiar el pop-up antes de realizar la búsqueda
        setPopUp(null);

        // Crear un objeto FormData para enviar los filtros
        const formData = new FormData();
        Object.keys(filters).forEach(key => {
            if (filters[key] !== '') {
                formData.append(key, filters[key]);
            }
        });

        try {
            const result = await FiltrarUsuarios(formData);
            if (result.error) {
                setPopUp({ type: 'error', message: result.error });
                setUsersToDisplay([]);
            } else if (result.data) {
                setUsersToDisplay(Array.isArray(result.data) ? result.data : []);
            } else {
                setUsersToDisplay([]);
            }
        } catch (error) {
            setPopUp({ type: 'error', message: 'Error al filtrar usuarios.' });
            setUsersToDisplay([]);
        }
        setLocalIsLoading(false);
    };

    const handleResetFilters = () => {
        setFormKey(Date.now());
        setFilters({
            textoBusqueda: '',
            rol: '',
            generoFiltro: '',
            tipoDocumentoFiltro: '',
            incluirDeshabilitados: false
        });
        setUsersToDisplay(Array.isArray(initialUsersFromPage) ? initialUsersFromPage : []);
        setPopUp(null); // Ensure pop-up is cleared on reset
    };

    const handleClosePopUp = () => {
        setPopUp(null);
    };

    const handleToggleUserStatus = async (userId, currentStatus) => {
        setLocalIsLoading(true);
        const formData = new FormData();
        formData.append('id', userId);

        try {
            const result = await toggleUsuarioHabilitado(formData);

            if (result.error) {
                setPopUp({
                    type: 'error',
                    message: result.error
                });
            } else {
                // Actualizar el estado del usuario en la lista local
                setUsersToDisplay(prevUsers =>
                    prevUsers.map(user =>
                        user._id === userId
                            ? { ...user, habilitado: !currentStatus }
                            : user
                    )
                );
                setPopUp({
                    type: 'success',
                    message: `Usuario ${currentStatus ? 'deshabilitado' : 'habilitado'} exitosamente.`
                });
            }
        } catch (error) {
            setPopUp({
                type: 'error',
                message: `Error al ${currentStatus ? 'deshabilitar' : 'habilitar'} el usuario.`
            });
        }
        setLocalIsLoading(false);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <>
            <form onSubmit={handleSearchSubmit} key={formKey}>
                <section className="flex flex-col gap-2 bg-black rounded-lg justify-center items-top p-4 w-full text-white mb-4">
                    <header className='flex flex-wrap gap-4 items-end'>
                        <div>

                            <label htmlFor="textoBusqueda" className="block text-sm font-medium mb-1">Buscar (Nombre, Apellido, Correo):</label>

                            <InputTextoGeneral
                                id="textoBusqueda"
                                name="textoBusqueda"
                                value={filters.textoBusqueda}
                                onChange={handleFilterChange}
                                placeholder="Buscar usuario..."
                            />

                        </div>
                        <div>
                            <label htmlFor="rol" className="block text-sm font-medium mb-1">Rol:</label>
                            <select

                                name="rol"

                                id="rol"

                                value={filters.rol}

                                onChange={handleFilterChange}
                                
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
                                value={filters.generoFiltro}
                                onChange={handleFilterChange}
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
                                value={filters.tipoDocumentoFiltro}
                                onChange={handleFilterChange}
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
                                checked={filters.incluirDeshabilitados}
                                onChange={handleFilterChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="incluirDeshabilitados" className="ml-2 block text-sm">
                                Incluir usuarios deshabilitados
                            </label>
                        </div>
                    </header>
                    <footer className='flex flex-wrap gap-4 items-center mt-2'>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 disabled:opacity-60"
                        >
                            {isLoading ? 'Buscando...' : 'Buscar Usuarios'}
                        </button>

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
                </section>
            </form>

            <SeccionLista>
                <THUsuarios />
                <tbody className='bg-gray-300'>
                    {isLoading && usersToDisplay.length === 0 ? (
                        <tr><TdGeneral colSpan="16" className="text-center py-4">Cargando...</TdGeneral></tr>
                    ) : !isLoading && usersToDisplay.length === 0 ? (
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
            {popUp && (
                <PopUpMessage
                    message={popUp.message}
                    type={popUp.type}
                    onClose={handleClosePopUp}
                />
            )}
        </>
    );
}
