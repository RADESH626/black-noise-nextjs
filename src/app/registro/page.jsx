'use client'
import { motion } from "framer-motion";
import FormRegistro from "@/components/layout/general/forms/FormRegistro";
import BotonGeneral from "@/components/common/botones/BotonGeneral";
<<<<<<< HEAD

function Registro() {
  return (
    <main className="min-h-screen flex items-center justify-center p-5 bg-gradient-to-br from-black via-[#0A1828] to-black">
      <motion.div
        className="rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] overflow-hidden text-[#ffffff] max-w-6xl w-full"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex flex-row">
          <motion.div
            className="p-10 bg-[#000000] flex-1 bg-gradient-to-l from-[#000000] to-[#1a1a1a]"
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
=======
import HeaderSoloLogo from '@/components/layout/general/HeaderSoloLogo';
import Footer from '@/components/layout/general/footer/Footer';

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 1.2, ease: "easeOut" } 
  }
};

const leftPanelVariants = {
  hidden: { x: -50, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1, 
    transition: { duration: 1.2 } 
  }
};

const rightPanelVariants = {
  hidden: { x: 50, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1, 
    transition: { duration: 1.2 } 
  }
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 0.7, 
    transition: { duration: 1.2 } 
  }
};

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.4, duration: 1 }
  })
};

function Registro() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <HeaderSoloLogo />

      <main className="relative flex-1 flex items-center justify-center p-5 pt-16 bg-cover bg-center" 
            style={{ backgroundImage: "url('/img/Logos/Logo Registro.jpg')" }}>
        
        {/* Overlay difuminado transparente sobre el fondo */}
        <motion.div
          className="absolute inset-0 bg-[#fffefe83] bg-opacity-70 backdrop-blur-sm z-0"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
        />

        {/* Contenido principal sobre el overlay */}
        <motion.div
          className="relative z-10 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] overflow-hidden text-[#000000] max-w-6xl w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-row">
            {/* Panel Izquierdo */}
            <motion.div
              className="p-10 bg-[#ffffff] flex-1 border border-[#D9D9D9] rounded-lg"
              variants={leftPanelVariants}
              initial="hidden"
              animate="visible"
            >
              <h2 className="text-3xl mb-8 text-bn-highlight text-center">Crear Cuenta</h2>
              <FormRegistro />
            </motion.div>

            {/* Panel Derecho */}
            <motion.div
              className="relative flex flex-1 flex-col min-h-[500px] bg-cover bg-center bg-no-repeat text-white justify-center text-center p-8"
              style={{ backgroundImage: "url('/img/Logos/Logo Registro 2.jpg')" }}
              variants={rightPanelVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                className="absolute inset-0 bg-[#dfd7d71e] bg-opacity-70 z-0"
                variants={overlayVariants}
              />

              <div id="registerInfo" className="relative z-10">
                <motion.h2
                  className="text-4xl mb-4"
                  variants={textVariants}
                  custom={1}
                  initial="hidden"
                  animate="visible"
                >
                  ¡Hola!
                </motion.h2>
                <motion.p
                  className="text-base max-w-[300px] mx-auto"
                  variants={textVariants}
                  custom={2}
                  initial="hidden"
                  animate="visible"
                >
                  Estás a punto de sumergirte en un mundo creativo. Crea tu ropa ahora y comienza a experimentar con diseños únicos.
                </motion.p>

                <motion.div
                  className="mt-6"
                  variants={textVariants}
                  custom={3}
                  initial="hidden"
                  animate="visible"
                >
                  <a href="/">
                    <BotonGeneral className="hover:scale-105 transition-transform duration-300">
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
>>>>>>> db35ad5 (diseños login y registro)
  );
}

export default Registro;
