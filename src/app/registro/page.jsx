import FormRegistro from "@/components/layout/forms/FormRegistro"

function registro() {
    return (

        <main className=' 
    min-h-screen
    flex
    items-center
    justify-center
    bg-gradient-to-br
    p-5 
    from-white
    to-pink-400
    '>

            <div className="w-full max-w-4xl bg-bn-dark rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] overflow-hidden">
                <div className="flex flex-col md:flex-row min-h-[600px]">

                    <div className="flex-1 p-6 md:p-10 bg-bn-dark">

                        <h2 className="text-3xl mb-8 text-bn-highlight text-center">Crear Cuenta</h2>
                        <FormRegistro />

                    </div>

                    <div className="flex-1 bg-gradient-to-br from-black to-[#cfaadf2c] text-white p-8 md:p-10 flex flex-col justify-center text-center">

                        <div id="registerInfo">
                            <h2 className="text-4xl mb-4">¡Hola!</h2>
                            <p className="text-base max-w-[300px] mx-auto">Estás a punto de sumergirte en un mundo creativo. Crea tu ropa ahora y comienza a experimentar con diseños únicos.</p>
                            <div className="mt-6">
                                <a href="/" className="inline-flex items-center gap-2 border border-white rounded-xl py-2.5 px-5 font-medium text-white transition-colors duration-300 ease-in-out hover:bg-[rgba(255,255,255,0.13)]">
                                    <i className='bx bx-home-alt-2 text-xl'></i> Ir al inicio
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </main>


    )
}

export default registro