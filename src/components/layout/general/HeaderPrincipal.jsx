"use client"; // Required for onClick events
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import IconoPersona from '../../common/iconos/IconoPersona';
import BotonGeneral from '../../common/botones/BotonGeneral';

function HeaderPrincipal() {
    const { data: session } = useSession();

    return (
        <div>
            <header className='bg-black flex flex-row justify-between items-center p-10 top-0 fixed w-full h-16 z-50'>
                <h1 className='font-bold text-3xl hover:text-white transition-colors duration-500 text-pink-400'>BLACK NOISE</h1>
                <div className='flex flex-row items-center gap-4'>
                    {session ? (
                        <>
                            <div className='flex flex-row items-center justify-center gap-4'>
                                <span className='text-white'>¡Bienvenido {session.user?.name}!</span>
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

export default HeaderPrincipal
