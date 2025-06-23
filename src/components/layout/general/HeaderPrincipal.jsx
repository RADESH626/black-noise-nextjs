"use client";
import Link from 'next/link';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';

// Importa tus componentes personalizados
import BotonIniciarSesion from '@/components/common/botones/BotonIniciarSesion';
import CartModal from '@/components/carrito/CartModal';
import PendingPaymentsSummary from '@/components/common/PendingPaymentsSummary';

export default function HeaderPrincipal() {
    // --- HOOKS Y ESTADO ---
    const { data: session } = useSession();
    const { cartItems, fetchCart, removeItem, cartError } = useCart();
    
    // Estados para la lógica visual (del Código 2)
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Estados para la funcionalidad del usuario (del Código 1)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showCartModal, setShowCartModal] = useState(false);
    const dropdownRef = useRef(null);

    // Variable derivada para simplificar la lógica de estilo
    const headerConFondo = isScrolled || isHovered;

    // --- EFECTOS ---
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // --- HANDLERS ---
    const handleUserIconClick = () => setIsDropdownOpen(!isDropdownOpen);
    const handleCartIconClick = async () => {
        // Solo cargar el carrito si el modal se va a abrir y no hay ítems cargados o hay un error de carga
        if (!showCartModal && (cartItems.length === 0 || cartError)) {
            await fetchCart();
        }
        setShowCartModal(!showCartModal);
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 py-4 px-6 transition-all duration-300 justify-between  ${
                headerConFondo ? 'bg-white shadow-md' : 'bg-transparent'
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex justify-between items-center">
                {/* Logo con animación y color dinámico */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                    <Link href="/" className={`text-2xl font-bold transition-colors duration-300 ${
                        headerConFondo ? 'text-black' : 'text-white'
                    }`}>
                        BLACK NOISE
                    </Link>
                </motion.div>

                {/* Contenido derecho: cambia según la sesión */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                    <div className='flex items-center gap-5'>
                        {session ? (
                            // --- VISTA PARA USUARIO AUTENTICADO ---
                            <>
                                <PendingPaymentsSummary headerConFondo={headerConFondo} />

                                {/* Icono del Carrito */}
                                <div className="relative cursor-pointer" onClick={handleCartIconClick}>
                                    {/* Cambia el color del ícono. Asume que tienes dos versiones o usas filter de CSS */}
                                    <Image
                                        src={"/icons/icono-carrito.svg"}
                                        alt="Carrito" width={28} height={28}
                                        className={`transition-transform duration-300 ${headerConFondo ? 'filter invert' : ''}`}
                                    />
                                    {cartItems.length > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {cartItems.length}
                                        </span>
                                    )}
                                    <CartModal cartItems={cartItems} onClose={() => setShowCartModal(false)} isOpen={showCartModal} onRemoveItem={removeItem} />
                                </div>

                                {/* Menú de Usuario */}
                                <div className='relative' ref={dropdownRef}>
                                    <img
                                        src={session.user?.image || "/img/perfil/FotoPerfil.webp"}
                                        alt="Foto de perfil"
                                        className="w-9 h-9 rounded-full object-cover cursor-pointer"
                                        onClick={handleUserIconClick}
                                    />
                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-3 w-48 bg-white rounded-md shadow-lg py-1 z-20 border">
                                            <div className='px-4 py-2 border-b'>
                                                <p className='text-sm font-medium text-gray-900'>Hola, {session.user.name}</p>
                                            </div>
                                            <Link href="/perfil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>
                                                Ver Perfil
                                            </Link>
                                            <button
                                                onClick={() => { signOut({ callbackUrl: '/' }); setIsDropdownOpen(false); }}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Cerrar Sesión
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            // --- VISTA PARA INVITADO ---
                            <BotonIniciarSesion isDarkMode={!headerConFondo} />
                        )}
                    </div>
                </motion.div>
            </div>
        </header>
    );
}
