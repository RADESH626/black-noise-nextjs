"use client";

import AdminSidebar from '../../components/layout/admin/AdminSidebar';
import { AdminDashboardProvider, useAdminDashboard } from '../../context/AdminDashboardContext';

function AdminLayoutContent({ children }) {
  const { activeDashboard, handleSelectDashboard } = useAdminDashboard();

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar
        activeDashboard={activeDashboard}
        onSelectDashboard={handleSelectDashboard}
      />
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({ children }) {
  return (
    <AdminDashboardProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminDashboardProvider>
  );
}
