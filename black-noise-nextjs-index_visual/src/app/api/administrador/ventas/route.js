import Venta from '@/models/Venta'
import { NextResponse } from 'next/server'
import connectDB from '@/utils/DBconection'

export async function GET(request) {
    try {
        connectDB()
        const ventas = await Venta.find()
        return NextResponse.json({ ventas })
    } catch (error) {
        console.error('Error al obtener ventas:', error)
        return NextResponse.json({ message: 'Error al obtener ventas' }, { status: 500 })
    }
}

export async function POST(request) {
    try {
        connectDB()
        const data = await request.json()
        const nuevaVenta = new Venta(data)
        const ventaGuardada = await nuevaVenta.save()
        return NextResponse.json(ventaGuardada, { status: 201 })
    } catch (error) {
        console.error('Error al crear venta:', error)
        return NextResponse.json({ message: 'Error al crear venta' }, { status: 500 })
    }
}
