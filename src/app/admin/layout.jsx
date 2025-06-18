"use client";

import AdminSidebar from '../../components/layout/admin/AdminSidebar';

function AdminLayoutContent({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">

      <AdminSidebar />

      <main className="w-full h-full">

        {children}

      </main>
    </div>
  );
}

export default function AdminLayout({ children }) {
  return (
    <AdminLayoutContent>{children}</AdminLayoutContent>
  );
}
