"use client";

import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import BotonGeneral from '@/components/common/botones/BotonGeneral';

function ProveedorSidebar() {
  const router = useRouter();

  const navItems = [
    { id: 'inicio', label: 'Inicio', icon: '/icons/icono-casa.svg', needsInvert: true, href: '/proveedor' },
    { id: 'pedidos', label: 'Mis Pedidos Asignados', icon: '/icons/icono-carrito.svg', needsInvert: true, href: '/proveedor/pedidos' },
    { id: 'devoluciones', label: 'Devoluciones y Cancelaciones', icon: '/icons/icono-basurero.svg', needsInvert: true, href: '/proveedor/devoluciones' },
    { id: 'pagos', label: 'Pagos Recibidos', icon: '/icons/icono-dinero.svg', needsInvert: true, href: '/proveedor/pagos' }
  ];

  return (
    <aside className="w-64 bg-black text-white flex flex-col p-4 shadow-lg">
      <div className="mb-8 text-center">
        <Link href="/proveedor" className="text-2xl font-bold text-white hover:text-pink-400 transition-colors">
          BLACK NOISE
        </Link>
        <p className="text-xs text-gray-400">Panel de Proveedor</p>
      </div>
      <nav className="flex-grow">
        <ul>
          {navItems.map((item) => {
            const isActive = router.pathname === item.href;
            return (
              <li key={item.id} className="mb-3">
                <Link
                  href={item.href}
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
          onClick={() => signOut({ callbackUrl: '/login' })}
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

export default ProveedorSidebar;
