import Link from 'next/link';
import Image from 'next/image';

const AdminLayout = ({ children }) => {
  const navItems = [
    { href: '/admin', label: 'Inicio', icon: '/icons/icono-casa.svg' },
    { href: '/admin/designs', label: 'Diseños', icon: '/icons/file.svg' },
    { href: '/admin/pagos', label: 'Pagos', icon: '/icons/icono-mastercard.svg' },
    { href: '/admin/pedidos', label: 'Pedidos', icon: '/icons/icono-carrito.svg' },
    { href: '/admin/proveedores', label: 'Proveedores', icon: '/icons/icono persona.svg' },
    { href: '/admin/solicitudes-proveedor', label: 'Solicitudes Proveedor', icon: '/icons/icono-enviar-correo.svg' },
    { href: '/admin/usuarios', label: 'Usuarios', icon: '/icons/icono persona.svg' },
    { href: '/admin/ventas', label: 'Ventas', icon: '/icons/icono-bolsa.svg' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white flex flex-col p-4">
        <div className="mb-8 text-center">
          <Link href="/admin" className="text-2xl font-bold text-white">
            panel de administrador
          </Link>
        </div>
        <nav>
          <ul className='bg-black text-white flex flex-col'>
            {navItems.map((item) => (
              <li key={item.href} className="mb-3 text-black">
                <Link href={item.href} className="flex items-center p-2 hover:bg-gray-700 rounded-md transition-colors bg-white">
                  <Image src={item.icon} alt={item.label} width={24} height={24} className="mr-3 filter invert " />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto">
          <Link href="/logout" className="flex items-center p-2 hover:bg-gray-700 rounded-md transition-colors">
            <Image src="/icons/icono-salida.svg" alt="Cerrar Sesión" width={24} height={24} className="mr-3 filter invert" />
            <span>Cerrar Sesión</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
