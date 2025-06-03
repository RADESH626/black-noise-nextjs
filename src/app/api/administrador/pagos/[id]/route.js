import connectDB from '@/utils/DBconection'
import { NextResponse } from 'next/server'
import Pago from '@/models/Pago'

export async function GET(request, { params }) {
    try {
        // Conectamos a la base de datos
        connectDB()

        // Obtenemos el pago por id específico
        const pagoEncontrado = await Pago.findById(params.id)

        // Verificamos que hayamos encontrado el pago
        if (!pagoEncontrado) {
            return NextResponse.json({ message: 'Pago no encontrado' }, { status: 404 })
        }

        // Retornamos el pago encontrado
        return NextResponse.json(pagoEncontrado)
    } catch (error) {
        console.error('Error al obtener pago:', error)
        return NextResponse.json({ message: 'Error al obtener el pago' }, { status: 500 })
    }
}

export async function PUT(request, { params }) {
    try {
        // Conectamos a la base de datos
        connectDB()

        // Obtenemos los datos del pago del request
        const data = await request.json()

        // Obtenemos el id del pago de los params
        const id = params.id

        // Guardamos los valores del pago actualizado para retornarlos
        const pagoActualizado = await Pago.findByIdAndUpdate(id, data, { new: true })

        if (!pagoActualizado) {
            return NextResponse.json({ message: 'Pago no encontrado' }, { status: 404 })
        }

        return NextResponse.json(pagoActualizado)
    } catch (error) {
        console.error('Error al actualizar pago:', error)
        return NextResponse.json({ message: 'Error al actualizar el pago' }, { status: 500 })
    }
}

export async function DELETE(request, { params }) {
    try {
        // Conectamos a la base de datos
        connectDB()

        // Obtenemos el id del pago de los params
        const id = params.id

        // Guardamos los valores del pago eliminado para retornarlos
        const pagoEliminado = await Pago.findByIdAndDelete(id)

        // Verificamos que el pago exista para eliminarlo
        if (!pagoEliminado) {
            return NextResponse.json({ message: 'Pago no encontrado' }, { status: 404 })
        }

        // Retornamos el mensaje de éxito
        return NextResponse.json({ message: 'Pago eliminado correctamente' })
    } catch (error) {
        console.error('Error al eliminar pago:', error)
        return NextResponse.json({ message: 'Error al eliminar el pago' }, { status: 500 })
    }
}
