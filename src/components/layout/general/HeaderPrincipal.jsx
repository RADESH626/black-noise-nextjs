"use client"; // Required for onClick events

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image'; // Import Image for the cart icon
import IconoPersona from '@/components/common/iconos/IconoPersona';
import BotonGeneral from '@/components/common/botones/BotonGeneral';
import CartModal from '@/components/carrito/CartModal'; // Import CartModal
import { useCart } from '@/context/CartContext'; // Import useCart
import PendingPaymentsSummary from '@/components/common/PendingPaymentsSummary'; // Import PendingPaymentsSummary

function HeaderPrincipal() {
    const { data: session } = useSession();
    // console.log("Session object in HeaderPrincipal:", session);
    const { cartItems, fetchCart, removeItem } = useCart(); // Use cartItems, fetchCart, and removeItem from CartContext

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const [showCartModal, setShowCartModal] = useState(false); // State for cart modal visibility

    const handleUserIconClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
        setShowCartModal(false); // Close cart modal if user dropdown opens
    };

    const handleCartIconClick = async () => {
        await fetchCart(); // Fetch latest cart data when modal is opened
        setShowCartModal(!showCartModal);
        setIsDropdownOpen(false); // Close user dropdown if cart modal opens
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
        // No need for cartModalRef check, dialog handles outside clicks natively
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
                    {/* Pending Payments Icon */}
                    {session && <PendingPaymentsSummary />}

                    {/* Shopping Cart Icon */}
                    {session && (
                        <div className="relative cursor-pointer" onClick={handleCartIconClick}>
                            <Image src="/icons/icono-carrito.svg" alt="Carrito" width={30} height={30} />
                            {cartItems.length > 0 && (
                                <span className="absolute -top-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartItems.length}
                                </span>
                            )}

                            <div className="absolute mt-2 top-full right-0  z-50 w-auto ">

                                <CartModal cartItems={cartItems} onClose={() => setShowCartModal(false)} isOpen={showCartModal} onRemoveItem={removeItem} />

                            </div>
                        </div>
                    )}

                    {session ? (
                        <div className='relative flex flex-row items-center justify-center gap-4' ref={dropdownRef}>
                            <span className='text-white'>
                                ¡Bienvenido {session?.user?.name || session?.user?.email || 'Usuario'}!
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
