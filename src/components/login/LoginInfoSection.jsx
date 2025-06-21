'use client'
import { motion } from 'framer-motion';
import Link from 'next/link';
import BotonGeneral from "@/components/common/botones/BotonGeneral";

function LoginInfoSection() {
  return (
    <motion.div
      className="flex flex-1 flex-col bg-gradient-to-r from-[#000000] to-[#1a1a1a] text-[#ffffff] p-8 justify-center text-center"
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div id="loginInfo">
        <h2 className="text-4xl mb-4">¡Bienvenido de nuevo!</h2>
        <p className="text-base max-w-[300px] mx-auto">
          Sigue creando prendas increíbles y creativas. Deja volar tu imaginación y descubre nuevas posibilidades con BlackNoise.
        </p>
        <div className="mt-6">
          <Link href="/">
            <BotonGeneral variant="secondary">
              <span className="flex items-center gap-2">
                <i className='bx bx-home-alt-2 text-xl transition-transform hover:scale-110'></i>
                Ir al inicio
              </span>
            </BotonGeneral>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default LoginInfoSection;
