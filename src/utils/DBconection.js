//este archivo contiene la conexion a la base de datos 

import mongoose from 'mongoose';
import logger from './logger';
import '@/models'; // Import all models to ensure they are registered

<<<<<<< HEAD
const MONGODB_URI = process.env.MONGODB_URI;
=======
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://Emanuel:Emanuelgalvis123@clusteremanuelgalvis.djph7.mongodb.net/BlackNoise?retryWrites=true&w=majority&appName=ClusterEmanuelGalvis";
>>>>>>> db35ad5 (diseños login y registro)

if (!mongoose.connection.readyState) {
    mongoose.set('strictQuery', false);
}

export default async function connectDB() {
    try {
<<<<<<< HEAD
        if (mongoose.connection.readyState === 1) {
=======
        if (mongoose.connection.readyState) {
>>>>>>> db35ad5 (diseños login y registro)
            // logger.info('Using existing database connection');
            return;
        }

<<<<<<< HEAD
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

=======
>>>>>>> db35ad5 (diseños login y registro)
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
