//este archivo contiene la conexion a la base de datos 

//este import es para importar una libreria que nos permite conectarnos de una forma mas facil a mongo db 
import { connect, Connection } from 'mongoose'

//esta constante sera la variable que guardara el estado de la conecion (que inicialmente es false)
const conn = {
    isConnected: false
}

//al llamar esta funcion se establece la conexion a la base de datos
export default async function connectDB() {
    if (conn.isConnected) return;
    const db = await connect("mongodb://localhost:27017/BlackNoise");
    conn.isConnected = db.connections[0].readyState;
   console.log("Estado de la conexión a la base de datos:", conn.isConnected);
}


