import HeaderAdminDashboard from "./AdminHeader"

function AdminPage({ children }) {
    return (
       <div className='flex flex-col justify-center w-screen  bg-gray-200 '>

            <HeaderAdminDashboard />

            <div className="flex flex-col items-center justify-center  h-full   p-4 ">

                <h1 className='font-bold text-3xl text-black' >Bienvenido Administrador</h1>

            </div>

            <div className="flex flex-col items-center justify-center  h-full   p-4 ">

                {children}

            </div >
        </div >
    )
}

export default AdminPage