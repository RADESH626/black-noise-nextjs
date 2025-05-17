"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { InputTextoGeneral } from '@/components/common/inputs';
import { TdGeneral } from '@/components/common/tablas';
import SeccionLista from '@/components/layout/admin/secciones/lista/SeccionLista';
import { FiltrarUsuarios, DeshabilitarUsuario, HabilitarUsuario } from '@/app/acciones/UsuariosActions';
import THUsuarios from '@/components/layout/admin/usuarios/THUsuarios';
import BotonEditar from '@/components/common/botones/BotonEditar';

export default function FormFiltrarUsuarios({ initialUsersFromPage = [] }) {
    const [usersToDisplay, setUsersToDisplay] = useState(initialUsersFromPage);
    const [isLoading, setIsLoading] = useState(false);
    const [formKey, setFormKey] = useState(Date.now());
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });
    const [filters, setFilters] = useState({
        textoBusqueda: '', // Para buscar por nombre, apellido o correo
        rol: '',
        generoFiltro: '',
        tipoDocumentoFiltro: '',
        incluirDeshabilitados: false
    });

    useEffect(() => {
        setUsersToDisplay(initialUsersFromPage);
    }, [initialUsersFromPage]);

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSearchSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setAlert({ show: false, type: '', message: '' });

        const formData = new FormData();
        Object.keys(filters).forEach(key => {
            if (filters[key] !== '') {
                formData.append(key, filters[key]);
            }
        });

        try {
            const result = await FiltrarUsuarios(formData);
            if (result.error) {
                setAlert({ show: true, type: 'error', message: result.error });
                setUsersToDisplay([]);
            } else {
                setUsersToDisplay(result.data || []);
            }
        } catch (error) {
            setAlert({ show: true, type: 'error', message: 'Error al filtrar usuarios.' });
            setUsersToDisplay([]);
        }
        setIsLoading(false);
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
        setUsersToDisplay(initialUsersFromPage);
    };

    const handleToggleUserStatus = async (userId, currentStatus) => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('id', userId);

        try {
            const result = currentStatus ? await DeshabilitarUsuario(formData) : await HabilitarUsuario(formData);

            if (result.error) {
                setAlert({
                    show: true,
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
                setAlert({
                    show: true,
                    type: 'success',
                    message: `Usuario ${currentStatus ? 'deshabilitado' : 'habilitado'} exitosamente.`
                });
            }
        } catch (error) {
            setAlert({
                show: true,
                type: 'error',
                message: `Error al ${currentStatus ? 'deshabilitar' : 'habilitar'} el usuario.`
            });
        }
        setIsLoading(false);
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
                                <option value="admin">Administrador</option>
                                <option value="cliente">Cliente</option>
                                <option value="proveedor">Proveedor</option>
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
                                <option value="M">Masculino</option>
                                <option value="F">Femenino</option>
                                <option value="O">Otro</option>
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
                                <option value="CC">Cédula de Ciudadanía</option>
                                <option value="CE">Cédula de Extranjería</option>
                                <option value="TI">Tarjeta de Identidad</option>
                                <option value="PP">Pasaporte</option>
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
                    </footer>
                </section>
            </form>

            {alert.show && (
                <div className={`p-4 mb-4 text-sm rounded-lg ${alert.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`} role="alert">
                    {alert.message}
                    <button onClick={() => setAlert({ show: false })} className="ml-4 float-right font-bold">X</button>
                </div>
            )}

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
                                <TdGeneral>{user.fotoPerfil || 'N/A'}</TdGeneral>
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
