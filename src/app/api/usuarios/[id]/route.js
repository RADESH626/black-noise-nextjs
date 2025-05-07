import connectDB from '@/utils/DBconection'
import { NextResponse } from 'next/server'
import Usuario from '@/models/Usuario'



export async function GET(request, { params }) {

    try {

        //nos conectamos a la base de datos 
        connectDB()

        //obtenemos el usuario por id especifico
        const UsuarioEncontrado = await Usuario.findById(params.id)

        //verificamos que hayamos encontrado el usuario 
        if (!UsuarioEncontrado) {
            return NextResponse.json({ message: 'usuario no encontrado' })
        }

        //retornamos el usuario encontrado
        return NextResponse.json(UsuarioEncontrado)

    } catch (error) {
        return NextResponse.json({ message: 'error al obtener el usuario' })
    }

}

export async function PUT(request, { params }) {
    try {
        //nos conectamos a la base de datos
        connectDB()

        //obtenemos los datos del usuario del request 
        const data = await request.json()

        //obtenemos el id del usuario de los params (el atributo params es async por lo que se usa el await)
        const id = await params.id

        //guargamos los valore del asuario actualizado para retorlarlos
        const UsuarioActualizado = await Usuario.findByIdAndUpdate(id, data, { new: true })

        return NextResponse.json(UsuarioActualizado)

    } catch (error) {
        return NextResponse.json({ message: 'error al conectar a la base de datos' })
    }
}

export async function DELETE(request, { params }) {
    try {
        //nos conectamos a la base de datos
        connectDB()

        //obtenemos los datos del usuario del request 
        const data = await request.json()
        //obtenemos el id del usuario de los params (el atributo params es async por lo que se usa el await)
        const id = await params.id

        //guargamos los valore del usuario eliminado para retorlarlos
        const UsuarioEliminado = await Usuario.findByIdAndDelete(id, data, { new: true })

        //verificamos que el usuario exista para eliminarlo 
        if (!UsuarioEliminado) {
            return NextResponse.json({ message: 'usuario no encontrado' })
        }

        //retornamos el usuario eliminado
        return NextResponse.json({ mensaje: 'usuario eliminado' }, UsuarioEliminado)
    } catch (error) {
        return NextResponse.json({ message: 'error al conectar a la base de datos' })
    }

}

