'use client'
import { motion } from 'framer-motion';
import ProveedorButton from '@/components/layout/general/ProveedorButton';

function SupplierRegistrationSection() {
  return (
    <motion.section
      className='flex h-screen flex-col justify-center items-center gap-4 p-10 text-white'
      style={{ background: 'linear-gradient(to bottom, #000000, #0A1828, #000000)' }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: false }}
    >
      <h1 className='font-bold text-5xl text-center'>¿ERES UN PROVEEDOR?</h1>

      <p className='text-center text-2xl max-w-2xl'>
        Únete a nuestra red de proveedores y haz crecer tu negocio. Conecta con diseñadores y clientes que buscan calidad en la producción de sus diseños.
      </p>

      <ProveedorButton />
    </motion.section>
  );
}

export default SupplierRegistrationSection;
