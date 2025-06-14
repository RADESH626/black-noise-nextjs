"use client";

import ProveedorSidebar from '../../components/layout/proveedor/ProveedorSidebar';

export default function ProveedorLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <ProveedorSidebar />
      <main className="flex-1 p-6 overflow-y-auto bg-white !important">
        {children}
      </main>
    </div>
  );
}
