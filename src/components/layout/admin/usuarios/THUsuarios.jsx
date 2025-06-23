import { Thgeneral, TablaHeader } from '@/components/common/tablas';

function THUsuarios() {
    return (
        <TablaHeader>
            <Thgeneral className="w-1/12">Estado</Thgeneral>
            <Thgeneral className="w-3/12">Usuario</Thgeneral>
            <Thgeneral className="w-3/12">Información de Usuario</Thgeneral>
            <Thgeneral className="w-3/12">Contacto</Thgeneral>
            <Thgeneral className="w-2/12">Acciones</Thgeneral>
        </TablaHeader>
    )
}

export default THUsuarios;
