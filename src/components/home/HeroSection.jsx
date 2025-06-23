'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import BotonDescargar from '@/components/common/botones/BotonDescargar';

export default function HeroSection() {
  return (
    <>
      {/* --- HERO PRINCIPAL --- */}
      <section className="relative w-full h-screen">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/img/Fondos/Fondo 7.jpg"
            alt="Modelo con diseño de moda urbana"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-black opacity-40" />
        </div>

        {/* Contenido centrado con padding-top para el header */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 pt-16">
          <motion.h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-snug mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <p className="mb-2">CAMBIANDO EL MUNDO</p>
            <p className="text-accent">CON PRENDAS VIRTUALES</p>
          </motion.h1>
          
          <motion.p
            className="mt-4 text-lg md:text-xl text-white max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1, ease: 'easeOut' }}
          >
            Crea y modifica prendas realistas en 3D para que puedas perfeccionar tus ideas antes de que se produzcan.
          </motion.p>
          
          <motion.div
            className="mt-8 text-black"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5, ease: 'easeOut' }}
          >
            <BotonDescargar onClick={() => window.location.href = 'https://github.com/Cryxxis/EditorBN/tree/master'}>
              Descargar editor
            </BotonDescargar>
          </motion.div>
        </div>
      </section>

      {/* --- SECCIÓN DE CONTENIDO BAJO EL HERO --- */}
      <section className="py-16 bg-white text-black">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Video */}
          <motion.div
            className="w-full aspect-video relative rounded-xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.25 }}
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              poster="/img/Fondos/Fondo 7.jpg"
            >
              <source src="/img/Modelos/video.mp4" type="video/mp4" />
              Tu navegador no soporta videos HTML5
            </video>
          </motion.div>

          {/* Texto y botón */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.25 }}
          >
            <motion.h1 
              className="text-3xl md:text-4xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              Explora tu <span className="text-accent">Creatividad</span>
            </motion.h1>
            
            <motion.p
              className="text-xl mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              viewport={{ once: true }}
            >
              Nuestra plataforma te permite visualizar tus diseños en tiempo real.
              Ajusta colores, texturas y geometrías de forma intuitiva.
            </motion.p>
            
            {/* Botón azul animado */}
            <motion.div
              className="mt-6"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105">
                Registrarme ahora
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- PRIMERA SECCIÓN DE VIDEO --- */}
<section className="py-16 bg-white text-black">
  <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
    {/* Texto y botón a la izquierda */}
    <motion.div
      className="order-1"
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.25 }}
    >
      <motion.h1 
        className="text-3xl md:text-4xl font-bold mb-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        viewport={{ once: true }}
      >
        SIMPLE E <span className="text-accent">INTUITIVO</span>
      </motion.h1>
      
      <motion.p
        className="text-xl mb-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        viewport={{ once: true }}
      >
        te ofrece una interfaz familiar y fácil de usar que te permite visualizar tus diseños de forma rápida y sin complicaciones.
      </motion.p>
      
      <motion.div
        className="mt-6"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        viewport={{ once: true }}
      >
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105">
          Registrarme ahora
        </button>
      </motion.div>
    </motion.div>

    {/* Video a la derecha */}
    <motion.div
      className="w-full aspect-video relative rounded-xl overflow-hidden shadow-2xl order-2"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.25 }}
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover"
        poster="/img/Fondos/Fondo 7.jpg"
      >
        <source src="/img/Modelos/video 2.mp4" type="video/mp4" />
        Tu navegador no soporta videos HTML5
      </video>
    </motion.div>
  </div>
</section>
    </>
  );
}