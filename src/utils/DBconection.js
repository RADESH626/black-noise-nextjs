//este archivo contiene la conexion a la base de datos 

import mongoose from 'mongoose';
import logger from './logger';
import { loadModels } from './modelLoader'; // Importar loadModels

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
    cached.promise = mongoose.connect(MONGODB_URI, {}).then(async m => { // Add async here
      // logger.info('Database connected successfully');
      await loadModels(); // Ensure all models are loaded and registered after connection
      return m;
    }).catch(error => {
      logger.error('Error connecting to database:', error);
      cached.promise = null; // Reset promise on error
      throw error;
    });
  }

  cached.conn = await cached.promise;

  // Ensure all models are loaded and registered after connection
  return cached.conn;
}
