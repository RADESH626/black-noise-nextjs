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
import ModalEditarUsuario from '@/components/layout/admin/usuarios/modals/ModalEditarUsuario';
import BotonGeneral from '@/components/common/botones/BotonGeneral';
import { usePopUp } from '@/context/PopUpContext';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

// Utility function for date formatting
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

// Component for the toggle user status button
function ToggleUserStatusForm({ userId, currentStatus, onStatusChanged }) {
  const { showPopUp } = usePopUp();
  const [state, formAction] = useActionState(toggleUsuarioHabilitado, { message: null, success: false });
  const { pending } = useFormStatus();

  useEffect(() => {
    if (state.message) {
      showPopUp(state.message, state.success ? "success" : "error");
      if (state.success && onStatusChanged) onStatusChanged();
    }
  }, [state, showPopUp, onStatusChanged]);

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={userId} />
      <input type="hidden" name="newStatus" value={String(!currentStatus)} />
      <button
        type="submit"
        disabled={pending}
        className={`px-3 py-1.5 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 text-sm whitespace-nowrap ${
          currentStatus
            ? 'bg-[#DC2626] text-[#FFFFFF] hover:bg-[#B91C1C] focus:ring-[#EF4444]'
            : 'bg-[#059669] text-[#FFFFFF] hover:bg-[#047857] focus:ring-[#10B981]'
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
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const { showPopUp } = usePopUp();

  const fetchAndSetUsers = useCallback(async () => {
    setLoading(true);
    try {
      const result = await ObtenerTodosLosUsuarios();
      if (result && result.users && Array.isArray(result.users)) {
        setUsers(result.users);
      } else {
        setError(result?.error || "No se recibió un array de usuarios.");
        console.log("Error al cargar usuarios:", result?.error || "No se recibió un array de usuarios.");
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
    setError(null);
  };

  if (loading && users.length === 0) return <p>Cargando usuarios...</p>;
  if (error) return <p>Error al cargar usuarios: {error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-bold text-2xl text-[#000000]">Gestión de Usuarios</h4>
        <BotonGeneral onClick={() => setShowAddUserModal(true)}>Agregar Usuario</BotonGeneral>
      </div>

      <div className="my-4 p-4 rounded-lg shadow-md" style={{ backgroundColor: '#000000FF' }}>
        <FormBuscarUsuario onSearchSuccess={handleSearchSuccess} />
      </div>

      {users.length > 0 ? (
        <div className="overflow-x-auto">
          <Tabla>
            <THUsuarios />
            <tbody className="divide-y" style={{ backgroundColor: '#D1D5DB', divideColor: '#9CA3AF' }}>
              {loading ? (
                <tr>
                  <TdGeneral colSpan="6" className="text-center py-4">Actualizando...</TdGeneral>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <TdGeneral colSpan="6" className="text-center py-4">No se encontraron usuarios.</TdGeneral>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-[#E5E7EB]">
                    {/* Estado */}
                    <TdGeneral>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          user.habilitado
                            ? 'bg-[#BBF7D0] text-[#065F46]'
                            : 'bg-[#FECACA] text-[#991B1B]'
                        }`}
                      >
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
                          <p className="text-sm" style={{ color: '#4B5563' }}>{user.rol}</p>
                        </div>
                      </div>
                    </TdGeneral>

                    {/* Nombre */}
                    <TdGeneral>{`${user.primerNombre} ${user.primerApellido}`}</TdGeneral>

                    {/* Información */}
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
                        <p><strong>Correo:</strong> {user.correo}</p>
                        <p><strong>Teléfono:</strong> {user.numeroTelefono}</p>
                      </div>
                    </TdGeneral>

                    {/* Acciones */}
                    <TdGeneral>
                      <div className="flex flex-col md:flex-row gap-2 items-center justify-center">
                        <BotonEditar onClick={() => { setUserToEdit(user); setShowEditUserModal(true); }}>
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
        onClose={() => { setShowEditUserModal(false); setUserToEdit(null); }}
        userData={userToEdit}
        onUserUpdated={fetchAndSetUsers}
      />
    </div>
  );
}
