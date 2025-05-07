import { NextResponse }  from 'next/server'
import connectDB from '@/utils/DBconection'

export function GET() {
    try {       
        connectDB();
        return NextResponse.json({message: 'pagina principal'});    
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);        
        return NextResponse.json({error: 'Error de conexión a la base de datos' }, {status: 500});
    }
}
