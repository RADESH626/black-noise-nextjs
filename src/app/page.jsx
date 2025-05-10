import HeaderPrincipal from '@/components/layout/general/HeaderPrincipal';
import Footer from '@/components/layout/general/footer/Footer';
import BotonGeneral from '@/components/common/botones/BotonGeneral';

function indexPage() {
  return (
    <div className='pt-16'>
      <HeaderPrincipal />


      <main className="flex flex-col justify-between h-full">


        {/* seccion 1 */}
        <section className=' flex h-screen flex-col justify-center items-center gap-4 p-10 bg-gradient-to-b from-black to-pink-300 text-white'>

          <h1 className='font-bold text-5xl'>DISEÑA TU PROPIA ROPA</h1>

          <p className='text-center text-lg'>
            Con nuestro innovador software de edición de ropa, diseñar nunca ha sido tan fácil. Crea tu propio
            estilo acomodado a tu forma de ser.
          </p>
          <a href="/login">
            <BotonGeneral>
              REGISTRARSE AHORA
            </BotonGeneral>
          </a>

        </section>


        {/* seccion 2 */}
        <section className='flex flex-col justify-between items-center gap-4 p-15 bg-gradient-to-b from-black to-gray-800 text-white h-full w-full'>

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
        <section className='flex flex-col justify-between items-center gap-4 p-15 bg-gradient-to-b from-gray-800 to-black text-white h-full w-full'>

          <div className='flex flex-row justify-between items-center gap-4 w-full' >



            <div className='flex flex-col justify-center items-center gap-4 p-5' >
              <img src='/img/modelos/modelo 5.jpg' alt="imagen de ropa" className='w-1/2 h-1/2 rounded-[80px] h-full w-full' />
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

        <section className=' flex h-screen flex-col justify-center items-center gap-4 p-10 bg-gradient-to-b from-black to-pink-300 text-white'>

          <h1 className='font-bold text-5xl'>COMUNIDAD DE DISEÑADORES</h1>

          <BotonGeneral>
            DESCARGAR APLICACION
          </BotonGeneral>

        </section>


        {/* seccion 5 */}

        <section className=' flex h-screen flex-col justify-center items-center gap-4 p-10 bg-gradient-to-b from-black to-pink-300 text-white'>

          <h1 className='font-bold text-5xl'>COMUNIDAD DE DISEÑADORES</h1>

          <BotonGeneral>
            DESCARGAR APLICACION
          </BotonGeneral>

        </section>




        {/* footer */}
        <Footer />



      </main>

    </div>
  )
}

export default indexPage

// TODO:poner las imagenes de tipos de prendas
// TODO: poner las redes socicales