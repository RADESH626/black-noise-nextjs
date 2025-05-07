import connectDB from '@/utils/DBconection'
import { NextResponse } from 'next/server'
import SolicitudProveedor from '@/models/SolicitudProveedor'

export async function GET(request, { params }) {
    try {
        // Conectamos a la base de datos
        connectDB()

        // Obtenemos la solicitud por id específico
        const solicitudEncontrada = await SolicitudProveedor.findById(params.id)

        // Verificamos que hayamos encontrado la solicitud
        if (!solicitudEncontrada) {
            return NextResponse.json({ message: 'Solicitud de proveedor no encontrada' }, { status: 404 })
        }

        // Retornamos la solicitud encontrada
        return NextResponse.json(solicitudEncontrada)
    } catch (error) {
        console.error('Error al obtener solicitud de proveedor:', error)
        return NextResponse.json({ message: 'Error al obtener la solicitud de proveedor' }, { status: 500 })
    }
}

export async function PUT(request, { params }) {
    try {
        // Conectamos a la base de datos
        connectDB()

        // Obtenemos los datos de la solicitud del request
        const data = await request.json()

        // Obtenemos el id de la solicitud de los params
        const id = params.id

        // Guardamos los valores de la solicitud actualizada para retornarlos
        const solicitudActualizada = await SolicitudProveedor.findByIdAndUpdate(id, data, { new: true })

        if (!solicitudActualizada) {
            return NextResponse.json({ message: 'Solicitud de proveedor no encontrada' }, { status: 404 })
        }

        return NextResponse.json(solicitudActualizada)
    } catch (error) {
        console.error('Error al actualizar solicitud de proveedor:', error)
        return NextResponse.json({ message: 'Error al actualizar la solicitud de proveedor' }, { status: 500 })
    }
}

export async function DELETE(request, { params }) {
    try {
        // Conectamos a la base de datos
        connectDB()

        // Obtenemos el id de la solicitud de los params
        const id = params.id

        // Guardamos los valores de la solicitud eliminada para retornarlos
        const solicitudEliminada = await SolicitudProveedor.findByIdAndDelete(id)

        // Verificamos que la solicitud exista para eliminarla
        if (!solicitudEliminada) {
            return NextResponse.json({ message: 'Solicitud de proveedor no encontrada' }, { status: 404 })
        }

        // Retornamos el mensaje de éxito
        return NextResponse.json({ message: 'Solicitud de proveedor eliminada correctamente' })
    } catch (error) {
        console.error('Error al eliminar solicitud de proveedor:', error)
        return NextResponse.json({ message: 'Error al eliminar la solicitud de proveedor' }, { status: 500 })
    }
}