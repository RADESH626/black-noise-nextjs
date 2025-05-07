import Elemento from '@/models/Elemento'
import { NextResponse } from 'next/server'
import connectDB from '@/utils/DBconection'

export async function GET(request) {
    try {
        connectDB()
        const elementos = await Elemento.find()
        return NextResponse.json({ elementos })
    } catch (error) {
        console.error('Error al obtener elementos:', error)
        return NextResponse.json({ message: 'Error al obtener elementos' }, { status: 500 })
    }
}

export async function POST(request) {
    try {
        connectDB()
        const data = await request.json()
        const nuevoElemento = new Elemento(data)
        const elementoGuardado = await nuevoElemento.save()
        return NextResponse.json(elementoGuardado, { status: 201 })
    } catch (error) {
        console.error('Error al crear elemento:', error)
        return NextResponse.json({ message: 'Error al crear elemento' }, { status: 500 })
    }
}
