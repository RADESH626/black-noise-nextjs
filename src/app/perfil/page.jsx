import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import BotonGeneral from "@/components/common/botones/BotonGeneral";

async function Perfil() {

  const session = await getServerSession(authOptions);

  console.log(session);

  const user = session?.user;

  if (!session) {

    return redirect("/");
  }

  return (

    // pantalla xd
    <div className="mx-auto p-4 md:p-8  bg-black text-white w-screen h-screen">


      <header className="bg-black p-6 md:p-8 rounded-lg shadow-lg mb-8">
        <div className="flex flex-col md:flex-row items-center">

          {/* imagen */}
          <div className="w-32 h-32 md:w-60 md:h-60 bg-gray-700 rounded-lg mb-4 md:mb-0 md:mr-8 ">
            <img src={user?.image} alt="User Image" className="w-full h-full object-cover rounded-lg" />
          </div>

          {/* seccion info */}
          <div className="flex-grow text-center md:text-left">

            <h1 className="text-3xl md:text-4xl font-bold mb-1">{user?.name.toUpperCase()}</h1>

            {/* info */}
            <div className="text-gray-400 mb-3">

              <p>CORREO: {user?.email}</p>
              <p>NÚMERO DE LIKES: {user?.likes}</p>
              <p>BIOGRAFÍA: {user?.bio ? user.bio : "..."}</p>

            </div>

            {/* botones */}
            <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-2 sm:space-y-0 sm:space-x-3">

              <BotonGeneral>
                EDITAR PERFIL

              </BotonGeneral>

              <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-150">
                CERRAR SESIÓN
              </button>

            </div>


          </div>
        </div>
      </header>

      {/* nav */}
      <nav className="mb-8">

        <div className="flex border-b border-gray-700">
          <button className="py-3 px-6 text-lg font-medium text-purple-400 border-b-2 border-purple-400 focus:outline-none">
            DISEÑOS
          </button>
          <button className="py-3 px-6 text-lg font-medium text-gray-500 hover:text-gray-300 focus:outline-none">
            PEDIDOS
          </button>
        </div>

      </nav>

      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="w-full h-56 bg-gray-700 relative">
            <div className="absolute top-0 right-0 m-3">
              <button className="bg-white text-purple-700 font-semibold py-1 px-4 rounded-md text-sm hover:bg-gray-200 transition duration-150">
                EDITAR
              </button>
            </div>
          </div>
          <div className="p-4 gradient-text-bg">
            <p className="font-semibold">nombre: camisa azul</p>
            <p className="font-semibold">precio: camisa azul</p>
            <p className="font-semibold">categoría: camisa</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="w-full h-56 bg-gray-700 relative">
            <div className="absolute top-0 right-0 m-3">
              <button className="bg-white text-purple-700 font-semibold py-1 px-4 rounded-md text-sm hover:bg-gray-200 transition duration-150">
                EDITAR
              </button>
            </div>
          </div>
          <div className="p-4 gradient-text-bg">
            <p className="font-semibold">nombre: diseño moderno</p>
            <p className="font-semibold">precio: $25.00</p>
            <p className="font-semibold">categoría: abstracto</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="w-full h-56 bg-gray-700 relative">
            <div className="absolute top-0 right-0 m-3">
              <button className="bg-white text-purple-700 font-semibold py-1 px-4 rounded-md text-sm hover:bg-gray-200 transition duration-150">
                EDITAR
              </button>
            </div>
          </div>
          <div className="p-4 gradient-text-bg">
            <p className="font-semibold">nombre: ilustración vector</p>
            <p className="font-semibold">precio: $15.99</p>
            <p className="font-semibold">categoría: ilustración</p>
          </div>
        </div>

      </main>
    </div>

  )

}

export default Perfil
