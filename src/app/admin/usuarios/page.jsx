'use client';

import { useState, useEffect } from 'react';
import FormFiltrarUsuarios from './components/FormFiltrarUsuarios';
import AdminPage from '@/components/layout/admin/AdminPage';
import SeccionAcciones from '@/components/layout/admin/secciones/acciones/SeccionAcciones';
import SeccionFooter from '@/components/layout/admin/secciones/acciones/SeccionFooter';
import SeccionHeader from '@/components/layout/admin/secciones/acciones/SeccionHeader';
import BotonAgregarUsuarios from '@/components/common/botones/BotonAgregarUsuarios';
import ModalAgregarUsuario from '@/components/common/modales/ModalAgregarUsuario';

function UsuariosAdminPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/usuarios');
                if (!response.ok) {
                    throw new Error('Error fetching users');
                }
                const data = await response.json();
                console.log('API Response:', data);
                if (!data.usuarios) {
                    console.warn('No usuarios property in response:', data);
                }
                setUsers(data.usuarios || []);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        setIsModalOpen(false);
        // Refresh users list after modal closes
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/usuarios');
                if (!response.ok) {
                    throw new Error('Error fetching users');
                }
                const data = await response.json();
                setUsers(data.usuarios || []);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    };

    return (
        <AdminPage>
            <SeccionAcciones>
                <SeccionHeader>
                    <h4 className='font-bold text-2xl text-black'>Gestión de Usuarios</h4>
                </SeccionHeader>
                <SeccionFooter>
                    <BotonAgregarUsuarios onClick={handleOpenModal} />
                </SeccionFooter>
            </SeccionAcciones>

            <FormFiltrarUsuarios 
                initialUsersFromPage={users} 
                isLoading={isLoading} 
            />

            <ModalAgregarUsuario 
                isOpen={isModalOpen} 
                onClose={handleCloseModal}
            />
        </AdminPage>
    );
}

export default UsuariosAdminPage;
