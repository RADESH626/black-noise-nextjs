'use client'
import { motion } from 'framer-motion';
import HeaderPrincipal from '@/components/layout/general/HeaderPrincipal';
import Footer from '@/components/layout/general/footer/Footer';
import BotonGeneral from '@/components/common/botones/BotonGeneral';
import ProveedorButton from '@/components/layout/general/ProveedorButton';
import BotonDescargar from '@/components/common/botones/BotonDescargar';


async function indexPage() {
  return (
    <div className='pt-16'>
      <HeaderPrincipal />

      <main className="flex flex-col justify-between h-full">

        {/* Sección 1 */}
        <motion.section
          className='flex flex-col justify-start items-start gap-5 px-90 py-16 text-white'
          style={{ background: 'linear-gradient(to bottom, #000000, #0A1828, #000000)' }}
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 5 }}
          transition={{ duration: 1.8 }}
          viewport={{ once: false, amount: 0.3 }}
        >
          <div className='flex flex-col justify-center items-center gap-8 px-10 py-16 text-white'>
            <motion.h1
              className='font-bold text-5xl mb-4'
              style={{ color: '#ffffff' }}
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 5 }}
              transition={{ duration: 0.3 }}
              viewport={{ once: false }}
            >
              Dale Forma a Tu Estilo
            </motion.h1>

            <motion.p
              className='text-lg mb-6'
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              viewport={{ once: false }}
            >
              Tu imaginación no tiene límites. Con BlackNoise Editor, crea prendas únicas que marcan tendencia.
            </motion.p>

            <motion.img
              src="/img/modelos/Modelo Editor.jpg"
              alt="Editor"
              className='rounded-[10px] h-full w-full'
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              viewport={{ once: false }}
            />
          </div>

          <div className='self-center'>
            <BotonDescargar>!Descargalo ahora!</BotonDescargar>
          </div>
        </motion.section>

       {/* Sección 2 */}
        <motion.section
          className='flex flex-col justify-between items-center gap-4 p-10 text-white w-full'
          style={{ background: 'linear-gradient(to bottom, #000000, #1f2937)' }}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: false, amount: 0.3 }}
        >
          <div className='flex flex-col md:flex-row justify-between items-center gap-4 w-full max-w-7xl'>
            <div className='flex flex-col justify-center items-center gap-4 p-5 text-center md:text-left'>
              <h1 className='font-bold text-5xl w-full'>DISEÑA</h1>
              <h1 className='font-bold text-5xl w-full'>PRENDAS REALES</h1>
              <p className='text-4xl'>Selecciona tu talla, el color, corta y crea detalles</p>
              <BotonGeneral>EMPIEZA AHORA</BotonGeneral>
            </div>

            <motion.div
              className='flex justify-center items-center p-5 w-full md:w-1/2'
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              viewport={{ once: false }}
            >
              <img
                src='/img/modelos/modelo 4.jpg'
                alt="imagen de ropa"
                className='rounded-[80px] w-full h-auto object-cover'
              />
            </motion.div>
          </div>
        </motion.section>

        {/* Sección 3 */}
        <motion.section
          className='flex flex-col justify-between items-center gap-4 p-10 text-white w-full'
          style={{ background: 'linear-gradient(to bottom, #1f2937, #000000)' }}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: false }}
        >
          <div className='flex flex-col md:flex-row justify-between items-center gap-4 w-full max-w-7xl'>
            <motion.div
              className='flex justify-center items-center p-5 w-full md:w-1/2'
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              viewport={{ once: false }}
            >
              <img
                src='/img/modelos/modelo 3.jpg'
                alt="imagen de ropa"
                className='rounded-[80px] w-full h-auto object-cover'
              />
            </motion.div>

            <div className='flex flex-col justify-center items-center gap-4 p-5 text-center md:text-left'>
              <h1 className='font-bold text-5xl w-full'>AÑADE ELEMENTOS</h1>
              <h1 className='font-bold text-5xl w-full'>A TUS PRENDAS</h1>
              <p className='text-4xl'>Añade parches, taches, estampados y mucho más</p>
              <BotonGeneral>EMPIEZA AHORA</BotonGeneral>
            </div>
          </div>
        </motion.section>

        {/* Sección 4 */}
        <motion.section
          className='flex flex-col justify-between items-center gap-4 p-10 text-white w-full'
          style={{ background: 'linear-gradient(to bottom,  #000000, #1f2937, #000000)' }}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: false }}
        >
          <div className='flex flex-col md:flex-row justify-between items-center gap-4 w-full max-w-7xl'>
            <div className='flex flex-col justify-center items-center gap-4 p-5 text-center md:text-left'>
              <h1 className='font-bold text-5xl w-full'>DISEÑA</h1>
              <h1 className='font-bold text-5xl w-full'>PRENDAS REALES</h1>
              <p className='text-4xl'>Selecciona tu talla, el color, corta y crea detalles</p>
              <BotonGeneral>EMPIEZA AHORA</BotonGeneral>
            </div>

            <motion.div
              className='flex justify-center items-center p-5 w-full md:w-1/2'
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              viewport={{ once: false }}
            >
              <img
                src='/img/modelos/modelo 5.jpg'
                alt="imagen de ropa"
                className='rounded-[80px] w-full h-auto object-cover'
              />
            </motion.div>
          </div>
        </motion.section>

        {/* Tipos de prendas */}
        <motion.section
          className='flex flex-wrap justify-center items-center gap-10  p-10 text-[#bdb0ba]'
          style={{ background: 'linear-gradient(to bottom, #000000, #1f2937, #000000)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: false }}
        >
          {[
            { src: '../IMG/Sweaters/Sweater 1.jpg', alt: 'Sweater 2', label: 'Sweater' },
            { src: '../IMG/Hoddie_s/Hoddie 1.jpg', alt: 'Hoddie 1', label: "Hoddie's" },
            { src: '../IMG/Camisas/Camisa 1.jpg', alt: 'Camisa 1', label: 'Camisas' },
            { src: '../IMG/Pantalones/Pantalon 2.jpg', alt: 'Pantalón 2', label: 'Pantalones' },
          ].map((item, index) => (
            <motion.div
              key={index}
              className='w-105 rounded overflow-hidden shadow-lg bg-gray-800'
              initial={{ opacity: 0, scale: 0.30 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.30, delay: index * 0.80 }}
              viewport={{ once: false }}
            >
              <img src={item.src} alt={item.alt} className='w-full h-80 object-cover rounded-t' />
              <div className='p-4 text-center'>
                <h2 className='text-xl font-semibold'>{item.label}</h2>
              </div>
            </motion.div>
          ))}
        </motion.section>

        {/* Sección 5 - Registro Proveedores */}
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

        {/* Footer */}
        <Footer />
      </main>
    </div>
  )
}

export default indexPage;