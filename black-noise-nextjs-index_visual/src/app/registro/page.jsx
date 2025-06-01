import FormRegistro from "@/components/layout/general/forms/FormRegistro";
import BotonGeneral from "@/components/common/botones/BotonGeneral";

function Registro() {
  return (
    <main className="min-h-screen flex items-center justify-center p-5 bg-gradient-to-br from-black via-[#0A1828] to-black">
      <div className="rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] overflow-hidden text-[#000000] max-w-6xl w-full">
        <div className="flex flex-row">
          
          {/* Lado izquierdo: Formulario de registro */}
          <div className="p-10 bg-[#f0eded] flex-1">
            <h2 className="text-3xl mb-8 text-bn-highlight text-center">Crear Cuenta</h2>
            <FormRegistro />
          </div>

          {/* Lado derecho: Imagen de fondo con overlay y texto */}
          <div
            className="relative flex flex-1 flex-col min-h-[500px] bg-cover bg-center bg-no-repeat text-white justify-center text-center p-8"
            style={{ backgroundImage: "url('/img/Fondos/Fondo 3.jpg')" }}
          >
            {/* Overlay oscuro */}
            <div className="absolute inset-0 bg-[#27425e] bg-opacity-70 z-0" />

            {/* Contenido encima del fondo */}
            <div id="registerInfo" className="relative z-10">
              <h2 className="text-4xl mb-4">¡Hola!</h2>
              <p className="text-base max-w-[300px] mx-auto">
                Estás a punto de sumergirte en un mundo creativo. Crea tu ropa ahora y comienza a experimentar con diseños únicos.
              </p>

              {/* Botón para ir al inicio */}
              <div className="mt-6">
                <a href="/">
                  <BotonGeneral>
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
  );
}

export default Registro;
