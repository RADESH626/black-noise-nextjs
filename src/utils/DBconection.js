//este archivo contiene la conexion a la base de datos 

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://Emanuel:Emanuelgalvis123@clusteremanuelgalvis.djph7.mongodb.net/BlackNoise?retryWrites=true&w=majority&appName=ClusterEmanuelGalvis";

if (!mongoose.connection.readyState) {
    mongoose.set('strictQuery', false);
}

export default async function connectDB() {
    try {
        if (mongoose.connection.readyState) {
            console.log('Using existing database connection');
            return;
        }

        const db = await mongoose.connect(MONGODB_URI, {
        });

        console.log('Database connected successfully');
        return db;
    } catch (error) {
        console.error('Error connecting to database:', error);
        // Don't exit the process, let the error handling cascade up
        throw error;
    }
}
