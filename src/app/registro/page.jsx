<<<<<<< HEAD
import FormRegistro from "@/components/layout/general/forms/FormRegistro"
import BotonGeneral from "@/components/common/botones/BotonGeneral"

function registro() {
    return (

        <main className="min-h-screen flex items-center justify-center p-5 bg-[linear-gradient(to_bottom_right,#000000,#C255AA,_#000000)]">


            <div className="rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] overflow-hidden text-[#ffffff]">


                <div className="flex flex-row justify-center">
                    
                    <div className="p-10 bg-[#000000] flex-1 bg-gradient-to-l from-[#000000] to-[#000000]">


                        <h2 className="text-3xl mb-8 text-bn-highlight text-center">Crear Cuenta</h2>

                        <FormRegistro />

                    </div>

                    <div className="flex flex-1 flex-col bg-gradient-to-r from-[#000000] to-[#000000] text-[#ffffff] p-8 justify-center text-center">


                        <div id="registerInfo">
                            
                            <h2 className="text-4xl mb-4">¡Hola!</h2>

                            <p className="text-base max-w-[300px] mx-auto">
                                Estás a punto de sumergirte en un mundo creativo.Crea tu ropa ahora y comienza a experimentar con diseños únicos.
                            </p>

                            <div className="mt-6">
                                <a href="/">
                                    <BotonGeneral>
                                        <span className="flex items-center gap-2">
                                            <i className='bx bx-home-alt-2 text-xl'></i>
                                            Ir al inicio
                                        </span>
                                    </BotonGeneral>
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

//TODO: redirigir a la pagina de inicio al registrarse
=======
'use client'
import { motion } from "framer-motion";
import FormRegistro from "@/components/layout/general/forms/FormRegistro";
import BotonGeneral from "@/components/common/botones/BotonGeneral";

function Registro() {
  return (
    <main className="min-h-screen flex items-center justify-center p-5 bg-gradient-to-br from-black via-[#0A1828] to-black">
      <motion.div
        className="rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] overflow-hidden text-[#000000] max-w-6xl w-full"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex flex-row">
          <motion.div
            className="p-10 bg-[#f0eded] flex-1"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl mb-8 text-bn-highlight text-center">Crear Cuenta</h2>
            <FormRegistro />
          </motion.div>

          <motion.div
            className="relative flex flex-1 flex-col min-h-[500px] bg-cover bg-center bg-no-repeat text-white justify-center text-center p-8"
            style={{ backgroundImage: "url('/img/Fondos/Fondo 3.jpg')" }}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            {/* Overlay oscuro con fade-in */}
            <motion.div
              className="absolute inset-0 bg-[#27425e] bg-opacity-70 z-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ duration: 0.7 }}
            />

            <div id="registerInfo" className="relative z-10">
              <motion.h2
                className="text-4xl mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                ¡Hola!
              </motion.h2>
              <motion.p
                className="text-base max-w-[300px] mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                Estás a punto de sumergirte en un mundo creativo. Crea tu ropa ahora y comienza a experimentar con diseños únicos.
              </motion.p>

              <motion.div
                className="mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <a href="/">
                  <BotonGeneral>
                    <span className="flex items-center gap-2">
                      <i className='bx bx-home-alt-2 text-xl transition-transform hover:scale-110'></i>
                      Ir al inicio
                    </span>
                  </BotonGeneral>
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}

export default Registro;
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d
