import FormLogin from "@/components/layout/general/forms/FormLogin"
import BotonGeneral from "@/components/common/botones/BotonGeneral"


function login() {
  return (
    <main className=" min-h-screen flex items-center justify-center bg-gradient-to-br p-5  from-gray-600 to-pink-400">
      
      <div className=" rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] overflow-hidden text-white">
        <div className="flex flex-row justify-center">
          <div className="p-10 bg-black flex-1 bg-gradient-to-l from-black to-gray-900">

            <h2 className="text-3xl font-bold mb-8 text-bn-highlight text-center">Iniciar Sesión</h2>

            <FormLogin />

          </div>

          <div className="flex flex-1 flex-col bg-gradient-to-r from-black to-gray-900 text-white p-8 justify-center text-center">
            <div id="loginInfo">
              <h2 className="text-4xl mb-4">¡Bienvenido de nuevo!</h2>

              <p className="text-base max-w-[300px] mx-auto">
                Sigue creando prendas increíbles y creativas. Deja volar tu
                imaginación y descubre nuevas posibilidades con BlackNoise.
              </p>
              <div className="mt-6">
                <a href="/">
                  <BotonGeneral className="text-secondary">
                    <span className="flex items-center gap-2">
                      <i className='bx bx-home-alt-2 text-xl'></i>
                      Ir al inicio
                    </span>
                  </BotonGeneral>
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default login
