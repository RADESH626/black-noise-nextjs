"use client";

import Link from 'next/link';
import Image from 'next/image';

function AdminSidebar({ activeDashboard, onSelectDashboard }) {
  const navItems = [
    { id: 'inicio', label: 'Inicio', icon: '/icons/icono-casa.svg', needsInvert: true },
    { id: 'usuarios', label: 'Usuarios', icon: '/icons/icono-persona.svg', needsInvert: true },
    { id: 'designs', label: 'Diseños', icon: '/icons/icono-editar.svg' },
    { id: 'proveedores', label: 'Proveedores', icon: '/icons/icono-persona+.svg', needsInvert: true },
    { id: 'solicitudes', label: 'Solicitudes', icon: '/icons/icono-enviar-correo.svg' },
    { id: 'pedidos', label: 'Pedidos', icon: '/icons/icono-carrito.svg', needsInvert: true },
    { id: 'ventas', label: 'Ventas', icon: '/icons/icono-bolsa.svg', needsInvert: true },
    { id: 'pagos', label: 'Pagos', icon: '/icons/icono-paypal.svg' }
  ];

  return (
    <aside className="w-64 bg-black text-white flex flex-col p-4 shadow-lg">
      <div className="mb-8 text-center">
        <button onClick={() => onSelectDashboard('inicio')} className="text-2xl font-bold text-white hover:text-pink-400 transition-colors">
          BLACK NOISE
        </button>
        <p className="text-xs text-gray-400">Panel de Administrador</p>
      </div>
      <nav className="flex-grow">
        <ul>
          {navItems.map((item) => {
            const isActive = activeDashboard === item.id;
            return (
              <li key={item.id} className="mb-3">
                <button
                  onClick={() => {
                    console.log('AdminSidebar: Button clicked for', item.id);
                    onSelectDashboard(item.id);
                  }}
                  className={`flex items-center p-3 rounded-lg transition-all duration-200 w-full text-left ${
                    isActive
                      ? 'bg-pink-500 text-white shadow-md'
                      : 'hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={20}
                    height={20}
                    className={`mr-3 ${item.needsInvert && !isActive ? 'filter invert' : ''} ${isActive ? '' : 'filter invert'}`}
                  />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
       <div className="mt-auto">
        <Link
          href="/"
          className="flex items-center p-3 hover:bg-gray-700 rounded-md transition-colors w-full text-left"
        >
          <Image src="/icons/icono-salida.svg" alt="Salir" width={20} height={20} className="mr-3 filter invert" />
          <span>Volver al Inicio</span>
        </Link>
      </div>
    </aside>
  );
}

export default AdminSidebar;
