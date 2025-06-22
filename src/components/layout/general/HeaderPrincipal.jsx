"use client";
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import IconoPersona from '@/components/common/iconos/IconoPersona';
import BotonGeneral from '@/components/common/botones/BotonGeneral';
import CartModal from '@/components/carrito/CartModal';
import { useCart } from '@/context/CartContext';
import PendingPaymentsSummary from '@/components/common/PendingPaymentsSummary';

function HeaderPrincipal() {
    const { data: session } = useSession();
    const { cartItems, fetchCart, removeItem } = useCart();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const [showCartModal, setShowCartModal] = useState(false);

    const handleUserIconClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
        setShowCartModal(false);
    };

    const handleCartIconClick = async () => {
        await fetchCart();
        setShowCartModal(!showCartModal);
        setIsDropdownOpen(false);
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

    // Animación de scroll para ocultar/aparecer header:
    const [showHeader, setShowHeader] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const controlHeader = () => {
        if (typeof window !== 'undefined') {
            if (window.scrollY > lastScrollY) {
                // Scrolling down
                setShowHeader(false);
            } else {
                // Scrolling up
                setShowHeader(true);
            }
            setLastScrollY(window.scrollY);
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', controlHeader);

            return () => {
                window.removeEventListener('scroll', controlHeader);
            };
        }
    }, [lastScrollY]);

    return (
        <div>
            <header
                className={`flex flex-row justify-between items-center p-10 top-0 fixed w-full h-16 z-50 transition-transform duration-500 ${
                    showHeader ? 'translate-y-0' : '-translate-y-full'
                }`}
                style={{ backgroundColor: '#000000FF' }}
            >
                <h1 className='font-bold text-3xl hover:text-white transition-colors duration-500' style={{ color: '#FFFFFFFF' }}>
                    BLACK NOISE
                </h1>

                <div className='flex flex-row items-center gap-4'>
                    {session && <PendingPaymentsSummary />}

                    {session && (
                        <div className="relative cursor-pointer" onClick={handleCartIconClick}>
                            <Image src="/icons/icono-carrito.svg" alt="Carrito" width={30} height={30} />
                            {cartItems.length > 0 && (
                                <span className="absolute -top-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartItems.length}
                                </span>
                            )}

                            <div className="absolute mt-2 top-full right-0 z-50 w-auto">
                                <CartModal
                                    cartItems={cartItems}
                                    onClose={() => setShowCartModal(false)}
                                    isOpen={showCartModal}
                                    onRemoveItem={removeItem}
                                />
                            </div>
                        </div>
                    )}

                    {session ? (
                        <div className='relative flex flex-row items-center justify-center gap-4' ref={dropdownRef}>
                            <span className='text-white'>
                                ¡Bienvenido {session?.user?.name || session?.user?.email || 'Usuario'}!
                            </span>
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