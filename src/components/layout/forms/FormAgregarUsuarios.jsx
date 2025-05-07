import InputTipoDocumentoIdentidad from '@/components/ui/inputs/InputTipoDocumentoIdentidad';
import InputDocumentoIdentidad from '@/components/ui/inputs/InputDocumentoIdentidad';
import InputTextoGeneral from '@/components/ui/inputs/InputTextoGeneral';
import InputFecha from '@/components/ui/inputs/InputFecha';
import InputGenero from '@/components/ui/inputs/InputGenero';
import InputTelefono from '@/components/ui/inputs/InputTelefono';
import InputEmail from '@/components/ui/inputs/InputEmail';
import IconoPersona from '../../common/iconos/IconoPersona';


function FormAgregarUsuarios() {
    return (
        <form className="space-y-5">


            {/* ==================================================================================================== */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                <div className="relative">

                    <label htmlFor="tipoDocumento" className="block mb-1 text-sm font-medium text-bn-accent">Tipo de Documento</label>
                    <div className="relative">
                        <InputTipoDocumentoIdentidad id="tipoDocumento" name="tipoDocumento" required />
                    </div>

                </div>


                <div className="relative">

                    <label htmlFor="numeroDocumento" className="block mb-1 text-sm font-medium text-bn-accent">Número de Documento</label>
                    <div className="relative">

                        <IconoPersona/>
                        <InputDocumentoIdentidad id="numeroDocumento" name="numeroDocumento" required />

                    </div>

                </div>



            </div>

            {/* ==================================================================================================== */}


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                <div className="relative">

                    <label htmlFor="primerNombre" className="block mb-1 text-sm font-medium text-bn-accent">Primer nombre</label>        <div className="relative">

                        <i className='bx bxs-user absolute right-3 top-1/2 transform -translate-y-1/2 text-bn-accent input-icon'></i>
                        <InputTextoGeneral id="primerNombre" name="primerNombre" required placeholder="Primer nombre" />

                    </div>

                </div>


                <div className="relative">


                    <label htmlFor="segundoNombre" className="block mb-1 text-sm font-medium text-bn-accent">Segundo nombre</label>        <div className="relative">

                        <i className='bx bxs-user absolute right-3 top-1/2 transform -translate-y-1/2 text-bn-accent input-icon'></i>
                        <InputTextoGeneral id="segundoNombre" name="segundoNombre" required placeholder="Segundo nombre (opcional)" />

                    </div>

                </div>


            </div>

            {/* ==================================================================================================== */}


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="relative">

                    <label htmlFor="primerApellido" className="block mb-1 text-sm font-medium text-bn-accent">Primer apellido</label>        <div className="relative">

                        <i className='bx bxs-user absolute right-3 top-1/2 transform -translate-y-1/2 text-bn-accent input-icon'></i>
                        <InputTextoGeneral id="primerApellido" name="primerApellido" required placeholder="Primer apellido" />

                    </div>

                </div>


                <div className="relative">

                    <label htmlFor="segundoApellido" className="block mb-1 text-sm font-medium text-bn-accent">Segundo apellido</label>        <div className="relative">

                        <i className='bx bxs-user absolute right-3 top-1/2 transform -translate-y-1/2 text-bn-accent input-icon'></i>
                        <InputTextoGeneral id="segundoApellido" name="segundoApellido" required placeholder="Segundo apellido" />

                    </div>

                </div>

            </div>

            {/* ==================================================================================================== */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="relative">

                    <label htmlFor="fechaNacimiento" className="block mb-1 text-sm font-medium text-bn-accent">Fecha de nacimiento</label>        <div className="relative">
                        <InputFecha id="fechaNacimiento" name="fechaNacimiento" required />
                    </div>

                </div>


                <div className="relative">
                    <label htmlFor="genero" className="block mb-1 text-sm font-medium text-bn-accent">Género</label>        <div className="relative">
                        <i className='bx bxs-user absolute right-3 top-1/2 transform -translate-y-1/2 text-bn-accent input-icon'></i>
                        <InputGenero id="genero" name="genero" required />
                    </div>
                </div>

            </div>

            {/* ==================================================================================================== */}

            <div className="relative">

                <label htmlFor="telefono" className="block mb-1 text-sm font-medium text-bn-accent">Número de teléfono</label>      <div className="relative">
                    <InputTelefono id="telefono" name="telefono" required />
                    <i className='bx bxs-phone absolute right-3 top-1/2 transform -translate-y-1/2 text-bn-accent input-icon'></i>
                </div>

            </div>

            <div className="relative">
                <label htmlFor="direccion" className="block mb-1 text-sm font-medium text-bn-accent">Dirección</label>      <div className="relative">
                    <InputTextoGeneral id="direccion" name="direccion" required placeholder="Dirección" />
                    <i className='bx bxs-home absolute right-3 top-1/2 transform -translate-y-1/2 text-bn-accent input-icon'></i>
                </div>

            </div>

            {/* ==================================================================================================== */}

            <div className="relative">
                <label htmlFor="correo-registro" className="block mb-1 text-sm font-medium text-bn-accent">Correo electrónico</label>      <div className="relative">
                    <InputEmail id="correo-registro" name="correo" required placeholder="Correo electrónico" />
                    <i className='bx bxs-envelope absolute right-3 top-1/2 transform -translate-y-1/2 text-bn-accent input-icon'></i>
                </div>

            </div>

            {/* ==================================================================================================== */}


            {/* ==================================================================================================== */}



            <button type="submit" className="w-full p-3 bg-bn-secondary text-bn-primary font-bold border-none rounded-lg mt-3 transition-colors duration-300 ease-in-out hover:bg-bn-accent">Registrarse</button>


        </form>
    )
}

export default FormAgregarUsuarios