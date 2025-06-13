"use client";

import { useState, useEffect, useCallback } from 'react';
import { ObtenerTodosLosUsuarios, toggleUsuarioHabilitado } from '@/app/acciones/UsuariosActions.js';
import Tabla from '@/components/common/tablas/Tabla';
import TdGeneral from '@/components/common/tablas/TdGeneral';
import THUsuarios from '@/components/layout/admin/usuarios/THUsuarios';
import Image from 'next/image';
<<<<<<< HEAD
import Link from 'next/link';
import BotonEditar from '@/components/common/botones/BotonEditar';
import FormBuscarUsuario from '@/components/layout/admin/usuarios/forms/FormBuscarUsuario';
import ModalAgregarUsuario from '@/components/common/modales/ModalAgregarUsuario';
import ModalEditarUsuario from '@/components/layout/admin/usuarios/modals/ModalEditarUsuario'; // Import ModalEditarUsuario
import BotonGeneral from '@/components/common/botones/BotonGeneral';
import { usePopUp } from '@/context/PopUpContext';
import { useActionState } from 'react'; // For React 19
import { useFormStatus } from 'react-dom'; // For React 19
=======
import BotonEditar from '@/components/common/botones/BotonEditar';
import FormBuscarUsuario from '@/components/layout/admin/usuarios/forms/FormBuscarUsuario';
import BotonGeneral from '@/components/common/botones/BotonGeneral';
import { usePopUp } from '@/context/PopUpContext';
import { useModal } from '@/context/ModalContext';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import ModalAgregarUsuario from '@/components/common/modales/ModalAgregarUsuario';
import ModalEditarUsuario from '@/components/layout/admin/usuarios/modals/ModalEditarUsuario';
>>>>>>> 23672fd20f631b662f6c2b26b31a77a6288784c6

// Utility function for date formatting
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

// Component for the toggle user status button, using Server Actions pattern
function ToggleUserStatusForm({ userId, currentStatus, onStatusChanged }) {
    const { showPopUp } = usePopUp();
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

<<<<<<< HEAD
export default function UsuariosClientPage({ initialUsers }) {
  const [users, setUsers] = useState(initialUsers || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false); // State for edit user modal
  const [userToEdit, setUserToEdit] = useState(null); // State to hold user data for editing
  const { showPopUp } = usePopUp();

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
=======
export default function UsuariosClientPage() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errorUsers, setErrorUsers] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const { showPopUp } = usePopUp();
  const { openModal, closeModal } = useModal();

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    setErrorUsers(null);
    try {
      const result = await ObtenerTodosLosUsuarios();
      if (result?.success && Array.isArray(result.users)) {
        setUsers(result.users);
      } else {
        setErrorUsers(result?.message || "No se recibió un array de usuarios.");
        console.error("Error al cargar usuarios en UsuariosClientPage.jsx:", result?.message || "No se recibió un array de usuarios.");
      }
    } catch (err) {
      setErrorUsers(err.message);
      console.error("Error fetching users:", err);
    } finally {
      setLoadingUsers(false);
>>>>>>> 23672fd20f631b662f6c2b26b31a77a6288784c6
    }
  }, []);

  useEffect(() => {
<<<<<<< HEAD
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

=======
    fetchUsers();
  }, [fetchUsers]);

  const handleRefreshUsers = () => {
    fetchUsers(); // Re-fetch users to update the table
    setShowAddUserModal(false);
    closeModal(); // Close any open modal, including edit user modal
    setUserToEdit(null);
  };

  const handleEditUserClick = (user) => {
    console.log('handleEditUserClick called with user:', user);
    setUserToEdit(user);
    console.log('After setUserToEdit, userToEdit state (next render):', user); // Log what it will be
    openModal(
      'Editar Usuario',
      <ModalEditarUsuario userData={user} onUserUpdated={handleRefreshUsers} />,
      'large' // You can adjust the size as needed: 'small', 'default', 'large', or 'full'
    );
  };

  const handleSearchSuccess = (filteredUsers) => {
    setUsers(filteredUsers);
    setErrorUsers(null); // Clear any previous errors
  };

