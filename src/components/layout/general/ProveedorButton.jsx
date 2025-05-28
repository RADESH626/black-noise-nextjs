"use client";

import React from 'react';
import BotonGeneral from '@/components/common/botones/BotonGeneral';
import { useRouter } from 'next/navigation';

function ProveedorButton() {
    const router = useRouter();

    const handleClick = () => {
        router.push('/solicitud-proveedor');
    };

    return (
        <BotonGeneral onClick={handleClick}>
            SOLICITAR SER PROVEEDOR
        </BotonGeneral>
    );
}

export default ProveedorButton;
