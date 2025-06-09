"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { signOut } from "next-auth/react";

export default function ProveedorSidebar({ activeDashboard, onSelectDashboard }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Mis Pedidos", href: "/proveedor/pedidos" },
    { name: "Editar Perfil", href: "/proveedor/editar-perfil" },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4 text-center border-b border-gray-700">
        <h2 className="text-xl font-semibold">Panel Proveedor</h2>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
              pathname === item.href
                ? "bg-gray-700 text-white"
                : "hover:bg-gray-700 hover:text-white"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
