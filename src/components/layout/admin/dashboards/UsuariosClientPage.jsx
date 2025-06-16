"use client";

import { useState, useEffect, useCallback } from 'react';
import { ObtenerTodosLosUsuarios, toggleUsuarioHabilitado } from '@/app/acciones/UsuariosActions.js';
import Tabla from '@/components/common/tablas/Tabla';
import TdGeneral from '@/components/common/tablas/TdGeneral';
import THUsuarios from '@/components/layout/admin/usuarios/THUsuarios';
import Image from 'next/image';
import Link from 'next/link';
import BotonEditar from '@/components/common/botones/BotonEditar';
import FormBuscarUsuario from '@/components/layout/admin/usuarios/forms/FormBuscarUsuario';
import ModalAgregarUsuario from '@/components/common/modales/ModalAgregarUsuario';
import ModalEditarUsuario from '@/components/layout/admin/usuarios/modals/ModalEditarUsuario'; // Import ModalEditarUsuario
import BotonGeneral from '@/components/common/botones/BotonGeneral';
import { useDialog } from '@/context/DialogContext';
import { useActionState } from 'react'; // For React 19
import { useFormStatus } from 'react-dom'; // For React 19

// Utility function for date formatting
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

// Component for the toggle user status button, using Server Actions pattern
function ToggleUserStatusForm({ userId, currentStatus, onStatusChanged }) {
    const { showPopUp } = useDialog();
    const [state, formAction] = useActionState(toggleUsuarioHabilitado, { message: null, success: false });
    const { pending } = useFormStatus();

    useEffect(() => {
        if (state.message) {
            showPopUp(state.message, state.success ? "success" : "error");
            if (state.success && onStatusChanged) {
                onStatusChanged(); // Notify parent to refresh user list
            }
        }
    }, [state, showPopUp, onStatusChanged]);

    return (
        <form action={formAction}>
            <input type="hidden" name="id" value={userId} />
            <input type="hidden" name="newStatus" value={String(!currentStatus)} />
            <button
                type="submit"
                disabled={pending}
                className={`px-3 py-1.5 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 text-sm whitespace-nowrap ${currentStatus
                    ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
                    : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
                }`}
            >
                {pending ? (currentStatus ? 'Deshabilitando...' : 'Habilitando...') : (currentStatus ? 'Deshabilitar' : 'Habilitar')}
            </button>
        </form>
    );
}

export default function UsuariosClientPage({ initialUsers }) {
  const [users, setUsers] = useState(initialUsers || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false); // State for edit user modal
  const [userToEdit, setUserToEdit] = useState(null); // State to hold user data for editing
  const { showPopUp } = useDialog();

  const fetchAndSetUsers = useCallback(async () => {
    setLoading(true);
    try {
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
  }, []);

  useEffect(() => {
    if (!initialUsers || initialUsers.length === 0) {
      fetchAndSetUsers();
    } else {
      setUsers(initialUsers);
    }
  }, [initialUsers, fetchAndSetUsers]);

  const handleSearchSuccess = (filteredUsers) => {
    setUsers(filteredUsers);
    setError(null); // Clear any previous errors
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    setLoading(true);
    try {
      const result = await toggleUsuarioHabilitado(userId, !currentStatus);
      if (result.success) {
        showPopUp(result.message, 'success');
        // Re-fetch users to get the updated status
        fetchAndSetUsers();
      } else {
        showPopUp(result.message, 'error');
      }
    } catch (err) {
      showPopUp('Error al cambiar el estado del usuario.', 'error');
      console.error('Error toggling user status:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && users.length === 0) { // Only show full loading if no users are displayed yet
    return <p>Cargando usuarios...</p>;
  }

  if (error) {
    return <p>Error al cargar usuarios: {error}</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h4 className='font-bold text-2xl text-black'>Gestión de Usuarios</h4>
        <BotonGeneral onClick={() => setShowAddUserModal(true)}>
          Agregar Usuario
        </BotonGeneral>
      </div>
      <div className="my-4 p-4 bg-gray-800 rounded-lg shadow-md">
        <FormBuscarUsuario onSearchSuccess={handleSearchSuccess} />
      </div>
      {users.length > 0 ? (
        <div className="overflow-x-auto">
          <Tabla>
            <THUsuarios />
            <tbody className='bg-gray-300 divide-y divide-gray-400'>
                {loading ? (
                    <tr><TdGeneral colSpan="6" className="text-center py-4">Actualizando...</TdGeneral></tr>
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
                                        alt={`Foto de ${user.Nombre}`}
                                        width={40}
                                        height={40}
                                        className="rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="font-bold">{user.Nombre} {user.primerApellido}</p>
                                        <p className="text-sm text-gray-600">{user.rol}</p>
                                    </div>
                                </div>
                            </TdGeneral>

                            {/* Nombre */}
                            {/* <TdGeneral>
                                {`${user.primerNombre} ${user.primerApellido}`}
                            </TdGeneral> */}

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
                                    <BotonEditar onClick={() => {
                                        setUserToEdit(user);
                                        setShowEditUserModal(true);
                                    }}>
                                        Editar
                                    </BotonEditar>
                                    <ToggleUserStatusForm 
                                        userId={user._id} 
                                        currentStatus={user.habilitado} 
                                        onStatusChanged={fetchAndSetUsers} 
                                    />
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

      <ModalAgregarUsuario 
        isOpen={showAddUserModal} 
        onClose={() => setShowAddUserModal(false)} 
        onUserAdded={fetchAndSetUsers}
      />

      <ModalEditarUsuario
        isOpen={showEditUserModal}
        onClose={() => {
            setShowEditUserModal(false);
            setUserToEdit(null); // Clear user data on close
        }}
        userData={userToEdit}
        onUserUpdated={fetchAndSetUsers}
      />
    </div>
  );
}
