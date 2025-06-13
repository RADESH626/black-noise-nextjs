// src/utils/modelLoader.js
import mongoose from 'mongoose';
import connectDB from './DBconection';
import '../models'; // Asegura que todos los modelos se registren al importar este archivo

export async function getModel(modelName) {
    await connectDB(); // Asegura que la base de datos esté conectada
    if (mongoose.models[modelName]) {
        return mongoose.models[modelName];
    }
    // Si el modelo no está en mongoose.models, intenta obtenerlo.
    // Esto podría lanzar MissingSchemaError si el esquema no se registró correctamente.
    return mongoose.model(modelName);
}
