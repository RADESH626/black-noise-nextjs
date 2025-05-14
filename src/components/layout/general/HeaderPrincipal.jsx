import Link from 'next/link'
import IconoPersona from '../../common/iconos/IconoPersona'

function HeaderPrincipal({ session }) {

    console.log(session);

   const user = session?.user;

    return (
        <div>
            
            <header className='bg-black flex flex-column justify-between p-4 top-0 fixed w-full h-16 top-0 '>
                <h1 className='font-bold text-3xl hover:text-white transition-colors duration-500 text-pink-400'>BLACK NOISE</h1>
                <Link href="/" className='flex flex-row items-center justify-center gap-2 text-white '>
                    ¡Bienvenido {user?.name}!
                    <IconoPersona />
                </Link>
            </header>
        </div>
    )
}

export default HeaderPrincipal