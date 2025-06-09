'use client'
import { motion } from 'framer-motion';
import FormLogin from "@/components/layout/general/forms/FormLogin";
import LoginInfoSection from '@/components/login/LoginInfoSection';

function Login() {
  return (
    <main className="min-h-screen flex items-center justify-center p-5 bg-[linear-gradient(to_bottom_right,#000000,#0A1828,_#000000)]">
      <motion.div
        className="rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] overflow-hidden text-[#ffffff]"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex flex-row justify-center">
          <motion.div
            className="p-10 bg-[#000000] flex-1 bg-gradient-to-l from-[#000000] to-[#1a1a1a]"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-8 text-bn-highlight text-center">Iniciar Sesión</h2>
            <FormLogin />
          </motion.div>

          <LoginInfoSection />
        </div>
      </motion.div>
    </main>
  );
}

export default Login;
