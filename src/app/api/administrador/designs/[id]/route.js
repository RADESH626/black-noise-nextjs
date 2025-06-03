import connectDB from '@/utils/DBconection'
import { NextResponse } from 'next/server'
import Design from '@/models/Design'

export async function GET(request, { params }) {
    try {
        // Conectamos a la base de datos
        connectDB()

        // Obtenemos el diseño por id específico
        const designEncontrado = await Design.findById(params.id)

        // Verificamos que hayamos encontrado el diseño
        if (!designEncontrado) {
            return NextResponse.json({ message: 'Diseño no encontrado' }, { status: 404 })
        }

        // Retornamos el diseño encontrado
        return NextResponse.json(designEncontrado)
    } catch (error) {
        console.error('Error al obtener diseño:', error)
        return NextResponse.json({ message: 'Error al obtener el diseño' }, { status: 500 })
    }
}

export async function PUT(request, { params }) {
    try {
        // Conectamos a la base de datos
        connectDB()

        // Obtenemos los datos del diseño del request
        const data = await request.json()

        // Obtenemos el id del diseño de los params
        const id = params.id

        // Guardamos los valores del diseño actualizado para retornarlos
        const designActualizado = await Design.findByIdAndUpdate(id, data, { new: true })

        if (!designActualizado) {
            return NextResponse.json({ message: 'Diseño no encontrado' }, { status: 404 })
        }

        return NextResponse.json(designActualizado)
    } catch (error) {
        console.error('Error al actualizar diseño:', error)
        return NextResponse.json({ message: 'Error al actualizar el diseño' }, { status: 500 })
    }
}

export async function DELETE(request, { params }) {
    try {
        // Conectamos a la base de datos
        connectDB()

        // Obtenemos el id del diseño de los params
        const id = params.id

        // Guardamos los valores del diseño eliminado para retornarlos
        const designEliminado = await Design.findByIdAndDelete(id)

        // Verificamos que el diseño exista para eliminarlo
        if (!designEliminado) {
            return NextResponse.json({ message: 'Diseño no encontrado' }, { status: 404 })
        }

        // Retornamos el mensaje de éxito
        return NextResponse.json({ message: 'Diseño eliminado correctamente' })
    } catch (error) {
        console.error('Error al eliminar diseño:', error)
        return NextResponse.json({ message: 'Error al eliminar el diseño' }, { status: 500 })
    }
}
