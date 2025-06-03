"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import MockDataDemo from '@/components/demo/MockDataDemo';

/**
 * Dashboard principal del administrador
 * Incluye demostración de datos mock para desarrollo visual
 */
export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || session.user?.rol !== 'ADMINISTRADOR') {
      router.push('/login');
      return;
    }

    setLoading(false);
  }, [session, status, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(to bottom, #000000, #000000FF, #000000)' }}>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: 'linear-gradient(to bottom, #000000, #000000FF, #000000)',
        color: '#FFFFFF',
      }}
    >
      {/* Header */}
      <div className="bg-[#1C1C1C] shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard Administrativo</h1>
              <p className="text-gray-300 mt-1">Bienvenido, {session?.user?.name || 'Administrador'}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-purple-800 text-white px-3 py-1 rounded-full text-sm font-medium">
                {session?.user?.rol}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Usuarios */}
          <div className="bg-[#1E1E1E] overflow-hidden shadow rounded-lg border border-gray-700">
            <div className="p-5">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">👥</span>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-400 truncate">Gestión de Usuarios</p>
                  <p className="text-lg font-medium text-white">Administrar usuarios del sistema</p>
                </div>
              </div>
            </div>
            <div className="bg-[#2A2A2A] px-5 py-3">
              <a href="/admin/usuarios" className="text-sm font-medium text-blue-400 hover:text-blue-300">
                Ver todos los usuarios
              </a>
            </div>
          </div>

          {/* Diseños */}
          <div className="bg-[#1E1E1E] overflow-hidden shadow rounded-lg border border-gray-700">
            <div className="p-5">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">🎨</span>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-400 truncate">Gestión de Diseños</p>
                  <p className="text-lg font-medium text-white">Administrar catálogo de diseños</p>
                </div>
              </div>
            </div>
            <div className="bg-[#2A2A2A] px-5 py-3">
              <a href="/admin/designs" className="text-sm font-medium text-purple-400 hover:text-purple-300">
                Ver diseños
              </a>
            </div>
          </div>

          {/* Proveedores */}
          <div className="bg-[#1E1E1E] overflow-hidden shadow rounded-lg border border-gray-700">
            <div className="p-5">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">🏢</span>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-400 truncate">Gestión de Proveedores</p>
                  <p className="text-lg font-medium text-white">Administrar red de proveedores</p>
                </div>
              </div>
            </div>
            <div className="bg-[#2A2A2A] px-5 py-3">
              <a href="/admin/proveedores" className="text-sm font-medium text-green-400 hover:text-green-300">
                Ver proveedores
              </a>
            </div>
          </div>

          {/* Pedidos */}
          <div className="bg-[#1E1E1E] overflow-hidden shadow rounded-lg border border-gray-700">
            <div className="p-5">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">📦</span>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-400 truncate">Gestión de Pedidos</p>
                  <p className="text-lg font-medium text-white">Seguimiento de pedidos</p>
                </div>
              </div>
            </div>
            <div className="bg-[#2A2A2A] px-5 py-3">
              <a href="/admin/pedidos" className="text-sm font-medium text-orange-400 hover:text-orange-300">
                Ver pedidos
              </a>
            </div>
          </div>
        </div>

        {/* Mock Data Demo Section */}
        <div className="bg-[#1E1E1E] rounded-lg shadow-sm border border-gray-700 p-6 mb-8">
          <div className="border-l-4 border-blue-500 pl-4 mb-6">
            <h2 className="text-xl font-semibold text-white">Vista Previa con Datos de Prueba</h2>
            <p className="text-gray-400 mt-1">
              Esta sección muestra cómo se verán las diferentes partes de la aplicación con datos realistas.
              Útil para desarrollo y diseño de la interfaz.
            </p>
          </div>
          <MockDataDemo />
        </div>

        {/* Additional Admin Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Acciones rápidas */}
          <div className="bg-[#1E1E1E] rounded-lg shadow-sm border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Acciones Rápidas</h3>
            <div className="space-y-3">
              <a
                href="/admin/usuarios/agregar"
                className="block px-4 py-3 bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-blue-300 mr-3">➕</span>
                  <div>
                    <p className="font-medium text-white">Agregar Usuario</p>
                    <p className="text-sm text-blue-300">Crear nuevo usuario del sistema</p>
                  </div>
                </div>
              </a>

              <a
                href="/admin/designs/agregar"
                className="block px-4 py-3 bg-purple-900 hover:bg-purple-800 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-purple-300 mr-3">🎨</span>
                  <div>
                    <p className="font-medium text-white">Nuevo Diseño</p>
                    <p className="text-sm text-purple-300">Agregar diseño al catálogo</p>
                  </div>
                </div>
              </a>

              <a
                href="/admin/proveedores/agregar"
                className="block px-4 py-3 bg-green-900 hover:bg-green-800 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-green-300 mr-3">🏢</span>
                  <div>
                    <p className="font-medium text-white">Registrar Proveedor</p>
                    <p className="text-sm text-green-300">Agregar nuevo proveedor</p>
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Reportes */}
          <div className="bg-[#1E1E1E] rounded-lg shadow-sm border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Reportes y Análisis</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-[#2A2A2A] rounded-lg">
                <div>
                  <p className="font-medium text-white">Reporte de Ventas</p>
                  <p className="text-sm text-gray-400">Análisis de ventas mensual</p>
                </div>
                <button className="bg-blue-700 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                  Generar
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#2A2A2A] rounded-lg">
                <div>
                  <p className="font-medium text-white">Reporte de Usuarios</p>
                  <p className="text-sm text-gray-400">Estadísticas de usuarios</p>
                </div>
                <button className="bg-purple-700 text-white px-3 py-1 rounded text-sm hover:bg-purple-600">
                  Generar
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#2A2A2A] rounded-lg">
                <div>
                  <p className="font-medium text-white">Reporte de Proveedores</p>
                  <p className="text-sm text-gray-400">Performance de proveedores</p>
                </div>
                <button className="bg-green-700 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
                  Generar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
