import Usuario from '@/models/Usuario'
import { NextResponse }  from 'next/server'
import connectDB from '@/utils/DBconection'

export async function GET() {
    connectDB()
    const usuarios = await Usuario.find()
    return NextResponse.json({ usuarios })
}


export async function POST(request) {
    try {
        connectDB()
        const data = await request.json()

        
        console.log('data:', data)

    } catch (error) {
        console.log('Error al guardar el usuario:', error.message)
        return NextResponse.json({ message: 'error al guardar el usuario', error: error.message })
    }
    
}
