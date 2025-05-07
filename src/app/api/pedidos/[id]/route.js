import connectDB from '@/utils/DBconection'
import { NextResponse } from 'next/server'
import Pedido from '@/models/Pedido'

export async function GET(request, { params }) {
    try {
        // Conectamos a la base de datos
        connectDB()

        // Obtenemos el pedido por id específico
        const pedidoEncontrado = await Pedido.findById(params.id)

        // Verificamos que hayamos encontrado el pedido
        if (!pedidoEncontrado) {
            return NextResponse.json({ message: 'Pedido no encontrado' }, { status: 404 })
        }

        // Retornamos el pedido encontrado
        return NextResponse.json(pedidoEncontrado)
    } catch (error) {
        console.error('Error al obtener pedido:', error)
        return NextResponse.json({ message: 'Error al obtener el pedido' }, { status: 500 })
    }
}

export async function PUT(request, { params }) {
    try {
        // Conectamos a la base de datos
        connectDB()

        // Obtenemos los datos del pedido del request
        const data = await request.json()

        // Obtenemos el id del pedido de los params
        const id = params.id

        // Guardamos los valores del pedido actualizado para retornarlos
        const pedidoActualizado = await Pedido.findByIdAndUpdate(id, data, { new: true })

        if (!pedidoActualizado) {
            return NextResponse.json({ message: 'Pedido no encontrado' }, { status: 404 })
        }

        return NextResponse.json(pedidoActualizado)
    } catch (error) {
        console.error('Error al actualizar pedido:', error)
        return NextResponse.json({ message: 'Error al actualizar el pedido' }, { status: 500 })
    }
}

export async function DELETE(request, { params }) {
    try {
        // Conectamos a la base de datos
        connectDB()

        // Obtenemos el id del pedido de los params
        const id = params.id

        // Guardamos los valores del pedido eliminado para retornarlos
        const pedidoEliminado = await Pedido.findByIdAndDelete(id)

        // Verificamos que el pedido exista para eliminarlo
        if (!pedidoEliminado) {
            return NextResponse.json({ message: 'Pedido no encontrado' }, { status: 404 })
        }

        // Retornamos el mensaje de éxito
        return NextResponse.json({ message: 'Pedido eliminado correctamente' })
    } catch (error) {
        console.error('Error al eliminar pedido:', error)
        return NextResponse.json({ message: 'Error al eliminar el pedido' }, { status: 500 })
    }
}
