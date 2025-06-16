"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ObtenerTodosLosUsuarios, toggleUsuarioHabilitado } from '@/app/acciones/UsuariosActions';
import { useDialog } from '@/context/DialogContext';

function UsersTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showPopUp } = useDialog();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const result = await ObtenerTodosLosUsuarios();
      if (result?.success && Array.isArray(result.users)) {
        setUsers(result.users);
      } else {
        setError(result?.message || "No se recibió un array de usuarios.");
        console.error("Error al cargar usuarios en UsersTable.jsx:", result?.message || "No se recibió un array de usuarios.");
        showPopUp(result?.message || "Error al cargar usuarios.", "error");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching users:", err);
      showPopUp("Error al cargar usuarios: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleHabilitado = async (userId, currentStatus) => {
    const formData = new FormData();
    formData.append('id', userId);
    try {
      const result = await toggleUsuarioHabilitado(formData);
      if (result?.success) {
        showPopUp(result.message, "success");
        fetchUsers(); // Re-fetch users to update the table
      } else {
        showPopUp(result?.message || "Error al cambiar estado del usuario.", "error");
      }
    } catch (err) {
      showPopUp("Error al cambiar estado del usuario: " + err.message, "error");
    }
  };

  if (loading) {
    return <p className="text-center text-white">Cargando usuarios...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error al cargar usuarios: {error}</p>;
  }

  if (!users || users.length === 0) {
    return <p className="text-center text-white">No hay usuarios para mostrar.</p>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Correo
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rol
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Habilitado
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user._id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {user.primerNombre} {user.primerApellido}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.correo}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.rol}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.habilitado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {user.habilitado ? 'Sí' : 'No'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                <Link href={`/admin/users/editar/${user._id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                  Editar
                </Link>
                <button
                  onClick={() => handleToggleHabilitado(user._id, user.habilitado)}
                  className={`font-medium ${user.habilitado ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}`}
                >
                  {user.habilitado ? 'Deshabilitar' : 'Habilitar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsersTable;
