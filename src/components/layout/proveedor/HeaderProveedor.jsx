"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import BotonGeneral from '@/components/common/botones/BotonGeneral';

export default function HeaderProveedor() {
  const { data: session } = useSession();
  const appTitle = "Black Noise"; // Or get from a config if available

  return (
<<<<<<< HEAD
    <header className="bg-transparent text-white p-4 flex justify-between items-center">
=======
    <header className="bg-black text-white p-4 flex justify-between items-center">
>>>>>>> c32cb53 (primer commit)
      <div className="flex items-center">
        {/* <Link href="/" className="text-2xl font-bold no-underline">
          {appTitle}
        </Link> */}
      </div>
      {session?.user?.name && (
        <div className="flex items-center space-x-4">
          <span className="text-lg">Bienvenido, {session.user.name}</span>
          <BotonGeneral
            onClick={() => signOut({ callbackUrl: '/login' })}
<<<<<<< HEAD
            variant="secondary"
            className="w-full"
=======
            className="bg-red-600 hover:bg-red-700 text-black font-bold py-2 px-4 rounded"
>>>>>>> c32cb53 (primer commit)
          >
            Cerrar Sesión
          </BotonGeneral>
        </div>
      )}
    </header>
  );
}
