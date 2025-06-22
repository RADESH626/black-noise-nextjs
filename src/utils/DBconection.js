//este archivo contiene la conexion a la base de datos 

import mongoose from 'mongoose';
import logger from './logger';
import '@/models/Cart'; // Import the Cart model explicitly
import '@/models/Design'; // Import the Design model explicitly
import '@/models/Pago'; // Import the Pago model explicitly
import getPedidoModel from '@/models/Pedido'; // Import the Pedido model explicitly
import '@/models/Proveedor'; // Import the Proveedor model explicitly
import '@/models/Usuario'; // Import the Usuario model explicitly
import '@/models/Venta'; // Import the Venta model explicitly
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

        await getPedidoModel();

        logger.info('Database connected successfully');
        return { mongoose: mongoose };
    } catch (error) {
        logger.error('Error connecting to database:', error);
        // Don't exit the process, let the error handling cascade up
        throw error;
    }
}
