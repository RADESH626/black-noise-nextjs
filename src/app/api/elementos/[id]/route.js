import connectDB from '@/utils/DBconection'
import { NextResponse } from 'next/server'
import Elemento from '@/models/Elemento'

export async function GET(request, { params }) {
    try {
        // Conectamos a la base de datos
        connectDB()

        // Obtenemos el elemento por id específico
        const elementoEncontrado = await Elemento.findById(params.id)

        // Verificamos que hayamos encontrado el elemento
        if (!elementoEncontrado) {
            return NextResponse.json({ message: 'Elemento no encontrado' }, { status: 404 })
        }

        // Retornamos el elemento encontrado
        return NextResponse.json(elementoEncontrado)
    } catch (error) {
        console.error('Error al obtener elemento:', error)
        return NextResponse.json({ message: 'Error al obtener el elemento' }, { status: 500 })
    }
}

export async function PUT(request, { params }) {
    try {
        // Conectamos a la base de datos
        connectDB()

        // Obtenemos los datos del elemento del request
        const data = await request.json()

        // Obtenemos el id del elemento de los params
        const id = params.id

        // Guardamos los valores del elemento actualizado para retornarlos
        const elementoActualizado = await Elemento.findByIdAndUpdate(id, data, { new: true })

        if (!elementoActualizado) {
            return NextResponse.json({ message: 'Elemento no encontrado' }, { status: 404 })
        }

        return NextResponse.json(elementoActualizado)
    } catch (error) {
        console.error('Error al actualizar elemento:', error)
        return NextResponse.json({ message: 'Error al actualizar el elemento' }, { status: 500 })
    }
}

export async function DELETE(request, { params }) {
    try {
        // Conectamos a la base de datos
        connectDB()

        // Obtenemos el id del elemento de los params
        const id = params.id

        // Guardamos los valores del elemento eliminado para retornarlos
        const elementoEliminado = await Elemento.findByIdAndDelete(id)

        // Verificamos que el elemento exista para eliminarlo
        if (!elementoEliminado) {
            return NextResponse.json({ message: 'Elemento no encontrado' }, { status: 404 })
        }

        // Retornamos el mensaje de éxito
        return NextResponse.json({ message: 'Elemento eliminado correctamente' })
    } catch (error) {
        console.error('Error al eliminar elemento:', error)
        return NextResponse.json({ message: 'Error al eliminar el elemento' }, { status: 500 })
    }
}