>>>>>>> 23672fd20f631b662f6c2b26b31a77a6288784c6
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
<<<<<<< HEAD
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
=======
      
      {loadingUsers ? (
          <p className="text-center text-white">Cargando usuarios...</p>
      ) : errorUsers ? (
          <p className="text-center text-red-500">Error al cargar usuarios: {errorUsers}</p>
      ) : users && users.length > 0 ? (
          <div className="overflow-x-auto">
            <Tabla>
              <THUsuarios />
              <tbody className='bg-gray-300 divide-y divide-gray-400 text-black'>
                  {users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-200">
                          {/* Estado */}
                          <TdGeneral>
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                  user.habilitado ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                              }`}>
                                  {user.habilitado ? 'Activo' : 'Inactivo'}
                              </span>
                          </TdGeneral>

                          {/* Usuario (Foto, Nombre de Usuario, Rol) */}
                          <TdGeneral>
                              <div className="flex items-center space-x-3">
                                  <Image
                                      src={user.imageData && user.imageMimeType ? `data:${user.imageMimeType};base64,\${Buffer.from(user.imageData.data).toString('base64')}` : '/img/perfil/FotoPerfil.webp'}
                                      alt={`Foto de ${user.nombreUsuario || user.primerNombre}`}
                                      width={40}
                                      height={40}
                                      className="rounded-full object-cover"
                                  />
                                  <div>
                                      <p className="font-bold">{user.nombreUsuario || `${user.primerNombre} ${user.primerApellido}`}</p>
                                      <p className="text-sm text-gray-600">{user.rol}</p>
                                  </div>
                              </div>
                          </TdGeneral>

                          {/* Nombre Completo */}
                          <TdGeneral>
                              {user.primerNombre} {user.segundoNombre || ''} {user.primerApellido} {user.segundoApellido || ''}
                          </TdGeneral>

                          {/* Información Adicional (Nacimiento, Género, Dirección) */}
                          <TdGeneral>
                              <div className="text-sm">
                                  <p><strong>Nacimiento:</strong> {formatDate(user.fechaNacimiento)}</p>
                                  <p><strong>Género:</strong> {user.genero}</p>
                                  <p><strong>Dirección:</strong> {user.direccion}</p>
                              </div>
                          </TdGeneral>

                          {/* Contacto (Correo, Teléfono) */}
                          <TdGeneral>
                              <div className="text-sm">
                                  <p><strong>Correo: </strong>{user.correo}</p>
                                  <p><strong>Teléfono: </strong>{user.numeroTelefono}</p>
                              </div>
                          </TdGeneral>

                          {/* Acciones */}
                          <TdGeneral>
                              <div className="flex flex-col md:flex-row gap-2 items-center justify-center">
                                  <BotonEditar onClick={() => {
                                      console.log('BotonEditar clickeado en JSX para usuario:', user._id);
                                      handleEditUserClick(user);
                                  }}>
                                      Editar
                                  </BotonEditar>
                                  <ToggleUserStatusForm
                                      userId={user._id}
                                      currentStatus={user.habilitado}
                                      onStatusChanged={handleRefreshUsers}
                                  />
                              </div>
                          </TdGeneral>
                      </tr>
                  ))}
              </tbody>
            </Tabla>
          </div>
      ) : (
          <p className="text-center text-white">No hay usuarios para mostrar.</p>
>>>>>>> 23672fd20f631b662f6c2b26b31a77a6288784c6
      )}

      <ModalAgregarUsuario 
        isOpen={showAddUserModal} 
        onClose={() => setShowAddUserModal(false)} 
<<<<<<< HEAD
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
=======
        onUserAdded={handleRefreshUsers}
>>>>>>> 23672fd20f631b662f6c2b26b31a77a6288784c6
      />
    </div>
  );
}
