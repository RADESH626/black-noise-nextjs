import Pedido from '@/models/Pedido'
import { NextResponse } from 'next/server'
import connectDB from '@/utils/DBconection'

export async function GET(request) {
    try {
        connectDB()
        const pedidos = await Pedido.find()
        return NextResponse.json({ pedidos })
    } catch (error) {
        console.error('Error al obtener pedidos:', error)
        return NextResponse.json({ message: 'Error al obtener pedidos' }, { status: 500 })
    }
}

export async function POST(request) {
    try {
        connectDB()
        const data = await request.json()
        const nuevoPedido = new Pedido(data)
        const pedidoGuardado = await nuevoPedido.save()
        return NextResponse.json(pedidoGuardado, { status: 201 })
    } catch (error) {
        console.error('Error al crear pedido:', error)
        return NextResponse.json({ message: 'Error al crear pedido' }, { status: 500 })
    }
}