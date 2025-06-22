'use client'
import { motion } from "framer-motion";
import FormRegistro from "@/components/layout/general/forms/FormRegistro";
import BotonGeneral from "@/components/common/botones/BotonGeneral";
import HeaderSoloLogo from "@/components/layout/general/HeaderSoloLogo";
import Footer from "@/components/layout/general/footer/Footer";

function Registro() {
  return (
    <div className="relative min-h-screen flex flex-col bg-cover bg-center"
      style={{ backgroundImage: `url('/img/Logos/Logo Registro.jpg')` }} // Imagen de fondo principal
    >
      {/* Capa de gradiente blanco encima */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/70 to-white/0"></div>

      {/* Header */}
      <HeaderSoloLogo />

      {/* Contenido principal */}
      <main className="flex-1 flex items-center justify-center p-5 relative z-10">
        <motion.div
          className="rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] overflow-hidden text-[#ffffff] max-w-6xl w-full"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex flex-row">
            <motion.div
              className="p-10 flex-1 border border-[#D9D9D9] rounded-lg bg-white bg-opacity-90 text-black"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-3xl mb-8 text-bn-highlight text-center">Crear Cuenta</h2>
              <FormRegistro />
            </motion.div>

            <motion.div
              className="relative flex flex-1 flex-col min-h-[500px] bg-cover bg-center bg-no-repeat text-white justify-center text-center p-8"
              style={{ backgroundImage: "url('/img/Logos/Logo Registro 2.jpg')" }} // Imagen de la derecha
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7 }}
            >
              {/* Overlay degradado blanco */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-white/20 to-white/0 z-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
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

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Registro;