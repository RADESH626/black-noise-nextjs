"use client";

import { useAdminDashboard } from '../../context/AdminDashboardContext';

// Importa todos los componentes de dashboard
import UsuariosDashboard from '../../components/layout/admin/dashboards/UsuariosDashboard';
import DesignsDashboard from '../../components/layout/admin/dashboards/DesignsDashboard';
import GestionProveedoresDashboard from '../../components/layout/admin/dashboards/GestionProveedoresDashboard';
import PedidosDashboard from '../../components/layout/admin/dashboards/PedidosDashboard';
import VentasDashboard from '../../components/layout/admin/dashboards/VentasDashboard';
import PagosDashboard from '../../components/layout/admin/dashboards/PagosDashboard';

// Mapa de componentes para un renderizado limpio
const dashboardComponents = {
  usuarios: <UsuariosDashboard />,
  designs: <DesignsDashboard />,
  proveedores: <GestionProveedoresDashboard />,
  pedidos: <PedidosDashboard />,
  ventas: <VentasDashboard />,
  pagos: <PagosDashboard />,
};

export default function AdminPage() {
  const { activeDashboard } = useAdminDashboard();

  console.log('AdminPage: activeDashboard is', activeDashboard);

  const CurrentDashboard = dashboardComponents[activeDashboard] || <p>Dashboard no encontrado.</p>;

  return (
    <>
      {CurrentDashboard}
    </>
  );
}
