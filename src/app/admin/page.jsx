"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const AdminRedirectPage = () => {
    const router = useRouter();

    useEffect(() => {
        // Redirect to the suppliers page by default for admin
        router.push('/admin/proveedores');
    }, [router]);

    return (
        <div className="flex justify-center items-center h-full w-full">
            <LoadingSpinner />
            {/* <p className="ml-4 text-gray-600">Redirigiendo al panel de proveedores...</p> */}
        </div>
    );
};

export default AdminRedirectPage;
