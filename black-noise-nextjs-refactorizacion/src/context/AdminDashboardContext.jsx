"use client";

import React, { createContext, useContext, useState } from 'react';

const AdminDashboardContext = createContext();

export function AdminDashboardProvider({ children }) {
  const [activeDashboard, setActiveDashboard] = useState('usuarios');

  const handleSelectDashboard = (dashboardId) => {
    setActiveDashboard(dashboardId);
  };

  return (
    <AdminDashboardContext.Provider value={{ activeDashboard, handleSelectDashboard }}>
      {children}
    </AdminDashboardContext.Provider>
  );
}

export function useAdminDashboard() {
  return useContext(AdminDashboardContext);
}
