import HeaderAdminDashboard from "./AdminHeader"

function AdminPage({ children }) {
    return (
       <div className='flex flex-col justify-center w-screen  bg-gray-200 '>

            <HeaderAdminDashboard >
                <a href="/admin" className="flex items-center text-white hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Volver
                </a>
            </HeaderAdminDashboard>

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