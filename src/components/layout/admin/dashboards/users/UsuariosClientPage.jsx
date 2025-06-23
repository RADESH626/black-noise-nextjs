"use client";

import { useState, useEffect, useCallback } from 'react';
import { ObtenerTodosLosUsuarios, toggleUsuarioHabilitado } from '@/app/acciones/UsuariosActions.js';
import Tabla from '@/components/common/tablas/Tabla';
import TdGeneral from '@/components/common/tablas/TdGeneral';
import THUsuarios from '@/components/layout/admin/usuarios/THUsuarios';
import Image from 'next/image';
import Link from 'next/link';
import BotonEditar from '@/components/common/botones/BotonEditar';
import ModalAgregarUsuario from '@/components/common/modales/ModalAgregarUsuario';
import ModalEditarUsuario from '@/components/layout/admin/usuarios/modals/ModalEditarUsuario';
import BotonGeneral from '@/components/common/botones/BotonGeneral';
import Loader from '@/components/Loader';
import { useDialog } from '@/context/DialogContext';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import BotonExportarPDF from '@/components/common/botones/BotonExportarPDF';
import UserFilters from '@/components/admin/filters/UserFilters'; // Importar el componente de filtros
import { useRouter, useSearchParams } from 'next/navigation';

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
            <BotonGeneral
                type="submit"
                disabled={pending}
                variant={currentStatus ? 'danger' : 'success'}
                className="px-3 py-1.5 text-sm whitespace-nowrap"
            >
                {pending ? (currentStatus ? 'Deshabilitando...' : 'Habilitando...') : (currentStatus ? 'Deshabilitar' : 'Habilitar')}
            </BotonGeneral>
        </form>
    );
}

export default function UsuariosClientPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const { showPopUp } = useDialog();

  const currentFilters = {
    searchText: searchParams.get('searchText') || '',
    rol: searchParams.get('rol') || '',
    tipoDocumento: searchParams.get('tipoDocumento') || '',
    genero: searchParams.get('genero') || '',
    habilitado: searchParams.get('habilitado') === 'true' ? true : (searchParams.get('habilitado') === 'false' ? false : undefined),
    fechaNacimientoStart: searchParams.get('fechaNacimientoStart') || '',
    fechaNacimientoEnd: searchParams.get('fechaNacimientoEnd') || '',
    fechaRegistroStart: searchParams.get('fechaRegistroStart') || '',
    fechaRegistroEnd: searchParams.get('fechaRegistroEnd') || '',
  };

  const fetchAndSetUsers = useCallback(async () => {
    setLoading(true);
    try {
      const result = await ObtenerTodosLosUsuarios(currentFilters);
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
  }, [currentFilters]);

  useEffect(() => {
    fetchAndSetUsers();
  }, [fetchAndSetUsers]);

  const handleApplyFilters = useCallback((filters) => {
    const params = new URLSearchParams(searchParams);
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        params.set(key, filters[key]);
      } else {
        params.delete(key);
      }
    });
    router.push(`/admin/users?${params.toString()}`);
    router.refresh(); // Forzar la revalidación de datos del servidor
  }, [router, searchParams]);

  const handleClearFilters = useCallback(() => {
    router.push('/admin/users');
    router.refresh(); // Forzar la revalidación de datos del servidor
  }, [router]);

  const handleToggleUserStatus = async (userId, currentStatus) => {
    setLoading(true);
    try {
      const result = await toggleUsuarioHabilitado(userId, !currentStatus);
      if (result.success) {
        showPopUp(result.message, 'success');
        // Re-fetch users to get the updated status with current filters
        fetchAndSetUsers(filters);
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

  // PDF Export Mappers
  const userTableHeaders = [
    'Tipo Doc.', 'N° Doc.', 'P. Nombre', 'P. Apellido', 'F. Nacimiento', 'Género', 'Teléfono', 'Dirección',
    'Correo', 'Rol', 'Estado'
  ];

  const userTableBodyMapper = (user) => [
    user.tipoDocumento || 'N/A',
    user.numeroDocumento || 'N/A',
    user.primerNombre || 'N/A',
    user.primerApellido || 'N/A',
    user.fechaNacimiento ? new Date(user.fechaNacimiento).toLocaleDateString() : 'N/A',
    user.genero || 'N/A',
    user.numeroTelefono || 'N/A',
    user.direccion || 'N/A',
    user.correo || 'N/A',
    user.rol || 'N/A',
    user.habilitado ? "Habilitado" : "Deshabilitado"
  ];

  if (loading && users.length === 0) { // Only show full loading if no users are displayed yet
    return <Loader />;
  }

  if (error) {
    return <p>Error al cargar usuarios: {error}</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h4 className='font-bold text-2xl text-black'>Gestión de Usuarios</h4>
        <div className="flex gap-2">
            <BotonGeneral onClick={() => setShowAddUserModal(true)}>
              Agregar Usuario
            </BotonGeneral>
            <BotonExportarPDF 
                data={users} 
                reportTitle="Reporte de Usuarios" 
                tableHeaders={userTableHeaders} 
                tableBodyMapper={userTableBodyMapper} 
            />
        </div>
      </div>
      <div className="mb-6">
        <UserFilters onApplyFilters={handleApplyFilters} onClearFilters={handleClearFilters} initialFilters={currentFilters} />
      </div>

      {users.length > 0 ? (
        <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
          <Tabla>
            <THUsuarios />
            <tbody className='bg-gray-300 divide-y divide-gray-400'>
                {loading ? (
                    <tr><TdGeneral colSpan="6" className="text-center py-4">Actualizando...</TdGeneral></tr>
                ) : users.length === 0 ? (
                    <tr><TdGeneral colSpan="6" className="text-center py-4">No se encontraron usuarios que coincidan con los filtros.</TdGeneral></tr>
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
                                        src={user.profileImageUrl || '/img/perfil/FotoPerfil.webp'} // Use profileImageUrl
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
        <p>No hay usuarios para mostrar que coincidan con los filtros.</p>
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
