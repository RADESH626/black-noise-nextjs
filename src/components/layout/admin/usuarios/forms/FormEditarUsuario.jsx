"use client"

import { BotonEditar } from "@/components/common/botones"

function FormEditarUsuario({id}) {

  return (

    <form action={"usuarios/editar/" +id}>
        <BotonEditar className="flex flex-row justify-center items-center "/>
    </form>

  )
}

export default FormEditarUsuario