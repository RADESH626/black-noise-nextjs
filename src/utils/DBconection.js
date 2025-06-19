//este archivo contiene la conexion a la base de datos 

import mongoose from 'mongoose';
import logger from './logger';
import '@/models'; // Import all models to ensure they are registered

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://Emanuel:Emanuelgalvis123@clusteremanuelgalvis.djph7.mongodb.net/BlackNoise?retryWrites=true&w=majority&appName=ClusterEmanuelGalvis";

if (!mongoose.connection.readyState) {
    mongoose.set('strictQuery', false);
}

export default async function connectDB() {
    try {
        if (mongoose.connection.readyState) {
            // logger.info('Using existing database connection');
            return;
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
