import AdminLayout from '@/components/layout/admin/AdminLayout';

export default function AdminPage() {
  return (
    <AdminLayout>
      {/* Header Section */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Panel de Administración</h1>
        <p className="text-gray-600 mb-4">
          Bienvenido al panel de administración. Desde aquí podrás gestionar los diferentes aspectos de la plataforma.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Example Card - You can add more relevant cards here */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Estadísticas Rápidas</h2>
            <p className="text-gray-600">Próximamente: Resumen de ventas, usuarios registrados, etc.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Últimas Actividades</h2>
            <p className="text-gray-600">Próximamente: Registro de las acciones más recientes.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Accesos Directos</h2>
            <ul className="list-disc list-inside text-gray-600">
              <li><a href="/admin/ventas" className="text-blue-500 hover:underline">Gestionar Ventas</a></li>
              <li><a href="/admin/usuarios" className="text-blue-500 hover:underline">Gestionar Usuarios</a></li>
              <li><a href="/admin/productos" className="text-blue-500 hover:underline">Gestionar Productos (Elementos/Diseños)</a></li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
