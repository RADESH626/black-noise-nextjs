"use client";

import React from 'react';
import FormSolicitudProveedor from '@/components/layout/proveedor/forms/FormSolicitudProveedor';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';

function Solicitud() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') {
      return; // Do nothing while loading
    }
    
    if (!session) {
      router.push('/login'); // Redirect to login if not authenticated
      return;
    }
  }, [session, status, router]);

  // Loading state
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Cargando sesión...</p>
        </div>
      </div>
    );
  }

  // No session
  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <div className="text-center">
          <p>Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  // Show the form for logged-in users who are not providers
  return (
    <main className=" min-h-screen flex items-center justify-center bg-gradient-to-br p-5  from-gray-600 to-pink-400">
      <div className=" rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] overflow-hidden text-white">
        <div className="flex flex-row justify-center">
          <div className="p-10 bg-black flex-1 bg-gradient-to-l from-black to-gray-900">
            <h2 className="text-3xl font-bold mb-8 text-bn-highlight text-center">Solicitud de Proveedor</h2>
            <FormSolicitudProveedor />
          </div>
          <div className="flex flex-1 flex-col bg-gradient-to-r from-black to-gray-900 text-white p-8 justify-center text-center">
            <div className="flex justify-center items-center relative h-full">
              <Image className="object-cover w-full h-full rounded-lg filter blur-sm"
                width={1024}
                height={450}
                src="/img/proveedores/IMAGEN-SOLICITUD-PROVEEDOR (1).jpg"
                alt="Imagen de solicitud de proveedor"
              />
              <div className="absolute inset-0 bg-black opacity-20 rounded-lg"></div> {/* Semi-transparent overlay */}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Solicitud;
