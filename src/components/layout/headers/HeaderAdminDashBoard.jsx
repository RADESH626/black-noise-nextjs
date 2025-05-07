import Link from 'next/link'
import IconoPersona from '../../common/iconos/IconoPersona'

function HeaderAdminDashboard() {
    return (
        <header className=" flex flex-row items-center justify-between w-full h-full bg-black text-bn-secondary p-4 ">
            <h1 className='text-white'>Panel de Administrador </h1>
            <Link href='/login' className='text-white'>
               <IconoPersona />
            </Link>

        </header>
    )
}

export default HeaderAdminDashboard