"use client"; // Required for onClick events
import Link from 'next/link'
import IconoPersona from '../../common/iconos/IconoPersona'
import { signOut } from "next-auth/react"

function HeaderPrincipal({ session }) {

    console.log(session);

    const user = session?.user;

    return (
        <div>
            
            <header className='bg-black flex flex-row justify-between items-center p-4 top-0 fixed w-full h-16 z-50'>
                <h1 className='font-bold text-3xl hover:text-white transition-colors duration-500 text-pink-400'>BLACK NOISE</h1>
                <div className='flex flex-row items-center gap-4'>
                    {user ? (
                        <>
                            <Link href="/" className='flex flex-row items-center justify-center gap-2 text-white '>
                                ¡Bienvenido {user?.name}!
                                <IconoPersona />
                            </Link>
                            <button 
                                onClick={() => signOut({ callbackUrl: '/login' })} 
                                className='bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300'
                            >
                                Cerrar Sesión
                            </button>
                        </>
                    ) : (
                        <Link href="/login" className='bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300'>
                            Iniciar Sesión
                        </Link>
                    )}
                </div>
            </header>
        </div>
    )
}

export default HeaderPrincipal
