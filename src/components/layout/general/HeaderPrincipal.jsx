"use client"; // Required for onClick events

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import IconoPersona from '../../common/iconos/IconoPersona';
import BotonGeneral from '../../common/botones/BotonGeneral';
// Removed useEffect, useState, and ObtenerUsuarioPorId imports
// Removed fullUserData, loadingUser, userError state
// Removed useEffect for fetching user data

function HeaderPrincipal() {
    const { data: session } = useSession();

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
                        <>
                            <div className='flex flex-row items-center justify-center gap-4'>
                                <span className='text-white'>
                                    ¡Bienvenido {session.user?.name}!
                                </span>
                                <Link href="/perfil">
                                    <div className="w-8 h-8 rounded-full overflow-hidden">
                                        <img
                                            src={session.user?.image || "/img/perfil/FotoPerfil.webp"}
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
