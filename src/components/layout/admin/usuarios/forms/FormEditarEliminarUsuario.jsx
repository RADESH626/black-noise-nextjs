import { BotonEditar,BotonEliminar } from '@/components/common/botones'
import { Children } from 'react';

function FormEditarEliminarUsuario({Children}) {
    const handleEditar = (e) => {
        e.preventDefault();
        // Aquí puedes enviar el dato con el valor "editar"
        // Por ejemplo, usando fetch o axios:
        // fetch('/api/editar', { method: 'POST', body: JSON.stringify({ accion: 'editar' }) })
        // O puedes levantar un estado, llamar a una función, etc.
        console.log('Editar');
    };

    return (
        <form className='flex flex-row'>
            <BotonEditar type="button" title="Editar" onClick={handleEditar} />
            <BotonEliminar type="submit" title="Eliminar" />
            {Children}
        </form>
    )
}

export default FormEditarEliminarUsuario