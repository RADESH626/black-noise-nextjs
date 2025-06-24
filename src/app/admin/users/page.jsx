"use client";

import { Suspense } from 'react';
import UsuariosClientPage from '@/components/layout/admin/dashboards/users/UsuariosClientPage';

const AdminUsersPage = () => {
    return (
        <div className="container mx-auto p-4">
            <Suspense fallback={<div>Cargando usuarios...</div>}>
                <UsuariosClientPage />
            </Suspense>
        </div>
    );
};

export default AdminUsersPage;
