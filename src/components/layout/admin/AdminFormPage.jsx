function AdminFormPage({ children }) {
    return (
        <div className='flex flex-col justify-center w-screen  bg-white text-white '>

            <div className="flex flex-col items-center justify-center  h-full   p-4 ">

                <div className="flex flex-col items-center justify-center  h-full   p-4 ">

                    <div className=" flex  flex-col justify-center items-center p-10 bg-black flex-1 bg-black rounded  rounded-2xl">

                        {children}

                    </div>

                </div >

            </div>


        </div >
    )
}

export default AdminFormPage