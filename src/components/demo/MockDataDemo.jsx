"use client";

import { useMockData } from '@/hooks/useMockData';
import { useState } from 'react';

/**
 * Componente de demostración para mostrar cómo usar los datos mock
 * Este componente puede ser incluido en cualquier página para ver datos de prueba
 */
const MockDataDemo = () => {
  const mockData = useMockData();
  const [activeTab, setActiveTab] = useState('usuarios');

  if (!mockData.isMockMode()) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
        <p className="text-sm">
          🎭 Modo de datos de prueba desactivado. 
          <button 
            onClick={mockData.toggleMockMode}
            className="ml-2 underline hover:no-underline"
          >
            Activar datos de prueba
          </button>
        </p>
      </div>
    );
  }

  const tabs = [
    { id: 'usuarios', label: 'Usuarios', count: mockData.usuarios.count() },
    { id: 'designs', label: 'Diseños', count: mockData.designs.count() },
    { id: 'proveedores', label: 'Proveedores', count: mockData.proveedores.count() },
    { id: 'pedidos', label: 'Pedidos', count: mockData.pedidos.count() },
    { id: 'ventas', label: 'Ventas', count: mockData.ventas.count() },
    { id: 'dashboard', label: 'Dashboard', count: null }
  ];

  const renderUsuarios = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800">Total Usuarios</h4>
          <p className="text-2xl font-bold text-blue-600">{mockData.usuarios.count()}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800">Habilitados</h4>
          <p className="text-2xl font-bold text-green-600">{mockData.usuarios.getHabilitados().length}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold text-purple-800">Proveedores</h4>
          <p className="text-2xl font-bold text-purple-600">{mockData.usuarios.getByRol('PROVEEDOR').length}</p>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Nombre</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Rol</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockData.usuarios.getAll().slice(0, 5).map((usuario) => (
              <tr key={usuario._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm">
                  {usuario.primerNombre} {usuario.primerApellido}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">{usuario.correo}</td>
                <td className="px-4 py-2 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    usuario.rol === 'ADMINISTRADOR' ? 'bg-red-100 text-red-800' :
                    usuario.rol === 'PROVEEDOR' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {usuario.rol}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    usuario.habilitado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {usuario.habilitado ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDesigns = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold text-purple-800">Total Diseños</h4>
          <p className="text-2xl font-bold text-purple-600">{mockData.designs.count()}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800">Públicos</h4>
          <p className="text-2xl font-bold text-green-600">{mockData.designs.getPublicos().length}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-semibold text-yellow-800">Más Popular</h4>
          <p className="text-2xl font-bold text-yellow-600">
            {Math.max(...mockData.designs.getAll().map(d => d.likes))} ❤️
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockData.designs.getPopulares(6).map((design) => (
          <div key={design._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <img 
              src={design.imagenDesing} 
              alt={design.nombreDesing}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 truncate">{design.nombreDesing}</h3>
              <p className="text-sm text-gray-600 mb-2">{design.categoria}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-green-600">
                  ${design.valorDesing.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500 flex items-center">
                  ❤️ {design.likes}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {design.palabrasClave.slice(0, 3).map((keyword, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-xs rounded">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProveedores = () => {
    const estadisticas = mockData.proveedores.getEstadisticas();
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800">Total Proveedores</h4>
            <p className="text-2xl font-bold text-blue-600">{estadisticas.totalProveedores}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800">Calificación Promedio</h4>
            <p className="text-2xl font-bold text-green-600">{estadisticas.promedioCalificacion} ⭐</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-800">Pedidos Completados</h4>
            <p className="text-2xl font-bold text-purple-600">{estadisticas.totalPedidosCompletados}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-semibold text-orange-800">Capacidad Total</h4>
            <p className="text-2xl font-bold text-orange-600">{estadisticas.capacidadTotalProduccion}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockData.proveedores.getAll().map((proveedor) => (
            <div key={proveedor._id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-800">{proveedor.nombreEmpresa}</h3>
                  <p className="text-sm text-gray-600">{proveedor.categoria}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-yellow-500">
                    <span className="text-sm font-medium">{proveedor.calificacion}</span>
                    <span className="ml-1">⭐</span>
                  </div>
                  <p className="text-xs text-gray-500">{proveedor.pedidosCompletados} pedidos</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{proveedor.descripcionEmpresa}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Capacidad:</span>
                  <span className="ml-2 font-medium">{proveedor.capacidadProduccion}/mes</span>
                </div>
                <div>
                  <span className="text-gray-500">Entrega:</span>
                  <span className="ml-2 font-medium">{proveedor.tiempoEntrega} días</span>
                </div>
                <div>
                  <span className="text-gray-500">Experiencia:</span>
                  <span className="ml-2 font-medium">{proveedor.experiencia} años</span>
                </div>
                <div>
                  <span className="text-gray-500">Certificaciones:</span>
                  <span className="ml-2 font-medium">{proveedor.certificaciones.length}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDashboard = () => {
    const resumen = mockData.dashboard.getResumenGeneral();
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-blue-600">{resumen.totalUsuarios}</p>
            <p className="text-sm text-blue-800">Usuarios</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-purple-600">{resumen.totalDesigns}</p>
            <p className="text-sm text-purple-800">Diseños</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-600">{resumen.totalProveedores}</p>
            <p className="text-sm text-green-800">Proveedores</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-orange-600">{resumen.totalPedidos}</p>
            <p className="text-sm text-orange-800">Pedidos</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-yellow-600">{resumen.totalVentas}</p>
            <p className="text-sm text-yellow-800">Ventas</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-red-600">{resumen.totalPagos}</p>
            <p className="text-sm text-red-800">Pagos</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4">Diseños Populares</h3>
            <div className="space-y-3">
              {resumen.designsPopulares.map((design) => (
                <div key={design._id} className="flex items-center space-x-3">
                  <img 
                    src={design.imagenDesing} 
                    alt={design.nombreDesing}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{design.nombreDesing}</p>
                    <p className="text-xs text-gray-500">{design.likes} likes • ${design.valorDesing.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4">Pedidos Recientes</h3>
            <div className="space-y-3">
              {resumen.pedidosRecientes.map((pedido) => (
                <div key={pedido._id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">Pedido #{pedido._id.slice(-6)}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(pedido.fechaRealizacion).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">${pedido.valorPedido.toLocaleString()}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      pedido.estadoPedido === 'COMPLETADO' ? 'bg-green-100 text-green-800' :
                      pedido.estadoPedido === 'EN_PRODUCCION' ? 'bg-blue-100 text-blue-800' :
                      pedido.estadoPedido === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {pedido.estadoPedido}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'usuarios': return renderUsuarios();
      case 'designs': return renderDesigns();
      case 'proveedores': return renderProveedores();
      case 'pedidos': return <div className="text-gray-600">Vista de pedidos pendiente de implementar</div>;
      case 'ventas': return <div className="text-gray-600">Vista de ventas pendiente de implementar</div>;
      case 'dashboard': return renderDashboard();
      default: return renderDashboard();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">🎭 Datos de Prueba Activos</h2>
            <p className="text-purple-100">Visualiza el aspecto de tu aplicación con datos realistas</p>
          </div>
          <button 
            onClick={mockData.toggleMockMode}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors"
          >
            Desactivar
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.count !== null && (
                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="min-h-96">
        {renderContent()}
      </div>
    </div>
  );
};

export default MockDataDemo;
