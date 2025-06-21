"use client";

import ProveedorSidebar from '@/components/proveedor/ProveedorSidebar';

function ProveedorLayoutContent({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <ProveedorSidebar />
      <main className="w-full h-full">
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
