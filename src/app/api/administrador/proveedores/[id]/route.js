import connectDB from '@/utils/DBconection'
import { NextResponse } from 'next/server'
import Proveedor from '@/models/Proveedor'

export async function GET(request, { params }) {
    try {
        // Conectamos a la base de datos
        connectDB()

        // Obtenemos el proveedor por id específico
        const proveedorEncontrado = await Proveedor.findById(params.id)

        // Verificamos que hayamos encontrado el proveedor
        if (!proveedorEncontrado) {
            return NextResponse.json({ message: 'Proveedor no encontrado' }, { status: 404 })
        }

        // Retornamos el proveedor encontrado
        return NextResponse.json(proveedorEncontrado)
    } catch (error) {
        console.error('Error al obtener proveedor:', error)
        return NextResponse.json({ message: 'Error al obtener el proveedor' }, { status: 500 })
    }
}

export async function PUT(request, { params }) {
    try {
        // Conectamos a la base de datos
        connectDB()

        // Obtenemos los datos del proveedor del request
        const data = await request.json()

        // Obtenemos el id del proveedor de los params
        const id = params.id

        // Guardamos los valores del proveedor actualizado para retornarlos
        const proveedorActualizado = await Proveedor.findByIdAndUpdate(id, data, { new: true })

        if (!proveedorActualizado) {
            return NextResponse.json({ message: 'Proveedor no encontrado' }, { status: 404 })
        }

        return NextResponse.json(proveedorActualizado)
    } catch (error) {
        console.error('Error al actualizar proveedor:', error)
        return NextResponse.json({ message: 'Error al actualizar el proveedor' }, { status: 500 })
    }
}

export async function DELETE(request, { params }) {
    try {
        // Conectamos a la base de datos
        connectDB()

        // Obtenemos el id del proveedor de los params
        const id = params.id

        // Guardamos los valores del proveedor eliminado para retornarlos
        const proveedorEliminado = await Proveedor.findByIdAndDelete(id)

        // Verificamos que el proveedor exista para eliminarlo
        if (!proveedorEliminado) {
            return NextResponse.json({ message: 'Proveedor no encontrado' }, { status: 404 })
        }

        // Retornamos el mensaje de éxito
        return NextResponse.json({ message: 'Proveedor eliminado correctamente' })
    } catch (error) {
        console.error('Error al eliminar proveedor:', error)
        return NextResponse.json({ message: 'Error al eliminar el proveedor' }, { status: 500 })
    }
}