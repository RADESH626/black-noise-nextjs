"use client";

import AdminSidebar from '../../components/layout/admin/AdminSidebar';

function AdminLayoutContent({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-6 overflow-y-auto bg-white !important">
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
