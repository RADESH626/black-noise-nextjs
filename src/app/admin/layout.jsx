"use client";

import AdminSidebar from '../../components/layout/admin/AdminSidebar';
import SessionHeader from '@/components/common/SessionHeader';

function AdminLayoutContent({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">

      <AdminSidebar />

      <main className="flex flex-col flex-1 overflow-y-auto">
        <SessionHeader />
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
