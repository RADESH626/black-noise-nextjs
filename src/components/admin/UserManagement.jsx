"use client";

import React, { useState, useEffect } from 'react';
import { getUsers, updateUser, deleteUser } from '@/app/acciones/adminActions'; // Asumiendo que estas acciones existen o se crearán

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await getUsers(); // Esta función debe ser implementada
            setUsers(data);
        } catch (err) {
            setError("Error al cargar usuarios: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (user) => {
        setEditingUser(user);
        setFormData({
            nombre: user.nombre,
            email: user.email,
            rol: user.rol,
            // Agrega otros campos que puedan ser editables
        });
    };

    const handleDeleteClick = async (userId) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
            try {
                await deleteUser(userId); // Esta función debe ser implementada
                fetchUsers(); // Recargar usuarios después de eliminar
            } catch (err) {
                setError("Error al eliminar usuario: " + err.message);
            }
        }
    };

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUser(editingUser._id, formData); // Esta función debe ser implementada
            setEditingUser(null);
            setFormData({});
            fetchUsers(); // Recargar usuarios después de actualizar
        } catch (err) {
            setError("Error al actualizar usuario: " + err.message);
        }
    };

    if (loading) return <div>Cargando usuarios...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">Gestión de Usuarios</h2>
            {editingUser && (
                <div className="mb-4 p-4 border rounded shadow-md">
                    <h3 className="text-lg font-semibold mb-2">Editar Usuario: {editingUser.nombre}</h3>
                    <form onSubmit={handleFormSubmit}>
                        <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-700">Nombre:</label>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre || ''}
                                onChange={handleFormChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-700">Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email || ''}
                                onChange={handleFormChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-700">Rol:</label>
                            <select
                                name="rol"
                                value={formData.rol || ''}
                                onChange={handleFormChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            >
                                <option value="usuario">Usuario</option>
                                <option value="admin">Admin</option>
                                <option value="proveedor">Proveedor</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mr-2"
                        >
                            Guardar Cambios
                        </button>
                        <button
                            type="button"
                            onClick={() => setEditingUser(null)}
                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
                        >
                            Cancelar
                        </button>
                    </form>
                </div>
            )}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">ID</th>
                            <th className="py-2 px-4 border-b">Nombre</th>
                            <th className="py-2 px-4 border-b">Email</th>
                            <th className="py-2 px-4 border-b">Rol</th>
                            <th className="py-2 px-4 border-b">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td className="py-2 px-4 border-b">{user._id}</td>
                                <td className="py-2 px-4 border-b">{user.nombre}</td>
                                <td className="py-2 px-4 border-b">{user.email}</td>
                                <td className="py-2 px-4 border-b">{user.rol}</td>
                                <td className="py-2 px-4 border-b">
                                    <button
                                        onClick={() => handleEditClick(user)}
                                        className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 mr-2"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(user._id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
