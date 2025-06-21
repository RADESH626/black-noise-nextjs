//este archivo contiene la conexion a la base de datos 

import mongoose from 'mongoose';
import logger from './logger';
import '@/models'; // Import all models to ensure they are registered

const MONGODB_URI = process.env.MONGODB_URI;

if (!mongoose.connection.readyState) {
    mongoose.set('strictQuery', false);
}

export default async function connectDB() {
    try {
        if (mongoose.connection.readyState === 1) {
            // logger.info('Using existing database connection');
            return;
        }

        if (mongoose.connection.readyState === 2) {
            logger.warn('Database is connecting...');
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait a bit
            return;
        }

        if (mongoose.connection.readyState === 0) {
            logger.warn('Database is disconnected, attempting to reconnect...');
        } else {
            logger.warn(`Database state is ${mongoose.connection.readyState}, attempting to reconnect...`);
        }

        const db = await mongoose.connect(MONGODB_URI, {
        });

        logger.info('Database connected successfully');
        return db;
    } catch (error) {
        logger.error('Error connecting to database:', error);
        // Don't exit the process, let the error handling cascade up
        throw error;
    }
}
