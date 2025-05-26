"use client";

import React from 'react';
import FormSolicitudProveedor from '@/components/layout/proveedor/forms/FormSolicitudProveedor';
import { useSession } from 'next-auth/react';
import { Rol } from '@/models/enums/usuario/Rol'; // Asumiendo que Rol.js está en esta ruta
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function Solicitud() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Do nothing while loading
    if (!session) {
      router.push('/login'); // Redirect to login if not authenticated
    } else if (session.user?.rol === Rol.PROVEEDOR) {
      router.push('/proveedores'); // Redirect to provider dashboard if already a provider
    }
  }, [session, status, router]);

  if (status === 'loading' || !session || session.user?.rol === Rol.PROVEEDOR) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        Cargando o redirigiendo...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <FormSolicitudProveedor />
    </div>
  );
}

export default Solicitud;
