"use client";

import { useState, useEffect } from 'react';
import { ObtenerTodosLosUsuarios } from '@/app/acciones/UsuariosActions.js';
import Tabla from '@/components/common/tablas/Tabla';
import TablaHeader from '@/components/common/tablas/TablaHeader';
import Thgeneral from '@/components/common/tablas/Thgeneral';
import TdGeneral from '@/components/common/tablas/TdGeneral';

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
            <TablaHeader>
              <Thgeneral>Nombre</Thgeneral>
              <Thgeneral>Apellido</Thgeneral>
              <Thgeneral>Correo</Thgeneral>
              <Thgeneral>Documento</Thgeneral>
              <Thgeneral>Rol</Thgeneral>
            </TablaHeader>
            <tbody className="text-gray-700">
              {users.map(user => (
                <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-100">
                  <TdGeneral>{user.primerNombre}</TdGeneral>
                  <TdGeneral>{user.primerApellido}</TdGeneral>
                  <TdGeneral>{user.correo}</TdGeneral>
                  <TdGeneral>{user.numeroDocumento}</TdGeneral>
                  <TdGeneral>{user.rol}</TdGeneral>
                </tr>
              ))}
            </tbody>
          </Tabla>
        </div>
      ) : (
        <p>No hay usuarios para mostrar.</p>
      )}
    </div>
  );
}
