import HeaderAdminDashboard from '../headers/HeaderAdminDashBoard'
import { IconoPersona } from '@/components/common/iconos'

function FormLayoutAdmin({ children }) {
    return (
        <div className='flex flex-col justify-center w-screen  bg-white text-white '>

            <HeaderAdminDashboard >

                <IconoPersona className="text-white" />

            </HeaderAdminDashboard>


            <div className="flex flex-col items-center justify-center  h-full   p-4 ">

                <div className="flex flex-col items-center justify-center  h-full   p-4 ">

                    <div className=" flex  flex-col justify-center items-center p-10 bg-black flex-1 bg-black rounded  rounded-2xl">

                        <h1 className='font-bold text-3xl text-white' >Bienvenido Administrador</h1>

                        {children}

                    </div>

                </div >

            </div>


        </div >
    )
}

export default FormLayoutAdmin