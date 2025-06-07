"use client";

import { useState } from 'react';
import AdminSidebar from '../../components/layout/admin/AdminSidebar';

// Importa todos los componentes de dashboard
import MockDataDemo from '../../components/demo/MockDataDemo'; // Usaremos este como 'Inicio'
import UsuariosDashboard from '../../components/layout/admin/dashboards/UsuariosDashboard';
import DesignsDashboard from '../../components/layout/admin/dashboards/DesignsDashboard';
import ProveedoresDashboard from '../../components/layout/admin/dashboards/ProveedoresDashboard';
import SolicitudesProveedorDashboard from '../../components/layout/admin/dashboards/SolicitudesProveedorDashboard';
import PedidosDashboard from '../../components/layout/admin/dashboards/PedidosDashboard';
import VentasDashboard from '../../components/layout/admin/dashboards/VentasDashboard';
import PagosDashboard from '../../components/layout/admin/dashboards/PagosDashboard';

// Mapa de componentes para un renderizado limpio
const dashboardComponents = {
  inicio: <MockDataDemo />, // El dashboard de inicio puede ser tu demo o un resumen
  usuarios: <UsuariosDashboard />,
  designs: <DesignsDashboard />,
  proveedores: <ProveedoresDashboard />,
  solicitudes: <SolicitudesProveedorDashboard />,
  pedidos: <PedidosDashboard />,
  ventas: <VentasDashboard />,
  pagos: <PagosDashboard />,
};

export default function AdminPage() {
  const [activeDashboard, setActiveDashboard] = useState('inicio');

  console.log('AdminPage: activeDashboard is', activeDashboard);

  const handleSelectDashboard = (dashboardId) => {
    console.log('AdminPage: Setting active dashboard to', dashboardId);
    setActiveDashboard(dashboardId);
  };

  const CurrentDashboard = dashboardComponents[activeDashboard] || <p>Dashboard no encontrado.</p>;

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar
        activeDashboard={activeDashboard}
        onSelectDashboard={handleSelectDashboard}
      />
      <main className="flex-1 p-6 overflow-y-auto">
        {CurrentDashboard}
      </main>
    </div>
  );
}
