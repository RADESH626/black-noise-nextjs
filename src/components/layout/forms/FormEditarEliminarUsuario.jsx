import { BotonEditar,BotonEliminar } from '@/components/common/botones'

function FormEditarEliminarUsuario() {
    return (
        <form className='flex flex-row'  >
            <BotonEditar className="" type="submit" title="Editar" />
            <BotonEliminar className="" type="submit" title="Eliminar" />
        </form>
    )
}

export default FormEditarEliminarUsuario