"use client";

import { useState, useEffect } from 'react';
import { ObtenerTodosLosUsuarios } from '@/app/acciones/UsuariosActions.js';
import Tabla from '@/components/common/tablas/Tabla';
import TdGeneral from '@/components/common/tablas/TdGeneral';
import THUsuarios from '@/components/layout/admin/usuarios/THUsuarios';
import Image from 'next/image';
import Link from 'next/link';
import BotonEditar from '@/components/common/botones/BotonEditar'; // Assuming this path

// Utility function for date formatting
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

// Placeholder for user status toggle function
const handleToggleUserStatus = async (userId, currentStatus) => {
  console.log(`Toggle user status for ${userId} from ${currentStatus}`);
  // Implement actual logic to update user status via server action
  // Example: await toggleUserStatusAction(userId, !currentStatus);
};

export default function UsuariosClientPage({ initialUsers }) {
  const [users, setUsers] = useState(initialUsers || []);
  const [loading, setLoading] = useState(!initialUsers);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!initialUsers || initialUsers.length === 0) { // Only fetch if no initial data
      async function fetchUsers() {
        try {
          setLoading(true);
          const result = await ObtenerTodosLosUsuarios();
          if (result && result.users && Array.isArray(result.users)) {
            setUsers(result.users);
          } else {
            setError(result?.error || "No se recibió un array de usuarios.");
            console.log("Error al cargar usuarios en UsuariosClientPage.jsx:", result?.error || "No se recibió un array de usuarios.");
          }
        } catch (err) {
          setError(err.message);
          console.log("Error fetching users:", err);
        } finally {
          setLoading(false);
        }
      }
      fetchUsers();
    }
  }, [initialUsers]);

  if (loading) {
    return <p>Cargando usuarios...</p>;
  }

  if (error) {
    return <p>Error al cargar usuarios: {error}</p>;
  }

  return (
    <div>
      <h4 className='font-bold text-2xl text-black'>Gestión de Usuarios</h4>
      {/* Render user data here */}
      {users.length > 0 ? (
        <div className="overflow-x-auto">
          <Tabla>
            <THUsuarios />
            <tbody className='bg-gray-300 divide-y divide-gray-400'>
                {loading ? (
                    <tr><TdGeneral colSpan="6" className="text-center py-4">Cargando...</TdGeneral></tr>
                ) : users.length === 0 ? (
                    <tr><TdGeneral colSpan="6" className="text-center py-4">No se encontraron usuarios.</TdGeneral></tr>
                ) : (
                    users.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-200">
                            {/* Estado */}
                            <TdGeneral>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    user.habilitado ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                                }`}>
                                    {user.habilitado ? 'Activo' : 'Inactivo'}
                                </span>
                            </TdGeneral>

                            {/* Usuario */}
                            <TdGeneral>
                                <div className="flex items-center space-x-3">
                                    <Image
                                        src={user.fotoPerfil || '/img/perfil/FotoPerfil.webp'}
                                        alt={`Foto de ${user.nombreUsuario}`}
                                        width={40}
                                        height={40}
                                        className="rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="font-bold">{user.nombreUsuario}</p>
                                        <p className="text-sm text-gray-600">{user.rol}</p>
                                    </div>
                                </div>
                            </TdGeneral>

                            {/* Nombre */}
                            <TdGeneral>
                                {`${user.primerNombre} ${user.primerApellido}`}
                            </TdGeneral>

                            {/* Información de Usuario */}
                            <TdGeneral>
                                <div className="text-sm">
                                    <p><strong>Nacimiento:</strong> {formatDate(user.fechaNacimiento)}</p>
                                    <p><strong>Género:</strong> {user.genero}</p>
                                    <p><strong>Dirección:</strong> {user.direccion}</p>
                                </div>
                            </TdGeneral>

                            {/* Contacto */}
                            <TdGeneral>
                                <div className="text-sm">
                                    <p><strong>Correo:</strong>{user.correo}</p>
                                    <p><strong>Telefono:</strong>{user.numeroTelefono}</p>
                                </div>
                            </TdGeneral>

                            {/* Acciones */}
                            <TdGeneral>
                                <div className="flex flex-col md:flex-row gap-2 items-center justify-center">
                                    <Link href={`/admin/usuarios/editar/${user._id}`} passHref>
                                        <BotonEditar>Editar</BotonEditar>
                                    </Link>
                                    <button
                                        onClick={() => handleToggleUserStatus(user._id, user.habilitado)}
                                        disabled={loading}
                                        className={`px-3 py-1.5 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 text-sm whitespace-nowrap ${user.habilitado
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
          </Tabla>
        </div>
      ) : (
        <p>No hay usuarios para mostrar.</p>
      )}
    </div>
  );
}
