import { DeshabilitarUsuario } from "@/app/acciones/UsuariosActions"

function FormDeshabilitarusuarios(UserId) {


     const { id } = UserId;

    return (
        <form action={DeshabilitarUsuario}>

            <input type="hidden" name="id" value={id} />
            <button> eliminar </button>

        </form>
    )
}

export default FormDeshabilitarusuarios
