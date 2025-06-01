import Pago from '@/models/Pago'
import { NextResponse } from 'next/server'
import connectDB from '@/utils/DBconection'

export async function GET(request) {
    try {
        connectDB()
        const pagos = await Pago.find()
        return NextResponse.json({ pagos })
    } catch (error) {
        console.error('Error al obtener pagos:', error)
        return NextResponse.json({ message: 'Error al obtener pagos' }, { status: 500 })
    }
}

export async function POST(request) {
    try {
        connectDB()
        const data = await request.json()
        const nuevoPago = new Pago(data)
        const pagoGuardado = await nuevoPago.save()
        return NextResponse.json(pagoGuardado, { status: 201 })
    } catch (error) {
        console.error('Error al crear pago:', error)
        return NextResponse.json({ message: 'Error al crear pago' }, { status: 500 })
    }
}
