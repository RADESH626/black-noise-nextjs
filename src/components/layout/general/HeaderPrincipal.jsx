import Link from 'next/link'
import IconoPersona from '../../common/iconos/IconoPersona'

function HeaderPrincipal({props,children}) {
    return (
        <header className='bg-black flex flex-column justify-between p-4 top-0 fixed w-full h-16 top-0 '>
            <h1 className='font-bold text-3xl hover:text-white transition-colors duration-500 text-pink-400'>BLACK NOISE</h1>
               <Link href="/" className='flex flex-row items-center justify-center gap-2'>
               <IconoPersona />
               </Link>
        </header>
    )
}

export default HeaderPrincipal