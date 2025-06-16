"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import BotonGeneral from '@/components/common/botones/BotonGeneral';

export default function HeaderProveedor() {
  const { data: session } = useSession();
  const appTitle = "Black Noise"; // Or get from a config if available

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex items-center">
        <Link href="/" className="text-2xl font-bold">
          {appTitle}
        </Link>
      </div>
      {session?.user?.name && (
        <div className="flex items-center space-x-4">
          <span className="text-lg">Bienvenido, {session.user.name}</span>
          <BotonGeneral
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="bg-red-600 hover:bg-red-700 text-black font-bold py-2 px-4 rounded"
          >
            Cerrar Sesión
          </BotonGeneral>
        </div>
      )}
    </header>
  );
}
