'use client';
import { motion } from 'framer-motion';
import FormLogin from "@/components/layout/general/forms/FormLogin";
import LoginInfoSection from '@/components/login/LoginInfoSection';
import HeaderSoloLogo from '@/components/layout/general/HeaderSoloLogo';
import Footer from '@/components/layout/general/footer/Footer';
import BotonGeneral from '@/components/common/botones/BotonGeneral';


function Login() {
  const containerVariants = {
    hidden: { opacity: 0, rotateY: 180 },
    visible: {
      opacity: 1,
      rotateY: 0,
      transition: {
        duration: 1.2,
        ease: "easeInOut",
        when: "beforeChildren",
      }
    }
  };

  const formSectionVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
        delay: 0.5
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 1, backgroundColor: "#FFFFFF" },
    visible: {
      opacity: 0,
      transition: {
        delay: 0.2,
        duration: 0.6,
        ease: "easeOut",
      }
    }
  };

  return (
    <main
      className="min-h-screen flex flex-col bg-cover bg-center"
      style={{ backgroundImage: `url("/img/Logos/estesi.jpg")` }} // ✅ Asegúrate que la imagen tenga este nombre exacto sin espacios
    >
      {/* Header con solo el logo */}
      <HeaderSoloLogo />

      {/* White overlay */}
      <motion.div
        className="fixed inset-0 z-50 pointer-events-none"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
      />

      {/* Contenido principal centrado */}
      <div className="flex flex-1 items-center justify-center p-5 mt-20">
        <motion.div
          className="rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] overflow-hidden text-[#000000]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-row justify-center">
            <motion.div
              className="p-10 flex-1 bg-white bg-opacity-90 border border-[#D9D9D9] rounded-lg"
              variants={formSectionVariants}
            >
              <h2 className="text-3xl font-bold mb-8 text-bn-whoami text-center">Iniciar Sesión</h2>
              <FormLogin />
            </motion.div>

            <LoginInfoSection />
          </div>
        </motion.div>
      </div>

      {/* Footer al final */}
      <Footer />
    </main>
  );
}

export default Login;