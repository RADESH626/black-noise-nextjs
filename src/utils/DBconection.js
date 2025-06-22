//este archivo contiene la conexion a la base de datos 

import mongoose from 'mongoose';
import logger from './logger';

console.log('Mongoose object:', mongoose); // Añadir para depuración
import { getCartModel, getDesignModel, getPagoModel, getPedidoModel, getProveedorModel, getUsuarioModel, getVentaModel } from '@/models';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    logger.info('Using existing database connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      strictQuery: false, // Asegurarse de que strictQuery esté aquí
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then(m => {
      logger.info('Database connected successfully');
      return m;
    }).catch(error => {
      logger.error('Error connecting to database:', error);
      cached.promise = null; // Reset promise on error
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  // Ensure all models are loaded and registered after connection
  await getCartModel();
  await getDesignModel();
  await getPagoModel();
  await getPedidoModel();
  await getProveedorModel();
  await getUsuarioModel();
  await getVentaModel();

  return cached.conn;
}

export default connectDB;
