import { BotonGeneral } from '@/components/common/botones'
import {RegistroMasivoUsuario} from '@/app/acciones/UsuariosActions'
import InputFiles from '@/components/common/inputs/InputFiles'

function FormCargaMasivaUsuarios() {
  return (
    <form action={RegistroMasivoUsuario} className='flex flex-col items-center justify-center w-full h-full bg-gray-600 rounded-2xl p-4 gap-4'>


      <InputFiles />

      <BotonGeneral type="submit">Registrar Usuarios</BotonGeneral>

    </form>
  )
}

export default FormCargaMasivaUsuarios