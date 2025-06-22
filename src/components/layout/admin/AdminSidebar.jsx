"use client";

import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // Import useRouter
import BotonGeneral from '@/components/common/botones/BotonGeneral';

function AdminSidebar() { // Remove activeDashboard, onSelectDashboard props
  const router = useRouter(); // Initialize useRouter

  const navItems = [
    { id: 'inicio', label: 'Inicio', icon: '/icons/icono-casa.svg', needsInvert: true, href: '/admin' }, // Link to /admin for home
    { id: 'usuarios', label: 'Usuarios', icon: '/icons/icono-persona.svg', needsInvert: true, href: '/admin/users' }, // Assuming /admin/users for users
    { id: 'designs', label: 'Diseños', icon: '/icons/icono-editar.svg', href: '/admin/designs' }, // Assuming /admin/designs for designs
    { id: 'proveedores', label: 'Proveedores', icon: '/icons/icono-persona+.svg', needsInvert: true, href: '/admin/proveedores' }, // Link to /admin/proveedores
    { id: 'pedidos', label: 'Pedidos', icon: '/icons/icono-carrito.svg', needsInvert: true, href: '/admin/pedidos' }, // Assuming /admin/pedidos for orders
    { id: 'ventas', label: 'Ventas', icon: '/icons/icono-bolsa.svg', needsInvert: true, href: '/admin/ventas' }, // Assuming /admin/ventas for sales
<<<<<<< HEAD
    { id: 'pagos', label: 'Pagos', icon: '/icons/icono-paypal.svg', href: '/admin/pagos' }, // Assuming /admin/pagos for payments
    { id: 'devoluciones', label: 'Devoluciones', icon: '/icons/icono-basurero.svg', needsInvert: true, href: '/admin/devoluciones' } // Link to /admin/devoluciones
=======
    { id: 'pagos', label: 'Pagos', icon: '/icons/icono-paypal.svg', href: '/admin/pagos' } // Assuming /admin/pagos for payments
>>>>>>> f416d78 (pantalla de carga)
  ];

  return (
    <aside className="w-64 bg-black text-white flex flex-col p-4 shadow-lg">
      <div className="mb-8 text-center">
        <Link href="/admin" className="text-2xl font-bold text-white hover:text-pink-400 transition-colors"> {/* Use Link for home */}
          BLACK NOISE
        </Link>
        <p className="text-xs text-gray-400">Panel de Administrador</p>
        
      </div>
      <nav className="flex-grow">
        <ul>
          {navItems.map((item) => {
            const isActive = router.pathname === item.href; // Check router.pathname for active state
            return (
              <li key={item.id} className="mb-3">
                <Link
                  href={item.href} // Use href for navigation
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
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
       <div className="mt-auto">
        <BotonGeneral
          onClick={() => signOut({ callbackUrl: '/login' })} // Redirect to login page after logout
          variant="secondary"
          className="flex items-center justify-center w-full text-left"
        >
          <Image src="/icons/icono-salida.svg" alt="Cerrar Sesión" width={20} height={20} className="mr-3 filter invert" />
          <span>Cerrar Sesión</span>
        </BotonGeneral>
      </div>
    </aside>
  );
}

export default AdminSidebar;
