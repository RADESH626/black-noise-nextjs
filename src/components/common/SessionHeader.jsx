"use client";

import { useSession } from 'next-auth/react';

function SessionHeader() {
  const { data: session } = useSession();

  if (!session || !session.user) {
    return null; // No renderizar si no hay sesión o usuario
  }

  return (
    <div className="bg-black p-4 shadow-md mb-6 flex items-center justify-center">
      <h1 className="text-2xl font-semibold text-white">
        Bienvenido, {session.user.name || session.user.email}
      </h1>
    </div>
  );
}

export default SessionHeader;
