import { BotonGeneral } from '@/components/common/botones';
import { ObtenerUsuarioPorId } from "@/app/acciones/UsuariosActions";
import {
  InputTipoDocumentoIdentidad,
  InputDocumentoIdentidad,
  InputTextoGeneral,
  InputFecha,
  InputGenero,
  InputTelefono,
  InputEmail,
  InputRol


} from '@/components/common/inputs';
import Link from 'next/link';

async function FormEditarUsuario({ UserId }) {

  const id = UserId;

  const usuario = await ObtenerUsuarioPorId(id);
  // usuario = usuario && typeof usuario.toObject === "function" ? usuario.toObject() : JSON.parse(JSON.stringify(usuario));

  console.log('usuario:', usuario);

  return (

    <form className="space-y-5">


      {/* ==================================================================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


        <div className="relative">

          <label htmlFor="tipoDocumento" className="block mb-1 text-sm font-medium text-bn-accent">Tipo de Documento</label>
          <div className="relative">
            <InputTipoDocumentoIdentidad defaultValue={usuario.tipoDocumento || ""} />
          </div>

        </div>


        <div className="relative">

          <label htmlFor="numeroDocumento" className="block mb-1 text-sm font-medium text-bn-accent">Número de Documento</label>
          <div className="relative">

            <InputDocumentoIdentidad required defaultValue={usuario.numeroDocumento || ""} />

          </div>

        </div>



      </div>

      {/* ==================================================================================================== */}


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


        <div className="relative">

          <label htmlFor="primerNombre" className="block mb-1 text-sm font-medium text-bn-accent">Primer nombre</label>

          <div className="relative">

            <InputTextoGeneral id="primerNombre" name="primerNombre" required placeholder="Primer nombre" defaultValue={usuario.primerNombre || ""} />

          </div>

        </div>


        <div className="relative">


          <label htmlFor="segundoNombre" className="block mb-1 text-sm font-medium text-bn-accent">Segundo nombre</label>        <div className="relative">

            <InputTextoGeneral id="segundoNombre" name="segundoNombre" required placeholder="Segundo nombre (opcional)" defaultValue={usuario.segundoNombre || ""} />

          </div>

        </div>


      </div>

      {/* ==================================================================================================== */}


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="relative">

          <label htmlFor="primerApellido" className="block mb-1 text-sm font-medium text-bn-accent">Primer apellido</label>        <div className="relative">

            <InputTextoGeneral id="primerApellido" name="primerApellido" required placeholder="Primer apellido" defaultValue={usuario.primerApellido || ""} />

          </div>

        </div>


        <div className="relative">

          <label htmlFor="segundoApellido" className="block mb-1 text-sm font-medium text-bn-accent">Segundo apellido</label>        <div className="relative">

            <InputTextoGeneral id="segundoApellido" name="segundoApellido" required placeholder="Segundo apellido" defaultValue={usuario.segundoApellido || ""} />

          </div>

        </div>

      </div>

      {/* ==================================================================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="relative">

          <label htmlFor="fechaNacimiento" className="block mb-1 text-sm font-medium text-bn-accent">Fecha de nacimiento</label>        <div className="relative">
            <InputFecha
              id="fechaNacimiento"
              name="fechaNacimiento"
              required
              defaultValue={
                usuario.fechaNacimiento
                  ? new Date(usuario.fechaNacimiento).toISOString().split('T')[0]
                  : ""
              }
            />
          </div>

        </div>


        <div className="relative">
          <label htmlFor="genero" className="block mb-1 text-sm font-medium text-bn-accent">Género</label>        <div className="relative">
            <InputGenero id="genero" name="genero" required defaultValue={usuario.genero || ""} />
          </div>
        </div>

      </div>

      {/* ==================================================================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="relative">

          <label htmlFor="telefono" className="block mb-1 text-sm font-medium text-bn-accent">Número de teléfono</label>
          <div className="relative">
            <InputTelefono id="telefono" name="telefono" required defaultValue={usuario.numeroTelefono || ""} />
          </div>


        </div>


        <div className="relative">
          <label htmlFor="genero" className="block mb-1 text-sm font-medium text-bn-accent">Género</label>
          <div className="relative">
            <InputRol id="genero" name="genero" required defaultValue={usuario.rol || ""} />
          </div>
        </div>

      </div>

      <div className="relative">


      </div>

      <div className="relative">
        <label htmlFor="direccion" className="block mb-1 text-sm font-medium text-bn-accent">Dirección</label>      <div className="relative">
          <InputTextoGeneral id="direccion" name="direccion" required placeholder="Dirección" defaultValue={usuario.direccion || ""} />
        </div>

      </div>

      {/* ==================================================================================================== */}

      <div className="relative">
        <label htmlFor="correo-registro" className="block mb-1 text-sm font-medium text-bn-accent">Correo electrónico</label>      <div className="relative">
          <InputEmail id="correo-registro" name="correo" required placeholder="Correo electrónico" defaultValue={usuario.correo || ""} />
        </div>

      </div>

      {/* ==================================================================================================== */}


      {/* ==================================================================================================== */}


      <div className="flex flex-row gap-2 items-center justify-center mt-5">

        <BotonGeneral type="submit">agregar usuario</BotonGeneral>

        <Link href="/admin/usuarios/agregar/archivo">
          <BotonGeneral type="button" >cargar usuarios</BotonGeneral>
        </Link>

      </div>

    </form>

  )
}

export default FormEditarUsuario
