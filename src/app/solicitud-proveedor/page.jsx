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
    <div className="p-6 flex flex-row bg-gray-900 text-white h-screen justify-between ">

      <div className="w-full lg:w-1/2 max-w-md mt-8 lg:mt-0 lg:mr-8 scrollable overflow-y-auto">
        <FormSolicitudProveedor />
      </div>

      <div

      // className="w-full lg:w-1/2 flex justify-center items-center relative"
      
      >
        <Image className="" 
          width={1024}
          height={450}
          src="/img/proveedores/IMAGEN-SOLICITUD-PROVEEDOR (1).jpg"
          alt="Imagen de solicitud de proveedor"
          // layout="fill"
          // objectFit="cover"
        />
      </div>
    </div>
  );
}

export default Solicitud;
