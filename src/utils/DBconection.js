//este archivo contiene la conexion a la base de datos 

import mongoose from 'mongoose';
import logger from './logger';
import { getCartModel, getDesignModel, getPagoModel, getPedidoModel, getProveedorModel, getUsuarioModel, getVentaModel } from '@/models';

const MONGODB_URI = process.env.MONGODB_URI;

// Cache the connection to avoid multiple connections in development
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function connectDB() {
  if (cached.conn) {
    // logger.info('Using existing database connection');
    return cached.conn;
  }

  if (!cached.promise) {
    mongoose.set('strictQuery', false); // Mover aquí
    cached.promise = mongoose.connect(MONGODB_URI, {}).then(m => {
      logger.info('Database connected successfully');
      return m;
    }).catch(error => {
      logger.error('Error connecting to database:', error);
      cached.promise = null; // Reset promise on error
      throw error;
    });
  }

  cached.conn = await cached.promise;

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
