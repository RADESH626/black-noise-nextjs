import Proveedor from '@/models/Proveedor'
import { NextResponse } from 'next/server'
import connectDB from '@/utils/DBconection'

export async function GET(request) {
    try {
        connectDB()
        const proveedores = await Proveedor.find()
        return NextResponse.json({ proveedores })
    } catch (error) {
        console.error('Error al obtener proveedores:', error)
        return NextResponse.json({ message: 'Error al obtener proveedores' }, { status: 500 })
    }
}

export async function POST(request) {
    try {
        connectDB()
        const data = await request.json()
        const nuevoProveedor = new Proveedor(data)
        const proveedorGuardado = await nuevoProveedor.save()
        return NextResponse.json(proveedorGuardado, { status: 201 })
    } catch (error) {
        console.error('Error al crear proveedor:', error)
        return NextResponse.json({ message: 'Error al crear proveedor' }, { status: 500 })
    }
}