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

    if (!session || session.user?.role !== 'ADMINISTRADOR') {
      router.push('/login');
      return;
    }

    setLoading(false);
  }, [session, status, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
              <p className="text-gray-600 mt-1">Bienvenido, {session?.user?.name || 'Administrador'}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                {session?.user?.role}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">👥</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Gestión de Usuarios
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      Administrar usuarios del sistema
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <a href="/admin/usuarios" className="font-medium text-blue-600 hover:text-blue-500">
                  Ver todos los usuarios
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">🎨</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Gestión de Diseños
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      Administrar catálogo de diseños
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <a href="/admin/designs" className="font-medium text-purple-600 hover:text-purple-500">
                  Ver diseños
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">🏢</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Gestión de Proveedores
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      Administrar red de proveedores
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <a href="/admin/proveedores" className="font-medium text-green-600 hover:text-green-500">
                  Ver proveedores
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">📦</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Gestión de Pedidos
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      Seguimiento de pedidos
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <a href="/admin/pedidos" className="font-medium text-orange-600 hover:text-orange-500">
                  Ver pedidos
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Mock Data Demo Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="border-l-4 border-blue-500 pl-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Vista Previa con Datos de Prueba</h2>
            <p className="text-gray-600 mt-1">
              Esta sección muestra cómo se verán las diferentes partes de la aplicación con datos realistas.
              Útil para desarrollo y diseño de la interfaz.
            </p>
          </div>
          
          <MockDataDemo />
        </div>

        {/* Additional Admin Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
            <div className="space-y-3">
              <a 
                href="/admin/usuarios/agregar" 
                className="block w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-blue-600 mr-3">➕</span>
                  <div>
                    <p className="font-medium text-blue-900">Agregar Usuario</p>
                    <p className="text-sm text-blue-600">Crear nuevo usuario del sistema</p>
                  </div>
                </div>
              </a>
              
              <a 
                href="/admin/designs/agregar" 
                className="block w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-purple-600 mr-3">🎨</span>
                  <div>
                    <p className="font-medium text-purple-900">Nuevo Diseño</p>
                    <p className="text-sm text-purple-600">Agregar diseño al catálogo</p>
                  </div>
                </div>
              </a>
              
              <a 
                href="/admin/proveedores/agregar" 
                className="block w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-green-600 mr-3">🏢</span>
                  <div>
                    <p className="font-medium text-green-900">Registrar Proveedor</p>
                    <p className="text-sm text-green-600">Agregar nuevo proveedor</p>
                  </div>
                </div>
              </a>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reportes y Análisis</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Reporte de Ventas</p>
                  <p className="text-sm text-gray-600">Análisis de ventas mensual</p>
                </div>
                <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                  Generar
                </button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Reporte de Usuarios</p>
                  <p className="text-sm text-gray-600">Estadísticas de usuarios</p>
                </div>
                <button className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700">
                  Generar
                </button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Reporte de Proveedores</p>
                  <p className="text-sm text-gray-600">Performance de proveedores</p>
                </div>
                <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
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
