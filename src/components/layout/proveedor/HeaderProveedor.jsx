"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

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
        <div className="text-lg">
          Bienvenido, {session.user.name}
        </div>
      )}
    </header>
  );
}
