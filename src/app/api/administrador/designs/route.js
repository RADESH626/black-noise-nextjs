import Design from '@/models/Design'
import { NextResponse } from 'next/server'
import connectDB from '@/utils/DBconection'

export async function GET(request) {
    try {
        connectDB()
        const designs = await Design.find()
        return NextResponse.json({ designs })
    } catch (error) {
        console.error('Error al obtener diseños:', error)
        return NextResponse.json({ message: 'Error al obtener diseños' }, { status: 500 })
    }
}

export async function POST(request) {
    try {
        connectDB()
        const data = await request.json()
        const nuevoDesign = new Design(data)
        const designGuardado = await nuevoDesign.save()
        return NextResponse.json(designGuardado, { status: 201 })
    } catch (error) {
        console.error('Error al crear diseño:', error)
        return NextResponse.json({ message: 'Error al crear diseño' }, { status: 500 })
    }
}
