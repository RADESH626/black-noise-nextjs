import connectDB from '@/utils/DBconection'
import { NextResponse } from 'next/server'
import Venta from '@/models/Venta'

export async function GET(request, { params }) {
    try {
        // Conectamos a la base de datos
        connectDB()

        // Obtenemos la venta por id específico
        const ventaEncontrada = await Venta.findById(params.id)

        // Verificamos que hayamos encontrado la venta
        if (!ventaEncontrada) {
            return NextResponse.json({ message: 'Venta no encontrada' }, { status: 404 })
        }

        // Retornamos la venta encontrada
        return NextResponse.json(ventaEncontrada)
    } catch (error) {
        console.error('Error al obtener venta:', error)
        return NextResponse.json({ message: 'Error al obtener la venta' }, { status: 500 })
    }
}

export async function PUT(request, { params }) {
    try {
        // Conectamos a la base de datos
        connectDB()

        // Obtenemos los datos de la venta del request
        const data = await request.json()

        // Obtenemos el id de la venta de los params
        const id = params.id

        // Guardamos los valores de la venta actualizada para retornarlos
        const ventaActualizada = await Venta.findByIdAndUpdate(id, data, { new: true })

        if (!ventaActualizada) {
            return NextResponse.json({ message: 'Venta no encontrada' }, { status: 404 })
        }

        return NextResponse.json(ventaActualizada)
    } catch (error) {
        console.error('Error al actualizar venta:', error)
        return NextResponse.json({ message: 'Error al actualizar la venta' }, { status: 500 })
    }
}

export async function DELETE(request, { params }) {
    try {
        // Conectamos a la base de datos
        connectDB()

        // Obtenemos el id de la venta de los params
        const id = params.id

        // Guardamos los valores de la venta eliminada para retornarlos
        const ventaEliminada = await Venta.findByIdAndDelete(id)

        // Verificamos que la venta exista para eliminarla
        if (!ventaEliminada) {
            return NextResponse.json({ message: 'Venta no encontrada' }, { status: 404 })
        }

        // Retornamos el mensaje de éxito
        return NextResponse.json({ message: 'Venta eliminada correctamente' })
    } catch (error) {
        console.error('Error al eliminar venta:', error)
        return NextResponse.json({ message: 'Error al eliminar la venta' }, { status: 500 })
    }
}
