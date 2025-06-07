"use client"; // Required for onClick events

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react'; // Import useState, useEffect, useRef
import IconoPersona from '../../common/iconos/IconoPersona';
import BotonGeneral from '../../common/botones/BotonGeneral';

function HeaderPrincipal() {
    const { data: session } = useSession();

    
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown visibility
    const dropdownRef = useRef(null); // Ref for dropdown element

    const handleUserIconClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div>
            <header className='flex flex-row justify-between items-center p-10 top-0 fixed w-full h-16 z-50' style={{ backgroundColor: '#000000' }}>
                <h1 className='font-bold text-3xl hover:text-white transition-colors duration-500' style={{ color: '#FFFFFFFF' }}>
                    BLACK NOISE
                </h1>
                <div className='flex flex-row items-center gap-4'>
                    {/* Shopping Cart Link */}
                    <Link href="/carrito">
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                            style={{ backgroundColor: '#6b7280' }} // gray-500
                        >
                            🛒
                        </div>
                    </Link>

                    {session ? (
                        <div className='relative flex flex-row items-center justify-center gap-4' ref={dropdownRef}>
                            <span className='text-white'>
                                ¡Bienvenido {session.user?.name}!
                            </span>
                            {/* User Icon to trigger dropdown */}
                            <div
                                className="w-8 h-8 rounded-full overflow-hidden cursor-pointer"
                                onClick={handleUserIconClick}
                            >
                                <img
                                    src={session.user?.image || "/img/perfil/FotoPerfil.webp"}
                                    alt="Foto de perfil"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-20 top-full">
                                    <Link href="/perfil" className="block px-4 py-2 text-sm text-white hover:bg-gray-700" onClick={() => setIsDropdownOpen(false)}>
                                        Ver Perfil
                                    </Link>
                                    <button
                                        onClick={() => { signOut({ callbackUrl: '/login' }); setIsDropdownOpen(false); }}
                                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                                    >
                                        Cerrar Sesión
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link href="/login">
                            <BotonGeneral>
                                Iniciar Sesión
                            </BotonGeneral>
                        </Link>
                    )}
                </div>
            </header>
        </div>
    );
}

export default HeaderPrincipal;
