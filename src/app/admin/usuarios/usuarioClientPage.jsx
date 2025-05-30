'use client';

import { useState } from 'react';
import FormFiltrarUsuarios from './components/FormFiltrarUsuarios';
import AdminPage from '@/components/layout/admin/AdminPage';
import SeccionAcciones from '@/components/layout/admin/secciones/acciones/SeccionAcciones';
import SeccionFooter from '@/components/layout/admin/secciones/acciones/SeccionFooter';
import SeccionHeader from '@/components/layout/admin/secciones/acciones/SeccionHeader';
import BotonAgregarUsuarios from '@/components/common/botones/BotonAgregarUsuarios';
import ModalAgregarUsuario from '@/components/common/modales/ModalAgregarUsuario';

export default function UsuariosClientPage({ initialUsers = [] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        setIsModalOpen(false);
        // No need to manually refresh - revalidatePath in Server Actions will handle this
    };

    console.log('Client: Received initial users:', initialUsers?.length || 0);

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
                initialUsersFromPage={initialUsers} 
            />

            <ModalAgregarUsuario 
                isOpen={isModalOpen} 
                onClose={handleCloseModal}
            />
        </AdminPage>
    );
}
