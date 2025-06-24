"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ProveedorSidebar from '@/components/proveedor/ProveedorSidebar';

function ProveedorLayoutContent({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  if (!session || !session.user || !session.user.isSupplier) {
    router.push("/login");
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <ProveedorSidebar />
      <main className="flex flex-col flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

export default function ProveedorLayout({ children }) {
  return (
    <ProveedorLayoutContent>{children}</ProveedorLayoutContent>
  );
}
