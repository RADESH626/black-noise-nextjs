import HeaderPrincipal from '@/components/layout/general/HeaderPrincipal';
import Footer from '@/components/layout/general/footer/Footer';
import BotonGeneral from '@/components/common/botones/BotonGeneral';
import ProveedorButton from '@/components/layout/general/ProveedorButton';

async function indexPage() {
  return (
    <div className='pt-16'>
      <HeaderPrincipal />

      <main className="flex flex-col justify-between h-full">


        {/* seccion 1 */}
        <section
         className='flex flex-col justify-start items-start gap-5 px-90 py-16 text-white'
         style={{ background: 'linear-gradient(to bottom, #000000, #C255AAFF, #000000)' }}

         >

          <div className='flex flex-col justify-center items-center gap-8 px-10 py-16 text-white'> 
            <h1 className='font-bold text-5xl mb-4' style={{ color: '#ffffff' }}>Dale Forma a Tu Estilo</h1>


            <p className='text-lg mb-6'>
              Tu imaginación no tiene límites. Con BlackNoise Editor, crea prendas únicas que marcan tendencia.
            </p>

            <img src="/img/modelos/Modelo Editor.jpg" alt="Editor" className='rounded-[10px] h-full w-full' />
          </div>

          {/* BOTON ABAJO DE LA IMAGEN/CONTENIDO */}
          <div className='self-center'>
            <BotonGeneral>
              !Descargalo ahora!
            </BotonGeneral>
          </div>


        </section>


        {/* seccion 2 */}
        <section 
        className='flex flex-col justify-between items-center gap-4 p-15 text-white h-full w-full'
          style={{ background: 'linear-gradient(to bottom, #000000, #1f2937)' }}
        >
          <div className='flex flex-row justify-between items-center gap-4 w-full' >
            <div className='flex flex-col justify-center items-center gap-4 p-5' >
              <h1 className='font-bold text-5xl text-center w-full'>DISEÑA </h1>
              <h1 className='font-bold text-5xl text-center w-full'>PRENDAS REALES</h1>

              <p className='text-center text-4xl '>
                Selecciona tu talla, el color, corta y crea detalles
              </p>

              <BotonGeneral>
                EMPIEZA AHORA
              </BotonGeneral>

            </div>


            <div className='flex flex-col justify-center items-center gap-4 p-5' >
              <img src='/img/modelos/modelo 4.jpg' alt="imagen de ropa" className='w-1/2 h-1/2 rounded-[80px] h-full w-full' />
            </div>
          </div>
        </section>


        {/* seccion 3 */}
        <section 
        className='flex flex-col justify-between items-center gap-4 p-15 text-white h-full w-full'
          style={{ background: 'linear-gradient(to bottom, #1f2937, #000000)' }}
        >
        
          <div className='flex flex-row justify-between items-center gap-4 w-full' >



            <div className='flex flex-col justify-center items-center gap-4 p-5' >
              <img src='/img/modelos/modelo 3.jpg' alt="imagen de ropa" className='w-1/2 h-1/2 rounded-[80px] h-full w-full' />
            </div>

            <div className='flex flex-col justify-center items-center gap-4 p-5' >

              <h1 className='font-bold text-5xl text-center w-full'>AÑADE ELEMENTOS </h1>
              <h1 className='font-bold text-5xl text-center w-full'>A TUS PRENDAS</h1>

              <p className='text-center text-4xl '>
                Añade parches, taches, estampados y mucho más
              </p>

              <BotonGeneral>
                EMPIEZA AHORA
              </BotonGeneral>

            </div>
          </div>

        </section>

        
        {/* seccion 4 */}

        <section
         className='flex flex-col justify-between items-center gap-4 p-15 text-white h-full w-full'
          style={{ background: 'linear-gradient(to bottom,  #000000, #1f2937, #000000)' }}
        >


          <div className='flex flex-row justify-between items-center gap-4 w-full' >
            <div className='flex flex-col justify-center items-center gap-4 p-5'>
              <h1 className='font-bold text-5xl text-center w-full'>DISEÑA</h1>
              <h1 className='font-bold text-5xl text-center w-full'>PRENDAS REALES</h1>

              <p className='text-center text-4xl ' >
                Selecciona tu talla, el color, corta y crea detalles
              </p>

              <BotonGeneral>
                EMPIEZA AHORA
              </BotonGeneral>
            </div>
            
            <div className='flex flex-col justify-center items-center gap-4 p-5' >
              <img src='/img/modelos/modelo 5.jpg' alt="imagen de ropa" className='rounded-[80px] h-full w-full' />
            </div>
          </div>
        </section>




        {/*}
        <section className=' flex h-screen flex-col justify-center items-center gap-4 p-10 bg-gradient-to-b from-black to-pink-300 text-white'>

          <h1 className='font-bold text-5xl'>COMUNIDAD DE DISEÑADORES</h1>

          <BotonGeneral>
            DESCARGAR APLICACION
          </BotonGeneral>

        </section> */}

        {/* sección - Tipos de prendas */}
      <section className='flex flex-wrap justify-center items-center gap-10  p-10 text-[#bdb0ba]'
         style={{ background: 'linear-gradient(to bottom, #000000, #1f2937, #000000)' }}>
     {[
      { src: '../IMG/Sweaters/Sweater 1.jpg', alt: 'Sweater 2', label: 'Sweater' },
      { src: '../IMG/Hoddie_s/Hoddie 1.jpg', alt: 'Hoddie 1', label: "Hoddie's" },
      { src: '../IMG/Camisas/Camisa 1.jpg', alt: 'Camisa 1', label: 'Camisas' },
      { src: '../IMG/Pantalones/Pantalon 2.jpg', alt: 'Pantalón 2', label: 'Pantalones' },
          ].map((item, index) => (
       <div key={index} className='w-105 rounded overflow-hidden shadow-lg bg-gray-800'>
      <img src={item.src} alt={item.alt} className='w-full h-80 object-cover rounded-t' />
      <div className='p-4 text-center'>
        <h2 className='text-xl font-semibold'>{item.label}</h2>
      </div>
      </div>
     ))}
   </section>



        {/* seccion 5 - Registro de Proveedores */}
        <section
         className='flex h-screen flex-col justify-center items-center gap-4 p-10 text-white'
          style={{ background: 'linear-gradient(to bottom, #000000, #C255AAFF, #000000)' }}
        >
          <h1 className='font-bold text-5xl text-center'>¿ERES UN PROVEEDOR?</h1>
          
          <p className='text-center text-2xl max-w-2xl'>
            Únete a nuestra red de proveedores y haz crecer tu negocio. Conecta con diseñadores y clientes que buscan calidad en la producción de sus diseños.
          </p>

          <ProveedorButton />
        </section>




        {/* footer */}
        <Footer />



      </main>

    </div>
  )
}

export default indexPage

// TODO:poner las imagenes de tipos de prendas
// TODO: poner las redes socicales