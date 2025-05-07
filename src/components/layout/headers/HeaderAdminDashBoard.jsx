
function HeaderAdminDashboard({ children }) {
    return (
        <header className=" flex flex-row items-center justify-between w-full h-full bg-black text-bn-secondary p-4 ">
            <h1 className='text-white'>Panel de Administrador </h1>
               {children}
        </header>
    )
}

export default HeaderAdminDashboard