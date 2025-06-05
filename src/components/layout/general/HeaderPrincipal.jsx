"use client"; // Required for onClick events
<<<<<<< HEAD
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import IconoPersona from '../../common/iconos/IconoPersona';
import BotonGeneral from '../../common/botones/BotonGeneral';
// Removed useEffect, useState, and ObtenerUsuarioPorId imports
// Removed fullUserData, loadingUser, userError state
// Removed useEffect for fetching user data

function HeaderPrincipal() {
    const { data: session } = useSession();
    // Removed user variable using fullUserData

    return (
        <div>
            <header className='bg-black flex flex-row justify-between items-center p-10 top-0 fixed w-full h-16 z-50'> {/* Reverted flex-col to flex-row and h-auto to h-16 */}
                <h1 className='font-bold text-3xl hover:text-white transition-colors duration-500 text-pink-400'>BLACK NOISE</h1>
                <div className='flex flex-row items-center gap-4'>
                    {/* Shopping Cart Link */}
                    <Link href="/carrito">
                        {/* Placeholder for Shopping Cart Icon */}
                        <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white">
                            🛒 {/* Placeholder Icon */}
                        </div>
                    </Link>
                    {session ? (
                        <>
                            <div className='flex flex-row items-center justify-center gap-4'>
                                {/* User Info in Header (Basic) */}
                                <span className='text-white'>¡Bienvenido {session.user?.name}!</span> {/* Reverted to basic welcome */}
                                <Link href="/perfil">
                                    <div className="w-8 h-8 rounded-full overflow-hidden">
                                        <img
                                            src={session.user?.image || "/img/perfil/FotoPerfil.webp"} // Use session user image
                                            alt="Foto de perfil"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </Link>
                            </div>
                            <BotonGeneral onClick={() => signOut({ callbackUrl: '/login' })}>
                                Cerrar Sesión
                            </BotonGeneral>
                        </>
=======

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useSimulatedSession } from '@/hooks/useSimulatedSession'; // Use simulated session
import { useState, useEffect, useRef } from 'react'; // Import useState, useEffect, useRef
import IconoPersona from '../../common/iconos/IconoPersona';
import BotonGeneral from '../../common/botones/BotonGeneral';

function HeaderPrincipal() {
    const { data: session } = useSimulatedSession(); // Use simulated session
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
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d
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

<<<<<<< HEAD
export default HeaderPrincipal
=======
export default HeaderPrincipal;
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d
