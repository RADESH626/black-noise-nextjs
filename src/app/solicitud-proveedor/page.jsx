'use client';

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
      <div className="flex justify-center items-center h-screen bg-[#000000] text-[#FFFFFF]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFFFFF] mx-auto mb-4"></div>
          <p>Cargando sesión...</p>
        </div>
      </div>
    );
  }

  // No session
  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#000000] text-[#FFFFFF]">
        <div className="text-center">
          <p>Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  // Show the form for logged-in users who are not providers
  return (
    <main className="min-h-screen flex items-center justify-center p-5"
      style={{ background: "linear-gradient(135deg, #000000FF , #0A1828 )" }}>
      <div className="rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] overflow-hidden text-white max-w-6xl w-full">
        <div className="flex flex-row justify-center">
          <div className="p-10 flex-1 rounded-l-2xl"
            style={{ 
              background: "linear-gradient(to left, #1A1818FF, #131414FF)" 
            }}
          >
            <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: "#FFFFFFFF" }}>
              Solicitud de Proveedor
            </h2>
            <FormSolicitudProveedor />
          </div>
          <div className="flex flex-1 flex-col p-8 justify-center text-center rounded-r-2xl relative text-white"
            style={{ 
              background: "linear-gradient(to right, #1A1818FF, #131414FF)" 
            }}
          >
            <div className="flex justify-center items-center relative h-full w-full">
              <Image
                className="object-cover w-full h-full rounded-lg filter blur-sm"
                width={1024}
                height={450}
                src="/img/Fondos/fondo 5.jpg"
                alt="Imagen de solicitud de proveedor"
              />
              <div className="absolute inset-0 bg-[#000000] opacity-20 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Solicitud;
