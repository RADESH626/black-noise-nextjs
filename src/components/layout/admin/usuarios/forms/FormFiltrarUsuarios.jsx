// src/components/layout/admin/usuarios/forms/FormFiltrarUsuarios.jsx
"use client";

import { useState, useEffect } from 'react';
import {
    InputRol,
    InputGenero,
    InputTipoDocumentoIdentidad,
    InputCheckBox,
    InputTextoGeneral
} from '@/components/common/inputs';
import TdGeneral from '@/components/common/tablas/TdGeneral';
import THUsuarios from '@/components/layout/admin/usuarios/THUsuarios';
import FormDeshabilitarusuarios from '@/components/layout/admin/usuarios/forms/FormDeshabilitarusuarios';
import Link from 'next/link';
import { BotonEditar } from '@/components/common/botones';
import SeccionLista from '@/components/layout/admin/secciones/lista/SeccionLista';
import { FiltrarUsuarios, obtenerUsuariosHabilitados, ObtenerTodosLosUsuarios } from '@/app/acciones/UsuariosActions';

function FormFiltrarUsuarios({ initialUsersFromPage = [] }) {

    const [usersToDisplay, setUsersToDisplay] = useState(initialUsersFromPage);
    const [isLoading, setIsLoading] = useState(false); // Para la acción de búsqueda
    const [formKey, setFormKey] = useState(Date.now()); // Para forzar el reseteo del formulario

    // Si initialUsersFromPage cambia (ej. por una recarga de la página), actualiza el estado.
    useEffect(() => {
        setUsersToDisplay(initialUsersFromPage);
    }, [initialUsersFromPage]);

    const handleSearchSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);

        // Revisar si hay algún filtro realmente aplicado
        let hasFilters = false;
        const textoBusqueda = formData.get('textoBusqueda')?.toString().trim() ?? '';
        const rol = formData.get('rol')?.toString().trim() ?? '';
        const generoFiltro = formData.get('generoFiltro')?.toString().trim() ?? '';
        const tipoDocumentoFiltro = formData.get('tipoDocumentoFiltro')?.toString().trim() ?? '';

        // Un filtro se considera aplicado si el campo de texto tiene valor,
        // o si alguno de los selects tiene un valor que NO es una cadena vacía.
        // Esto asume que los selects (Rol, Genero, TipoDoc) devuelven ""
        // cuando la opción "seleccione" o "todos" está elegida.
        if (
            textoBusqueda !== '' ||
            (rol !== '' && rol !== undefined && rol !== null) || // Check for actual value
            (generoFiltro !== '' && generoFiltro !== undefined && generoFiltro !== null) || // Check for actual value
            (tipoDocumentoFiltro !== '' && tipoDocumentoFiltro !== undefined && tipoDocumentoFiltro !== null) // Check for actual value
        ) {
            hasFilters = true;
        } else {
            hasFilters = false;
        }

        let result;
        if (!hasFilters) {
            console.log("No hay filtros, obteniendo todos los usuarios...");
            result = await ObtenerTodosLosUsuarios(); // Llama a la función para obtener todos los usuarios
        } else {
            console.log("FormData a enviar a FiltrarUsuarios:");
            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }
            result = await FiltrarUsuarios(formData); // Llama a la Server Action
        }

        if (!result || result.error) {
            console.error("Error: No se recibió respuesta de la acción de búsqueda o hubo un error en la misma.");
            setIsLoading(false);
            setUsersToDisplay(initialUsersFromPage);
            return;
        }

        console.log("Resultado de la búsqueda de usuarios:", result);

        if (hasFilters) { // Result from FiltrarUsuarios
            if (result && result.data) {
                setUsersToDisplay(result.data.map(user => JSON.parse(JSON.stringify(user))));
            } else {
                console.error("Error al filtrar usuarios:", result?.error);
                setUsersToDisplay([]);
            }
        } else { // Result from ObtenerTodosLosUsuarios (already an array)
            if (Array.isArray(result)) {
                setUsersToDisplay(result.map(user => JSON.parse(JSON.stringify(user))));
            } else {
                console.error("Error al obtener todos los usuarios. Se esperaba un array:", result);
                setUsersToDisplay([]);
            }
        }

        setIsLoading(false);
    };

    const handleResetFilters = async () => {
        setIsLoading(true);
        // Forzar reseteo del formulario cambiando su key
        setFormKey(Date.now());

        // Volver a llamar a ObtenerTodosLosUsuarios para asegurar datos frescos
        console.log("Reseteando filtros y obteniendo todos los usuarios...");
        const result = await ObtenerTodosLosUsuarios();
        if (Array.isArray(result)) {
            setUsersToDisplay(result.map(user => JSON.parse(JSON.stringify(user))));
        } else {
            console.error("Error al obtener todos los usuarios tras resetear:", result);
            setUsersToDisplay(initialUsersFromPage); // Fallback a los iniciales
        }
        setIsLoading(false);
    };

    return (
        <>
            {/* Se eliminó key={formKey} del form porque el reseteo de inputs individuales es más controlable */}
            {/* Si prefieres el reseteo por key, puedes volver a añadirlo y quitar el reseteo manual de inputs */}
            <form onSubmit={handleSearchSubmit}>
                <section className="flex flex-col gap-2 bg-black rounded-lg justify-center items-top p-4 w-full text-white mb-4">
                    <header className='flex flex-wrap gap-4 items-end'>
                        <div>
                            <label htmlFor="textoBusqueda" className="block text-sm font-medium mb-1">Buscar:</label>
                            <InputTextoGeneral id="textoBusqueda" name="textoBusqueda" placeholder="Nombre, correo, doc..." />
                        </div>
                        <div>
                            <label htmlFor="rol" className="block text-sm font-medium mb-1">Rol:</label>
                            <InputRol id="rol" name="rol" />
                        </div>
                        <div>
                            <label htmlFor="generoFiltro" className="block text-sm font-medium mb-1">Género:</label>
                            <InputGenero id="generoFiltro" name="generoFiltro" />
                        </div>
                        <div>
                            <label htmlFor="tipoDocumentoFiltro" className="block text-sm font-medium mb-1">Tipo Doc.:</label>
                            <InputTipoDocumentoIdentidad id="tipoDocumentoFiltro" name="tipoDocumentoFiltro" />
                        </div>
                    </header>
                    <footer className='flex flex-wrap gap-4 items-center mt-2'>
                        <div className='flex gap-2 items-center'>
                            <InputCheckBox id="incluirDeshabilitados" name="incluirDeshabilitados" />
                            <label htmlFor="incluirDeshabilitados" className="text-sm">
                                Incluir Deshabilitados
                            </label>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 disabled:opacity-60"
                        >
                            {isLoading ? 'Buscando...' : 'Buscar Usuarios'}
                        </button>
                        <button
                            type="button" // Importante: type="button" para no enviar el formulario
                            onClick={handleResetFilters}
                            disabled={isLoading}
                            className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 disabled:opacity-60"
                        >
                            Limpiar Filtros
                        </button>
                    </footer>
                </section>
            </form>

            {/* Lista de Usuarios */}
            <SeccionLista>
                <THUsuarios />
                <tbody className='bg-gray-300'>
                    {isLoading && usersToDisplay.length === 0 ? ( // Mostrar "Cargando" solo si no hay usuarios previos
                        <tr><TdGeneral colSpan="16" className="text-center py-4">Cargando...</TdGeneral></tr>
                    ) : !isLoading && usersToDisplay.length === 0 ? (
                        <tr><TdGeneral colSpan="16" className="text-center py-4">No se encontraron usuarios con los filtros aplicados.</TdGeneral></tr>
                    ) : (
                        usersToDisplay.map((usuario) => (
                            <tr key={usuario._id}>
                                <TdGeneral>{usuario.nombreUsuario}</TdGeneral>
                                <TdGeneral>{usuario.primerNombre}</TdGeneral>
                                <TdGeneral>{usuario.primerApellido}</TdGeneral>
                                <TdGeneral>{usuario.tipoDocumento}</TdGeneral>
                                <TdGeneral>{usuario.numeroDocumento}</TdGeneral>
                                <TdGeneral>{usuario.genero}</TdGeneral>
                                <TdGeneral>{usuario.fechaNacimiento ? new Date(usuario.fechaNacimiento).toLocaleDateString() : 'N/A'}</TdGeneral>
                                <TdGeneral>{usuario.numeroTelefono}</TdGeneral>
                                <TdGeneral>{usuario.direccion}</TdGeneral>
                                <TdGeneral>{usuario.correo}</TdGeneral>
                                <TdGeneral>{usuario.rol}</TdGeneral>
                                <TdGeneral>{usuario.createdAt ? new Date(usuario.createdAt).toLocaleDateString() : 'N/A'}</TdGeneral>
                                <TdGeneral>{usuario.fotoPerfil || 'N/A'}</TdGeneral>
                                <TdGeneral>{usuario.habilitado ? "Habilitado" : "Deshabilitado"}</TdGeneral>
                                <td className="border border-gray-400 px-4 py-2 flex flex-col gap-1 md:flex-row md:gap-2 items-center">
                                    <Link href={`/admin/usuarios/editar/${usuario._id.toString()}`} passHref>
                                        <BotonEditar className="w-full md:w-auto text-sm">Editar</BotonEditar>
                                    </Link>
                                    <FormDeshabilitarusuarios UserId={usuario._id.toString()} />
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </SeccionLista>
        </>
    );
}
export default FormFiltrarUsuarios;
