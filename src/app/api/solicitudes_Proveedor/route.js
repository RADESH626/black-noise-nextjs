import SolicitudProveedor from '@/models/SolicitudProveedor'
import { NextResponse } from 'next/server'
import connectDB from '@/utils/DBconection'

export async function GET(request) {
    try {
        connectDB()
        const solicitudes = await SolicitudProveedor.find()
        return NextResponse.json({ solicitudes })
    } catch (error) {
        console.error('Error al obtener solicitudes de proveedor:', error)
        return NextResponse.json({ message: 'Error al obtener solicitudes de proveedor' }, { status: 500 })
    }
}

export async function POST(request) {
    try {
        connectDB()
        const data = await request.json()
        const nuevaSolicitud = new SolicitudProveedor(data)
        const solicitudGuardada = await nuevaSolicitud.save()
        return NextResponse.json(solicitudGuardada, { status: 201 })
    } catch (error) {
        console.error('Error al crear solicitud de proveedor:', error)
        return NextResponse.json({ message: 'Error al crear solicitud de proveedor' }, { status: 500 })
    }
}